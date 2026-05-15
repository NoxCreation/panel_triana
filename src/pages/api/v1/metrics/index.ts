// pages/api/v1/metrics.ts
import { prisma } from '@/utils/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

type DateRange = '7d' | 'thisMonth' | 'lastMonth';

// Helper para obtener fechas según el rango
function getDateRange(range: DateRange) {
    const now = new Date();
    let startDate: Date;
    let endDate: Date = new Date(now); // hasta hoy inclusive

    if (range === '7d') {
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
    } else if (range === 'thisMonth') {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    } else {
        // lastMonth
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        endDate = new Date(now.getFullYear(), now.getMonth(), 0); // último día del mes anterior
    }
    // Normalizar horas a 00:00:00 UTC
    startDate.setUTCHours(0, 0, 0, 0);
    endDate.setUTCHours(23, 59, 59, 999);
    return { startDate, endDate };
}

// Extraer dominio del referrer para clasificar fuente
function getTrafficSource(referrer: string | null): string {
    if (!referrer) return 'Directo';
    try {
        const url = new URL(referrer);
        const hostname = url.hostname.replace(/^www\./, '');
        if (hostname.includes('google.')) return 'Google';
        if (hostname.includes('facebook.') || hostname.includes('fb.')) return 'Facebook';
        if (hostname.includes('tiktok.')) return 'TikTok';
        if (hostname.includes('youtube.') || hostname.includes('youtu.be')) return 'YouTube';
        if (hostname.includes('twitter.')) return 'Twitter';
        if (hostname.includes('instagram.')) return 'Instagram';
        return hostname; // o 'Otro'
    } catch {
        return 'Otro';
    }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const range = (req.query.range as DateRange) || '7d';
        const { startDate, endDate } = getDateRange(range);

        // 1. Obtener todas las visitas en el período
        const pageViews = await prisma.pageView.findMany({
            where: {
                createdAt: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            select: {
                url: true,
                sessionId: true,
                referrer: true,
                country: true,
                countryName: true,
                createdAt: true,
            },
        });

        if (pageViews.length === 0) {
            return res.status(200).json({
                summary: { totalVisits: 0, uniqueVisitors: 0, bounceRate: 0, pageViews: 0 },
                dailyVisits: [],
                topPages: [],
                trafficSources: [],
                topCountries: [],
            });
        }

        // --- Métricas resumen ---
        const totalVisits = pageViews.length;
        const uniqueVisitors = new Set(pageViews.map(pv => pv.sessionId)).size;
        // pageViews es igual a totalVisits (cada registro es una página vista)
        const pageViewsCount = totalVisits;

        // Tasa de rebote: sesiones que vieron solo una página
        const sessionPageCounts = new Map<string, number>();
        pageViews.forEach(pv => {
            sessionPageCounts.set(pv.sessionId, (sessionPageCounts.get(pv.sessionId) || 0) + 1);
        });
        let bounceSessions = 0;
        for (const count of sessionPageCounts.values()) {
            if (count === 1) bounceSessions++;
        }
        const bounceRate = uniqueVisitors ? (bounceSessions / uniqueVisitors) * 100 : 0;

        const summary = {
            totalVisits,
            uniqueVisitors,
            bounceRate: parseFloat(bounceRate.toFixed(1)),
            pageViews: pageViewsCount,
        };

        // --- Visitas diarias (agrupadas por fecha) ---
        const dailyMap = new Map<string, { visits: number; uniqueVisitors: Set<string> }>();
        pageViews.forEach(pv => {
            const dateKey = pv.createdAt.toISOString().slice(0, 10); // YYYY-MM-DD
            if (!dailyMap.has(dateKey)) {
                dailyMap.set(dateKey, { visits: 0, uniqueVisitors: new Set() });
            }
            const entry = dailyMap.get(dateKey)!;
            entry.visits++;
            entry.uniqueVisitors.add(pv.sessionId);
        });
        const dailyVisits = Array.from(dailyMap.entries())
            .map(([date, { visits, uniqueVisitors }]) => ({
                date,
                visits,
                uniqueVisitors: uniqueVisitors.size,
            }))
            .sort((a, b) => a.date.localeCompare(b.date));

        // --- Páginas más visitadas ---
        const urlCount = new Map<string, number>();
        pageViews.forEach(pv => {
            urlCount.set(pv.url, (urlCount.get(pv.url) || 0) + 1);
        });
        const topPages = Array.from(urlCount.entries())
            .map(([url, visits]) => ({ url, visits }))
            .sort((a, b) => b.visits - a.visits)
            .slice(0, 10); // Top 10

        // --- Fuentes de tráfico ---
        const sourceCount = new Map<string, number>();
        pageViews.forEach(pv => {
            const source = getTrafficSource(pv.referrer);
            sourceCount.set(source, (sourceCount.get(source) || 0) + 1);
        });
        let trafficSources = Array.from(sourceCount.entries())
            .map(([source, visits]) => ({ source, visits, percentage: 0 }))
            .sort((a, b) => b.visits - a.visits);
        // Calcular porcentajes
        trafficSources = trafficSources.map(ts => ({
            ...ts,
            percentage: parseFloat(((ts.visits / totalVisits) * 100).toFixed(1)),
        }));

        // --- Países (top) ---
        const countryCount = new Map<string, number>();
        pageViews.forEach(pv => {
            if (pv.country) {
                countryCount.set(pv.country, (countryCount.get(pv.country) || 0) + 1);
            }
        });
        // Mapear código de país a nombre (puedes tener una tabla, pero usaremos el código como nombre por simplicidad)
        // Para coincidir con el mapa, necesitamos el código ISO. Asumimos que en el campo `country` guardaste el código (ej. "US").
        const countryMap = new Map<string, { visits: number; code: string }>();
        pageViews.forEach(pv => {
            if (pv.countryName && pv.country) {
                const key = pv.countryName;
                if (!countryMap.has(key)) {
                    countryMap.set(key, { visits: 0, code: pv.country });
                }
                countryMap.get(key)!.visits++;
            }
        });
        const topCountries = Array.from(countryMap.entries())
            .map(([country, { visits, code }]) => ({
                country,      // nombre completo
                visits,
                code,         // código ISO
            }))
            .sort((a, b) => b.visits - a.visits)
            .slice(0, 10);

        res.status(200).json({
            summary,
            dailyVisits,
            topPages,
            trafficSources,
            topCountries,
        });
    } catch (error) {
        console.error('Error fetching metrics:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}