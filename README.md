# Blabber

This is a Full Chatting app where you can send realtime messages. 
This is a MERN (MongoDB, Express, React, Node.js) application that serves as a starter template for building web applications. It has been created with best practices in mind and includes various features such as authentication, routing, and database integration.

## Installation
1. Download project
2. Download required node packages using the npm install command:


```bash
$ npm install
```
3. Create a .env file in the api directory of the application and add the following variables:
```bash
PORT= Your-port
MONGODB_URI= your-mongo-uri
JWT_SECRET=your-secret-key
```
4. Create a .env file in the client directory of the application and add the following variables:
```bash
VITE_API_BASE_URL= Your-api-url
```
5. Start the project by executing this command:
```bash
$ npm run dev
```

## Features
The following features are included in this application:

1. User authentication with JWT tokens.
2. Password reset functionality.
3. Protected routes.
4. CRUD operations with MongoDB.
5. React Router for client-side routing.
6. You Search a user by clicking Search user button, add the user by just clicking and start chatting.
7. you can also create a group chat, add some friends, and start chatting.
8. User will receive notifications if he will be online.
9. There is a feature for unseen messages.

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)

