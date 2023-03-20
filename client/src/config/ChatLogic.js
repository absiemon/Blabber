export const getSender = (loggedInUser, users)=>{
    return users[0]?._id === loggedInUser?._id ? users[1].username : users[0].username;
}


export const whoIsSender = (user, message)=>{
    return user?._id === message?.sender._id;
}