import {
    Card,
    CardBody,
    Heading,
    SimpleGrid,
    Box,
    Text,
    VStack,
    HStack,
    Icon,
    Badge,
    Progress
} from "@chakra-ui/react";
import { FaStar, FaDownload, FaBug, FaMobileAlt, FaGlobe, FaSync } from "react-icons/fa";

export const AppStatistics = () => {
    const stats = [
        {
            label: "App Version",
            value: "2.4.1",
            icon: FaMobileAlt,
            color: "primary.500",
            status: "Latest",
            statusColor: "green"
        },
        {
            label: "App Rating",
            value: "4.7",
            icon: FaStar,
            color: "yellow.500",
            details: "1,254 reviews"
        },
        {
            label: "Total Downloads",
            value: "45.2K",
            icon: FaDownload,
            color: "green.500",
            change: "+12.3%"
        },
        {
            label: "Crash Rate",
            value: "0.12%",
            icon: FaBug,
            color: "red.500",
            target: "0.10%"
        },
        {
            label: "API Uptime",
            value: "99.92%",
            icon: FaGlobe,
            color: "blue.500",
            target: "99.95%"
        },
        {
            label: "Sync Success",
            value: "98.7%",
            icon: FaSync,
            color: "purple.500",
            change: "+0.8%"
        }
    ];

    return (
        <Card>
            <CardBody>
                <Heading size="md" mb={4}>App Statistics</Heading>
                <SimpleGrid columns={2} spacing={3}>
                    {stats.map((stat) => (
                        <Box
                            key={stat.label}
                            p={3}
                            borderWidth="1px"
                            borderRadius="md"
                            _hover={{
                                bg: "gray.50",
                                transform: "translateY(-2px)",
                                transition: "all 0.2s"
                            }}
                        >
                            <HStack spacing={3}>
                                <Icon as={stat.icon} color={stat.color} boxSize={5} />
                                <VStack align="start" spacing={0} flex={1}>
                                    <Text fontSize="xs" color="gray.500">{stat.label}</Text>
                                    <Text fontSize="lg" fontWeight="bold">{stat.value}</Text>
                                    {stat.details && (
                                        <Text fontSize="xs" color="gray.500">{stat.details}</Text>
                                    )}
                                    {stat.change && (
                                        <Text fontSize="xs" color="green.500">{stat.change}</Text>
                                    )}
                                    {stat.target && (
                                        <Progress
                                            value={(parseFloat(stat.value) / parseFloat(stat.target.replace('%', ''))) * 100}
                                            size="xs"
                                            width="100%"
                                            mt={1}
                                            colorScheme={parseFloat(stat.value) >= parseFloat(stat.target.replace('%', '')) ? "green" : "yellow"}
                                        />
                                    )}
                                </VStack>
                                {stat.status && (
                                    <Badge colorScheme={stat.statusColor} fontSize="xs" variant={'subtle'}>
                                        {stat.status}
                                    </Badge>
                                )}
                            </HStack>
                        </Box>
                    ))}
                </SimpleGrid>

                <Box mt={4} p={3} bg="gray.50" borderRadius="md">
                    <Text fontSize="sm" fontWeight="medium" mb={2}>Performance Overview</Text>
                    <SimpleGrid columns={2} spacing={2}>
                        <Box>
                            <Text fontSize="xs" color="gray.500">Avg. Session</Text>
                            <Text fontSize="sm" fontWeight="bold">4m 23s</Text>
                        </Box>
                        <Box>
                            <Text fontSize="xs" color="gray.500">Screen Load Time</Text>
                            <Text fontSize="sm" fontWeight="bold">1.2s</Text>
                        </Box>
                        <Box>
                            <Text fontSize="xs" color="gray.500">Error Rate</Text>
                            <Text fontSize="sm" fontWeight="bold" color="green.500">0.08%</Text>
                        </Box>
                        <Box>
                            <Text fontSize="xs" color="gray.500">Satisfaction</Text>
                            <Text fontSize="sm" fontWeight="bold" color="green.500">92%</Text>
                        </Box>
                    </SimpleGrid>
                </Box>
            </CardBody>
        </Card>
    );
};