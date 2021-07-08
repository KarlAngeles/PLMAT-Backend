const router = require('express').Router()
const generateQuestionnareACO = require('./aco_helper')
const generateQuestionnareABC = require('./abc_helper')
const { Questionnaire } = require('../../models/questionnaires')
const { Report } = require('../../models/reports')
const { Setting } = require('../../models/settings')
const mongoose = require('mongoose')

router.post('/', async (req, res, next) => { 

  console.log(req.body)

  let EasyValues;
  let MediumValues;
  let HardValues;

  try {
    const settings = await Setting.findOne({})
    const easy = settings.minutes_for_easy
    const medium = settings.minutes_for_medium
    const hard = settings.minutes_for_hard
    console.log(easy, medium, hard)

    const total_time = req.body.minutes_allotted
    const questionnaire_quantity = req.body.questionnaire_quantity
    const subject = req.body.subject
    const start_date = req.body.start_date

    // If result is < 0.5, nothing is added
    const easy_total = Math.round((total_time * (req.body.easy_percent * 0.01)) / easy)
    const medium_total = Math.round((total_time * (req.body.medium_percent * 0.01)) / medium)
    const hard_total = Math.round((total_time * (req.body.hard_percent * 0.01)) / hard)
    const total = easy_total + medium_total + hard_total
    console.log('total: ', total)

    // Shuffle questions
    if (req.body.algorithm == "ACO") {
      EasyValues = await generateQuestionnareACO(questionnaire_quantity, easy_total, subject, start_date, "Easy")
      MediumValues = await generateQuestionnareACO(questionnaire_quantity, medium_total, subject, start_date, "Medium")
      HardValues = await generateQuestionnareACO(questionnaire_quantity, hard_total, subject, start_date, "Hard")

      //console.log(EasyValues)
      //console.log(MediumValues)
      //console.log(HardValues)

      //const test = {
        //subject: subject,
        //questions: EasyValues.questionnaires[0].concat(MediumValues.questionnaires[0], HardValues.questionnaires[0]),
        //benchmarks: EasyValues.benchmarks[0].concat(MediumValues.benchmarks[0], HardValues.benchmarks[0]),
        //answer_list: EasyValues.answer_list[0].concat(MediumValues.answer_list[0], HardValues.answer_list[0])
      //}

      //console.log(test)
    } else {
      EasyValues = await generateQuestionnareABC(questionnaire_quantity, easy_total, subject, start_date, "Easy")
      MediumValues = await generateQuestionnareABC(questionnaire_quantity, medium_total, subject, start_date, "Medium")
      HardValues = await generateQuestionnareABC(questionnaire_quantity, hard_total, subject, start_date, "Hard")

      //console.log(EasyValues)
      //console.log(MediumValues)
      //console.log(HardValues)

      //const test = {
        //subject: subject,
        //questions: EasyValues.questionnaires[0].concat(MediumValues.questionnaires[0], HardValues.questionnaires[0]),
        //benchmarks: EasyValues.benchmarks[0].concat(MediumValues.benchmarks[0], HardValues.benchmarks[0]),
        //answer_list: EasyValues.answer_list[0].concat(MediumValues.answer_list[0], HardValues.answer_list[0])
      //}

      //console.log(test)
    }

    for (let x = 0; x < questionnaire_quantity; x++) {
      const report = new Report({
        benchmark: EasyValues.benchmarks[x].concat(MediumValues.benchmarks[x], HardValues.benchmarks[x]),
        algorithm: req.body.algorithm,
        total_questions: total,  
        questionnaire_quantity: questionnaire_quantity,
        minutes_for_easy: easy,
        minutes_for_medium: medium,
        minutes_for_hard: hard,
        number_of_easy: easy_total,
        number_of_medium: medium_total,
        number_of_hard: hard_total,
      })

      const savedReport = await report.save()

      const questionnaire = new Questionnaire({
        subject: subject,
        questions: EasyValues.questionnaires[x].concat(MediumValues.questionnaires[x], HardValues.questionnaires[x]),
        report: savedReport._id,
        answer_list: EasyValues.answer_list[x].concat(MediumValues.answer_list[x], HardValues.answer_list[x]),
        total_time: req.body.minutes_allotted,
        total_questions: total,
      })

      const savedQuestionnare = await questionnaire.save()
    }

    res.json({ message: 'Questionnaire and Report Generated' })

  } catch (err) {
    res.status(400).json('' + err)
  }
})

module.exports = router
