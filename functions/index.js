/* eslint-disable require-jsdoc */
/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
const functions = require("firebase-functions");
const firebase = require("firebase-admin");
const firebaseService = require("./permissions.json");

const vision = require("@google-cloud/vision");

firebase.initializeApp({
  credential: firebase.credential.cert(firebaseService),
  storageBucket: "intelligentmobilesystemsteam5.appspot.com",
});

const bucket = firebase.storage().bucket();

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const Jimp = require("jimp");

const db = firebase.firestore();
app.use(bodyParser.json());
app.use(
    express.urlencoded({
      extended: true,
    }),
);

const cors = require("cors");
app.use(cors({origin: true}));

// ----------------Helper functions--------------------

// Returns promises for get functions
const getFunction = function(query) {
  return new Promise( (resolve, reject) => {
    try {
      resolve(query.get());
    } catch (error) {
      reject(error);
    }
  });
};

// Return promises for set functions
const setFunction = function(query, data) {
  return new Promise( (resolve, reject) => {
    try {
      resolve(query.set(data));
    } catch (error) {
      reject(error);
    }
  });
};

// Function to do image classification given the url and update the collisionEvent with the labels
async function imageClassification(destFileName) {
  const client = new vision.ImageAnnotatorClient({
    keyFilename: "./permissions.json",
  });
  const [result] = await client.labelDetection(destFileName);
  const labels = result.labelAnnotations;
  const imageDescriptions = [];
  labels.forEach((label) => imageDescriptions.push(label.description));
  return imageDescriptions;
}

// Downloads a image from the storage to local folder (/images)
async function downloadImage() {
  const fileName = "images/uSonicPic.png";

  const options = {
    destination: "./images/uSonicPic.png",
  };

  bucket.file(fileName).download(options).then(async ()=>{
    const image = await Jimp.read("./images/uSonicPic.png");
    await image.rotate(180);
    await image.resize(250, 250);
    const one = await image.writeAsync("./images/collisionObject.png");
    console.log("1", one);
  }).catch((err)=>{
    console.log("err", err);
  });
}

// Uploads a image to the storage
async function uploadImage() {
  const filePath = "./images/collisionObject.png";

  bucket.upload(filePath, {destination: "/images/collisionObject.png"}).then(() => {
    console.log("Upload success");
  }).catch((err) => {
    console.log("Error uploading to storage", err);
  });
}

// Gets a signed url from the image in the storage
async function getImageUrl() {
  const fileName = "images/uSonicPic.png";
  const options = {
    version: "v4",
    action: "read",
    expires: Date.now() + 604800, // Expiration date (which is maximum 7 days)
  };
  const url = await bucket.file(fileName).getSignedUrl(options);
  return url;
}

// ----------------Map Routes--------------------

// Creates a map object that overrides latest/current map data
app.post("/map", (req, res) => {
  db.collection("maps").doc("currentMap").collection("pathPoints").get().then((querySnapshot)=>{
    querySnapshot.docs.forEach((snapShot)=>{
      snapShot.ref.delete();
    });
    db.collection("maps").doc("currentMap").collection("collisionEvent").get().then((querySnapshot)=>{
      querySnapshot.docs.forEach((snapShot)=>{
        snapShot.ref.delete();
      });
    });
  }).then(()=>{
    return res.status(200).send("successfully creating new map");
  });
});

// Retrieves the latest/current Map Object
app.get("/map/currentMap", async (req, res)=>{
  const collisionEvent = [];
  const pathPoints = [];
  const map = await getFunction(db.collection("maps").orderBy("createdAt", "desc").limit(1));
  const mapId = map.docs[0].id;
  const selectedMap = await getFunction(db.collection("maps").doc(mapId).collection("pathPoints").orderBy("time").limitToLast(500));

  selectedMap.docs.forEach((documentSnapshot) => {
    const x = documentSnapshot.get("x");
    const y = documentSnapshot.get("y");
    const time = documentSnapshot.get("time");
    pathPoints.push({x: x, y: y, time: time});
  });


  const collisionEvents = await getFunction(db.collection("maps").doc(mapId).collection("collisionEvent"));
  collisionEvents.docs.forEach((documentSnapshot) => {
    const id = documentSnapshot.get("id");
    const x = documentSnapshot.get("x");
    const y = documentSnapshot.get("y");
    const time = documentSnapshot.get("time");
    const imagePath = documentSnapshot.get("imagePath");
    const imageDescriptions = documentSnapshot.get("imageDescriptions");
    collisionEvent.push({id: id, x: x, y: y, time: time, imagePath: imagePath, imageDescriptions: imageDescriptions});
  });


  return res.status(200).json({collisionEvent: collisionEvent, pathPoints: pathPoints});
});

