const router = require('express').Router()
const { Questionnaire } = require('../../models/questionnaires')
const { testTaker } = require('../../models/test_takers')
const { Record } = require('../../models/record')
const plmatAuth = require('../../utils/middleware/plmatAuth')

// This route will generate a list of questionnaires, one for each subject
// Then this generated list will be linked to the user who made the request
router.get('/', async(req, res, next) => {
  try {
    const user = await testTaker.findOne({ username: req.body.username }).select('-password')

    if (user) {
      const questionnaires = []
      const questionnaireId = []
      let randomIndex = 0

      // Order: Math, Science, English, Filipino, Abstract
      const mathQuestionnaire = await Questionnaire.find({ subject: 'Mathematics' }).select('-answer_list').populate('questions', ['text', 'choices'])
      randomIndex = Math.floor(Math.random() * mathQuestionnaire.length)
      questionnaires.push(mathQuestionnaire[randomIndex])
      questionnaireId.push(mathQuestionnaire[randomIndex]._id)
      
      const scienceQuestionnaire = await Questionnaire.find({ subject: 'Science' }).select('-answer_list').populate('questions', ['text', 'choices'])
      randomIndex = Math.floor(Math.random() * scienceQuestionnaire.length)
      questionnaires.push(scienceQuestionnaire[randomIndex])
      questionnaireId.push(scienceQuestionnaire[randomIndex]._id)

      const englishQuestionnaire = await Questionnaire.find({ subject: 'English' }).select('-answer_list').populate('questions', ['text', 'choices'])
      randomIndex = Math.floor(Math.random() * englishQuestionnaire.length)
      questionnaires.push(englishQuestionnaire[randomIndex])
      questionnaireId.push(englishQuestionnaire[randomIndex]._id)

      const filipinoQuestionnaire = await Questionnaire.find({ subject: 'Filipino' }).select('-answer_list').populate('questions', ['text', 'choices'])
      randomIndex = Math.floor(Math.random() * filipinoQuestionnaire.length)
      questionnaires.push(filipinoQuestionnaire[randomIndex])
      questionnaireId.push(filipinoQuestionnaire[randomIndex]._id)

      const abstractQuestionnaire = await Questionnaire.find({ subject: 'Abstract' }).select('-answer_list').populate('questions', ['text', 'choices', 'fileUrl'])
      randomIndex = Math.floor(Math.random() * abstractQuestionnaire.length)
      questionnaires.push(abstractQuestionnaire[randomIndex])
      questionnaireId.push(abstractQuestionnaire[randomIndex]._id)

      // Will add other subjects as soon as questions are compiled
      user.current_exam = 0
      user.questionnaire_used = questionnaireId
      await user.save()
      
      // Sets up record document
      const record = new Record({
        time_started: Array(5).fill(0),
        time_ended: Array(5).fill(0),
        math_score: "",
        science_score: "",
        english_score: "",
        filipino_score: "",
        abstract_score: ""
      })

      const savedRecord = await record.save()
      user.record = savedRecord._id
      await user.save()
      
      res.json(questionnaires)
    } else {
      res.status(400).json({error: 'User not found'})
    }
  } catch (err) {
    console.log(err)
    res.status(400).json(err)
  }
})

module.exports = router
