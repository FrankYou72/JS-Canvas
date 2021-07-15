const canvas = document.querySelector('canvas')

const c = canvas.getContext('2d')

canvas.width = window.innerWidth/2
canvas.height = window.innerHeight / 2

let total = document.querySelector('#total')
let nInfected = document.querySelector('#infectadas')
let nCured = document.querySelector('#curadas')
let nVaccinated = document.querySelector('#vacinadas')
let nDeceased = document.querySelector('#falecidas')


const statusData = [
    ['non-infected', 1, 0, 0, '#FFE0D9'],
    ['infected', 0, 1, 0.05,'red'],
    ['cured', 0., 0, 0, 'aqua'],
    ['vaccinated', 0.28, 0, 0, 'GreenYellow'],
    ['deceased', 0, 0, 1, 'black']
]

class Status {
    constructor(label, infectionChances, transmissionChances, deathChances, color) {
        this.label = label
        this.infectionChances = infectionChances
        this.transmissionChances = transmissionChances
        this.deathChances = deathChances
        this.color = color
    }
}

let statuses = []

statusData.forEach((data) => {
    statuses.push(new Status(data[0], data[1], data[2], data[3], data[4]))
})

class Person {
    constructor(status, xPos, yPos, vel) {
        this.status = status
        this.xPos = xPos
        this.yPos = yPos
        this.vel = vel
        this.timer = 0
        this.vaccinated = false
    }

    draw() {
        c.beginPath()
        c.fillStyle = this.status.color
        c.arc(this.xPos, this.yPos, 4, 0, Math.PI * 2, true)
        c.fill()
    }

    move() {
        this.xPos += this.vel.x
        this.yPos += this.vel.y
        this.draw()
    }

    passTime() {
        this.timer += 1
    }

    update() {
        if (this.status.label == 'infected' || this.status.label == 'cured') {
            this.passTime()
        }
        this.move()
    }

    changeStatus(newStatusLabel) {
        statuses.forEach((status) => {
            if (status.label == newStatusLabel) {
                this.status = status
            }
        })
    }
}

class Vaccine {
    constructor() {
        this.width = 0 //100 if need to run without vaccination just set this to 0
        this.height = 0 //100 if need to run without vaccination just set this to 0
        this.leftLimit = 360 - this.width/2
        this.rightLimit = this.leftLimit + this.width
        this.upperLimit = 200 - this.height/2
        this.lowerLimit = this.upperLimit + this.height
        this.vel = {
            x : Math.random(),
            y : Math.random()
        }
}
    draw() {
        c.save()
        c.beginPath()
        c.rect(this.leftLimit, this.upperLimit, this.width, this.height)
        c.fillStyle = 'Green'
        c.fill()
        c.restore()
    }

    move() {
        if (this.leftLimit <= 0){
            this.leftLimit += 1
            this.rightLimit += 1
            this.vel.x *= -1*(0.5 + Math.random())
        }
        if (this.rightLimit >= canvas.width){
            this.leftLimit -= 1
            this.rightLimit -= 1
            this.vel.x *= -1*(0.5 + Math.random())
        }
        if (this.upperLimit <= 0){
            this.upperLimit += 1
            this.lowerLimit += 1
            this.vel.y *= -1*(0.5 + Math.random())
        }
        if (this.lowerLimit >= canvas.height){
            this.upperLimit -= 1
            this.lowerLimit -= 1
            this.vel.y *= -1*(0.5 + Math.random())
        }

        //if (this.leftLimit <= 0 || this.rightLimit >= canvas.width) {
        //    if (Math.abs(this.vel.x) <= 0.1) {
        //        this.vel.x *= 1 +0.5 - Math.random()
        //    }else{
        //        this.vel.x *= -1*(0.5 + Math.random())
        //    }
        //}
        //if (this.upperLimit <= 0 || this.lowerLimit >= canvas.height) {
        //    if (Math.abs(this.vel.y) <= 0.1) {
        //        this.l
        //    }else{
        //        this.vel.y *= -1 * (0.5 + Math.random())
        //    }
        //}
//
        this.leftLimit += this.vel.x
        this.rightLimit += this.vel.x
        this.lowerLimit += this.vel.y
        this.upperLimit += this.vel.y
        this.draw()
        //console.log(this.upperLimit)
    }

}


function checkInfection(person1, person2) {
    let infection = Math.random()

    if (person1.status.label == 'infected') {
        if (person1.vaccinated) {
            statuses.forEach((status) => {
                if (person2.status.label == status.label && status.label != 'infected') {
                    if ((person1.status.transmissionChances*0.6) * person2.status.infectionChances > infection) {
                        person2.timer = 0
                        person2.changeStatus('infected')
                    }
                }
            })
        } else {
            statuses.forEach((status) => {
                if (person2.status.label == status.label && status.label != 'infected') {
                    if (person1.status.transmissionChances * person2.status.infectionChances > infection) {
                        person2.timer = 0
                        person2.changeStatus('infected')
                    }
                }
            })
        }
    } else if (person2.status.label == 'infected') {
        if (person2.vaccinated) {
            statuses.forEach((status) => {
                if (person1.status.label == status.label && status.label != 'infected') {
                    if (person2.status.transmissionChances*0.6 * person1.status.infectionChances > infection) {
                        person1.timer = 0
                        person1.changeStatus('infected')
                    }
                }
            })

        } else {
            statuses.forEach((status) => {
                if (person1.status.label == status.label && status.label != 'infected') {
                    if (person2.status.transmissionChances * person1.status.infectionChances > infection) {
                        person1.timer = 0
                        person1.changeStatus('infected')
                    }
                }
            })
        }
    }

}

