import {
    Card,
    CardBody,
    Heading,
    VStack,
    HStack,
    Text,
    Box,
    Badge,
    Progress,
    Flex
} from "@chakra-ui/react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

export const RevenueByPlan = () => {
    const revenueData = [
        {
            plan: "Premium Monthly",
            revenue: 4250,
            change: 12,
            color: "primary.500",
            users: 420,
            target: 450
        },
        {
            plan: "Premium Annual",
            revenue: 3150,
            change: -5,
            color: "primary.400",
            users: 185,
            target: 200
        }
    ];

    const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0);

    return (
        <Card>
            <CardBody>
                <Heading size="md" mb={4}>Revenue by Plan</Heading>
                <VStack spacing={4} align="stretch">
                    {revenueData.map((item) => {
                        const percentage = (item.revenue / totalRevenue) * 100;
                        return (
                            <Box key={item.plan}>
                                <Flex justify="space-between" mb={2}>
                                    <HStack>
                                        <Box w="3" h="3" borderRadius="full" bg={item.color} />
                                        <Text fontWeight="medium">{item.plan}</Text>
                                    </HStack>
                                    <HStack align="end" spacing={2}>
                                        <Text fontWeight="bold">${item.revenue.toLocaleString()}</Text>
                                        <Badge
                                            colorScheme={item.change >= 0 ? "green" : "red"}
                                            fontSize="xs" variant={'subtle'}
                                        >
                                            <HStack spacing={1}>
                                                {item.change >= 0 ? <FaArrowUp size={10} /> : <FaArrowDown size={10} />}
                                                <Text>{Math.abs(item.change)}%</Text>
                                            </HStack>
                                        </Badge>
                                    </HStack>
                                </Flex>
                                <Progress
                                    value={percentage}
                                    colorScheme={
                                        item.plan === "Premium Monthly" ? "primary" :
                                            item.plan === "Premium Annual" ? "primary" : ""
                                    }
                                    size="sm"
                                    borderRadius="full"
                                />
                                <Flex justify="space-between" mt={1}>
                                    <Text fontSize="xs" color="gray.500">
                                        {item.users} users ({((item.users / item.target) * 100).toFixed(1)}% of target)
                                    </Text>
                                    <Text fontSize="xs" color="gray.500">
                                        {percentage.toFixed(1)}% of total
                                    </Text>
                                </Flex>
                            </Box>
                        );
                    })}

                    <Box mt={4} p={3} bg="gray.50" borderRadius="md">
                        <Flex justify="space-between" align="center">
                            <VStack align="start" spacing={0}>
                                <Text fontSize="sm" color="gray.600">Total Monthly Revenue</Text>
                                <Text fontSize="xl" fontWeight="bold">${totalRevenue.toLocaleString()}</Text>
                            </VStack>
                            <Badge colorScheme="green" fontSize="sm" variant={'subtle'}>
                                +14.8%
                            </Badge>
                        </Flex>
                    </Box>
                </VStack>
            </CardBody>
        </Card>
    );
};