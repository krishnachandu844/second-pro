import WebSocketClient from "@/src/class/socket.client";

let client: WebSocketClient | null = null;

export function getWebSocketClient(token: string) {
  if (!token) {
    return null;
  }

  const base = `ws://localhost:8080`;
  const url = `${base}?token=${token}`;

  if (client) {
    return client;
  }

  client = new WebSocketClient(url, token);
  return client;
}

export function cleanWebSocketClient() {
  if (client) {
    client.close();
    client = null;
  }
}
