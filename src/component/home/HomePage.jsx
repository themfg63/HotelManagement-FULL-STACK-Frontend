import React, { useState } from "react";
import RoomResult from "../common/RoomResult";
import RoomSearch from "../common/RoomSearch";

const HomePage = () => {
    const [roomSearchResults, setRoomSearchResults] = useState([]);

    const handleSearchResult = (results) => {
        setRoomSearchResults(results);
    };

    return(
        <div className="home">
            <section>
                <header className="header-banner">
                    <img src="./assets/images/hotel.webp" alt="GÜNEŞ HOTEL" className="header-image" />
                    <div className="overlay"></div>
                    <div className="animated-texts overlay-content">
                        <h1>
                            Hoş Geldiniz <span className="phegon-color">Güneş Hotel</span>
                        </h1><br />
                        <h3>Rahat, Temiz ve Güvenilirliğin Adı</h3>
                    </div>
                </header>
            </section>

            <RoomSearch handleSearchResult={handleSearchResult} />
            <RoomResult roomSearchResults={roomSearchResults} />

            <h4><a className="view-rooms-home" href="/rooms">Tüm Odalar</a></h4>
            
            <h2 className="home-services">Hizmetler <span className="phegon-color">GÜNEŞ HOTEL</span></h2>

            <section className="service-section">
                <div className="service-card">
                    <img src="./assets/images/ac.png" alt="Klima" />
                    <div className="service-details">
                        <h3 className="service-title">Klima</h3>
                        <p className="service-description">Bireysel olarak kontrol edilen oda içi klima ile konaklamanız boyunca serin ve konforlu kalın</p>
                    </div>
                </div>
                <div className="service-card">
                    <img src="./assets/images/mini-bar.png" alt="Mini Bar" />
                    <div className="service-details">
                        <h3 className="service-title">Mini Bar</h3>
                        <p className="service-description">Odanızın mini barında bulunan içecek ve atıştırmalıkların rahat seçiminin tadını ek bir ücret ödemeden çıkarın</p>
                    </div>
                </div>
                <div className="service-card">
                    <img src="./assets/images/parking.png" alt="Otopark" />
                    <div className="service-details">
                        <h3 className="service-title">Otopark</h3>
                        <p className="service-description">Rahatınız için tesis bünyesinde otopark hizmeti sunuyoruz. Lütfen vale park hizmeti varsa seçenekleri hakkında bilgi alın.</p>
                    </div>
                </div>
                <div className="service-card">
                    <img src="./assets/images/wifi.png" alt="Wifi" />
                    <div className="service-details">
                        <h3 className="service-title">Wifi</h3>
                        <p className="service-description">Tüm konuk odalarında ve ortak alanlarda bulunan ücretsiz yüksek hızlı Wi-Fi erişimiyle konaklamanız boyunca bağlantıda kalın.</p>
                    </div>
                </div>
            </section>
            <section>

            </section>
        </div>
    );
}

export default HomePage;