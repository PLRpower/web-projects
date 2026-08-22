import { CCTLChoice } from '@/types/cctl';
import { VisualLine } from '../types';

const ROW_START_REGEX = /^([A-Z])\s+([☑■☐])\s+([☑■☐])\s+(Oui(?:\s*\(\+\d+\))?|Non)(?:\s+(.*))?$/;
const ROW_START_REGEX_ALT = /^([A-Z])\s+([☑■☐])\s+([☑■☐])(?:\s+(.*))?$/;

/**
 * Parses single choice or multiple choice QCM tables
 */
export function parseChoiceQuestion(filteredQLines: VisualLine[], firstChoiceIdx: number): CCTLChoice[] {
    const choices: CCTLChoice[] = [];
    const tableLines = firstChoiceIdx !== -1 ? filteredQLines.slice(firstChoiceIdx) : [];
    let currentChoice: CCTLChoice | null = null;

    for (const tline of tableLines) {
        const raw = tline.fullText.trim();
        if (!raw) continue;
        if (/Réponse\s+attendue|Réponse\s+saisie|Réponse\s+discordante/i.test(raw)) continue;
        if (/^attendue\s+saisie\s+discordante$/i.test(raw)) continue;
        if (/^Réponse\s+Réponse\s+Réponse$/i.test(raw)) continue;

        const match = raw.match(ROW_START_REGEX);
        if (match) {
            if (currentChoice) choices.push(currentChoice);
            const optId = match[1];
            const expectedBox = match[2];
            const studentBox = match[3];
            const discordance = match[4];
            let text = match[5] ? match[5].trim() : '';

            // Clean up any remaining discordance noise
            if (/^(?:Non|Oui(?:\s*\(\+\d+\))?)$/i.test(text)) {
                text = '';
            }

            currentChoice = {
                id: optId,
                text: text,
                isExpected: expectedBox === '☑',
                isStudentAnswer: studentBox === '☑',
                isDiscordant: discordance.toLowerCase().startsWith('oui'),
                discordanceDetail: discordance.includes('+') ? discordance : undefined
            };
        } else {
            const altMatch = raw.match(ROW_START_REGEX_ALT);
            if (altMatch && ['☑', '■', '☐'].includes(altMatch[2])) {
                if (currentChoice) choices.push(currentChoice);
                const optId = altMatch[1];
                const expectedBox = altMatch[2];
                const studentBox = altMatch[3];
                let rest = (altMatch[4] || '').trim();
                let isDisc = false;
                let discDetail: string | undefined;

                if (/^Non(?:\s+|$)/i.test(rest)) {
                    rest = rest.replace(/^Non(?:\s+|$)/i, '').trim();
                    isDisc = false;
                } else if (/^Oui(?:\s*(\(\+\d+\)))?(?:\s+|$)/i.test(rest)) {
                    const m = rest.match(/^Oui(?:\s*(\(\+\d+\)))?(?:\s+|$)/i);
                    isDisc = true;
                    if (m && m[1]) discDetail = m[1];
                    rest = rest.replace(/^Oui(?:\s*(\(\+\d+\)))?(?:\s+|$)/i, '').trim();
                }

                if (/^(?:Non|Oui(?:\s*\(\+\d+\))?)$/i.test(rest)) {
                    rest = '';
                }

                currentChoice = {
                    id: optId,
                    text: rest,
                    isExpected: expectedBox === '☑',
                    isStudentAnswer: studentBox === '☑',
                    isDiscordant: isDisc,
                    discordanceDetail: discDetail
                };
            } else if (currentChoice) {
                // Continuation line for multi-line choice description
                if (!/^(?:Non|Oui(?:\s*\(\+\d+\))?)$/i.test(raw)) {
                    currentChoice.text += (currentChoice.text ? ' ' : '') + raw;
                }
            }
        }
    }

    if (currentChoice) {
        choices.push(currentChoice);
    }

    return choices;
}
