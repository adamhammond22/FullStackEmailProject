const supertest = require('supertest');
const http = require('http');

const db = require('./db');
const app = require('../app');

let server;

beforeAll(() => {
  server = http.createServer(app);
  server.listen();
  request = supertest(server);
  return db.reset();
});

afterAll((done) => {
  server.close(done);
  db.shutdown();
});

test('GET Invalid URL', async () => {
  await request.get('/v0/so-not-a-real-end-point-ba-bip-de-doo-da/')
    .expect(404);
});
test('GET Unauthorized BearerToken', async () => {
  const bearerToken = 'verybadBearerTokenWilllNotWork';
  const authHeader = {
    'Authorization': `Bearer ${bearerToken}`,
    'Content-Type': 'application/x-www-form-urlencoded',
  };
  await request.get('/v0/mail').set(authHeader)
    .expect(403);
});
test('Login with non-existant Email, then bad password', async () => {
  const bademail = {email: 'nonexistantemail@example.com',
    password: 'mollymember'};
  await request.post('/v0/login')
    .send(JSON.stringify(bademail))
    .set({'Content-Type': 'application/json'})
    .expect(401);
  const badpassword = {email: 'mollymember@example.com',
    password: 'margretmember'};
  await request.post('/v0/login')
    .send(JSON.stringify(badpassword))
    .set({'Content-Type': 'application/json'})
    .expect(401);
});
test('Login with NO authHeader', async () => {
  await request.post('/v0/login')
    .send()
    .set({'Content-Type': 'application/json'})
    .expect(400);
});
test('GET AllMail', async () => {
  const user = {email: 'mollymember@example.com', password: 'mollymember'};
  const authResponse = await request.post('/v0/login')
    .send(JSON.stringify(user))
    .set({'Content-Type': 'application/json'})
    .expect(200);
  const bearerToken = authResponse.body.accessToken;
  const authHeader = {
    'Authorization': `Bearer ${bearerToken}`,
    'Content-Type': 'application/x-www-form-urlencoded',
  };
  const response = await request.get('/v0/mail').set(authHeader)
    .expect(200);
  expect(response.body.length).toBeGreaterThan(2);
  expect(response.body[0].mail[0]).not.toHaveProperty('content');
  expect(response.body[0].mail[0]).toHaveProperty('id');
});
test('GET mailbox query Mail', async () => {
  const user = {email: 'mollymember@example.com', password: 'mollymember'};
  const authResponse = await request.post('/v0/login')
    .send(JSON.stringify(user))
    .set({'Content-Type': 'application/json'})
    .expect(200);
  const bearerToken = authResponse.body.accessToken;
  const authHeader = {
    'Authorization': `Bearer ${bearerToken}`,
    'Content-Type': 'application/x-www-form-urlencoded',
  };
  const response = await request.get('/v0/mail/?mailbox=Inbox').set(authHeader)
    .expect(200);
  expect(response.body.length).toBe(1);
  expect(response.body[0].mail[0]).not.toHaveProperty('content');
  expect(response.body[0].mail[0]).toHaveProperty('id');
});
test('GET search query Mail & GET email by ID', async () => {
  const user = {email: 'mollymember@example.com', password: 'mollymember'};
  const authResponse = await request.post('/v0/login')
    .send(JSON.stringify(user))
    .set({'Content-Type': 'application/json'})
    .expect(200);
  const bearerToken = authResponse.body.accessToken;
  const authHeader = {
    'Authorization': `Bearer ${bearerToken}`,
    'Content-Type': 'application/x-www-form-urlencoded',
  };
  const response = await request.get('/v0/mail/?search=Gard').set(authHeader)
    .expect(200);
  expect(response.body.length).toBe(1);
  expect(response.body[0].mail.length).toBe(1);
  expect(response.body[0].mail[0]).not.toHaveProperty('content');
  expect(response.body[0].mail[0]).toHaveProperty('id');
  const mailID = response.body[0].mail[0].id;
  const response2 = await request.get(`/v0/mail/${mailID}`).set(authHeader)
    .expect(200);
  expect(response2.body.subject)
    .toBe('Optional bottom-line local area network');
  expect(response2.body).toHaveProperty('content');
  expect(response2.body).toHaveProperty('id');
});
test('GET email by bad uuid ID & good but invalid ID', async () => {
  const user = {email: 'mollymember@example.com', password: 'mollymember'};
  const authResponse = await request.post('/v0/login')
    .send(JSON.stringify(user))
    .set({'Content-Type': 'application/json'})
    .expect(200);
  const bearerToken = authResponse.body.accessToken;
  const authHeader = {
    'Authorization': `Bearer ${bearerToken}`,
    'Content-Type': 'application/x-www-form-urlencoded',
  };
  await request.get('/v0/mail/190293').set(authHeader)
    .expect(400);
  await request
    .get('/v0/mail/e77f3b48-71c8-11ed-a1eb-0242ac120002').set(authHeader)
    .expect(404);
});
test('POST email', async () => {
  const user = {email: 'mollymember@example.com', password: 'mollymember'};
  const authResponse = await request.post('/v0/login')
    .send(JSON.stringify(user))
    .set({'Content-Type': 'application/json'})
    .expect(200);
  const bearerToken = authResponse.body.accessToken;
  const authHeader = {
    'Authorization': `Bearer ${bearerToken}`,
    'Content-Type': 'application/json',
  };
  const newEmail = {
    'to': {
      'name': 'tWEeDlE-dEe',
      'email': 'uNexPecTedEmaIl@example.com',
    },
    'from': {
      'name': 'molly member',
      'email': 'mollymember@example.com',
    },
    'subject': 'here is my subject',
    'content': 'big ol content',
  };
  const responseEmail = await request.post('/v0/mail').set(authHeader)
    .send(newEmail).expect(201);
  expect(responseEmail.body.subject).toBe('here is my subject');
  expect(responseEmail.body).toHaveProperty('content');
  expect(responseEmail.body).toHaveProperty('id');
  expect(responseEmail.body.starred).toBe(false);
  expect(responseEmail.body.starred).toBe(false);
});
test('PUT email invalid ID', async () => {
  const user = {email: 'mollymember@example.com', password: 'mollymember'};
  const authResponse = await request.post('/v0/login')
    .send(JSON.stringify(user))
    .set({'Content-Type': 'application/json'})
    .expect(200);
  const bearerToken = authResponse.body.accessToken;
  const authHeader = {
    'Authorization': `Bearer ${bearerToken}`,
    'Content-Type': 'application/json',
  };
  const mailID = 'e77f3b48-71c8-11ed-a1eb-0242ac120002';
  await request.put(`/v0/mail/${mailID}/?mailbox=Inbox`)
    .set(authHeader).expect(404);
});
