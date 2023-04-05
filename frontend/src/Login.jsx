import React from 'react';
import {useNavigate} from 'react-router-dom';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
// import {LoginContext} from './Contexts';
// Structure copied from Prof. Harrisons login book example
/**
 * Login React function
 * @return {object} JSX
 **/
function Login() {
  const [user, setUser] = React.useState({email: '', password: ''});
  const history = useNavigate();
  // const setitem = useContext(LoginContext);

  /* Keeps state of inputted user up to date */
  const handleInputChange = (event) => {
    const {value, name} = event.target;
    const u = user;
    u[name] = value;
    setUser(u);
  };

  /* Queries server for inputted user email and password */
  const onSubmit = (event) => {
    console.log('submitted');
    console.log(JSON.stringify(user));
    event.preventDefault();
    console.log('submitted222');
    fetch('http://localhost:3010/v0/login', {
      method: 'POST',
      body: JSON.stringify(user),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        console.log('then1');
        if (!res.ok) {
          console.log('res not ok?');
          throw res;
        }
        return res.json();
      })
      .then((json) => {
        console.log('then2');
        /* add email to local storage */
        json.email = user.email;
        /* Set local user json and go to mailviewer */
        console.log('login.jsx user set to ' + JSON.stringify(json));
        localStorage.setItem('user', JSON.stringify(json));
        const event = new Event('storage');
        event.newValue = JSON.stringify(json);
        window.dispatchEvent(event);
        console.log('navigating...');
        history('/');
      })
      /* On failed query, alert user */
      .catch((err) => {
        alert('Error logging in, please try again');
        console.log(err);
      });
  };

  return (
    <Container
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <h3>CSE186 Assignment 8 Login</h3>
      <input
        id = 'EmailInput'
        type='email'
        name='email'
        required
        placeholder='email@example.com'
        onChange={handleInputChange}
      />
      <input
        id = 'PasswordInput'
        type='password'
        name='password'
        required
        placeholder='password'
        onChange={handleInputChange}
      />
      <Button type='submit' value='Login'id = 'Submit'
        style={{
          width: 150, height: 40,
        }}
        onClick={onSubmit}>
        Log In
      </Button>
    </Container>
  );
}

export default Login;
