import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import Header from "../Header";
import Search from "../Search";
import Contacts from "../Contacts";
import ChatBox from "../components/ChatBox";
import { useBreakpointValue } from "@chakra-ui/react";

export default function NewChatPage() {
    const socket = useRef();
    const { user, setUser, ready, selectedChat } = useContext(UserContext);
    const navigate = useNavigate();
    const [onlinePeople, setOnlinePeople] = useState();
    const [fetchAgain, setFetchAgain] = useState(false);
    const shouldHideBox = useBreakpointValue({ base: true, md: false });

    useEffect(() => {
        if (!ready && !user) {
            navigate('/');
        }
        else {
            const cookies = document.cookie.split(';').reduce((acc, c) => {
                const [key, value] = c.trim().split('=');
                acc[key] = value;
                return acc;
            });
            // socket.current = io(url, {
            //     query: { cookies },
            // });
            // socket.current.on('onlineUsers', (users) => {
            //     // console.log(users)
            //     setOnlinePeople(users);
            // })
            // socket.current.on('msg-recieve', (msg)=>{
            //     console.log("message is listned");
            // })

        }
    }, [user, ready]);



    return (
        <>
            <div className="flex h-screen">
                {shouldHideBox && (
                    <>
                        {!selectedChat && (
                            <div className={`bg-white w-full `} >
                                <Header />
                                <Search />
                                <div className=" mt-2 px-2">
                                    <Contacts fetchAgain={fetchAgain} />
                                </div>
                            </div>
                        )}
                        {selectedChat && (
                            <div className="flex flex-col bg-blue-100 w-full">
                                <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
                            </div>
                        )}
                    </>
                )}
                {!shouldHideBox && (
                    <>
                        <div className={`bg-white w-1/4 `} >
                            <Header />
                            <Search />
                            <div className=" mt-2 px-2">
                                <Contacts fetchAgain={fetchAgain} />
                            </div>
                        </div>
                        <div className="flex flex-col bg-blue-100 w-3/4">
                            <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
                        </div>
                    </>
                )}
            </div>
        </>
    )
}