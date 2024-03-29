import { useState } from 'react';
import './Kirjautuminen.scss'
import user_icon from '../../assets/person.png'
import password_icon from '../../assets/password.png'
import * as Action from '../../services/services';
import secureLocalStorage from "react-secure-storage";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Rekisteröinti = () => {
    const check: number = 1;
  if (0 === check) {
    document.body.style.overflow = "visible";
  } else if (1 === check) {
    document.body.style.overflow = "hidden";
    }
    
    const [action,setAction] = useState("Rekisteröidy");
    console.log(setAction)
    const [grTunnus,setGrTunnus] = useState("");
    const [password,setPassword] = useState("");
    const [error,setError] = useState("‎ ");
    const navigate = useNavigate();

    // const errorHandling = (error: string) => {
        // Take the error message as a parameter and set it to the error state variable and set opacity to 1
    
    window.onload = function() {
        secureLocalStorage.removeItem("admin");       
        if (secureLocalStorage.getItem('username') != null || secureLocalStorage.getItem('username') != undefined) {
            navigate("/");
        }
    }   
    const HandleSubmit = () => {
        const regex = /^gr\d{6}$/i;
        const trimmedGrTunnus = grTunnus.trim();
        if (grTunnus === "admin") {
            setError("‎ ");
            getUsers();
        }
        if (!regex.test(trimmedGrTunnus)) {
            setError("Gr-tunnus on väärässä muodossa");
            setTimeout(() => {
                setError("‎ ");
            }
            , 3000);
            return;
        }
        else if (password.length < 6) {
            setError("Salasana on liian lyhyt");
            return;
        }
        else {
        setError("‎ ");
        getUsers();
        }
    }
    const addUser = async (grTunnus: string, password: string) => {
        secureLocalStorage.setItem('username', grTunnus);
        secureLocalStorage.setItem('password', password);
        await Action.addUser(grTunnus, password);
        navigate("/");
        console.log( "Käyttäjä lisätty")
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
                    <input type="password" placeholder='Salasana' onChange={(e)=>{setPassword(e.target.value)}}/>
                </div>
            </div>
        <h6>{error}</h6>
            <div className="submit-container">
                <button className={"submit"} onClick={()=>{HandleSubmit()}}>Rekisteröidy</button>
            </div>
            <div>
                <h5>Onko sinulla käyttäjätili? <a href='/login'>Kirjaudu sisään</a></h5>
            </div>
        </div>
    );
};

export default Rekisteröinti