// pages/dashboard.tsx
import React, { useState } from "react";
import dynamic from "next/dynamic";
import Chat from "@/components/chat";

const GoogleMap = dynamic(() => import("../components/GoogleMap"), {
  ssr: false,
});

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };

  return (
    <div className="grid grid-cols-6 h-screen">
      <div className="col-span-1 bg-gray-100 p-4 mx-2 my-4 rounded-lg">
        <div className="tab">
          <ul className="tab-list">
            {['OverView', 'Chat'].map((tab, index) => (
              <li
                key={tab}
                className={`tab-item ${index === activeTab ? 'active' : ''}`}
                onClick={() => handleTabClick(index)}
              >
                {tab}
              </li>
            ))}
          </ul>
          <div className="tab-content">
            <div className={`tab-pane ${activeTab === 0 ? 'active' : ''}`}>
              <h2 className="text-xl font-bold mb-4">Perth Police</h2>
              <ul>
                <li className="mb-2">Police No: 10</li>
                <li className="mb-2">Emergency No: 5</li>
                <li className="mb-2">Police cat No: 3</li>
              </ul>
            </div>
            <div className={`tab-pane ${activeTab === 1 ? 'active' : ''}`}>
              <h2 className="text-xl font-bold mb-4">Chat</h2>
              <Chat />
            </div>
          </div>
        </div>
      </div>
      <div className="col-span-5 bg-white p-4">
        <GoogleMap />
      </div>
    </div>
  );
};

export default Dashboard;