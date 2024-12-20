import React from 'react';

interface NotificationsPopupProps {
  closePopup: () => void;
    notifications: { _id: string, title: string; message: string }[];
}

const NotificationsPopup: React.FC<NotificationsPopupProps> = ({
  closePopup,
  notifications,
}) => {

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white text-gray-800 shadow-lg rounded-md border border-gray-200 z-50">
      <div className="p-4">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
          onClick={closePopup}
          aria-label="Close"
        >
          ✕
        </button>
        {notifications.length === 0 ? (
          <div className="text-center">
            <h4 className="text-lg font-semibold">No notifications</h4>
            <p className="text-sm text-gray-500">
              We'll let you know when deadlines are approaching, or there is a
              course update.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {notifications.map((notification) => (
              <li
                key={notification._id}
                className="p-3 hover:bg-gray-100 cursor-pointer"
              >
                {notification.message}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default NotificationsPopup;
