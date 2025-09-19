import { useState } from 'react'
import useInteractivity from '../hooks/useInteractivity'

const InteractiveSection: React.FC = () => {
  const { changeBackgroundColor, counter, incrementCounter } = useInteractivity()
  const [message, setMessage] = useState('')
  const [displayedMessage, setDisplayedMessage] = useState('')
  const [messageStyle, setMessageStyle] = useState({ backgroundColor: '', color: '' })

  const handleShowMessage = () => {
    if (message.trim() === '') {
      setDisplayedMessage('Please enter a message first!')
      setMessageStyle({ backgroundColor: '#ffe8e8', color: '#e74c3c' })
    } else {
      setDisplayedMessage(`Your message: "${message}"`)
      setMessageStyle({ backgroundColor: '#e8f6f3', color: '#27ae60' })
      setMessage('')
    }
  }

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleShowMessage()
    }
  }

  return (
    <section id="interactive" className="interactive">
      <h2>Try Some Interactivity!</h2>
      <button onClick={changeBackgroundColor}>Change Background Color</button>
      <button onClick={incrementCounter}>
        Click Counter: <span>{counter}</span>
      </button>

      <div className="user-input">
        <h3>Leave a Message</h3>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message here..."
        />
        <button onClick={handleShowMessage}>Show Message</button>
        <div
          style={messageStyle}
          className="message-display"
        >
          {displayedMessage}
        </div>
      </div>
    </section>
  )
}

export default InteractiveSection