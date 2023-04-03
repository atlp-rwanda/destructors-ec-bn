import events from 'events';
const eventEmitter = new events();

eventEmitter.on('response',(message)=>{
    console.log(message)
})
eventEmitter.on('passwordExpiration',(message)=>{
    console.log(message);
})
export{eventEmitter} 