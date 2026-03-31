
type FilterConfig = {
    /** Campos que aceptan búsqueda por texto libre (OR, contains, insensitive) */
    searchFields?: string[];
    /** Campos que aceptan filtros exactos (igualdad) */
    exactFields?: string[];
    /** Campos que aceptan operadores de rango (__gte, __lte, __gt, __lt) */
    rangeFields?: string[];
    /** Campos booleanos (convierten 'true'/'false' o '1'/'0' a boolean) */
    booleanFields?: string[];
};

type FilterOptions = {
    config: FilterConfig;
    query: Record<string, any>;
    defaultSort?: string;      // formato 'campo:asc' o 'campo:desc'
    defaultLimit?: number;
    maxLimit?: number;
};

export function buildFilters<TWhereInput>({
    config,
    query,
    defaultSort = 'createdAt:desc',
    defaultLimit = 10,
    maxLimit = 100,
}: FilterOptions): {
    where: TWhereInput;
    orderBy: Record<string, 'asc' | 'desc'>;
    skip: number;
    take: number;
} {
    const where: any = {};

    // 1. Filtros exactos
    if (config.exactFields) {
        for (const field of config.exactFields) {
            if (query[field] !== undefined) {
                where[field] = query[field];
            }
        }
    }

    // 2. Filtros booleanos
    if (config.booleanFields) {
        for (const field of config.booleanFields) {
            const val = query[field];
            if (val !== undefined) {
                if (val === 'true' || val === '1') where[field] = true;
                else if (val === 'false' || val === '0') where[field] = false;
                else where[field] = val; // si ya es boolean
            }
        }
    }

    // 3. Filtros de rango (ej: precio__gte=100, createdAt__lte=2025-01-01)
    if (config.rangeFields) {
        for (const field of config.rangeFields) {
            const gte = query[`${field}__gte`];
            const lte = query[`${field}__lte`];
            const gt = query[`${field}__gt`];
            const lt = query[`${field}__lt`];

            if (gte !== undefined || lte !== undefined || gt !== undefined || lt !== undefined) {
                where[field] = {};
                if (gte !== undefined) where[field].gte = gte;
                if (lte !== undefined) where[field].lte = lte;
                if (gt !== undefined) where[field].gt = gt;
                if (lt !== undefined) where[field].lt = lt;
            }
        }
    }

    // 4. Búsqueda general (OR) en campos de texto
    if (query.search && config.searchFields?.length) {
        where.OR = config.searchFields.map((field) => ({
            [field]: { contains: query.search, mode: 'insensitive' },
        }));
    }

    // 5. Paginación
    const page = Math.max(1, parseInt(query.page as string, 10) || 1);
    const limit = Math.min(maxLimit, Math.max(1, parseInt(query.limit as string, 10) || defaultLimit));
    const skip = (page - 1) * limit;

    // 6. Ordenamiento
    let orderBy: Record<string, 'asc' | 'desc'> = {};
    if (query.sort) {
        const [field, direction] = (query.sort as string).split(':');
        orderBy[field] = direction === 'desc' ? 'desc' : 'asc';
    } else {
        const [field, direction] = defaultSort.split(':');
        orderBy[field] = direction === 'desc' ? 'desc' : 'asc';
    }

    return {
        where: where as TWhereInput,
        orderBy,
        skip,
        take: limit,
    };
}