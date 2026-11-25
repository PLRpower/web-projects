import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { registerHooks } from 'node:module';
import { extname } from 'node:path';
import { test } from 'node:test';

// Next resolves extensionless TypeScript imports in the app. Use the same
// parser directly in Node without starting Next or calling the badge service.
registerHooks({
    resolve(specifier, context, nextResolve) {
        const parserImport = context.parentURL?.includes('/src/lib/cctl-parser/');
        if (parserImport && specifier.startsWith('.') && !extname(specifier)) {
            return nextResolve(`${specifier}.ts`, context);
        }
        return nextResolve(specifier, context);
    }
});

const { parseCCTLPdf } = await import('../src/lib/cctl-parser/index.ts');
// Reference transcriptions come from the PDF pages via MuPDF.
const fixtures = JSON.parse(await readFile(new URL('./fixtures/cctl.json', import.meta.url), 'utf8'));
const corpus = new URL('../cctl/', import.meta.url);
const types = {
    'question à réponse unique': 'single_choice',
    'question à réponses multiples': 'multiple_choice',
    "question d'association": 'matching',
    'question à valeurs numériques': 'numerical',
    'question à réponse ouverte et courte': 'short_answer',
    'question à réponse ouverte et longue': 'short_answer',
    'question zone': 'image_matching'
};

// The PDF engines wrap lines and split styled text spans differently.
function text(value = '') {
    return value.normalize('NFKC').replace(/[\s\u00ad\u200b\u0000-\u0008]/g, '');
}

function image(value, label) {
    assert.match(value ?? '', /^data:image\/webp;base64,UklGR/, label);
}

test('every CCTL PDF has a reference', async () => {
    const files = (await readdir(corpus)).filter(name => name.endsWith('.pdf')).sort();
    assert.deepEqual(Object.keys(fixtures).sort(), files);
});

for (const [name, reference] of Object.entries(fixtures)) {
    test(name, async () => {
        const exam = await parseCCTLPdf(await readFile(new URL(name, corpus)), name);
        assert.equal(exam.metadata.totalPages, reference.totalPages);
        assert.equal(exam.totalQuestions, reference.questions.length);
        assert.equal(exam.questions.length, reference.questions.length);

        const sections = exam.sections ?? [{
            title: exam.questions[0].sectionTitle,
            questionCount: exam.totalQuestions
        }];
        assert.deepEqual(sections.map(section => ({
            title: text(section.title),
            introText: text([section.introText, section.codeSnippet].filter(Boolean).join('\n')),
            questionCount: section.questionCount
        })), reference.sections.map(section => ({
            title: text(section.title),
            introText: text(section.introText),
            questionCount: section.questionCount
        })));
        const questionSections = reference.sections.flatMap(section => Array(section.questionCount).fill(section.title));

        for (const [index, expected] of reference.questions.entries()) {
            const question = exam.questions[index];
            const label = `Question ${index + 1}`;
            assert.equal(question.number, index + 1, label);
            assert.equal(question.sectionQuestionNumber, expected.number, label);
            assert.equal(text(question.sectionTitle), text(questionSections[index]), label);
            assert.equal(Boolean(question.isCancelled), expected.cancelled, label);
            assert.equal(question.typeLabel, expected.label, label);
            assert.equal(question.type, types[expected.label.toLowerCase()], label);
            assert.equal(text(question.statusRaw), text(expected.status), `${label} · statut`);
            assert.equal(text([question.prompt, question.codeSnippet].filter(Boolean).join('\n')),
                text(expected.prompt), `${label} · énoncé`);
            assert.equal(text(question.explanation), text(expected.explanation), `${label} · correction`);
            if (expected.promptImage) image(question.promptImageUrl, `${label} · visuel de l’énoncé`);
            if (expected.correctionImage) image(question.explanationImageUrl, `${label} · visuel du corrigé`);

            if (expected.choices) {
                assert.equal(question.choices.length, expected.choices.length, label);
                for (const [choiceIndex, choice] of expected.choices.entries()) {
                    const actual = question.choices[choiceIndex];
                    const { image: hasImage, ...expectedChoice } = choice;
                    assert.deepEqual({
                        id: actual.id,
                        text: text(actual.text),
                        expected: actual.isExpected,
                        student: actual.isStudentAnswer,
                        discordance: text(actual.discordanceDetail ?? (actual.isDiscordant ? 'Oui' : 'Non')),
                        explanation: text(actual.explanation)
                    }, {
                        ...expectedChoice,
                        text: text(choice.text),
                        discordance: text(choice.discordance),
                        explanation: text(choice.explanation)
                    }, `${label} · proposition ${choice.id}`);
                    if (hasImage) image(actual.imageUrl, `${label} · visuel de la proposition ${choice.id}`);
                }
            }

            if (expected.rows) {
                const rows = question.matchingPairs?.map(row => [
                    row.leftItem, row.rightExpected, row.rightStudent,
                    row.discordanceDetail ?? (row.isCorrect ? 'Non' : 'Oui')
                ]) ?? question.fillBlanks?.map((blank, i) => [
                    '', blank.expectedText, blank.studentText,
                    question.choices[i].discordanceDetail ?? (blank.isCorrect ? 'Non' : 'Oui')
                ]) ?? [];
                assert.deepEqual(rows.map(row => row.map(text)), expected.rows.map(row => row.map(text)), `${label} · réponses`);
                assert.deepEqual(rows.map((_, i) => text((question.matchingPairs ?? question.choices)[i].explanation)),
                    expected.rowExplanations.map(text), `${label} · commentaires`);
                expected.rowImages.forEach((hasImage, i) => {
                    if (hasImage) image(question.matchingPairs?.[i].leftImageUrl, `${label} · visuel de la ligne ${i + 1}`);
                });
            }

            if (expected.open) {
                const blank = question.fillBlanks?.[0];
                assert.deepEqual([text(blank?.studentText), text(blank?.expectedText)], expected.open.map(text), `${label} · réponse libre`);
            }
        }
    });
}
