interface MessagesContainerProps {
  timestamp: number;
  message: string;
}

import "./App.css"

export default function MessagesContainer({ timestamp, message }: MessagesContainerProps) {
  return (
    <div className='chat-roll'>
      <div className='timestamp'>
        {timestamp}:{' '}
      </div>
      <div className='timestamp-message'>
        {message}
      </div>
    </div>
  )
}
