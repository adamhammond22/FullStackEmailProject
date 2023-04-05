const express = require('express');
const cors = require('cors');
const yaml = require('js-yaml');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const path = require('path');
const OpenApiValidator = require('express-openapi-validator');

const dummy = require('./dummy');
const auth = require('./auth');
const mail = require('./mail');
const mailbox = require('./mailbox');
const update = require('./update');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

const apiSpec = path.join(__dirname, '../api/openapi.yaml');

const apidoc = yaml.load(fs.readFileSync(apiSpec, 'utf8'));
app.use('/v0/api-docs', swaggerUi.serve, swaggerUi.setup(apidoc));

app.use(
  OpenApiValidator.middleware({
    apiSpec: apiSpec,
    validateRequests: true,
    validateResponses: true,
  }),
);

app.get('/v0/dummy', dummy.get);
app.post('/v0/login', auth.login);

app.get('/v0/mailbox', auth.check, mailbox.get);
// app.post('/v0/mailbox', auth.check, mailbox.post);

app.get('/v0/mail', auth.check, mail.getMail);
app.get('/v0/mail/:id', auth.check, mail.getEmailById);
app.post('/v0/mail', auth.check, mail.postEmail);
// app.put('/v0/mail/:id', auth.check, mail.putEmail);

app.put('/v0/starred/:id', auth.check, update.updateStarred);
app.put('/v0/read/:id', auth.check, update.updateRead);

app.use((err, req, res, next) => {
  res.status(err.status).json({
    message: err.message,
    errors: err.errors,
    status: err.status,
  });
});

module.exports = app;
