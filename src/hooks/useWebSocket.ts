'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface WebSocketOptions {
  url: string;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  onMessage?: (data: any) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Event) => void;
}

export default function useWebSocket({
  url,
  reconnectInterval = 3000,
  maxReconnectAttempts = 5,
  onMessage,
  onConnect,
  onDisconnect,
  onError,
}: WebSocketOptions) {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<any>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      // For now, we'll stub the WebSocket connection since backend isn't ready
      // In production, this would be: new WebSocket(url)
      console.log(`[WebSocket] Attempting to connect to ${url} (stubbed)`);
      
      // Simulate connection after a delay
      setTimeout(() => {
        setIsConnected(true);
        reconnectAttemptsRef.current = 0;
        onConnect?.();
        console.log('[WebSocket] Connected (stubbed)');
      }, 500);

      // TODO: Replace with real WebSocket when backend is ready
      // wsRef.current = new WebSocket(url);
      // 
      // wsRef.current.onopen = () => {
      //   setIsConnected(true);
      //   reconnectAttemptsRef.current = 0;
      //   onConnect?.();
      // };
      //
      // wsRef.current.onmessage = (event) => {
      //   const data = JSON.parse(event.data);
      //   setLastMessage(data);
      //   onMessage?.(data);
      // };
      //
      // wsRef.current.onerror = (error) => {
      //   onError?.(error);
      // };
      //
      // wsRef.current.onclose = () => {
      //   setIsConnected(false);
      //   onDisconnect?.();
      //   attemptReconnect();
      // };
    } catch (error) {
      console.error('[WebSocket] Connection error:', error);
      attemptReconnect();
    }
  }, [url, onConnect, onMessage, onError, onDisconnect]);

  const attemptReconnect = useCallback(() => {
    if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
      console.error('[WebSocket] Max reconnection attempts reached');
      return;
    }

    reconnectAttemptsRef.current += 1;
    console.log(
      `[WebSocket] Reconnecting... (attempt ${reconnectAttemptsRef.current}/${maxReconnectAttempts})`
    );

    reconnectTimeoutRef.current = setTimeout(() => {
      connect();
    }, reconnectInterval);
  }, [reconnectInterval, maxReconnectAttempts, connect]);

  const sendMessage = useCallback((data: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
    } else {
      console.warn('[WebSocket] Cannot send message: not connected');
    }
  }, []);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
  }, []);

  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    isConnected,
    lastMessage,
    sendMessage,
    disconnect,
    reconnect: connect,
  };
}
