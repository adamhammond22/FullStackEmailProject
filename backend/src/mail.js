const {Pool} = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});

/* Return array of mailbox type or searched mail */
exports.getMail = async (req, res) => {
  const mailbox = req.query.mailbox;
  const search = req.query.search;
  /* Get Mail from database */
  /* Query DB */
  let select = 'SELECT * FROM mail';
  const valuesVar = [req.user.email];
  /* If just mailbox is specified */
  if (mailbox) {
    select += ` WHERE mailbox = $2`;
    select += ` AND (mail->'from'->>'email' = $1`;
    select += ` OR mail->'to'->>'email' = $1)`;
    valuesVar.push(`${mailbox}`);
  /* If just search is specified */
  } else if (search) {
    select += ` WHERE (mail->'from'->>'name' ~* $2`;
    select += ` OR mail->'from'->>'email' ~* $2`;
    select += ` OR mail->'to'->>'name' ~* $2`;
    select += ` OR mail->'to'->>'email' ~* $2`;
    select += ` OR mail->>'subject' ~* $2`;
    select += ` OR mail->>'content' ~* $2)`;
    select += ` AND (mail->'from'->>'email' = $1`;
    select += ` OR mail->'to'->>'email' = $1)`;
    valuesVar.push(`${search}`);
  /* if we're supposed to return all mail */
  } else {
    select += ` WHERE mail->'from'->>'email' = $1`;
    select += ` OR mail->'to'->>'email' = $1`;
  }
  const query = {
    text: select,
    values: valuesVar,
  };
  console.log('select:' + select);
  console.log('valuesvar' + valuesVar);

  const {rows} = await pool.query(query);
  console.log('rows len' + rows.length);
  /* array of mailbox objs to return */
  const mailboxArray = [];
  /* Go through all rows */
  for (const row of rows) {
    /* Add id to email, remove content*/
    const email = row.mail;
    email.id = row.id;
    delete email.content;
    /* try to find correct mailbox in mbox array*/
    const mailboxIndex = mailboxArray.findIndex((mboxObj) => {
      return (mboxObj.name === row.mailbox);
    });
    /* Make new mailbox object in mailbox array if needed*/
    if (mailboxIndex === -1) {
      mailboxArray.push({'name': row.mailbox, 'mail': [email]});
    /* Otherwise just push email to mailboxarray[index].mail  */
    } else {
      mailboxArray[mailboxIndex].mail.push(email);
    }
  }
  res.status(200).json(mailboxArray);
};
/* Get email by Id if it exists*/
exports.getEmailById = async (req, res) => {
  let returnedEmail = undefined;
  const uuid = req.params.id;
  /* Query Database */
  const select = 'SELECT mail FROM mail WHERE id = $1';
  console.log('id' + uuid);
  const query = {
    text: select,
    values: [uuid],
  };
  const {rows} = await pool.query(query);
  /* If no rows found return undefined */
  if (rows.length === 0 ) {
    returnedEmail = undefined;
  /* If 1+ rows found return first index (should always be <2 bc uuid)*/
  } else {
    const email = rows[0].mail;
    email.id = uuid;
    returnedEmail = email;
  }
  /* if undefined email not found, send 404 */
  if (returnedEmail === undefined) {
    res.status(404).send();
  /* Otherwise send 200 w email */
  } else {
    console.log('returning1!!');
    res.status(200).json(returnedEmail);
  }
};
/* Adds an email to the sent mailbox and return it*/
exports.postEmail = async (req, res) => {
  /* format email object and send it to database */
  const email = req.body;
  const today = new Date();
  email.sent = today.toISOString();
  email.received = today.toISOString();
  /* Any created mail, we must have read and ca't be starred yet*/
  email.read = true;
  email.starred = false;
  /* Insert into database */
  const insert = 'INSERT INTO mail(mailbox, mail) VALUES ($1, $2) RETURNING *';
  const queryInsert = {
    text: insert,
    values: ['sent', email],
  };
  const {rows} = await pool.query(queryInsert);
  console.log('returned!!' + typeof(rows[0]));
  console.log('returned!!'+Object.keys(rows[0])+'=='+Object.keys(rows[0].mail));
  const newEmail = rows[0].mail;
  newEmail.id = rows[0].id;
  const createdEmail = newEmail;
  console.log('newwmail' + JSON.stringify(createdEmail));
  res.status(201).json(createdEmail);
};
/* Moves an email into specified mailbox, creating one if needed */
// exports.putEmail = async (req, res) => {
//   console.log('inp put');
//   const uuid = req.params.id;
//   /* First query DB for desired email*/
//   let select = 'SELECT mail FROM mail WHERE id = $1';
//   select += ` AND (mail-> 'from' ->> 'email' = $2`;
//   select += ` OR mail-> 'to' ->> 'email' = $2)`;
//   const query = {
//     text: select,
//     values: [uuid, req.user.email],
//   };
//   const {rows} = await pool.query(query);
//   console.log('after q');
//   /* If no email found return 404 */
//   if (rows.length === 0 ) {
//     res.status(404).send();
//   /* Otherwise if it's not in sent and is being put in sent, return 409 */
//   } else if (rows[0].mailbox !== 'Sent' && req.query.mailbox === 'Sent') {
//     res.status(409).send();
//   /* If 1+ rows found, use first index (should always be <2 bc uuid)
//   This is where we will actually do the operation */
//   } else {
//     console.log('else');
//     /* Simply update mailbox entry for this row */
//     const update = 'UPDATE mail SET mailbox = $1 WHERE id = $2';
//     const query2 = {
//       text: update,
//       values: [req.query.mailbox, uuid],
//     };
//     await pool.query(query2);
//     console.log('after q1');
//     /* Mailbox upsert, insert it and if theres a duplicate do nothing */
//     const insert = 'INSERT INTO mailbox(owner, name) VALUES ($1, $2)';
//     insert += ` ON CONFLICT DO NOTHING`;
//     const queryB = {
//       text: insert,
//       values: [req.user.email, req.query.mailbox],
//     };
//     await pool.query(queryB);
//     console.log('after q2');
//     res.status(204).send();
//   }
// };
