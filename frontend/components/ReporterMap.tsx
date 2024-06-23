import React, { useState, useEffect, useRef } from 'react';

interface ReporterMapProps {
    caseId: string;
}

const ReporterMap: React.FC<ReporterMapProps> = ({ caseId }) => {
    const [ws, setWs] = useState<WebSocket | null>(null);
    const [messages, setMessages] = useState<{ username: string, message: string, timestamp: string, type: 'location' }[]>([]);

    useEffect(() => {
        const socket = new WebSocket(`wss://cloudwa.com.au/api/ws/chat/`);
        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'location') {
                setMessages(prev => [...prev, data]);
            }
        };
        setWs(socket);

        return () => {
            socket.close();
        };
    }, [ caseId]);
    const mapRef = useRef<HTMLDivElement | null>(null);
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [paths, setPaths] = useState<{ [sender: string]: google.maps.LatLng[] }>({});
    const [colors, setColors] = useState<{ [sender: string]: string }>({});

    useEffect(() => {
        if (messages.length > 0) {
            const lastMessage = messages[messages.length - 1];
            const pairs = lastMessage.message.split('**');
            const keyValuePairs = pairs.map(pair => pair.split('##'));

            const latitudeValue = keyValuePairs.find(([key]) => key === 'Latitude')?.[1];
            const longitudeValue = keyValuePairs.find(([key]) => key === 'Longitude')?.[1];
            const sender = keyValuePairs.find(([key]) => key === 'Sender')?.[1];

            if (latitudeValue && longitudeValue && sender) {
                const lat = parseFloat(latitudeValue);
                const lng = parseFloat(longitudeValue);
                const newPosition = new google.maps.LatLng(lat, lng);

                setPaths(prevPaths => ({
                    ...prevPaths,
                    [sender]: [...(prevPaths[sender] || []), newPosition],
                }));

                if (!colors[sender]) {
                    const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
                    setColors(prevColors => ({ ...prevColors, [sender]: randomColor }));
                }
            }
        }
    }, [messages]);

    useEffect(() => {
        const initMap = () => {
            if (mapRef.current && !map) {
                const newMap = new google.maps.Map(mapRef.current, {
                    center: { lat: 0, lng: 0 },
                    zoom: 8,
                });
                setMap(newMap);
            }
        };

        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&callback=initMap`;
        script.async = true;
        script.defer = true;
        (window as any).initMap = initMap;
        document.head.appendChild(script);

        return () => {
            document.head.removeChild(script);
            delete (window as any).initMap;
        };
    }, [map]);

    useEffect(() => {
        if (map) {
            const bounds = new google.maps.LatLngBounds();
            let validBounds = false;

            Object.entries(paths).forEach(([sender, path]) => {
                console.log('Sender:', sender);
                console.log('Path:', path);
            
                if (path.length > 0) {
                    const color = colors[sender];
            
                    path.forEach(position => {
                        if (position instanceof google.maps.LatLng) {
                            bounds.extend(position);
                            validBounds = true;
                        }
                    });
            
                    const polyline = new google.maps.Polyline({
                        path: path,
                        strokeColor: color,
                        strokeOpacity: 1.0,
                        strokeWeight: 2,
                    });
                    polyline.setMap(map);
                }
            });

            if (validBounds) {
                try {
                    map.fitBounds(bounds);
                } catch (error) {
                    console.error('Error fitting bounds:', error);
                }
            }
        }
    }, [map, paths, colors]);   





    return (
        <div className='locationBox h-full flex flex-col'>
            <div ref={mapRef} style={{ height: '400px', width: '100%' }}></div>
            <div className='locationBox_div flex-1 overflow-y-auto'>
                {messages.map((msg, index) => (
                    <div className='chatItem_location'>
                    {(() => {
                        const pairs = msg.message.split('**');
                        const keyValuePairs = pairs.map(pair => pair.split('##'));

                        return keyValuePairs.map(([key, value], pairIndex) => (
                            <p key={pairIndex}>
                                <strong>{key}:</strong> : {value}
                            </p>
                        ));
                    })()}
                </div>            
                ))}
            </div>
            
        </div>
    );
};

export default ReporterMap;