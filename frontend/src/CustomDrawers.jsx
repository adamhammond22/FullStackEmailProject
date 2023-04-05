import React, {useContext} from 'react';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import MenuIcon from '@mui/icons-material/Menu';
import ListItem from '@mui/material/ListItem';
import Stack from '@mui/material/Stack';
import CloseIcon from '@mui/icons-material/Close';
import EmailIcon from '@mui/icons-material/Email';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import Avatar from '@mui/material/Avatar';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Divider from '@mui/material/Divider';
import {green} from '@mui/material/colors';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import ListItemButton from '@mui/material/ListItemButton';
import {MboxContext, IsOpenContext, ReaderContext, UserContext, AllMailContext,
  ComposeContext} from './Contexts';
import ResponsiveLayout from './ResponsiveLayout';
import Toolbar from '@mui/material/Toolbar';
const titleHeight = 70;
const drawerWidth = 150;
/* queries server for mailboxes to display */
const fetchMailboxes = (setMailboxes, setError) => {
  console.log('fetchmailboxes');
  const item = localStorage.getItem('user');
  if (!item) {
    setError('error');
    return;
  }
  const user = JSON.parse(item);
  const bearerToken = user ? user.accessToken : '';
  console.log('got to fetching');
  fetch('http://localhost:3010/v0/mailbox/?owner='+encodeURIComponent(user.email),
    {
      method: 'get',
      headers: new Headers({
        'Authorization': `Bearer ${bearerToken}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      }),
    })
    .then((response) => {
      if (!response.ok) {
        console.log('thinks its not good');
        throw response;
      }
      return response.json();
    })
    .then((json) => {
      setError('');
      json.push('Starred');
      setMailboxes(json);
    })
    .catch((error) => {
      console.log('error');

      console.log(error);
      setMailboxes([]);
      setError(`${error.status} - ${error.statusText}`);
    });
};
/*
Smattering of code is grabbed and repurposed by react. If MOSS goes off for
anything it'llprobably be the "Responsive App bar with Drawer
https://mui.com/material-ui/react-app-bar/"The rest is from a variety of
sources and all modified for my own purposes, no copy/paste.
*/
/**
 * Title Drawer creator
 * @return {object} JSX
 */
function TitleDrawer() {
  const Mbox = useContext(MboxContext);
  const {changeNBarOpen, NBarOpen, changeLogoutOpen, logoutOpen,
    changeComposeOpen, logout} = useContext(IsOpenContext);
  const user = useContext(UserContext);
  const username = user? user.name: '';
  const useremail = user? user.email: '';
  const useravatarurl = user? user.avatarurl: '';
  const toggleIsOpen = NBarOpen === true? false : true;
  const toggleLoggout = logoutOpen === true? false : true;
  /* logs user out */
  return (
    <Box
      sx={{mb: 5}}>
      <Drawer anchor = 'top' variant = 'permanent'
        sx = {{
          '& .MuiDrawer-paper': {fontSize: 30, pl: 5, height: titleHeight,
            bgcolor: 'green', mb: 20},
        }}
        onClick = {() => (changeNBarOpen(false))}>
        <Toolbar>
          <ResponsiveLayout
            renderDefault={() => (
              <div />
            )}
            renderNarrow={() => (
              <IconButton onClick = {() => (changeNBarOpen(toggleIsOpen))}
                name = 'toggle drawer'
                aria-label = 'toggle drawer'
                role = 'button'>
                <MenuIcon />
              </IconButton>
            )}
          >
          </ResponsiveLayout>
          <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
            {useremail + `'s Mail - ` + Mbox}
          </Typography>
          <IconButton onClick = {() => (changeComposeOpen(true))}
            name = 'compose'
            aria-label = 'compose'
            role = 'button'>
            <EmailIcon />
          </IconButton>
          <Avatar alt={username} src={useravatarurl} id='UserAvatar'
            title = 'Avatar'
            onClick = {() => changeLogoutOpen(toggleLoggout)}
            role = 'button'/>
          <Button onClick = {() => (logout())}
            color = 'inherit'
            id = 'LogoutButton'
            variant='contained'
            name = 'logout'
            aria-label = 'logout'
            role = 'button'
            style={{display: logoutOpen ? 'block' : 'none'}}
            sx = {{
              ml: 1,
            }}>
          Logout
          </Button>
        </Toolbar>
      </Drawer>
    </Box>
  );
};
/**
 * Navbar Drawer creator
 * @return {object} JSX
 */
function NavbarDrawer() {
  // State of mailboxes and error state
  const [mailboxes, setMailboxes] = React.useState([]);
  const [error, setError] = React.useState('Logged Out');
  // Fetch mailboxes
  React.useEffect(() => {
    fetchMailboxes(setMailboxes, setError);
  }, []);

  // Needs context for current mailbox state changing function in App
  const {Mbox, changeMbox} = useContext(MboxContext);
  const allmail = useContext(AllMailContext);
  /* Calc all starred mail */
  const starredMail = [];
  for (let indexA = 0; indexA < allmail.length; indexA += 1) {
    for (let indexB = 0; indexB < allmail[indexA].mail.length; indexB += 1) {
      if (allmail[indexA].mail[indexB].starred === true) {
        starredMail.push(allmail[indexA].mail[indexB]);
      }
    }
  }
  // Finds number of mail in mailbox, returns as string
  const findMailNumber = (type) => {
    /*  Must check all mail for starred */
    if (type === 'Starred') {
      return starredMail.length.toString();
    } else {
      const foundMailbox = allmail.find((element) => {
        return element.name === type;
      });
      const mailNumber = foundMailbox === undefined?
        '':foundMailbox.mail.length.toString();
      return mailNumber;
    }
  };
  const {changeNBarOpen, NBarOpen} = useContext(IsOpenContext);
  const visible = NBarOpen? 'block' : 'none';
  return (
    <Box
      sx={{width: {sm: drawerWidth}}}
      label="mailbox folders">
      <ResponsiveLayout
        renderDefault={() => (
          <Drawer
            label = 'DefaultNavbaer'
            variant = 'permanent'
            anchor = 'left'
            PaperProps = {{style: {top: titleHeight + 25}}}
            containerstyle = {{height: `calc(100% - ${titleHeight}px)`,
              top: 80}}
            sx={{
              '& .MuiDrawer-paper': {boxSizing: 'border-box',
                width: drawerWidth,
                fontSize: {pt: 10, md: 30}},
            }}
          >
            <List>
              { mailboxes.map((type, index) => (
                <ListItemButton role = 'button' key = {index} onClick={()=>
                  (changeMbox(type))}
                sx = {{
                  display: 'flex',
                  justifyContent: 'space-between',
                  border: type === Mbox? 5: 0,
                  borderColor: green[500],
                }}>
                  <Typography>
                    {type}
                  </Typography>
                  <Typography>
                    {findMailNumber(type)}
                  </Typography>
                </ListItemButton>

              ))}
            </List>
          </Drawer>
        )}
        renderNarrow = { () => (
          <Drawer
            label = 'NarrowNavbar'
            variant = 'persistent'
            anchor = 'left'
            open = {NBarOpen}
            PaperProps = {{style: {top: titleHeight + 20}}}
            containerstyle = {{height: `calc(100% - ${titleHeight}px)`,
              top: 80}}
            sx={{
              '& .MuiDrawer-paper': {boxSizing: 'border-box',
                display: visible,
                width: drawerWidth,
                fontSize: {pt: 10, md: 30}},
            }}
          >
            <List>
              { mailboxes.map((type, index) => (
                <ListItemButton role = 'button' key = {index} onClick={() =>
                  ((changeMbox(type), changeNBarOpen(false)))}
                sx = {{
                  display: 'flex',
                  justifyContent: 'space-between',
                }}>
                  <Typography>
                    {type}
                  </Typography>
                  <Typography>
                    {findMailNumber(type)}
                  </Typography>
                </ListItemButton>
              ))}
              <ListItem key = {error} />
            </List>
          </Drawer>
        )}
      >
      </ResponsiveLayout>
    </Box>
  );
};
/**
 * Reading Drawer creator
 *
 * @return {object} JSX
 */
function ReadingDrawer() {
  // Needs context for current reader id state in App
  const {setReaderEmail, readerEmail} = useContext(ReaderContext);
  const IsOpen = readerEmail === undefined? false : true;
  const dummyEmail = {'id': 1, 'mailbox': 'trash', 'to': {'name': '',
    'address': ''}, 'from': {'name': '',
    'address': ''}, 'received': '2022-03-01T22:51:13Z',
  'subject': '', 'content': ''};
  const visible = IsOpen? 'block' : 'none';
  const emailToRead = typeof readerEmail === 'undefined'? dummyEmail :
    readerEmail;
  return (
    <Box
      sx={{width: {xs: `calc(100%)`, md: `calc(100% - ${drawerWidth}px)`,
        ml: 50}}}
      label="ReaderBox">
      <ResponsiveLayout
        renderDefault={() => (
          <Drawer
            label = 'DefaultReader'
            variant = 'persistent'
            anchor = 'bottom'
            open = {IsOpen}
            PaperProps = {{style: {top: {xs: 0, md: 50}}}}
            sx={{
              '& .MuiDrawer-paper': {boxSizing: 'border-box',
                width: `calc(100% - ${drawerWidth}px)`,
                ml: 20,
                display: visible,
                height: `calc(50%)`,
                fontSize: {pt: 10, sm: 30}},
            }}
          >
            <Toolbar>
              <ListItem key = '0'>
                {emailToRead.subject}
              </ListItem>
              <ListItemButton role = 'button'
                key = '1'
                aria-label = 'close desktop reader'
                name = 'close desktop reader'
                onClick={() =>
                  (setReaderEmail(undefined))}>
                <CloseIcon />
              </ListItemButton>
            </Toolbar>
            <Divider />
            <p>
              {'From: ' + emailToRead.from.name+
                ' ('+emailToRead.from.email+')'}
            </p>
            <p>
              {'To: ' + emailToRead.to.name +' ('+emailToRead.to.email+')'}
            </p>
            <p>
              {'Subject: ' + emailToRead.subject}
            </p>
            <p>
              {'Received: ' + emailToRead.received}
            </p>
            <p>
              {emailToRead.content}
            </p>

          </Drawer>
        )}
        renderNarrow = { () => (
          <Drawer
            label = 'NarrowReader'
            variant = 'persistent'
            anchor = 'bottom'
            open = {IsOpen}
            // PaperProps = {{style: {top: titleHeight + 20}}}
            sx={{
              '& .MuiDrawer-paper': {boxSizing: 'border-box',
                width: `calc(100%)`,
                display: visible,
                height: `calc(100%)`,
                fontSize: {pt: 10, sm: 30}},
            }}
          >
            <Toolbar>
              <ListItem key = '0'>
                {emailToRead.subject}
              </ListItem>
              <ListItemButton role = 'button'
                aria-label = 'close mobile reader'
                name = 'close mobile reader'
                key = '1'
                onClick={() =>(setReaderEmail(undefined))}
                sx = {{width: 80}}>
                <CloseIcon />
              </ListItemButton>
            </Toolbar>
            <Divider />
            <p>
              {'From: ' + emailToRead.from.name +' ('+
                emailToRead.from.email+')'}
            </p>
            <p>
              {'To: ' + emailToRead.to.name +' ('+emailToRead.to.email+')'}
            </p>
            <p>
              {'Subject: ' + emailToRead.subject}
            </p>
            <p>
              {'Received: ' + emailToRead.received}
            </p>
            <p>
              {emailToRead.content}
            </p>
          </Drawer>
        )}
      >
      </ResponsiveLayout>
    </Box>
  );
};
/**
 * Compose Drawer creator
 *
 * @return {object} JSX
 */
function ComposeDrawer() {
  // Needs context for current reader id state in AppLogo
  const {ComposeOpen, changeComposeOpen} = useContext(ComposeContext);
  const visible = ComposeOpen? 'block' : 'none';
  return (
    <Box
      sx={{width: {xs: `calc(100%)`, md: `calc(100% - ${drawerWidth}px)`,
        ml: 50}}}
      label="ReaderBox">
      <ResponsiveLayout
        renderDefault={() => (
          <Drawer
            label = 'DefaultReader'
            variant = 'persistent'
            anchor = 'bottom'
            open = {ComposeOpen}
            PaperProps = {{style: {top: {xs: 0, md: 50}}}}
            sx={{
              '& .MuiDrawer-paper': {boxSizing: 'border-box',
                width: `calc(100% - ${drawerWidth}px)`,
                ml: 20,
                display: visible,
                height: `calc(80%)`,
                fontSize: {pt: 10, sm: 30}},
            }}
          >
            <Toolbar>
              <Stack direction="row" sx =
                {{display: 'flex', width: `calc(100%)`}} >
                <ListItemButton role = 'button'
                  aria-label = 'close composer'
                  name = 'close composer'
                  key = '1'
                  onClick={() =>(changeComposeOpen(false))}
                  sx = {{width: 80}}>
                  <ChevronLeftIcon />
                </ListItemButton>
                <Typography align = 'center'
                  sx = {{width: 200, flexGrow: 20, display: 'flex'}}
                  variant = 'h4'>Compose Email</Typography>
                <ListItemButton role = 'button'
                  aria-label = 'send mail'
                  name = 'send mail'
                  key = '2'
                  sx = {{width: 80}}>
                  <ArrowForwardIcon />
                </ListItemButton>
              </ Stack>
            </Toolbar>
            <Stack direction="row">
              <TextField id="standard-basic" label="To" variant="standard"
                sx = {{width: `calc(100%)`, flexGrow: 1}}/>
              <ArrowDropDownIcon sx = {{fontSize: 50}} />
            </Stack>
            <TextField id="standard-basic" label="Subject" variant="standard"
              sx = {{width: `calc(100%)`}}/>
            <TextField id="standard-basic" label="Content"
              sx = {{width: `calc(100%)`}}
              maxRows={Infinity}/>
            <Divider />
          </Drawer>
        )}
        renderNarrow = { () => (
          <Drawer
            label = 'NarrowReader'
            variant = 'persistent'
            anchor = 'bottom'
            open = {ComposeOpen}
            // PaperProps = {{style: {top: titleHeight + 20}}}
            sx={{
              '& .MuiDrawer-paper': {boxSizing: 'border-box',
                width: `calc(100%)`,
                display: visible,
                height: `calc(100%)`,
                fontSize: {pt: 10, sm: 30}},
            }}
          >
            <Toolbar>
              <Stack direction="row" sx =
                {{display: 'flex', width: `calc(100%)`}} >
                <ListItemButton role = 'button'
                  aria-label = 'close composer'
                  name = 'close composer'
                  key = '1'
                  onClick={() =>(changeComposeOpen(false))}
                  sx = {{width: 80}}>
                  <ChevronLeftIcon />
                </ListItemButton>
                <Typography align = 'center'
                  sx = {{width: 200, flexGrow: 20, display: 'flex'}}
                  variant = 'h4'>Compose Email</Typography>
                <ListItemButton role = 'button'
                  aria-label = 'send mail'
                  name = 'send mail'
                  key = '2'
                  sx = {{width: 80}}>
                  <ArrowForwardIcon />
                </ListItemButton>
              </ Stack>
            </Toolbar>
            <Stack direction="row">
              <TextField id="standard-basic" label="To" variant="standard"
                sx = {{width: `calc(100%)`, flexGrow: 1}}/>
              <ArrowDropDownIcon sx = {{fontSize: 50}} />
            </Stack>
            <TextField id="standard-basic" label="Subject" variant="standard"
              sx = {{width: `calc(100%)`}}/>
            <TextField id="standard-basic" label="Content"
              sx = {{width: `calc(100%)`}}
              maxRows={Infinity}/>
            <Divider />
          </Drawer>
        )}
      >
      </ResponsiveLayout>
    </Box>
  );
};
export {ComposeDrawer};
export {ReadingDrawer};
export {TitleDrawer};
export {NavbarDrawer};
