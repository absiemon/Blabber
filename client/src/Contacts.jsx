import { useState, useContext, useEffect } from "react";
import { UserContext } from "./UserContext";
import { useToast } from '@chakra-ui/react'
import axios from "axios";
import { Box, Text, Button, Stack } from "@chakra-ui/react";
import SearchLoading from "./SearchLoading";
import { AddIcon } from "@chakra-ui/icons";
import { getSender } from './config/ChatLogic.js'
import usersIcon from './assets/usersIcon.png';
import GroupChatModal from "./components/GroupChatModal";

export default function Contacts({fetchAgain}) {
    const { user, selectedChat, setSelectedChat, chats, setChats } = useContext(UserContext);

    const toast = useToast();
    useEffect(() => {
        axios.get('/all-chats').then(({ data }) => {
            console.log(data);
            setChats(data);
        }).catch(err => {
            toast({
                position: 'top-right',
                title: 'Server error',
                description: "Cannot fetch chats please try again",
                status: 'error',
                duration: 3000,
                isClosable: true,
            })
            return;
        })
    }, [fetchAgain])

    function randomColor(id) {
        const colors = ['bg-red-200', 'bg-green-200', 'bg-blue-200', 'bg-orange-200', 'bg-lime-200', 'bg-emerald-200'];
        const userIdbase10 = parseInt(id, 16);
        const colorIndex = userIdbase10 % colors.length;
        return colors[colorIndex];
    }

    return (
        <>
            <Box d={{ base: selectedChat ? "none" : "flex", md: "flex" }} flexDir="column" alignItems="center" bg="white" w="100%">

                <GroupChatModal>
                    <Button d="flex" w="100%" fontSize={{ base: "17px", md: "10px", lg: "17px" }} rightIcon={<AddIcon />}>
                        New Group Chat
                    </Button>
                </GroupChatModal>
                <Box d="flex" flexDir="column" p={3}  w="100%" h="100%" borderRadius="lg" overflowY="hidden">
                    {chats ? (
                        <Stack overflowY="scroll">
                            {chats?.map((chat) => (
                                <div key={chat?._id} onClick={() => setSelectedChat(chat)} className={"border-b border-gray-100 flex items-center gap-2 cursor-pointer rounded-md " + (chat._id === selectedChat?._id ? 'bg-blue-100' : '')} >
                                    {(chat._id === selectedChat?._id) && (
                                        <div className="w-1 bg-blue-500 h-12 rounded-r-md"></div>
                                    )}
                                    <div className="flex gap-2 py-3 pl-2 items-center">
                                        <div className={"w-10 h-10 rounded-full flex items-center " + randomColor(chat._id)} >
                                            <div className="primary text-center w-full mb-1 opacity-70">
                                            {!chat.isGroupChat
                                            ? getSender(user, chat.users)[0]
                                            : <img src={usersIcon} alt="icon" className="h-7 w-7" style={{margin:'4px 0px 0px 6px'}}/>}
                                            </div>
                                        </div>
                                        <div className="primary">
                                            {!chat.isGroupChat
                                            ? getSender(user, chat.users)
                                            : chat.chatName}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </Stack>
                    ) : (
                        <SearchLoading />
                    )}
                </Box>
            </Box>
        </>
    )
}