import { ViewIcon } from "@chakra-ui/icons";
import { Box, Button, FormControl, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure } from "@chakra-ui/react";
import { useContext, useState } from "react";
import { useToast } from '@chakra-ui/react'
import { UserContext } from "../UserContext";
import UserBadgeItem from "./UserBadgeItem";
import axios from "axios";
import UserListItem from "../UserListItem";

export default function UpdateGroupChatModal({ fetchAgain, setFetchAgain }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, selectedChat, setSelectedChat } = useContext(UserContext);
  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameloading, setRenameLoading] = useState(false);
  const toast = useToast();


  const addToGroup = async(user1)=>{ 
    if(selectedChat.users.find(u=>{ u._id === user1._id})){
      toast({ title: "User already a member", status: "error", duration: 3000, isClosable: true, position: "top-right", });
      return;
    }
    //only admin can add into the group
    if(selectedChat.groupAdmin._id !== user._id){
      toast({ title: "Only admin can add the user", status: "error", duration: 3000, isClosable: true, position: "top-right", });
      return;
    }
    setLoading(true);
    await axios.put('/group-add', {
      chatId: selectedChat._id,
      userId: user1._id
    }).then(({data})=>{
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
      toast({ title: "User added successfully", status: "success", duration: 3000, isClosable: true, position: "top-right", });
    }).catch(err=>{
      setLoading(false);
      toast({ title: "User can't be added right now", status: "success", duration: 3000, isClosable: true, position: "top-right", });
      return;
    })
  } 

  const handleRemove = async(user1) => {
    if(selectedChat.groupAdmin._id !== user._id){
      toast({ title: "Only admin can remove the user", status: "error", duration: 3000, isClosable: true, position: "top-right", });
      return;
    }
    setLoading(true);
    await axios.put('/group-remove', {
      chatId: selectedChat._id,
      userId: user1._id
    }).then(({data})=>{
      
      user1._id === user._id ? setSelectedChat(): setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
      toast({ title: "User removed successfully", status: "success", duration: 3000, isClosable: true, position: "top-right", });
    }).catch(err=>{
      setLoading(false);
      toast({ title: "User can't be removed right now", status: "success", duration: 3000, isClosable: true, position: "top-right", });
      return;
    })
  }

  const handleRename = async () => {
    if (!groupChatName) {
      toast({ title: "plese fill the input", status: "error", duration: 3000, isClosable: true, position: "top-right", });
      return;
    }
    setRenameLoading(true);
    await axios.put('/rename-group', {
      chatId: selectedChat._id,
      chatName: groupChatName
    }).then(({ data }) => {
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
      toast({ title: "Update successfully", status: "success", duration: 3000, isClosable: true, position: "top-right", });
      setGroupChatName("")
    }).catch(err => {
      setRenameLoading(false);
      toast({
        title: "Cannot update! please try again",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      return;
    })

  }

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


  return (
    <>
      <IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="35px" display="flex" justifyContent="center">{selectedChat.chatName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody d="flex" flexDir="column" alignItems="center">
            <Box w="100%" d="flex" flexWrap="wrap" pb={3}>
              {selectedChat.users.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  //   admin={selectedChat.groupAdmin}
                  handleFunction={() => handleRemove(u)}
                />
              ))}
            </Box>
            <FormControl display="flex">
              <Input placeholder="Chat Name" mb={3} value={groupChatName} onChange={(e) => setGroupChatName(e.target.value)} />
              <Button
                variant="solid"
                colorScheme="teal"
                ml={1}
                isLoading={renameloading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add User to group"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            {loading ? (
              <Spinner size={'lg'} margin="10px 10px" />
              // <div>Loading...</div>
            ) : (
              searchResult
                ?.slice(0, 4)
                .map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => addToGroup(user)}
                  />
                ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button onClick={() => handleRemove(user)} colorScheme="red">
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}