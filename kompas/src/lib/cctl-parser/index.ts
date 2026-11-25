import type { CCTLExam, CCTLQuestion, CCTLQuestionType, CCTLStudentStatus } from '@/types/cctl';
import { extractVisualLines } from './spatial';
import { extractExamHeaderMeta, detectPromoAndDomain, isScaleLine } from './metadata';
import { detectSectionsAndBoundaries, QUESTION_HEADER } from './sections';
import { separatePromptAndCode } from './code-detector';
import { CHOICE_ROW, parseChoiceQuestion } from './parsers/choice-parser';
import { parseMatchingQuestion } from './parsers/matching-parser';
import { parseNumericalQuestion } from './parsers/numerical-parser';
import { parseOpenQuestion } from './parsers/open-parser';
import { PageImages } from './page-images';
import type { VisualLine } from './types';

export * from './types';
export * from './metadata';
export * from './spatial';
export * from './sections';
export * from './code-detector';

const PAGE_NUMBER = /^\d+\s*\/\s*\d+$/;
const STATUS = /^(?:Réponses?\s+(?:correctes?|partiellement correctes?|incorrectes?)\b|Aucune réponse saisie\b|Pas encore corrigée\b)/i;
const QUESTION_COMMENT = /^(?:\uf075\s*)?Commentaire de correction de la question$/i;

function getQuestionType(label: string): CCTLQuestionType {
    if (/valeurs?\s+numériques?/i.test(label)) return 'numerical';
    if (/ouverte|courte/i.test(label)) return 'short_answer';
    if (/réponses?\s+multiples?/i.test(label)) return 'multiple_choice';
    if (/association|apparier|relier|paires?/i.test(label)) return 'matching';
    if (/zone|image|schéma/i.test(label)) return 'image_matching';
    if (/texte à trous/i.test(label)) return 'fill_blank';
    if (/ordonnancement/i.test(label)) return 'ordering';
    if (/vrai\s*\/\s*faux/i.test(label)) return 'true_false';
    return 'single_choice';
}

function getStatus(text: string): CCTLStudentStatus {
    if (/^Réponses?\s+correctes?\b/i.test(text)) return 'correct';
    if (/^Réponses?\s+partiellement/i.test(text)) return 'partially_correct';
    if (/^Réponses?\s+incorrectes?\b/i.test(text)) return 'incorrect';
    if (/^Aucune réponse saisie/i.test(text)) return 'unanswered';
    return 'unknown';
}

function endOfPage(line: VisualLine): VisualLine {
    return { page: line.page, y: 9, fullText: '', items: [] };
}

