import cookieParser from "cookie-parser";
import Routes from "./routes/user-routes.js";
import express from "express";
import helmet from "helmet";
let app = express();
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));
import cors from "cors";

// Use CORS middleware
app.use(
  cors({
    origin: "https://reactblogapp-2r9t.onrender.com",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    // Allowed HTTP methods
    credentials: true, // Allows cookies and credentials to be sent
  })
);

app.use("/", Routes);

app.use((req, res) => {
  res.send({
    status: 404,
    errorMessage: `Cannot GET ${req.url}`,
  });
});

let PORT = process.env.PORT || 5000;
let host = "0.0.0.0"; // make public

app.listen(PORT, host, () => {
  console.log("server is running at " + "localhost:" + PORT);
});
