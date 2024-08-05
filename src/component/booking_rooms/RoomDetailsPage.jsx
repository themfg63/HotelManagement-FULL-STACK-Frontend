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
            }
        }
    }
}