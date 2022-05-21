
from inspect import getcoroutinelocals
from shutil import move
from statistics import mode
from tarfile import GNUTYPE_LONGNAME
from picamera import PiCamera
import time
import requests
import serial
import math
from flask import Flask
from flask import request
from flask_restful import Resource, Api
from threading import Thread
from ConnectionBackend import sendImage

app = Flask(__name__)
api = Api(app)
startUP=0                                   # Ensures first gyrovalue is set as offset for any start diviation
right=0                                     # Turn controller
speed = 3                                   # Speed controller for mower
Mode = 1                                    # Mower state controller 
start = 0                                   # Varibel for start moving forward
line = 0                                    # Varibel that has serial communication
printPicture= "images/uSonicPic.png"        # filepath to save picture and name of picture
coordinateX = 0.0                           # Current X value
coordinateY = 0.0                           # current Y value
gyro = 0.0                                  # current gyro value
startTime = 0                               # Start timestamp
endTime = 0                                 # End timestamp, for calculating time travald
startGyor=0                                 # Start value for gyro

#Gett mower status with api
class GetStatus(Resource):
    def get(self):
        global Mode
        return {"mode": Mode}, 200
    pass

#Sett mower speed with api
class SetSpeed(Resource):
    def post(self):
        global speed
        global start
        speed= request.json['speed']
        start = 0
        return {}, 200
    pass

#Change mower state with api
class AutoMode(Resource):
    def post(self):
        global Mode
        global start
        global coordinateX
        global coordinateY
        global startTime
        active=request.json['active']
        if(active):
            ser.flush()
            ser.write(b'0')
            time.sleep(0.5)
            Mode = 1
            start = 0
            sendCoordinate(2)
            coordinateX = 0
            coordinateY = 0
            startTime = time.time()

        else:
            Mode = 0
            ser.flush()
        return {}, 200
    pass

#Move mower with api
class Move(Resource):
    def post(self):
        global speed
        speed=request.json['speed']
        direction=request.json['direction']
        if direction == "forward":
            ser.write(bytes(str(1)+"\n",'utf-8'))
            ser.write(bytes(str(speed)+"\n",'utf-8'))
        elif direction == "backward": 
            ser.write(bytes(str(2)+"\n",'utf-8'))
            ser.write(bytes(str(speed)+"\n",'utf-8'))
        elif direction == "left": 
            ser.write(bytes(str(3)+"\n",'utf-8'))
            ser.write(bytes(str(speed)+"\n",'utf-8'))
        elif direction == "right": 
            ser.write(bytes(str(4)+"\n",'utf-8'))
            ser.write(bytes(str(speed)+"\n",'utf-8'))
        else:
            return {"Error": "Wrong direction"}, 400
    
        return {}, 200
    pass

#Stopp mower with api
class StopMoving(Resource):
    def post(self):
        ser.write(bytes(str(1)+"\n",'utf-8'))
        ser.write(bytes(str(0)+"\n",'utf-8'))
        return {}, 200

#api resorce
api.add_resource(Move, '/Move')
api.add_resource(StopMoving, '/StopMoving')
api.add_resource(AutoMode, '/AutoMode')
api.add_resource(SetSpeed, '/SetSpeed')
api.add_resource(GetStatus, '/GetStatus')

#Api start
def apiController():
    if __name__ == '__main__':
      app.run(host='0.0.0.0', port=5000)

#Start camera, send picture and close
def takePicture():
    global printPicture
    camera = PiCamera()
    camera.resolution = (1920, 1080) 
    camera.capture(printPicture)
    camera.close()
    sendImage(printPicture)
    
#Manage line sensor activation            
def lineDetect():
        moveFunk(1,0)
        getCoordinate()
        moveFunk(2,speed)

#Manage ultrasonic sensor activation
def ultrasonic():
        moveFunk(1,0)
        getCoordinate()
        takePicture()
        sendCoordinate(0)
        moveFunk(2,speed)

