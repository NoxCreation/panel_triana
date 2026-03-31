import {
    Card,
    CardBody,
    Heading,
    SimpleGrid,
    Box,
    Text,
    VStack,
    HStack,
    Progress,
    Icon,
    Flex
} from "@chakra-ui/react";
import { FaChartLine, FaCalendarDay, FaCalendarWeek, FaCalendarAlt } from "react-icons/fa";

export const RetentionMetrics = () => {
    const metrics = [
        { period: "Day 1", value: 94.2, target: 95, icon: FaCalendarDay, color: "green.500" },
        { period: "Day 7", value: 78.5, target: 80, icon: FaCalendarWeek, color: "blue.500" },
        { period: "Day 30", value: 64.3, target: 65, icon: FaCalendarAlt, color: "orange.500" },
        { period: "Day 90", value: 42.8, target: 45, icon: FaChartLine, color: "purple.500" }
    ];

    return (
        <Card>
            <CardBody>
                <Heading size="md" mb={4}>Retention Metrics</Heading>
                <VStack spacing={4} align="stretch">
                    {metrics.map((metric) => (
                        <Box key={metric.period}>
                            <Flex justify="space-between" mb={2}>
                                <HStack spacing={2}>
                                    <Icon as={metric.icon} color={metric.color} />
                                    <Text fontWeight="medium">{metric.period}</Text>
                                </HStack>
                                <Text fontWeight="bold" color={metric.color}>
                                    {metric.value}%
                                </Text>
                            </Flex>
                            <Progress
                                value={(metric.value / metric.target) * 100}
                                colorScheme={
                                    metric.value >= metric.target ? "green" :
                                        metric.value >= metric.target * 0.9 ? "yellow" : "red"
                                }
                                size="sm"
                                borderRadius="full"
                            />
                            <Flex justify="space-between" mt={1}>
                                <Text fontSize="xs" color="gray.500">Target: {metric.target}%</Text>
                                <Text fontSize="xs" color="gray.500">
                                    {metric.value >= metric.target ? "✓ Achieved" : `${(metric.target - metric.value).toFixed(1)}% to go`}
                                </Text>
                            </Flex>
                        </Box>
                    ))}
                    <SimpleGrid columns={2} spacing={3} mt={2}>
                        <Box textAlign="center" p={2} bg="green.50" borderRadius="md">
                            <Text fontSize="sm" color="gray.600">Avg. Retention</Text>
                            <Text fontSize="lg" fontWeight="bold" color="green.600">69.9%</Text>
                        </Box>
                        <Box textAlign="center" p={2} bg="blue.50" borderRadius="md">
                            <Text fontSize="sm" color="gray.600">Best Performing</Text>
                            <Text fontSize="lg" fontWeight="bold" color="blue.600">Day 1</Text>
                        </Box>
                    </SimpleGrid>
                </VStack>
            </CardBody>
        </Card>
    );
};