// "use strict";

// const fs = require("fs");
// const path = require("path");
// const Sequelize = require("sequelize");
// const process = require("process");
// const basename = path.basename(__filename);
// const env = process.env.NODE_ENV || "development";
// const config = require(__dirname + "/../config/config.json")[env];
// const db = {};

// let sequelize;
// if (config.use_env_variable) {
//   sequelize = new Sequelize(process.env[config.use_env_variable], config);
// } else {
//   sequelize = new Sequelize(
//     config.database,
//     config.username,
//     config.password,
//     config
//   );
// }

// fs.readdirSync(__dirname)
//   .filter((file) => {
//     return (
//       file.indexOf(".") !== 0 &&
//       file !== basename &&
//       file.slice(-3) === ".js" &&
//       file.indexOf(".test.js") === -1
//     );
//   })
//   .forEach((file) => {
//     const model = require(path.join(__dirname, file))(
//       sequelize,
//       Sequelize.DataTypes
//     );
//     db[model.name] = model;
//   });

// Object.keys(db).forEach((modelName) => {
//   if (db[modelName].associate) {
//     db[modelName].associate(db);
//   }
// });

// db.sequelize = sequelize;
// db.Sequelize = Sequelize;

// module.exports = db;
"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const process = require("process");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.js")[env];
const db = {};

let sequelize;

// Production environment ke liye
if (env === "production") {
  const databaseUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("Database URL not found in environment variables");
  }

  sequelize = new Sequelize(databaseUrl, {
    dialect: "postgres",
    protocol: "postgres",
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // ✅ Self-signed certificates allow karo
      },
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 60000, // ✅ Timeout increase karo
      idle: 10000,
    },
  });
} else {
  // Development environment
  sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: config.dialect,
    logging: console.log,
  });
}

// Connection test with better error handling
sequelize
  .authenticate()
  .then(() => {
    console.log(`✅ Database connected successfully in ${env} mode`);
  })
  .catch((err) => {
    console.error("❌ Database connection failed:");
    console.error("Error name:", err.name);
    console.error("Error message:", err.message);
    if (err.parent) {
      console.error("Parent error:", err.parent.code);
    }
  });

// Load models
fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".js" &&
      file.indexOf(".test.js") === -1
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

// Setup associations
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
