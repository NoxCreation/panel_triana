export interface MetricSummary {
    totalVisits: number;
    uniqueVisitors: number;
    bounceRate: number;
    pageViews: number;
}

export interface DailyVisit {
    date: string;
    visits: number;
    uniqueVisitors: number;
}

export interface TopPage {
    url: string;
    visits: number;
}

export interface TrafficSource {
    source: string;
    visits: number;
    percentage: number;
}

export interface TopCountry {
    country: string;
    visits: number;
    code: string;
}