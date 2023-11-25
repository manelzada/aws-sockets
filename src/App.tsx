/* eslint-disable @typescript-eslint/no-explicit-any */


import { useEffect, useState } from 'react'
import './App.css'
import useWebSocket, { ReadyState } from 'react-use-websocket';
import MessagesContainer from './MessagesContainer';

type Message = {
  timestamp: number;
  message: string;
}

function App() {
  const [messageHistory, setMessageHistory] = useState<Message[]>([]);
  const [currentMessage, setMessage] = useState('');

  const { sendJsonMessage, lastMessage: lastJsonMessage, readyState } = useWebSocket(
    'wss://3ie59gxh10.execute-api.us-east-1.amazonaws.com/dev',
    {
      onOpen: () => console.log('Conexão estabelecida!'),
    },
  );

  useEffect(() => {
    if (lastJsonMessage !== null) {
      console.log('lastJsonMessage: ', lastJsonMessage)
      const messageData = lastJsonMessage.data;
      setMessageHistory((prev: any) => prev.concat(JSON.parse(messageData)));
      console.log(messageData);
      console.log('lastMessage: ', messageData)
    }
  }, [lastJsonMessage, setMessageHistory]);


  const sendMessage = async () => {
    console.log(currentMessage)
    sendJsonMessage(currentMessage);
    setMessage('');
  }

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Entrando',
    [ReadyState.OPEN]: 'Online',
    [ReadyState.CLOSING]: 'Saindo',
    [ReadyState.CLOSED]: 'Fechado',
    [ReadyState.UNINSTANTIATED]: 'Não instanciado',
  }[readyState];

  return (
    <div className='chat-container'>
      <div className="chat">
        <span>Status do socket: {connectionStatus}</span>
        <div className="message-container">
          {messageHistory.map((message) => (
            <MessagesContainer key={message.timestamp} timestamp={message.timestamp} message={message.message} />
          ))}
        </div>
        <div className="send">
          <input type="text" placeholder='Digite a mensagem...' value={currentMessage} onKeyDown={(e) => {
            if (e.key === 'Enter') {
              sendMessage()
            }
          }} onChange={(e) => setMessage(e.target.value)} />
          <button type="button" className='button' onClick={sendMessage} disabled={readyState !== ReadyState.OPEN}>
            Enviar
          </button>

        </div>
      </div>
        <div className="back" />
    </div>
  )
}

export default App
