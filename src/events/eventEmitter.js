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
eventEmitter.on('expired-notification', (notificationDetails) => {
    eventEmitter.emit('notifySellers', notificationDetails)
})
eventEmitter.on('order-notification', (notificationDetails) => {
    eventEmitter.emit('notifyBuyer', notificationDetails)
})
eventEmitter.on('newOrder-notification', (notificationDetails) => {
    eventEmitter.emit('newOrderNotification', notificationDetails)
})
export{eventEmitter} 