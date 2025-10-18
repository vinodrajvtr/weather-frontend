import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import axios from 'axios';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

export default function RadarMap() {
  const [radarJson, setRadarJson] = useState(null);
  const [error, setError] = useState(null);

  async function fetchRadar() {
    try {
      const res = await axios.get(`${backendUrl}/api/radar`, { timeout: 30000 });
      setRadarJson(res.data);
      setError(null);
    } catch (err) {
      console.error('Fetch radar error:', err);
      setError('Failed to load radar data');
    }
  }

  useEffect(() => {
    fetchRadar();
    const id = setInterval(fetchRadar, 60 * 1000); // every minute
    return () => clearInterval(id);
  }, []);

  const features = radarJson?.features || [];

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <MapContainer center={[38, -97]} zoom={4} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        {features.length > 0 && features.map((f, i) => {
          const coords = f.geometry?.coordinates;
          const value = f.properties?.value ?? f.properties?.REF ?? null;
          if (!coords) return null;
          // coords may be [lon, lat]
          return (
            <CircleMarker
              key={i}
              center={[coords[1], coords[0]]}
              radius={Math.max(1, (value || 1) / 10 )}
            >
              <Popup>Value: {value}</Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
      {error && <div style={{position:'absolute', top:10, left:10, background:'rgba(255,255,255,0.9)', padding:8, borderRadius:4}}>{error}</div>}
    </div>
  );
}
