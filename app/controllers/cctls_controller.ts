// import type { HttpContext } from '@adonisjs/core/http'

import {HttpContext} from "@adonisjs/core/http";
import app from '@adonisjs/core/services/app'
import path from 'path';
import cheerio from 'cheerio';
import fs from 'fs';
import CCTL from '#models/cctl'
import {DateTime} from "luxon";

export default class CctlsController {

  async render({ view, params }: HttpContext) {
    // Obtenir l'identifiant
    const cctl = await CCTL.findOrFail(params.id)

    return view.render('dashboard/cctl', {cctl: cctl});
  }

  async renderAll({ view }: HttpContext) {
    // Obtenir l'identifiant
    const cctls = await CCTL.all()

    return view.render('dashboard/cctls', {cctls: cctls});
  }

  async post({ request, response }: HttpContext) {
    const file = request.file('file');
    if(file){
      const fileName = `1.${file.extname}`;
      const filePath = app.makePath('uploads');

      await file.move(filePath, {name: fileName});
      const fileFullPath = path.join(filePath, fileName);
      const buffer = fs.readFileSync(fileFullPath);

      const $ = cheerio.load(buffer);

      // Remplacer tout les scripts Latex en ajoutant $ au début et à la fin
      $('script[type="math/tex"]').each((_index, element) => {
        $(element).html(`\\(${$(element).html()}\\)`);
      });

      let questions: {
        numeroQuestion: number;
        typeQuestion: string,
        texteQuestion: string,
        correctionQuestion: string | null,
        reponseData: {}
      } [] = [];

      $('.panel.panel-default').each((_index, element) => {  // Parcourir chaque question
        const questionNumberMatch = $(element).find('.question-heading').text().trim().match(/Question\s+(\d+)/);
        const numeroQuestion = questionNumberMatch ? Number(questionNumberMatch[1]) : 0;
        const typeQuestion = $(element).find('.question-heading').find('span').eq(1).text().trim();
        const texteQuestion = $(element).find('.theia-text-block').eq(0).text().trim();
        const correctionQuestion = $(element).find('.commentaire-bubble').find('.theia-text-block').text().trim();

        if(numeroQuestion || typeQuestion || texteQuestion || correctionQuestion) { // Si les informations de la question sont trouvées

          const questionData = {
            numeroQuestion: numeroQuestion,
            typeQuestion: typeQuestion,
            texteQuestion: texteQuestion,
            correctionQuestion: correctionQuestion,
            reponseData: {}
          };

          // Récupérer les réponses en fonction du type de question

          if(typeQuestion === 'Question à valeurs numériques') {
            const td = $(element).find('tbody').eq(1).find('td');
            const reponseAttendue = td.eq(1).text().trim();

            questionData.reponseData = {reponseAttendue: reponseAttendue};  // Ajouter la réponse à la question
          }

          else if(typeQuestion === "Question d'association") {
            const reponses = {};

            $(element).find('tbody').eq(1).find('tr').each((_index, row) => {
              const td = $(row).find('td');
              const imageSrc = td.eq(0).find('img').eq(0).attr('src');
              let elementAssocier;
              if (imageSrc) {
                const fileNameMatch = imageSrc.match(/\/([^/]+\.png)$/);
                elementAssocier = fileNameMatch && fileNameMatch.length > 1 ? fileNameMatch[1] : null;
              } else {
                elementAssocier = td.eq(0).text().trim();
              }

              // @ts-ignore
              reponses[elementAssocier] = td.eq(1).text().trim();
            });

            questionData.reponseData = reponses;  // Ajouter les réponses à la question
          }

          else {
            const reponses = {};

            $(element).find('tbody').eq(1).find('tr').each((_index, element) => {
              const reponse = $(element).find('td').eq(4).text().trim();
              // @ts-ignore
              reponses[reponse] = $(element).find('span').eq(0).hasClass('text-success');
            });

            questionData.reponseData = reponses;  // Ajouter les réponses à la question
          }

          questions.push(questionData);  // Ajouter la question à la liste des questions
        }
      });

      const cctl = await CCTL.create({
        titre: "test",
        promotion: "CPI A1",
        date: DateTime.now(),
        duree: "1h"
      })
      await cctl.save();


      for (const question of questions) {
        // @ts-ignore
        const cctlQuestion = await cctl.related('cctlQuestions').create({
          numero: question.numeroQuestion,
          type: question.typeQuestion,
          texte: question.texteQuestion,
          correction: question.correctionQuestion,
        });
        await cctlQuestion.save();

        for (const [q, r] of Object.entries<string>(question.reponseData)) {
          const cctlAnswer = await cctlQuestion.related('cctlAnswers').create({
            texte: q,
            correction: r,
          });
          await cctlAnswer.save();
        }
      }
      return response.redirect().toRoute('cctl', {id: cctl.id})
    }
  }
}
