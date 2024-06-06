import React, { useContext, useState, useEffect } from 'react';
import './SignupLogin.css';  // Ensure you have the CSS in a styles.css file
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { MyContext } from '../MyContext';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AuthForm = () => {
  const { backend_url, isLoggedIn, Login } = useContext(MyContext);
  const navigate = useNavigate();
  const [active, setActive] = useState(false);
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [signUpName, setSignUpName] = useState('');
  const [signUpUsername, setSignUpUsername] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [isSignInLoading, setIsSignInLoading] = useState(false);
  const [isSignUpLoading, setIsSignUpLoading] = useState(false);
  const [isOtpLoading, setIsOtpLoading] = useState(false);
  const [otpFrom, setOtpFrom] = useState(true);
  const [isSignUpDisabled, setIsSignUpDisabled] = useState(true);
  const [isUsernameValid, setIsUsernameValid] = useState(true);
  const [usernameError, setUsernameError] = useState('');

  const toggleForm = () => {
    setActive(!active);
  };

  useEffect(() => {
    if (isLoggedIn) {
      console.log(isLoggedIn);
      navigate("/");
    }
    // Check if the passwords match and enable/disable the sign-up button accordingly
    if (signUpPassword && confirmPassword && signUpPassword === confirmPassword) {
      setIsSignUpDisabled(false);
    } else {
      setIsSignUpDisabled(true);
    }
  }, [signUpPassword, confirmPassword]);

  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    setIsSignInLoading(true);
    try {
      const response = await axios.post(`${backend_url}/api/auth/login`, {
        email: signInEmail,
        password: signInPassword,
      });
      console.log('Sign In Response:', response.data);
      // Save the token in cookies
      Cookies.set('authToken', response.data.token.token, { expires: 7 }); // expires in 7 days
      toast.success('Login successful');
      Login();
      navigate('/');  // Redirect to home page
    } catch (error) {
      console.error('Sign In Error:', error);
      toast.error('Incorrect credentials');
    } finally {
      setIsSignInLoading(false);
    }
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    if (signUpPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    setIsSignUpLoading(true);
    try {
      const response = await axios.post(`${backend_url}/api/auth/send-otp`, {
        name: signUpName,
        username: signUpUsername,
        email: signUpEmail,
        password: signUpPassword,
      });
      console.log('Sign Up Response:', response.data);
      setOtpFrom(false); // Show OTP form after successful sign-up
    } catch (error) {
      console.error('Sign Up Error:', error);
      toast.error('Email already exists');
    } finally {
      setIsSignUpLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setIsOtpLoading(true);
    try {
      const response = await axios.post(`${backend_url}/api/auth/verify-otp`, {
        email: signUpEmail,
        otp: otp,
      });
      console.log('OTP Verification Response:', response.data);
      const token = response.data.token;
      // Save the token in cookies
      Login();
      Cookies.set('authToken', token.token, { expires: 7 }); // expires in 7 days
      toast.success('OTP verification successful');
      navigate('/');  // Redirect to home page
    } catch (error) {
      console.error('OTP Verification Error:', error);
      toast.error('Please enter valid OTP');
    } finally {
      setIsOtpLoading(false);
    }
  };

  const checkUsernameAvailability = async (username) => {
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(username)) {
      setIsUsernameValid(false);
      setUsernameError('No spaces and special characters allowed');
      return;
    }

    try {
      const response = await axios.post(`${backend_url}/api/auth/check-username`, { username });
      setIsUsernameValid(response.data.success);
      setUsernameError(response.data.message);
    } catch (error) {
      console.error('Username Check Error:', error);
      setIsUsernameValid(false);
      setUsernameError('This username is already Taken');
    }
  };

  return (
    <div>
      <ToastContainer />
      <section>
        <div className={`container ${active ? 'active' : ''}`}>
          <div className="user signinBx">
            <div className="imgBx">
              <img src="https://raw.githubusercontent.com/WoojinFive/CSS_Playground/master/Responsive%20Login%20and%20Registration%20Form/img1.jpg" alt="" />
            </div>
            <div className="formBx">
              <form onSubmit={handleSignInSubmit}>
                <h2>Sign In</h2>
                <input type="email" placeholder="Email" value={signInEmail} onChange={(e) => setSignInEmail(e.target.value)} required />
                <input type="password" placeholder="Password" value={signInPassword} onChange={(e) => setSignInPassword(e.target.value)} required />
                <input type="submit" value={isSignInLoading ? 'Please wait...' : 'Login'} disabled={isSignInLoading} />
                <p className="signup">
                  Don't have an account?
                  <Link onClick={toggleForm}>Sign Up.</Link>
                </p>
              </form>
            </div>
          </div>
          <div className="user signupBx">
            <div className="formBx">
              {otpFrom ? (
                <div>
                  <form onSubmit={handleSignUpSubmit}>
                    <h2>Create an account</h2>
                    <input type="text" placeholder="Name" value={signUpName} onChange={(e) => setSignUpName(e.target.value)} required />
                    <input type="text" placeholder="Username" value={signUpUsername} onChange={(e) => { setSignUpUsername(e.target.value); checkUsernameAvailability(e.target.value); }} required />
                    {!isUsernameValid && <p style={{color:"red"}}>{usernameError}</p>}
                    <input type="email" placeholder="Email Address" value={signUpEmail} onChange={(e) => setSignUpEmail(e.target.value)} required />
                    <input type="password" placeholder="Create Password" value={signUpPassword} onChange={(e) => setSignUpPassword(e.target.value)} required />
                    <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                    <input type="submit" value={isSignUpLoading ? 'Please wait...' : 'Sign Up'} disabled={isSignUpLoading || isSignUpDisabled || !isUsernameValid} />
                    <p className="signup">
                      Already have an account?
                      <Link onClick={toggleForm}>Sign in.</Link>
                    </p>
                  </form>
                </div>
              ) : (
                <form onSubmit={handleVerifyOtp}>
                  <h2>Verify OTP</h2>
                  <h2>Otp sent to {signUpEmail}</h2>
                  <input type="number" placeholder="Otp" value={otp} onChange={(e) => setOtp(e.target.value)} required />
                  <input type="submit" value={isOtpLoading ? 'Verifying...' : 'Verify'} disabled={isOtpLoading} />
                  <p className="signup">
                  </p>
                </form>
              )}
            </div>
            <div className="imgBx">
              <img src="https://raw.githubusercontent.com/WoojinFive/CSS_Playground/master/Responsive%20Login%20and%20Registration%20Form/img2.jpg" alt="" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AuthForm;
