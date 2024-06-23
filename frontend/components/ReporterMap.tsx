import React, { useState, useEffect } from 'react';

const ReporterMap: React.FC = () => {
    const [ws, setWs] = useState<WebSocket | null>(null);
    const [messages, setMessages] = useState<{ username: string, message: string, timestamp: string, type: 'location' }[]>([]);
    const [username, setUsername] = useState<string | null>(localStorage.getItem('username'));
    const [isAskingUsername, setIsAskingUsername] = useState<boolean>(!username);

    useEffect(() => {
        if (username) {
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
        }
    }, [username]);

    const handleUsernameSubmit = () => {
        localStorage.setItem('username', username!);
        setIsAskingUsername(false);
    };

    if (isAskingUsername) {
        return (
            <div className="inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                <div className="p-5 bg-white rounded">
                    <input
                        placeholder="Enter your username"
                        value={username || ''}
                        onChange={e => setUsername(e.target.value)}
                        className="input input-bordered w-full max-w-xs shadow appearance-none border border-red-500 rounded py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                    />
                    <button onClick={handleUsernameSubmit} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Submit</button>
                </div>
            </div>
        );
    }

    return (
        <div className='locationBox h-full flex flex-col'>
            <div className='locationBox_div flex-1 overflow-y-auto'>
                {messages.map((msg, index) => (
                    <div key={index} className={`locationItem_div p-2 m-5 w-10/12 rounded-lg ${msg.username === username ? 'ml-auto bg-blue-100' : 'mr-auto bg-green-100'}`}>
                        <p className='locationItem_header font-bold'>
                            {msg.username} ({msg.timestamp})
                        </p>
                        <div className='locationItem_content'>
                            <a className='blue-600 underline' href={`https://www.google.com.au/maps/search/${msg.message.replace(/ /g, '+')}`} target="_blank" rel="noopener noreferrer">
                                {msg.message}
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ReporterMap;