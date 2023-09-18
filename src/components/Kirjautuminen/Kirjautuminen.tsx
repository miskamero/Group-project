import React, { useState } from 'react';
import './Kirjautuminen.scss'
// kopioi kansioon allaolevat kuvakkeet kun pystyt
import user_icon from '../../Assets/person.png'
import email_icon from '../../Assets/email.svg'
import password_icon from '../../Assets/password.png'
import secureLocalStorage from "react-secure-storage";
import { useNavigate } from "react-router-dom";

const Kirjautuminen = () => {
    const [action,setAction] = useState("Kirjaudu sisään");
    const navigate = useNavigate();

    window.onload = function() {
        if (secureLocalStorage.getItem('username') != null || secureLocalStorage.getItem('username') != undefined) {
            navigate("/");
        }
    }

    return (
        <div className='containerkirjautuminen'>
            <div className='headerrekisteroidy'>
                <div className="text">{action}</div>
                <div className="underline"></div>
            </div>
            <div className="inputs">
                <div className="input">
                    <img src={email_icon} alt="" />
                    <input type="email" placeholder='Email' />
                </div>
                <div className="input">
                    <img src={password_icon} alt="" />
                    <input type="password" placeholder='Password' />
                </div>
            </div>
            <div className="submit-container">
                <button className={"submit"} onClick={()=>{setAction("Kirjaudu sisään")}}>Kirjaudu sisään</button>
            </div>
            <div>
                <h5>Eikö sinulla ole tiliä?  <a href='/signup'>Rekisteröidy</a></h5>
            </div>

        </div>
    );
};

export default Kirjautuminen