import events from 'events';
const eventEmitter = new events();

eventEmitter.on('response',(message)=>{
    console.log(message)
})
eventEmitter.on('passwordExpiration',(message)=>{
    console.log(message);
})
eventEmitter.on('wish-notification', (notificationDetails) => {
    eventEmitter.emit('notifySeller', notificationDetails)
})

eventEmitter.on('new-notification', (notificationDetails) => {
    eventEmitter.emit('notifyBuyers', notificationDetails)
})
eventEmitter.on('expired-notification', (notificationDetails) => {
    eventEmitter.emit('notifySellers', notificationDetails)
})
eventEmitter.on('order-notification', (notificationDetails) => {
    eventEmitter.emit('notifyBuyer', notificationDetails)
})
export{eventEmitter} 