/* eslint-disable max-len */
const functions = require("firebase-functions");

const firebase = require("firebase-admin");
const firebaseService = require("./permissions.json");
firebase.initializeApp({
  credential: firebase.credential.cert(firebaseService),
});
const express = require("express");
const app = express();
const db = firebase.firestore();
const cors = require("cors");
app.use(cors({origin: true}));

app.get("/backendAPI", (req, res)=>{
  return res.status(200).send("hello bitches ");
});

app.post("/addData", (req, res)=>{
  db.collection("maps").doc().collection("pathPoints").doc().set({
    time: 2105,
    x: "2",
    y: "2",
  })
      .then(() => {
        return res.status(200).send("Document successfully written!");
      })
      .catch((error) => {
        return res.status(200).send("Error writing document: ");
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


