import { HamburgerIcon } from "@chakra-ui/icons";
import { Avatar, IconButton, Menu, MenuButton, MenuDivider, MenuItem, MenuList, useDisclosure } from "@chakra-ui/react";
import { useState } from "react";
import ConfirmationModal from "./ConfirmationModal";

export default function ChatSettings({fetchAgain, setFetchAgain}) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [option, setOption] = useState('');

    const handleModal= (op)=>{
        setOption(op);
        onOpen();
    }

    return (
        <>
        <ConfirmationModal isOpen={isOpen} onClose={onClose} option={option} fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
            <Menu>
                <MenuButton as={IconButton}
                    aria-label='Options'
                    icon={<HamburgerIcon />}
                    variant='outline'>
                    <Avatar size='sm' cursor={'pointer'} name={'Abhay'} />
                </MenuButton>
                <MenuList >
                    <MenuItem onClick={()=> handleModal('clear')}>Clear messages</MenuItem>
                    <MenuItem onClick={()=> handleModal('delete')}>Delete chat</MenuItem>
                    <MenuItem onClick={()=> handleModal('block')}>Block</MenuItem>
                </MenuList>
            </Menu>
        </>
    )
}