import { useEffect, useState } from 'react';
import axios from 'axios';

const LocationSharing = () => {
    const [location, setLocation] = useState(null);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                setLocation({ latitude, longitude });

                // 使用环境变量中的后端URL
          const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

          axios.post(`${backendUrl}/api/location/`, { latitude, longitude })
            .then(response => {
              console.log('Location sent successfully:', response.data);
            })
            .catch(error => {
              console.error('Error sending location:', error);
            });
        },
        error => {
          console.error('Error getting location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, []);

    return (
        <div>
            <h1>Location Sharing</h1>
            {location ? (
                <p>Latitude: {location.latitude}, Longitude: {location.longitude}</p>
            ) : (
                <p>Getting location...</p>
            )}
        </div>
    );
};

export default LocationSharing;


