const auth = require("./auth.route");
// const user = require("./user.route");


module.exports = app => {
  app.use('/api/v1/auth', auth);
  // app.use('/api/v1/users', user);
}