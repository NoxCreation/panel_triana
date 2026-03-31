import { useState, useEffect, useRef } from 'react'
import {
    Box,
    Button,
    Container,
    Flex,
    Input,
    Text,
    VStack,
    Heading,
    useToast,
} from '@chakra-ui/react'
interface Message {
    id: number
    sender_id: string
    receiver_id: string
    message: string
    timestamp: string
    is_read: boolean
}
export default function Chat() {
    const [messages, setMessages] = useState<Message[]>([])
    const [inputMessage, setInputMessage] = useState('')
    const [userId, setUserId] = useState('A1')
    const [otherUserId, setOtherUserId] = useState('')
    const [isConnected, setIsConnected] = useState(false)
    const ws = useRef<WebSocket | null>(null)
    const toast = useToast()
    // Conectar al WebSocket
    const connectWebSocket = () => {
        if (!userId) {
            toast({
                title: 'Error',
                description: 'Por favor, ingresa tu ID de usuario',
                status: 'error',
                duration: 3000,
                isClosable: true,
            })
            return
        }
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
        const wsUrl = `${protocol}//194.163.45.115:8003/ws/${userId}`
        ws.current = new WebSocket(wsUrl)
        ws.current.onopen = () => {
            setIsConnected(true)
            toast({
                title: 'Conectado',
                status: 'success',
                duration: 2000,
                isClosable: true,
            })
        }
        ws.current.onmessage = (event) => {
            const newMessage: Message = JSON.parse(event.data)
            console.log("newMessage", newMessage)
            setMessages((prev) => [newMessage, ...prev])
        }
        ws.current.onclose = () => {
            setIsConnected(false)
        }
        ws.current.onerror = (error) => {
            console.error('WebSocket error:', error)
            toast({
                title: 'Error de conexión',
                status: 'error',
                duration: 3000,
                isClosable: true,
            })
        }
    }
    // Desconectar WebSocket
    const disconnectWebSocket = () => {
        if (ws.current) {
            ws.current.close()
            setIsConnected(false)
        }
    }
    // Enviar mensaje
    const sendMessage = () => {
        if (!ws.current || ws.current.readyState !== WebSocket.OPEN) {
            toast({
                title: 'Error',
                description: 'No estás conectado',
                status: 'error',
                duration: 3000,
                isClosable: true,
            })
            return
        }
        if (!inputMessage.trim() || !otherUserId) {
            toast({
                title: 'Error',
                description: 'Por favor, ingresa un mensaje y el ID del destinatario',
                status: 'error',
                duration: 3000,
                isClosable: true,
            })
            return
        }
        const messageData = {
            sender_id: userId,
            receiver_id: otherUserId,
            message: inputMessage,
        }
        ws.current.send(JSON.stringify(messageData))
        setMessages((prev) => [messageData as any, ...prev])
        setInputMessage('')
    }

    // Cargar historial de mensajes
    const loadMessageHistory = async () => {
        if (!userId || !otherUserId) return
        try {

            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            const raw = JSON.stringify({
                userId,
                otherUserId
            });

            const requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            } as any

            const response = await fetch("/api/load-msg/", requestOptions)

            const data = await response.json()
            setMessages(data.reverse()) // Invertimos para mostrar los más antiguos primero
        } catch (error) {
            console.error('Error loading messages:', error)
        }
    }

    // Efecto para cargar el historial cuando se establece el otro usuario
    useEffect(() => {
        if (userId && otherUserId) {
            loadMessageHistory()
        }
    }, [userId, otherUserId])

    // Limpiar conexión al desmontar
    useEffect(() => {
        return () => {
            if (ws.current) {
                ws.current.close()
            }
        }
    }, [])
    
    return (
        <Container maxW="container.md" py={4} bg={'white'} >
            <Heading as="h1" size="xl" mb={4}>
                Chat App
            </Heading>
            <VStack spacing={4} align="stretch">
                <Flex>
                    <Input
                        placeholder="Tu ID de usuario"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        isDisabled={isConnected}
                    />
                    <Button
                        onClick={isConnected ? disconnectWebSocket : connectWebSocket}
                        ml={2}
                        colorScheme={isConnected ? 'red' : 'green'}
                    >
                        {isConnected ? 'Desconectar' : 'Conectar'}
                    </Button>
                </Flex>
                <Input
                    placeholder="ID del otro usuario"
                    value={otherUserId}
                    onChange={(e) => setOtherUserId(e.target.value)}
                />
                <Flex>
                    <Input
                        placeholder="Escribe un mensaje..."
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') sendMessage()
                        }}
                    />
                    <Button onClick={sendMessage} ml={2} colorScheme="blue">
                        Enviar
                    </Button>
                </Flex>
                <Box borderWidth={1} borderRadius="md" p={4} height="400px" overflowY="auto" zIndex={2000}>
                    <VStack spacing={2} >
                        {messages.map((msg) => (
                            <Box
                                key={msg.id}
                                bg={msg.sender_id === userId ? 'blue.100' : 'gray.100'}
                                p={2}
                                borderRadius="md"
                                alignSelf={msg.sender_id === userId ? 'flex-end' : 'flex-start'}
                            >
                                <Text fontSize="sm">{msg.message}</Text>
                                <Text fontSize="xs" color="gray.500">
                                    {new Date(msg.timestamp).toLocaleTimeString()}
                                </Text>
                            </Box>
                        ))}
                    </VStack>
                </Box>
            </VStack>
        </Container>
    )
}