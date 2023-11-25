import { useCallback, useEffect, useState } from 'react'
import './App.css'
import useWebSocket, { ReadyState } from 'react-use-websocket';

function App() {
  const [messageHistory, setMessageHistory] = useState([]);
  const [currentMessage, setMessage] = useState('');

  const { sendJsonMessage, lastMessage, readyState } = useWebSocket(
    'wss://3ie59gxh10.execute-api.us-east-1.amazonaws.com/dev',
    {
      onOpen: () => console.log('Conexão estabelecida!'),
    },
  );

  useEffect(() => {
    if (lastMessage !== null) {
      setMessageHistory((prev: any) => prev.concat(JSON.parse(lastMessage)));
      console.log(lastMessage);
    }
  }, [lastMessage, setMessageHistory]);

  const handleClickSendMessage = useCallback(() => {
    sendJsonMessage(JSON.stringify(currentMessage));
  }, []);

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
        <input type="text" value={currentMessage} onChange={(e) => setMessage(e.target.value)} />
        <button type="button" onClick={handleClickSendMessage} disabled={readyState !== ReadyState.OPEN}>
          Enviar
        </button>
        <span>O socket está: {connectionStatus}</span>
        {lastMessage ? <span>Ultima mensagem: {lastMessage.data}</span> : null}
        <ul>
          {messageHistory.map((message: any, idx: number) => (
            <span key={idx}>{message ? message.data : null}</span>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default App
