import { useContext } from 'react'
import  ScrollableFeed  from 'react-scrollable-feed'
import { whoIsSender } from '../config/ChatLogic'
import { UserContext } from '../UserContext'

export default function ScrollableChat({messages}){
    const {user} = useContext(UserContext);
    return(
        <ScrollableFeed>
            {messages.map(message =>(
                <div className={`${whoIsSender(user, message) ? 'text-right' : 'text-left'}`} key={message._id}>
                    <div className={`text-left inline-block p-2 my-2 rounded-md text-md ${whoIsSender(user, message)?'bg-blue-500 text-white':' bg-white text-gray-500' }`}>    
                        {message.content}
                    </div>

                </div>
            ))}
        </ScrollableFeed>
    )
}