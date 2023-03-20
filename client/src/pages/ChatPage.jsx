import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { UserContext } from "../UserContext";
import Header from "../Header";
import { io } from "socket.io-client";

export default function () {
    const url = 'http://localhost:8000/'
    const socket = useRef();
    const { user, setUser, ready } = useContext(UserContext);
    const navigate = useNavigate();
    const [onlinePeople, setOnlinePeople] = useState();
    const [selectedId, setSelectedId] = useState(null);
    const [newMsg, setNewMsg] = useState('');
    const[messages, setMessages]  = useState([]);

    useEffect(() => {
        if (!ready && !user) {
            navigate('/login');
        }
        else {
            const cookies = document.cookie.split(';').reduce((acc, c) => {
                const [key, value] = c.trim().split('=');
                acc[key] = value;
                return acc;
            });
            socket.current = io(url, {
                query: { cookies },
            });
            socket.current.on('onlineUsers', (users) => {
                // console.log(users)
                setOnlinePeople(users);
            })
            socket.current.on('msg-recieve', (msg)=>{
                console.log("message is listned");
            })
            
        }
    }, [user, ready]);

    useEffect(()=>{
        socket.current.on('msg-recieve', (msg)=>{
            console.log("message is listned");
        })
    })

    function randomColor(id) {
        const colors = ['bg-red-200', 'bg-green-200', 'bg-blue-200', 'bg-orange-200', 'bg-lime-200', 'bg-emerald-200'];
        const userIdbase10 = parseInt(id, 16);
        const colorIndex = userIdbase10 % colors.length;
        return colors[colorIndex];
    }

    const sendMsg = (ev) => {
        ev.preventDefault();
        console.log(selectedId, newMsg);
        socket.current.emit("newMsg", {
            recipient: selectedId,
            text: newMsg
        })
        setMessages((prev) => ([...prev, {text: newMsg, isMine: true}]));
        setNewMsg('');
    }

    return (
        <div className="flex h-screen">
            <div className="bg-white w-1/4">
                <Header />
                <div className=" mt-2">
                    {onlinePeople && Object.keys(onlinePeople).filter(key => onlinePeople[key]?.id != user?._id).map((key) => {
                        return (
                            <div key={key} onClick={() => setSelectedId(onlinePeople[key]?.id)} className={"border-b border-gray-100 flex items-center gap-2 cursor-pointer " + (onlinePeople[key]?.id === selectedId ? 'bg-green-100' : '')} >
                                {(onlinePeople[key]?.id  === selectedId) && (
                                    <div className="w-1 bg-blue-500 h-12 rounded-r-md"></div>
                                )}
                                <div className="flex gap-2 py-3 pl-2">
                                    <div className={"w-10 h-10 rounded-full flex items-center " + randomColor(key)} >
                                        <div className="primary text-center w-full mb-1 opacity-70">{onlinePeople[key].username[0]}</div>
                                    </div>
                                    <div className="primary">{onlinePeople[key].username}</div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            <div className="flex flex-col bg-blue-100 w-3/4 p-2">
                <div className="flex-grow">
                    {!selectedId && (
                        <div className="flex h-full flex-grow items-center justify-center">
                            <div className="primary text-gray-400">&larr; Select a person from left sidebar</div>
                        </div>
                    )}
                    {!!selectedId && (
                        <div>
                            {messages.map((message) =>{
                                return(
                                    <div>{message.text}</div>
                                )
                            })}
                        </div>
                    )}
                </div>
                {!!selectedId &&
                    <form className="flex gap-2" onSubmit={sendMsg}>
                        <input type="text" placeholder="Type your message here" className="bg-white flex-grow border p-2" value={newMsg} onChange={(e) => setNewMsg(e.target.value)} />
                        <button className="bg-blue-500 p-2 text-white" type="submit">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                            </svg>

                        </button>
                    </form>}
            </div>
        </div>
    )
}