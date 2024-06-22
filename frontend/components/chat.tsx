// pages/chat.tsx
import React, { useState, useEffect } from 'react';

interface ChatProps {
    username: string;
}

const Chat: React.FC<ChatProps> = ({ username }) => {
    const [ws, setWs] = useState<WebSocket | null>(null);
    const [messages, setMessages] = useState<{ username: string, message: string, timestamp: string }[]>([]);
    const [input, setInput] = useState('');

    useEffect(() => {
        const socket = new WebSocket(`wss://${window.location.host}/api/ws/chat/`);
        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setMessages(prev => [...prev, data]);
        };
        setWs(socket);

        return () => {
            socket.close();
        };
    }, []);

    const sendMessage = () => {
        if (ws) {
            const timestamp = new Date().toLocaleString();
            ws.send(JSON.stringify({ username, message: input, timestamp }));
            setInput('');
        }
    };

    return (
        <div>
            <input
                placeholder="Message"
                value={input}
                onChange={e => setInput(e.target.value)}
            />
            <button onClick={sendMessage}>Send</button>
            <div>
                {messages.map((msg, index) => (
                    <p key={index}>
                        <strong>{msg.username}</strong> ({msg.timestamp}): {msg.message}
                    </p>
                ))}
            </div>
        </div>
    );
}

export default Chat;