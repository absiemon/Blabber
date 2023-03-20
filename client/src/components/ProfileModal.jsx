import {Modal , ModalOverlay, ModalCloseButton, ModalContent, ModalHeader, ModalBody, ModalFooter,
} from '@chakra-ui/react'

export default function ProfileModal({user, isOpen, onClose}) {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent d="flex" flexDir="column" alignItems="center" justifyContent="center">
                <ModalHeader d="flex" justifyContent="center" fontSize="3xl">{user?.username}</ModalHeader>
                <ModalCloseButton />
                <ModalBody d="flex" flexDir="column" alignItems="center" justifyContent="center">
                    <div className="flex gap-2 py-3 pl-2">
                        <div className={"w-36 h-36 rounded-full flex items-center bg-blue-200"} >
                            <div className="text-center w-full mb-1 opacity-70 text-7xl">{user?.username[0].toUpperCase()}</div>
                        </div>
                    </div>
                </ModalBody>

                <ModalFooter>
                    <div className="text-lg font-semibold">{user?.email}</div>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}