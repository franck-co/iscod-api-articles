require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  mongoUri: process.env.MONGO_URI ?? "mongodb://localhost:27017/myapp",
  secretJwtToken: process.env.JWT_SECRET ?? "test",
};
