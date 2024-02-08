import { createContext, useEffect, useState } from "react";
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import { io } from "socket.io-client";
const url = "http://localhost:8000";
//  const url = "https://blabber-docl.onrender.com/";
export const UserContext  = createContext({});

export function UserContextProvider({children}){

    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isLogin, setIsLogin] = useState(true);
    const [selectedChat, setSelectedChat] = useState();
    const [chats, setChats] = useState([]);
    const [notification, setNotification] = useState([])
    const [socket, setSocket] = useState(null);
    const [fetchMsg, setFetchMsg] = useState(false);

    useEffect(() => {

        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        setUser(userInfo);
        if(!userInfo){
            navigate('/');
        }
        else{
            const newSocket = io(url);
            setSocket(newSocket);
            navigate('/chats')
        }
        // if(!user){
        //     axios.get('/profile').then((res)=>{
        //         setUser(res.data);
        //         setReady(true);
        //     }).catch((err)=>{
        //         console.log(err);
        //     });
        // }
    }, []);

    return(
        <UserContext.Provider value={{user, setUser, isLogin, setIsLogin, selectedChat, setSelectedChat, chats, setChats,notification, setNotification, fetchMsg, setFetchMsg,socket }}>
            {children}
        </UserContext.Provider>
    )
}
