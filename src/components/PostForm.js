import React from 'react'
import "./PostForm.css"
import TinyMCE from './TinyMCE'
export default function PostForm() {
  return (
    <div>
      <div class="container">
        <div className="full-screen">
          <TinyMCE />
        </div>
      </div>
    </div>
  )
}
