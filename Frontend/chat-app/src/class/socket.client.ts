export default class WebSocketClient {
  private ws!: WebSocket;
  public isConnected: boolean = false;
  private url: string;
  private token: string;

  constructor(url: string, token: string) {
    this.url = url;
    this.token = token;
    this.initialize_connection();
  }

  private initialize_connection() {
    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      this.isConnected = true;
    };

    this.ws.onclose = () => {
      this.isConnected = false;
    };

    this.ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  }

  public get socket(): WebSocket {
    return this.ws;
  }

  public close(code: number = 1000, reason: string = "Client Disconnected") {
    if (
      this.ws &&
      (this.ws.readyState === WebSocket.OPEN ||
        this.ws.readyState === WebSocket.CONNECTING)
    ) {
      this.ws.close(code, reason);
    }

    this.isConnected = false;
  }
}
