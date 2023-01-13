import React, { useState } from 'react';
import { Avatar, Button, Paper, Grid, Typography, Container } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { useHistory } from 'react-router-dom';
import jwtDecode from 'jwt-decode';

import useStyles from './styles';
import Input from './Input';
import { gosignin, signin, signup } from '../../actions/auth';

const initialState = { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' };

const Auth = () => {
  const classes = useStyles();
  const [showPassword, setShowPassword] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const history = useHistory();

  const handleShowPassword = () => setShowPassword((prevShowPassword) => !prevShowPassword);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if(isSignup) {
      dispatch(signup(formData, history));
    } else {
      dispatch(signin(formData, history));
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  };

  const switchMode = () => {
    setIsSignup((prevIsSignup) => !prevIsSignup);
    setShowPassword(false);
  };

  const googleSuccess = async (res) => {
    const result = jwtDecode(res.credential); 
    // console.log(result);
    dispatch(gosignin(result, history));
      // jwt token is there as coded format in oauth2.0
      // we do so to always send only decoded oauth credential to reducer by dispatch
  };

  const googleFailure = (error) => {
    console.log('Google Sign In was unsuccessful. Try Again Later');
    console.log(error);
  };

  return (
    <Container component='main' maxWidth='xs'>
      <Paper className={classes.paper} elevation={3}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography variant='h5'>{isSignup ? 'Sign Up' : 'Sign In'}</Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {isSignup && (
              <>
                <Input name='firstName' label='First Name' handleChange={handleChange} half />
                <Input name='lastName' label='Last Name' handleChange={handleChange} half />
              </>
            )
            }
            <Input name='email' label='Email Address' handleChange={handleChange} type='email' />
            <Input name='password' label='Password' handleChange={handleChange} type={showPassword ? 'text' : 'password'} handleShowPassword={handleShowPassword} />
            {isSignup && <Input name='confirmPassword' label='Repeat Password' handleChange={handleChange} type='password' />}
          </Grid>
          <Button type='submit' fullWidth variant='contained' color='primary' className={classes.submit}>
            {isSignup ? 'Sign Up' : 'Sign In'}
          </Button>
          <Button fullWidth style={{ backgroundColor: 'white', marginBottom: '10px' }}>
            <GoogleOAuthProvider
              clientId='**CLIENT_ID**'>
              <div id="signInButton">
              <GoogleLogin
                onSuccess={googleSuccess}
                onError={googleFailure}
                cookiePolicy='single_host_origin'
                GsiButtonConfiguration
              />
              </div>
            </GoogleOAuthProvider>
          </Button>
          <Grid container justifyContent='flex-end'>
            <Grid item>
              <Button onClick={switchMode}>
                {isSignup ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default Auth;