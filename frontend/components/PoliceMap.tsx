import React, { useEffect } from 'react';
import mapStyles from '../styles/mapStyles';

interface PoliceMapProps {
  position: { lat: number; lng: number };
}

const PoliceMap: React.FC<PoliceMapProps> = ({ position }) => {
  useEffect(() => {
    const initMap = () => {
      const map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
        center: position,
        zoom: 15,
        styles: mapStyles,
      });

      const panorama = new google.maps.StreetViewPanorama(
        document.getElementById('street-view') as HTMLElement, {
          position: position,
          pov: {
            heading: 34,
            pitch: 10,
          },
        });

      map.setStreetView(panorama);

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

  return (
    <div className="w-full h-full p-4 space-y-4 rounded-lg">
      <div id="map" className="w-full h-1/2 rounded-lg"></div>
      <div id="street-view" className="w-full h-1/2 rounded-lg"></div>
    </div>
  );
};

export default PoliceMap;
