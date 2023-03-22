import { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import { UserContext } from "../UserContext";


export default function AuthPage() {

    const navigate = useNavigate();
    const { isLogin, ready, user } = useContext(UserContext);
    // useEffect(()=> {
    //     if(user && ready){
    //         navigate('/chats')
    //     }
    // })

    return (
        <div className='px-4 bg-blue-50 flex flex-col min-h-screen'>
            {isLogin ? 
                <LoginPage />
                :
                <RegisterPage />
            }
        </div>
    )
}