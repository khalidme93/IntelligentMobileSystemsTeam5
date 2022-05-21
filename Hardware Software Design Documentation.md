# Hardware Software Design Documentation

Intelligent mobile systems

This document provides a description of the different components created and used for the mower.

#### Requirements:

1. The Mower shall be capable of running autonomously within a confined area.

2. The Mower shall be able to avoid collisions objects during autonomous operation.

3. The Mower shall be able to accept and execute drive commands given by a remote device.

4. The Mower shall use a camera and send images to the backend REST API when collision avoidance occurs. 

#### Hardware overview:

A Makeblock mbot ranger with optical encoder motors, ultrasonic sensor, line follow sensor and a custom Arduino Mega 2560 is used in this project, offering greater integration to the Makeblock ecosystem. However, it limits third party integration. The Arduino is used as a slave and is fully controlled over serial communication. The brain of the operation is a Raspberry Pi 4 running Raspberry Pi OS (Debian). Offering fast built in Wi-Fi and a dedicated camera. 

## Arduino

#### void decideMode()

To ensure the Arduino is connected to the host machine an “**s**” for start is required to start the driving program. “**ok”** is sent back to host as confirmation and “direction” is the sent to tell the host driving information is ready to be received.

```c++
void decideMode() {
  while (Serial.available() == 0) {}
  char modeInput = Serial.read();
  if (modeInput == 's') {
    Serial.println("ok");
    Serial.println("direction");
    moveState = readDirection;
  }
}
```

The Arduino uses a state machine to switch between states containing movement, speed and move commands. Seen below the first state readDirection. Checking of a new command has been sent over serial. Expected valid inputs range from 1 to 5 in byte format. 1 – 4 corresponds to direction and 5 sends gyro information for coordinate calculations. If none of the previous mentioned inputs are given. The **direction** information is asked for again.

Case **readSpeed** awaits the speed setting. Due to Serial communication constraints a value from 0 – 9 is expected. shown in an later part. When speed is set, the next state is set to run.

Case **trueBeliver** calls the **move()** function using both variables collected in the previous states. When **move()** is done, the value “**direction”** is sent back to inform that new direction information can be received.

```c++
    switch (moveState) {
      case readDirection:
        if (Serial.available() > 0) {
          direction = Serial.read();
          if (direction == '0') {
            flag = 0;
          }
          else if (isDigit(direction)) {
            moveState = readSpeed;
            if (direction == '1') {
              motion = 1;
              dirLights(motion);
            }
            else if (direction == '2') {
              motion = 2;
              dirLights(motion);
            }
            else if (direction == '3') {
              motion = 3;
              dirLights(motion);
            }
            else if (direction == '4') {
              motion = 4;
              dirLights(motion);
            }
            //send coordinate points
            else if (direction == '5') {
              moveState = readDirection;
              Serial.println("coordinates");
              Serial.println(curX);
              Serial.println("direction");
            }
          }
          else {
            Serial.println("direction");
          }
        }
        break;
      case readSpeed:
        if (Serial.available() > 0) {
          speed = Serial.read();
          if (isDigit(speed)) {
            moveState = trueBeliever;
          }
        }
        break;
      case trueBeliever:
        move(motion, speedControl(speed));
        moveState = readDirection;
        Serial.println("direction");
        break;

      default:
        break;
```

#### int speedControl(char sped)

Mentioned earlier the speed is set by a value from 0-9. These values corresponds to 10 predetermined speeds. 

```c++
int speedControl(char sped) {
  int num = 0;
  if (sped == '0') {
    num = 0;
  }
  else if (sped == '1') {
    num = 51;
  }
  else if (sped == '2') {
    num = 76;
  }
  else if (sped == '3') {
    num = 102;
  }
  else if (sped == '4') {
    num = 127;
  }
  else if (sped == '5') {
    num = 153;
  }
  else if (sped == '6') {
    num = 178;
  }
  else if (sped == '7') {
    num = 204;
  }
  else if (sped == '8') {
    num = 229;
  }
  else if (sped == '9') {
    num = 255;
  }
  return num;
}
```

#### void dirLights(int motion)

