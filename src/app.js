const express = require ("express");
const path = require('path');
const mysql = require("mysql");
const dotenv = require('dotenv');

const cookieParser = require('cookie-parser')


dotenv.config({path: './.env'})

const app = express();
app.use(cookieParser())

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
    queryTimeout:60000
});

const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory));

//Parse URL - encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({extend:false}));
//Parse JSON bodies (as sent by API clients)
app.use(express.json());

app.set('view engine', 'hbs');


db.connect((error) =>{
    if(error){
        console.log(error)
    }else{
        console.log("MYSQL Connected...")
    }
})

module.exports = db;

//Define Routes
app.use('/', require('./routes/pages'));

app.use('/auth', require('./routes/auth'));

app.listen(5000, () => {
    console.log("Servidor iniciado na porta 5000");
})
