import {
    Box, Modal, useDisclosure, ModalOverlay, ModalCloseButton, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, FormControl, Input, Spinner,
} from '@chakra-ui/react'
import axios from 'axios';
import { useContext, useState } from 'react';
import { useToast } from '@chakra-ui/react'
import { UserContext } from '../UserContext';
import SearchLoading from '../SearchLoading';
import UserListItem from '../UserListItem';
import UserBadgeItem from './UserBadgeItem';

export default function GroupChatModal({ children }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { chats, user, setChats } = useContext(UserContext);
    const [groupChatName, setGroupChatName] = useState();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);

    const toast = useToast();

    const handleSearch = async (query) => {
        setSearch(query);
        if (!query) {
            toast({
                position: 'top-right',
                title: 'Input Error.',
                description: "Input field cannot be empty",
                status: 'error',
                duration: 3000,
                isClosable: true,
            })
            return;
        }
        else {
            setLoading(true)
            await axios.get(`/users?search=${query}`).then((res) => {
                setSearchResult(res?.data)
                setLoading(false)
            }).catch((err) => {
                toast({
                    position: 'top-right',
                    title: 'Error occured',
                    description: "Cannot search user please try again later",
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                })
                setLoading(false)
                return;
            })
        }
    }

    const handleGroup = (userToAdd) => {
        if (selectedUsers.includes(userToAdd)) {
            toast({
                title: "User already added",
                status: "warning",
                duration: 3000,
                isClosable: true,
                position: "top-right",
            });
            return;
        }
        setSelectedUsers([...selectedUsers, userToAdd]);
    }
    const handleDelete = (delUser) => {
        setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
    };

    const handleSubmit = async()=>{
        if (!groupChatName || !selectedUsers) {
            toast({
              title: "Input fields cannot be empty",
              status: "error",
              duration: 3000,
              isClosable: true,
              position: "top-right",
            });
            return;
        }
        const allUsersId = selectedUsers.map((u) =>{ return u._id})
        await axios.post('/create-group', {
            name: groupChatName,
            users: allUsersId
        }).then(({data}) =>{
            setChats([data , ...chats]);
            onClose();
            toast({
                title: "New Group Chat Created!",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "top-right",
            });
        }).catch(err=>{
            toast({
                position: 'top-right',
                title: 'Error occured',
                description: "Cannot create group please try again",
                status: 'error',
                duration: 3000,
                isClosable: true,
            })
            return
        })
    }

    return (
        <>
            <span onClick={onOpen}>{children}</span>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader fontSize="35px" d="flex" justifyContent="center">Create group chat</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody d="flex" flexDir="column" alignItems="center">
                        <FormControl>
                            <Input
                                placeholder="Chat Name"
                                mb={3}
                                onChange={(e) => setGroupChatName(e.target.value)}
                            />
                        </FormControl>
                        <FormControl>
                            <Input
                                placeholder="Add Users eg: John Doe"
                                mb={1}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </FormControl>
                        <Box w="100%" d="flex" flexWrap="wrap">
                            {selectedUsers.map((u) => (
                                <UserBadgeItem
                                    key={u._id}
                                    user={u}
                                    handleFunction={() => handleDelete(u)}
                                />
                            ))}
                        </Box>
                        {loading ? (
                            <Spinner size={'lg'} margin="10px 10px"/>
                            // <div>Loading...</div>
                        ) : (
                            searchResult
                                ?.slice(0, 4)
                                .map((user) => (
                                    <UserListItem
                                        key={user._id}
                                        user={user}
                                        handleFunction={() => handleGroup(user)}
                                    />
                                ))
                        )}
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={handleSubmit}>
                            Create
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}