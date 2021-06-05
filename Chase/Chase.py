import turtle
import math

wn = turtle.Screen()

alvo = turtle.Turtle(shape = 'circle')
alvo.color('red')
alvo.penup()

missil = turtle.Turtle()
missil.penup()
missil.setheading(180)

alvo.goto(-100, -50)
missil.goto(200, -50)
missil.pendown()

va = 3
vm = -5

dt = 0.2

oldangle = 0

while missil.distance(alvo.xcor(), alvo.ycor()) >= 10:
    mx = missil.xcor()
    my = missil.ycor()
    ay = alvo.ycor()
    deltaX = missil.xcor() - alvo.xcor()
    if deltaX == 0:
        deltaX = 0.001
    deltaY = missil.ycor() - alvo.ycor()
    angle = math.atan(deltaY/deltaX)
    vmx = vm*math.cos(angle)*dt
    vmy = vm*math.sin(angle)*dt
    mx += vmx
    my += vmy
    missil.tilt(angle - oldangle)
    missil.goto(mx, my)
    ay += va*dt
    alvo.goto(alvo.xcor(), ay)
    oldangle = angle







wn.mainloop()
