import {
    Box,
    Heading,
    Text,
    VStack,
    Badge,
    Card,
    CardBody,
    CardHeader,
    Flex,
    Avatar,
    Button,
} from "@chakra-ui/react";

export const FriendsRanking = () => {
    const friends = [
        { id: 1, name: "Alex Johnson", points: 2450, avatar: "AJ", isYou: true },
        { id: 2, name: "Maria Garcia", points: 2890, avatar: "MG", isYou: false },
        { id: 3, name: "David Chen", points: 2310, avatar: "DC", isYou: false },
        { id: 4, name: "Sarah Miller", points: 2750, avatar: "SM", isYou: false }
    ];

    return (
        <Card>
            <CardHeader>
                <Flex justify="space-between" align="center">
                    <Heading size="md">Friends Ranking</Heading>
                    <Button size="xs" variant="ghost">See All</Button>
                </Flex>
            </CardHeader>
            <CardBody>
                <VStack spacing={3} align="stretch">
                    {friends.map((friend, index) => (
                        <Flex
                            key={friend.id}
                            align="center"
                            p={2}
                            borderRadius="md"
                            bg={friend.isYou ? "primary.50" : "transparent"}
                        >
                            <Text fontWeight="bold" w={8} color="gray.500">#{index + 1}</Text>
                            <Avatar size="sm" name={friend.name} bg="primary.500" mr={3} />
                            <Box flex={1}>
                                <Text fontWeight="medium" fontSize="sm">
                                    {friend.name} {friend.isYou && "(You)"}
                                </Text>
                            </Box>
                            <Badge colorScheme={index < 3 ? "green" : "gray"} fontSize="xs">
                                {friend.points} pts
                            </Badge>
                        </Flex>
                    ))}
                </VStack>
            </CardBody>
        </Card>
    );
};