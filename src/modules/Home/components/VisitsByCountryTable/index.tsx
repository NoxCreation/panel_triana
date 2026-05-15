
import {
    Heading, Table, Thead, Tbody, Tr, Th, Td, Card, CardBody, TableContainer
} from '@chakra-ui/react';
import { TopCountry } from '../types';

export const VisitsByCountryTable = ({
    topCountries
}: {
    topCountries: TopCountry[]
}) => {

    return (
        <Card >
            <CardBody>
                <Heading as="h2" size="md" mb={4}>Visitas por país (tabla)</Heading>
                <TableContainer>
                    <Table variant="simple" size="sm">
                        <Thead>
                            <Tr>
                                <Th>País</Th>
                                <Th>Código</Th>
                                <Th isNumeric>Visitas</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {topCountries.map(c => (
                                <Tr key={c.code}>
                                    <Td>{c.country}</Td>
                                    <Td textTransform="uppercase">{c.code}</Td>
                                    <Td isNumeric>{c.visits}</Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </TableContainer>
            </CardBody>
        </Card>
    )
}