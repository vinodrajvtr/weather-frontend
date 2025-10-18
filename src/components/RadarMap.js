import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';

const RadarMap = () => {
  const [radarData, setRadarData] = useState([]);

  useEffect(() => {
    const fetchRadar = async () => {
      try {
        const res = await axios.get('https://<YOUR_BACKEND_URL>/api/radar');
        setRadarData(res.data); 
      } catch (err) {
        console.error(err);
      }
    };

    fetchRadar();
    const interval = setInterval(fetchRadar, 60 * 1000); // update every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <MapContainer center={[40, -100]} zoom={4} style={{ height: '100vh', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      {radarData.features?.map((f, idx) => (
        <CircleMarker
          key={idx}
          center={[f.geometry.coordinates[1], f.geometry.coordinates[0]]}
          radius={2}
          color="blue"
        >
          <Popup>Reflectivity: {f.properties.value}</Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
};

export default RadarMap;
