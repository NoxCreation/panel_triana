'use client';

import { useEffect, useState } from 'react';
import {
    Box, Grid, Heading, Stack, HStack,
    Button, useToast,
    Flex,
    Spinner,
    Text
} from '@chakra-ui/react';
import { ContainerSystem } from '@/components/ContainerSystem';
import { useGetProfile } from '@/hooks/useGetProfile';
import Particles from "@/components/Particles";
import { CardBanner } from './components/CardBanner';
import { HeatMap } from './components/HeatMap';
import { DailyVisit, MetricSummary, TopPage, TrafficSource, TopCountry } from './components/types';
import { MetricCard } from './components/MetricCard';
import { DailyVisitsChart } from './components/DailyVisitsChart';
import { TrafficSourcesChart } from './components/TrafficSourcesChart';
import { MostVisitedPagesTable } from './components/MostVisitedPagesTable';
import { TrafficSourcesTable } from './components/TrafficSourcesTable';
import { VisitsByCountryTable } from './components/VisitsByCountryTable';

// ==================== COMPONENTE PRINCIPAL ====================
export default function DashboardPage() {
    const profile = useGetProfile();
    const toast = useToast();
    const [summary, setSummary] = useState<MetricSummary | null>(null);
    const [dailyVisits, setDailyVisits] = useState<DailyVisit[]>([]);
    const [topPages, setTopPages] = useState<TopPage[]>([]);
    const [trafficSources, setTrafficSources] = useState<TrafficSource[]>([]);
    const [topCountries, setTopCountries] = useState<TopCountry[]>([]);
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState<'7d' | 'thisMonth' | 'lastMonth'>('7d');

    // Cargar datos al cambiar el rango
    useEffect(() => {
        // Dentro de useEffect, reemplaza la simulación
        const fetchMetrics = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/v1/metrics?range=${dateRange}`);
                if (!res.ok) throw new Error('Error al cargar datos');
                const data = await res.json();
                setSummary(data.summary);
                setDailyVisits(data.dailyVisits);
                setTopPages(data.topPages);
                setTrafficSources(data.trafficSources);
                setTopCountries(data.topCountries);
            } catch (error) {
                console.error(error);
                toast({ title: 'Error al cargar métricas', status: 'error' });
            } finally {
                setLoading(false);
            }
        };
        fetchMetrics();
    }, [dateRange, toast]);

    if (loading) {
        return (
            <Stack justify="center" align="center" minH="100vh">
                <Spinner color='primary.500' size="xl" thickness="4px" speed="0.65s" label="Cargando métricas..." />
                <Text fontSize="12px">Cargando métricas</Text>
            </Stack>
        );
    }

    return (
        <ContainerSystem
            navBarControl={
                <Flex align="center" justify="space-between" w="100%" wrap="wrap" gap={2}>
                    <Heading size="lg">Bienvenido, {profile?.first_name}!</Heading>
                    <HStack>
                        <Button
                            size="sm"
                            colorScheme={dateRange === '7d' ? 'primary.600' : 'gray.400'}
                            onClick={() => setDateRange('7d')}
                            variant={'ghost'}
                        >
                            Últimos 7 días
                        </Button>
                        <Button
                            size="sm"
                            colorScheme={dateRange === 'thisMonth' ? 'primary.600' : 'gray.400'}
                            onClick={() => setDateRange('thisMonth')}
                            variant={'ghost'}
                        >
                            Este mes
                        </Button>
                        <Button
                            size="sm"
                            colorScheme={dateRange === 'lastMonth' ? 'primary.600' : 'gray.400'}
                            onClick={() => setDateRange('lastMonth')}
                            variant={'ghost'}
                        >
                            Mes pasado
                        </Button>
                    </HStack>
                </Flex>
            }
        >
            {/* Fondo de partículas */}
            <Stack position="fixed" left={0} top={0} w="100vw" h="100vh" zIndex={0}>
                <Particles
                    particleColors={['#e879f9', '#a21caf']}
                    particleCount={200}
                    particleSpread={10}
                    speed={0.1}
                    particleBaseSize={100}
                    moveParticlesOnHover={false}
                    alphaParticles={false}
                    disableRotation={false}
                    className="particles-container"
                />
            </Stack>

            <Stack spacing={4} position="relative" zIndex={1}>
                {/* Banner */}
                <Flex gap={2} direction={{ base: 'column', lg: 'row' }}>
                    <Box position="relative" flex={2}>
                        <CardBanner />
                    </Box>
                </Flex>

                {/* Tarjetas resumen */}
                <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap={4}>
                    <MetricCard title="Visitas totales" value={summary?.totalVisits?.toLocaleString() || '0'}
                        description="Número total de páginas vistas en el período seleccionado. Incluye visitas repetidas del mismo usuario."
                    />
                    <MetricCard title="Visitantes únicos" value={summary?.uniqueVisitors?.toLocaleString() || '0'}
                        description="Número de sesiones distintas (identificadas por sessionId). Un mismo usuario puede tener múltiples visitas pero cuenta una vez."
                    />
                    <MetricCard title="Tasa de rebote" value={`${summary?.bounceRate || 0}%`}
                        description="Porcentaje de visitantes que entraron y salieron sin interactuar con otras páginas (solo una página vista)."
                    />
                    <MetricCard title="Páginas vistas" value={summary?.pageViews?.toLocaleString() || '0'}
                        description="Total de páginas visualizadas. Es la suma de todas las visitas a todas las URLs."
                    />
                </Grid>

                {/* Gráfico de líneas (visitas diarias) */}
                <DailyVisitsChart
                    dateRange={dateRange}
                    dailyVisits={dailyVisits}
                />

                {/* Gráfico de barras para fuentes de tráfico */}
                <TrafficSourcesChart
                    trafficSources={trafficSources}
                />

                {/* MAPA DE CALOR (COROPLÉTICO) con carga desde CDN */}
                <HeatMap
                    topCountries={topCountries}
                />

                {/* TABLAS */}
                <Grid templateColumns={{ base: '1fr', lg: 'repeat(3, 1fr)' }} gap={4}>
                    <MostVisitedPagesTable topPages={topPages} />

                    <TrafficSourcesTable trafficSources={trafficSources} />

                    <VisitsByCountryTable topCountries={topCountries} />
                </Grid>
            </Stack>
        </ContainerSystem>
    );
}
