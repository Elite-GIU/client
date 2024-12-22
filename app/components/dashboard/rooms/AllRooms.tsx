import React, { useState, useEffect, useRef } from 'react';
import Cookies from 'js-cookie';
import io, { Socket } from 'socket.io-client';
import { jwtDecode } from 'jwt-decode';
import { FaReply } from "react-icons/fa";
import { formatDistanceToNow, parseISO, isValid, set } from 'date-fns';
import NotificationsPopup from '../../NotificationsPopup';
import StudentGroupPopup from './StudentGroupPopup';
import Loading from '@/app/dashboard/courses/[course_id]/threads/loading';
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
    parentMessage?: Message;
}

interface AllRoomsProps {
    courseId: string;
}

const AllRooms: React.FC<AllRoomsProps> = ({ courseId }) => {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [selectedReply, setSelectedReply] = useState<Message | null>(null);
    const [socket, setSocket] = useState<Socket | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [myId, setMyId] = useState<string | null>(null);
    const messagesContainerRef = useRef<HTMLDivElement | null>(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [students, setStudents] = useState<any[]>([]);
    const students_list = [
        { user_id: "1", name: "Jackson Brady" },
        { user_id: "2", name: "Alice Johnson" },
        { user_id: "3", name: "Liam Smith" },
        { user_id: "4", name: "Sophia Brown" },
      ];
    
    useEffect( () => {
        const fetchStudents = async () => {
            setLoading(true);
            try {
                const token = Cookies.get('Token');
                const response = await fetch(`/api/dashboard/courses/${courseId}/members`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch rooms');
                }
                const data = await response.json();
                setStudents(data);
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };
        fetchStudents();   
        
    }
    , []);

    useEffect(() => {
        const token = Cookies.get('Token');
        if (!token) return;

        const decodedToken: { userId: string } = jwtDecode(token);
        setMyId(decodedToken.userId);

        const newSocket = io('http://localhost:3001');
        setSocket(newSocket);

        newSocket.on('message', (message: Message) => {
            if (selectedRoomId === message.room_id) {
                setMessages((prevMessages) => [...prevMessages, message]);
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
            socket?.emit('joinRoom', selectedRoomId);

            return () => {
                socket?.emit('leaveRoom', selectedRoomId);
            };
        }
    }, [selectedRoomId, socket]);

    useEffect(() => {
        scrollToBottom(); // Scroll to bottom when `messages` updates
    }, [messages]);

    const fetchRooms = async () => {
        setLoading(true);
        try {
            const token = Cookies.get('Token');
            const response = await fetch(`/api/dashboard/courses/${courseId}/rooms`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch rooms');
            }
            const data = await response.json();
            setRooms(data);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    const handleRoomClick = async (roomId: string) => {
        if (roomId !== selectedRoomId) {
            setSelectedRoomId(roomId);
            setMessages([]); // Clear messages while loading new ones

            try {
                const token = Cookies.get('Token');
                const response = await fetch(`/api/dashboard/courses/${courseId}/rooms/${roomId}/messages`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch messages');
                }

                const data: Message[] = await response.json();
                setMessages(data);
            } catch (err) {
                console.error('Failed to fetch messages:', err);
                setError((err as Error).message);
            }
        }
    };

    const handleSelectReply = (message: Message) => {
        setSelectedReply(message);
    };

    const sendMessage = async () => {
        if (!selectedRoomId || !newMessage.trim() || !socket) return;
    
        const messageData = {
            content: newMessage,
        };
    
        // Determine the endpoint based on whether a reply is selected
        const endpoint = selectedReply
            ? `/api/dashboard/courses/${courseId}/rooms/${selectedRoomId}/messages/${selectedReply._id}`
            : `/api/dashboard/courses/${courseId}/rooms/${selectedRoomId}/messages`;
    
        try {
            const token = Cookies.get('Token');
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(messageData),
            });
    
            if (!response.ok) {
                throw new Error('Failed to send message');
            }
    
            const message = await response.json();
            socket.emit('sendMessage', message);
            setNewMessage('');
            setSelectedReply(null); // Optionally clear the reply after sending
        } catch (err) {
            setError((err as Error).message);
        }
    };
    
    const scrollToBottom = () => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    };
    const formatDate = (date: string) => {
        const dateObj = parseISO(date);
        if (!isValid(dateObj)) {
            console.error("Invalid date provided:", date);
            return "Invalid date"; // Handle invalid date explicitly
        }
        return formatDistanceToNow(dateObj, { addSuffix: true });
    };

    const createRoom = async (roomTitle: string, description: string, members_list: string[]) => {
        if (!roomTitle) return;

        try {
            const token = Cookies.get('Token');
            const response = await fetch(`/api/dashboard/courses/${courseId}/rooms`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    title: roomTitle,
                    members_list: members_list,
                    description: description,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create room');
            }

            const newRoom: Room = await response.json();
            setRooms((prevRooms) => [newRoom, ...prevRooms]);
        } catch (err) {
            console.error('Failed to create room:', err);
        }
    };

    if(loading){
        return <Loading />
    }  
    return (
        <div className="text-black flex h-screen bg-gray-100" style={{height: 'calc(100vh - 6rem)'}}>
            {error && <p>Error: {error}</p>}
            <div className="w-1/3 h-full overflow-y-auto bg-white shadow-sm rounded-lg">
            <div className="flex items-center justify-between p-5 border-b border-gray-300">
            <h1 className="text-xl font-bold">Rooms</h1>
            <button
            onClick={()=>setIsPopupOpen(true)}
            className="px-4 py-2 bg-cyan-600 text-white rounded-lg shadow-md hover:bg-cyan-800 transition duration-300">
                +
            </button>
            <StudentGroupPopup
                isOpen={isPopupOpen}
                onClose={() => setIsPopupOpen(false)}
                students={students}
                onCreateGroup={createRoom}
            />
            </div>
                <ul className="divide-y divide-gray-300">
                    {rooms.map((room) => (
                        <li
                            key={room._id+room.title}
                            className={`p-4 cursor-pointer hover:bg-gray-100 ${
                                selectedRoomId === room._id ? 'bg-gray-200' : 'bg-white'
                            }`}
                            onClick={() => handleRoomClick(room._id)}
                            style={{ transition: 'background-color 0.3s' }}
                        >
                            <div className="flex items-center space-x-3">
                                
                                <div className="flex-grow">
                                    <h2 className="font-semibold">{room.title}</h2>
                                    <p className="text-sm text-gray-600">{room.description || 'No description available'}</p>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="w-2/3 h-full  bg-gray-50 flex flex-col">
                <div
                    className="flex-1 overflow-y-auto bg-white shadow p-4 rounded-lg space-y-2"
                    ref={messagesContainerRef}
                >
                {messages.length > 0 ? (
                    messages.map((message) => (
                        <div
                            key={message._id}
                            className={`flex items-start ${message.sender_id._id === myId ? 'flex-row-reverse' : ''}`}
                        >
                            <div
                                className={`flex flex-col m-2 ${
                                    message.sender_id._id === myId ? 'items-end' : 'items-start'
                                }`}
                            >
                                {message.parent_id && (
                                    <div className="bg-gray-200 p-2 rounded-lg text-xs text-gray-600 "
                                        style={{ borderBottomRightRadius: 0 }}
                                    >
                                        Replied to: {messages.find(m => m._id === message.parent_id)?.sender_id.name}
                                        <br />
                                        {messages.find(m => m._id === message.parent_id)?.content}
                                    </div>
                                )}
                                <div
                                    className={`p-2 ${
                                        message.sender_id._id === myId ? 'bg-blue-200' : 'bg-green-200'
                                    } rounded-lg shadow`}
                                    style={{
                                        borderTopLeftRadius: message.parent_id ? 0 : '0.5rem',
                                        borderTopRightRadius: message.parent_id ? 0 : '0.5rem',
                                        wordWrap: 'break-word',
                                        maxWidth: '400px', 
                                    }}
                                >                                    
                                    <p className="text-sm font-semibold">{message.sender_id._id === myId ? 'You' : message.sender_id.name}:</p>
                                    <p className="text-sm">{message.content}</p>
                                    <p className="text-xs text-gray-500">
                                    {message.createdAt ? formatDate(message.createdAt) : "Loading date..."}
                                      
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => handleSelectReply(message)}
                                className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 text-black"
                                title="Reply"
                                style={{ alignSelf: 'center' }}
                            >
                                <FaReply />
                            </button>
                        </div>
                    ))
                ) : (
                    // center the text
                    <p className="text-center p-4 text-gray-500">No Messages To View</p> 
                )}
                </div>
                {selectedReply && (
                    <div className="p-2 bg-gray-200 rounded-md mb-2">
                        Replying to: <strong>{selectedReply.sender_id.name}</strong> - "{selectedReply.content}"
                    </div>
                )}
                {selectedRoomId && (
                <div className="mt-4">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="border p-2 w-full rounded-md"
                        placeholder="Type your message here..."
                    />
                    <button
                        onClick={sendMessage}
                        className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md w-full"
                        disabled={!newMessage.trim()}
                    >
                        Send
                    </button>
                    </div>
                )}
            </div>
        </div>
    );
    
};

export default AllRooms;
