import { Box, Tooltip, Text, Button, Drawer,DrawerOverlay, DrawerCloseButton,  DrawerContent, DrawerHeader,DrawerBody,  Input, useDisclosure, Flex } from "@chakra-ui/react";
import { useState, useContext } from "react";
import { useToast } from '@chakra-ui/react'
import axios from "axios";
import SearchLoading from "./SearchLoading";
import UserListItem from "./UserListItem";
import { UserContext } from "./UserContext";

export default function Search() {
    const {setSelectedChat, chats, setChats}  = useContext(UserContext);
    const { isOpen, onOpen, onClose } = useDisclosure()
    const toast = useToast()
    const [search, setSearch] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);

    const searchUser = async()=>{
        if(!search){
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
        else{
            setLoading(true)
            await axios.get( `/users?search=${search}`).then((res) =>{
                setSearchResult(res?.data)
                setLoading(false)
            }).catch((err)=>{
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

    const createChat = async(id)=>{
        
        await axios.post('/chat', {
            userId: id
        }).then((res)=>{
            toast({
                position: 'top-right',
                title: 'User added',
                description: "User has been added to your chat list",
                status: 'success',
                duration: 3000,
                isClosable: true,
            })
            // if chat already exists in chats arr
            if(!chats.find((c)=> c?._id === res?.data?._id)){
                setChats([res.data, ...chats])
            }
            setSelectedChat(res.data);
            onClose()
        }).catch(err=>{
            toast({
                position: 'top-right',
                title: 'Server error',
                description: "Cannot create chat please try again",
                status: 'error',
                duration: 3000,
                isClosable: true,
            })
            onClose();
            return;
        })
    }
    return (
        <>
            <Drawer isOpen={isOpen} placement='left' onClose={onClose}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>Search the user</DrawerHeader>

                    <DrawerBody>
                        <Box pb={2} style={{display:'flex'}}>
                            <Input placeholder='type username or email' mr="2" value={search} onChange={(e) => setSearch(e.target.value)}/>
                            <Button onClick={searchUser}> Search</Button>
                        </Box>
                        {loading ? <SearchLoading/> : (
                            searchResult?.map(user=>{
                                return(
                                    <UserListItem key={user?._id} user={user} handleFunction={()=> createChat(user?._id)}/>
                                )
                            })
                        )}
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
            <div className="px-2 my-1 py-1">
                <Box d="flex" justifyContent="space-between" alignItems="center" bg="#E0E0E0" w="100%"
                    p="5px 10px 5px 10px" borderWidth="1px" borderRadius={'4px'}>
                    <Tooltip label="Search user">
                        <Button variant="ghost" d="flex" gap={"10px"} w="100%" onClick={onOpen}>
                            <i className="fas fa-search"></i>
                            <Text d={{ base: "none", md: "flex" }}>
                                Search user
                            </Text>
                        </Button>
                    </Tooltip>
                </Box>
            </div>
        </>
    )
}