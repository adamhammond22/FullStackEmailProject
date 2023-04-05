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

// test('POST Mailbox', async () => {
//   const user = {email: 'mollymember@example.com', password: 'mollymember'};
//   const authResponse = await request.post('/v0/login')
//     .send(JSON.stringify(user))
//     .set({'Content-Type': 'application/json'})
//     .expect(200);
//   const bearerToken = authResponse.body.accessToken;
//   const authHeader = {
//     'Authorization': `Bearer ${bearerToken}`,
//     'Content-Type': 'application/json',
//   };
//   const newMailbox = {
//     'name': 'NewMailboxnamEE',
//     'mail': [],
//   };
//   const responseEmail = await request.post('/v0/mailbox').set(authHeader)
//     .send(newMailbox).expect(201);
// });
test('GET Mailbox', async () => {
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
  const email = encodeURIComponent('mollymember@example.com');
  const query = '/?owner=' + email;
  const response = await request.get(`/v0/mailbox${query}`).set(authHeader)
    .expect(200);
  expect(response.body.length).toBeGreaterThan(2);
});

