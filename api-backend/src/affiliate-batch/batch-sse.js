// Server-Sent Events manager for real-time batch status updates
const clients = new Set();

const writeEvent = (res, payload) => {
  res.write(`data: ${JSON.stringify(payload)}\n\n`);
};

export const addClient = (res) => {
  clients.add(res);
  res.on("close", () => clients.delete(res));
};

export const broadcastBatchUpdate = (batchData) => {
  const payload = { type: "batch_update", data: batchData };
  for (const client of clients) {
    try {
      writeEvent(client, payload);
    } catch {
      clients.delete(client);
    }
  }
};

export const broadcastBackofficeBatchUpdate = (batchData) => {
  const payload = { type: "backoffice_batch_update", data: batchData };
  for (const client of clients) {
    try {
      writeEvent(client, payload);
    } catch {
      clients.delete(client);
    }
  }
};

export const sseHandler = async (req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
    "Access-Control-Allow-Origin": "*",
    "X-Accel-Buffering": "no",
  });

  res.write("retry: 5000\n\n");
  writeEvent(res, { type: "connected" });

  addClient(res);

  try {
    const { getActiveBatch } = await import("./batch.repository.js");
    writeEvent(res, { type: "batch_update", data: await getActiveBatch() });
  } catch {
    writeEvent(res, { type: "batch_update_failed" });
  }

  // Keep connection alive with heartbeat every 25s.
  const heartbeat = setInterval(() => {
    try {
      res.write(": heartbeat\n\n");
    } catch {
      clearInterval(heartbeat);
      clients.delete(res);
    }
  }, 25000);

  req.on("close", () => {
    clearInterval(heartbeat);
    clients.delete(res);
  });
};
