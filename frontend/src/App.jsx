import React from 'react';
// import {LoginContext} from './Contexts';

import {BrowserRouter, Route, Routes} from 'react-router-dom';

import Login from './Login';
import Mailviewer from './Mailviewer';
/**
 * Simple component with no state.
 *
 * @return {object} JSX
 */
function App() {
  // const [item, setItem] = React.useState(undefined);
  // const setitem = (item) => {
  //   console.log('setitemcalled');
  //   setItem(localStorage.getItem('user'));
  // };
  // React.useEffect(() => {
  //   setItem(localStorage.getItem('user'));
  // }, []);
  // console.log('item' + item);
  const [isUserLoggedIn, setIsUserLoggedIn] =
    React.useState(localStorage.getItem('user'));
  React.useEffect(() => {
    const onStorage = () => {
      console.log('onstorage');
      setIsUserLoggedIn(localStorage.getItem('user'));
      console.log(localStorage.getItem('user'));
    };
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener('storage', onStorage);
    };
  }, [isUserLoggedIn]);
  console.log(setIsUserLoggedIn);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element = {isUserLoggedIn ?<Mailviewer />: <Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
