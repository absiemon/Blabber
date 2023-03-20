import { ArrowBackIcon, SettingsIcon } from "@chakra-ui/icons";
import { Box, IconButton, Spinner, useToast } from "@chakra-ui/react";
import axios from "axios";
import { useState, useContext, useEffect, useRef } from "react"
import { getSender } from "../config/ChatLogic";
import { UserContext } from "../UserContext"
import ScrollableChat from "./ScrollableChat";
import UpdateGroupChatModal from "./UpdateGroupChatModal";
import io from "socket.io-client";
import Lottie from 'react-lottie';
import animationData from "../typing.json"
const url = "http://localhost:8000";
let socket, selectedChatCompare;

export default function ChatBox({ fetchAgain, setFetchAgain }) {

    const { user, selectedChat, setSelectedChat, notification, setNotification } = useContext(UserContext);
    const toast = useToast();
    const [newMsg, setNewMsg] = useState('');
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [socketConnected, setSocketConnected] = useState(false);
    const [isTyping, setIsTyping] = useState(false);

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice"
        }
    }
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

    }, [selectedChat])

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

        if (!isTyping) {
            setIsTyping(true);
            socket.emit('typing', { selectedChat, user });
        }
        let lastTypingTime = new Date().getTime();
        const timer = 3000;
        setTimeout(() => {
            let currentTime = new Date().getTime();
            let timeDiff = currentTime - lastTypingTime;

            if (timeDiff >= timer && isTyping) {
                socket.emit('stop-typing', { selectedChat, user });
                setIsTyping(false);
            }
        }, timer)
    }

    const sendMsg = async (ev) => {
        ev.preventDefault();
        if (!newMsg) {
            return;
        }
        socket.emit('stop typing', { selectedChat, user });
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
                        <div class="text-2xl font-semibold">
                            {!selectedChat.isGroupChat ? getSender(user, selectedChat.users) : selectedChat.chatName}
                        </div>
                        {!selectedChat.isGroupChat ?
                            <button className="h-10 w-10 bg-blue-200 rounded-md ">
                                <SettingsIcon h="6" w="6" />
                            </button>
                            :
                            <UpdateGroupChatModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
                        }
                    </Box>
                    <div className={`overflow-scroll ${loading && 'flex items-center justify-center'}`} style={{ height: 'fit-content' }} >
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
                        <button className="bg-blue-500 p-2 text-white" type="submit">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.7759.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                            </svg>
                        </button>
                    </form>
                </>
            }
        </>
    )
}