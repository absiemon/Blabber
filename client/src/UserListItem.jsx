import { Box, Text } from "@chakra-ui/react";

export default function UserListItem({ user, handleFunction }) {

    return (
        <>
            <Box
                onClick={handleFunction} cursor="pointer" bg="#E8E8E8" _hover={{ background: "#38B2AC", color: "white", }} w="100%"  alignItems="center" color="black" px={3} py={2} mb={2} borderRadius="lg" style={{display: 'flex', gap:'10px'}}
            >
                <div className={"w-12 h-12 rounded-full flex items-center bg-blue-300"} >
                    <div className="primary text-center w-full mb-1 opacity-70">{user?.username[0]}</div>
                </div>
                <Box>
                    <div className="primary">{user?.username}</div>
                    <Text fontSize="xs">
                        <b>Email : </b>
                        {user?.email}
                    </Text>
                </Box>
            </Box>
        </>
    )
}