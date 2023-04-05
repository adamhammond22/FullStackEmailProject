import {render, fireEvent, screen} from '@testing-library/react';
// import {rest} from 'msw';
// import {setupServer} from 'msw/node';
// import {screen} from '@testing-library/dom'
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import App from '../App';


// const URLMAILB = 'http://localhost:3010/v0/mailbox';
// const URLREAD = 'http://localhost:3010/v0/read';
// const URLSTAR = 'http://localhost:3010/v0/starred';
// const URLMAIL = 'http://localhost:3010/v0/mail';
// const server = setupServer(
//   rest.get(URL, (req, res, ctx) => {
//     return res(ctx.json({message: 'Hello CSE186'}));
//   }),
// );

// beforeAll(() => server.listen());
// afterEach(() => server.resetHandlers());
// afterAll(() => server.close());


/**
 */
test('App Renders', async () => {
  render(<App />);
});
test('Input bad credentials', async () => {
  render(<App />);
  // const avatar = document.getElementById('UserAvatar');
  // console.log(typeof(avatar));
  // fireEvent.click(avatar);
  // await screen.findByText('Logout');
  // const logout = document.getElementById('LogoutButton');
  // fireEvent.click(logout);
  const passwordBox = screen.getByPlaceholderText('password');
  const emailBox = screen.getByPlaceholderText('email@example.com');
  const loginButton = await screen.findByText('Log In');
  await userEvent.type(emailBox, 'bademail@gmail.com');
  await userEvent.type(passwordBox, 'badpassword');
  fireEvent.click(loginButton);
});
// test('Input good credentials', async () => {
//   render(<App />);
//   // const avatar = document.getElementById('UserAvatar');
//   // console.log(typeof(avatar));
//   // fireEvent.click(avatar);
//   // await screen.findByText('Logout');
//   // const logout = document.getElementById('LogoutButton');
//   // fireEvent.click(logout);
//   const passwordBox = document.getElementById('PasswordInput');
//   const emailBox = document.getElementById('EmailInput');
//   const loginButton = document.getElementById('Submit');
//   await userEvent.type(emailBox, 'mollymember@example.com');
//   await userEvent.type(passwordBox, 'mollymember');
//   await fireEvent.click(loginButton);
//   const trashButton = await screen.findByText('Trash');
//   await fireEvent.click(trashButton);
//   const sentbutton = await screen.findByText('Sent');
//   await fireEvent.click(sentbutton);
//   screen.debug();
// });
test('Input baddd credentials', async () => {
  render(<App />);
  // const avatar = document.getElementById('UserAvatar');
  // console.log(typeof(avatar));
  // fireEvent.click(avatar);
  // await screen.findByText('Logout');
  // const logout = document.getElementById('LogoutButton');
  // fireEvent.click(logout);
  const passwordBox = screen.getByPlaceholderText('password');
  const emailBox = screen.getByPlaceholderText('email@example.com');
  const loginButton = await screen.findByText('Log In');
  await userEvent.type(emailBox, 'bademail@gmail.com');
  await userEvent.type(passwordBox, 'badpassword');
  fireEvent.click(loginButton);
});
test('Logout and back in', async () => {
  render(<App />);
  // const avatar = document.getElementById('UserAvatar');
  // console.log(typeof(avatar));
  // fireEvent.click(avatar);
  // await screen.findByText('Logout');
  // const logout = document.getElementById('LogoutButton');
  // fireEvent.click(logout);
  const passwordBox = screen.getByPlaceholderText('password');
  const emailBox = screen.getByPlaceholderText('email@example.com');
  const loginButton = await screen.findByText('Log In');
  await userEvent.type(emailBox, 'mollymember@example.com');
  await userEvent.type(passwordBox, 'mollymember');
  fireEvent.click(loginButton);
  await screen.findByText('Inbox');
  const avatar = screen.getByTitle('Avatar');
  console.log(typeof(avatar));
  fireEvent.click(avatar);
  await screen.findByText('Logout');
  const logout = await screen.findByText('Logout');
  fireEvent.click(logout);
});
test('Open close reader', async () => {
  render(<App />);
  // const avatar = document.getElementById('UserAvatar');
  // console.log(typeof(avatar));
  // fireEvent.click(avatar);
  // await screen.findByText('Logout');
  // const logout = document.getElementById('LogoutButton');
  // fireEvent.click(logout);
  const passwordBox = screen.getByPlaceholderText('password');
  const emailBox = screen.getByPlaceholderText('email@example.com');
  const loginButton = await screen.findByText('Log In');
  // screen.debug();
  await userEvent.type(emailBox, 'mollymember@example.com');
  await userEvent.type(passwordBox, 'mollymember');
  await fireEvent.click(loginButton);
  const trashButton = await screen.findByText('Trash');
  await fireEvent.click(trashButton);
  const sentbutton = await screen.findByText('Sent');
  await fireEvent.click(sentbutton);
  const avatar = screen.getByTitle('Avatar');
  console.log(typeof(avatar));
  fireEvent.click(avatar);
  await screen.findByText('Logout');
  const logout = await screen.findByText('Logout');
  fireEvent.click(logout);
  // screen.debug();
});
test('Custom Drawers Error Handling', async () => {
  // const URL = 'http://localhost:3010/v0/mail';
  // const server = setupServer(
  //   rest.get(URLMAILB, (req, res, ctx) => {
  //     return res(ctx.status(500));
  //   }),
  // );
  render(<App />);
  // const avatar = document.getElementById('UserAvatar');
  // console.log(typeof(avatar));
  // fireEvent.click(avatar);
  // await screen.findByText('Logout');
  // const logout = document.getElementById('LogoutButton');
  // fireEvent.click(logout);
  const passwordBox = screen.getByPlaceholderText('password');
  const emailBox = screen.getByPlaceholderText('email@example.com');
  const loginButton = await screen.findByText('Log In');
  await userEvent.type(emailBox, 'mollymember@example.com');
  await userEvent.type(passwordBox, 'mollymember');
  await fireEvent.click(loginButton);
  const trashButton = await screen.findByText('Trash');
  fireEvent.click(trashButton);
  const emailrow = await screen.findByText('Ibrahim Diwell');
  // screen.debug(emailrow.parentNode.parentNode, Infinity);
  console.log('here **************************');
  fireEvent.click(emailrow);
});
