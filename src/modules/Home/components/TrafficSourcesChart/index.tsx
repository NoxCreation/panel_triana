import {
    Box, Heading, Card, CardBody
} from '@chakra-ui/react';
import {
    XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
    Legend, ResponsiveContainer, BarChart, Bar
} from 'recharts';
import { TrafficSource } from '../types';

export const TrafficSourcesChart = ({
    trafficSources
}: {
    trafficSources: TrafficSource[]
}) => {

    return (
        <Card>
            <CardBody>
                <Heading as="h2" size="md" mb={4}>
                    Fuentes de tráfico
                </Heading>
                <Box height="300px">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={trafficSources} layout="vertical" margin={{ left: 70 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" />
                            <YAxis type="category" dataKey="source" />
                            <RechartsTooltip />
                            <Legend />
                            <Bar dataKey="visits" fill="#f74de0" name="Visitas" />
                        </BarChart>
                    </ResponsiveContainer>
                </Box>
            </CardBody>
        </Card>
    )
}