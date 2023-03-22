import { useContext } from 'react'
import  ScrollableFeed  from 'react-scrollable-feed'
import { whoIsSender } from '../config/ChatLogic'
import { UserContext } from '../UserContext'

export default function ScrollableChat({messages}){
    const {user} = useContext(UserContext);

    const getTime = (date)=>{
        const time = new Date(date).toLocaleTimeString();
        const timearr = time.split(' ');
        const timearr2 = timearr[0].split(':');
        return timearr2[0] + ":" + timearr2[1] + " " + timearr[1].toLowerCase();
    }

    return(
        <ScrollableFeed >
            {messages.map(message =>(
                <div className={`${whoIsSender(user, message) ? 'text-right' : 'text-left'}`} key={message._id}>
                    <div className={`text-left inline-block p-2 my-2 rounded-md text-md ${whoIsSender(user, message)?'bg-blue-500 text-white':' bg-white text-gray-500' }`}>    
                        <div  className='flex flex-col'>
                            {message.content}
                            <span style={{fontSize:'13px'}}>{getTime(message.createdAt)}</span>
                        </div>
                    </div>

                </div>
            ))}
        </ScrollableFeed>
    )
}