import express from "express";
import axios from "axios";
import yaml from "js-yaml";
import swaggerUi from "swagger-ui-express";
import fs from "fs";

const app = express();

const port = 3000;

try {
  const swaggerDoc = yaml.load(fs.readFileSync("./swagger.yaml", "utf8"));

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));

  console.log("Swagger UI is up and running at /api-docs");
} catch (error) {
  console.error(`failed to read swagger.yaml file`, error);
}

const validateCityQuery = (req, res, next) => {
  if (!req.query.city || req.query.city.length < 1) {
    return res.status(400).json({
      error: "Bad request, Please provide a city in the query parameter",
    });
  }
  next();
};

app.get("/crimes", async (req, res) => {
  try {
    const response = await axios.get(
      "https://brottsplatskartan.se/api/events/?location=helsingborg&limit=5"
    );
    const crimes = response.data.data;

    res.status(200).json(crimes);
  } catch (error) {
    console.error(`Error fetching crime data ${error.message || error}`);
    res.status(500).json({
      error: "Internal server error. Could not fetch crime data.",
    });
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
    console.error(`Error fetching crime data ${error.message || error}`);
    res.status(500).json({
      error: "Internal server error. Could not fetch crime data.",
    });
  }
});

app.get("/crimes/search", validateCityQuery, async (req, res) => {
  try {
    const city = req.query.city;

    const response = await axios.get(
      `https://brottsplatskartan.se/api/events/?location=${city}&limit=5`
    );

    const crimes = response.data.data;

    if (crimes.length < 1) {
      return res
        .status(404)
        .json({ error: `No crime data found for city: '${city}'` });
    }

    res.status(200).json(crimes);
  } catch (error) {
    console.error(`Error fetching crime data ${error.message || error}`);
    res.status(500).json({
      error: "Internal server error. Could not fetch crime data.",
    });
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
    console.error(`Error fetching crime data ${error.message || error}`);
    res.status(500).json({
      error: "Internal server error. Could not fetch crime data.",
    });
  }
});

app.listen(port, () => {
  console.log(`Server is up and running on port ${port}`);
});
