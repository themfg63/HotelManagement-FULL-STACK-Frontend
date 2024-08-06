import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";

const AdminPage = () => {
    const [adminName, setAdminName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAdminName = async () => {
            try{
                const response = await ApiService.getUserProfile();
                setAdminName(response.user.name);
            }catch(error){
                console.error('Admin Bilgilerini Getirirken Beklenmedik Bir Hata Oluştu: ', error.message);
            }
        };

        fetchAdminName();
    },[]);

    return(
        <div className="admin-page">
            <h1 className="welcome-message">Hoş Geldiniz, {adminName}</h1>
            <div className="admin-actions">
                <button className="admin-button" onClick={() => navigate('/admin/manage-rooms')}>
                    Odaları Yönet
                </button>
                <button className="admin-button" onClick={() => navigate('/admin/manage-bookings')}>
                    Rezervasyonları Yönet
                </button>
            </div>
        </div>
    );
}

export default AdminPage;