import os
import csv
import time
import datetime

from math import floor, cos, sin, pi
from adafruit_rplidar import RPLidar


# Setup the RPLidar
PORT_NAME = '/dev/ttyUSB0'
lidar = RPLidar(None, PORT_NAME, timeout=3)

max_distance = 0
SCAN_BYTE = b'\x20'
SCAN_TYPE = 129
 
 #For now, this sets the points X, and Y.
W = 100
H = 100

#Set Date in Y,M,D format
def date_now():
    today = datetime.datetime.now().strftime("%Y-%m-%d")
    today = str(today)
    return(today)

#Set time in H,M,S format    
def time_now():
    now = datetime.datetime.now().strftime("%H:%M:%S")
    now = str(now)
    return(now)
    
#Processing Raw data to usable data
def process_scan(raw):
    new_scan = bool(raw[0] & 0b1)
    inversed_new_scan = bool((raw[0] >> 1) & 0b1)
    quality = raw[0] >> 2
    if new_scan == inversed_new_scan:
        raise RPLidarException('New scan flags mismatch')
    check_bit = raw[1] & 0b1
    if check_bit !=1:
        raise RPLidarException('Check bit not equal to 1')
    angle = ((raw[1] >> 1) + (raw[2]  << 7)) / 64.
    distance = (raw[3] + (raw[4] << 8)) / 4.
    return new_scan, quality, angle, distance

#Checks for errors and buffer size limits
def lidar_measurments(self, max_buf_meas=500):
    
    lidar.set_pwm(800)
    
    cmd = SCAN_BYTE
    self._send_cmd(cmd)
    dsize, is_single, dtype = self._read_descriptor()
    
    if dsize != 5:
        raise RPLidarException('Wrong info reply lenght')
    if is_single:
        raise RPLidarException('Not a multiple response mode')
    if dtype != SCAN_TYPE:
        raise RPLidarException('Wrong response data type')
    while True:
        raw = self._read_response(dsize)
        self.log_bytes('debug', 'Recived scan response: ', raw)
        if max_buf_meas:
            data_in_buf = self._serial_port.in_waiting
            if data_in_buf > max_buf_meas*dsize:
                self.log('Warning', 'Too many points in the buffer: %d/%d. ' 'Clearing buffer...' % (data_in_buf//dsize, max_buf_meas))
                self._serial_port.read(data_in_buf//dsize*dsize)
        yield _process_scan(raw)

#Collecting data from lidar
def lidar_scans(self, max_buf_meas=500, min_len=5):
    
    scan = []
    iterator = lidar_measurments(lidar,max_buf_meas)
    for new_scan, quality, angle, distance in iterator:
        if new_scan:
            if len(scan) > min_len:
                yield scan
            scan = []
        if quality > 0 and distance > 0:
            scan.append((quality, angle, distance))

#Calculating points from data. Writing to CVS file and Cmd-window    
def process_data(data):
    
    global max_distance
    point = (int(W / 2), int(H / 2))
    for angle in range(360):
        distance = data[angle]
        if distance > 0:
            max_distance = max([min([5000, distance]), max_distance])
            radians = angle * pi / 180.0
            x = distance * cos(radians)
            y = distance * sin(radians)
            point = (int(W/2) + int(x / max_distance * (W/2)), int(H/2) + int(y / max_distance * (H/2)))
    with open('/home/mbot/Documents/sensor_readings.csv',mode='a') as sensor_readings:
        sensor_write = csv.writer(sensor_readings, delimiter=',')
        write_to_log = sensor_write.writerow([date_now(), time_now(), x, y, point])
        print(date_now(), time_now(), x, y, point)
    return (write_to_log)
    
    print(point)


scan_data = [0]*360

try:
#    print(lidar.get_info())
    for scan in lidar.iter_scans():
        for (_, angle, distance) in scan:
            scan_data[min([359, floor(angle)])] = distance
        process_data(scan_data)

except KeyboardInterrupt:
    print('Stopping.')
lidar.stop()
lidar.disconnect()
