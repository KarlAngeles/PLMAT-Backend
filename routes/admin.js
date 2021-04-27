const adminRouter = require('express').Router()

adminRouter.get('/', async (req, res, next) => {
  console.log(req.body)
  res.status(200).end()
})

adminRouter.post('/', async (req, res, next) => {

})

module.exports = adminRouter


