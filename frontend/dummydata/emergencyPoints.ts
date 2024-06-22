const emergencyPoints = [
  {
    position: { lat: -31.9605, lng: 115.8705 },
    icon: '/siren.png',
    data: {
      title: 'Emergency Point 1',
      id: 'EP001',
      incident: 'Car accident',
      time: '10:00:00 2024-07-01',
      status: 'Unassigned'
    }
  },
  {
    position: { lat: -31.9455, lng: 115.8655 },
    icon: '/siren.png',
    data: {
      title: 'Emergency Point 2',
      id: 'EP002',
      incident: 'Robbery',
      time: '11:20:05 2024-07-01',
      status: 'Processing'
    }
  },
  {
    position: { lat: -31.956781, lng: 115.859213 },
    icon: '/siren.png',
    data: {
      title: 'Emergency Point 3',
      id: 'EP003',
      incident: 'Robbery',
      time: '10:00:00 2024-07-01',
      status: 'Processing'
    }
  },
  {
    position: { lat: -31.953803, lng: 115.841618 },
    icon: '/siren.png',
    data: {
      title: 'Emergency Point 4',
      id: 'EP004',
      incident: 'Car accident',
      time: '10:00:00 2024-07-01',
      status: 'Processing'
    }
  },
  {
    position: { lat: -31.948419, lng: 115.855099 },
    icon: '/siren.png',
    data: {
      title: 'Emergency Point 5',
      id: 'EP005',
      incident: 'Car accident',
      time: '10:00:00 2024-07-01',
      status: 'Processing'
    }
  },
];

const updatedEmergencyPoints = emergencyPoints.map(point => ({
  ...point,
  data: {
    ...point.data,
    link: `/accident/${point.data.id}`
  }
}));

export default updatedEmergencyPoints;
