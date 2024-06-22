import React, { useState, useEffect, useRef } from 'react';

const ChatBox: React.FC = () => {
    const [ws, setWs] = useState<WebSocket | null>(null);
    const [messages, setMessages] = useState<{ username: string, message: string, timestamp: string, type: 'text' | 'image' | 'audio' | 'json' }[]>([]);
    const [input, setInput] = useState('');
    const [username, setUsername] = useState<string | null>(localStorage.getItem('username'));
    const [isAskingUsername, setIsAskingUsername] = useState<boolean>(!username);
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorder = useRef<MediaRecorder | null>(null);
    const audioChunks = useRef<Blob[]>([]);

    useEffect(() => {
        if (username) {
            const socket = new WebSocket(`wss://${window.location.host}/api/ws/chat/`);
            //const socket = new WebSocket(`ws://localhost:8000/api/ws/chat/`);
            socket.onmessage = (event) => {
                const data = JSON.parse(event.data);
                setMessages(prev => [...prev, data]);
            };
            setWs(socket);

            return () => {
                socket.close();
            };
        }
    }, [username]);

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const sendMessage = (type: 'text' | 'image' | 'audio', content: string) => {
        if (ws && username) {
            const timestamp = new Date().toLocaleString();
            ws.send(JSON.stringify({ username, message: content, timestamp, type }));
            setInput('');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            sendMessage('text', input);
        }
    };

    const handleUsernameSubmit = () => {
        localStorage.setItem('username', username!);
        setIsAskingUsername(false);
    };

    const handleImageFromCamera = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        const video = document.createElement('video');
        video.srcObject = stream;
        await video.play();
        await new Promise(resolve => setTimeout(resolve, 500));
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d')?.drawImage(video, 0, 0);
        stream.getTracks().forEach(track => track.stop());
        sendMessage('image', canvas.toDataURL('image/png'));
    };

    const handleImageFromAlbum = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = () => {
                sendMessage('image', reader.result as string);
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const startRecording = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder.current = new MediaRecorder(stream);
        mediaRecorder.current.addEventListener('dataavailable', event => {
            audioChunks.current.push(event.data);
        });
        mediaRecorder.current.start();
        setIsRecording(true);
    };

    const stopRecording = () => {
        if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
            mediaRecorder.current.stop();
            mediaRecorder.current.addEventListener('stop', () => {
                const audioBlob = new Blob(audioChunks.current);
                audioChunks.current = [];
                sendMessage('audio', URL.createObjectURL(audioBlob));
                setIsRecording(false);
            });
        }
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
        <div className='chatBox h-full flex flex-col'>
            <div className='chatBox_div flex-1 overflow-y-auto'>
            {messages.map((msg, index) => (
                <div key={index} className={`chatItem_div p-2 m-5 w-10/12 rounded-lg ${msg.username === username ? 'ml-auto bg-blue-100' : 'mr-auto bg-green-100'}`}>
                    <p className='chatItem_header font-bold'>
                        {msg.username} ({msg.timestamp})
                    </p>
                    {msg.type === 'text' && (
                        <p className='chatItem_content'>{msg.message}</p>
                    )}
                    {msg.type === 'image' && (
                        <img src={msg.message} alt="User uploaded" className="max-w-full" />
                    )}
                    {msg.type === 'audio' && (
                        <audio src={msg.message} controls />
                    )}
                    {msg.type === 'json' && (
                        <div>
                            {Object.entries(msg.message.data).map(([key, value]) => (
                                <p key={key}>
                                    <strong>{key}:</strong> {value}
                                </p>
                            ))}
                        </div>
                    )}
                </div>
            ))}
            </div>
            <div className='chatBox_input p-5 m-5 inset-x-0 bottom-0 bg-white flex items-center'>
                <input
                    className='input input-bordered w-full mr-2'
                    placeholder="Message"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <button onClick={() => sendMessage('text', input)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2">
                    Send
                </button>
                <div className="relative">
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        +
                    </button>
                    {/* {isDropdownOpen && (
                        <div className="absolute bottom-full right-0 mb-2 bg-white shadow-lg rounded py-2">
                            <button onClick={handleImageFromCamera} className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                                Camera
                            </button>
                            <input type="file" accept="image/*" onChange={handleImageFromAlbum} className="hidden" id="albumInput" />
                            <label htmlFor="albumInput" className="block w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                Album
                            </label>
                            <button
                                onMouseDown={startRecording}
                                onMouseUp={stopRecording}
                                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                            >
                                {isRecording ? 'Recording...' : 'Press to record'}
                            </button>
                        </div>
                    )} */}
                </div>
            </div>
            {isDropdownOpen && (
                <>
                    {/* <div
                        className="fixed inset-0 z-50 "
                        onClick={() => setIsDropdownOpen(false)}
                    /> */}
                    <div 
                        className="fixed inset-0 flex items-center justify-center z-40 bg-opacity-75 bg-slate-700"
                        onClick={() => setIsDropdownOpen(false)}
                    >
                        <div className="bg-white p-4 rounded shadow-lg">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleImageFromCamera();
                                    setIsDropdownOpen(false)
                                }}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-2 w-full"
                            >
                                Camera
                            </button>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageFromAlbum}
                                className="hidden"
                                id="albumInput"
                            />
                            <label
                                htmlFor="albumInput"
                                onClick={(e) => e.stopPropagation()}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-2 w-full block text-center cursor-pointer"
                            >
                                Album
                            </label>
                            <button
                                onMouseDown={(e) => {
                                    e.stopPropagation();
                                    startRecording();
                                }}
                                onMouseUp={(e) => {
                                    e.stopPropagation();
                                    stopRecording();
                                    setIsDropdownOpen(false);
                                }}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                            >
                                {isRecording ? 'Recording...' : 'Press to record'}
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default ChatBox;