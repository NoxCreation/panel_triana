import { Badge, Box, Card, CardBody, Flex, Heading, Icon, SimpleGrid, Text } from "@chakra-ui/react"
import { FaArrowUp, FaClock, FaMobileAlt, FaRegCalendarAlt } from "react-icons/fa"

export const ActiveUsersByDevice = () => {
    return (
        <Card>
            <CardBody>
                <Flex justify="space-between" align="center" mb={4}>
                    <Heading size="md">Active Users by Device</Heading>
                    <Badge colorScheme="green" variant={'subtle'} fontSize="xs">Live</Badge>
                </Flex>

                <SimpleGrid columns={2} spacing={4}>
                    <Box textAlign="center" p={3} bg="primary.50" borderRadius="md">
                        <Icon as={FaMobileAlt} color="primary.500" boxSize={6} mb={2} />
                        <Text fontSize="lg" fontWeight="bold">1,842</Text>
                        <Text fontSize="sm" color="gray.600">Mobile App</Text>
                        <Text fontSize="xs" color="green.500">
                            <Icon as={FaArrowUp} /> 12% from last week
                        </Text>
                    </Box>
                    <Box textAlign="center" p={3} bg="blue.50" borderRadius="md">
                        <Icon as={FaRegCalendarAlt} color="blue.500" boxSize={6} mb={2} />
                        <Text fontSize="lg" fontWeight="bold">412</Text>
                        <Text fontSize="sm" color="gray.600">Web Dashboard</Text>
                        <Text fontSize="xs" color="green.500">
                            <Icon as={FaArrowUp} /> 8% from last week
                        </Text>
                    </Box>
                </SimpleGrid>

                <Box mt={4}>
                    <Text fontSize="sm" color="gray.500" mb={2}>Avg. Session Duration</Text>
                    <Flex align="center" gap={2}>
                        <Icon as={FaClock} color="primary.500" />
                        <Text fontSize="lg" fontWeight="bold">24m 36s</Text>
                        <Text fontSize="sm" color="gray.600">per user</Text>
                    </Flex>
                </Box>
            </CardBody>
        </Card>
    )
}