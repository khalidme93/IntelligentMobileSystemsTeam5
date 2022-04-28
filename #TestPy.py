#TestPy
import requests


print("iam here1111")

def addPoints(x:int, y:int, time:int):
    print("iam here1")
    url= "https://us-central1-intelligentmobilesystemsteam5.cloudfunctions.net/v1/addData"
    payload= {"x":x, "y":y ,"time":time}
    print(payload)
    headers = {
    'Content-Type': 'application/x-www-form-urlencoded'
    }
    response = requests.post(url, headers=headers, data=payload)
    print("Status Code", response.status_code)
    print("JSON Response ", response.json())

addPoints(1993,1993,1993)

