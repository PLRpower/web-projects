import { CCTLExam } from '@/types/cctl';

export interface GenerateBadgesResult {
    badges: string[];
    error?: string;
}

/**
 * AI Badge Generator for single or batch CCTLs via Google Gemini.
 * When multiple CCTLs are provided, batches them into ONE SINGLE PROMPT to minimize token usage and quota consumption (avoiding 429 errors).
 * Strictly AI-determined badges: returns empty array [] on failure without any fake or manual placeholders.
 */
export async function generateCCTLBadges(exam: Partial<CCTLExam>): Promise<GenerateBadgesResult> {
    const batchResult = await generateBatchCCTLBadges([exam]);
    return batchResult[0] || { badges: [], error: 'Échec de génération des badges' };
}

export async function generateBatchCCTLBadges(
    exams: Partial<CCTLExam>[]
): Promise<Record<number, GenerateBadgesResult>> {
    const results: Record<number, GenerateBadgesResult> = {};
    if (!exams || exams.length === 0) return results;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        exams.forEach((_, idx) => {
            results[idx] = {
                badges: [],
                error: 'Clé GEMINI_API_KEY absente de la configuration (.env)'
            };
        });
        return results;
    }

    // Build ultra-compact token-optimized summary for all exams
    const examsSummary = exams.map((exam, idx) => {
        const sampleQs = (exam.questions || []).slice(0, 3).map((q, qIdx) => {
            const snippet = q.codeSnippet ? ' [Code]' : '';
            return `  - Q${qIdx + 1}: ${q.prompt.slice(0, 60)}${snippet}`;
        }).join('\n');
        return `[Exam ${idx}]: Sujet: "${(exam.subject || exam.title || '').slice(0, 60)}" | Promo: ${exam.promo || 'A3'} | Diff: ${exam.difficulty || 'Standard'}
Échantillon :
${sampleQs || '  (Aucune question textuelle)'}`;
    }).join('\n\n');

    const prompt = `Tu es l'IA académique de Kompas CESI. Pour chaque examen listé ci-dessous (identifié par son numéro [Exam X]), génère exactement 2 ou 3 badges ultra-pertinents, spécifiques et représentatifs (maximum 22 caractères par badge).
Chaque badge doit débuter par un emoji représentatif d'une notion clé, technologie ou domaine (ex: "🐳 Docker & Traefik", "🔐 Hachage & Bcrypt", "📐 RDM & Flexion", "☕ POO & Héritage", "⚡ Algorithmique", "🧠 Niveau Avancé").
Réponds STRICTEMENT avec un objet JSON où chaque clé est le numéro de l'examen ("0", "1", "2"...) et la valeur est le tableau des badges.
Exemple:
{
  "0": ["🌐 Architecture Web", "🔐 Sécurité JWT", "🧠 Niveau Avancé"]
}`;

    const candidateModels = [
        process.env.GEMINI_MODEL,
        'gemini-3.6-flash',
        'gemini-3.7-flash',
        'gemini-flash-latest',
        'gemini-3.5-flash',
        'gemini-3.1-pro-preview'
    ].filter(Boolean) as string[];

    let lastError = '';

    for (const model of candidateModels) {
        try {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
            const body = {
                contents: [
                    {
                        role: 'user',
                        parts: [{ text: `${prompt}\n\nDonnées des examens :\n${examsSummary}` }]
                    }
                ],
                generationConfig: {
                    temperature: 0.2,
                    maxOutputTokens: 2048,
                    responseMimeType: 'application/json'
                }
            };

            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
                signal: AbortSignal.timeout(20000)
            });

            if (!res.ok) {
                const errorText = await res.text().catch(() => '');
                let errMsg = `HTTP ${res.status}`;
                try {
                    const parsedErr = JSON.parse(errorText);
                    if (parsedErr.error?.message) {
                        errMsg = `${res.status} (${parsedErr.error.message.slice(0, 80)})`;
                    }
                } catch {}
                lastError = errMsg;
                console.warn(`Gemini batch badges model ${model} failed (${res.status}):`, errMsg);
                continue;
            }

            const data = await res.json();
            const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
            const parsedMap = extractBatchBadgesObject(raw);

            exams.forEach((_, idx) => {
                const rawBadges = parsedMap[String(idx)] || parsedMap[idx] || [];
                const cleanBadges = Array.isArray(rawBadges)
                    ? rawBadges.filter((b): b is string => typeof b === 'string' && b.trim().length > 0).slice(0, 3)
                    : [];

                if (cleanBadges.length > 0) {
                    results[idx] = { badges: cleanBadges };
                } else {
                    results[idx] = { badges: [], error: 'Aucun badge retourné par l\'IA' };
                }
            });

            return results;
        } catch (e: any) {
            lastError = e?.message || `Erreur modèle ${model}`;
            console.warn(`Gemini batch badges model ${model} error:`, lastError);
        }
    }

    // If all models failed or quota exceeded (429), return explicit error without fake badges
    exams.forEach((_, idx) => {
        results[idx] = {
            badges: [],
            error: `Échec de l'analyse IA (${lastError})`
        };
    });

    return results;
}

function extractBatchBadgesObject(rawText: string): Record<string, string[]> {
    const trimmed = rawText.trim();

    // Direct parse
    try {
        const parsed = JSON.parse(trimmed);
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
            return parsed;
        }
    } catch {}

    // Extract inside markdown block
    const codeBlockMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
    if (codeBlockMatch) {
        try {
            const parsed = JSON.parse(codeBlockMatch[1].trim());
            if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
                return parsed;
            }
        } catch {}
    }

    // Extract outermost braces {...}
    const firstBrace = trimmed.indexOf('{');
    const lastBrace = trimmed.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace > firstBrace) {
        try {
            const parsed = JSON.parse(trimmed.slice(firstBrace, lastBrace + 1));
            if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
                return parsed;
            }
        } catch {}
    }

    return {};
}

