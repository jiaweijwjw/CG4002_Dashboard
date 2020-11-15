// dedicated file ensures we only connect this socket once.
import clientSocket from 'socket.io-client';
export const socket = clientSocket('http://localhost:5000'); 
// export const socket = clientSocket('http://ipaddress:5000');


// ALWAYS CHANGE THIS WHEN IP ADDRESS CHANGE

socket.on('connect', () => {
    console.log('connected to server');
    socket.emit('initialGet', 'B14');
});

export var dataFromInitialSend = [];
export var dataFromChangesInDB = [];

socket.on('initialSend', data => {
    console.log('received initialSend');
    console.log(data);
    // setTeam(data);
    dataFromInitialSend = data;
    console.log(dataFromInitialSend);
});

// CAN REMOVE THIS
/* socket.on('changes_in_db', data => {
    dataFromChangesInDB = data;
}); */
