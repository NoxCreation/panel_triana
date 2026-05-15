'use client';

import { useEffect, useState } from 'react';
import {
    Box, Grid, Heading, Stack, HStack,
    Button, IconButton, Tooltip, useToast,
    Flex,
    Spinner
} from '@chakra-ui/react';
import { DownloadIcon } from '@chakra-ui/icons';
import { unparse } from 'papaparse';
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

// ==================== DATOS MOCK (estáticos) ====================
// Generar fechas relativas a hoy (para que siempre haya datos actualizados)
const generateDailyVisits = (days: number): DailyVisit[] => {
    const result: DailyVisit[] = [];
    const today = new Date();
    for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateStr = date.toISOString().slice(0, 10);
        // Datos simulados con tendencia ascendente + ruido
        const baseVisits = 1500 + i * 50;
        const visits = Math.floor(baseVisits + Math.random() * 300);
        const uniqueVisitors = Math.floor(visits * 0.6 + Math.random() * 200);
        result.push({ date: dateStr, visits, uniqueVisitors });
    }
    return result;
};

// Datos fijos (se generan una sola vez)
const FULL_MOCK = {
    summary: {
        totalVisits: 12458,
        uniqueVisitors: 5432,
        bounceRate: 38.5,
        pageViews: 18723,
    },
    dailyVisits: generateDailyVisits(60), // 60 días para cubrir rangos
    topPages: [
        { url: '/', visits: 5230 },
        { url: '/productos', visits: 3210 },
        { url: '/blog/guia-marketing', visits: 1870 },
        { url: '/contacto', visits: 1250 },
        { url: '/precios', visits: 890 },
    ],
    trafficSources: [
        { source: 'Google', visits: 4560, percentage: 36.6 },
        { source: 'Facebook', visits: 2340, percentage: 18.8 },
        { source: 'Directo', visits: 2100, percentage: 16.9 },
        { source: 'TikTok', visits: 1200, percentage: 9.6 },
        { source: 'YouTube', visits: 980, percentage: 7.9 },
        { source: 'Twitter', visits: 678, percentage: 5.4 },
    ],
    topCountries: [
        { country: 'Estados Unidos', visits: 4850, code: 'US' },
        { country: 'México', visits: 3120, code: 'MX' },
        { country: 'España', visits: 2560, code: 'ES' },
        { country: 'Colombia', visits: 1290, code: 'CO' },
        { country: 'Argentina', visits: 980, code: 'AR' },
        { country: 'Chile', visits: 720, code: 'CL' },
        { country: 'Perú', visits: 650, code: 'PE' },
        { country: 'Ecuador', visits: 430, code: 'EC' },
    ],
};

// Función para filtrar datos por rango (basado en fechas reales)
const filterDataByRange = (range: '7d' | 'thisMonth' | 'lastMonth') => {
    const today = new Date();
    let startDate: Date;
    let endDate: Date = today;

    if (range === '7d') {
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 7);
    } else if (range === 'thisMonth') {
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    } else { // lastMonth
        startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        endDate = new Date(today.getFullYear(), today.getMonth(), 0);
    }

    const filteredDaily = FULL_MOCK.dailyVisits.filter(d => {
        const date = new Date(d.date);
        return date >= startDate && date <= endDate;
    });

    // Para los demás datos (topPages, trafficSources, topCountries) no filtramos en mock,
    // pero en producción se filtrarían según las fechas.
    return {
        ...FULL_MOCK,
        dailyVisits: filteredDaily,
    };
};

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

    // Exportar a CSV (solo las visitas diarias)
    const exportToCSV = () => {
        const csv = unparse(dailyVisits);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `dashboard_${new Date().toISOString().slice(0, 19)}.csv`;
        link.click();
        URL.revokeObjectURL(link.href);
        toast({ title: 'Exportado a CSV', status: 'success' });
    };

    if (loading) {
        return (
            <Flex justify="center" align="center" minH="100vh">
                <Spinner size="xl" thickness="4px" speed="0.65s" label="Cargando métricas..." />
            </Flex>
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
                            colorScheme={dateRange === '7d' ? 'blue' : 'gray'}
                            onClick={() => setDateRange('7d')}
                        >
                            Últimos 7 días
                        </Button>
                        <Button
                            size="sm"
                            colorScheme={dateRange === 'thisMonth' ? 'blue' : 'gray'}
                            onClick={() => setDateRange('thisMonth')}
                        >
                            Este mes
                        </Button>
                        <Button
                            size="sm"
                            colorScheme={dateRange === 'lastMonth' ? 'blue' : 'gray'}
                            onClick={() => setDateRange('lastMonth')}
                        >
                            Mes pasado
                        </Button>
                        <Tooltip label="Exportar a CSV">
                            <IconButton
                                aria-label="Exportar CSV"
                                icon={<DownloadIcon />}
                                onClick={exportToCSV}
                                variant="outline"
                            />
                        </Tooltip>
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
                    <MetricCard title="Visitas totales" value={summary?.totalVisits?.toLocaleString() || '0'} />
                    <MetricCard title="Visitantes únicos" value={summary?.uniqueVisitors?.toLocaleString() || '0'} />
                    <MetricCard title="Tasa de rebote" value={`${summary?.bounceRate || 0}%`} />
                    <MetricCard title="Páginas vistas" value={summary?.pageViews?.toLocaleString() || '0'} />
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
                <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap={4}>
                    <MostVisitedPagesTable topPages={topPages} />

                    <TrafficSourcesTable trafficSources={trafficSources} />

                    <VisitsByCountryTable topCountries={topCountries} />
                </Grid>
            </Stack>
        </ContainerSystem>
    );
}
