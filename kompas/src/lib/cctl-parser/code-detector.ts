/**
 * Separates code blocks from prompt text and detects the programming language
 */
export function separatePromptAndCode(rawPromptLines: string[]): {
    cleanPrompt: string;
    codeSnippet?: string;
    codeLanguage?: string;
} {
    const codeLines: string[] = [];
    const nonCodeLines: string[] = [];
    let inCode = false;

    for (const pline of rawPromptLines) {
        const trimmed = pline.trim();
        if (!trimmed) continue;

        const isCodeStarter =
            /^(?:#include|#define|using\s+namespace|class\s+\w+|struct\s+\w+|enum\s+\w+|template\s*<|int\s+main|void\s+\w+|int\s+\w+|public:|private:|protected:|const\s+|let\s+|var\s+|import\s+|export\s+|function\s+|app\.|res\.|req\.|console\.|SELECT\b|CREATE\s+TABLE|INSERT\s+INTO|UPDATE\s+|DELETE\s+FROM|<\?php)/i.test(trimmed);

        if (isCodeStarter) {
            inCode = true;
        }

        if (inCode) {
            codeLines.push(pline);
        } else {
            nonCodeLines.push(pline);
        }
    }

    let codeSnippet: string | undefined;
    let codeLanguage = 'javascript';
    let cleanPrompt = nonCodeLines.join('\n').trim();

    if (codeLines.length > 0) {
        codeSnippet = codeLines.join('\n');
        if (
            codeSnippet.includes('#include') ||
            codeSnippet.includes('std::') ||
            codeSnippet.includes('cout') ||
            codeSnippet.includes('cin') ||
            codeSnippet.includes('class ') ||
            codeSnippet.includes('delete ')
        ) {
            codeLanguage = 'cpp';
        } else if (
            codeSnippet.includes('SELECT') ||
            codeSnippet.includes('FROM') ||
            codeSnippet.includes('JOIN') ||
            codeSnippet.includes('CREATE TABLE')
        ) {
            codeLanguage = 'sql';
        } else if (
            codeSnippet.includes('def ') ||
            codeSnippet.includes('import numpy') ||
            codeSnippet.includes('elif ')
        ) {
            codeLanguage = 'python';
        } else if (
            codeSnippet.includes('<?php') ||
            codeSnippet.includes('$_SESSION') ||
            codeSnippet.includes('$_POST') ||
            codeSnippet.includes('$_GET')
        ) {
            codeLanguage = 'php';
        } else if (codeSnippet.includes('<') && codeSnippet.includes('/>')) {
            codeLanguage = 'tsx';
        }
    }

    return { cleanPrompt, codeSnippet, codeLanguage };
}
