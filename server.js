var express = require('express');
var escapeHTML = require('escape-html');
var unescapeHTML = require('unescape-html');
var app = express();
var ejs = require('ejs');
var path = require('path');
var http = require('http').createServer(app);
var io = require('socket.io').listen(http);


/* SOCKET.IO  */

var clientNumber = 0;
var clients = [];
var rooms = [];
rooms[0] = {room:'welcome' ,connectedClients:[]};


io.on('connection',function(socket){
    socket.nickname = assignNickname();

    io.sockets.emit('update clients', clients);
    io.sockets.emit('update rooms', rooms);
    
    socket.on('send',function(data){
        io.sockets.to(socket.currentRoom).emit('new message', socket.nickname + ": " + escapeHTML(data));
    });
    
    socket.on('change room', function(data){
       if(findRoomIndex(data) != -1){
           socket.leave(socket.currentRoom);
           socket.join(data);
           socket.currentRoom = data;
           var index = findRoomIndex(data);
           rooms[index].connectedClients.push(socket.nickname);
           io.sockets.emit('update rooms', rooms);
           io.sockets.to(socket.currentRoom).emit('update clients', rooms[index].connectedClients);
           io.sockets.to(socket.currentRoom).emit('new message', 'User <b>' + socket.nickname + '</b> has joined room <b>' + socket.currentRoom + '</b>.');
           console.log(socket.currentRoom + "  " + socket.nickname)
           console.log("2");
           /* TO DO : delete from previous room*/
       } else{
           /* create new room*/
           console.log('ne dela');
       }
    });
    
    socket.on('change nickname',function(newNickname){
        if(containsNickname(newNickname)){
            var notice = "<i>This nickname has already been taken, please choose a diffrent one.<i/>";
            socket.emit('new message', notice);
        }else{
            clients[clients.indexOf(socket.nickname)] = newNickname;
            socket.nickname = newNickname;
            io.sockets.emit('update clients', clients);
        }
    });
    
    socket.on('disconnect',function(){
        clients.splice(clients.indexOf(socket.nickname),1);
        io.sockets.emit('update clients', clients);
    });
});

function findRoomIndex(room){
    for(var i in rooms){
        if(rooms[i].room === room){
            return i;
        }
    }
    return -1;
}


function assignNickname(){
    var nickname = "Guest" + clientNumber;
    clients.push(nickname);
    clientNumber++;
    return nickname;
}

function containsNickname(nickname){
    for(var i in clients){
        if(clients[i] == nickname){
            return true;
        }
    }
    return false;
}

/* WEBSITE ROUTING AND VISIT COUNT */

var visits = 0;

if(!process.env.PORT)
    process.env.PORT = 8080;
    
  
var visits = 0;  
   
   
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/views'))

app.get('/',function(req,res){
    visits++;
    console.log(visits);
    res.render(__dirname + '/views/index.ejs');
});

app.get('/chat',function(req,res){
    res.render('chat');
});

app.get('/index',function(req,res){
    res.render('index.ejs');
});
 
http.listen(process.env.PORT,function(){
    console.log("Server listening on PORT " + process.env.PORT);
});

