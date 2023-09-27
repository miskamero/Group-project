import { useState } from 'react';
import axios from 'axios';
import './Kirjautuminen.scss'

import email_icon from '../../assets/email.png'
import password_icon from '../../assets/password.png'
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
    console.log(UserInfo); // This is just for fixing non existant error
    window.onload = function() {
        secureLocalStorage.removeItem("admin");
        if (secureLocalStorage.getItem('username') != null || secureLocalStorage.getItem('username') != undefined) {
            navigate("/");
        }
    }
 
    const HandleSubmit = () => {
        getUsers();
    }
 
    const getUsers = async () => {
        try {
          const response = await axios.get<UserInfo>("http://localhost:3002/lainaukset/" + grTunnus);
      
          if (response.data) {
            const userPassword = response.data.password;
      
            setUserInfo([response.data]);
            hashedPassword = userPassword; // Set the hashedPassword
            login(password);
          } else {
            setError("Käyttäjää ei löytynyt");
          }
        } catch (error: any) {
          setError("Virhe käyttäjätietoja haettaessa: " + error.message);
        }
      };
 
    const login = async (password: string) => {
        try {
            const login = await Action.compare(password, hashedPassword);
            
            if (login) {
                secureLocalStorage.setItem('username', grTunnus);
                secureLocalStorage.setItem('password', hashedPassword);
                if (grTunnus === "admin") {
                    secureLocalStorage.removeItem("admin");
                    navigate("/admin")
                }
                else {
                secureLocalStorage.removeItem("admin");
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