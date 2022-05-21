import requests
from firebase_admin import credentials, initialize_app, storage

cred = credentials.Certificate("./intelligentmobilesystemsteam5-021b63f0559e.json")

initialize_app(
    cred, {'storageBucket': 'intelligentmobilesystemsteam5.appspot.com'})

def addPoints(x:int, y:int, time:int):
    url= "https://us-central1-intelligentmobilesystemsteam5.cloudfunctions.net/v1/addData"
    payload= {"x":x, "y":y ,"time":time}
    print(payload)
    headers = {
    'Content-Type': 'application/x-www-form-urlencoded'
    }
    response = requests.post(url, headers=headers, data=payload)

def sendImage(picturename):
    fileName =picturename
    bucket = storage.bucket()
    blob = bucket.blob(fileName)
    blob.upload_from_filename(fileName)

