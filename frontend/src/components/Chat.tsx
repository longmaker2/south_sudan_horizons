import React, { useState } from "react";

interface ChatProps {
  guideName: string; // Prop for the guide's name
  isOpen: boolean; // Prop to control modal visibility
  onClose: () => void; // Prop to close the modal
}

const Chat = ({ guideName, isOpen, onClose }: ChatProps) => {
  const [buttonPosition, setButtonPosition] = useState({ x: 200, y: "50%" }); // State to track button position

  const handleDrag = (
    e: React.MouseEvent<HTMLDivElement | HTMLButtonElement>,
    setPosition: (position: { x: number; y: string }) => void
  ) => {
    const target = e.currentTarget;
    let offsetX = 0,
      offsetY = 0;

    const onMouseMove = (e: MouseEvent) => {
      const x = e.clientX - offsetX;
      const y = `${((e.clientY - offsetY) / window.innerHeight) * 100}%`;
      setPosition({ x, y });
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    offsetX = e.clientX - target.offsetLeft;
    offsetY = e.clientY - target.offsetTop;

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        style={{
          position: "fixed",
          top: buttonPosition.y,
          left: `${buttonPosition.x}px`,
          transform: "translateY(-50%)",
        }}
        onClick={onClose} // Toggle the modal
        onMouseDown={(e) => handleDrag(e, setButtonPosition)}
        className="bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition-all duration-300 cursor-move hover:scale-110"
        title={`Chat with ${guideName}`} // Tooltip
        aria-label="Chat with guide" // Accessibility
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      </button>

      {/* Chat Modal */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            top: buttonPosition.y,
            left: `${buttonPosition.x + 60}px`,
            transform: "translateY(-50%)",
            maxWidth: "90%", // Prevent overflow on small screens
          }}
          className="bg-white rounded-lg shadow-lg w-80"
        >
          <div className="flex justify-between items-center p-4 bg-green-600 rounded-t-lg">
            <h2 className="text-lg font-semibold text-white">
              Chat with {guideName}
            </h2>
            <button
              onClick={onClose} // Close the modal
              className="text-white hover:text-gray-200"
              aria-label="Close chat"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="p-4">
            <p className="text-gray-600">Start chatting with {guideName}!</p>
            <textarea
              autoFocus // Auto-focus when modal opens
              className="w-full mt-4 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="Type your message (max 500 characters)..."
              maxLength={500} // Add a character limit
              rows={3}
            />
            <button
              onClick={() => alert("Message sent!")}
              className="mt-4 w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chat;
