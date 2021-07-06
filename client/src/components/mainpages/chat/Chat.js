import React, { useState, useEffect, useRef , useContext } from "react";
import socketIOClient from "socket.io-client";
import { GlobalState } from "../../../GlobalState";
import './Chat.css'
const host = "http://localhost:5000";

function Chat() {
    const state = useContext(GlobalState)
    const [name, setName]= state.userAPI.name
    const [mess, setMess] = state.mess;
    const [message, setMessage] = useState('');
    const [id, setId] = useState();
  
    const socketRef = useRef();
    const messagesEnd = useRef();
  
    useEffect(() => {
      socketRef.current = socketIOClient.connect(host)
    
      socketRef.current.on('getId', data => {
        setId(data)
      })
  
      socketRef.current.on('sendDataServer', dataGot => {
        
        setMess(old=> [...old, dataGot])
        scrollToBottom()
      })
  
      return () => {
        socketRef.current.disconnect();
      };
    }, []);
  
    const sendMessage = () => {
      if(message !== null) {
        const msg = {
          content: message, 
          id: id,
          name  : name
        }

       setMess(oldMsg => [...oldMsg, msg]) 
        socketRef.current.emit('sendDataClient', msg)
        setMessage('')
      }
    }
  
    const scrollToBottom = () => {
      messagesEnd.current.scrollIntoView({ behavior: "smooth" });
    }
    
  
    const renderMess =  mess.map((m, index) => 
          <div className={m.name === name ? "user-boxchat" : "other-boxchat"}>
            <p className={m.name === name ? "user-name" : "other-name"}>{m.name} </p> 
          <div key={index} className={`${m.name === name ? 'your-message' : 'other-people'} chat-item`}>
            {m.content}
          </div> 
          </div>
        )
  
    const handleChange = (e) => {
      setMessage(e.target.value)
    }
  
    const onEnterPress = (e) => {
      if(e.keyCode === 13 && e.shiftKey === false) {
        sendMessage()
      }
    }
  
    return (
      <div className="box-chat">
        <div className="box-chat_message">
        {renderMess}
        <div style={{ float:"left", clear: "both" }}
               ref={messagesEnd}>
          </div>
        </div>
  
        <div className="send-box">
            <textarea 
              value={message}  
              onKeyDown={onEnterPress}
              onChange={handleChange} 
              placeholder="Nhập tin nhắn ..." 
            />
            <button onClick={sendMessage}>
              Send
            </button>
        </div>
  
      </div>
    );
}

export default Chat
