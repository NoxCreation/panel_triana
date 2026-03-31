import {
    Box,
    Heading,
    Text,
    VStack,
    HStack,
    Badge,
    Card,
    CardBody,
    CardHeader,
    Flex,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";

// Componente para gráfico de progreso semanal (simulado)
export const WeeklyProgressChart = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const data = [12, 19, 8, 15, 22, 18, 25]; // Nuevos usuarios por día
    const [animatedHeights, setAnimatedHeights] = useState<number[]>(new Array(data.length).fill(0));
    const cardRef = useRef<HTMLDivElement>(null);

    // Calcular la altura de cada barra (máximo 100px)
    const maxValue = Math.max(...data);
    const calculateTargetHeight = (value: number) => {
        return (value / maxValue) * 100;
    };

    // Animación de entrada cuando el componente es visible
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {

                    // Animar las barras una por una
                    const timeouts = data.map((value, index) => {
                        return setTimeout(() => {
                            setAnimatedHeights(prev => {
                                const newHeights = [...prev];
                                newHeights[index] = calculateTargetHeight(value);
                                return newHeights;
                            });
                        }, index * 100); // Retraso de 100ms entre cada barra
                    });

                    return () => timeouts.forEach(timeout => clearTimeout(timeout));
                }
            },
            { threshold: 0.1 }
        );

        if (cardRef.current) {
            observer.observe(cardRef.current);
        }

        return () => observer.disconnect();
    }, [data]);

    return (
        <Card shadow="sm" ref={cardRef}>
            <CardHeader pb={2}>
                <Flex justify="space-between" align="center">
                    <Heading size="md">New Users This Week</Heading>
                    <Badge colorScheme="primary" variant={'subtle'} fontSize="xs">+18% vs last week</Badge>
                </Flex>
                <Text fontSize="sm" color="gray.500">Daily user registrations</Text>
            </CardHeader>
            <CardBody pt={0}>
                <HStack
                    spacing={3}
                    h="150px"
                    align="flex-end"
                    justify="space-between"
                    w="100%"
                >
                    {days.map((day, index) => (
                        <VStack
                            key={day}
                            h="100%"
                            justify="flex-end"
                            spacing={2}
                            flex={1}
                        >
                            <Box
                                position="relative"
                                bgGradient="linear(to-t, primary.400, primary.200)"
                                h={`${animatedHeights[index]}px`}
                                w="100%"
                                minH="5px"
                                borderRadius="md"
                                transition="height 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)"
                                transitionDelay={`${index * 0.1}s`}
                                _hover={{
                                    bgGradient: "linear(to-t, primary.500, primary.300)",
                                    transform: 'scale(1.05)',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {/* Etiqueta del valor */}
                                <Box
                                    position="absolute"
                                    top="-25px"
                                    left="0"
                                    right="0"
                                    textAlign="center"
                                    opacity={animatedHeights[index] > 0 ? 1 : 0}
                                    transition="opacity 0.3s"
                                >
                                    <Text
                                        fontSize="xs"
                                        fontWeight="bold"
                                        color="gray.700"
                                    >
                                        {data[index]}
                                    </Text>
                                </Box>
                            </Box>
                            <Text
                                fontSize="xs"
                                fontWeight="medium"
                                color="gray.600"
                            >
                                {day}
                            </Text>
                        </VStack>
                    ))}
                </HStack>

                {/* Eje X */}
                <Box
                    position="relative"
                    h="1px"
                    w="100%"
                    bg="gray.200"
                    mt={4}
                />

                {/* Leyenda */}
                <Flex justify="space-between" mt={3}>
                    <Text fontSize="xs" color="gray.500">
                        Min: {Math.min(...data)} cal
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                        Max: {maxValue} cal
                    </Text>
                </Flex>
            </CardBody>
        </Card>
    );
};
