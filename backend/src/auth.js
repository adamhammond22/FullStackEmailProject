/* LARGE portion of this file is taken from professor Harrison's
authenticated book example */
const {Pool} = require('pg');

const jwt = require('jsonwebtoken');
const secrets = require('../data/secrets');
const bcrypt = require('bcrypt');


const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});

exports.login = async (req, res) => {
  console.log('login start');
  const {email, password} = req.body;
  /* Search Databse for this email address */
  const select = 'SELECT * FROM emailuser WHERE email = $1';
  const query = {
    text: select,
    values: [email],
  };
  const {rows} = await pool.query(query);
  /* Check if we recieved valid email */
  if (rows.length < 1) {
    res.status(401).send();
  } else {
    /* Check Password */
    const emailuser = rows[0];
    if (bcrypt.compareSync(password, emailuser.password)) {
      /* Create AT for all other server queries */
      const newAccessToken = jwt.sign(
        {email: emailuser.email, role: emailuser.role},
        secrets.accessToken, {
          expiresIn: '120m',
          algorithm: 'HS256',
        });
      res.status(200).json({name: emailuser.name, accessToken: newAccessToken,
        avatarurl: emailuser.avatarurl});
    } else {
      res.status(401).send();
    }
  }
};

/* Checks the authorization, and then goes to next express link */
/* On success, returns nothing and moves on, on failure - throws errors */
exports.check = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(' ')[1];
  jwt.verify(token, secrets.accessToken, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    console.log('auth check good');
    req.user = user;
    next();
  });
};
