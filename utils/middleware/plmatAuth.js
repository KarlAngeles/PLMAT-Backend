const jwt = require('jsonwebtoken')
const config = require('../config')

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) return res.sendStatus(401)
  // user is decoded token
  jwt.verify(token, config.TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403)

    // probably not needed
    req.user = user
    next()
  })

}

module.exports = authenticateToken
