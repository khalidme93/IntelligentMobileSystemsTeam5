
from shutil import move
from picamera import PiCamera
import time
import serial
from flask import Flask
from flask import request
from flask_restful import Resource, Api, reqparse
#import pandas as pd
import ast
from threading import Thread

app = Flask(__name__)
api = Api(app)


Mode=1


class AutoMode(Resource):
    def post(self):
        global Mode
        global start
        active=request.json['active']
        if(active):
            ser.flush()
            Mode=1
            start =1
        else:
            Mode=0
        return {}, 200
    pass

class Move(Resource):
    def post(self):
        speed=request.json['speed']
        direction=request.json['direction']

        if direction == "forward":
            moveFunk(1,speed)
        elif direction == "backward": 
            moveFunk(2,speed)
        elif direction == "left": 
            moveFunk(3,speed)
        elif direction == "right": 
            moveFunk(4,speed)
        else:
            return {"Error": "Wrong direction"}, 400
            # Tell robot to go backwards until further instruction
    
        return {}, 200
    pass

class StopMoving(Resource):
    def post(self):
        moveFunk(1,0)
        return {}, 200

api.add_resource(Move, '/Move')
api.add_resource(StopMoving, '/StopMoving')
api.add_resource(AutoMode, '/AutoMode')


def apiController():
    if __name__ == '__main__':
      app.run(host='0.0.0.0', port=5000)
#take picture with camera
def takePicture(pictureName):
    filetype=".jpg"
    camera = PiCamera() #start camera
    time.sleep(2)
    printPicture= pictureName+str(1)+filetype
    camera.capture(printPicture) #take the pic
    camera.close() #end camera
            

def moveFunk(direction, speed):
    global stenson
    global line
    stenson=0
    while(stenson==0): 
        serialRead()
        if(line=='direction'):
            ser.write(bytes(str(direction)+"\n",'utf-8'))
            ser.write(bytes(str(speed)+"\n",'utf-8'))
            stenson=1
        else:
            stenson=1
        
def serialRead():
        global line
        if ser.in_waiting > 0: # check for serial data
            line = ser.readline().decode('utf-8').rstrip() #read data
            ser.flush()
            print(line)

numPicture = 0
line =0
#start serial and connect to /dev/ttyUSB0
ser = serial.Serial('/dev/ttyUSB0',9600, timeout=1)
ser.flush()
stenson=0

ser.write(b's')
while(ser.readline().decode('utf-8').rstrip() != 'ok'):
    ser.write(b's') 

thread = Thread(target=apiController)
thread.daemon = True
thread.start()

start = 0

while True:
    if(Mode==1):
     serialRead()
     if line == "usonic":
        print("usonic")
        moveFunk(1,0)
        takePicture("test")
        numPicture+=1  
        moveFunk(2,4)
        time.sleep(1) 
        moveFunk(4,4)
        time.sleep(2)
        ser.write(b'0')
        start =0

     elif line == "line":
        moveFunk(1,0)
        time.sleep(1)
        moveFunk(2,4)
        time.sleep(1)
        moveFunk(4,4)
        time.sleep(2)
        ser.write(b'0')
        start =0
        
     if(start==0):
      moveFunk(1,5)
      start =1
    
    