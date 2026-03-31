import { Card, CardBody, Avatar, Stack, Text, Flex, Tooltip } from "@chakra-ui/react"
import NumberFlow from "@number-flow/react"
import Link from "next/link";

export const CardUser = ({
    user
}: {
    user: {
        id: string;
        photo: null | string;
        first_name: string;
        last_name: string;
        countOrders: number;
        amounts: number;
    }
}) => {
    return (
        <Link href={`/users/${user.id}`}>
            <Card
                cursor={"pointer"}
                _hover={{
                    boxShadow: 'md'
                }}
            >
                <CardBody>
                    <Flex alignItems={'center'} gap={4}>
                        <Avatar name={`${user.first_name} ${user.last_name}`} src={user.photo} />

                        <Stack spacing={0} w={"100%"}>
                            <Flex>
                                <Stack flex={1}>
                                    <Tooltip label="Número de Órdenes">
                                        <Flex alignItems={"end"} gap={2}>
                                            <NumberFlow value={user.countOrders}
                                                style={{
                                                    fontSize: '25px',
                                                    fontWeight: 'bold',
                                                    color: '#4A5568'
                                                }}
                                            />
                                            <Text fontSize={"12px"} color={"gray.400"}>órdenes</Text>
                                        </Flex>
                                    </Tooltip>
                                </Stack>

                                <Tooltip label="Monto Adeudado">
                                    <NumberFlow value={user.amounts}
                                        style={{
                                            fontSize: '25px',
                                            fontWeight: 'bold',
                                            color: '#df7e00'
                                        }}
                                        prefix="$"
                                    />
                                </Tooltip>
                            </Flex>
                            <Text fontSize={"14px"} fontWeight={"400"} color={"gray.600"}>{user.first_name} {user.last_name}</Text>
                        </Stack>
                    </Flex>
                </CardBody>
            </Card>
        </Link>
    )
}