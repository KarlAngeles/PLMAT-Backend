require('dotenv').config()

let PORT = process.env.PORT
let TOKEN_SECRET = process.env.TOKEN_SECRET
let DB_USERNAME = process.env.DB_USERNAME
let DB_PW = process.env.DB_PW
let DB_NAME = process.env.DB_NAME
let ADMIN_TOKEN_SECRET = process.env.ADMIN_TOKEN_SECRET

module.exports = {
  PORT,
  TOKEN_SECRET,
  DB_PW,
  DB_NAME,
  ADMIN_TOKEN_SECRET
}
