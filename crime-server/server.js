import express from "express";
import axios from "axios";
import yaml from "js-yaml";
import swaggerUi from "swagger-ui-express";

const app = express();

const port = 3000;

app.get("/crimes", async (req, res) => {
  try {
    const response = await axios.get(
      "https://brottsplatskartan.se/api/events/?location=helsingborg&limit=5"
    );
    const crimes = response.data.data;

    res.status(200).json(crimes);
  } catch (error) {
    console.error(error);
  }
});

app.get("/crimes/locations", async (req, res) => {
  try {
    const response = await axios.get(
      "https://brottsplatskartan.se/api/events/?location=helsingborg&limit=5"
    );

    const headlineData = {
      Headlines: response.data.data.map((crime) => crime.headline),
    };

    res.status(200).json(headlineData);
  } catch (error) {
    console.error(error);
  }
});

app.get("/crimes/search", async (req, res) => {
  try {
    const city = req.query.city;

    const response = await axios.get(
      `https://brottsplatskartan.se/api/events/?location=${city}&limit=5`
    );

    const crimes = response.data.data;

    res.status(200).json(crimes);
  } catch (error) {
    console.error(error);
  }
});

app.get("/crimes/latest", async (req, res) => {
  try {
    const response = await axios.get(
      `https://brottsplatskartan.se/api/events/?location=helsingborg&limit=1`
    );

    const latestCrime = response.data.data[0];

    res.status(200).json(latestCrime);
  } catch (error) {
    console.error(error);
  }
});

app.listen(port, () => {
  console.log(`Server is up and running on port ${port}`);
});
