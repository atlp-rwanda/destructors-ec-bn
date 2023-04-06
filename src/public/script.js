const notify = document.querySelector('#notification');
const message = document.querySelector('#message');
const button = document.querySelector('button');
const messageBar = document.querySelector('#message-bar');

// function printMessage(e) {
//     e.preventDefault();
//     // socket.emit('message', message.value);
//   }
//   button.addEventListener('click', printMessage);

const socket = io('http://localhost:3300');

socket.on('userConnection');
// socket.emit('expiredProducts');
socket.on('notifications', (products) => {
// console.log(products[0]);
  notify.textContent = `${products[0].name} is expired`;
  messageBar.style.backgroundColor = 'blue';
  messageBar.style.height = '10vh';
});