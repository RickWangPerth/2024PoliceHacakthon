import React, { useEffect } from 'react';
import mapStyles from '../styles/mapStyles';

interface AccidentMapProps {
  position: { lat: number; lng: number };
}

const AccidentMap: React.FC<AccidentMapProps> = ({ position }) => {
  useEffect(() => {
    const initMap = () => {
      const map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
        zoom: 15,
        center: position,
        styles: mapStyles,
      });

      new google.maps.Marker({
        position,
        map,
        icon: {
          url: '/siren.png',
          scaledSize: new google.maps.Size(40, 40),
        },
        title: 'Emergency Location',
      });
    };

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&callback=initMap`;
    script.async = true;
    script.defer = true;
    (window as any).initMap = initMap;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [position]);

  return <div id="map" className="w-full h-full rounded-lg"></div>;
};

export default AccidentMap;
