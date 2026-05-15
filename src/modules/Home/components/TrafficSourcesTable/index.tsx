
import {
    Heading, Table, Thead, Tbody, Tr, Th, Td, Card, CardBody, TableContainer
} from '@chakra-ui/react';
import { TrafficSource } from '../types';

export const TrafficSourcesTable = ({
    trafficSources
}: {
    trafficSources: TrafficSource[]
}) => {
    return (
        <Card>
            <CardBody>
                <Heading as="h2" size="md" mb={4}>Fuentes de tráfico (detalle)</Heading>
                <TableContainer>
                    <Table variant="simple" size="sm">
                        <Thead>
                            <Tr>
                                <Th>Origen</Th>
                                <Th isNumeric>Visitas</Th>
                                <Th isNumeric>%</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {trafficSources.map(s => (
                                <Tr key={s.source}>
                                    <Td>{s.source}</Td>
                                    <Td isNumeric>{s.visits}</Td>
                                    <Td isNumeric>{s.percentage}%</Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </TableContainer>
            </CardBody>
        </Card>
    )
}