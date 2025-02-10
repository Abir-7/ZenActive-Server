import express from "express";
import cors from "cors";
import cookePerser from "cookie-parser";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
import noRouteError from "./app/middleware/noRoute";
import router from "./app/routes";
import http from "http";

const corsOption = {
  origin: ["http://localhost:3000", "http://192.168.10.32:5174"],
  credentials: true,
  methods: ["GET", "PATCH", "POST", "DELETE", "PUT"],
};

const app = express();
app.use(express.json());
app.use(cors(corsOption));
app.use(cookePerser());
app.use(express.static("uploads"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use("/api", router);

app.use(globalErrorHandler);
app.use(noRouteError);
const server = http.createServer(app);

export { app, server };
