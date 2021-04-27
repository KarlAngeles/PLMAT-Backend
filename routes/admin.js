const adminRouter = require('express').Router()

adminRouter.get('/', async (req, res, next) => {
  console.log(req)
  res.status(200).end()
})

module.exports = adminRouter


