const adminRouter = require('./admin')
const plmatRouter = require('./plmat')

module.exports = (app) => {
  app.use('/api/admin', adminRouter)
  app.use('/api/plmat', plmatRouter)
}
