import { Routes, Route } from "react-router-dom"
import axios from "axios";
import { UserContextProvider } from './UserContext';
import AuthPage from "./pages/AuthPage";
import NewChatPage from "./pages/NewChatPage";

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
axios.defaults.withCredentials = true;

function App() {

  return (
    <UserContextProvider>
      <Routes>
          <Route path="/" exact element={<AuthPage />} ></Route>
          <Route path="/chats" element={<NewChatPage />}></Route>
          {/* <Route path='/login' element={<LoginPage />}></Route>
          <Route path='/register' element={<RegisterPage />}></Route> */}
      </Routes>
    </UserContextProvider>
  )
}

export default App
