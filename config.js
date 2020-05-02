const dotenv = require('dotenv');
dotenv.config();
module.exports = {
  clientID: process.env.CLIENTID,
  clientSecret: process.env.CLIENTSECRET,
};