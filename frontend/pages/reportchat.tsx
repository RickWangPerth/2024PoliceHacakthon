import React, { useState } from "react";
import dynamic from "next/dynamic";
import axios from 'axios';

const ChatBox = dynamic(() => import('../components/ChatBox'), {
  ssr: false,
});


const Reportchat: React.FC = () => {
  const [location, setLocation] = useState<{ latitude: number, longitude: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sendLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
          // Send location data to server or use it as needed
          console.log('Location sent:', { latitude, longitude });
          
          axios.post(`https://${window.location.host}/api/location/`, { latitude, longitude })
            .then(response => {
              console.log('Location sent successfully:', response.data);
            })
            .catch(error => {
              console.error('Error sending location:', error);
            });

        },
        (error) => {
          setError(error.message);
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  };

  return (
    <div className="flex items-start justify-center h-screen">
      <div className="w-full max-w-4xl text-center">
        <h2 className="text-xl font-bold mb-4 text-center">Incident Report Chat</h2>
        <ChatBox />
        <button 
          onClick={sendLocation} 
          className="mt-4 p-2 bg-blue-500 text-white rounded">
          Send GPS Location
        </button>
        {location && (
          <div className="mt-4">
            <p>Latitude: {location.latitude}</p>
            <p>Longitude: {location.longitude}</p>
          </div>
        )}
        {error && <p className="mt-4 text-red-500">{error}</p>}
      </div>
    </div>
  );
};

export default Reportchat;