export async function parseCCTLPdf(
    pdfBuffer: Uint8Array,
    fileName: string,
    fileSizeInput?: number
): Promise<CCTLExam> {
    const { lines, numPages, layouts, pdf } = await extractVisualLines(pdfBuffer, true);
    try {
        const images = new PageImages(pdf, layouts);
        const { studentName, evaluationStandard, evaluationWeighted, rawTitle } = extractExamHeaderMeta(lines);
        const { detectedSections, questionStarts } = detectSectionsAndBoundaries(lines);
        const questions: CCTLQuestion[] = [];
        const typeCounts: Record<CCTLQuestionType, number> = {
            single_choice: 0,
            multiple_choice: 0,
            fill_blank: 0,
            matching: 0,
            image_matching: 0,
            ordering: 0,
            true_false: 0,
            short_answer: 0,
            numerical: 0,
            code_analysis: 0
        };

        for (const [index, start] of questionStarts.entries()) {
            const nextQuestion = questionStarts[index + 1]?.lineIndex ?? lines.length;
            const nextSection = detectedSections.find(sec => sec.startLineIndex > start.lineIndex)?.startLineIndex ?? lines.length;
            const end = Math.min(nextQuestion, nextSection);
            const questionLines = lines.slice(start.lineIndex, end).filter(l => !PAGE_NUMBER.test(l.fullText));
            const header = questionLines[0];
            const hasWrappedType = /^multiples?$/i.test(questionLines[1]?.fullText ?? '');
            const body = questionLines.slice(hasWrappedType ? 2 : 1);
            const typeLabel = (header.fullText.replace(QUESTION_HEADER, '').replace(/^\s*[:—-]\s*/, '').trim() +
                (hasWrappedType ? ' ' + questionLines[1].fullText : '')).trim() || 'Question à réponse unique';
            let type = getQuestionType(typeLabel);

            const statusIndex = body.findIndex(l => STATUS.test(l.fullText));
            const statusLine = body[statusIndex];
            const statusRaw = statusLine?.fullText;
            const status = getStatus(statusRaw ?? '');
            const discordanceCount = Number(statusRaw?.match(/(\d+)\s*discordances?/i)?.[1] ?? 0);
            const score = statusRaw?.match(/(-?\d+(?:[.,]\d+)?)\s+points?\s+obtenus?\s+sur\s+(\d+(?:[.,]\d+)?)/i);
            const points = score ? Number(score[1].replace(',', '.')) || 0 : undefined;
            const maxPoints = score ? Number(score[2].replace(',', '.')) : undefined;

            const isAnswerTable = (l: VisualLine) => /^(?:Réponse\s+attendue|Élément à associer)\b|^Réponse\s*$|^attendue\s+(?:Réponse\s+)?saisie/i.test(l.fullText) || CHOICE_ROW.test(l.fullText);
            const tableStart = body.findIndex((l, i) => i > statusIndex && isAnswerTable(l));
            const questionComment = body.findIndex(l => QUESTION_COMMENT.test(l.fullText));
            const promptEnd = Math.min(...[statusIndex, tableStart, questionComment, body.length].filter(i => i >= 0));
            const promptLines = body.slice(0, promptEnd);
            const lastLine = body.at(-1) ?? header;
            const limit = lines[end]?.page === lastLine.page ? lines[end] : endOfPage(lastLine);
            const promptImageUrl = await images.between(questionLines[hasWrappedType ? 1 : 0], body[promptEnd] ?? limit, promptLines);
            const fullPrompt = promptLines.map(l => l.fullText).join('\n');
            const { cleanPrompt, codeSnippet, codeLanguage } = separatePromptAndCode(fullPrompt.split('\n'));

            const answerStart = statusIndex === -1 ? promptEnd : statusIndex + 1;
            const answerLines = body.slice(answerStart, questionComment === -1 ? undefined : questionComment);
            const tableHeader = answerLines.findIndex(l => l.items.some(item => /discordante/i.test(item.text)) &&
                l.items.some(item => /attendue/i.test(item.text)) && l.items.some(item => /saisie/i.test(item.text)));
            const expectedAnswers = answerLines.findIndex(l => /^Réponses? attendues?$/i.test(l.fullText));
            if (type === 'single_choice' && !answerLines.some(l => CHOICE_ROW.test(l.fullText)) && expectedAnswers !== -1) {
                type = 'short_answer';
            }

            let answers: Pick<CCTLQuestion, 'choices' | 'matchingPairs' | 'fillBlanks'> = { choices: [] };
            if (type === 'numerical') {
                answers = await parseNumericalQuestion(answerLines, tableHeader, layouts, images);
            } else if (type === 'matching') {
                answers = await parseMatchingQuestion(answerLines, tableHeader, layouts, images);
            } else if (type === 'short_answer' || type === 'fill_blank') {
                answers = parseOpenQuestion(answerLines, expectedAnswers, status);
            } else if (type !== 'image_matching') {
                answers.choices = await parseChoiceQuestion(answerLines, layouts, images);
            }

            const explanationLines = questionComment === -1 ? [] : body.slice(questionComment + 1);
            const explanation = explanationLines.map(l => l.fullText).join('\n') || undefined;
            const explanationImageUrl = questionComment !== -1
                ? await images.between(body[questionComment], limit, explanationLines)
                : type === 'image_matching' && statusLine
                    ? await images.between(statusLine, limit, answerLines, 45, undefined, true)
                    : undefined;

            if (!fullPrompt && !promptImageUrl && !answers.choices.length && !answers.matchingPairs?.length) continue;

            typeCounts[type]++;
            const sectionTitle = start.sectionData.titleEndLineIndex !== undefined ? start.sectionTitle : undefined;
            questions.push({
                id: `q-${start.globalNumber}-${Date.now().toString(36)}`,
                number: start.globalNumber,
                sectionTitle,
                sectionQuestionNumber: start.sectionQuestionNumber,
                category: sectionTitle,
                type,
                typeLabel,
                status,
                statusRaw,
                discordanceCount,
                points,
                maxPoints,
                isCancelled: /^Annulée\b/i.test(header.fullText) || undefined,
                prompt: cleanPrompt || (codeSnippet ? '' : fullPrompt),
                codeSnippet,
                codeLanguage: codeSnippet ? codeLanguage : undefined,
                promptImageUrl,
                hasPromptFormula: Boolean(promptImageUrl) || undefined,
                ...answers,
                matchingPairs: answers.matchingPairs?.length ? answers.matchingPairs : undefined,
                fillBlanks: answers.fillBlanks?.length ? answers.fillBlanks : undefined,
                correctAnswersCount: answers.choices.filter(c => c.isExpected).length,
                explanation,
                explanationImageUrl,
                rawText: questionLines.map(l => l.fullText).join('\n')
            });
        }

        const header = lines.slice(0, 35).map(l => l.fullText).join(' ');
        const { promo, domain, cleanSubject, academicYear } = detectPromoAndDomain(rawTitle, fileName, header, studentName);
        const subject = cleanSubject || rawTitle || fileName.replace(/\.pdf$/i, '').replace(/[-_]/g, ' ');

        const sections = [];
        for (const section of detectedSections.filter(sec => sec.questionCount > 0)) {
            const firstQuestion = questionStarts.find(start => start.sectionData === section);
            const firstLine = firstQuestion ? lines[firstQuestion.lineIndex] : undefined;
            const intro = section.titleEndLineIndex === undefined || !firstQuestion ? [] :
                lines.slice(section.titleEndLineIndex + 1, firstQuestion.lineIndex);
            const lastAssessment = intro.findLastIndex(l => isScaleLine(l.fullText) || /^Note du dossier\s*:/i.test(l.fullText));
            const introStart = intro[lastAssessment] ?? (section.titleEndLineIndex === undefined ? undefined : lines[section.titleEndLineIndex]);
            const introImageUrl = introStart && firstLine ? await images.between(introStart, firstLine,
                intro.slice(lastAssessment + 1).filter(l => !PAGE_NUMBER.test(l.fullText)), 37) : undefined;
            sections.push({
                id: section.id,
                title: section.title,
                introText: section.introText || undefined,
                introImageUrl,
                codeSnippet: section.codeSnippet || undefined,
                codeLanguage: section.codeLanguage,
                questionCount: questions.filter(q => section.title === q.sectionTitle).length || section.questionCount
            });
        }

        return {
            id: `exam-${Date.now().toString(36)}`,
            title: `${subject} (${promo} - ${academicYear})`,
            studentName,
            evaluationStandard,
            evaluationWeighted,
            promo,
            domain,
            subject,
            year: academicYear,
            sections: sections.length > 1 || sections.some(s => s.introText || s.introImageUrl) ? sections : undefined,
            totalQuestions: questions.length,
            questions,
            stats: {
                correctCount: questions.filter(q => q.status === 'correct').length,
                partialCount: questions.filter(q => q.status === 'partially_correct').length,
                incorrectCount: questions.filter(q => q.status === 'incorrect').length,
                totalDiscordances: questions.reduce((sum, q) => sum + q.discordanceCount, 0),
                typeCounts
            },
            metadata: {
                fileName,
                fileSize: fileSizeInput ?? pdfBuffer.byteLength,
                totalPages: numPages,
                parsedAt: new Date().toISOString(),
                source: 'pdf_export'
            }
        };
    } finally {
        await pdf.loadingTask.destroy();
    }
}
