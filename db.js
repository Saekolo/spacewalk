var mongoose = require('mongoose')


DB_URL = 'mongodb://localhost:27017/spacewalk';

mongoose.connect(DB_URL);
console.log('Connection successful');

mongoose.connection.on('disconnected',function(){
    console.log('Connection failed');
})

module.exports = mongoose;
