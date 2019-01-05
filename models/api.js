const axios = require('axios')
const config = require('../config')
const instance = axios.create({
    baseURL: config.api.baseURL,
    timeout: 3000,
    auth: {
        username: config.api.username,
        password: config.api.password
      },
  })

  module.exports = instance