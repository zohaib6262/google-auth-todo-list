// config/config.js
module.exports = {
  development: {
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "zohaib123",
    database: process.env.DB_NAME || "postgres",
    host: process.env.DB_HOST || "localhost",
    dialect: "postgres",
  },
  production: {
    // Models/index.js will handle production config
    dialect: "postgres",
  },
};
