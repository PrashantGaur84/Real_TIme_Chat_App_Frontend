import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react'

const Chat = ({ name, room, socket }) => {

    const [messageList, setMessageList] = useState([]);
    const [currentMessage, setCurrentMessage] = useState("");

    useEffect(() => {
        const handleMessageList = (data) => {
            setMessageList((list) => [...list, data]);
            // console.log("Samne se aya ",data);
            // const answer = data.author === name ? 'you' : 'other';
            // console.log(answer);
            // console.log("Ye list he puri ",messageList);
        }

        socket.on("recieve-message", handleMessageList);

        return()=>{
            socket.off("recieve-message" , handleMessageList);
        }
    }, [messageList])

    const sendMessage = async () => {
        if (currentMessage !== "") {
            const messageData = {
                id:Date.now() + Math.random(),
                author: name,
                room: room,
                message: currentMessage,
                time: new Date(Date.now()).getHours() % 12 + ":" + new Date(Date.now()).getMinutes()
            }
            await socket.emit("send-message", messageData);
            setMessageList((list) => [...list, messageData]);
            setCurrentMessage("");
        }
    }

    return (
        <>
            <div className="chat_container">
                <h1>Welcome {name} in room :- {room}</h1>
                <div className="chat_box">
                    {messageList.map((messages) => (
                        <div key={messages.id} className="messsage-content" id={(messages.author === name) ? 'you' : 'other'}>
                            <div>
                                <div className="msg" id={(messages.author === name) ? 'y' : 'o'} >
                                    <p>{messages.message}</p>
                                </div>
                                <div className="msg_detail">
                                    <p>{messages.author}</p>
                                    <p>{messages.time}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="sender">
                    <input type="text" value={currentMessage} onChange={(e) => setCurrentMessage(e.target.value)} />
                    <button onClick={sendMessage} >Send</button>
                </div>
            </div>
        </>
    )
}

export default Chat