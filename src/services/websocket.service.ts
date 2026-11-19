// src/services/websocket.service.ts

type EventCallback = (data: any) => void;

class RealtimeWebSocketService {
  private ws: WebSocket | null = null;
  private shopId: string | null = null;
  private token: string | null = null;
  private listeners: Map<string, Set<EventCallback>> = new Map();
  private reconnectTimeout: any = null;
  private pingInterval: any = null;
  private isExplicitlyClosed: boolean = false;
  private reconnectAttempts: number = 0;

  public connect(shopId: string, token?: string) {
    if (!shopId) return;

    // Si déjà connecté avec le même shopId, ne rien faire
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING) && this.shopId === shopId) {
      return;
    }

    this.disconnect();
    this.shopId = shopId;
    this.token = token || localStorage.getItem('token') || '';
    this.isExplicitlyClosed = false;

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://kolix-backend-prod.onrender.com';
      const wsProtocol = apiUrl.startsWith('https') ? 'wss:' : 'ws:';
      const host = apiUrl.replace(/^https?:\/\//, '').replace(/\/api\/v1\/?$/, '').replace(/\/$/, '');
      const wsUrl = `${wsProtocol}//${host}/api/v1/ws/${this.shopId}${this.token ? `?token=${encodeURIComponent(this.token)}` : ''}`;

      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        this.reconnectAttempts = 0;
        this.startHeartbeat();
        this.emit('SOCKET_CONNECTED', { shopId: this.shopId });
      };

      this.ws.onmessage = (event) => {
        try {
          if (event.data === 'pong') return;
          const payload = JSON.parse(event.data);
          if (payload && payload.event) {
            this.emit(payload.event, payload.data);
            this.emit('*', payload);
          }
        } catch {
          // Message text brut
        }
      };

      this.ws.onerror = () => {
        // La reconnexion sera gérée dans onclose
      };

      this.ws.onclose = () => {
        this.stopHeartbeat();
        this.emit('SOCKET_DISCONNECTED', {});
        if (!this.isExplicitlyClosed) {
          this.scheduleReconnect();
        }
      };
    } catch (err) {
      this.scheduleReconnect();
    }
  }

  public disconnect() {
    this.isExplicitlyClosed = true;
    this.stopHeartbeat();
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    if (this.ws) {
      try {
        this.ws.close();
      } catch {}
      this.ws = null;
    }
    this.shopId = null;
  }

  public on(event: string, callback: EventCallback): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
    return () => this.off(event, callback);
  }

  public off(event: string, callback: EventCallback) {
    const subs = this.listeners.get(event);
    if (subs) {
      subs.delete(callback);
      if (subs.size === 0) {
        this.listeners.delete(event);
      }
    }
  }

  private emit(event: string, data: any) {
    const subs = this.listeners.get(event);
    if (subs) {
      subs.forEach((cb) => {
        try {
          cb(data);
        } catch (e) {
          console.error(`Erreur callback WS pour [${event}]:`, e);
        }
      });
    }
  }

  private startHeartbeat() {
    this.stopHeartbeat();
    this.pingInterval = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        try {
          this.ws.send(JSON.stringify({ type: 'ping' }));
        } catch {}
      }
    }, 25000);
  }

  private stopHeartbeat() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  private scheduleReconnect() {
    if (this.isExplicitlyClosed || !this.shopId) return;
    this.reconnectAttempts += 1;
    const delay = Math.min(1000 * Math.pow(1.5, this.reconnectAttempts), 10000);
    this.reconnectTimeout = setTimeout(() => {
      if (!this.isExplicitlyClosed && this.shopId) {
        this.connect(this.shopId, this.token || undefined);
      }
    }, delay);
  }
}

export const realtimeWs = new RealtimeWebSocketService();

