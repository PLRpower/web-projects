const fs = require('fs');
const path = require('path');

async function testQuestion12() {
    const envPath = path.join(process.cwd(), '.env.local');
    const envContent = fs.readFileSync(envPath, 'utf-8');
    const match = envContent.match(/GEMINI_API_KEY=([^\r\n]+)/);
    const apiKey = match[1].trim();

    const question = {
        id: 'q12',
        prompt: "Quel Design Pattern comportemental permet à des objets abonnés d'être notifiés automatiquement de tout changement d'état intervenu sur un sujet observé ?",
        codeSnippet: "",
        choices: [
            { id: "A", text: "Singleton Pattern", isExpected: false },
            { id: "B", text: "Builder Pattern", isExpected: false },
            { id: "C", text: "Observer Pattern", isExpected: true },
            { id: "D", text: "Adapter Pattern", isExpected: false }
        ],
        explanation: "Le pattern Observer découple la source d'événements (Subject) de ses auditeurs (Observers), utilisé dans les architectures événementielles, RxJS ou les gestionnaires d'état."
    };

    const studentAnswerText = "B. Builder Pattern";
    const isCorrect = false;

    const prompt = `Tu es le Coach Pédagogique IA officiel du CESI (expert en génie logiciel et architecture). Un élève-ingénieur demande une explication détaillée sur une question de CCTL.

CONTEXTE DE LA QUESTION :
- Énoncé : ${question.prompt}
- Code / Snippet : ${question.codeSnippet || 'Aucun'}
- Choix proposés :
${question.choices.map(c => `  * ${c.id}: ${c.text} ${c.isExpected ? '(CORRECTE)' : ''}`).join('\n')}
- Réponse choisie par l'élève : ${studentAnswerText || 'Non renseignée'}
- Statut : ${isCorrect ? 'Correcte' : 'Incorrecte / Erreur'}
- Explication officielle : ${question.explanation || ''}

CONSIGNES STRICTES :
1. Sois TRÈS PRÉCIS et directement ciblé sur les concepts de la question.
2. Pour "diagnosis" : Explique précisément pourquoi le choix de l'élève ("${studentAnswerText}") est faux dans ce contexte (quelle est sa vraie fonction, ex: Builder sert à la création étape par étape) et quel piège il a évité.
3. Pour "demonstration" : Démontre étape par étape pourquoi la réponse officielle est la seule exacte avec des termes techniques précis et concrets (ex: Subject, Observers, notify(), subscribe).
4. Pour "mnemonicTip" : Donne une VRAIE astuce mnémotechnique créative, courte et directement liée au concept précis de la question (Observer).

Réponds STRICTEMENT au format JSON valide sans texte ni backticks markdown autour :
{
  "diagnosis": "...",
  "demonstration": "...",
  "mnemonicTip": "..."
}`;

    console.log('Sending request to Gemini with maxOutputTokens 4096...');
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`;
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: {
                temperature: 0.2,
                maxOutputTokens: 4096
            }
        })
    });

    console.log('Status HTTP:', res.status);
    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    console.log('Gemini Raw Text:\n', text);
    const parsed = JSON.parse(text.replace(/```json/gi, '').replace(/```/g, '').trim());
    console.log('Parsed successfully:', parsed);
}

testQuestion12();
