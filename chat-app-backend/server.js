import process, { pid } from "process";
import express from "express";
import { createServer } from "http";
import cors from "cors";
import { Server } from "socket.io";
import cluster from "cluster";
import { setupMaster, setupWorker } from "@socket.io/sticky";
import { createAdapter, setupPrimary } from "@socket.io/cluster-adapter";
import redis from "socket.io-redis";

const app = express();
app.use(cors());

const port = 3500;

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  const httpServer = createServer(app);
  httpServer.listen(3500);

  setupMaster(httpServer, {
    loadBalancingMethod: "round-robin",
  });

  setupPrimary();

  cluster.setupMaster({
    serialization: "advanced",
  });

  for (var i = 0; i < 4; i++) {
    cluster.fork();
  }
  cluster.on("exit", function (worker, code, signal) {
    console.log("worker " + worker.process.pid + " died");
    cluster.fork();
  });
}
if (cluster.isWorker) {
  const httpServer = createServer(app);

  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  io.adapter(redis({ host: "localhost", port: 6379 }));

  io.adapter(createAdapter());

  setupWorker(io);

  console.log(`Worker ${process.pid} started`);

  io.on("connection", (socket) => {
    socket.on("send-client", (data) => {
      socket.emit("send-user", {
        text: `Xin chào bạn nhắn được xử lý tại process ${process.pid}`,
      });
    });
  });

  app.get("/", (req, res) => {
    console.log(`Worker ${process.pid} is running`);
    res.send(`${process.pid}`);
  });
}
