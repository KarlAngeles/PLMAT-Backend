const router = require('express').Router()
const plmatAuth = require('../../utils/middleware/plmatAuth')
const { testTaker } = require('../../models/test_takers')

router.post('/', async (req, res, next) => {
  try {
    // turn has_taken_exam to true
    const user = await testTaker.findOne({ username: req.body.data.username }).select('-password')
    user.has_taken_exam = true
    await user.save()

    const verify = await testTaker.findOne({ username: req.body.data.username }).select('-password')
    console.log(verify)

    res.status(200).end()

  } catch (err) {
    res.status(400).json(err)
  }
})

module.exports = router
