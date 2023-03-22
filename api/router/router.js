const {register, login, logout, getProfile, getAllUsers} = require('../controllers/AuthController');
const {chats, fetchChat, createGroupChat, renameGroup, addInGroup, removeFromGroup, deleteChat, blockChat} = require('../controllers/ChatController');
const {sendMessage, getAllMessages, deleteAllMessages} = require('../controllers/MessagesController')

const router = require('express').Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/profile', getProfile);
router.get('/users', getAllUsers);

router.post('/chat', chats);
router.get('/all-chats', fetchChat);
router.post('/create-group', createGroupChat);
router.put('/rename-group', renameGroup);
router.put('/group-remove', removeFromGroup);
router.put('/group-add', addInGroup);
router.post('/delete-chat', deleteChat)
router.post('/block-chat', blockChat);
// messages routes
router.post('/new-msg', sendMessage);
router.get('/all-msg/:id', getAllMessages);
router.post('/delete-all-msg', deleteAllMessages)
module.exports = router;