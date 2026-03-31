/*
    ESTE PROVIDER MANTIENE LA CONECCION SOCKET ESCUCHANDO
*/
import { ReactNode, useEffect, useRef } from "react";

export const SocketProvider = ({
    children
}: {
    children: ReactNode
}) => {
    const roomName = "room-1771470084515-3ofpty9l";
    const wsRef = useRef<WebSocket | null>(null);
    const reconnectRef = useRef<NodeJS.Timeout | null>(null);

    const connectWebSocket = () => {
        // Cerrar cualquier conexión existente
        if (wsRef.current) {
            wsRef.current.close();
            wsRef.current = null;
        }

        // Limpiar cualquier intento de reconexión previo
        if (reconnectRef.current) {
            clearTimeout(reconnectRef.current);
            reconnectRef.current = null;
        }

        const ws = new WebSocket(process.env.NEXT_PUBLIC_SOCKET_URL as string);
        wsRef.current = ws; 

        ws.onopen = () => {
            console.log("Conexión WebSocket establecida");
            if (roomName) {
                ws.send(JSON.stringify({
                    action: 'subscribe',
                    channel: 'changes_call_center',
                    room_name: roomName
                }));
            }
        };

        ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            console.log("message", message)
        };

        ws.onerror = (error) => {
            console.error("Error en WebSocket:", error);
        };

        ws.onclose = (event) => {
            console.log(`WebSocket cerrado. Código: ${event.code}, Razón: ${event.reason}`);

            // Programar reconexión después de 2 segundos
            if (roomName) {
                reconnectRef.current = setTimeout(() => {
                    console.log("Intentando reconectar...");
                    connectWebSocket();
                }, 2000);
            }
        };
    };

    useEffect(() => {
        if (roomName) {
            connectWebSocket();
        }

        return () => {
            // Limpiar al desmontar el componente
            if (wsRef.current) {
                wsRef.current.send(JSON.stringify({
                    action: 'unsubscribe',
                    channel: 'changes_call_center',
                    room_name: roomName
                }));
                wsRef.current.close();
                wsRef.current = null;
            }

            if (reconnectRef.current) {
                clearTimeout(reconnectRef.current);
                reconnectRef.current = null;
            }
        };
    }, [roomName]);

    return (
        <>{children}</>
    )
}