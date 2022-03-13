/* var ctx = document.getElementById("ctx").getContext("2d");
        ctx.font = '30px Arial'; */

var nickname = '';
var pinNumber = 0;
var correctPin = false;
var secs = 0;

setInterval(() => {
    secs++;
}, 1000);


    const promptMsg = () => {
    var nick = prompt("Please enter your pin number:");
    while (nick.length == 0) {
        alert("Please enter your pin number!");
        nick = prompt("Please enter your pin number:");
    }

    
    if (nick === '9852') {
        nickname = 'LK';
        correctPin = true;
    } else if (nick === '9035') {
        nickname = 'LXR'
        correctPin = true;
    } else if (nick === '6588') {
        nickname = 'TJY'
        correctPin = true;
    } else if (nick === '1072') {
        nickname = 'JL'
        correctPin = true;
    } else if (nick === '3839') {
        nickname = 'SZF'
        correctPin = true;
    } else if (nick === '88888') {
        nickname = 'TCR'
        correctPin = true;
    } else if (nick === '3583') {
        nickname = 'JHA'
        correctPin = true;
    } else if (nick === '5086') {
        nickname = 'CED'
    } else if (nick === '2105') {
        nickname = 'CJH'
    } else if (nick === '2167') {
        nickname = 'KX'
    } else if (nick === '7051') {
        nickname = 'KN'
    } else if (nick === '1198') {
        nickname = 'LOK'
    } else if (nick === '7089') {
        nickname = 'JW'
    } else {
        alert("Wrong pin number!");
        promptMsg();
    }
};

promptMsg();


//........................................................................................
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
c.font = '30px Arial'
canvas.width = innerWidth
canvas.height = innerHeight



class Boundary {
    static width = 40
    static height = 40
    constructor({ position }) {
        this.position = position
        this.width = 40
        this.height = 40
    }

    draw() {
        c.fillStyle = 'blue'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}

class Player {
    constructor({ position, velocity, name, /* timer */ }) {
        this.position = position
        this.velocity = velocity
        this.radius = 10
        //this.id = id
        this.name = name
        //this.timer = timer
        
    }
    draw() {
        //secs = secs.toString()
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        c.fillStyle = 'yellow'
        c.fill()
        c.closePath()
        c.strokeText(this.name, this.position.x - 12, this.position.y + 4)
        //c.fillText(secs.substring(0,2), 1000, 500)
        c.fillText(secs, 1000, 500)
    }
}

const map = [
    ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-'],
    ['-', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '-', ' ', ' ', ' ', '-'],
    ['-', ' ', '-', ' ', '-', ' ', '-', ' ', ' ', ' ', '-', ' ', '-'],
    ['-', ' ', ' ', ' ', '-', ' ', ' ', ' ', '-', ' ', '-', ' ', '-'],
    ['-', ' ', '-', ' ', '-', ' ', '-', ' ', ' ', ' ', '-', ' ', '-'],
    ['-', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '-', ' ', ' ', ' ', '-'],
    ['-', ' ', '-', '-', ' ', '-', '-', ' ', ' ', ' ', '-', ' ', '-'],
    ['-', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '-', ' ', ' ', ' ', '-'],
    ['-', '-', '-', ' ', '-', ' ', '-', '-', '-', ' ', '-', ' ', '-'],
    ['-', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '-', ' ', '-', ' ', '-'],
    ['-', ' ', '-', '-', ' ', '-', '-', ' ', ' ', ' ', '-', ' ', '-'],
    ['-', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '-', ' ', ' ', ' ', '-'],
    ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-']
]
const boundaries = []

map.forEach((row, i) => {
    row.forEach((symbol, j) => {
        switch (symbol) {
            case '-':
                boundaries.push(new Boundary({
                    position: {
                        x: Boundary.width * j,
                        y: Boundary.height * i
                    }
                })
                )
                break
        }
    })
})



//===============================================================================================

var socket = io();
socket.emit('newuser', nickname);
/* socket.on('timer', function(data) {
    secs = data;
    
}); */


socket.on('newPositions', function (data) {
    c.clearRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < data.length; i++) {
        //alert(data[i].number)
        //c.fillText(data[i].number, data[i].x, data[i].y);

        var player = new Player({
            position: {
                x: data[i].x,
                y: data[i].y
            },
            velocity: {
                x: data[i].spdX,
                y: data[i].spdY

            },
            id: data[i].id,
            name: data[i].nick,
            //timer: data[i].timer
        })

        player.draw()
        boundaries.forEach((boundary) => {
            boundary.draw()

            if (player.position.y - player.radius + player.velocity.y
                <= boundary.position.y + boundary.height &&
                player.position.x + player.radius + player.velocity.x
                >= boundary.position.x &&
                player.position.y + player.radius + player.velocity.y
                >= boundary.position.y &&
                player.position.x - player.radius + player.velocity.x
                <= boundary.position.x + boundary.width) {
                //if collision happends
                player.velocity.x = 0
                player.velocity.y = 0
                //collision = true
                //alert(collision)
                //socket.emit('collision')

            }

        })
        document.onkeydown = function (event) {
            if (event.keyCode === 68)
                socket.emit('keyPress', { inputId: 'right', state: true });
            else if (event.keyCode === 83)
                socket.emit('keyPress', { inputId: 'down', state: true });
            else if (event.keyCode === 65)
                socket.emit('keyPress', { inputId: 'left', state: true });
            else if (event.keyCode === 87)
                socket.emit('keyPress', { inputId: 'up', state: true });
        }

        document.onkeyup = function (event) {
            if (event.keyCode === 68)
                socket.emit('keyPress', { inputId: 'right', state: false });
            else if (event.keyCode === 83)
                socket.emit('keyPress', { inputId: 'down', state: false });
            else if (event.keyCode === 65)
                socket.emit('keyPress', { inputId: 'left', state: false });
            else if (event.keyCode === 87)
                socket.emit('keyPress', { inputId: 'up', state: false });
        }

    }

});