Each **if** corresponding to movement sets a global value **motion** used in **dirLights(motion).** Function sets color of an LED in top of the robot, giving a visual indication of movement input and direction. 

```c++
void dirLights(int motion) {
  rgbled_0.setColor(1, 0, 0, 0);
  rgbled_0.show();
  if (motion == 1) {
    rgbled_0.setColor(1, 255, 0, 0);
    rgbled_0.show();
  } else if (motion == 2) {
    rgbled_0.setColor(1, 0, 255, 0);
    rgbled_0.show();
  } else if (motion == 3) {
    rgbled_0.setColor(1, 0, 0, 255);
    rgbled_0.show();
  } else if (motion == 4) {
    rgbled_0.setColor(1, 155, 155, 155);
    rgbled_0.show();
  } else {
    rgbled_0.setColor(1, 0, 0, 0);
    rgbled_0.show();
  }
}
```

#### bool ultrasonicCheck(), lineFollowCheck()

To fulfill requirement 1 and 2, the robot uses two sensors. Seen bellow are two conditions for the sensors. **ultrasonicCheck()** and **lineFollowCheck()** are bool function returning true if a sensor is triggered. Sending “usonic” or “line” to the Raspberry PI and then “direction” to get stop instruction. 

```c++

    if (ultrasonicCheck() == true && flag == 0) {
      flag = 1;
      moveState = readDirection;
      Serial.println("usonic");
      Serial.println("direction");
    }
    if (lineFollowCheck() == true && flag == 0 ) {
      flag = 1;
      moveState = readDirection;
      Serial.println("line");
      Serial.println("direction");
    }
/*#################################################################################################*/
bool ultrasonicCheck() {
  if (ultrasonic_10.distanceCm() < 20) {
    return true;
  } else {
    return false;
  }
}
bool lineFollowCheck() {
  if (((0 ? (2 == 0 ? linefollower_9.readSensors() == 0 : (linefollower_9.readSensors() & 2) == 2) : (2 == 0 ? linefollower_9.readSensors() == 3 : (linefollower_9.readSensors() & 2) == 0))) || ((0 ? (1 == 0 ? linefollower_9.readSensors() == 0 : (linefollower_9.readSensors() & 1) == 1) : (1 == 0 ? linefollower_9.readSensors() == 3 : (linefollower_9.readSensors() & 1) == 0)))) {
    return true;
  } else {
    return false;
  }
}
```

In the **_loop()** the gyro updates values, overloads to a variable and run both encoders for the motors. **_loop()** runs continually as a loop. 

```c++
//updating gyro readings, overloading gyro readings
void _loop() {
  gyro_0.update();
  curX = gyro_0.getAngle(1);
  Encoder_1.loop();
  Encoder_2.loop();
}
void loop() {
  _loop();
}
```

## Raspberry Pi 4

The RPI (Raspberry Pi 4) controls all movement and communication from backend, application and Arduino.

#### Communication Application and Backend

The RPI uses Wi-Fi and a local API to receive movement requests and return status of operations. This is done by running a separate thread able to run independently from the main program. Satisfying requirement 3.

```python
thread = Thread(target=apiController)
thread.daemon = True
thread.start()
```

#### SetSpeed(Resource), AutoMode(Resource), Move(Resource), StopMoving(Resource), apiController()

The API can receive drive modes Autonomous or Manual. Direction of movement and speed. Although the Autonomous program is not run by the API, speed can still be changed regardless of drive mode. 

```python

#Sett mower speed with API
class SetSpeed(Resource):
    def post(self):
        global speed
        global start
        speed= request.json['speed']
        start = 0
        return {}, 200
    pass
#Change mower state with API
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
#Move mower with API
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
#Stopp mower with API
class StopMoving(Resource):
    def post(self):
        ser.write(bytes(str(1)+"\n",'utf-8'))
        ser.write(bytes(str(0)+"\n",'utf-8'))
        return {}, 200
#API resorce
api.add_resource(Move, '/Move')
api.add_resource(StopMoving, '/StopMoving')
api.add_resource(AutoMode, '/AutoMode')
api.add_resource(SetSpeed, '/SetSpeed')
api.add_resource(GetStatus, '/GetStatus')

#API start
def apiController():
    if __name__ == '__main__':
      app.run(host='0.0.0.0', port=5000)
```

