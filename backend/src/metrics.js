import client from "prom-client";

// collect default metrics like CPU, memory, event loop lag
client.collectDefaultMetrics();

export const httpRequestDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests",
  labelNames: ["method", "route", "status"]
});
