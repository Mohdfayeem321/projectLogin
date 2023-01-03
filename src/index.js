const express = require("express");
const mysql = require("mysql");

const path = require("path");

const static_path = path.join(__dirname, '../frontend');
//console.log(path.join(__dirname));
const app = express();

app.use(express.static(static_path));

app.use(express.json());

// create connection

let db = mysql.createConnection({

    host: "sql6.freesqldatabase.com",
    user: "sql6587395",
    password: "tCPpVCRX27",
    database: "sql6587395"

});

db.connect((err)=>{
    if(err){
        throw err
    }
    console.log("mysql is connected..");
});



app.post("/registration", (req,res)=>{
    let body = req.body;
    let sql = 'INSERT INTO users SET ?';
    db.query(sql, body,(err,result)=>{
        if(err){
            throw err;
        }
        console.log(result);
    })
    res.send("registration successfully completed")
});



app.post("/login", (req,res)=>{
    let data = req.body;
    console.log(data);
    let {email, password} = data;
    let sql = `SELECT email, password FROM users WHERE email = "${email}" AND password = "${password}"`;
    db.query(sql,(err,result)=>{
        if(err){
            throw err;
        }
        console.log(result);
        res.send({data:result})
    })
});


app.listen('3306',()=>{
    console.log("server started on port 3306");
});