#### GetStatus(Resource)

The API also returns status to the application. Whether the the mower is running Autonomously or not. 

```python
class GetStatus(Resource):
    def get(self):
        global Mode
        return {"mode": Mode}, 200
    pass
```

#### sendCoordinate(event)

In Autonomous mode per requirement 4, the robot shall document collision event. This is done by taking a picture of the object and sending to the backend. This function is also used for sending coordinates for movement map drawing.

```python
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
```

#### getCoordinate()

Coordinate data is calculated using timestamps taken when direction changes and gyro angles. Giving a good estimate of how the robot is moving. The gyro from our testing always returns a start value of a few degrees plus or minus and not zero. Therefore, the first value is used as an offset to correct this start value drift.  

```python
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
```



## Driving instructions and communication with Arduino

#### moveFunk(direction, speed)

The RPI sends movement instructions to the Arduino. Using serial communication. To ensure the right information is sent or is ready to receive. The RPI only sends information if the Arduino has communicated that it's ready. Seen below is an example of this. No new movement instructions are sent if not asked for. 

```python
def moveFunk(direction, speed):
    global line
    global startTime
    global endTime
    while(line!="direction"):
        serialRead()
    ser.write(bytes(str(direction)+"\n",'utf-8'))
    ser.write(bytes(str(speed)+"\n",'utf-8'))
```

The RPI side setup and initial handshake noted in the first part of "Arduino". 

```python
ser = serial.Serial('/dev/ttyUSB0',115200, timeout=1) #start serial and connect to /dev/ttyUSB0
ser.flush()
ser.write(b's') #Check connection between Pi and Arduino is initialized
while(ser.readline().decode('utf-8').rstrip() != 'ok'):
    ser.write(b's') 
```

#### serialRead()

**SerialRead()** is called every time RPI expects to receive  data.

```python
def serialRead():
        global line
        global start
        if ser.in_waiting > 0: # check for serial data
            line = ser.readline().decode('utf-8').rstrip() #read data 
```

When mower is driving in Autonomous mode this **while** loop checks if any event has happened and what to do in that situation.

```python
#Autonomous mode loop
while True:
    if(Mode==1):
     serialRead()
     if line != "line" and line !="usonic" and Mode == 1 and start==0:   #Move forvard
        getCoordinate()
        startTime=time.time() 
        ser.write(b'0')        
        moveFunk(1,speed)
        print("forward")
        start = 1
     elif line == "usonic" and Mode == 1:                                #collision activation state 
        ultrasonic()   
        print("Usonic")
        right=1
        time.sleep(0.5)
        startTime=time.time()
     elif line == "line" and Mode == 1:                                  #Line activation state
        lineDetect()
        print("line")
        time.sleep(0.5)
        startTime=time.time()
        right=1
     elif(line != "line" and line !="usonic" and Mode == 1 and right==1): #Turning state
         moveFunk(4,speed)
         getCoordinate()
         time.sleep(0.5)
         startTime=time.time()
         start = 0
         right =0
         print("turn")
```

#### ultrasonic()

In the case of a collision event the **ultrasonic()** function is called giving instructions on how to move and calls for sending of picture and coordinate.

```python
def ultrasonic():
        moveFunk(1,0)
        getCoordinate()
        takePicture()
        sendCoordinate(0)
        moveFunk(2,speed)
```

#### lineDetect()

In the case a black line has been crossed, the line state calls **lineDetect()** function giving instructions on how to move and calls for retrieving coordinates.

```python
def lineDetect():
        moveFunk(1,0)
        getCoordinate()
        moveFunk(2,speed)
```

#### takePicture()

In a case where a picture is needed the **takePicture()** function is called.

```python
def takePicture():
    global printPicture
    camera = PiCamera()
    camera.resolution = (1920, 1080) 
    camera.capture(printPicture)
    camera.close()
    sendImage(printPicture)
```

