const auth = require("./auth.route");
const bootcamps = require("./bootcamps.route");


module.exports = app => {
  app.use('/api/v1/auth', auth);
  app.use('/api/v1/bootcamps', bootcamps);
}