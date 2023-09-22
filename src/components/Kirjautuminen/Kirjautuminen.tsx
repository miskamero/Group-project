import { useState } from 'react';

import axios from 'axios';

import './Kirjautuminen.scss'
// kopioi kansioon allaolevat kuvakkeet kun pystyt

import email_icon from '../../Assets/email.svg'

import password_icon from '../../Assets/password.png'

import secureLocalStorage from "react-secure-storage";

import { useNavigate } from "react-router-dom";

import * as Action from '../../services/services';

import { UserInfo } from '../../services/services';
 

const Kirjautuminen = () => {
    const [grTunnus,setGrTunnus] = useState("");
    const [password,setPassword] = useState("");
    const [UserInfo,setUserInfo] = useState<UserInfo[]>([]);
    const [error,setError] = useState("");
    let hashedPassword: string = "";
    const navigate = useNavigate();
 
    window.onload = function() {
        if (secureLocalStorage.getItem('username') != null || secureLocalStorage.getItem('username') != undefined) {
            navigate("/");
        }
    }
 
    const HandleSubmit = () => {
        getUsers();
    }
 
    const getUsers = async () => {
        axios.get<UserInfo[]>("http://localhost:3002/lainaukset/" + grTunnus)
        .then((response) => {
            if (response.data) {
            setUserInfo(response.data);
            if (Object.keys(response.data).length === 0) {
                setError("Käyttäjää ei löytynyt");
            } else {
                hashedPassword = response.data.password;
                login(password);
            }
            } else {
            setError("Käyttäjää ei löytynyt");
            }
        })
        .catch((error) => {
            setError("Virhe käyttäjätietoja haettaessa: " + error.message);
        });
    }
 
    const login = async (password: string) => {
        try {
            const login = await Action.compare(password, hashedPassword);
            
            if (login) {
                secureLocalStorage.setItem('username', grTunnus);
                secureLocalStorage.setItem('password', hashedPassword);
                if (grTunnus === "admin") {
                    navigate("/admin")
                }
                else {
                navigate("/");
                }
            } else {
                setError("Salasana on väärä");
            }
        }
        catch (error: any) {
            setError("Virhe kirjautuessa: " + error.message);
        }
    }
    return (
        <div className='containerkirjautuminen'>
            <div className='headerrekisteroidy'>
                <div className="text">Kirjaudu Sisään</div>
                <div className="underline"></div>
            </div>
            <div className="inputs">
                <div className="input">
                    <img src={email_icon} alt="" />
                    <input type="text" placeholder='Gr-tunnus' onChange={(e)=>{setGrTunnus(e.target.value)}}/>
                </div>
                <div className="input">
                    <img src={password_icon} alt="" />
                    <input type="password" placeholder='Password' onChange={(e)=>{setPassword(e.target.value)}}/>
                </div>
            </div>
            <h5>{error}</h5>
            <div className="submit-container">
                <button className={"submit"} onClick={()=>{HandleSubmit()}}>Kirjaudu sisään</button>
            </div>
            <div>
                <h5>Eikö sinulla ole tiliä?  <a href='/signup'>Rekisteröidy</a></h5>
            </div>
 
        </div>
    );
};
 

export default Kirjautuminen