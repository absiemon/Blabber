import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast } from "@chakra-ui/react"
import axios from "axios";
import { useContext, useState } from "react"
import { UserContext } from "../UserContext"

export default function ConfirmationModal({ option, isOpen, onClose, fetchAgain, setFetchAgain }) {
    const { selectedChat, fetchMsg, setFetchMsg, setSelectedChat } = useContext(UserContext);
    const toast = useToast();
    const [loading, setLoading] = useState(false);

    const handleFunction = async()=>{
        setLoading(true);
        if(option == 'clear'){
            await axios.post('/delete-all-msg', {chatId: selectedChat._id}).then(({data})=>{
                setLoading(false)
                toast({ position: 'top-right', title: 'Cleared', description: "All messages has been deleted", status: 'success', duration: 3000, isClosable: true,
                });
                setFetchMsg(!fetchMsg);
            }).catch(err=>{
                setLoading(false)
                toast({ position: 'top-right', title: 'Server error', description: "Cannot be delted! try again", status: 'error', duration: 3000, isClosable: true,
                });
                return
            })
        }
        else if(option == 'delete'){
            await axios.post('/delete-chat', {chatId: selectedChat._id}).then(({data})=>{
                setLoading(false)
                toast({ position: 'top-right', title: 'Cleared', description: "Chat has been deleted", status: 'success', duration: 3000, isClosable: true,
                });
                setSelectedChat("");
                setFetchAgain(!fetchAgain);
            }).catch(err=>{
                setLoading(false)
                toast({ position: 'top-right', title: 'Server error', description: "Cannot be delted! try again", status: 'error', duration: 3000, isClosable: true,
                });
                return
            })
        }
        onClose();
    }
    return (
      <>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Confirmation</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                {option === 'clear' && (<div className="text-red-500 font-semibold"> All messages of this chat will be deleted</div>)}
                {option === 'delete' && (<div className="text-red-500 font-semibold"> Deleting the chat will also delete all the conversations</div>)}
                {option === 'block' && (<div className="text-red-500 font-semibold"> You won't be able to send messages to this chat</div>)}
            </ModalBody>
  
            <ModalFooter>
              <Button colorScheme='blue' mr={3} onClick={handleFunction} isLoading={loading}>
                Confirm
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    )
  }