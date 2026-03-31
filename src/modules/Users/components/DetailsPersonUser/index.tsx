import { UserType } from "@/types/UserType"
import { Card, CardBody, Stack, Avatar, Flex, Text } from "@chakra-ui/react"
import NumberFlow from "@number-flow/react"

export const DetailsPersonUser = ({
    user,
    metrics
}: {
    user: UserType;
    metrics: {
        wallet: number;
        totalOrderPending: number,
        totalOrderPartial: number,
        totalOrderPaid: number,
        payment_account: number
    }
}) => {

    return (
        <Card flex={2} h={'fit-content'}>
            <CardBody>
                <Stack>
                    <Stack alignItems={'center'}>
                        <Avatar size={'lg'} src={user.photo} />
                        <Text fontSize={'15px'} color={'gray.800'}>{user.first_name} {user.last_name}</Text>
                    </Stack>
                    <Flex>
                        <Stack spacing={0} alignItems={'center'} px={4} flex={1}>
                            <NumberFlow value={metrics.payment_account}
                                style={{
                                    fontSize: '25px',
                                    fontWeight: 'bold',
                                    color: '#cf3404'
                                }}
                                suffix=" USD"
                                animated={true}
                            />
                            <Text fontSize={'12px'} color={'primary.700'}>Cuenta por pagar</Text>
                        </Stack>
                        <Stack borderLeft={'1px solid'} borderColor={'primary.700'} />
                        <Stack spacing={0} alignItems={'center'} px={4} flex={1}>
                            <NumberFlow value={metrics.wallet}
                                style={{
                                    fontSize: '25px',
                                    fontWeight: 'bold',
                                    color: '#148a04'
                                }}
                                suffix=" USD"
                                animated={true}
                            />
                            <Text fontSize={'12px'} color={'primary.700'}>Monto en Billetera</Text>
                        </Stack>
                    </Flex>
                    <Flex>
                        <Stack spacing={0} alignItems={'center'} px={4} flex={1}>
                            <NumberFlow value={metrics.totalOrderPending}
                                style={{
                                    fontSize: '25px',
                                    fontWeight: 'bold',
                                    color: '#4A5568'
                                }}
                                animated={true}
                            />
                            <Text fontSize={'12px'} color={'primary.700'} textAlign={'center'}>órdenes pendientes</Text>
                        </Stack>
                        <Stack borderLeft={'1px solid'} borderColor={'primary.700'} />
                        <Stack spacing={0} alignItems={'center'} px={4} flex={1}>
                            <NumberFlow value={metrics.totalOrderPartial}
                                style={{
                                    fontSize: '25px',
                                    fontWeight: 'bold',
                                    color: '#4A5568'
                                }}
                                animated={true}
                            />
                            <Text fontSize={'12px'} color={'primary.700'} textAlign={'center'}>órdenes parciales</Text>
                        </Stack>
                        <Stack borderLeft={'1px solid'} borderColor={'primary.700'} />
                        <Stack spacing={0} alignItems={'center'} px={4} flex={1}>
                            <NumberFlow value={metrics.totalOrderPaid}
                                style={{
                                    fontSize: '25px',
                                    fontWeight: 'bold',
                                    color: '#4A5568'
                                }}
                                animated={true}
                            />
                            <Text fontSize={'12px'} color={'primary.700'} textAlign={'center'}>órdenes completadas</Text>
                        </Stack>
                    </Flex>  
                </Stack>
            </CardBody>
        </Card>
    )
}