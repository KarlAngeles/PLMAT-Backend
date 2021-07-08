const axios = require('axios')
const router = require('express').Router()
const PDFDocument = require('pdfkit')
const blobStream = require('blob-stream')
const { Questionnaire } = require('../../models/questionnaires')

router.post('/', async (req, res, next) => {

  const getImage = async (src) => {
    //const response = await fetch(src);
    //const image = await response.buffer();

    //return image;
    const image = await axios.get(src, { responseType: 'arraybuffer' })
    return image.data
  };

  try {
    const doc = new PDFDocument()
    const imgHeight = 150
    let filename = 'testing'
    let questionnaire
    let randomIndex = 0

    switch (req.body.subject) {
      case "Mathematics":
        const mathQuestionnaire = await Questionnaire.find({ subject: 'Mathematics' }).select('-answer_list').populate('questions', ['text', 'choices'])
        randomIndex = Math.floor(Math.random() * mathQuestionnaire.length)
        questionnaire = mathQuestionnaire[randomIndex]
        break
      case "Science":
        const scienceQuestionnaire = await Questionnaire.find({ subject: 'Science' }).select('-answer_list').populate('questions', ['text', 'choices'])
        randomIndex = Math.floor(Math.random() * scienceQuestionnaire.length)
        questionnaire = scienceQuestionnaire[randomIndex]
        break
      case "English":
        const englishQuestionnaire = await Questionnaire.find({ subject: 'English' }).select('-answer_list').populate('questions', ['text', 'choices'])
        randomIndex = Math.floor(Math.random() * englishQuestionnaire.length)
        questionnaire = englishQuestionnaire[randomIndex]
        break
      case "Filipino":
        const filipinoQuestionnaire = await Questionnaire.find({ subject: 'Filipino' }).select('-answer_list').populate('questions', ['text', 'choices'])
        randomIndex = Math.floor(Math.random() * filipinoQuestionnaire.length)
        questionnaire = filipinoQuestionnaire[randomIndex]
        break
      case "Abstract":
        const abstractQuestionnaire = await Questionnaire.find({ subject: 'Abstract' }).select('-answer_list').populate('questions', ['text', 'choices', 'fileUrl'])
        randomIndex = Math.floor(Math.random() * abstractQuestionnaire.length)
        questionnaire = abstractQuestionnaire[randomIndex]
        break
    }


    //const questionnaire = mathQuestionnaire[randomIndex]
    //console.log(questionnaire)

    filename = encodeURIComponent(filename) + '.pdf'
    res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"')
    res.setHeader('Content-type', 'application/pdf')
    doc.y = 300

    doc.text('Pamantasan ng Lungsod ng Maynila', 50, 50)
    doc.text(`Subject: ${questionnaire.subject}`).moveDown(1)
    for (let x = 0; x < questionnaire.questions.length; x++) {

      if (questionnaire.subject == 'Abstract') {
        if ((imgHeight + doc.y + doc.currentLineHeight(true) + doc.page.margins.top + doc.page.margins.bottom) > doc.page.maxY()) {
          doc.addPage({ margin: 50 })
        }
        doc.text(`${x + 1}.) ` + questionnaire.questions[x].text).moveDown(0.5)
        const url =`https://plmat-bucket.s3.ap-southeast-1.amazonaws.com/${questionnaire.questions[x].fileUrl}`
        const image = await getImage(url)
        doc.image(image, {width: 300, height: 150})                                             
      } else {
        doc.text(`${x + 1}.) ` + questionnaire.questions[x].text).moveDown(0.5)
      }

      doc.text('O ' + questionnaire.questions[x].choices[0]).moveDown(0.5)
      doc.text('O ' + questionnaire.questions[x].choices[1]).moveDown(0.5)
      doc.text('O ' + questionnaire.questions[x].choices[2]).moveDown(0.5)
      doc.text('O ' + questionnaire.questions[x].choices[3]).moveDown(0.5)
      doc.text('').moveDown(1)
    }
    //doc.text('testing pdf content', 50, 50)
    doc.pipe(res)
    doc.end()

  } catch (error) {
    console.log(error)
  }

})

module.exports = router
