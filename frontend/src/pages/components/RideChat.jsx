import { useContext, useState } from "react";
import { SocketContext } from "./SocketContext";

const RideChat = ({ rideId, messages, setMessages }) => {
  const { socket } = useContext(SocketContext);
  const [text, setText] = useState("");

  const sendMessage = () => {
    if (!text.trim()) return;

    socket.emit("send-message", { rideId, message: text });
    setMessages((prev) => [...prev, { msg: text, by: "me" }]);
    setText("");
  };

  return (
    <div className="fixed bottom-24 right-3 w-80 bg-white rounded-xl shadow-lg">
      <div className="p-3 border-b font-semibold">
        Driver Chat
      </div>

      <div className="h-40 overflow-y-auto p-2 space-y-2">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`p-2 rounded text-sm max-w-[70%] ${
              m.by === "me"
                ? "bg-green-600 text-white ml-auto"
                : "bg-gray-200"
            }`}
          >
            {m.msg}
          </div>
        ))}
      </div>

      <div className="flex p-2 gap-2 border-t">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 border rounded p-2 text-sm"
          placeholder="Message driver..."
        />
        <button
          onClick={sendMessage}
          className="bg-green-600 text-white px-3 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default RideChat;
