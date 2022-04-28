/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
const functions = require("firebase-functions");
const firebase = require("firebase-admin");
const firebaseService = require("./permissions.json");

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


app.get("/backendAPI", (req, res)=>{
  return res.status(200).send("hello bitches ");
});

app.post("/addData", (req, res)=>{
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

app.get("/readData", (req, res)=>{
  db.collection("maps").doc("xvgM9e39jWUml02GxRXh").collection("pathPoints").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      return res.status(200).send(doc.data());
    });
  })
      .catch((error) => {
        return res.status(200).send("Error reading document: ", error);
      });
});

exports.v1= functions.https.onRequest(app);


