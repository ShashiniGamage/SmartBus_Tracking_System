import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Hardcoded coordinates for Sri Lankan Bus routes (Kandy to Colombo & Mawanella to Kegalle)
const sampleStops = {
  "Kandy-Colombo": [
    { name: "Kandy", lat: 7.2906, lng: 80.6337 },
    { name: "Peradeniya", lat: 7.2714, lng: 80.5923 },
    { name: "Pilimathalawa", lat: 7.2652, lng: 80.5488 },
    { name: "Kadugannawa", lat: 7.2558, lng: 80.5186 },
    { name: "Mawanella", lat: 7.2524, lng: 80.4435 },
    { name: "Kegalle Town", lat: 7.2517, lng: 80.3464 },
    { name: "Warakapola", lat: 7.2241, lng: 80.1982 },
    { name: "Nittambuwa", lat: 7.1432, lng: 80.0963 },
    { name: "Kadawatha", lat: 6.9972, lng: 79.9536 },
    { name: "Colombo Fort", lat: 6.9344, lng: 79.8428 }
  ],
  "Mawanella-Kegalle": [
    { name: "Mawanella", lat: 7.2524, lng: 80.4435 },
    { name: "Anwarama", lat: 7.2533, lng: 80.4121 },
    { name: "Uthuwankanda", lat: 7.2541, lng: 80.3998 },
    { name: "Molagoda", lat: 7.2529, lng: 80.3745 },
    { name: "Kegalle Town", lat: 7.2517, lng: 80.3464 }
  ]
};

const LiveRoute = () => {
  const [selectedRoute, setSelectedRoute] = useState("Kandy-Colombo");
  const [busPosition, setBusPosition] = useState({ lat: 7.2906, lng: 80.6337 }); // Starting at Kandy
  const [stopIndex, setStopIndex] = useState(0);

  // Simulation loop: Moving the bus automatically between stops
  useEffect(() => {
    const stops = sampleStops[selectedRoute];
    const interval = setInterval(() => {
      setStopIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % stops.length;
        setBusPosition({ lat: stops[nextIndex].lat, lng: stops[nextIndex].lng });
        return nextIndex;
      });
    }, 5000); // Moves every 5 seconds to next stop

    return () => clearInterval(interval);
  }, [selectedRoute]);

  const activeStops = sampleStops[selectedRoute];
  const polylinePositions = activeStops.map(stop => [stop.lat, stop.lng]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-darkGray mb-4">Live <span className="text-primaryRed">Bus Tracking Map</span></h1>
      
      {/* Route Selector Dropdown */}
      <div className="mb-6 bg-pureWhite p-4 rounded-lg shadow border border-red-100 flex items-center space-x-4">
        <label className="font-bold text-gray-700">Select Bus Route:</label>
        <select 
          value={selectedRoute} 
          onChange={(e) => { setSelectedRoute(e.target.value); setStopIndex(0); }}
          className="border border-gray-300 rounded p-2 focus:border-primaryRed focus:outline-none"
        >
          <option value="Kandy-Colombo">Kandy → Colombo Fort</option>
          <option value="Mawanella-Kegalle">Mawanella → Kegalle Town</option>
        </select>
      </div>

      {/* Map Rendering Container */}
      <div className="h-125 w-full rounded-lg overflow-hidden shadow-xl border-2 border-primaryRed">
        <MapContainer center={[7.2517, 80.3464]} zoom={10} style={{ height: '100%', width: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          
          {/* Plotting Route Polyline */}
          <Polyline positions={polylinePositions} color="red" weight={4} />

          {/* Plotting All Route Stops */}
          {activeStops.map((stop, idx) => (
            <Marker key={idx} position={[stop.lat, stop.lng]}>
              <Popup><b className="text-primaryRed">{stop.name}</b> - Bus Stop</Popup>
            </Marker>
          ))}

          {/* Live Moving Bus Marker */}
          <Marker position={[busPosition.lat, busPosition.lng]}>
            <Popup><div className="font-bold text-darkRed">🚌 SmartBus (Moving...)</div><div>Next Stop: {activeStops[(stopIndex + 1) % activeStops.length].name}</div></Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
};

export default LiveRoute;