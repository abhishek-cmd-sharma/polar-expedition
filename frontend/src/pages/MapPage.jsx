import { API_BASE_URL } from '../config';
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Map as MapIcon, Navigation } from 'lucide-react';

import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix Leaflet's default icon issue in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetina,
  iconUrl: icon,
  shadowUrl: iconShadow,
});

const MapPage = () => {
  const [teams, setTeams] = useState([]);
  
  // Antarctica center coordinates
  const mapCenter = [-82.8628, 135.0000];

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/teams', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          // Add some fake coordinates for the prototype map since we don't have real GPS yet
          const mappedTeams = data.map((team, idx) => ({
            ...team,
            lat: mapCenter[0] + (Math.random() * 2 - 1),
            lng: mapCenter[1] + (Math.random() * 2 - 1)
          }));
          setTeams(mappedTeams);
        }
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="space-y-6 text-white h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center">
          <MapIcon className="w-6 h-6 mr-2 text-blue-400" />
          Live Expedition Map
        </h2>
        <div className="flex space-x-2">
          <button className="bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded text-sm transition-colors">Satellite View</button>
          <button className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm transition-colors">Recenter</button>
        </div>
      </div>
      
      <div className="flex-1 bg-slate-800 rounded-lg border border-slate-700 relative overflow-hidden z-0">
        <MapContainer center={mapCenter} zoom={4} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {teams.map((team) => (
            <Marker key={team._id || team.id} position={[team.lat, team.lng]}>
              <Popup>
                <div className="text-slate-900">
                  <strong>{team.name}</strong><br />
                  Status: {team.status}<br />
                  Location: {team.location}<br />
                  Members: {team.members}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default MapPage;
