import React, { useState } from 'react';
import './Kirjautuminen.scss'
// kopioi kansioon allaolevat kuvakkeet kun pystyt
import user_icon from '../../Assets/person.png'
// oikee kuvake, (harmaa niinku muutkin)
import email_icon from '../../Assets/email.png'
import password_icon from '../../Assets/password.png'
import secureLocalStorage from "react-secure-storage";
import { useNavigate } from "react-router-dom";

const Kirjautuminen = () => {
    const [action,setAction] = useState("Kirjaudu sisään");
    const navigate = useNavigate();
    const check: number = 1;
  if (0 === check) {
    document.body.style.overflow = "visible";
  } else if (1 === check) {
    document.body.style.overflow = "hidden";
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
                    <input type="email" placeholder='Sähköposti' />
                </div>
                <div className="input">
                    <img src={password_icon} alt="" />
                    <input type="password" placeholder='Salasana' />
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