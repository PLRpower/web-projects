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

    const prompt = `Tu es le Coach Pédagogique IA officiel du CESI. Un élève-ingénieur te demande une explication claire et rapide sur une question de CCTL.
Informations de la question :
- Énoncé : ${question.prompt}
- Code : ${question.codeSnippet || 'Aucun'}
- Choix : ${JSON.stringify(question.choices)}
- Réponse de l'élève : ${studentAnswerText || 'Non renseignée'}
- Statut : ${isCorrect ? 'Correcte' : 'Incorrecte / Faux'}
- Corrigé officiel : ${question.explanation || ''}

Sois concis, direct, percutant et très rapide. Réponds STRICTEMENT en JSON sans markdown :
{
  "diagnosis": "1 à 2 phrases directes : pourquoi cette erreur est fréquente et quel est le piège exact.",
  "demonstration": "Raisonnement pas-à-pas concis : pourquoi la bonne réponse est formellement vraie.",
  "mnemonicTip": "Astuce mnémo CESI : 1 formule courte pour retenir le concept le jour J."
}`;

    console.log('Sending request to Gemini...');
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`;
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: {
                temperature: 0.2,
                maxOutputTokens: 800
            }
        })
    });

    console.log('Status HTTP:', res.status);
    const data = await res.json();
    console.log('Raw response:', JSON.stringify(data, null, 2));
}

testQuestion12();
