require('dotenv').config();

module.exports = {
  development: {
    url: 'postgres://postgres:bukarani@127.0.0.1:5432/prjtdev_db ',
    dialect: "postgres",
  },
  test: {
    url: process.env.TEST_DATABASE_URL,
    dialect: "postgres",
  },
  production: {
    url: process.env.DATABASE_URL,
    dialect: "postgres",
  },
};