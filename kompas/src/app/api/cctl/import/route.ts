import { NextRequest, NextResponse } from 'next/server';
import { parseCCTLPdf } from '@/lib/cctl-parser';
import { anonymizeCCTLPdf } from '@/lib/cctl-anonymizer';
import { generateBatchCCTLBadges } from '@/lib/ai-cctl-badges';
import { CCTLExam } from '@/types/cctl';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        
        // Collect all files from 'files' or 'file' fields
        const allFiles: File[] = [];
        const filesList = formData.getAll('files') as File[];
        const singleList = formData.getAll('file') as File[];
        
        if (filesList.length > 0) {
            allFiles.push(...filesList.filter(f => f && f.name));
        } else if (singleList.length > 0) {
            allFiles.push(...singleList.filter(f => f && f.name));
        }

        if (allFiles.length === 0) {
            return NextResponse.json(
                { success: false, error: 'Aucun fichier PDF fourni dans la requête.' },
                { status: 400 }
            );
        }

        const isAnonymousParam = formData.get('isAnonymous');
        const isAnonymous = isAnonymousParam === 'true' || isAnonymousParam === '1';

        const parsedExams: CCTLExam[] = [];
        const validExamsForAI: CCTLExam[] = [];
        const fileErrors: { fileName: string; error: string; warning?: string }[] = [];
        const fileWarnings: { fileName: string; warning: string }[] = [];

        // Parse each PDF locally (CPU only, 0 token cost)
        for (const file of allFiles) {
            if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
                fileErrors.push({ fileName: file.name, error: 'Format non supporté (seul .pdf est accepté)' });
                continue;
            }

            try {
                const arrayBuffer = await file.arrayBuffer();
                let buffer: Uint8Array = new Uint8Array(arrayBuffer);
                let effectiveFileName = file.name;
                let anonymizationWarning: string | undefined;
                let pdfBase64: string | undefined;
                let wasAnonymized = false;

                // Anonymize if requested
                if (isAnonymous) {
                    const anonResult = await anonymizeCCTLPdf(buffer, file.name);
                    if (anonResult.success && anonResult.anonymizedBuffer) {
                        buffer = anonResult.anonymizedBuffer;
                        effectiveFileName = anonResult.cleanFileName || file.name;
                        pdfBase64 = Buffer.from(anonResult.anonymizedBuffer).toString('base64');
                        wasAnonymized = true;
                    } else {
                        anonymizationWarning = anonResult.error || `Impossible d'anonymiser "${file.name}" : nom et prénom non détectés au début du nom de fichier.`;
                        fileWarnings.push({ fileName: file.name, warning: anonymizationWarning });
                        pdfBase64 = Buffer.from(buffer).toString('base64');
                    }
                } else {
                    pdfBase64 = Buffer.from(buffer).toString('base64');
                }

                const exam = await parseCCTLPdf(buffer, effectiveFileName, buffer.byteLength);

                if (!exam.questions || exam.questions.length === 0) {
                    fileErrors.push({ fileName: file.name, error: 'Aucune question détectée dans ce PDF' });
                    continue;
                }

                if (wasAnonymized) {
                    exam.studentName = 'Utilisateur Anonyme';
                    exam.isAnonymous = true;
                    exam.originalFileName = file.name;
                    exam.anonymizedFileName = effectiveFileName;
                    exam.pdfBase64 = pdfBase64;
                    if (exam.metadata) {
                        exam.metadata.isAnonymous = true;
                        exam.metadata.anonymized = true;
                        exam.metadata.originalFileName = file.name;
                        exam.metadata.fileName = effectiveFileName;
                    }
                } else if (anonymizationWarning) {
                    exam.anonymizationWarning = anonymizationWarning;
                    exam.isAnonymous = false;
                    exam.pdfBase64 = pdfBase64;
                    if (exam.metadata) {
                        exam.metadata.anonymizationWarning = anonymizationWarning;
                        exam.metadata.isAnonymous = false;
                    }
                } else {
                    exam.pdfBase64 = pdfBase64;
                }

                parsedExams.push(exam);
                validExamsForAI.push(exam);
            } catch (err: any) {
                fileErrors.push({ fileName: file.name, error: err?.message || 'Erreur d\'analyse PDF' });
            }
        }

        if (parsedExams.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    error: fileErrors[0]?.error || 'Aucune question détectée dans les fichiers importés.',
                    fileErrors
                },
                { status: 422 }
            );
        }

        // Generate badges in ONE SINGLE AI PROMPT for the whole batch
        try {
            const batchBadges = await generateBatchCCTLBadges(validExamsForAI);
            validExamsForAI.forEach((exam, idx) => {
                const badgeInfo = batchBadges[idx];
                exam.aiBadges = badgeInfo?.badges || [];
                if (badgeInfo?.error) {
                    exam.aiBadgesError = badgeInfo.error;
                }
            });
        } catch (e: any) {
            validExamsForAI.forEach((exam) => {
                exam.aiBadges = [];
                exam.aiBadgesError = e?.message || 'Erreur lors de la génération des badges';
            });
        }

        // Backward-compatible response (exam for single file, exams for multiple)
        return NextResponse.json({
            success: true,
            exam: parsedExams[0],
            exams: parsedExams,
            pdfBase64: parsedExams[0]?.pdfBase64,
            fileErrors: fileErrors.length > 0 ? fileErrors : undefined,
            fileWarnings: fileWarnings.length > 0 ? fileWarnings : undefined
        });
    } catch (err: any) {
        console.error('Error importing CCTL PDF(s):', err);
        return NextResponse.json(
            {
                success: false,
                error: err?.message || 'Une erreur est survenue lors de l\'analyse du PDF.'
            },
            { status: 500 }
        );
    }
}

