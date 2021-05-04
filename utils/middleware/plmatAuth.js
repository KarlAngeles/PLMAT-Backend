const jwt = require('jsonwebtoken')
const config = require('../config')

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) return res.sendStatus(401)
  jwt.verify(token, config.TOKEN_SECRET as string, (err, user) => {
    console.log(err)
    console.log(user)

    if (err) return res.sendStatus(403)

    req.user = user
    next()
  })

}
