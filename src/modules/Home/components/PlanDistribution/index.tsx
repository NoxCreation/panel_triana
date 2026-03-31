import { Box, Card, CardBody, Flex, Heading, HStack, Select, VStack, Text, Progress } from "@chakra-ui/react"

export const PlanDistribution = () => {
    return (
        <Card h={'100%'}>
            <CardBody>
                <HStack justify="space-between" mb={4}>
                    <Heading size="md">Plan Distribution</Heading>
                    <Select size="sm" width="auto">
                        <option>Last 30 days</option>
                        <option>Last 90 days</option>
                        <option>This year</option>
                    </Select>
                </HStack>

                <VStack spacing={4} align="stretch">
                    {[
                        { plan: "Premium", users: 856, percentage: 42, color: "primary.500" },
                        { plan: "Free", users: 398, percentage: 58, color: "gray.400" }
                    ].map((plan) => (
                        <Box key={plan.plan}>
                            <Flex justify="space-between" mb={1}>
                                <HStack spacing={2}>
                                    <Box w="3" h="3" borderRadius="full" bg={plan.color} />
                                    <Text fontWeight="medium">{plan.plan}</Text>
                                </HStack>
                                <Text fontWeight="bold">{plan.users} users ({plan.percentage}%)</Text>
                            </Flex>
                            <Progress
                                value={plan.percentage}
                                colorScheme={plan.plan === "Premium" ? "primary" : "gray"}
                                size="sm"
                                borderRadius="full"
                            />
                        </Box>
                    ))}
                </VStack>

                <HStack justify="space-between" mt={4}>
                    <VStack align="start" spacing={0}>
                        <Text fontSize="sm" color="gray.500">Total Active Users</Text>
                        <Text fontSize="2xl" fontWeight="bold">1,254</Text>
                    </VStack>
                    <VStack align="start" spacing={0}>
                        <Text fontSize="sm" color="primary.500">Retention Rate</Text>
                        <Text fontSize="2xl" fontWeight="bold" color="primary.500">94.2%</Text>
                    </VStack>
                </HStack>
            </CardBody>
        </Card>
    )
}