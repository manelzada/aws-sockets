/* eslint-disable @typescript-eslint/no-explicit-any */


import { useEffect, useState } from 'react'
import './App.css'
import useWebSocket, { ReadyState } from 'react-use-websocket';

function App() {
  const [messageHistory, setMessageHistory] = useState([]);
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
  }

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Conectando',
    [ReadyState.OPEN]: 'Aberto',
    [ReadyState.CLOSING]: 'Fechando',
    [ReadyState.CLOSED]: 'Fechado',
    [ReadyState.UNINSTANTIATED]: 'Não instanciado',
  }[readyState];

  return (
    <div className='chat-container'>
      <div className="chat">
        <input type="text" value={currentMessage} onKeyDown={(e) => {
          if (e.key === 'Enter') {
            sendMessage()
          }
        }} onChange={(e) => setMessage(e.target.value)} />
        <button type="button" onClick={sendMessage} disabled={readyState !== ReadyState.OPEN}>
          Enviar
        </button>
        <span>O socket está: {connectionStatus}</span>
        {lastJsonMessage ? <span>Ultima mensagem: {lastJsonMessage.data}</span> : null}
        <ul>
          {messageHistory.map((message: any, idx: number) => (
            <span key={idx}>{message ? JSON.parse(message.message) : null}</span>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default App
