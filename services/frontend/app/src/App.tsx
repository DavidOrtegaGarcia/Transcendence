import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
// Usamos las librerías base que ya instalaste
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// Necesario para que Echo funcione
window.Pusher = Pusher;

// Configuramos Echo manualmente
const echo = new Echo({
  broadcaster: 'reverb',
  key: import.meta.env.VITE_REVERB_APP_KEY,
  wsHost: window.location.hostname, // localhost
  wsPort: 443,
  wssPort: 443,
  forceTLS: true,
  enabledTransports: ['ws', 'wss'],
});

function App() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    console.log("Iniciando escucha de eventos en 'test-channel'...");

    // Suscribirse al canal y escuchar el evento
    const channel = echo.channel('test-channel')
      .listen('.TestEvent', (data: any) => {
        console.log('¡EVENTO RECIBIDO!', data);
        alert('Mensaje de Laravel: ' + data.message);
      });

    // Limpiar la conexión al cerrar el componente
    return () => {
      echo.leaveChannel('test-channel');
    };
  }, []);

  return (
    <>
      <div>
        <img src={viteLogo} className="logo" alt="Vite logo" />
        <img src={reactLogo} className="logo react" alt="React logo" />
      </div>
      <h1>Conexión Directa OK</h1>
      <div className="card">
        <p>📡 Estado: Conectado a Reverb (101)</p>
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
    </>
  )
}

export default App;