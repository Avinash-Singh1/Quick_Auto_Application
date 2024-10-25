const express= require('express');
const axios = require('axios');
const cors = require('cors');
const dotenv= require('dotenv');
const cookieParser= require("cookie-parser");
const bodyParser = require("body-parser");
const path = require("path");
dotenv.config();
const app = express();
app.use(cors());

const userRouter= require("./users/user.router");

app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.static(path.join(path.resolve(), "Quickauto")));


// app.use("/api/users",userRouter);
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

// Directions API Route
app.get('/api/directions', async (req, res) => {
  const { source, destination } = req.query;

  if (!source || !destination) {
    return res.status(400).send('Source and Destination are required');
  }

  try {
    const directionsUrl = `https://maps.gomaps.pro/maps/api/directions/json?origin=${source}&destination=${destination}&key=${GOOGLE_MAPS_API_KEY}`;
    const response = await axios.get(directionsUrl);

    const directions = response.data;

    if (directions.status === "ZERO_RESULTS") {
      return res.status(404).send('No route found');
    }

    return res.json(directions);
  } catch (error) {
    return res.status(500).send('Error fetching directions');
  }
});

// Autocomplete API Route
app.get('/api/autocomplete', async (req, res) => {
  const { input } = req.query;

  if (!input) {
    return res.status(400).send('Input is required');
  }

  try {
    const autocompleteUrl = `https://maps.gomaps.pro/maps/api/place/queryautocomplete/json?input=${encodeURIComponent(input)}&key=${GOOGLE_MAPS_API_KEY}`;
    const response = await axios.get(autocompleteUrl);
    
    // Send the predictions back to the client
    return res.json(response.data);
  } catch (error) {
    console.error('Error fetching autocomplete suggestions:', error);
    return res.status(500).send('Error fetching autocomplete suggestions');
  }
});

app.use("/api/users",userRouter);
app.get('*', (req, res) => {
  res.sendFile(path.join(path.resolve(), 'Quickauto', 'index.html'));
});

app.listen(process.env.APP_PORT,()=>{
    console.log(`Server is running on port  ${process.env.APP_PORT}`);
})