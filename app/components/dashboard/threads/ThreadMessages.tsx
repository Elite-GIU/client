import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';

interface Reply {
  _id: string;
  message_id: string;
  sender_id: {
    _id: string;
    name: string;
    role: string;
  };
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface Message {
  _id: string;
  thread_id: string;
  sender_id: {
    _id: string;
    name: string;
    role: string;
  };
  content: string;
  createdAt: string;
  updatedAt: string;
  replies: Reply[];
}

interface ThreadMessagesProps {
  messages: Message[];
  onSendMessage: (content: string, parentId?: string) => void; // ParentId is optional for new messages
}

const ThreadMessages: React.FC<ThreadMessagesProps> = ({ messages, onSendMessage }) => {
  const [messageTexts, setMessageTexts] = useState<{ [key: string]: string }>({});
  const [visibleReplies, setVisibleReplies] = useState<{ [key: string]: boolean }>({});
  const [newMessage, setNewMessage] = useState<string>(''); // State for new message input

  const handleReplySubmit = (event: React.FormEvent<HTMLFormElement>, messageId: string) => {
    event.preventDefault();
    const messageText = messageTexts[messageId];
    if (messageText && messageText.trim()) {
      onSendMessage(messageText, messageId);
      setMessageTexts((prev) => ({ ...prev, [messageId]: '' }));
    }
  };

  const handleNewMessageSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage); // Call onSendMessage without a parentId for a new message
      setNewMessage(''); // Clear the input field
    }
  };

  const handleMessageChange = (messageId: string, text: string) => {
    setMessageTexts((prev) => ({ ...prev, [messageId]: text }));
  };

  const toggleRepliesVisibility = (messageId: string) => {
    setVisibleReplies((prev) => ({ ...prev, [messageId]: !prev[messageId] }));
  };

  return (
    <div className="space-y-6">
      {/* New Message Input */}
      <form className="mb-6" onSubmit={handleNewMessageSubmit}>
        <textarea
          className="w-full p-2 text-gray-800 border rounded-md resize-none mb-2"
          placeholder="Write a new message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          rows={2}
        ></textarea>
        <button
          type="submit"
          className="px-4 py-2 bg-[#98C1D9] text-white text-sm font-medium rounded-md hover:bg-[#86afd9] w-full"
        >
          Send Message
        </button>
      </form>

      {/* Message List */}
      {messages.map((message) => (
        <div key={message._id} className="bg-white rounded-lg shadow p-6">
          {/* Message Header */}
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-semibold text-gray-900">
              {message.sender_id.name} <span className="text-sm text-gray-600">({message.sender_id.role})</span>
            </h4>
            <span className="text-sm text-gray-500">
              {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
            </span>
          </div>

          {/* Message Content */}
          <div className="bg-gray-100 p-4 rounded-md mb-4">
            <p className="text-gray-800">{message.content}</p>
          </div>

          {/* Replies Button */}
          {message.replies?.length > 0 && (
            <button
              className="text-blue-500 hover:text-blue-600 font-medium text-sm mb-4"
              onClick={() => toggleRepliesVisibility(message._id)}
            >
              {visibleReplies[message._id] ? 'Hide Replies' : `View Replies (${message.replies.length})`}
            </button>
          )}

          {/* Replies Section */}
          <div className="ml-6 mt-4 space-y-4">
            {visibleReplies[message._id] &&
              message.replies?.map((reply) => (
                <div key={reply._id} className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm text-gray-700">
                    <strong className="text-gray-900">{reply.sender_id.name}</strong>: {reply.content}
                  </p>
                  <span className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
                  </span>
                </div>
              ))}

            {/* Always Visible Reply Textbox */}
            <form
              className="mt-4 flex items-center space-x-2"
              onSubmit={(e) => handleReplySubmit(e, message._id)}
            >
              <textarea
                className="flex-grow p-2 text-gray-800 border rounded-md resize-none"
                placeholder="Write a reply..."
                value={messageTexts[message._id] || ''}
                onChange={(e) => handleMessageChange(message._id, e.target.value)}
                rows={1}
              ></textarea>
              <button
                type="submit"
                className="px-4 py-2 bg-[#98C1D9] text-white text-sm font-medium rounded-md hover:bg-[#86afd9]"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ThreadMessages;
