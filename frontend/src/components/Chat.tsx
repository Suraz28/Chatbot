import { useState } from "react";
import { sendMessage } from "../api.ts";
import { getFaqResponse } from "../firebase.ts";

const Chat = () => {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>(
    []
  );
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input.trim()) return;

    // user's message
    const userMessage = { sender: "user", text: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    // check firestore for a predefined response
    const faqResponse = await getFaqResponse(input);

    if (faqResponse) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "bot", text: faqResponse },
      ]);
    } else {
      // call OpenAI API if no match found in firestore
      const botResponse = await sendMessage(input);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "bot", text: botResponse },
      ]);
    }

    setInput(""); // clear input after sending
  };

  return (
    <div>
      <div>
        {messages.map((msg, index) => (
          <p key={index} style={{ color: msg.sender === "user" ? "blue" : "green" }}>
            {msg.text}
          </p>
        ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask a question..."
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
};

export default Chat;