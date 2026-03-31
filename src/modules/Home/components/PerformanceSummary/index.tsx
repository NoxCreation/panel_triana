import {
    Flex,
    Heading,
    SimpleGrid,
    Box,
    Text,
    Card,
    CardBody,
    Icon,
} from "@chakra-ui/react";
import { FaArrowUp } from "react-icons/fa";

export const PerformanceSummary = () => {

    return (
        <Card>
            <CardBody>
                <Heading size="md" mb={4}>Performance Summary</Heading>
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                    <Box p={3} borderWidth="1px" borderRadius="md">
                        <Text fontSize="sm" color="gray.500" mb={1}>New Registrations</Text>
                        <Flex align="center" justify="space-between">
                            <Text fontSize="2xl" fontWeight="bold">142</Text>
                            <Text fontSize="sm" color="green.500">
                                <Icon as={FaArrowUp} /> 24% increase
                            </Text>
                        </Flex>
                        <Text fontSize="xs" color="gray.500">Last 7 days</Text>
                    </Box>
                    <Box p={3} borderWidth="1px" borderRadius="md">
                        <Text fontSize="sm" color="gray.500" mb={1}>Workouts Completed</Text>
                        <Flex align="center" justify="space-between">
                            <Text fontSize="2xl" fontWeight="bold">2,845</Text>
                            <Text fontSize="sm" color="green.500">
                                <Icon as={FaArrowUp} /> 18% increase
                            </Text>
                        </Flex>
                        <Text fontSize="xs" color="gray.500">This month</Text>
                    </Box>
                    <Box p={3} borderWidth="1px" borderRadius="md">
                        <Text fontSize="sm" color="gray.500" mb={1}>User Engagement</Text>
                        <Flex align="center" justify="space-between">
                            <Text fontSize="2xl" fontWeight="bold">86%</Text>
                            <Text fontSize="sm" color="green.500">
                                <Icon as={FaArrowUp} /> 5% increase
                            </Text>
                        </Flex>
                        <Text fontSize="xs" color="gray.500">Daily active users</Text>
                    </Box>
                </SimpleGrid>
            </CardBody>
        </Card>
    )
}