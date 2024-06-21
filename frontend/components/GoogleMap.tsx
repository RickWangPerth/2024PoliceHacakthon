import React, { useEffect } from 'react';
import mapStyles from '../styles/mapStyles';
import { generatePoliceCarInfo, generateEmergencyPointInfo, generatePoliceStationInfo } from '../styles/infoTemplates';
import Link from 'next/link';

const policeCars = [
  {
    position: { lat: -31.9505, lng: 115.8605 },
    icon: '/police.png',
    data: {
      title: 'Police Car 1',
      id: 'PC001',
      officers: 4,
      status: 'On duty'
    }
  },
  {
    position: { lat: -31.9555, lng: 115.8655 },
    icon: '/police.png',
    data: {
      title: 'Police Car 2',
      id: 'PC001',
      officers: 2,
      status: 'Patrolling'
    }
  }
];

const emergencyPoints = [
  {
    position: { lat: -31.9605, lng: 115.8705 },
    icon: '/siren.png',
    data: {
      title: 'Emergency Point 1',
      id: 2024070101001,
      incident: 'Car accident',
      time: '10:00:00 2024-07-01',
      link: '/accident/2024070101001'
    }
  },
  {
    position: { lat: -31.9455, lng: 115.8655 },
    icon: '/siren.png',
    data: {
      title: 'Emergency Point 2',
      id: 2024070101002,
      incident: 'Robbery',
      time: '11:20:05 2024-07-01',
      link: '/accident/2024070101001'
    }
  }
];

const policeStations = [
  {
    position: { lat: -31.95, lng: 115.85 },
    icon: '/station.png',
    data: {
      title: 'PERTH POLICE STATION',
      address: '2 FITZGERALD ST, NORTHBRIDGE',
      open: '24 hours',
    }
  },
  {
    position: { lat: -31.99, lng: 115.89 },
    icon: '/station.png',
    data: {
      title: 'KENSINGTON POLICE STATION',
      address: '25 GEORGE ST, KENSINGTON',
      open: 'Business',
    }
  },

  {
    position: { lat: -31.96, lng: 115.93 },
    icon: '/station.png',
    data: {
      title: 'BELMONT POLICE STATION',
      address: '273 ABERNETHY RD, CLOVERDALE',
      open: 'Business',
    }
  },
  {
    position: { lat: -31.94, lng: 115.81 },
    icon: '/station.png',
    data: {
      title: 'WEMBLEY POLICE STATION',
      address: '188 SALVADO RD, WEMBLEY',
      open: 'Business',
    }
  },
  {
    position: { lat: -31.90, lng: 115.89 },
    icon: '/station.png',
    data: {
      title: 'MORLEY POLICE STATION',
      address: '318 COODE ST, DIANELLA',
      open: 'Business',
    }
  },
  {
    position: { lat: -31.92, lng: 115.91 },
    icon: '/station.png',
    data: {
      title: 'BAYSWATER POLICE STATION',
      address: '1A HAMILTON ST, BAYSWATER',
      open: 'Business',
    }
  },


];

const GoogleMap: React.FC = () => {
  useEffect(() => {
    const initMap = () => {
      console.log('Initializing map...');
      const map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
        zoom: 15,
        center: { lat: -31.9505, lng: 115.8605 },
        styles: mapStyles
      });

      console.log('Map initialized.');

      policeCars.forEach(car => {
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

      emergencyPoints.forEach(point => {
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
  }, []);

  return <div id="map" className="w-full h-full rounded-lg"></div>;
};

export default GoogleMap;
