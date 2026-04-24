const listenersBySession = new Map();

const toPayload = (payload = {}) => JSON.stringify(payload);

export const subscribeExamResult = (sessionId, listener) => {
  const key = String(sessionId || "").trim();
  if (!key || typeof listener !== "function") {
    return () => {};
  }

  const listeners = listenersBySession.get(key) || new Set();
  listeners.add(listener);
  listenersBySession.set(key, listeners);

  return () => {
    const current = listenersBySession.get(key);
    if (!current) return;
    current.delete(listener);
    if (current.size === 0) {
      listenersBySession.delete(key);
    }
  };
};

export const publishExamResult = (sessionId, payload) => {
  const key = String(sessionId || "").trim();
  if (!key) return;

  const listeners = listenersBySession.get(key);
  if (!listeners || listeners.size === 0) return;

  const message = toPayload(payload);
  listeners.forEach((listener) => {
    try {
      listener(message);
    } catch (_error) {
      // Ignore individual listener errors so others still receive the event.
    }
  });
};