function checkOutcome(person) {
    let decease = Math.random()
    if (person.timer >= 600 && person.timer < 1500) {
        if (person.vaccinated) {
            person.changeStatus('vaccinated')
            person.timer = 0
        } else {
            if (person.status.deathChances > decease) {
                person.changeStatus('deceased')
                person.vel.x = 0
                person.vel.y = 0
            } else {
                person.changeStatus('cured')
            }
        }
    } else if (person.timer >= 1500) {
        if (person.status.label == 'cured') {
            if (person.vaccinated == false) {
                person.changeStatus('non-infected')
            }
        }
    }
}

function checkVaccination(person, vaccine) {
    if (person.status.label != 'infected' && person.status.label != 'deceased') {
        if (person.vaccinated == false) {
            if (person.xPos < vaccine.rightLimit && person.xPos > vaccine.leftLimit && person.yPos > vaccine.upperLimit && person.yPos < vaccine.lowerLimit) {
                person.vaccinated = true
                person.changeStatus('vaccinated')
            }
        }
    }
}

let people = []

let vac = new Vaccine()

function init() {
    const n = 135
    total.innerHTML = 150
    for (let i = 0; i < n; i++) {
        people.push(new Person(
            statuses[0],
            canvas.width * (Math.random()),
            canvas.height * (Math.random()),
            {
                x: (0.5 - Math.random())/2,
                y: (0.5 - Math.random())/2
            //    x: (0.5 - Math.random()) / 2,
            //    y: (0.5 - Math.random()) / 2
            }
        ))
    }
    for (let i = 0; i < 15; i++) {
        people.push(new Person(
            statuses[1],
            canvas.width * (Math.random()),
            canvas.height * (Math.random()),
            {
                x: 0.5 - Math.random(),
                y: 0.5 - Math.random()
            }
        ))
    }
}


function animate() {
    requestAnimationFrame(animate)
    c.clearRect(0, 0, canvas.width, canvas.height)
    vac.move()
    let inf = 0
    let cur = 0
    let vacc = 0
    let dec = 0
    people.forEach((person) => {
        //verifying person person interaction
        people.forEach(otherPerson => {
            if (Math.hypot((person.xPos - otherPerson.xPos), (person.yPos - otherPerson.yPos)) < 8 && person !== otherPerson) {
                checkInfection(person, otherPerson)
                if (person.xPos - otherPerson.xPos >= 0){
                    if (person.xPos + 1 < canvas.width){
                        person.xPos += 1
                        otherPerson.xPos -= 1
                    } else {
                        otherPerson.xPos -= 2
                    }
                }
                if (person.xPos - otherPerson.xPos <= 0){
                    if (person.xPos - 1 > 0){
                        person.xPos -= 1
                        otherPerson.xPos += 1
                    } else {
                        otherPerson.xPos += 2
                    }
                }
                if (person.yPos - otherPerson.yPos >= 0){
                    if (person.yPos + 1 < canvas.height){
                        person.yPos += 1
                        otherPerson.yPos -= 1
                    } else {
                        otherPerson.yPos -= 2
                    }
                }
                if (person.yPos - otherPerson.yPos <= 0){
                    if (person.yPos - 1 < 0){
                        person.yPos -= 1
                        otherPerson.yPos += 1
                    } else {
                        otherPerson.yPos += 2
                    }
                }
                person.vel.x *= -1
                person.vel.y *= -1
                otherPerson.vel.x *= -1
                otherPerson.vel.y *= -1
            }
        })

        // verifying outcome of desease
        checkOutcome(person)

        //verifying interacting with the walls

        if ((person.xPos - 4) <= 0 || (person.xPos + 4) >= canvas.width) {
            person.vel.x *= -1
        }
        if ((person.yPos - 4) <= 0 || (person.yPos + 4) >= canvas.height) {
            person.vel.y *= -1
        }

        // Verifying vaccination

        checkVaccination(person, vac)

        //setting labels

        if (person.status.label == 'infected') {
            inf += 1
        }else if (person.status.label == 'cured') {
            cur += 1
        } else if(person.vaccinated) {
            vacc += 1
        } else if (person.status.label == 'deceased') {
            dec += 1
        }

        person.update()
    })
    nInfected.innerHTML = inf
    nCured.innerHTML = cur
    nVaccinated.innerHTML = vacc
    nDeceased.innerHTML = dec

}

init()
animate()