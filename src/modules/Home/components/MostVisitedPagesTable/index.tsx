import {
    Heading, Table, Thead, Tbody, Tr, Th, Td, Card, CardBody, TableContainer
} from '@chakra-ui/react';
import { TopPage } from '../types';

export const MostVisitedPagesTable = ({
    topPages
}: {
    topPages: TopPage[]
}) => {

    return (
        <Card>
            <CardBody>
                <Heading as="h2" size="md" mb={4}>Páginas más visitadas</Heading>
                <TableContainer>
                    <Table variant="simple" size="sm">
                        <Thead>
                            <Tr>
                                <Th>URL</Th>
                                <Th isNumeric>Visitas</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {topPages.map(page => (
                                <Tr key={page.url}>
                                    <Td fontFamily="mono">{page.url}</Td>
                                    <Td isNumeric>{page.visits}</Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </TableContainer>
            </CardBody>
        </Card>
    )
}