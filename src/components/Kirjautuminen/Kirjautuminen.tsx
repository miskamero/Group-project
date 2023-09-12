import React, { useState } from 'react';
import './Kirjautuminen.css'
// kopioi kansioon allaolevat kuvakkeet kun pystyt
import user_icon from '../Assets/person.png'
import email_icon from '../Assets/email.png'
import password_icon from '../Assets/password.png'

const Kirjautuminen = () => {

/* 'rekisteröidy'-teksti siirtyy actionin avulla... */
    const [action,setAction] = useState("Rekisteröidy");

    return (
        <div className='containerkirjautuminen'>
            <div className='headerrekisteroidy'>
{/* ...tänne */}
                <div className="text">{action}</div>
                <div className="underline"></div>
            </div>
            <div className="inputs">
{/* jos ollaan kirjautumisnäkymässä, näytä tyhjä div (ei nimi-kenttää) */}
{/* ':' = else; näytä nimi */}
                {action==="Login"?<div></div>:<div className="input">
                    <img src={user_icon} alt="" />
                    <input type="text" placeholder='Name' />
                </div>}
    {/* sähköposti */}
                <div className="input">
                    <img src={email_icon} alt="" />
                    <input type="email" placeholder='Email Id' />
                </div>
    {/* salasana */}
                <div className="input">
                    <img src={password_icon} alt="" />
                    <input type="password" placeholder='Password' />
                </div>
            </div>
{/* jos ollaan rekisteröitymisnäkymässä, näytä tyhjä div */}
{/* ':' = else; näytä salasana hukassa */}
            {action==="Rekisteröidy"?<div></div>:<div className="forgot-password">Salasana hukassa? <span>Klikkaa tästä!</span></div>}  
            <div className="submit-container">
{/* '===' = if action equals, '?' = then, ':' = else */}
{/* onClick saa napit toimimaan */}
                <div className={action==="Rekisteröidy"?"submit gray":"submit"} onClick={()=>{setAction("Rekisteröidy")}}>Rekisteröidy</div>
                <div className={action==="Sign Up"?"submit gray":"submit"} onClick={()=>{setAction("Kirjaudu sisään")}}>Kirjaudu sisään</div>
            </div>
        </div>
    );
};

export default Kirjautuminen