
var _this;


var socket = io("http://127.0.0.1:3512");


socket.on('ask_email', async function () {
    email = await window.prompt("Email for loging in/registering please.", "");
    socket.emit('got_email', email);
}); 
socket.on('ask_username', async function () {
    username = await window.prompt("Choose an username please.", "Anonymous");
    socket.emit('got_username', username);
});
socket.on('ask_password', async function () {
    password = await window.prompt("Enter your password please.", "");
    socket.emit('got_password', password);
});
socket.on('register_complete', function (data) {
    window.alert("Welcome :)\nI have sent an email with your password to "+data+"\n The page will refresh itself and you will be able to login.");
    setTimeout(function(){ Location.reload(true); }, 5000);
});
socket.on('user_logged_in', function (data) {
    window.alert("Welcome back "+data+" !");
});

socket.on('join_game_success', function () {
    
    _this.state.start("Game");
});

socket.on('remove_player', function (data) {
    
});

var updateCount = 0;

socket.on('state_update', function (data) {


});


zugzwangGame = {};

zugzwangGame.Boot = function () {
};

zugzwangGame.Boot.prototype = {

    create: function () {
        _this = this;

        this.state.start('Preload');
    },

    events: (function () {
        socket.on('disconnect', function () {
            console.log("The server disconnected. ")
        });
    })()
};

//document.getElementById("gameContainer").style.display = "block";