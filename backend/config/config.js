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
    use_env_variable: "POSTGRES_URL",
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },
};
