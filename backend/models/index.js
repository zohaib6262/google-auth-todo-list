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
  const databaseUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.error("❌ No database URL found!");
    throw new Error("Database URL not found");
  }

  console.log("🔌 Connecting to database...");
  console.log("Database URL:", databaseUrl.replace(/:[^:@]+@/, ":****@")); // Mask password

  // ✅ Parse the URL to remove sslmode from query string
  const url = new URL(databaseUrl);
  url.searchParams.delete("sslmode"); // Remove sslmode parameter
  const cleanUrl = url.toString();

  sequelize = new Sequelize(cleanUrl, {
    dialect: "postgres",
    dialectModule: pg,
    protocol: "postgres",
    logging: console.log, // ✅ Keep logging to see what's happening
    native: false,
    dialectOptions: {
      ssl: false, // ✅ Try without SSL first
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 60000,
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
    console.error("❌ Connection failed:", err.name);
    console.error("Error code:", err.parent?.code || err.code);
    console.error("Full error:", JSON.stringify(err, null, 2));
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
