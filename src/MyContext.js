import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

// Create a Context
export const MyContext = createContext();

// Create a provider component
export const MyProvider = ({ children }) => {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const backend_url = "";
  
    const [notifications, setNotifications] = useState([]);
    const [totalNotifications, setTotalNotifications] = useState(0);
  const [userData, setUserData] = useState({
    name: "",
    email: ""
  });
  const [unreadNotifications, setUnreadNotifications] = useState(0);

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


  const token = Cookies.get('authToken');

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`${backend_url}/api/notifications`, {
          headers: {
            'token': token
          }
        });
        const fetchedNotifications = response.data.notifications;
        setNotifications(fetchedNotifications);
        setTotalNotifications(fetchedNotifications.length);
        setUnreadNotifications(fetchedNotifications.filter(notification => !notification.read).length);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, [backend_url, token]);

  
  const markAsRead = async (notificationId) => {
    try {
      await axios.patch(`${backend_url}/api/notifications/${notificationId}/read`, {}, {
        headers: {
          'token': token
        }
      });
      setNotifications(notifications.map(n => n._id === notificationId ? { ...n, read: true } : n));
      setUnreadNotifications(prev => prev - 1);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

const Login=()=>{
  setLoggedIn(true)
}
const Logout=()=>{
  Cookies.remove('authToken')
  setLoggedIn(false)
}
  return (
    <MyContext.Provider value={{ backend_url, isLoggedIn, setLoggedIn, userData, setUserData ,Login,Logout,markAsRead,notifications,totalNotifications,setUnreadNotifications,unreadNotifications}}>
      {children}
    </MyContext.Provider>
  );
};
