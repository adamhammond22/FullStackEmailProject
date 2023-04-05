const {Pool} = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});

/* Update starred status*/
exports.updateStarred = async (req, res) => {
  /* Update into database */
  console.log('getting here');
  const update = `UPDATE mail SET mail = jsonb_set(mail, '{starred}', $1)` +
    ` WHERE id = $2 RETURNING *`;
  const queryInsert = {
    text: update,
    values: [req.query.isStarred, req.params.id],
  };
  console.log('queryInsert here' + update + req.query.isStarred);
  const {rows} = await pool.query(queryInsert);

  if (rows.length < 1) {
    res.status(404).send();
  } else {
    res.status(201).send();
  }
};

/* Update starred status*/
exports.updateRead = async (req, res) => {
  /* Update into database */
  console.log('getting here');
  const update = `UPDATE mail SET mail = jsonb_set(mail, '{read}', $1)` +
    ` WHERE id = $2 RETURNING *`;
  const queryInsert = {
    text: update,
    values: [req.query.isRead, req.params.id],
  };
  console.log('queryInsert here' + update + req.query.isRead);
  const {rows} = await pool.query(queryInsert);

  if (rows.length < 1) {
    res.status(404).send();
  } else {
    res.status(201).send();
  }
};
