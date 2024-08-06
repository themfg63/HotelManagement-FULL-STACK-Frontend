import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";

const AddRoomPage = () => {
    const navigate = useNavigate();
    const [roomDetails, setRoomDetails] = useState({
        roomPhotoUrl: '',
        roomType: '',
        roomPrice: '',
        roomDescription: '',
    });
    const [file, setFile] = useState(null);
    const [preview,setPreview] = useState(null);
    const [error, setError] = useState('');
    const [success,setSuccess] = useState('');
    const [roomTypes,setRoomTypes] = useState([]);
    const [newRoomType, setNewRoomType] = useState(false);

    useEffect(() => {
        const fetchRoomTypes = async () => {
            try{
                const types = await ApiService.getRoomTypes();
                setRoomTypes(types);
            }catch(error){
                console.error('Oda Tipleri Getirilirken Bir Hata Oluştu: ', error.message);
            }
        };
        fetchRoomTypes();
    },[]);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setRoomDetails(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleRoomTypeChange = (e) => {
        if(e.target.value === 'new') {
            setNewRoomType(true);
            setRoomDetails(prevState => ({ ...prevState, roomType: ''}));
        }else{
            setNewRoomType(false);
            setRoomDetails(prevState => ({ ...prevState, roomType: e.target.value}));
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if(selectedFile){
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        }else{
            setFile(null);
            setPreview(null);
        }
    };

    const addRoom = async () => {
        if(!roomDetails.roomType || !roomDetails.roomPrice || !roomDetails.roomDescription){
            setError('Tüm Alanların Doldurulması Gerekir.');
            setTimeout(() => setError(''), 5000);
            return;
        }

        if(!window.confirm('Odayı Eklemek İstiyor Musunuz?')){
            return
        }

        try{
            const formData = new FormData();
            formData.append('roomType', roomDetails.roomType);
            formData.append('roomPrice', roomDetails.roomPrice);
            formData.append('roomDescription', roomDetails.roomDescription);

            if(file){
                formData.append('photo', file);
            }

            const result = await ApiService.addRoom(formData);
            if(result.statusCode === 200){
                setSuccess('Oda Başarıyla Eklendi');

                setTimeout(() => {
                   setSuccess('');
                   navigate('/admin/manage-rooms'); 
                }, 3000);
            }
        }catch(error){
            setError(error.response?.data?.message || error.message);
            setTimeout(() => setError(''),5000);
        }
    };

    return(
        <div className="edit-room-container">
            <h2>Yeni Oda Ekle</h2>
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}

            <div className="edit-room-form">
                <div className="form-group">
                    {preview && (
                        <img src={preview} alt="Room Preview" className="room-photo-preview" />
                    )}

                    <input
                        type="file"
                        name="roomPhoto"
                        onChange={handleFileChange}
                    />
                </div>
                <div className="form-group">
                    <label>Oda Tipi</label>
                    <select value={roomDetails.roomType} onChange={handleRoomTypeChange}>
                        <option value="">Oda Tipi Seç</option>
                        {roomTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                        <option value="new">Diğer</option>
                    </select>

                    {newRoomType && (
                        <input
                            type="text"
                            name="roomType"
                            placeholder="Oda Tipi Girin"
                            value={roomDetails.roomType}
                            onChange={handleChange}
                        />
                    )}
                </div>
                <div className="form-group">
                    <label>Oda Fiyatı</label>
                    <input 
                        type="text"
                        name="roomPrice"
                        value={roomDetails.roomPrice}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label>Oda Açıklaması</label>
                    <textarea 
                        name="roomDescription"
                        value={roomDetails.roomDescription}
                        onChange={handleChange}
                    />
                </div>
                <button className="update-button" onClick={addRoom}>Odayı Ekle</button>
            </div>
        </div>
    );
};

export default AddRoomPage;