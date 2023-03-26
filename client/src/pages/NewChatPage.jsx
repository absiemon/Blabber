import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import Header from "../Header";
import Search from "../Search";
import Contacts from "../Contacts";
import ChatBox from "../components/ChatBox";
import { useBreakpointValue } from "@chakra-ui/react";

export default function NewChatPage() {
    const { user, setUser, ready, selectedChat } = useContext(UserContext);
    const navigate = useNavigate();
    const [onlinePeople, setOnlinePeople] = useState();
    const [fetchAgain, setFetchAgain] = useState(false);
    const shouldHideBox = useBreakpointValue({ base: true, md: false });

    useEffect(() => {
        if (!ready && !user) {
            navigate('/');
        }
        else {
            // socket = io(url);
        }
    }, [user, ready]);


    return (
        <>
            <div className="flex h-screen">
                {shouldHideBox && (
                    <>
                        {!selectedChat && (
                            <div className={`bg-white w-full `} >
                                <Header />
                                <Search />
                                <div className=" mt-2 px-2">
                                    <Contacts fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
                                </div>
                            </div>
                        )}
                        {selectedChat && (
                            <div className="flex flex-col bg-blue-100 w-full">
                                <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
                            </div>
                        )}
                    </>
                )}
                {!shouldHideBox && (
                    <>
                        <div className={`bg-white w-1/4 `} >
                            <Header />
                            <Search />
                            <div className=" mt-2 px-2">
                                <Contacts fetchAgain={fetchAgain} />
                            </div>
                        </div>
                        <div className="flex flex-col bg-blue-100 w-3/4">
                            <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
                        </div>
                    </>
                )}
            </div>
        </>
    )
}