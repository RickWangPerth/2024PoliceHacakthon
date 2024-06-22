import React, { useState } from "react";
import dynamic from "next/dynamic";

const GoogleMap = dynamic(() => import("../components/GoogleMap"), {
  ssr: false,
});

const Dashboard: React.FC = () => {
  const [level, setLevel] = useState(0);
  const [status, setStatus] = useState('All');
  const [incident, setIncident] = useState('All');
  const [incidentStatus, setIncidentStatus] = useState('All');

  return (
    <div className="grid grid-cols-6 h-screen">
      <div className="col-span-1 bg-gray-100 p-4 mx-2 my-4 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Perth Police</h2>
        <ul>
          <li className="mb-2">Police Officers: 53</li>
          <li className="mb-2">Ongoing Emergencies: 5</li>
          <li className="mb-2">Unassigned Emergencies: 1</li>
          <li className="mb-2">Police Vehicles: 10</li>
        </ul>
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Vehicle Filter</h3>
          <div className="mb-4">
            <label className="block mb-1">Capability</label>
            <select
              value={level}
              onChange={(e) => setLevel(parseInt(e.target.value, 10))}
              className="w-full p-2 border rounded"
            >
              <option value={0}>All</option>
              <option value={1}>1 and above</option>
              <option value={2}>2 and above</option>
              <option value={3}>3 and above</option>
              <option value={4}>4</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="All">All</option>
              <option value="On duty">On duty</option>
              <option value="Patrolling">Patrolling</option>
              <option value="Responding">Responding</option>
            </select>
          </div>
          <h3 className="text-lg font-semibold mb-2">Incident Filter</h3>
          <div className="mb-4">
            <label className="block mb-1">Incident</label>
            <select
              value={incident}
              onChange={(e) => setIncident(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="All">All</option>
              <option value="Car accident">Car accident</option>
              <option value="Robbery">Robbery</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-1">Incident Status</label>
            <select
              value={incidentStatus}
              onChange={(e) => setIncidentStatus(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="All">All</option>
              <option value="Unassigned">Unassigned</option>
              <option value="Processing">Processing</option>
            </select>
          </div>
        </div>
      </div>
      <div className="col-span-5 bg-white p-4">
        <GoogleMap level={level} status={status} incident={incident} incidentStatus={incidentStatus} />
      </div>
    </div>
  );
};

export default Dashboard;
