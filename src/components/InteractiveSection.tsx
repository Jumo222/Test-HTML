import { useState } from "react";
import useInteractivity from "../hooks/useInteractivity";

const InteractiveSection: React.FC = () => {
  const { backgroundColor, changeBackgroundColor, counter, incrementCounter } =
    useInteractivity(); //definiere die drei Objekte über die Funktion useInteractivity
  const [message, setMessage] = useState(""); // setzt message mit useState auf ""
  const [displayedMessage, setDisplayedMessage] = useState("");
  const [messageStyle, setMessageStyle] = useState({
    backgroundColor: "",
    color: "",
  });

  const handleShowMessage = () => {
    if (message.trim() === "") {
      setDisplayedMessage("Please enter a message first!");
      setMessageStyle({ backgroundColor: "#ffe8e8", color: "#e74c3c" });
    } else {
      setDisplayedMessage(`Your message: "${message}"`);
      setMessageStyle({ backgroundColor: "#e8f6f3", color: "#27ae60" });
      setMessage("");
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleShowMessage();
    }
  };

  return (
    <section
      id="interactive"
      className="interactive"
      style={{ backgroundColor }}
    >
      <h2>Try Some Interactivity!</h2>
      <button onClick={changeBackgroundColor}>Change Background Color</button>
      {/* hiermit wird die Teilfunktion changeBackgroundColor über line 5 in useInteractivity Funktion aufgerufen*/}
      <button onClick={incrementCounter}>
        Click Counter: <span>{counter}</span>
      </button>

      <div className="user-input">
        <h3>Leave a Message</h3>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyPress} //wenn jemand taste drückt gut handleKeypress ob enter gedrückt wurde
          placeholder="Type your message here..."
        />
        <button onClick={handleShowMessage}>Show Message</button>
        <div style={messageStyle} className="message-display">
          {displayedMessage}
        </div>
      </div>
    </section>
  );
};

export default InteractiveSection;
