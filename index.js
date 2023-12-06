require('dotenv').config();

const PORT = process.env.PORT || 8081;

const app  = require('./app')

app.listen(PORT, ()=>{
    console.log(`server is running http://localhost:${PORT}`);
})

