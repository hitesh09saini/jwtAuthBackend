const mongoose =  require('mongoose')

const path = process.env.DataBase_URl || 'mongodb://127.0.0.1:27017/mydatabase';

const databaseconnect = ()=>{
    mongoose
    .connect(path)
    .then((conn)=>{
       console.log(`connected to DB: ${conn.connection.host}`);
    })
    .catch((err)=>{
        console.log(`Database Error: ${err.message}`);
    })
}

module.exports = databaseconnect;
