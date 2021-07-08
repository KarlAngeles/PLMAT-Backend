const router = require('express').Router()
const { testTaker } = require('../../models/test_takers')
const { Record } = require('../../models/record')
const plmatAuth = require('../../utils/middleware/plmatAuth')
const mongoose = require('mongoose')

router.post('/', async (req, res, next) => {
  try {
    const user = await testTaker.findOne({ username: req.body.data.username }).select('-password')
    const record = await Record.findById(mongoose.Types.ObjectId(user.record))

    const obj = {
      time_ends: record.time_ended,
      time_starts: record.time_started
    }

    res.status(200).json(obj)
  } catch (err) {
    res.status(400).json(err)
  }
})

router.post('/end', async (req, res, next) => {
  try {
    const user = await testTaker.findOne({ username: req.body.data.username }).select('-password')
    const record = await Record.findById(mongoose.Types.ObjectId(user.record))
    const time_ends = record.time_ended

    if (time_ends[req.body.data.index] == 0) {
      time_ends[req.body.data.index] = Date.now()
      record.time_ended = time_ends
      await record.save()
    }

    res.status(200).end()
  } catch (err) {
    res.status(400).json(err)
  }
})


router.post('/start', async (req, res, next) => {
  try {
    const user = await testTaker.findOne({ username: req.body.data.username }).select('-password')
    const record = await Record.findById(mongoose.Types.ObjectId(user.record))
    const time_starts = record.time_started

    if (time_starts[req.body.data.index] == 0) {
      time_starts[req.body.data.index] = Date.now()
      record.time_started = time_starts
      const savedRecord = await record.save()
    }

    res.status(200).end()
  } catch (err) {
    console.log(err)
    res.status(400).json(err)
  }
})

module.exports = router
