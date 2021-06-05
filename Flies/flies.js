//JavaScript source code
const canvas = document.getElementById('canvas')

canvas.height = innerHeight
canvas.width = innerWidth

var c = canvas.getContext('2d')

//Box
var boxx0 = 400
var boxy0 = 100
var boxDim = 500
c.beginPath()
c.rect(boxx0, boxy0, boxDim, boxDim)
c.stroke()

class Fly {
    constructor(x, y, vx, vy) {
        this.x = x
        this.y = y
        this.vx = vx
        this.vy = vy
        this.color = 'dark green'

        this.draw = () => {
            c.beginPath()
            c.arc(this.x, this.y, 5, 0, Math.PI * 2, true)
            c.strokeStyle = this.color
            c.stroke()
            c.fill()
        }

        this.update = () => {
            let sign = [-1,0,1]

            if(this.x-5 < boxx0 || this.x+5 > boxx0+boxDim){
                this.x = boxx0 + Math.random()*boxDim
            }
            if(this.y-5 < boxy0 || this.y+5 > boxy0+boxDim){
                this.y = boxy0 + Math.random()*boxDim
            }

            this.x += this.vx*sign[Math.floor(Math.random()*sign.length)]
            this.y += this.vy*sign[Math.floor(Math.random()*sign.length)]

            this.draw()
        }
    }
}

const vel = 3
const number = 300

let flies = []

function init(){
    for(let i = 0; i < number; i++){
        flies.push(new Fly(boxx0+1 + Math.random()*boxDim-3,
                            boxy0 + Math.random()*boxDim-3,
                             vel/Math.sqrt(2), vel/Math.sqrt(2)))
    }
    flies.forEach(fly => {fly.draw()})
}

function momentum(){
    requestAnimationFrame(momentum)
    c.clearRect(boxx0+1, boxy0+1, boxDim-2, boxDim-2)
    flies.forEach(fly => {fly.update()})
}

init()
momentum()