import React, { useState } from 'react';
import PoliceMap from '../components/PoliceMap';
import ChatBox from '../components/ChatBox';

const Police: React.FC = () => {
  const [showMap, setShowMap] = useState(true);
  const [showChatBox, setShowChatBox] = useState(false);
  const position = { lat: -31.9505, lng: 115.8605 }; // 替换为实际位置

  return (
    <div className="w-full h-screen flex flex-col md:flex-row">
      <div className="md:w-1/2 w-full p-4">
        <button 
          className="w-full bg-blue-500 text-white p-2 rounded-lg md:hidden"
          onClick={() => setShowMap(!showMap)}
        >
          {showMap ? 'Hide Map' : 'Show Map'}
        </button>
        {showMap && (
          <div className="w-full h-96 md:h-full rounded-lg mt-2 md:mt-0">
            <PoliceMap position={position} />
          </div>
        )}
      </div>
      <div className="md:w-1/2 w-full p-4">
        <button 
          className="w-full bg-blue-500 text-white p-2 rounded-lg md:hidden"
          onClick={() => setShowChatBox(!showChatBox)}
        >
          {showChatBox ? 'Hide Chat' : 'Show Chat'}
        </button>
        {showChatBox && (
          <div className="w-full h-96 md:h-full rounded-lg mt-2 md:mt-0">
            <ChatBox />
          </div>
        )}
      </div>
    </div>
  );
};

export default Police;
