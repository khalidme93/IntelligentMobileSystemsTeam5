/* eslint-disable require-jsdoc */
/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
const functions = require("firebase-functions");
const firebase = require("firebase-admin");
const firebaseService = require("./permissions.json");
const firebaseConfig = require("./real-time-db.js");
const vision = require("@google-cloud/vision");
const Jimp = require("jimp");

const storageBucket = "intelligentmobilesystemsteam5.appspot.com";

firebase.initializeApp({
  credential: firebase.credential.cert(firebaseService),
  storageBucket: storageBucket,
});

const getFunction = function(query) {
  return new Promise( (resolve, reject) => {
    try {
      resolve(query.get());
    } catch (error) {
      reject(error);
    }
  });
};


const addFunction = function(query, data) {
  return new Promise( (resolve, reject) => {
    try {
      resolve(query.add(data));
    } catch (error) {
      reject(error);
    }
  });
};

const bucket = firebase.storage().bucket();

const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const db = firebase.firestore();
app.use(bodyParser.json());
app.use(
    express.urlencoded({
      extended: true,
    }),
);

const cors = require("cors");
const { response } = require("express");
app.use(cors({origin: true}));


app.get("/backendAPI", (req, res) => {
  return res.status(200).send("hello bitches ");
});

// Sends back the image classification labes of the picture
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

async function downloadImage(){
  const fileName = "images/uSonicPic.png";
  
  const options = {
    destination: "./images/uSonicPic.png"
  }
  
  bucket.file(fileName).download(options).then(async ()=>{

    const image = await Jimp.read("./images/uSonicPic.png");
    await image.rotate(180);
    await image.resize(250, 250);
    await image.writeAsync("./images/collisionObject.png");
  }).catch((err)=>{
    console.log("err", err);
  });
}

async function uploadImage(){
  const filePath = "./images/collisionObject.png";

  bucket.upload(filePath, {destination: "/images/collisionObject.png"}).then(() => {
    console.log("Upload success");
  }).catch((err) => {
    console.log("Error uploading to storage", err);
  });
}

async function getImageUrl(){
  const fileName = "images/collisionObject.png";
  const fileName2 = "cat.jpg";

  const options = {
    version: "v4",
    action: "read",
    expires: Date.now() + 604800, // Expiration date (which is maximum 7 days)
  };
  const url = await bucket.file(fileName).getSignedUrl(options);
  return url;
}


app.post("/addData", (req, res)=>{
  const time = req.body.time;
  const x = req.body.x;
  const y = req.body.y;

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

// Adds a new borderPoint to a Map Object
app.post("/map/currentMap/borderPoint", (req, res)=>{
  db.collection("maps").doc("currentMap").collection("borderPoint").add({
    "id": req.body.id,
    "x": req.body.x,
    "y": req.body.y,
  }).then(() => {
    return res.status(201).send("Document successfully written!");
  }).catch((err) => {
    return res.status(500).send("Error writing document: ", err);
  });
});

// Retrieves all borderPoints of a Map Object
app.get("/map/currentMap/borderPoint", (req, res)=>{
  const collisionEvents = [];
  db.collection("maps").doc("currentMap").collection("borderPoint").get().then((querySnapshot) => {
    querySnapshot.forEach((documentSnapshot) => {
      const id = documentSnapshot.get("id");
      const x = documentSnapshot.get("x");
      const y = documentSnapshot.get("y");
      collisionEvents.push({id: id, x: x, y: y});
    });
    return res.status(200).send(collisionEvents);
  })
      .catch((error) => {
        return res.status(500).send("Error reading document: ", error);
      });
});

// Adds a new collisionEvent to a Map Object
app.post("/map/currentMap/collisionEvent", async (req, res)=>{
  try {
    await downloadImage();
    await uploadImage();
    // Retrieve latest image from the storage
    const imageUrl = await getImageUrl();

    // Send image url to the image classification function and retrieve the labels
    const imageDescriptions = await imageClassification(imageUrl[0]);

    await addFunction(db.collection("maps").doc("currentMap").collection("collisionEvent"), {
      "id": req.body.id,
      "imageDescriptions": imageDescriptions,
      "imagePath": imageUrl[0],
      "x": req.body.x,
      "y": req.body.y,
      "time": req.body.time,
    });
    return res.status(201).send("Document successfully written!");
  } catch(error) {
    console.error(error)
    res.status(500).send(error);
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
    "id": req.body.id,
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

// ---------------Mower---------------

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

app.post("/startAutoDriving", (req, res) => {
  const isManual = req.body.isManual;

  db.collection("mower").doc("mower").update({
    isManual: isManual,
  }).then(() => {
    return res.status(201).send("Document successfully written!");
  }).catch((error) => {
    return res.status(200).send("Error writing document: ", error);
  });
});


app.get("/getMowerState", (req, res) => {
  const status = [];
  db.collection("mowers").doc("mower").get().then((querySnapshot) => {
    const isManual = querySnapshot.get("isManual");
    const isOnline = querySnapshot.get("isOnline");
    const currentMapId = querySnapshot.get("currentMapId");
    const mowerName = querySnapshot.get("mowerName");
    status.push({isManual: isManual, isOnline: isOnline, currentMapId: currentMapId, mowerName: mowerName});
  }).then(() => {
    return res.status(200).send("Document successfully written!", status);
  }).catch((error) => {
    return res.status(500).send("Error writing document: ", error);
  });
});

app.post("/addMowerStatus", (req, res) => {
  const isManual = req.body.isManual;
  const isOnline = req.body.isOnline;
  const mowerName = req.body.mowerName;
  const currentMapId = req.body.currentMapId;
  console.log(isManual, isOnline, mowerName, currentMapId);
 db.collection("mowers").doc("mower").update({
    isManual: isManual,
    isOnline: isOnline,
    mowerName: mowerName,
    currentMapId: currentMapId,
  }).then(() => {
    return res.status(200).send("Document successfully written!");
  }).catch((error) => {
    return res.status(500).send("Error writing document: ", error);
  });
});

exports.v1 = functions.https.onRequest(app);
