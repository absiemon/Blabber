import { ArrowBackIcon } from "@chakra-ui/icons";
import { Box, IconButton, Spinner, useToast } from "@chakra-ui/react";
import axios from "axios";
import { useState, useContext, useEffect, useRef } from "react"
import { getSender } from "../config/ChatLogic";
import { UserContext } from "../UserContext"
import ScrollableChat from "./ScrollableChat";
import UpdateGroupChatModal from "./UpdateGroupChatModal";
import io from "socket.io-client";
import Lottie from 'react-lottie';
import send from "../assets/send.png";
import animationData from "../typing.json"
import ChatSettings from "./ChatSettings";
// const url = "http://localhost:8000";
const url = "https://blabber-alpha.vercel.app/api";
let socket, selectedChatCompare;

export default function ChatBox({ fetchAgain, setFetchAgain }) {

    const { user, selectedChat, setSelectedChat, notification, setNotification, fetchMsg } = useContext(UserContext);
    const toast = useToast();
    const [newMsg, setNewMsg] = useState('');
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [socketConnected, setSocketConnected] = useState(false);
    const[typing, setTyping] = useState(false);
    const [isTyping, setIsTyping] = useState(false);

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
          preserveAspectRatio: "xMidYMid slice",
        },
    };
    useEffect(() => {
        socket = io(url);
        socket.emit("setup", user);
        socket.on('connected', () => {
            setSocketConnected(true);
        })
        socket.on('typing', () => setIsTyping(true));
        socket.on('stop-typing', () => setIsTyping(false))
    }, [])

    useEffect(() => {
        if (!selectedChat) return;
        else {
            setLoading(true)
            axios.get(`/all-msg/${selectedChat._id}`)
                .then(({ data }) => {
                    setMessages(data);
                    setLoading(false);
                }).catch((err) => {
                    setLoading(false);
                    toast({ title: "Cannot fetch messages", status: "error", duration: 3000, isClosable: true, position: "top-right", });
                })

            socket.emit('join-chat', selectedChat._id);
            selectedChatCompare = selectedChat;
        }

    }, [selectedChat, fetchMsg])

    useEffect(() => {
        socket.on('msg-recieved', (newMsg) => {
            if (!selectedChatCompare || selectedChatCompare._id !== newMsg.chat._id) {
                // means user is not inside that chat, give notification
                if(!notification.includes(newMsg)){
                    setNotification([newMsg, ...notification]);
                    setFetchAgain(!fetchAgain)
                }
            }
            else {
                setMessages([...messages, newMsg])
            }
        })
    })

    const typingHandler = (e) => {
        setNewMsg(e.target.value)

        if (!socketConnected) { return };

        if (!typing) {
            setTyping(true);
            socket.emit('typing', { selectedChat, user });
        }
        let lastTypingTime = new Date().getTime();
        const timer = 3000;
        setTimeout(() => {
            let currentTime = new Date().getTime();
            let timeDiff = currentTime - lastTypingTime;

            if (timeDiff >= timer && typing) {
                socket.emit('stop-typing', { selectedChat, user });
                setTyping(false);
            }
        }, timer)
    }

    const sendMsg = async (ev) => {
        ev.preventDefault();
        if (!newMsg) {
            return;
        }
        socket.emit('stop-typing', { selectedChat, user });
        await axios.post('/new-msg', {
            content: newMsg,
            chatId: selectedChat._id
        }).then(({ data }) => {
            setNewMsg("");
            socket.emit('new-msg', data);
            setMessages([...messages, data]);
        }).catch((err) => {
            toast({ title: "Cannot send message", status: "error", duration: 3000, isClosable: true, position: "top-right", });
        })
    }

    return (
        <>
            <div className="flex-grow">
                {!selectedChat && (
                    <div className="flex h-full flex-grow items-center justify-center">
                        <div className="primary text-gray-400">&larr; Select a person from left sidebar</div>
                    </div>
                )}
            </div>
            {!!selectedChat &&
                <>
                    <Box h="16" bg="white" p="2" style={{ borderLeft: '2px solid #D0D0D0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'absolute', width: 'inherit' }}>
                        <IconButton
                            d={{ base: "flex", md: "none" }}
                            icon={<ArrowBackIcon />}
                            onClick={() => setSelectedChat("")}
                        />
                        <div className="text-2xl font-semibold">
                            {!selectedChat.isGroupChat ? getSender(user, selectedChat.users) : selectedChat.chatName}
                        </div>
                        {!selectedChat.isGroupChat ?
                            <ChatSettings fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
                            :
                            <UpdateGroupChatModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
                        }
                    </Box>
                    <div className={`overflow-scroll flex flex-col ${loading && 'items-center justify-center'}`} style={{ height: '100%', width: '100%', justifyContent:'flex-end' }} >
                        {loading ?
                            <Spinner size="xl" w="20" h="20" />
                            :
                            <div className="flex flex-col overflow-y-scroll p-3">
                                <ScrollableChat messages={messages} />
                            </div>
                        }
                        {isTyping && (
                            <div className="">
                                <Lottie options={defaultOptions} width={70} style={{ marginBottom: 15, marginLeft: 0 }} />
                            </div>
                        )}
                    </div>
                    <form className="flex gap-2 p-2" onSubmit={sendMsg}>

                        <input type="text" placeholder="Type your message here" className="bg-white flex-grow border p-2" value={newMsg} onChange={typingHandler} />
                        <button className="bg-blue-300 text-white rounded-sm" type="submit">
                            <img src={send} alt="i" className="h-10 w-10 "/>
                        </button>
                    </form>
                </>
            }
        </>
    )
}