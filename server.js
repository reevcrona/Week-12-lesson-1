import express from "express";
import axios from "axios";
import yaml from "js-yaml";
import swaggerUi from "swagger-ui-express";

const app = express();

const port = 3000;

app.listen(port, () => {
  console.log(`Server is up and running on port ${port}`);
});
