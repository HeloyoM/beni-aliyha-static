import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPinHouse } from 'lucide-react'

const LocationMap: React.FC = () => {
    const position: LatLngExpression = [31.708255235849105, 34.967981571097695]; // Example: Tel Aviv coordinates, change this to your location

    return (
        <div style={{ width: '100%', height: '500px' }}>
            <MapContainer center={position} zoom={13} scrollWheelZoom={false} style={{ width: '100%', height: '100%' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={position}>
                    <Popup>
                        Welcome to our community in Israel!
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
};

export default LocationMap;
