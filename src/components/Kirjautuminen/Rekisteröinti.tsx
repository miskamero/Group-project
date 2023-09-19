import React, { useState } from 'react';
import './Kirjautuminen.scss'
import user_icon from '../../Assets/person.png'
import password_icon from '../../Assets/password.png'
import * as Action from '../../services/services';
import secureLocalStorage from "react-secure-storage";
import { useNavigate } from "react-router-dom";
import axios from "axios";


const Rekisteröinti = () => {
    
    const [action,setAction] = useState("Rekisteröidy");
    const [grTunnus,setGrTunnus] = useState("");
    const [password,setPassword] = useState("");
    const [error,setError] = useState("");

    const navigate = useNavigate();

    window.onload = function() {
        if (secureLocalStorage.getItem('username') != null || secureLocalStorage.getItem('username') != undefined) {
            navigate("/");
        }
    }

    const HandleSubmit = () => {
        const regex = /^gr\d{6}$/i;
        const trimmedGrTunnus = grTunnus.trim();

        if (!regex.test(trimmedGrTunnus)) {
            setError("Gr-tunnus on väärässä muodossa, grXXXXXX");
            return;
        }
        if (password.length < 6) {
            setError("Salasana on liian lyhyt");
            return;
        }
        
        setError("");
        getUsers();
        
    }
    const addUser = async (grTunnus: string, password: string) => {
        
        secureLocalStorage.setItem('username', grTunnus);
        secureLocalStorage.setItem('password', password);
        await Action.addUser(grTunnus, password); 
        console.log("fdsokofsjiddiu"); 
        navigate("/");      
    }

    const getUsers = async () => {
        try {
            const users = await axios.get("http://localhost:3002/lainaukset/" + grTunnus);
            if (Object.keys(users.data).length != 0) {
                setError("Käyttäjä on jo olemassa");
            }
        }
        catch (error) {
            addUser(grTunnus, password);
        }

    }
    return (
        <div className='containerkirjautuminen'>
            <div className='headerrekisteroidy'>
                <div className="text">{action}</div>
                <div className="underline"></div>
            </div>
            <div className="inputs">
                {action==="Login"?<div></div>:<div className="input">
                    <img src={user_icon} alt="" />
                    <input type="text" placeholder='Gr-tunnus' onChange={(e)=>{setGrTunnus(e.target.value)}}/>
                </div>}
                {/* salasana */}
                <div className="input">
                    <img src={password_icon} alt="" />
                    <input type="password" placeholder='Password' onChange={(e)=>{setPassword(e.target.value)}}/>
                </div>
            </div>
            <h5>{error}</h5>
            <div className="submit-container">
                <button className={"submit"} onClick={(e)=>{HandleSubmit()}}>Rekisteröidy</button>
            </div>

            <div>
                <h5>Onko sinulla käyttäjätili? <a href='/login'>Kirjaudu sisään</a></h5>
            </div>
        </div>
    );
};

export default Rekisteröinti