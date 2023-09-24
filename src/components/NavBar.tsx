import secureLocalStorage from "react-secure-storage";
import '../App.scss';
import { useNavigate } from "react-router-dom";

const NavBar: React.FC = () => {
    const navigate = useNavigate();
    const username: string | null = secureLocalStorage.getItem('username') as string;
    const isAdmin: string | null = secureLocalStorage.getItem('admin') as string;

    const adminButton = document.getElementById("adminButton");
    if (isAdmin === "true" || username === "admin") {
        if (adminButton) {
            document.getElementById("adminButton")!.style.display = "inline";
        }
        }
        else {
            if (adminButton) {
                document.getElementById("adminButton")!.style.display = "none";
            }
        }
    
    const toAdmin = () => {
        secureLocalStorage.setItem("username", "admin");
        navigate("/admin");
    }
    
    return (
        <div className="navBar">
        <h3>Tervetuloa {username}</h3>
        {/* Logout button */}
        <button onClick={() => {
            secureLocalStorage.removeItem("username");
            secureLocalStorage.removeItem("password");
            secureLocalStorage.removeItem("admin");
          navigate("/login");
        }}>Kirjaudu Ulos</button>
        <button onClick={() => toAdmin() } id="adminButton">Admin</button>
      </div>
    );
}

export default NavBar;