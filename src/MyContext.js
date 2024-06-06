import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

// Create a Context
export const MyContext = createContext();

// Create a provider component
export const MyProvider = ({ children }) => {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const backend_url = "http://localhost:5000";
  const [userData, setUserData] = useState({
    name: "",
    email: ""
  });

  useEffect(() => {
    const fetchUser = async () => {
      const token = Cookies.get('authToken');
      if (token) {
        try {
          const response = await axios.get(`${backend_url}/api/user`, {
            headers: {
              token: ` ${token}`
            }
          });
          setUserData(response.data.user);
          setLoggedIn(true);
        } catch (error) {
          console.error('Fetch User Error:', error);
        }
      }
    };

    fetchUser();
  }, []);
const Login=()=>{
  setLoggedIn(true)
}
const Logout=()=>{
  Cookies.remove('authToken')
  setLoggedIn(false)
}
  return (
    <MyContext.Provider value={{ backend_url, isLoggedIn, setLoggedIn, userData, setUserData ,Login,Logout}}>
      {children}
    </MyContext.Provider>
  );
};
