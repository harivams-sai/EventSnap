import React, { useState, useEffect } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { AppBar, Avatar, Typography, Toolbar, Button } from '@material-ui/core';
import { useDispatch } from 'react-redux';

import useStyles from './styles';
import eventsnapLogo from "../../images/eventsnap-logo.png";
import eventsnapText from "../../images/eventsnap-text.jpg";
import jwtDecode from 'jwt-decode';

const Navbar = () => {
  const classes = useStyles();
  const [ user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();

  const logout = async () => {
    setUser(null);
    dispatch({ type: 'LOGOUT' });
    history.push('/');
  }
  // console.log(user);

  useEffect(() => {
    if(user) {
      const token = user?.token;
      const decodedToken = jwtDecode(token);
      if(decodedToken.exp * 1000 < new Date().getTime()) logout();
    }

    setUser(JSON.parse(localStorage.getItem('profile')));
  }, [location]);


  return (
    <AppBar className={classes.appBar} position="static" color="inherit">
      <Link to="/" className={classes.brandContainer}>
        <img src={eventsnapText} alt="icon" height="45px" />
        <img className={classes.image} src={eventsnapLogo} alt="icon" height="40px" />
      </Link>
      <Toolbar className={classes.toolbar}>
        { user?.result ? (
          <div className={classes.profile}>
            <Avatar className={classes.purple} alt={user.result.name} src={user.result.picture}>{user.result.name.charAt(0)}</Avatar>
            <Typography className={classes.userName} variant="h6">{user.result.name}</Typography>
            <Button variant="contained" color="secondary" onClick={logout}>Logout</Button>
          </div>
        ):(
          <Button component={Link} to="/auth" variant="contained" color="primary">Sign In</Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
