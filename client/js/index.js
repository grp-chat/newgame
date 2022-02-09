/* var ctx = document.getElementById("ctx").getContext("2d");
        ctx.font = '30px Arial'; */

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
    constructor({ position, velocity, id }) {
        this.position = position
        this.velocity = velocity
        this.radius = 15
        this.id = id
    }
    draw() {
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        c.fillStyle = 'yellow'
        c.fill()
        c.closePath()
    }
}

const map = [
    ['-', '-', '-', '-', '-', '-', '-', '-'],
    ['-', ' ', ' ', ' ', ' ', ' ', ' ', '-'],
    ['-', ' ', ' ', ' ', ' ', ' ', ' ', '-'],
    ['-', ' ', ' ', '-', '-', ' ', ' ', '-'],
    ['-', ' ', ' ', ' ', ' ', ' ', ' ', '-'],
    ['-', ' ', ' ', ' ', ' ', ' ', ' ', '-'],
    ['-', '-', '-', '-', '-', '-', '-', '-']
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




var collision = false;
var socket = io();

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
            id: data[i].id
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
                    socket.emit('collision')
        
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