#Get and calculate cordinates
def getCoordinate():
    global gyro
    global startUP
    global startGyor
    global startTime
    global endTime
    global coordinateX
    global coordinateY
    endTime = time.time()
    breakOut=0
    ser.write(b'5')
    while(line != "coordinates"):
       if(line=="direction"):
           ser.write(b'5')
       breakOut+=1
       if(breakOut==1000):
           breakOut=0
           return
       serialRead()

    breakOut=0       
    serialRead()
    if(startUP==0):
        startGyor=float(line)
        startUP=1
        coordinateX =0
        coordinateY =0
    else:
        gyro = (float(line)-startGyor)
  
    #Coordinate calculated by time interval, % of max speed and gyro angle
    if(endTime!=0 and startTime!=0):
        totalTime = (endTime - startTime)
        if(totalTime>0.01):
            distance = speed/9.0 *totalTime * 0.6
            newCoordinateX =(distance * math.cos(gyro))
            newCoordinateY =(distance * math.sin(gyro))
            coordinateX = coordinateX + newCoordinateX
            coordinateY = coordinateY + newCoordinateY 
            sendCoordinate(1)
            
#Send information to backend of collisionEvents, pathpoint or map coordinates.
def sendCoordinate(event):
    
    global coordinateX
    global coordinateY

    local_time = time.localtime()
    timeStamp = time.strftime("%Y-%m-%d %H:%M:%S",local_time)

    if(event==0):
        URL = "https://us-central1-intelligentmobilesystemsteam5.cloudfunctions.net/v1/map/currentMap/collisionEvent"
    elif(event==1):
        URL = "https://us-central1-intelligentmobilesystemsteam5.cloudfunctions.net/v1/map/currentMap/pathPoint"
    elif(event==2):
        URL = "https://us-central1-intelligentmobilesystemsteam5.cloudfunctions.net/v1/map"
    payload = {"x":coordinateX, "y":coordinateY, "time": timeStamp}
    respons = requests.post(URL, data= payload)
    print("send")
      
#Movement commands to Arduino
def moveFunk(direction, speed):
    global line
    global startTime
    global endTime

    while(line!="direction"):
        serialRead()

    ser.write(bytes(str(direction)+"\n",'utf-8'))
    ser.write(bytes(str(speed)+"\n",'utf-8'))

#Reading serial data       
def serialRead():
        global line
        global start
        if ser.in_waiting > 0: # check for serial data
            line = ser.readline().decode('utf-8').rstrip() #read data           
            
#start serial and connect to /dev/ttyUSB0
ser = serial.Serial('/dev/ttyUSB0',115200, timeout=1)
ser.flush()

#Check connection between Pi and Arduino is initialized
ser.write(b's')
while(ser.readline().decode('utf-8').rstrip() != 'ok'):
    ser.write(b's') 

#Start thread for lokal API for application communication
thread = Thread(target=apiController)
thread.daemon = True
thread.start()
sendCoordinate(2)

while True:
    #Autonomous mode loop
    if(Mode==1):
     serialRead()

     if line != "line" and line !="usonic" and Mode == 1 and start==0:      #Move forvard
        getCoordinate()
        startTime=time.time() 
        ser.write(b'0')        
        moveFunk(1,speed)
        print("forward")
        start = 1
       
    
     elif line == "usonic" and Mode == 1:                                   #Ultrasonic activation state 
        ultrasonic()   
        print("Usonic")
        right=1
        time.sleep(0.5)
        startTime=time.time()

     elif line == "line" and Mode == 1:                                     #Line activation state
        lineDetect()
        print("line")
        time.sleep(0.5)
        startTime=time.time()
        right=1

     elif(line != "line" and line !="usonic" and Mode == 1 and right==1):   #Turning state
         moveFunk(4,speed)
         getCoordinate()
         time.sleep(0.5)
         startTime=time.time()
         start = 0
         right =0
         print("turn")