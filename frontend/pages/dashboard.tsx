// pages/dashboard.tsx
import React from "react";
import dynamic from "next/dynamic";

const GoogleMap = dynamic(() => import("../components/GoogleMap"), {
  ssr: false,
});

const Dashboard: React.FC = () => {
  return (
    <div className="grid grid-cols-6 h-screen">
      <div className="col-span-1 bg-gray-100 p-4 mx-2 my-4 rounded-lg">
        {/* 统计表 */}
        <h2 className="text-xl font-bold mb-4">Perth Police</h2>
        <ul>
          <li className="mb-2">Police No: 10</li>
          <li className="mb-2">Emergency No: 5</li>
          <li className="mb-2">Police cat No: 3</li>
        </ul>
      </div>
      <div className="col-span-5 bg-white p-4">
        <GoogleMap />
      </div>
    </div>
  );
};

export default Dashboard;
