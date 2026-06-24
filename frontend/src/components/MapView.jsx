import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const MapView = () => {
  return (
    <MapContainer center={[7.2906, 80.6337]} zoom={13} style={{ height: "400px", width: "100%" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={[7.2906, 80.6337]}>
        <Popup>Bus Location</Popup>
      </Marker>
    </MapContainer>
  );
};

export default MapView;