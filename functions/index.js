/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
const functions = require("firebase-functions");
const firebase = require("firebase-admin");
const firebaseService = require("./permissions.json");
const firebaseConfig = require("./real-time-db.js");


const bucketName = "//intelligentmobilesystemsteam5.appspot.com";


firebase.initializeApp({
  credential: firebase.credential.cert(firebaseService),
  storageBucket: "intelligentmobilesystemsteam5.appspot.com",
});


const bucket = firebase.storage().bucket();

// Uploading images from the specified folder
const imagePath = "./images/dog.jpg";

bucket.upload(imagePath).then(() => {
  console.log("Upload success");
}).catch((err) => {
  console.log("Error uploading to storage", err);
});


const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const db = firebase.firestore();
app.use(bodyParser.json());
app.use(
    express.urlencoded({
      extended: true,
    })
);

const cors = require("cors");
app.use(cors({origin: true}));


app.get("/backendAPI", (req, res) => {
  return res.status(200).send("hello bitches ");
});

app.post("/addData", (req, res) => {
  const time = req.body.time;
  const x = req.body.x;
  const y = req.body.y;
  console.log(time, x, y);

  db.collection("maps").doc("test").collection("pathPoints").doc().set({
    time: time,
    x: x,
    y: y,
  })
      .then(() => {
        return res.status(200).send("Document successfully written!");
      })
      .catch((error) => {
        return res.status(200).send("Error writing document: ", error);
      });
});

app.get("/getAllPoints", (req, res) => {
  const points = [];
  const pathPoints = [];
  db.collection("maps").doc("test").collection("pathPoints").get().then((querySnapshot) => {
    querySnapshot.forEach((documentSnapshot) => {
      const x = documentSnapshot.get("x");
      const y = documentSnapshot.get("y");
      points.push({x: x, y: y});
    });
    pathPoints.push(points);
    return res.status(200).send(pathPoints);
  })
      .catch((error) => {
        return res.status(200).send("Error reading document: ", error);
      });
});

app.post("/createMap", (req, res) => {
  db.collection("maps").doc().set({

  })
      .then(() => {
        return res.status(200).send("Document successfully written!");
      })
      .catch((error) => {
        return res.status(200).send("Error writing document: ", error);
      });
});


app.post("/startAutoDriving", (req, res) => {
  const isManual = req.body.isManual;
  console.log(isManual);

  db.collection("mower").doc("c4nxJEISKMyKVMUy7cIl").update({
    isManual: isManual,
  })
      .then(() => {
        return res.status(200).send("Document successfully written!");
      })
      .catch((error) => {
        return res.status(200).send("Error writing document: ", error);
      });
});


exports.v1 = functions.https.onRequest(app);

