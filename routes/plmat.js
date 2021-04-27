const plmatRouter = require('express').Router()

plmatRouter.post('/login', async (req, res, next) => {
  console.log(req.body)
  res.json(200).end()
})

module.exports = plmatRouter
