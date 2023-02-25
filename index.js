const express = require('express');
const cors = require('cors');
require('dotenv').config();
const {connection} = require('./Config/db');
const {userRoute} = require('./Routes/auth.routes');

const app = express();


const PORT = process.env.PORT;

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());
app.use("/", userRoute);

app.get('/', (req, res) => res.send('Hello'));

app.listen(PORT, async() => {
    try{
        await connection;
        console.log('connected to DB.');
    } catch(err){
        console.log('unable to connect with DB.');
        console.log(err);
    }
    console.log(`server started on http://localhost:${PORT}`)
});