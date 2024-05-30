import React from 'react'
import './BottomNav.css'
import { Link } from 'react-router-dom'

export default function BottomNav() {
  return (
    <div>
<nav class="navbar navbar-light bg-white border navbar-expand fixed-bottom">
  <ul class="navbar-nav nav-justified w-100">

    <li class="nav-item"><a class="nav-link position-relative active" href="/nurse/default/index">
        <div class="nav-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg></div>Home
      </a></li>
    <li class="nav-item"><a class="nav-link position-relative" href="/nurse/quiz">
        <div class="nav-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="8" r="7"></circle>
            <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
          </svg></div>Kuis
      </a></li>
    <li class="nav-item"><a class="nav-link position-relative" href="/nurse/pregnancy-class">
        <div class="nav-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
            <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
          </svg></div>Kelas
      </a></li>
    <li class="nav-item"><a class="nav-link position-relative" href="/notification">
        <div class="nav-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg></div>Notifikasi
      </a></li>

  </ul>
</nav>



<div id="mybutton">
  <Link to="/post-form">
<button class="feedback">+</button>
  </Link>
</div>
    </div>
  )
}
