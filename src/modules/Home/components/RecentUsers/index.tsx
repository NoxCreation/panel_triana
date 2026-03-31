import { Avatar, Badge, Button, Card, CardBody, Flex, Heading, HStack, Icon, Table, Tbody, Td, Th, Thead, Tr, VStack, Text, Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react"
import { FaEllipsisV, FaFire } from "react-icons/fa"

export const RecentUsers = ({
    recentUsers
}: {
    recentUsers: Array<{ id: number, name: string, email: string, plan: string, joinDate: string, status: string, workouts: number }>
}) => {
    return (
        <Card>
            <CardBody>
                <Flex justify="space-between" align="center" mb={4}>
                    <Heading size="md">Recent Users</Heading>
                    <Button size="sm" variant="ghost">View All</Button>
                </Flex>

                <Table size="sm">
                    <Thead>
                        <Tr>
                            <Th>User</Th>
                            <Th>Plan</Th>
                            <Th>Workouts</Th>
                            <Th>Status</Th>
                            <Th></Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {recentUsers.map((user) => (
                            <Tr key={user.id}>
                                <Td>
                                    <HStack>
                                        <Avatar size="sm" name={user.name} bg={user.plan === "Premium" ? "primary.500" : "gray.400"} />
                                        <VStack align="start" spacing={0}>
                                            <Text fontWeight="medium">{user.name}</Text>
                                            <Text fontSize="xs" color="gray.500">{user.email}</Text>
                                        </VStack>
                                    </HStack>
                                </Td>
                                <Td>
                                    <Badge
                                        colorScheme={user.plan === "Premium" ? "primary" : "gray"}
                                        fontSize="xs" variant={'subtle'}
                                    >
                                        {user.plan}
                                    </Badge>
                                </Td>
                                <Td>
                                    <HStack>
                                        <Icon as={FaFire} color="orange.500" />
                                        <Text>{user.workouts}</Text>
                                    </HStack>
                                </Td>
                                <Td>
                                    <Badge
                                        colorScheme={user.status === "Active" ? "green" : "gray"}
                                        fontSize="xs"
                                    >
                                        {user.status}
                                    </Badge>
                                </Td>
                                <Td>
                                    <Menu>
                                        <MenuButton as={Button} size="xs" variant="ghost">
                                            <Icon as={FaEllipsisV} />
                                        </MenuButton>
                                        <MenuList>
                                            <MenuItem>View Profile</MenuItem>
                                            <MenuItem>Change Plan</MenuItem>
                                        </MenuList>
                                    </Menu>
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </CardBody>
        </Card>
    )
}