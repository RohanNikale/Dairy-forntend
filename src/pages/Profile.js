import React from 'react'
import userdp from '../components/user.png'
import './Profile.css'
export default function Profile() {
    return (
        <div>

            <div className="profile">
                <div className="dp">
                    <img src={"https://rohannikale.netlify.app/static/media/rohansmall.c8ca5a646bae81276ce6.jpg"} width={160} alt="" />
                </div>
                <div className="info">
                    <p>@rohannikale</p>
                    2 post
                    <p>Rohan Nikale</p>
                    <br />
                    <p>🇮🇳
                        B.sc CS FY <br />
                        Full-Stack Developer <br />
                        Hobbys:- Acting, dancing and reading poetry <br />
                        Co-founder of @yor</p>

                </div>
            </div>
        </div>
    )
}
