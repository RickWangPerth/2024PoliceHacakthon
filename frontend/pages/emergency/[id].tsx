import { useRouter } from 'next/router';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import emergencyPoints from '../../dummydata/emergencyPoints';
import ReporterMap from '@/components/ReporterMap';
const ChatBox = dynamic(() => import('../../components/ChatBox'), {
  ssr: false,
});

interface EmergencyData {
  title: string;
  id: string;
  incident: string;
  time: string;
  position: { lat: number; lng: number };
}

const EmergencyPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [data, setData] = useState<EmergencyData | null>(null);
  const [location, setLocation] = useState({ latitude: 0, longitude: 0 });
  const [prevLocation, setPrevLocation] = useState({ latitude: 0, longitude: 0 });
  const [startTime, setStartTime] = useState<number | null>(null);
  const [totalDistance, setTotalDistance] = useState(0);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      if (id) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setLocation({ latitude, longitude });
            setPrevLocation({ latitude, longitude });
            setStartTime(Date.now());

            const sendLocationData = () => {
              
              const currentTime = Date.now();
              const elapsedTime = currentTime - startTime!;
              const heading = calculateHeading(prevLocation, { latitude, longitude });
              const altitude = position.coords.altitude || 0;
              const tag = elapsedTime === 0 ? 'first' : 'following';
              const distance = calculateDistance(prevLocation, { latitude, longitude }, tag);
              const speed = calculateSpeed(distance, elapsedTime);

              const sender = "reporter_"+id;

              axios.post(`https://${window.location.host}/api/location/`, {
                latitude,
                longitude,
                altitude,
                heading,
                totalTime: elapsedTime,
                speed,
                totalDistance: totalDistance + distance,
                tag,
                sender,
              })
                .then(response => {
                  // console.log('Location sent successfully:', response.data);
                })
                .catch(error => {
                  console.error('Error sending location:', error);
                });

              setPrevLocation({ latitude, longitude });
              setTotalDistance(totalDistance + distance);
            };

            const intervalId = setInterval(sendLocationData, 5000);
            setIntervalId(intervalId);
          },
          error => {
            console.error('Error getting location:', error);
          }
        );
        }
    } else {
      console.error('Geolocation is not supported by this browser.');
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [id]);

  useEffect(() => {
    if (id) {
      console.log("ID:", id);
      const point = emergencyPoints.find(point => point.data.id === id);
      if (point) {
        setData({
          title: point.data.title,
          id: point.data.id,
          incident: point.data.incident,
          time: point.data.time,
          position: point.position
        });
      } else {
        setData(null);
      }
    }
  }, [id]);

  const [activeTab, setActiveTab] = useState(0);

  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };

  const calculateDistance = (prevLocation: { latitude: number; longitude: number }, currentLocation: { latitude: number; longitude: number } , tag: string) => {
    if (tag == "following"){
      const R = 6371; // 地球半径，单位为千米
      const dLat = toRadians(currentLocation.latitude - prevLocation.latitude);
      const dLon = toRadians(currentLocation.longitude - prevLocation.longitude);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(prevLocation.latitude)) * Math.cos(toRadians(currentLocation.latitude)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;
      return distance;
    }
    else{
      return 0;
    }
  };
  
  const toRadians = (degrees: number) => {
    return degrees * Math.PI / 180;
  };
  
  const calculateSpeed = (distance: number, elapsedTime: number) => {
    const speed = distance / (elapsedTime / 1000 / 3600); // 转换为千米/小时
    return speed;
  };
  
  const calculateHeading = (prevLocation: { latitude: number; longitude: number }, currentLocation: { latitude: number; longitude: number }) => {
    const dLon = toRadians(currentLocation.longitude - prevLocation.longitude);
    const y = Math.sin(dLon) * Math.cos(toRadians(currentLocation.latitude));
    const x = Math.cos(toRadians(prevLocation.latitude)) * Math.sin(toRadians(currentLocation.latitude)) -
      Math.sin(toRadians(prevLocation.latitude)) * Math.cos(toRadians(currentLocation.latitude)) * Math.cos(dLon);
    const heading = toDegrees(Math.atan2(y, x));
    return (heading + 360) % 360; // 将负值转换为正值，范围为 0-360 度
  };
  
  const toDegrees = (radians: number) => {
    return radians * 180 / Math.PI;
  };

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid w-screen h-screen">
      <div className="col-span-2 bg-gray-100 p-4 mx-2 my-4 rounded-lg">
        <div className="tab h-full">
            <ul className="tab-list">
              {['OverView', 'Chat', 'Map (Sharing 🟢)'].map((tab, index) => (
                <li
                  key={tab}
                  className={`tab-item ${index === activeTab ? 'active' : ''}`}
                  onClick={() => handleTabClick(index)}
                >
                  {tab}
                </li>
              ))}
            </ul>
            <div className="tab-content h-full">
              <div className={`tab-pane ${activeTab === 0 ? 'active' : ''}`}>
                <h2 className="text-xl font-bold mb-4">{data.title}</h2>
                  <ul>
                    <li className="mb-2">accident ID: {data.id}</li>
                    <li className="mb-2">incident: {data.incident}</li>
                    <li className="mb-2">time: {data.time}</li>
                  </ul>
              </div>
              <div className={`tab-pane h-5/6	 ${activeTab === 1 ? 'active' : ''}`}>
                <h2 className="text-xl font-bold mb-4">Chat</h2>
                <ChatBox/>
              </div>
              <div className={`tab-pane h-5/6	 ${activeTab === 2 ? 'active' : ''}`}>
                <h2 className="text-xl font-bold mb-4">Chat</h2>
                  <ReporterMap caseId = {id} />
              </div>

            </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyPage;
