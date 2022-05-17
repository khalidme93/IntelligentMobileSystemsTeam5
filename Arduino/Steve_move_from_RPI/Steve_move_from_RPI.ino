#include <Arduino.h>
#include <Wire.h>
#include <SoftwareSerial.h>
#include <MeAuriga.h>
#include <Time.h>
#include <Math.h>
#include <DeadReckoner.h>

MeRGBLed rgbled_0(0, 12);
MeEncoderOnBoard Encoder_1(SLOT1);
MeEncoderOnBoard Encoder_2(SLOT2);
MeEncoderOnBoard getCurPos();
MeLineFollower linefollower_9(9);
MeUltrasonicSensor ultrasonic_10(10);
MeLightSensor lightsensor_12(12);

//Measurments for robot
#define RADIUS 20 // Wheel radius in mm
#define LENGTH 140 // Wheel base in mm
#define TICKS_PER_REV 360 //Tick interval for one wheel rotation

// Time intervals
#define POSITION_COMPUTE_INTERVAL 500 //millisec
#define SEND_INTERVAL 1000 // millisec

// num of left and right tick counts on encoder
volatile unsigned int leftTicks, rightTicks;
// Previous times for computing elapsed time
unsigned long prevPositionComputeTime = 0, prevSendTime = 0;
// Previous x and y coordinate
double prevX = 0, prevY = 0;
//Current x and y values from deadReckoner calculations
double curX, curY;
//Left and right angular velocities;
double wl, wr;
// Position angle in radians from x to center of robor
double theta;
// Global variables
char direction;
char speed;
int motion;

//DeadReckoner funktion for data points
DeadReckoner deadReckoner (&leftTicks, &rightTicks, TICKS_PER_REV, RADIUS, LENGTH);

//Delay funktion
void _delay(float seconds)
{
  if (seconds < 0.0)
  {
    seconds = 0.0;
  }
  long endTime = millis() + seconds * 1000;
  while (millis() < endTime)
    _loop();
}
//Fetch and return encoder ticks for motor 1 with * -1 for direction correction.
long getEncoder_1pulse() {
  return -1 * Encoder_1.getPulsePos();
}
//Fetch and return encoder ticks for motor 2
long getEncoder_2pulse() {
  return Encoder_2.getPulsePos();
}
//overloading tick-counts
long tickCount() {
  leftTicks = getEncoder_1pulse();
  rightTicks = getEncoder_2pulse();

}
//Setting movement speed based on incoming speed request
int speedControl(char sped) {
  int num = 0;
  //Serial.println(sped);
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
  //Serial.println(num);
  return num;
}
//Checking if ultrasonic is triggerd
bool ultrasonicCheck() {
  if (ultrasonic_10.distanceCm() < 20) {
    return true;
  } else {
    return false;
  }
}
//Check if linefollow is triggerd
bool lineFollowCheck() {
  if (((0 ? (2 == 0 ? linefollower_9.readSensors() == 0 : (linefollower_9.readSensors() & 2) == 2) : (2 == 0 ? linefollower_9.readSensors() == 3 : (linefollower_9.readSensors() & 2) == 0))) || ((0 ? (1 == 0 ? linefollower_9.readSensors() == 0 : (linefollower_9.readSensors() & 1) == 1) : (1 == 0 ? linefollower_9.readSensors() == 3 : (linefollower_9.readSensors() & 1) == 0)))) {
    return true;
  } else {
    return false;
  }
}
//light control for states
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

enum modeStates {
  noOperationDec,
  readDirection,
  readSpeed,
  trueBeliever
};

modeStates moveState = noOperationDec;

//handshake with RPI communication and input selection
void decideMode() {
  while (Serial.available() == 0) {}

  char modeInput = Serial.read();
  /*if (modeInput != 's') {
    Serial.println(modeInput);
    }*/
  if (modeInput == 's') {
    Serial.println("ok");
    Serial.println("direction");
    moveState = readDirection;
  }
}
//motor encoders
void isr_process_encoder1(void) {

  if (digitalRead(Encoder_1.getPortB()) == 0) {
    Encoder_1.pulsePosMinus();
  }
  else {
    Encoder_1.pulsePosPlus();
  }
}
void isr_process_encoder2(void) {

  if (digitalRead(Encoder_2.getPortB()) == 0) {
    Encoder_2.pulsePosMinus();
  }
  else {
    Encoder_2.pulsePosPlus();
  }
}
//Speed and direction for motor 1 and 2
void move(int direction, int speed) {

  int leftSpeed = 0;
  int rightSpeed = 0;
  if (direction == 1) {

    leftSpeed = -speed;
    rightSpeed = speed;
  }
  else if (direction == 2) {

    leftSpeed = speed;
    rightSpeed = -speed;
  }
  else if (direction == 3) {

    leftSpeed = -speed;
    rightSpeed = -speed;
  }
  else if (direction == 4) {

    leftSpeed = speed;
    rightSpeed = speed;
  }
  Encoder_1.setTarPWM(leftSpeed);
  Encoder_2.setTarPWM(rightSpeed);
}

void setup() {
  rgbled_0.setpin(44);
  rgbled_0.fillPixelsBak(0, 2, 1);
  TCCR1A = _BV(WGM10);
  TCCR1B = _BV(CS11) | _BV(WGM12);
  TCCR2A = _BV(WGM21) | _BV(WGM20);
  TCCR2B = _BV(CS21);
  attachInterrupt(Encoder_1.getIntNum(), isr_process_encoder1, RISING);
  attachInterrupt(Encoder_2.getIntNum(), isr_process_encoder2, RISING);
  Serial.begin(9600);
  decideMode();

  int flag = 0;

  while (1) {
    //movement program for ultrasonic trigger
    if (ultrasonicCheck() == true && flag == 0) {
      flag = 1;
      moveState = readDirection;
      Serial.println("usonic");
      Serial.println("direction");
      //flag = 1;
    }
    //movement program for linefollow trigger
    if (lineFollowCheck() == true && flag == 0 ) {
      flag = 1;
      moveState = readDirection;
      Serial.println("line");
      Serial.println("direction");
      // flag = 1;
    }
    //Cases with movement programs for incoming direction requests
    switch (moveState) {

      case readDirection:
        if (Serial.available() > 0) {
          direction = Serial.read();

          //Serial.println(direction);
          if (direction == '9') {
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
              curX = deadReckoner.getX();
              curY = deadReckoner.getY();

              /*additional datapoints for more accurate datapoints
              wl = deadReckoner.getWl();
              wr = deadReckoner.getWr();
              theta = deadReckoner.getTheta();
              Total distance traveld
              double distance = sqrt(curX * curX + curY * curY);*/
              
              Serial.println("coordinates");
              Serial.println(curX);
              Serial.println(curY);
            }
          }
          else {
            Serial.print(direction);
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
    }
    _loop();
  }
}

void _loop() {

  //Time interval for calculations of position points
  if (millis() - prevPositionComputeTime > POSITION_COMPUTE_INTERVAL) {
    tickCount();
    deadReckoner.computePosition();
    prevPositionComputeTime = millis();
  }

  /*Timed funktion to send coordinate points*/
  
  /*if (millis() - prevSendTime > SEND_INTERVAL) {
    Fetch all calculated information

     Serial.print("Theta :");
      Serial.println(theta);
      Serial.print("Distance :");
      Serial.println(distance);

    prevSendTime = millis();
    Serial.println("direction");*/

  Encoder_1.loop();
  Encoder_2.loop();
}

void loop() {
  _loop();
}
