import { io } from 'socket.io-client';
const socket = io('http://localhost:3000'); // Make sure port matches backend
export default socket;
