import React, { useEffect, useState } from "react";
import { useParams,useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";
import DatePicker from "react-datepicker";

const RoomDetailsPage = () => {
    const navigate = useNavigate();
    const {roomId} = useParams();
    const [roomDetails, setRoomDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [checkInDate, setCheckInDate] = useState(null);
    const [checkOutDate, setCheckOutDate] = useState(null);
    const [numAdults,setNumAdults] = useState(1);
    const [numChildren,setNumChildren] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalGuests, setTotalGuests] = useState(1);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [userId,setUserId] = useState('');
    const [showMessage, setShowMessage] = useState(false);
    const [confirmationCode,setConfirmationCode] = useState('');
    const [errorMessage,setErrorMessage] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try{
                setIsLoading(true);
                const response = await ApiService.getRoomById(roomId);
                setRoomDetails(response.room);
                const userProfile = await ApiService.getUserProfile();
                setUserId(userProfile.user.id);
            }catch(error){
                setError(error.response?.data?.message || error.message);
            }finally{
                setIsLoading(false);
            }
        };
        fetchData();
    },[roomId]);

    const handleConfirmBooking = async () => {
        if(!checkInDate || !checkOutDate){
            setErrorMessage('Lütfen Giriş ve Çıkış Tarihi Seçiniz');
            setTimeout(() => setErrorMessage(''),5000);
            return;
        }

        if(isNaN(numAdults) || numAdults < 1 || isNaN(numChildren) || numChildren < 0){
            setErrorMessage('Lütfen Misafir Sayısını Giriniz');
            setTimeout(() => setErrorMessage(''), 5000);
            return;
        }

        const oneDay = 24 * 60 * 60 * 1000;
        const startDate = new Date(checkInDate);
        const endDate = new Date(checkOutDate);
        const totalDays = Math.round(Math.abs((endDate - startDate) / oneDay)) + 1;

        const totalGuests = numAdults + numChildren;

        const roomPricePerNight = roomDetails.roomPrice;
        const totalPrice = roomPricePerNight * totalDays;

        setTotalPrice(totalPrice);
        setTotalGuests(totalGuests);
    };

    const acceptBooking = async () => {
        try{
            const startDate = new Date(checkInDate);
            const endDate = new Date(checkOutDate);

            console.log("Gerçek Giriş Tarihi: ", startDate);
            console.log("Gerçek Çıkış Tarihi: ", endDate);

            const formattedCheckInDate = new Date(startDate.getTime - (startDate.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
            const formattedCheckOutDate = new Date(endDate.getTime() - (endDate.getTimezoneOffset() * 60000)).toISOString().split('T')[0];

            console.log("Düzenlenmiş Giriş Tarihi: ", formattedCheckInDate);
            console.log("Düzenlenmiş Çıkış Tarihi: ", formattedCheckOutDate);

            const booking = {
                checkInDate: formattedCheckInDate,
                checkOutDate: formattedCheckOutDate,
                numAdults: numAdults,
                numChildren: numChildren
            };

            console.log(booking)
            console.log(checkOutDate)

            const response = await ApiService.bookRoom(roomId, userId, booking);
            if(response.statusCode === 200){
                setConfirmationCode(response.bookingConfirmationCode);
                setShowMessage(true);
                
                setTimeout(() => {
                   setShowMessage(false);
                   navigate('/rooms'); 
                }, 10000);
            }
        }catch(error) {
            setErrorMessage(error.response?.data?.message || error.message);
            setTimeout(() => setErrorMessage(''),5000);
        }
    };

    if(isLoading){
        return <p className="room-detail-loading">Oda Detayları Yükleniyor...</p>;
    }

    if(error){
        return <p className="room-detail-loading">{error}</p>;
    }

    if(!roomDetails){
        return <p className="room-detail-loading">Oda Bulunamadı!</p>;
    }

    const {roomType, roomPrice, roomPhotoUrl, description, bookings} = roomDetails;

    return(
        <div className="room-details-booking">
            {showMessage && (
                <p className="booking-success-message">
                    Rezervasyon başarılı! Onay Kodu: {confirmationCode} z. Rezervasyon detaylarınızın yer aldığı bir Sms ve e-posta size gönderildi
                </p>
            )}
            {errorMessage && (
                <p className="error-message">
                    {errorMessage}
                </p>
            )}
            <h2>Oda Detayları</h2>
            <br />

            <img src={roomPhotoUrl} alt={roomType} className="room-details-image" />
            <div className="room-details-info">
                <h3>{roomType}</h3>
                <p>Fiyat: {roomPrice} TL / Gece</p>
                <p>{description}</p>
            </div>

            {bookings && bookings.lenght > 0 && (
                <div>
                    <h3>Mevcut Rezervasyon Bilgileri</h3>
                    <ul className="booking-list">
                        {bookings.map((booking,index) => (
                            <li key={booking.id} className="booking-item">
                                <span className="booking-number">Rezervasyon No: {index + 1 }</span>
                                <span className="booking-text">Giriş Tarihi: {booking.checkInDate}</span>
                                <span className="booking-text">Çıkış Tarihi: {booking.checkOutDate} </span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            <div className="booking-info">
                <button className="book-now-button" onClick={() => setShowDatePicker(true)}>Anında Rezervasyon</button>
                <button className="go-back-button" onClick={() => setShowDatePicker(false)}>Geri Dön</button>

                {showDatePicker && (
                    <div className="detail-picker-container">
                        <DatePicker
                            className="detail-search-field"
                            selected={checkInDate}
                            onChange={(date) => setCheckInDate(date)}
                            selectsStart
                            startDate={checkInDate}
                            endDate={checkOutDate}
                            placeholderText="Giriş Tarihi"
                            dateFormat="dd/MM/yyyy"
                        />
                        <DatePicker
                            className="detail-search-field"
                            selected={checkOutDate}
                            onChange={(date) => setCheckOutDate(date)}
                            selectsStart
                            startDate={checkInDate}
                            endDate={checkOutDate}
                            minDate={checkInDate}
                            placeholderText="Çıkış Tarihi"
                            dateFormat="dd/MM/yyyy"
                        />

                        <div className="guest-container">
                            <div className="guest-div">
                                <label>Yetişkin: </label>
                                <input
                                    type="number"
                                    min="1"
                                    value={numAdults}
                                    onChange={(e) => setNumAdults(parseInt(e.target.value))}
                                />
                            </div>
                            <div className="guest-div">
                                <label>Çocuk: </label>
                                <input
                                    type="number"
                                    min="0"
                                    value={numChildren}
                                    onChange={(e) => setNumChildren(parseInt(e.target.value))}
                                />
                            </div>
                            <button className="confirm-booking" onClick={handleConfirmBooking}>Rezervasyonu Doğrula</button>
                        </div>
                    </div>
                )}

                {totalPrice > 0&& (
                    <div className="total-price">
                        <p>Toplam Fiyat: {totalPrice} TL</p>
                        <p>Misafir Sayısı: {totalGuests}</p>
                        <button onClick={acceptBooking} className="accept-booking">Rezervasyonu Onayla</button>
                    </div>
                )}
            </div>
        </div>
    );
    
};

export default RoomDetailsPage;