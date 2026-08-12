import { useEffect, useState } from "react";
import { io, Socket } from 'socket.io-client';

export type SocketStatus = 'connecting' | 'connected' | 'error' | 'disconnected';

const socket: Socket = io('http://localhost:3001', {
    autoConnect: false,
  });

export const useSocket = () => {
    const [status, setStatus] = useState<SocketStatus>('connecting')
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        const tgInitData = (window as any).Telegram?.WebApp?.initData; // Заглушка

        const initData = tgInitData || 'dev'

        socket.auth = { initData };
        socket.connect();

        const onConnect = () => {
            setStatus('connected');
            setErrorMessage(null);
        };
      
        const onDisconnect = () => {
          setStatus('disconnected');
        };
      
        const onConnectError = (err: Error) => {
          setStatus('error');
          setErrorMessage(err.message || 'Ошибка подключения к серверу');
        };

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        socket.on('connect_error', onConnectError);

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
            socket.off('connect_error', onConnectError);
            socket.disconnect();
          };
    }, []);

    return { status, errorMessage, socket }
}