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

test('PUT starred', async () => {
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
  const sentMail = await request.get('/v0/mail/?mailbox=Sent').set(authHeader)
    .expect(200);
  const mailID = sentMail.body[0].mail[0].id;
  await request.put(`/v0/starred/${mailID}/?isStarred=false`)
    .set(authHeader).expect(201);
});
test('PUT starred invalid ID', async () => {
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
  await request.put(`/v0/starred/${mailID}/?isStarred=false`)
    .set(authHeader).expect(404);
});
test('PUT read', async () => {
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
  const sentMail = await request.get('/v0/mail/?mailbox=Sent').set(authHeader)
    .expect(200);
  const mailID = sentMail.body[0].mail[0].id;
  await request.put(`/v0/read/${mailID}/?isRead=false`)
    .set(authHeader).expect(201);
});
test('PUT read invalid ID', async () => {
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
  await request.put(`/v0/read/${mailID}/?isRead=false`)
    .set(authHeader).expect(404);
});
