import express from "express";
import cors from "cors";
import cookePerser from "cookie-parser";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
import noRouteError from "./app/middleware/noRoute";
import router from "./app/routes";
import http from "http";

const corsOption = {
  origin: [
    "http://localhost:3000",
    "http://192.168.10.32:5174",
    "http://localhost:5173",
    "http://192.168.10.18:3500",
    "http://192.168.10.206:5173",
    "https://zen-active-admin.vercel.app",
    "http://82.25.85.126:4173",
    "http://192.168.10.18:4173",
    "http://10.10.12.62:4173",
    "http://10.10.12.59:4173",
    "http://192.168.50.85:4173",
    "https://zen-active-dashboard-iota.vercel.app",
  ],
  credentials: true,

  methods: ["GET", "PATCH", "POST", "DELETE", "PUT"],
};

const app = express();

app.use(cors(corsOption));
app.use(cookePerser());
app.use(express.static("uploads"));
app.use(express.urlencoded({ extended: true }));

app.use(express.json());
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use("/api", router);

app.use(globalErrorHandler);
app.use(noRouteError);
const server = http.createServer(app);

export { app, server };
