import React, { useState } from "react";
import ApiService from "../../service/ApiService";

const FindBookingPage = () => {
    const [confirmationCode,setConfirmationCode] = useState('');
    const [bookingDetails,setBookingDetails] = useState(null);
    const [error,setError] = useState(null);

    const handleSearch = async () => {
        if(!confirmationCode.trim()){
            setError("Lütfen Rezervasyon Kodu Giriniz");
            setTimeout(() => setError(''),5000);
            return ;
        }
        try{
            const response = await ApiService.getBookingByConfirmationCode(confirmationCode);
            setBookingDetails(response.booking);
            setError(null);
        }catch(error){
            setError(error.response?.data?.message || error.message);
            setTimeout(() => setError(''),5000);
        }
    };

    return(
        <div className="find-booking-page">
            <h2>Rezervasyon Bul</h2>
            <div className="search-container">
                <input
                    required
                    type="text"
                    placeholder="Rezervasyon Kodunuzu Giriniz"
                    value={confirmationCode}
                    onChange={(e) => setConfirmationCode(e.target.value)}
                />
                <button onClick={handleSearch}>Bul</button>
            </div>
            {error && <p style={{color: 'red'}}>{error}</p>}
            {bookingDetails && (
                <div className="booking-details">
                    <h3>Rezervasyon Detayları</h3>
                    <p>Rezervasyon Kodu: {bookingDetails.getBookingByConfirmationCode}</p>
                    <p>Giriş Tarihi: {bookingDetails.checkInDate}</p>
                    <p>Çıkış Tarihi: {bookingDetails.checkOutDate}</p>
                    <p>Yetişkin Misafir Sayısı: {bookingDetails.numOfAdults}</p>
                    <p>Çocuk Misafir Sayısı: {bookingDetails.numOfChildren}</p>

                    <br />
                    <br />
                    <br />
                    <h3>Rezervasyonu Yapan Kişi</h3>
                    <div>
                        <p>Ad Soyad: {bookingDetails.user.name}</p>
                        <p>Email: {bookingDetails.user.email}</p>
                        <p>Telefon No: {bookingDetails.user.phoneNumber}</p>
                    </div>

                    <br />
                    <hr />
                    <br />
                    <h3>Oda Bilgileri</h3>
                    <div>
                        <p>Oda Tip: {bookingDetails.room.roomType}</p>
                        <img src={bookingDetails.room.roomPhotoUrl} alt="" sizes="" srcSet="" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default FindBookingPage;