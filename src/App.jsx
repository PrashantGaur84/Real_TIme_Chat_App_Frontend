import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import { useMemo } from 'react'
import { io } from 'socket.io-client'
import Chat from './Chat';

const App = () => {
  const socket = useMemo(() => io("https://real-time-chat-app-backend-a13p.onrender.com"), []);

  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("User Connected", socket.id)
    })
  }, [])

  const join_room = (e) => {
    e.preventDefault();
    if (name !== "" && room !== "") {
      socket.emit("join_room", { name, room });
      setJoined(true)
    }
  }

  return (
    <>
      {
        !joined && (
          <div className="container">
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
            <input type="text" value={room} onChange={(e) => setRoom(e.target.value)} />
            <button onClick={join_room} >Join</button>
          </div>
        )
      }
      {
        joined && (
          <Chat name={name} room={room} socket={socket} />
        )
      }
    </>
  )
}

export default App
