const postgres = require('migrat-postgres');
const dotenv = require('dotenv');
const pg = require('pg');

dotenv.config({
  path: process.env.HOME !== '/root' ? '.env' : '../../.env',
});

const pgUri = `postgres://${encodeURIComponent(process.env.DB_USER)}:${encodeURIComponent(process.env.DB_PASS)}@${process.env.DB_HOST}:${process.env.DB_PORT}/${encodeURIComponent(process.env.DB_NAME)}`;

const db = new pg.Pool({
  connectionString: pgUri,
  max: 50,
  allowExitOnIdle: true,
  client_encoding: 'utf8',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

module.exports = {
  migrationsDir: './migrations',

  plugins: [
    postgres({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      migratSchema: 'public',
      migratTable: 'migrat',
      enableLocking: true,
      enableStateStorage: true,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    }),
  ],

  localState: 'history.json',

  storeState: (state, callback) => {
    db.query(`UPDATE "migrat" SET value = $1 WHERE key = 'state'`, [
      JSON.stringify(state),
    ])
      .then((data) => {
        if (!data.rows[0]) {
          callback(new Error('No state available'));
          return;
        }

        const { value } = data.rows[0];
        callback(undefined, JSON.parse(value));
      })
      .catch((err) => {
        callback(err);
      });
  },

  fetchState: (callback) => {
    db.query('SELECT * FROM "public"."migrat"')
      .then((data) => {
        if (!data.rows[0]) {
          callback(new Error('No state available'));
          return;
        }

        const { value } = data.rows[0];
        callback(undefined, JSON.parse(value));
      })
      .catch((err) => {
        callback(err);
      });
  },

  context: (callback) => {
    callback(null, {});
  },
};
