import React, { useState } from 'react';
import './Kirjautuminen.scss'
// kopioi kansioon allaolevat kuvakkeet kun pystyt
import user_icon from '../../Assets/person.png'
import email_icon from '../../Assets/email.svg'
import password_icon from '../../Assets/password.png'

const Kirjautuminen = () => {

/* 'rekisteröidy'-teksti siirtyy actionin avulla... */
    const [action,setAction] = useState("Kirjaudu sisään");

    return (
        <div className='containerkirjautuminen'>
            <div className='headerrekisteroidy'>
{/* ...tänne */}
                <div className="text">{action}</div>
                <div className="underline"></div>
            </div>
            <div className="inputs">
    {/* sähköposti */}
                <div className="input">
                    <img src={email_icon} alt="" />
                    <input type="email" placeholder='Email' />
                </div>
    {/* salasana */}
                <div className="input">
                    <img src={password_icon} alt="" />
                    <input type="password" placeholder='Password' />
                </div>
            </div>
{/* jos ollaan rekisteröitymisnäkymässä, näytä tyhjä div */}
{/* ':' = else; näytä salasana hukassa */}
            <div className="submit-container">
{/* '===' = if action equals, '?' = then, ':' = else */}
{/* onClick saa napit toimimaan */}
                <div className={"submit"} onClick={()=>{setAction("Kirjaudu sisään")}}>Kirjaudu sisään</div>
            </div>
            <div>
                <h5>Eikö sinulla ole tiliä?  <a href='/signup'>Rekisteröidy</a></h5>
            </div>

        </div>
    );
};

export default Kirjautuminen