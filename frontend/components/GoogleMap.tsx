import React, { useEffect } from 'react';
import mapStyles from '../styles/mapStyles';
import { generatePoliceCarInfo, generateEmergencyPointInfo, generatePoliceStationInfo } from '../styles/infoTemplates';
import emergencyPointsData from '@/dummydata/emergencyPoints';
import policeStations from '@/dummydata/policeStations';
import policeCarsData from '@/dummydata/policeCars';

interface FilterProps {
  level: number;
  status: string;
  incident: string;
  incidentStatus: string;
}

const GoogleMap: React.FC<FilterProps> = ({ level, status, incident, incidentStatus }) => {
  useEffect(() => {
    const initMap = () => {
      console.log('Initializing map...');
      const map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
        zoom: 15,
        center: { lat: -31.9505, lng: 115.8605 },
        styles: mapStyles
      });

      console.log('Map initialized.');

      const filteredPoliceCars = policeCarsData.filter(car => 
        (level === 0 || car.data.level >= level) &&
        (status === 'All' || car.data.status === status)
      );

      filteredPoliceCars.forEach(car => {
        const marker = new google.maps.Marker({
          position: car.position,
          map,
          icon: {
            url: car.icon,
            scaledSize: new google.maps.Size(50, 50)
          },
          title: 'Police Location',
        });

        const infoWindow = new google.maps.InfoWindow({
          content: generatePoliceCarInfo(car.data),
        });

        marker.addListener('click', () => {
          infoWindow.open(map, marker);
        });
      });

      const filteredEmergencyPoints = emergencyPointsData.filter(point => 
        (incident === 'All' || point.data.incident === incident) &&
        (incidentStatus === 'All' || point.data.status === incidentStatus)
      );

      filteredEmergencyPoints.forEach(point => {
        const marker = new google.maps.Marker({
          position: point.position,
          map,
          icon: {
            url: point.icon,
            scaledSize: new google.maps.Size(40, 40)
          },
          title: 'Emergency Location',
        });

        const infoWindow = new google.maps.InfoWindow({
          content: generateEmergencyPointInfo(point.data),
        });

        marker.addListener('click', () => {
          infoWindow.open(map, marker);
        });
      });

      policeStations.forEach(station => {
        const marker = new google.maps.Marker({
          position: station.position,
          map,
          icon: {
            url: station.icon,
            scaledSize: new google.maps.Size(50, 50)
          },
          title: 'Police Station',
        });

        const infoWindow = new google.maps.InfoWindow({
          content: generatePoliceStationInfo(station.data),
        });

        marker.addListener('click', () => {
          infoWindow.open(map, marker);
        });
      });

      console.log('Markers added.');
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
  }, [level, status, incident, incidentStatus]);

  return <div id="map" className="w-full h-full rounded-lg"></div>;
};

export default GoogleMap;
