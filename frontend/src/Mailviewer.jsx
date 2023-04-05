import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
/* All stuff for MUI */
import {TitleDrawer, NavbarDrawer, ReadingDrawer, ComposeDrawer}
  from './CustomDrawers';
import Table from '@mui/material/Table';
import IconButton from '@mui/material/IconButton';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import {yellow} from '@mui/material/colors';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import Avatar from '@mui/material/Avatar';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import DimensionsProvider from './DimensionsProvider';
import Box from '@mui/material/Box';
import {MboxContext, IsOpenContext, ReaderContext, UserContext, AllMailContext,
  ComposeContext} from './Contexts';
import './App.css';
// const titleHeight = 40;
const months = ['Jan ', 'Feb ', 'Mar ', 'Apr ', 'May ', 'Jun ', 'Jul ', 'Aug ',
  'Sep ', 'Oct ', 'Nov ', 'Dec '];
const todayObj = new Date();
/* Fetches all mail from database */
const fetchAllMail = (setAllMail, setError) => {
  console.log('fetchalll called');
  const item = localStorage.getItem('user');
  if (!item) {
    return;
  }
  const user = JSON.parse(item);
  console.log(JSON.stringify(user));
  const bearerToken = user ? user.accessToken : '';
  fetch('http://localhost:3010/v0/mail',
    {
      method: 'get',
      headers: new Headers({
        'Authorization': `Bearer ${bearerToken}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      }),
    })
    .then((response) => {
      if (!response.ok) {
        throw response;
      }
      return response.json();
    })
    .then((json) => {
      setError('');
      setAllMail(json);
      console.log('RETURNED' + JSON.stringify(json));
    })
    .catch((error) => {
      console.log('error, relog needed');
      console.log(error);
      const navigate = useNavigate();
      navigate('/login');
      setAllMail([]);
      setError(`${error.status} - ${error.statusText}`);
    });
};
/* fetches entire email by id */
const fetchEmailId = (ReaderId, setReaderEmail) => {
  console.log('fetching email id' + ReaderId);
  const item = localStorage.getItem('user');
  if (!item || ReaderId === -1) {
    console.log('uh oh ==================');
    setReaderEmail(undefined);
    return;
  }
  const user = JSON.parse(item);
  const bearerToken = user ? user.accessToken : '';
  fetch('http://localhost:3010/v0/mail/'+ReaderId,
    {
      method: 'get',
      headers: new Headers({
        'Authorization': `Bearer ${bearerToken}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      }),
    })
    .then((response) => {
      if (!response.ok) {
        throw response;
      }
      return response.json();
    })
    .then((json) => {
      console.log('reader emaiol set!!!!');
      setReaderEmail(json);
    })
    .catch((error) => {
      console.log('Error Fetching Content Email');
      console.log(error);
      setReaderEmail(undefined);
    });
};
/* updates starred status of email */
const updateStarredStatus = (id, isStarred, setAllMail, setError) => {
  console.log('updating starred email id' + id);
  const item = localStorage.getItem('user');
  if (!item) {
    return;
  }
  const user = JSON.parse(item);
  const bearerToken = user ? user.accessToken : '';
  fetch('http://localhost:3010/v0/starred/'+id + '/?isStarred=' + isStarred,
    {
      method: 'put',
      headers: new Headers({
        'Authorization': `Bearer ${bearerToken}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      }),
    })
    .then((response) => {
      if (!response.ok) {
        throw response;
      }
      fetchAllMail(setAllMail, setError);
    });
};
/* updates read status of email */
const updateReadStatus = (id, isRead, setAllMail, setError) => {
  console.log('updating read email id' + id);
  const item = localStorage.getItem('user');
  if (!item) {
    return;
  }
  const user = JSON.parse(item);
  const bearerToken = user ? user.accessToken : '';
  fetch('http://localhost:3010/v0/read/'+id + '/?isRead=' + isRead,
    {
      method: 'put',
      headers: new Headers({
        'Authorization': `Bearer ${bearerToken}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      }),
    })
    .then((response) => {
      if (!response.ok) {
        throw response;
      }
      fetchAllMail(setAllMail, setError);
    });
};
/** Mailviewer
* @return {object} JSX
*/
function Mailviewer() {
  /* Grab user from local storage to see if we renavigate */
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };
  const [allmail, setAllMail] = React.useState([]);
  const [error, setError] = React.useState('Logged Out');
  // Fetch all mail
  React.useEffect(() => {
    fetchAllMail(setAllMail, setError);
  }, []);
  // Grab all starred mail
  /* Calc all starred mail */
  const starredMail = [];
  for (let indexA = 0; indexA < allmail.length; indexA += 1) {
    for (let indexB = 0; indexB < allmail[indexA].mail.length; indexB += 1) {
      if (allmail[indexA].mail[indexB].starred === true) {
        starredMail.push(allmail[indexA].mail[indexB]);
      }
    }
  };
  // console.log('mailviewer.jsx user is  ' + JSON.stringify(user));
  /* Check if user exists */
  // if (!user) {
  //   navigate('/login');
  // } else {}
  // UI States //
  /* logout state */
  const [logoutOpen, changeLogoutOpen] = useState(false);
  /* Current Mailbox Selector State */
  const [Mbox, setMbox] = useState('Inbox');
  /* Navbar Open / Closed Toggle */
  const [NBarOpen, setNBarOpen] = useState(false);
  /* Compose Open */
  const [ComposeOpen, setComposeOpen] = useState(false);
  /* Reader email undefined = closed */
  const [readerEmail, setReaderEmail] = React.useState(undefined);
  /* Currtenly shown mail */
  const foundMailbox = allmail.find((element) => {
    return element.name === Mbox;
  });
  const starredOrEmptyArr = Mbox !== 'Starred' ? [] : starredMail;
  const currentMail = typeof(foundMailbox) === 'undefined' ? starredOrEmptyArr:
    foundMailbox.mail;
  /* */
  /* UI functions */
  const changeMbox = (type) => {
    setReaderEmail(undefined);
    setMbox(type.toString());
  };
  const changeNBarOpen = (bool) => {
    if ((NBarOpen === true) && (bool === false)) {
      setNBarOpen(bool);
    } else if ((NBarOpen === false) && (bool === true)) {
      setNBarOpen(bool);
    } else {
    }
  };
  const changeComposeOpen = (bool) => {
    if ((ComposeOpen === true) && (bool === false)) {
      setComposeOpen(bool);
    } else if ((ComposeOpen === false) && (bool === true)) {
      setComposeOpen(bool);
    } else {
    }
  };
  const handleClickedEmail = (target) => {
    // Fetch reader email
    updateReadStatus(target, !target.read, setAllMail, setError);
    changeNBarOpen(false);
    fetchEmailId(target, setReaderEmail);
  };
  const renderIconButton = (id) => {
    /* find email ref in current mail array */
    // console.log('render Icons current mail' + JSON.stringify(currentMail));
    const mailBox = allmail.findIndex((element) => {
      return element.name === Mbox;
    });
    if (mailBox > -1) {
      const email = allmail[mailBox].mail.find((email) => {
        return (email.id === id);
      });
      if (email.starred) {
        return (<StarIcon sx={{color: yellow[500]}}/>);
      } else {
        return (<StarBorderIcon />);
      }
    } else if (Mbox === 'Starred') {
      return (<StarIcon sx={{color: yellow[500]}}/>);
    } else {
      return (<StarBorderIcon />);
    }
  };
  const handleClickedStarred = (event, id) => {
    event.stopPropagation();
    /* find email ref in current mail array */
    const email = currentMail.find((email) => {
      return (email.id === id);
    });
    const isStarredNow = typeof(email) === 'undefined'? false : email.starred;
    updateStarredStatus(id, !isStarredNow, setAllMail, setError);
  };
  const renderFrom = (id) => {
    const mailBox = allmail.findIndex((element) => {
      return element.name === Mbox;
    });
    if (mailBox > -1) {
      const email = allmail[mailBox].mail.find((email) => {
        return (email.id === id);
      });
      if (email.read) {
        return (<TableCell><Typography>{email.from.name}
        </Typography></TableCell>);
      } else {
        return (<TableCell><Typography sx={{fontWeight: 'bold', m: 1}}>
          {email.from.name}</Typography></TableCell>);
      }
    } else if (Mbox === 'Starred') {
      for (let i=0; i < allmail.length; i += 1) {
        const email = allmail[i].mail.find((email) => {
          return (email.id === id);
        });
        if (typeof(email) !== 'undefined') {
          if (email.read) {
            return (<TableCell><Typography >{email.from.name}
            </Typography></TableCell>);
          } else {
            return (<TableCell><Typography sx={{fontWeight: 'bold', m: 1}}>
              {email.from.name}</Typography></TableCell>);
          }
        }
      }
    }
  };
  const renderSubject = (id) => {
    const mailBox = allmail.findIndex((element) => {
      return element.name === Mbox;
    });
    if (mailBox > -1) {
      const email = allmail[mailBox].mail.find((email) => {
        return (email.id === id);
      });
      if (email.read) {
        return (<TableCell><Typography>{email.subject}
        </Typography></TableCell>);
      } else {
        return (<TableCell><Typography sx={{fontWeight: 'bold', m: 1}}>
          {email.subject}</Typography></TableCell>);
      }
    } else if (Mbox === 'Starred') {
      for (let i=0; i < allmail.length; i += 1) {
        const email = allmail[i].mail.find((email) => {
          return (email.id === id);
        });
        if (typeof(email) !== 'undefined') {
          if (email.read) {
            return (<TableCell><Typography>{email.subject}
            </Typography></TableCell>);
          } else {
            return (<TableCell><Typography sx={{fontWeight: 'bold', m: 1}}>
              {email.subject}</Typography></TableCell>);
          }
        }
      }
    }
  };
  return (
    <Box>
      <DimensionsProvider>
        <UserContext.Provider value = {user}>
          <MboxContext.Provider value = {Mbox}>
            <IsOpenContext.Provider value = {{changeNBarOpen, NBarOpen,
              logoutOpen, changeLogoutOpen, changeComposeOpen, logout}}>
              <TitleDrawer />
            </IsOpenContext.Provider>
          </MboxContext.Provider>
        </UserContext.Provider>
      </DimensionsProvider>
      <DimensionsProvider>
        <AllMailContext.Provider value = {allmail}>
          <MboxContext.Provider value = {{Mbox, changeMbox}}>
            <IsOpenContext.Provider value = {{changeNBarOpen, NBarOpen}}>
              <NavbarDrawer />
            </IsOpenContext.Provider>
          </MboxContext.Provider>
        </AllMailContext.Provider>
      </DimensionsProvider>
      <Box
        sx={{ml: {xs: 0, md: 20}, mt: 10}}>
        <Table>
          <TableBody key = {error} >
            {currentMail.map((email, index) => (
              <TableRow role = 'button' key={index}
                name = {email.from.name + ' ' + email.subject}
                aria-label = {email.from.name + ' ' + email.subject} onClick =
                  {() => (handleClickedEmail(email.id))} hover>
                <TableCell>
                  <Avatar
                    alt='f'/>
                </TableCell>
                {renderFrom(email.id)}
                {renderSubject(email.id)}
                <TableCell>{dateFormatting(email.received)}</TableCell>
                <TableCell>{email.mailbox}</TableCell>
                <TableCell>
                  <IconButton onClick = {(event) =>
                    (handleClickedStarred(event, email.id))}
                  name = 'toggle drawer'
                  aria-label = 'toggle drawer'
                  role = 'button'>
                    {renderIconButton(email.id)}
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
      <DimensionsProvider>
        <ReaderContext.Provider value = {{setReaderEmail, readerEmail}}>
          <ReadingDrawer />
        </ReaderContext.Provider>
        <ComposeContext.Provider value = {{changeComposeOpen, ComposeOpen}}>
          <ComposeDrawer />
        </ComposeContext.Provider>
      </DimensionsProvider>
    </Box>
  );
}
/**
 * Formats how our dates are displayed.
 * @param {string} date string to format
 * @return {string} correctly formatted date according to spec
 */
function dateFormatting(date) {
  const dateObj = new Date(date);
  const todayStr = todayObj.getDate().toString() +
    todayObj.getMonth().toString() + todayObj.getFullYear().toString();
  const dateStr = dateObj.getDate().toString() +
    dateObj.getMonth().toString() + dateObj.getFullYear().toString();
  /* if it's today show hours:mins */
  if (todayStr === dateStr) {
    /* Add Leading 0 to hours and mins*/
    return dateObj.getHours().toString().padStart(2, '0') + ':' +
      dateObj.getMinutes().toString().padStart(2, '0');
    /* if its this year show month day */
  } else if (dateObj >
(new Date(todayObj.getFullYear()-1, todayObj.getMonth(),
  todayObj.getDate(), todayObj.getHours(), todayObj.getMinutes(),
  todayObj.getSeconds()))) {
    /* Add leading 0 */
    if (dateObj.getDate() < 10) {
      return months[dateObj.getMonth()] + '0' + dateObj.getDate();
    } else {
      return months[dateObj.getMonth()] + dateObj.getDate();
    }
  /* Otherwise return year*/
  } else {
    return dateObj.getFullYear();
  }
}
export default Mailviewer;
