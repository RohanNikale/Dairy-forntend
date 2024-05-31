import React, { useState } from 'react';
import './SignupLogin.css';  // Ensure you have the CSS in a styles.css file
import { Link } from 'react-router-dom';

const AuthForm = () => {
  const [active, setActive] = useState(false);
  const [signInUsername, setSignInUsername] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [signUpUsername, setSignUpUsername] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [isSignInLoading, setIsSignInLoading] = useState(false);
  const [isSignUpLoading, setIsSignUpLoading] = useState(false);
  const [isOtpLoading, setIsOtpLoading] = useState(false);
  const [otpFrom, setOtpFrom] = useState(true);

  const toggleForm = () => {
    setActive(!active);
  };

  const handleSignInSubmit = (e) => {
    e.preventDefault();
    setIsSignInLoading(true);
    // Simulate request
    setTimeout(() => {
      setIsSignInLoading(false);
      console.log('Sign In:', signInUsername, signInPassword);
    }, 2000); // Replace with actual request
  };

  const handleSignUpSubmit = (e) => {
    e.preventDefault();
    setIsSignUpLoading(true);
    // Simulate request
    setTimeout(() => {
      setOtpFrom(false);
      setIsSignUpLoading(false);
      console.log('Sign Up:', signUpUsername, signUpEmail, signUpPassword, confirmPassword);
    }, 2000); // Replace with actual request
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setIsOtpLoading(true);
    // Simulate request
    setTimeout(() => {
      setIsOtpLoading(false);
      console.log('OTP:', otp);
    }, 2000); // Replace with actual request
  };

  return (
    <div>
      <section>
        <div className={`container ${active ? 'active' : ''}`}>
          <div className="user signinBx">
            <div className="imgBx">
              <img src="https://raw.githubusercontent.com/WoojinFive/CSS_Playground/master/Responsive%20Login%20and%20Registration%20Form/img1.jpg" alt="" />
            </div>
            <div className="formBx">
              <form onSubmit={handleSignInSubmit}>
                <h2>Sign In</h2>
                <input type="text" placeholder="Username" value={signInUsername} onChange={(e) => setSignInUsername(e.target.value)} required />
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
                    <input type="text" placeholder="Username" value={signUpUsername} onChange={(e) => setSignUpUsername(e.target.value)} required />
                    <input type="email" placeholder="Email Address" value={signUpEmail} onChange={(e) => setSignUpEmail(e.target.value)} required />
                    <input type="password" placeholder="Create Password" value={signUpPassword} onChange={(e) => setSignUpPassword(e.target.value)} required />
                    <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                    <input type="submit" value={isSignUpLoading ? 'Please wait...' : 'Sign Up'} disabled={isSignUpLoading} />
                    <p className="signup">
                      Already have an account?  
                      <Link onClick={toggleForm}>Sign in.</Link>
                    </p>
                  </form>
                </div>
              ) : (
                <form onSubmit={handleVerifyOtp}>
                  <h2>Create an account</h2>
                  <h2>Otp sent on {signUpEmail}</h2>
                  <input type="number" placeholder="Otp" value={otp} onChange={(e) => setOtp(e.target.value)} required />
                  <input type="submit" value={isOtpLoading ? 'Verifing...' : 'Verify'} disabled={isOtpLoading} />
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
