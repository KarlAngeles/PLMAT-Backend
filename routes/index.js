const adminRouter = require('./admin')
const plmatRouter = require('./plmat')

module.exports = (app) => {
  app.use('/api/plmat', plmatRouter)
  app.use('/api/admin', adminRouter)
}
