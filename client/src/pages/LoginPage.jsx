import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../UserContext";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button, useToast } from '@chakra-ui/react'

export default function LoginPage() {

    const navigate = useNavigate();
    const toast = useToast()
    const [loading, setLoading] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const { user, setUser, setIsLogin } = useContext(UserContext)
    const [credentials, setCredentials] = useState({
        username: "", password: ""
    })

    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    }

    const LoginUser = async (e) => {
        e.preventDefault();
        const { username, password } = credentials;
        if (!username || !password) {
            toast({
                position: 'top-right',
                title: 'Input Error.',
                description: "All inputs are mandatory",
                status: 'error',
                duration: 3000,
                isClosable: true,
              })
            return;
        }
        setLoading(true);
        await axios.post('/login', {
            username, password
        }).then((res) => {
            localStorage.setItem("userInfo", JSON.stringify(res.data));
            setUser(res.data);
            setLoading(false)
            navigate('/chats')
        }).catch((err) => {
            setLoading(false)
            toast({
                position: 'top-right',
                title: 'Invalid Credentials.',
                description: "Please give valid credentials",
                status: 'error',
                duration: 3000,
                isClosable: true,
              })
            return;
        });
    }

    return (
        <>
            <div className="bg-blue-50 grow flex flex-col items-center justify-around h- auto">
                <div className="">
                    <div className="mb-8 mx-32">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-blue-400">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                        </svg>
                    </div>
                    <h1 className="text-4xl text-center mb-4 ">Login</h1>
                    <div className="w-80 mx-auto mb-12 " >
                        <input name="username" value={credentials.username}
                            onChange={onChange}
                            type="text" placeholder="username"
                            className="block w-full rounded-md p-2 mb-2 border" />
                        <div className="flex">
                            <input name="password" value={credentials.password}
                                onChange={onChange}
                                type={!isVisible ? "password" : "text" }
                                placeholder="Password"
                                className="block w-full rounded-md p-2 mb-2 border" />
                            <button className=" absolute flex mx-72 mt-3" onClick={(e)=>{setIsVisible(!isVisible)}}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </button>

                        </div>

                        {/* <button className={`${!loading ? 'bg-blue-500' : 'bg-gray-600'} text-white block w-full font-semibold rounded-md p-2 ${!loading && 'hover:bg-sky-700'}`} onClick={LoginUser} disabled={loading}>
                            {!loading ? 'Login' : 'Loginin...'}
                        </button> */}
                        <Button variant="solid" colorScheme="#2196F3" bg={'#2196F3'} ml={1} isLoading={loading} onClick={LoginUser} w="full">
                            Login
                        </Button>
                        <div className="text-center py-2 text-gray-500 ">
                            New registration?
                            <button onClick={() => setIsLogin(false)} className="underline text-black font-semibold mx-1">Register</button>
                        </div>
                    </div>
                </div>
            </div>
        </>

    );
}

