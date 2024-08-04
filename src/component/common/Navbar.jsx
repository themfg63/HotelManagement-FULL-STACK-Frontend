import React from "react";
import { NavLink,useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";

function Navbar(){
    const isAuthenticated = ApiService.isAuthenticated();
    const isAdmin = ApiService.isAdmin();
    const isUser = ApiService.isUser();
    const navigate = useNavigate();

    const handleLogout = () => {
        const isLogout = window.confirm('Çıkış Yapmak İstediğinize Emin Misiniz?');
        if(isLogout){
            ApiService.logout();
            navigate('/home');
        }
    };

    return(
        <nav className="navbar">
            <div className="navbar-brand">
                <NavLink to="/home">GÜNEŞ HOTEL</NavLink>
            </div>
            <ul className="navbar-ul">
                <li><NavLink to="/home" activeclassname="active">Ana Sayfa</NavLink></li>
                <li><NavLink to="/rooms" activeclassname="active">Odalar</NavLink></li>
                <li><NavLink to="/find-booking" activeclassname="active">Rezervasyon Yap</NavLink></li>

                {isUser && <li><NavLink to="/profile" activeclassname="active">Profil</NavLink></li>}
                {isAdmin && <li><NavLink to="/admin" activeclassname="active">Admin</NavLink></li>}

                {!isAuthenticated && <li><NavLink to="/login" activeclassname="active">Giriş Yap</NavLink></li>}
                {!isAuthenticated && <li><NavLink to="/register" activeclassname="active">Kayıt Ol</NavLink></li>}

                {!isAuthenticated && <li onClick={handleLogout}>Çıkış Yap</li>}
            </ul>
        </nav>
    );
}

export default Navbar;