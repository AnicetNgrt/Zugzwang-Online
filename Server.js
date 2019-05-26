
"use strict";


var express = require('express');

var app = express();

var server = require('http').Server(app);

var io = require('socket.io')(server);

var Storage = require('node-storage');
 
var store = new Storage('storage');

require('dotenv').config();

var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

const googlepassword = process.env.GOOGLEPASSWORD;


server.listen(3512, "127.0.0.1");

var players = {};


io.on('connection', function (socket) {

    console.log("* ID of new socket object: " + socket.id);

    socket.email = 'idk';

    socket.isInGame = false;
    socket.isVerifiedUser = false;

    socket.emit('ask_email');

    socket.on('got_email', function (data) {
        var user = store.get(data);
        var email = data;
        if (user == undefined) {
            socket.emit('ask_username');
            socket.on('got_username', function(data) {
                var mdpGen = require('generate-password');
                var password = mdpGen.generate({
                    length: 12,
                    numbers: true
                });
                store.put(email+".username", data);
                store.put(email+".password", password);
                console.log(googlepassword);
                var transporter = nodemailer.createTransport(smtpTransport({
                    service: 'gmail',
                    auth: {
                      user: 'an.nougaret@gmail.com',
                      pass: googlepassword
                    }
                  }));
                  
                var mailOptions = {
                from: 'an.nougaret@gmail.com',
                to: email,
                subject: 'Zugzwang password',
                html: `<h2>Thank you ${data} and welcome to the Zugzwang community !</h2>
                <p><strong>🔑 You probably want your password: ${password}</strong></p>
                <p>Have fun !</p>
                <p>Cheers,</p>
                <p>Anicet</p>
                <p>&nbsp;</p>
                <p>ps: You can't change this password yet so try to stick it somewhere.</p>
                <p><em>Please, do not reply to this email. If you have any questions or any concerns send a new email to an.nougaret@gmail.com</em></p>
                <p>&nbsp;</p>`
                };
                
                transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
                socket.emit('register_complete', email);
                });

            });
            
        } else {           
            socket.emit('ask_password');
            socket.on('got_password', function (data) {
                if (data == store.get(email).password) {
                    socket.isVerifiedUser = true;
                    socket.emit('user_logged_in', user.username);
                } else {
                    socket.emit('ask_password');
                }
            });
            
            
        }
        
        
    });

    socket.on('join_game', function () {
       
        if(socket.isInGame === false){
    
            socket.isInGame = true;
           
            players[socket.id] = {
                x: 200,
                y: 150
            };
          
            socket.join('game-room');

            socket.emit('join_game_success');
        }
    });

    socket.on('player-move', function (data) {

        players[socket.id][data.axis] += data.force * 2;
    });

    socket.on('disconnecting', function () {

        if(socket.isInGame === true){

            delete players[socket.id];

            io.in('game-room').emit('remove_player', socket.id);
        }
    });

});


var emitRate = 10;

setInterval(function () {
 
    var dataToSend = prepSendData();

  
    io.in('game-room').emit('state_update', dataToSend);
}, emitRate);

function prepSendData() {
    
    var dataToSend = [];

    var keys = Object.keys(players);
 
    keys.forEach(function (key) {
        
        dataToSend.push({id: key});
    });
    return dataToSend;
}
