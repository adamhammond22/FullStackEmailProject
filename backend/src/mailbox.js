const {Pool} = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});

exports.get = async (req, res) => {
  const select = 'SELECT * FROM mailbox WHERE owner = $1';
  const query = {
    text: select,
    values: [req.query.owner],
  };
  const {rows} = await pool.query(query);
  const mailboxArray = [];
  /* Go through rows */
  for (const row of rows) {
    mailboxArray.push(row.name);
  }
  res.status(200).json(mailboxArray);
};

/* UNTESTED */
/* We have post returning array with new one to add */
// exports.post = async (req, res) => {
// const insert ='INSERT INTO mailbox(owner, name) VALUES ($1, $2) RETURNING *';
//   const query = {
//     text: insert,
//     values: [req.query.owner],
//   };
//   const {rows} = await pool.query(query);
//   const mailboxArray = [];
//   /* Go through rows */
//   for (const row of rows) {
//     mailboxArray.push(row.name);
//   }
//   res.status(201).json(mailboxArray);
// };
