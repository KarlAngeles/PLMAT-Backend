const router = require('express').Router()
const { Questionnaire } = require('../../models/questionnaires')
const plmatAuth = require('../../utils/middleware/plmatAuth')
const mongoose = require('mongoose')

router.get('/', plmatAuth, async (req, res, next) => {
  try {
    const questionnaires = [] 
    for (let id of req.body.questionnaires) {
      questionnaires.push(await Questionnaire.findById(mongoose.Types.ObjectId(id)).select('-answer_list').populate('questions', ['text', 'choices', 'fileUrl']))
    }

    res.json(questionnaires).end()

  } catch (err) {
    console.log(err)
    res.status(400).json(err)
  }
}) 

module.exports = router
