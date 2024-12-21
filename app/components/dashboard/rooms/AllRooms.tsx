import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import io, { Socket } from 'socket.io-client';

interface Room {
    _id: string;
    title: string;
    description: string;
}

interface Sender {
    _id: string;
    name: string;
    role: string;
}

interface Message {
    _id: string;
    course_id: string;
    room_id: string;
    sender_id: Sender;
    parent_id: string | null;
    content: string;
    createdAt: string;
    updatedAt: string;
}

interface AllRoomsProps {
    courseId: string;
}

const AllRooms: React.FC<AllRoomsProps> = ({ courseId }) => {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [socket, setSocket] = useState<Socket | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const newSocket = io('http://localhost:3001');
        setSocket(newSocket);

        newSocket.on('message', (message: Message) => {
            console.log("Received message: ", message);
            console.log("Selected room ID at message event: ", selectedRoomId);
            if (selectedRoomId === message.room_id) {
                setMessages(prevMessages => [...prevMessages, message]);
            }
        });

        return () => {
            newSocket.close();
        };
    }, [selectedRoomId]);

    useEffect(() => {
        fetchRooms();
    }, [courseId]);

    useEffect(() => {
        if (selectedRoomId) {
            console.log("Joining room: ", selectedRoomId);
            socket?.emit('joinRoom', selectedRoomId);

            return () => {
                console.log("Leaving room: ", selectedRoomId);
                socket?.emit('leaveRoom', selectedRoomId);
            };
        }
    }, [selectedRoomId, socket]);

    const fetchRooms = async () => {
        setLoading(true);
        try {
            const token = Cookies.get('Token');
            const response = await fetch(`/api/dashboard/courses/${courseId}/rooms`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch rooms');
            }
            const data = await response.json();
            setRooms(data);
            console.log("Rooms fetched: ", data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRoomClick = (roomId: string) => {
        console.log("Room clicked: ", roomId);
        if (roomId !== selectedRoomId) {
            console.log("Setting selected room ID: ", roomId);
            console.log("Selected room ID: ", selectedRoomId);
            setSelectedRoomId(roomId);
            setMessages([]);
        }
    };

    const sendMessage = async () => {
        if (!selectedRoomId || !newMessage.trim() || !socket) return;

        try {
            const token = Cookies.get('Token');
            const response = await fetch(`/api/dashboard/courses/${courseId}/rooms/${selectedRoomId}/messages`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ content: newMessage }),
            });

            if (!response.ok) {
                throw new Error('Failed to send message');
            }

            const message = await response.json();
            console.log("Message sent: ", message);
            socket.emit('sendMessage', message);
            setNewMessage('');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="flex text-black h-screen bg-gray-100">
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}
            <div className="w-1/3 h-full overflow-y-auto bg-white shadow">
                <h1 className="text-lg font-bold text-center p-4 border-b">Rooms</h1>
                <ul className="divide-y">
                    {rooms.map(room => (
                        <li key={room._id}
                            className={`p-4 cursor-pointer hover:bg-gray-200 ${selectedRoomId === room._id ? 'bg-gray-300' : 'bg-white'}`}
                            onClick={() => handleRoomClick(room._id)}>
                            <h2 className="font-semibold">{room.title}</h2>
                            <p className="text-sm text-gray-600">{room.description || 'No description available'}</p>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="w-2/3 h-full p-4 bg-gray-50">
                <h2 className="text-lg font-semibold">Room Details</h2>
                <div>
                    {messages.length > 0 ? (
                        messages.map(message => (
                            <div key={message._id} className={`p-2 ${message.parent_id ? 'ml-4 border-l-2 border-gray-300' : ''}`}>
                                {message.parent_id && <p className="text-xs text-gray-500">Reply to: {messages.find(m => m._id === message.parent_id)?.content}</p>}
                                <p><strong>{message.sender_id.name}:</strong> {message.content}</p>
                                <p className="text-xs text-gray-500">Sent on {new Date(message.createdAt).toLocaleString()}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">Select a room to view messages or no messages available.</p>
                    )}
                </div>
                <div className="mt-4">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="border p-2 w-full"
                        placeholder="Type your message here..."
                    />
                    <button
                        onClick={sendMessage}
                        className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        disabled={!newMessage.trim()}
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AllRooms;
