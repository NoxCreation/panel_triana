import {
    Box, Heading, Card, CardBody, Alert, AlertIcon, Link
} from '@chakra-ui/react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
    Legend, ResponsiveContainer
} from 'recharts';
import { DailyVisit } from '../types';

export const DailyVisitsChart = ({
    dateRange,
    dailyVisits
}: {
    dateRange: '7d' | 'thisMonth' | 'lastMonth';
    dailyVisits: DailyVisit[]
}) => {

    const rangeText = {
        '7d': 'últimos 7 días',
        'thisMonth': 'este mes',
        'lastMonth': 'el mes pasado',
    }[dateRange];

    return (
        <Card /* bg={cardBg} borderColor={borderColor} */>
            <CardBody>
                <Heading as="h2" size="md" mb={4}>
                    Visitas por día ({rangeText})
                </Heading>
                {dailyVisits.length === 0 ? (
                    <Alert variant={'subtle'} status="info">
                        <AlertIcon />
                        No hay datos para el período seleccionado.
                    </Alert>
                ) : (
                    <Box height="300px">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={dailyVisits}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <RechartsTooltip />
                                <Legend />
                                <Line type="monotone" dataKey="visits" stroke="#3182CE" name="Visitas" />
                                <Line type="monotone" dataKey="uniqueVisitors" stroke="#38A169" name="Visitantes únicos" />
                            </LineChart>
                        </ResponsiveContainer>
                    </Box>
                )}
            </CardBody>
        </Card>
    )
}