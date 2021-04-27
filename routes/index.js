const adminRouter = require('./admin')

module.exports = (app) => {
  app.use('/api/admin', adminRouter)
}
