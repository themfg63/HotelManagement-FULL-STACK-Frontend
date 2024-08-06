import React, { useEffect, useState } from "react";
import { useParams,useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";

const EditBookingPage = () => {
    const navigate = useNavigate();
    const {bookingCode} = useParams();
    const [bookingDetails, setBookingDetails] = useState(null);
    const [error, setError] = useState(null);
    const [success,setSuccess] = useState(null);

    useEffect(() => {
        const fetchBookingDetails = async () => {
            try{
                const response = await ApiService.getBookingByConfirmationCode(bookingCode);
                setBookingDetails(response.booking);
            }catch(error){
                setError(error.message);
            }
        };

        fetchBookingDetails();
    },[bookingCode]);

    const acheiveBooking = async (bookingId) => {
        if(!window.confirm('Bu Rezervasyonu Gerçekleştirmek İstediğinize Emin Misiniz? ')){
            return;
        }

        try{
            const response = await ApiService.cancelBooking(bookingId);
            if(response.statusCode === 200){
                setSuccess('Rezervasyon Başarıyla Tamamlandı')
                setTimeout(() => {
                   setSuccess('');
                   navigate('/admin/manage-bookings'); 
                }, 3000);
            }
        }catch(error){
            setError(error.response?.data?.message ||error.message);
            setTimeout(() => setError(''),5000);
        }
    };

    return(
        <div className="find-booking-page">
            <h2>Rezervasyon Detay</h2>
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}

            {bookingDetails && (
                <div className="booking-details">
                    <h3>Rezervasyon Detayları</h3>
                    <p>Onay Kodu: {bookingDetails.bookingConfirmationCode}</p>
                    <p>Giriş Tarihi: {bookingDetails.checkInDate}</p>
                    <p>Çıkış Tarihi: {bookingDetails.checkOutDate}</p>
                    <p>Yetişkin Sayısı: {bookingDetails.numOfAdults}</p>
                    <p>Çocuk Sayısı: {bookingDetails.numOfChildren}</p>
                    <p>Misafir Email: {bookingDetails.guestEmail}</p>

                    <br />
                    <hr></hr>
                    <br></br>

                    <h3>Misafir Bilgileri</h3>
                    <div>
                        <p>Name: {bookingDetails.user.name}</p>
                        <p>Email: {bookingDetails.user.email}</p>
                        <p>Telefon No: {bookingDetails.user.phoneNumber}</p>
                    </div>

                    <br />
                    <hr></hr>
                    <br></br>

                    <h3>Oda Detayları</h3>
                    <div>
                        <p>Oda Tipi: {bookingDetails.room.roomType}</p>
                        <p>Oda Fiyatı: {bookingDetails.room.roomPrice} TL</p>
                        <p>Oda Açıklaması: {bookingDetails.room.roomDescription}</p>
                        <img src={bookingDetails.room.roomPhotoUrl} alt="" sizes="" srcSet="" />
                    </div>
                    <button className="acheive-booking" onClick={() => acheiveBooking(bookingDetails.id)}>Rezervasyonu Onayla</button>
                </div>
            )}
        </div>
    );
};

export default EditBookingPage;