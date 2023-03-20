import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import axios from "axios";
import { UserContext } from "./UserContext";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    Menu, MenuButton, MenuList, MenuItem, MenuDivider, Avatar, IconButton, Modal, useDisclosure
    , ModalOverlay, ModalCloseButton, ModalContent, ModalHeader, ModalBody, ModalFooter,
} from '@chakra-ui/react'
import { HamburgerIcon, BellIcon } from '@chakra-ui/icons'
import ProfileModal from "./components/ProfileModal";
import { getSender } from "./config/ChatLogic";
import NotificationBadge from 'react-notification-badge';
import {Effect} from 'react-notification-badge';


export default function Header() {
    const { setReady, setUser, user, notification,setNotification, selectedChat, setSelectedChat  } = useContext(UserContext);
    const { isOpen, onOpen, onClose } = useDisclosure()
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const logout = async () => {
        await axios.post('/logout').then((res) => {
            setUser(null);
            setReady(false);
            navigate('/');
        }).catch((err) => {
            toast.error("cannot logout please try again later");
            return;
        })
    }

    return (
        <>
            <ProfileModal user={user} isOpen={isOpen} onClose={onClose}/>
            
            <header className='py-3 px-3 flex border-b-2 bg-white w-full justify-between '>
                <Link to={'/'} href="" className='flex items-center gap-1 justify-center'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-blue-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                    </svg>

                    <span className="font-semibold text-xl text-blue-400">Blabber</span>
                </Link>
                <div className="flex gap-2 justify-end items-end">
                    <Menu>
                        <MenuButton p={1}>
                            <NotificationBadge
                                count={notification.length}
                                effect={Effect.SCALE}
                            />
                            <BellIcon fontSize={'2xl'} m={1} />
                        </MenuButton>
                        <MenuList pl={2}>
                            {!notification.length && "No new messages"}
                            {notification.map(notif =>(
                                <MenuItem key={notif._id} onClick={()=>{
                                    setSelectedChat(notif.chat);
                                    setNotification(notification.filter((n)=> n != notif))
                                }}>
                                    {notif.chat.isGroupChat ? `New message from ${notif.chat.chatName}`: `New message from ${getSender(user, notif.chat.users)}`}
                                </MenuItem>
                            ))}
                        </MenuList>
                    </Menu>
                    <Menu>
                        <MenuButton as={IconButton}
                            aria-label='Options'
                            icon={<HamburgerIcon />}
                            variant='outline'>
                            <Avatar size='sm' cursor={'pointer'} name={'Abhay'} />
                        </MenuButton>
                        <MenuList >
                            <MenuItem onClick={onOpen}>Profile</MenuItem>
                            <MenuDivider />
                            <MenuItem onClick={logout}>Logout</MenuItem>
                        </MenuList>
                    </Menu>
                </div>

            </header>
        </>
    )
}