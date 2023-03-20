import { createContext, useEffect, useState } from "react";
import axios from 'axios';
export const UserContext  = createContext({});

export function UserContextProvider({children}){

    const [user, setUser] = useState(null);
    const [ready, setReady] = useState(false);
    const [isLogin, setIsLogin] = useState(true);
    const [selectedChat, setSelectedChat] = useState();
    const [chats, setChats] = useState([]);
    const [notification, setNotification] = useState([])

    useEffect(() => {
        if(!user){
            axios.get('/profile').then((res)=>{
                setUser(res.data);
                setReady(true);
            }).catch((err)=>{
                console.log(err);
            });
        }
    }, [user]);

    return(
        <UserContext.Provider value={{user, setUser, ready, isLogin, setIsLogin, selectedChat, setSelectedChat, chats, setChats,notification, setNotification }}>
            {children}
        </UserContext.Provider>
    )
}