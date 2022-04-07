#include <Arduino.h>
#include <Wire.h>
#include <SoftwareSerial.h>
#include <MeAuriga.h>
#include <time.h>

MeRGBLed rgbled_0(0, 12);
MeEncoderOnBoard Encoder_1(SLOT1);
MeEncoderOnBoard Encoder_2(SLOT2);
MeLineFollower linefollower_9(9);
MeUltrasonicSensor ultrasonic_10(10);
MeLightSensor lightsensor_12(12);

// PWM encoders 1 and 2 for motor 1 and 2
void isr_process_encoder1(void)
{
  if(digitalRead(Encoder_1.getPortB()) == 0){
    Encoder_1.pulsePosMinus();
  }else{
    Encoder_1.pulsePosPlus();
  }
}
void isr_process_encoder2(void)
{
  if(digitalRead(Encoder_2.getPortB()) == 0){
    Encoder_2.pulsePosMinus();
  }else{
    Encoder_2.pulsePosPlus();
  }
}
//Move function
void move(int direction, int speed)
{
  int leftSpeed = 0;
  int rightSpeed = 0;
  if(direction == 1){
    leftSpeed = -speed;
    rightSpeed = speed;
  }else if(direction == 2){
    leftSpeed = speed;
    rightSpeed = -speed;
  }else if(direction == 3){
    leftSpeed = -speed;
    rightSpeed = -speed;
  }else if(direction == 4){
    leftSpeed = speed;
    rightSpeed = speed;
  }
  Encoder_1.setTarPWM(leftSpeed);
  Encoder_2.setTarPWM(rightSpeed);
}

// small delay
void _delay(float seconds) {
  if(seconds < 0.0){
    seconds = 0.0;
  }
  long endTime = millis() + seconds * 1000;
  while(millis() < endTime) _loop();
}
// Serial
void sendSerial(int From){
  
  if(From==1){
    Serial.print(1);
    Serial.flush();
  }

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
  randomSeed((unsigned long)(lightsensor_12.read() * 123456));
  Serial.begin(9600);
  _delay(1);
  while(1) {

      rgbled_0.setColor(0,21,0,181);
      rgbled_0.show();

      move(1, 35 / 100.0 * 255);
      // Line sensor not detecting 
      if((0?(0==0?linefollower_9.readSensors()==0:(linefollower_9.readSensors() & 0)==0):(0==0?linefollower_9.readSensors()==3:(linefollower_9.readSensors() & 0)==0))){

          // Drives forward
          move(1, 35 / 100.0 * 255);

          rgbled_0.setColor(0,21,0,181);
          rgbled_0.show();

      }else{
          // If black line in detectes on left or right sensor
          if(((0?(2==0?linefollower_9.readSensors()==0:(linefollower_9.readSensors() & 2)==2):(2==0?linefollower_9.readSensors()==3:(linefollower_9.readSensors() & 2)==0)))||((0?(1==0?linefollower_9.readSensors()==0:(linefollower_9.readSensors() & 1)==1):(1==0?linefollower_9.readSensors()==3:(linefollower_9.readSensors() & 1)==0)))){

              rgbled_0.setColor(0,255,0,0);
              rgbled_0.show();
              while(((0?(2==0?linefollower_9.readSensors()==0:(linefollower_9.readSensors() & 2)==2):(2==0?linefollower_9.readSensors()==3:(linefollower_9.readSensors() & 2)==0)))||((0?(1==0?linefollower_9.readSensors()==0:(linefollower_9.readSensors() & 1)==1):(1==0?linefollower_9.readSensors()==3:(linefollower_9.readSensors() & 1)==0)))){
                move(2, 35 / 100.0 * 255);
                  _delay(random(1, 2 +1));
                  move(2, 0);
                  if(random(1, 10 +1) > 5){

                    rgbled_0.setColor(7,50,255,0);
                    rgbled_0.show();

                    rgbled_0.setColor(8,42,255,0);
                    rgbled_0.show();

                    rgbled_0.setColor(9,42,255,0);
                    rgbled_0.show();

                    rgbled_0.setColor(3,50,255,0);
                    rgbled_0.show();

                    rgbled_0.setColor(4,42,255,0);
                    rgbled_0.show();

                    rgbled_0.setColor(5,42,255,0);
                    rgbled_0.show();

                    rgbled_0.setColor(6,42,255,0);
                    rgbled_0.show();

                    move(4, 30 / 100.0 * 255);
                    _delay(random(1, 2 +1));
                    move(4, 0);
                }else{
                    rgbled_0.setColor(1,42,255,0);
                    rgbled_0.show();

                    rgbled_0.setColor(2,38,255,0);
                    rgbled_0.show();

                    rgbled_0.setColor(3,42,255,0);
                    rgbled_0.show();

                    rgbled_0.setColor(9,38,255,0);
                    rgbled_0.show();

                    rgbled_0.setColor(10,50,255,0);
                    rgbled_0.show();

                    rgbled_0.setColor(11,50,255,0);
                    rgbled_0.show();

                    rgbled_0.setColor(12,42,255,0);
                    rgbled_0.show();

                    move(3, 30 / 100.0 * 255);
                    _delay(random(1, 2 +1));
                    move(3, 0);
                }
              }
            }
      }
      if(ultrasonic_10.distanceCm() < 20){
          rgbled_0.setColor(0,255,0,0);
          rgbled_0.show();
          
          sendSerial(1);
          
          Encoder_1.setTarPWM(0);
          Encoder_2.setTarPWM(0);
          _delay(4);
          
          move(2, 30 / 100.0 * 255);
          _delay(1);
          move(2, 0);
          if(random(1, 10 +1) > 5){
               rgbled_0.setColor(7,50,255,0);
                    rgbled_0.show();

                    rgbled_0.setColor(8,42,255,0);
                    rgbled_0.show();

                    rgbled_0.setColor(9,42,255,0);
                    rgbled_0.show();

                    rgbled_0.setColor(3,50,255,0);
                    rgbled_0.show();

                    rgbled_0.setColor(4,42,255,0);
                    rgbled_0.show();

                    rgbled_0.setColor(5,42,255,0);
                    rgbled_0.show();

                    rgbled_0.setColor(6,42,255,0);
                    rgbled_0.show();
              move(4, 30 / 100.0 * 255);
              _delay(random(1, 2 +1));
              move(4, 0);
          }else{
              rgbled_0.setColor(1,42,255,0);
                    rgbled_0.show();

                    rgbled_0.setColor(2,38,255,0);
                    rgbled_0.show();

                    rgbled_0.setColor(3,42,255,0);
                    rgbled_0.show();

                    rgbled_0.setColor(9,38,255,0);
                    rgbled_0.show();

                    rgbled_0.setColor(10,50,255,0);
                    rgbled_0.show();

                    rgbled_0.setColor(11,50,255,0);
                    rgbled_0.show();

                    rgbled_0.setColor(12,42,255,0);
                    rgbled_0.show();
              move(3, 30 / 100.0 * 255);
              _delay(random(1, 2 +1));
              move(3, 0);
          }
      }
      _loop();
  }
}
void _loop() {
  Encoder_1.loop();
  Encoder_2.loop();
}

void loop() {
  _loop();
}
