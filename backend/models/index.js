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

const pg = require("pg");
const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const process = require("process");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const db = {};

let sequelize;

// Production environment
if (env === "production") {
  // ✅ Construct the URL properly for Supabase pooler
  const username = "postgres.kiqqyquwuvdejzavfncn";
  const password = "bWVYHBME1rhxBDma";
  const host = "aws-0-ap-southeast-1.pooler.supabase.com";
  const port = 6543;
  const database = "postgres";

  const databaseUrl = `postgres://${username}:${password}@${host}:${port}/${database}`;

  console.log("🔌 Connecting to Supabase database...");

  sequelize = new Sequelize(databaseUrl, {
    dialect: "postgres",
    dialectModule: pg,
    protocol: "postgres",
    logging: false,
    native: false,
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
  });
} else {
  // Development
  const config = require(__dirname + "/../config/config.js")[env];
  sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: config.dialect,
    dialectModule: pg,
    logging: console.log,
  });
}

// Test connection
sequelize
  .authenticate()
  .then(() => {
    console.log(`✅ Database connected successfully in ${env} mode`);
  })
  .catch((err) => {
    console.error("❌ Database connection failed!");
    console.error("Error:", err.message);
    console.error("Code:", err.original?.code || err.code);
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

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
