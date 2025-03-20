const express = require('express');
const app = express();
require('./db/Config');
const User = require('./db/UsersSchema');
const cors = require("cors");
const jwt = require('jsonwebtoken');
const jwtkey = 'yash-verma';
const nodemailer = require('nodemailer')
app.use(cors());
app.use(express.json());


const verifytoken = (req, resp, next) => {
    token = req.headers["authorization"];
    if (token) {
        token = token.split(' ')[1];
        jwt.verify(token, jwtkey, (error, valid) => {
            if (valid) {
                next()
            }
            else {
                resp.send({ status: false, message: 'enter valid token' });
            }
        })
    }
    else {
        resp.send({ status: false, message: 'enter authorization token' });
    }
    
}

app.post('/signup', async (req, resp) => {
    if (!req.body.name || !req.body.email || !req.body.password) {
        resp.send({ status: false, message: 'all fields are require' })
    }
    else {
        let users = new User(req.body);
        let result = await users.save();
        jwt.sign({ result }, jwtkey, { expiresIn: '2h' }, (error, token) => {
            if (error) {
                resp.send({ status: false, message: 'something went wrong' })
            }
            else {
                resp.send({ status: true, message: 'signup complete', data: result, auth: token })
            }
        })

    }
});


app.post('/login', async (req, resp) => {
    const { email, password } = req.body;

    if (!email || !password) {
        resp.send({ status: false, message: 'enter all detials' });
    }
    else {
        const user = await User.findOne({ email })
        if (user) {
            if (user.password === password) {
                jwt.sign({ user }, jwtkey, { expiresIn: '2h' }, (error, token) => {
                    if (error) {
                        resp.send({ status: false, message: 'something went wrong' })
                    }
                    else {
                        resp.send({ status: true, message: 'login perfectly', data: user, auth: token });
                    }
                })
            }
            else {
                resp.send({ status: false, message: "enter correct password" })
            }


        }
        else {
            resp.send({ status: false, message: "user not found" })
        }
    }
})




app.post('/forgot', async (req, resp) => {
    if (!req.body.email) {
        resp.send({ status: false, message: 'Enter Email ID' });
    }
    else {
        const user = await User.findOne(req.body);
        if (user) {
            const otp =  Math.floor(10000 + Math.random() * 90000);
            
            let details = {
                from: 'yashkaran.344@gmail.com',
                to: req.body.email,
                subject: 'For login',
                text:`your otp is: ${otp}`
            };
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                port: 465,
                secure: true,
                auth: {
                    user: 'yashkaran.344@gmail.com',
                    pass: 'fzovuijoolwxgbsq'
                }
            });
            const info = await transporter.sendMail(details, (error, response) => {
                if (error) {
                    resp.send({ status: false, message: 'some error found! ' })
                }
                else {
                    resp.send({ status: true, message: 'OTP send in your email', data: info })
                }
            })
        }
        else{
            resp.send({ status: false, message: 'user not found' });
        }

    }
})

app.post('/otp',(req,resp)=>{
    if(req.body.otp===opt){
        resp.send({status:true,message:'thx'})
    }
    else{
        resp.send({status:false,message:'incorect otp'})
    }
})




app.listen(2350);
