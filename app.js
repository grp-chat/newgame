var express = require('express');
var app = express();
var serv = require('http').Server(app);
PORT = process.env.PORT || 2000;

/* app.get('/', function(req, res) {
    res.sendFile(__dirname + '/client/index.html');
});

app.use('/client', express.static(__dirname + 'client')); */

const clientPath = `${__dirname}/client`;
console.log(`Serving static files from path ${clientPath}`);

app.use(express.static(clientPath));

serv.listen(PORT);
console.log("Server listening at " + PORT);

var SOCKET_LIST = {};




var Entity = function() {
    var self = {
        x:60,
        y:60,
        spdX:0,
        spdY:0,
        id:"",
    }
    self.update = function() {
        self.updatePosition();
    }
    self.updatePosition = function() {
        if(self.collided === false) {
        self.x += self.spdX;
        self.y += self.spdY;
        } else { 
            //self.spdX = 0;
            //self.spdY = 0;
            self.x = self.x - self.spdX;
            self.y = self.y - self.spdY;
            //self.x = 175;
            //console.log(self.x);
            //stop = false;
        }
    }
    return self;
}

var Player = function(id) {
    var self = Entity();
    self.id = id;
    self.number = "" + Math.floor(10 * Math.random());
    self.pressingRight = false;
    self.pressingLeft = false;
    self.pressingUp = false;
    self.pressingDown = false;
    self.collided = false;
    self.maxSpd = 4;

    var super_update = self.update;
    self.update = function() {
        self.updateSpd();
        super_update();
    }
   
    self.updateSpd = function() {
        
        if(self.pressingRight)
            self.spdX = self.maxSpd;
        else if(self.pressingLeft)
            self.spdX = -self.maxSpd;
        else
            self.spdX = 0;

        if(self.pressingUp)
            self.spdY = -self.maxSpd;
        else if(self.pressingDown)
            self.spdY = self.maxSpd;
        else
            self.spdY = 0;
    }
    Player.list[id] = self;
    return self;
}
Player.list = {};
Player.onConnect = function(socket) {
    var player = Player(socket.id); 
    socket.on('keyPress', function(data){
        if(data.inputId === 'left')
            player.pressingLeft = data.state;
        else if(data.inputId === 'right')
            player.pressingRight = data.state;
        else if(data.inputId === 'up')
            player.pressingUp = data.state;
        else if(data.inputId === 'down')
            player.pressingDown = data.state;
    });
    socket.on('collision', function() {
        
        player.collided = true;
        //player.spdX = 0;
        //player.spdY = 0;
        player.updatePosition();
        player.collided = false;
        
        
    });
    
}
Player.onDisconnect = function(socket) {
    delete Player.list[socket.id];
}
Player.update = function() {
    var pack = [];  
    for(var i in Player.list) {
        var player = Player.list[i];
        player.update();
        pack.push({
            x:player.x,
            y:player.y,
            number:player.number,   
            spdX:player.spdX,
            spdY:player.spdY,
            id:player.id
        });
    }
    return pack;
}

var io = require('socket.io')(serv, {});
io.sockets.on('connection', function(socket) {
    socket.id = Math.random();
    SOCKET_LIST[socket.id] = socket;

    Player.onConnect(socket);
    socket.on('disconnect', function(){
        delete SOCKET_LIST[socket.id];
        Player.onDisconnect(socket);
    });
    
    //socket.on('collision', function(x, y){});
});

setInterval (function() {
    var pack = Player.update();
    
    for(var i in SOCKET_LIST) {
        var socket = SOCKET_LIST[i]; 
        socket.emit('newPositions', pack);
    }
    
},1000/25);