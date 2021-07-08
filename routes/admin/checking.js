const router = require('express').Router()
const { testTaker } = require('../../models/test_takers')
const { Record } = require('../../models/record')
const mongoose = require('mongoose')

router.post('/', async (req, res, next) => {

  try {
    console.log(req.body)
    const test_takers = await testTaker.find({has_taken_exam: true})
    for (let x = 0; x < test_takers.length; x++) {
      const testTaker = test_takers[x]
      const recordId = testTaker.record
      const record = await Record.findById(mongoose.Types.ObjectId(recordId))

      const re = /[0-9]*[0-9]+/g
      const math = record.math_score.match(re)
      const science = record.science_score.match(re)
      const english = record.english_score.match(re)
      const filipino = record.filipino_score.match(re)
      const abstract = record.abstract_score.match(re)

      const correct = parseInt(math[0]) + parseInt(science[0]) + parseInt(english[0]) + parseInt(filipino[0]) + parseInt(abstract[0])
      const total = parseInt(math[1]) + parseInt(science[1]) + parseInt(english[1]) + parseInt(filipino[1]) + parseInt(abstract[1])

      const passingGrade = Math.round((req.body.passing * 0.01) * total)

      console.log('correct', correct)
      console.log('total', total)
      console.log('passing grade', passingGrade)

      testTaker.passed = correct >= passingGrade ? true : false
      await testTaker.save()
    }

    res.json({ message: 'Test takers have been checked' })
  } catch (error) {
    res.status(400).json('' + err)
  }

})

module.exports = router
