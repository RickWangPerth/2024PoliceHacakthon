// pages/chat.tsx
import React, { useState, useEffect } from 'react';

const Chat = () => {
    const [ws, setWs] = useState<WebSocket | null>(null);
    const [messages, setMessages] = useState<string[]>([]);
    const [input, setInput] = useState('');

    useEffect(() => {
        const socket = new WebSocket(`ws://${window.location.host}/api/chat/`);
        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setMessages(prev => [...prev, data.message]);
        };
        setWs(socket);

        return () => {
            socket.close();
        };
    }, []);

    const sendMessage = () => {
        if (ws) {
            ws.send(JSON.stringify({ message: input }));
            setInput('');
        }
    };

    return (
        <div>
            <input value={input} onChange={e => setInput(e.target.value)} />
            <button onClick={sendMessage}>Send</button>
            <div>
                {messages.map((msg, index) => (
                    <p key={index}>{msg}</p>
                ))}
            </div>
        </div>
    );
}

export default Chat;