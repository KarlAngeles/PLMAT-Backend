const mongoose = require('mongoose')
const { Schema } = mongoose

const settingSchema = new Schema({
  minutes_for_easy: Number,
  minutes_for_medium: Number,
  minutes_for_hard: Number,
})

const Setting = mongoose.model('Setting', settingSchema)

module.exports = { settingSchema, Setting }
