const express = require("express");
const http = require("http");
const dotenv = require("dotenv");
const path = require("path");
const expressStaticGzip = require("express-static-gzip");
const morgan = require("morgan");

const config = dotenv.config();

if (!config) throw new Error("Could not find .env file");

function serve() {
  const app = express();

  app.use(morgan(process.env.MORGAN_LOG_LEVEL));

  app.use(
    expressStaticGzip(process.env.PATH_TO_PUBLIC_FOLDER, {
      enableBrotli: true,
      orderPreference: ["br"]
    })
  );

  app.use("*", (req, res) =>
    res.sendFile(
      path.resolve(`${process.env.PATH_TO_PUBLIC_FOLDER}/index.html`)
    )
  );

  const server = http.createServer(app);

  server.on("error", error => {
    console.log("SERVER_ERROR:", error);

    throw error;
  });

  server.listen(process.env.SERVER_PORT, () => {
    console.log("SERVER_STARTED", server.address());
  });
}

serve();
