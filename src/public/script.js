// const notify = document.querySelector('#notification');
// const message = document.querySelector('#message');
// const button = document.querySelector('button');
// const messageBar = document.querySelector('#message-bar');

// // function printMessage(e) {
// //     e.preventDefault();
// //     // socket.emit('message', message.value);
// //   }
// //   button.addEventListener('click', printMessage);

// const socket = io('http://localhost:3300');

// socket.on('userConnection');
// // socket.emit('expiredProducts');
// socket.on('notifications', (products) => {
// // console.log(products[0]);
//   notify.textContent = `${products[0].name} is expired`;
//   messageBar.style.backgroundColor = 'blue';
//   messageBar.style.height = '10vh';
// });

// var box  = document.getElementById('box');
// var down = false;


// function toggleNotifi(){
// 	if (down) {
// 		box.style.height  = '0px';
// 		box.style.opacity = 0;
// 		down = false;
// 	}else {
// 		box.style.height  = '510px';
// 		box.style.opacity = 1;
// 		down = true;
// 	}
// }