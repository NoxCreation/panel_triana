import { Transition } from "@/components/Transition"
import { Box, Image, Text, Flex } from "@chakra-ui/react"
import { useState, useEffect, useRef } from "react"

const motivationalPhrases = [
    "El dolor que sientes hoy será la fuerza que sentirás mañana.",
    "No se trata de ser el mejor, sino de ser mejor que ayer.",
    "La disciplina vence a la motivación: entrena incluso cuando no tengas ganas.",
    "Cada repetición cuenta, cada gota de sudor te acerca a tu objetivo.",
    "El cuerpo logra lo que la mente cree.",
    "No te detengas cuando estés cansado, detente cuando hayas terminado.",
    "El esfuerzo de hoy es el orgullo de mañana.",
    "Convierte tu debilidad en tu mayor fortaleza.",
    "Hazlo por ti, por tu salud, por tu futuro."
]

export const CardBanner = () => {
    const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0)
    const textRef = useRef<HTMLParagraphElement>(null)

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentPhraseIndex((prevIndex) =>
                (prevIndex + 1) % motivationalPhrases.length
            )
        }, 5000)

        return () => clearInterval(interval)
    }, [])

    // Efecto para reiniciar la animación cuando cambia la frase
    useEffect(() => {
        if (textRef.current) {
            // Reiniciar la animación
            textRef.current.style.animation = 'none'
            void textRef.current.offsetWidth // Forzar reflow
            textRef.current.style.animation = 'fadeSlide 5s ease-in-out infinite'
        }
    }, [currentPhraseIndex])

    // Agregar estilos CSS globales para la animación
    useEffect(() => {
        const style = document.createElement('style')
        style.innerHTML = `
            @keyframes fadeSlide {
                0% { opacity: 0; transform: translateY(10px); }
                20% { opacity: 1; transform: translateY(0); }
                80% { opacity: 1; transform: translateY(0); }
                100% { opacity: 0; transform: translateY(-10px); }
            }
        `
        document.head.appendChild(style)

        return () => {
            document.head.removeChild(style)
        }
    }, [])

    return (
        <Transition velocity="slow" type="left">
            <Box
                position="relative"
                h={{ base: '280px', md: '340px' }}
                overflow="hidden"
                borderRadius="12px"
                boxShadow="lg"
                transition="all 0.3s ease"
            >
                {/* Imagen del banner */}
                <Image
                    src="/banner.jpg"
                    alt="Dashboard de fitness - Alcanza tus metas"
                    objectFit="cover"
                    w="100%"
                    h="100%"
                    loading="eager"
                    fallback={
                        <Box
                            w="100%"
                            h="100%"
                            bgGradient="linear(to-r, blue.500, purple.500)"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                        >
                            <Text color="white" fontWeight="bold">FITNESS DASHBOARD</Text>
                        </Box>
                    }
                />

                {/* Overlay con gradiente para mejor contraste */}
                <Box
                    position="absolute"
                    top="0"
                    left="0"
                    w="100%"
                    h="100%"
                    bgGradient="linear(to-r, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 100%)"
                />

                {/* Contenido superpuesto */}
                <Flex
                    position="absolute"
                    top="0"
                    left="0"
                    w="100%"
                    h="100%"
                    p={{ base: 4, md: 6 }}
                    direction="column"
                    justify="flex-end"
                    align="flex-start"
                    color="white"
                    zIndex="1"
                >
                    <Text
                        fontSize={{ base: 'lg', md: 'xl' }}
                        fontWeight="semibold"
                        mb={2}
                        textShadow="0 2px 4px rgba(0,0,0,0.3)"
                    >
                        Bienvenido de nuevo!
                    </Text>

                    <Box
                        h={{ base: '80px', md: '90px' }}
                        position="relative"
                        overflow="hidden"
                        mb={3}
                        w={"100%"}
                    >
                        <Text
                            ref={textRef}
                            fontSize={{ base: '2xl', md: '3xl' }}
                            fontWeight="bold"
                            textShadow="0 2px 6px rgba(0,0,0,0.4)"
                            maxW="80%"
                            position="absolute"
                            top="0"
                            left="0"
                            animation="fadeSlide 5s ease-in-out infinite"
                        >
                            {motivationalPhrases[currentPhraseIndex]}
                        </Text>
                    </Box>

                    <Text
                        fontSize={{ base: 'sm', md: 'md' }}
                        mb={4}
                        opacity={0.95}
                        maxW={{ base: '100%', md: '60%' }}
                    >
                        Monitorea tus compras y gestiona tus deudas entre otras cosas más.
                    </Text>

                    {/* <Button
                        size={{ base: 'sm', md: 'md' }}
                        colorScheme="primary.500"
                        transition="all 0.2s"
                        boxShadow="md"
                    >
                        View General Metrics
                    </Button> */}
                </Flex>

                {/* Indicador de frase actual */}
                <Flex
                    position="absolute"
                    bottom={4}
                    right={4}
                    gap={1}
                    zIndex="2"
                >
                    {motivationalPhrases.map((_, index) => (
                        <Box
                            key={index}
                            w="6px"
                            h="6px"
                            borderRadius="full"
                            bg={index === currentPhraseIndex ? 'primary.100' : 'gray.400'}
                            transition="all 0.3s"
                            _hover={{ transform: 'scale(1.2)' }}
                        />
                    ))}
                </Flex>
            </Box>
        </Transition>
    )
}