const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const crypto =require('crypto');
// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");
// Load User model
const User = require("../../models/User");
const Otp=require("../../models/Otp");
const nodemailer=require('nodemailer');
const Sequelize =require('sequelize');
const { Console } = require("console");
const Op=Sequelize.Op;
require('dotenv').config()


// @route POST api/users/register
// @desc Register user
// @access Public
router.post("/register", (req, res) => {
    // Form validation

  Otp.findById(req.body.otpid).then(otpObject=>{
    if(otpObject){
      if(otpObject.maxTry==0||otpObject.otpExpires<Date.now()){
        console.error("OTP Expired");
        res.status(403).json("OTP Expired");
      }
      otpObject.maxTry--;
      if(otpObject.otp!=req.body.otp){
        console.log("Wrong OTP");
        otpObject.save().then(resp=>{res.status(403).json("Wrong OTP")});
      }
      else{
            const newUser = new User({
              email:req.body.email,
              handle: req.body.handle,
              password: req.body.password
            });
            
      // Hash password before saving in database
            bcrypt.genSalt(10, (err, salt) => {
              bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) throw err;
                newUser.password = hash;
                newUser
                  .save()
                  .then(user => {res.json(user);
                    otpObject.remove();
                  })
                  .catch(err => console.log(err));
              });
            });
         
      }
    }
    else{
      res.status(403).json("Invalid OTP request");
    }
  })
    
  
  });

  // @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post("/login", (req, res) => {
    // Form validation
  const { errors, isValid } = validateLoginInput(req.body);
  // Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }
  const email = req.body.email;
    const password = req.body.password;
  // Find user by email
    User.findOne({ email }).then(user => {
      // Check if user exists
      if (!user) {
        return res.status(404).json({ handlenotfound: "Email not found" });
      }
      console.log("hi");
  // Check password
      bcrypt.compare(password, user.password).then(isMatch => {
        if (isMatch) {
          // User matched
          // Create JWT Payload
          const payload = {
            id: user.id,
            email:user.email,
            handle: user.handle
          };
  // Sign token
          jwt.sign(
            payload,
            keys.secretOrKey,
            {
              expiresIn: 31556926 // 1 year in seconds
            },
            (err, token) => {
              res.json({
                success: true,
                token: "Bearer " + token
              });
            }
          );
        } else {
          return res
            .status(400)
            .json({ passwordincorrect: "Password incorrect" });
        }
      });
    });
  });

  router.post('/forgotPassword', (req, res) => {
    if (req.body.email === '') {
      res.status(400).send('email required');
    }
    console.error(req.body.email);
    User.findOne({
      email: req.body.email
    }).then((user) => {
      if (user === null) {
        console.error('email not in database');
        res.status(403).send('email not in db');
      } else {
        const token = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken=token;
        user.resetPasswordExpires=Date.now()+3600000;
        // user.update({
        //   resetPasswordToken: token,
        //   resetPasswordExpires: Date.now() + 3600000,
        // });
        user.save();
        console.log(`${process.env.EMAIL_ADDRESS}`);
        console.log(`${process.env.EMAIL_PASSWORD}`);
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: `${process.env.EMAIL_ADDRESS}`,
            pass: `${process.env.EMAIL_PASSWORD}`,
          },
        });

        const mailOptions = {
          from: 'mySqlDemoEmail@gmail.com',
          to: `${user.email}`,
          subject: 'Link To Reset Password',
          text:
            'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n'
            + 'Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n'
            + `http://localhost:3000/reset/${token}\n\n`
            + 'If you did not request this, please ignore this email and your password will remain unchanged.\n',
        };

        console.log('sending mail');

        transporter.sendMail(mailOptions, (err, response) => {
          if (err) {
            console.error('there was an error: ', err);
          } else {
            console.log('here is the res: ', response);
            res.status(200).json('recovery email sent');
          }
        });
      }
    });
  });

  router.get('/resetPassword/:token', (req, res) => {
    console.log(req.params);
    User.findOne({
      
        resetPasswordToken: req.params.token
      
    }).then((user) => {
      if (user == null) {
        console.error('password reset link is invalid or has expired');
        res.status(403).send('password reset link is invalid or has expired');
      } else {
        res.status(200).send({
          handle: user.handle,
          message: 'password reset link a-ok',
        });
      }
    });
  });

  router.put('/updatePasswordViaEmail', (req, res) => {
console.log(req.body.resetPasswordToken);
    User.findOne({
      
        handle: req.body.handle,
        resetPasswordToken: req.body.resetPasswordToken
        // resetPasswordExpires: {
        //   [Op.gte]: comaparisonDate
        // }
        
        
    }).then(user => {
      if (user == null) {
        console.error('password reset link is invalid ');
        res.status(403).send('password reset link is invalid ');
      } else if (user != null) {
        console.log(user.resetPasswordExpires);
        if(user.resetPasswordExpires<Date.now()){
          console.error("Password reset link has expires");
          res.status(403).send('Password reset link has expires');
        }
        console.log('user exists in db');
        console.log(req.body.password);
        bcrypt
          .hash(req.body.password,10)
          .then(hashedPassword => {
            console.log(hashedPassword);
            user.password=hashedPassword;
            user.resetPasswordToken=null;
            user.resetPasswordExpires=null;
            user.save();
          })
          .then(() => {
            console.log('password updated');
            res.status(200).send({ message: 'password updated' });
          });
      } else {
        console.error('no user exists in db to update');
        res.status(401).json('no user exists in db to update');
      }
    }).catch(err=>{console.log(err)});
  });
  router.post('/sendotp', (req, res) => {
    const { errors, isValid } = validateRegisterInput(req.body);
    // Check validation
      if (!isValid) {
        console.log(errors);
        return res.status(400).json(errors);
      }
      User.findOne({ email: req.body.email }).then(user => {
        if (user) {
          console.log("hi");
          return res.status(400).json({ user: "Email already exists" });
        }});
    const otpNo=Math.floor(Math.random() * (10000 - 1000)) + 1000;
    const otpObject=new Otp({
      otp:otpNo.toString(),
      otpExpires:Date.now()+600000
    });
    otpObject.save().then(
      response=>{
        console.log(response);
        res.status(200).send({otpId:otpObject.id});
      }).catch(err=>{
        console.log(err);res.status(500).json("Unable to send OTP");
      })

        const mailOptions = {
          from: 'mySqlDemoEmail@gmail.com',
          to: `${req.body.email}`,
          subject: 'OTP for registartion',
          text:
            'You are receiving this because you (or someone else) have requested the registartion for your account.\n\n'
            + 'Please enter the following OTP before 10 minutes and withing 3 tries. Otp:\n\n'
            + `${otpNo}\n\n`
            + 'If you did not request this, please ignore this email .\n',
        };

        console.log('sending mail');

        transporter.sendMail(mailOptions, (err, response) => {
          if (err) {
            console.error('there was an error: ', err);
          } else {
            console.log('here is the res: ', response);
            res.status(200).json('Otp email sent');
          }
        });
      
  });

module.exports = router;