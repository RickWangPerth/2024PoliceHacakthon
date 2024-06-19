export const generatePoliceCarInfo = (data: any) => `
  <div style="padding: 0;">
    <h3 style="margin: 0; padding: 5px 10px; font-size: 16px; color: #1976d2;">${data.title}</h3>
    <p style="margin: 0; padding: 5px 10px; font-size: 14px;"> <strong>Number of officers:</strong> ${data.officers}</p>
    <p style="margin: 0; padding: 5px 10px; font-size: 14px;"> <strong>Status:</strong> ${data.status}</p>
  </div>
`;

export const generateEmergencyPointInfo = (data: any) => `
  <div style="padding: 0;">
    <h3 style="margin: 0; padding: 5px 10px; font-size: 16px; color: #d32f2f;">${data.title}</h3>
    <p style="margin: 0; padding: 5px 10px; font-size: 14px;"> <strong>ID:</strong> ${data.id}</p>
    <p style="margin: 0; padding: 5px 10px; font-size: 14px;"> <strong>Incident:</strong> ${data.incident}</p>
    <p style="margin: 0; padding: 5px 10px; font-size: 14px;"> <strong>Report time:</strong> ${data.time}</p>
  </div>
`;

export const generatePoliceStationInfo = (data: any) => `
  <div style="padding: 0;">
    <h3 style="margin: 0; padding: 5px 10px; font-size: 16px; color: #1976d2;">${data.title}</h3>
    <p style="margin: 0; padding: 5px 10px; font-size: 14px;"> <strong>Address:</strong> ${data.address}</p>
    <p style="margin: 0; padding: 5px 10px; font-size: 14px;"> <strong>Open Hour:</strong> ${data.open}</p>
  </div>
`;