// Adds a new pathPoint to a Map object
app.post("/map/currentMap/pathPoint", (req, res)=>{
  const time = req.body.time;
  const x = req.body.x;
  const y = req.body.y;
  db.collection("maps").doc("currentMap").collection("pathPoints").doc().set({
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

// Retrieves all pathPoint of a Map Object
app.get("/map/currentMap/pathPoint", (req, res) => {
  const points = [];
  db.collection("maps").doc("currentMap").collection("pathPoints").orderBy("time").limitToLast(500).get().then((querySnapshot) => {
    querySnapshot.forEach((documentSnapshot) => {
      const x = documentSnapshot.get("x");
      const y = documentSnapshot.get("y");
      points.push({x: x, y: y});
    });
    return res.status(200).send(points);
  })
      .catch((error) => {
        return res.status(200).send("Error reading document: ", error);
      });
});

// Adds a new borderPoint to a Map object
app.post("/map/currentMap/borderPoint", (req, res)=>{
  const docRef = db.collection("maps").doc("currentMap").collection("borderPoint").doc();
  docRef.set({
    "id": docRef.id,
    "x": req.body.x,
    "y": req.body.y,
  }).then(() => {
    return res.status(201).send("Document successfully written!");
  }).catch((err) => {
    return res.status(500).send("Error writing document: ", err);
  });
});

// Retrieves all borderPoint of a Map Object
app.get("/map/currentMap/borderPoint", (req, res)=>{
  const borderPoints = [];
  db.collection("maps").doc("currentMap").collection("borderPoint").get().then((querySnapshot) => {
    querySnapshot.forEach((documentSnapshot) => {
      const id = documentSnapshot.get("id");
      const x = documentSnapshot.get("x");
      const y = documentSnapshot.get("y");
      borderPoints.push({id: id, x: x, y: y});
    });
    return res.status(200).send(borderPoints);
  })
      .catch((error) => {
        return res.status(500).send("Error reading document: ", error);
      });
});

// Adds a new collisionEvent to a Map object
app.post("/map/currentMap/collisionEvent", async (req, res)=>{
  try {
    // Retrieve latest image from the storage
    await getImageUrl().then(async (imageUrl)=>{
      // Send image url to the image classification function and retrieve the labels
      const imageDescriptions = await imageClassification(imageUrl[0]);
      const docRef = db.collection("maps").doc("currentMap").collection("collisionEvent").doc();
      await setFunction( docRef, {
        "id": docRef.id,
        "imageDescriptions": imageDescriptions,
        "imagePath": imageUrl[0],
        "x": req.body.x,
        "y": req.body.y,
        "time": req.body.time,
      });
      return res.status(201).send("Document successfully written!");
    }).catch((err)=>{
      res.status(500).send(err);
    });
  } catch (err) {
    res.status(500).send(err);
  }
});

// Retrieves all collisionEvents of a Map Object
app.get("/map/currentMap/collisionEvent", (req, res)=>{
  const collisionEvents = [];
  db.collection("maps").doc("currentMap").collection("collisionEvent").get().then((querySnapshot) => {
    querySnapshot.forEach((documentSnapshot) => {
      const id = documentSnapshot.get("id");
      const imageDescriptions = documentSnapshot.get("imageDescriptions");
      const imagePath = documentSnapshot.get("imagePath");
      const time = documentSnapshot.get("time");
      const x = documentSnapshot.get("x");
      const y = documentSnapshot.get("y");
      collisionEvents.push({id: id, imageDescriptions: imageDescriptions, imagePath: imagePath, time: time, x: x, y: y});
    });
    return res.status(200).send(collisionEvents);
  })
      .catch((error) => {
        return res.status(500).send("Error reading document: ", error);
      });
});

// Updates the currentLocation of the Mower
app.put("/map/currentMap/currentLocation", (req, res)=>{
  const currentLocation = {
    "x": req.body.x,
    "y": req.body.y,
    "time": req.body.time,
  };
  db.collection("maps").doc("currentMap").update({
    currentLocation,
  }).then(() => {
    return res.status(201).send("Document successfully written!");
  }).catch((err) => {
    return res.status(500).send("Error writing document: ", err);
  });
});

// Retrieves the currentLocation of the Mower
app.get("/map/currentMap/currentLocation", (req, res)=>{
  db.collection("maps").doc("currentMap").get().then((querySnapshot) => {
    const currentLocation = querySnapshot.get("currentLocation");
    return res.status(200).send(currentLocation);
  }).catch((error) => {
    return res.status(500).send("Error reading document: ", error);
  });
});

// ----------------Mower Routes--------------------

// Retrieves a Mower Object
app.get("/mowers/mower", (req, res)=>{
  db.collection("mowers").doc("mower").get().then((querySnapshot) => {
    const mower = {
      isOnline: querySnapshot.get("isOnline"),
      isManual: querySnapshot.get("isManual"),
    };
    return res.status(200).send(mower);
  }).catch((error) => {
    return res.status(200).send("Error reading document: ", error);
  });
});

// Updates a Mower Object
app.put("/mowers/mower", (req, res)=>{
  db.collection("mowers").doc("mower").update({
    isManual: req.body.isManual,
    isOnline: req.body.isOnline,
  }).then(() => {
    return res.status(201).send("Document successfully written!");
  }).catch((err) => {
    return res.status(500).send("Error writing document: ", err);
  });
});

// Retrieves isManual of the mower
app.get("/mowers/mower/getAutoDrive", (req, res)=>{
  db.collection("mowers").doc("mower").get().then((querySnapshot) => {
    const isManual = querySnapshot.get("isManual");
    return res.status(200).send({isManual: isManual});
  }).catch((error) => {
    return res.status(500).send("Error reading document: ", error);
  });
});

// Edits isManual of the mower
app.put("/mowers/mower/editAutoDrive", (req, res)=>{
  db.collection("mowers").doc("mower").update({
    isManual: req.body.isManual,
  }).then(()=> {
    return res.status(201).send("Document successfully written!");
  }).catch((error) => {
    return res.status(500).send("Error reading document: ", error);
  });
});
exports.v1 = functions.https.onRequest(app);
