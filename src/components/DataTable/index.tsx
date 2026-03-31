// components/DataTable.tsx
import {
    Box,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Skeleton,
    Flex,
    Text,
    Button,
} from '@chakra-ui/react';
import {
    useReactTable,
    getCoreRowModel,
    getExpandedRowModel,
    flexRender,
    ColumnDef,
    SortingState,
    OnChangeFn,
} from '@tanstack/react-table';
import { FiChevronDown } from 'react-icons/fi';
import { useImperativeHandle, forwardRef, useState, useEffect, useRef, useCallback } from 'react';
import { PaginationMain } from '../Pagination';
import React from 'react';

export interface PaginationMeta {
    total: number;
    page: number;      // base 1 (viene de la API)
    limit: number;
    totalPages: number;
}

export interface FetchDataResult<T> {
    data: T[];
    meta: PaginationMeta;
}

export type FetchDataFunction<T> = (params: {
    page: number;      // base 1
    limit: number;
    sort?: string;
    [key: string]: any;
}) => Promise<FetchDataResult<T>>;

export type ExtendedColumnDef<T> = ColumnDef<T> & {
    sticky?: 'left' | 'right';
};

export type TableMode = 'pagination' | 'infinite';

export interface DataTableProps<T> {
    fetchData: FetchDataFunction<T>;
    columns: ExtendedColumnDef<T>[];
    defaultPageSize?: number;
    enableExpanding?: boolean;
    getSubRows?: (row: T) => T[] | undefined;
    mode?: TableMode;                // 'pagination' (por defecto) o 'infinite'
    ref?: React.Ref<DataTableRef<T>>
}

export interface DataTableRef<T> {
    refresh: () => void;
    setPage: (page: number) => void;    // base 1
    loadMore: () => void;                // solo para modo infinite
    getState: () => { page: number; limit: number; sort: string | null; hasMore: boolean };
    reset: () => void;                   // vuelve a página 1 y limpia datos
    setFilters: (filters: Record<string, any>) => void;
}

function DataTableInner<T>(props: DataTableProps<T>, ref: React.Ref<DataTableRef<T>>) {
    const {
        fetchData,
        columns,
        defaultPageSize = 10,
        enableExpanding = false,
        getSubRows,
        mode = 'pagination',
    } = props;

    // Estados
    const [data, setData] = useState<T[]>([]);
    const [meta, setMeta] = useState<PaginationMeta>({
        total: 0,
        page: 1,                         // base 1
        limit: defaultPageSize,
        totalPages: 0,
    });
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [expanded, setExpanded] = useState({});
    const [filters, setFilters] = useState<Record<string, any>>({});

    // Referencia para abortar peticiones anteriores
    const abortControllerRef = useRef<AbortController>();

    // Calcula si hay más páginas en modo infinite
    const hasMore = meta.page < meta.totalPages;

    // Función para cargar datos (página específica)
    const loadData = useCallback(async (page: number, isLoadMore = false) => {
        // Abortar petición anterior si existe
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        abortControllerRef.current = new AbortController();
        const signal = abortControllerRef.current.signal;

        // Activar estado de carga según el tipo
        if (isLoadMore) {
            setLoadingMore(true);
        } else {
            setLoading(true);
        }

        try {
            const sortParam = sorting.length > 0
                ? `${sorting[0].id}:${sorting[0].desc ? 'desc' : 'asc'}`
                : undefined;

            const result = await fetchData({
                page,
                limit: meta.limit,
                sort: sortParam,
                ...filters,
            });

            // Si la petición fue abortada, no actualizar estado
            if (signal.aborted) return;

            if (isLoadMore) {
                // Acumular datos
                setData(prev => [...prev, ...result.data]);
            } else {
                // Reemplazar datos
                setData(result.data);
            }
            setMeta(result.meta);
        } catch (error: any) {
            if (error.name === 'AbortError' || error.message?.includes('abort')) {
                return; // Ignorar errores de aborto
            }
            console.error('Error fetching data:', error);
        } finally {
            if (!signal.aborted) {
                if (isLoadMore) {
                    setLoadingMore(false);
                } else {
                    setLoading(false);
                }
            }
        }
    }, [fetchData, meta.limit, sorting, filters]);

    // Efecto para carga inicial y cambios de orden/página en modo paginación
    useEffect(() => {
        if (mode === 'pagination') {
            loadData(meta.page, false);
        } else {
            // En modo infinite, solo cargamos si no hay datos
            if (data.length === 0) {
                loadData(1, false);
            }
        }
    }, [mode, meta.page, sorting, meta.limit, filters]); // Dependencias controladas

    // Manejador de cambio de página (solo para modo paginación)
    const handlePageChange = (page: number) => {
        if (mode === 'pagination') {
            setMeta(prev => ({ ...prev, page }));
        }
    };

    // Manejador de ordenamiento
    const handleSortingChange: OnChangeFn<SortingState> = (updater) => {
        setSorting(updater);
        // Al ordenar, volver a página 1
        setMeta(prev => ({ ...prev, page: 1 }));
        // En modo infinite, limpiar datos acumulados
        if (mode === 'infinite') {
            setData([]);
        }
    };

    // Configuración de TanStack Table
    const table = useReactTable({
        data,
        columns,
        state: { sorting, expanded },
        onSortingChange: handleSortingChange,
        onExpandedChange: setExpanded,
        getCoreRowModel: getCoreRowModel(),
        getExpandedRowModel: enableExpanding ? getExpandedRowModel() : undefined,
        getSubRows,
        manualSorting: true,
        manualPagination: true,
        pageCount: meta.totalPages,
    });

    // Exponer métodos mediante ref
    useImperativeHandle(ref, () => ({
        refresh: () => {
            if (mode === 'infinite') {
                setData([]);
                loadData(1, false);
            } else {
                loadData(meta.page, false);
            }
        },
        setPage: (page: number) => {
            if (mode === 'pagination') {
                setMeta(prev => ({ ...prev, page }));
            }
        },
        loadMore: () => {
            if (mode === 'infinite' && hasMore && !loadingMore) {
                const nextPage = meta.page + 1;
                loadData(nextPage, true);
                setMeta(prev => ({ ...prev, page: nextPage }));
            }
        },
        getState: () => ({
            page: meta.page,
            limit: meta.limit,
            sort: sorting.length > 0 ? `${sorting[0].id}:${sorting[0].desc ? 'desc' : 'asc'}` : null,
            hasMore,
        }),
        reset: () => {
            setData([]);
            setMeta(prev => ({ ...prev, page: 1 }));
            if (mode === 'infinite') {
                loadData(1, false);
            }
        },
        setFilters: (newFilters: Record<string, any>) => {
            setFilters(newFilters);
            setMeta(prev => ({ ...prev, page: 1 })); // resetear a primera página
            if (mode === 'infinite') {
                setData([]); // limpiar datos acumulados
            }
        },
    }));

    const rows = table.getRowModel().rows;

    return (
        <Box width="100%" overflow="auto" position="relative">
            <Table
                variant="simple"
                size="sm"
                sx={{
                    borderCollapse: 'separate',
                    borderSpacing: 0,
                    'thead tr th': {
                        position: 'sticky',
                        top: 0,
                        bg: 'white',
                        zIndex: 1,
                        boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                    },
                }}
            >
                <Thead>
                    {table.getHeaderGroups().map(headerGroup => (
                        <Tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => {
                                const columnDef = header.column.columnDef as ExtendedColumnDef<T>;
                                const sticky = columnDef.sticky;
                                return (
                                    <Th
                                        key={header.id}
                                        colSpan={header.colSpan}
                                        onClick={header.column.getToggleSortingHandler()}
                                        cursor={header.column.getCanSort() ? 'pointer' : 'default'}
                                        sx={{
                                            position: sticky ? 'sticky' : undefined,
                                            left: sticky === 'left' ? 0 : undefined,
                                            right: sticky === 'right' ? 0 : undefined,
                                            zIndex: sticky ? 2 : undefined,
                                            bg: sticky ? 'white' : undefined,
                                        }}
                                    >
                                        <Flex align="center">
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                            {header.column.getIsSorted() && (
                                                <Text as="span" ml={1}>
                                                    {header.column.getIsSorted() === 'asc' ? ' ↑' : ' ↓'}
                                                </Text>
                                            )}
                                        </Flex>
                                    </Th>
                                );
                            })}
                        </Tr>
                    ))}
                </Thead>
                <Tbody>
                    {loading ? (
                        Array.from({ length: meta.limit }).map((_, index) => (
                            <Tr key={`skeleton-${index}`}>
                                {columns.map((_, colIndex) => (
                                    <Td key={colIndex}>
                                        <Skeleton height="20px" />
                                    </Td>
                                ))}
                            </Tr>
                        ))
                    ) : (
                        rows.map((row) => (
                            <React.Fragment key={row.id}>
                                <Tr>
                                    {row.getVisibleCells().map(cell => {
                                        const columnDef = cell.column.columnDef as ExtendedColumnDef<T>;
                                        const sticky = columnDef.sticky;
                                        return (
                                            <Td
                                                key={cell.id}
                                                sx={{
                                                    position: sticky ? 'sticky' : undefined,
                                                    left: sticky === 'left' ? 0 : undefined,
                                                    right: sticky === 'right' ? 0 : undefined,
                                                    zIndex: sticky ? 1 : undefined,
                                                    bg: sticky ? 'white' : undefined,
                                                }}
                                            >
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </Td>
                                        );
                                    })}
                                </Tr>
                                {enableExpanding && row.getIsExpanded() && (
                                    <Tr>
                                        <Td colSpan={columns.length}>
                                            {/* Contenido expandido personalizado */}
                                        </Td>
                                    </Tr>
                                )}
                            </React.Fragment>
                        ))
                    )}
                </Tbody>
            </Table>

            {/* Controles de paginación o carga infinita */}
            {!loading && (
                <Flex justifyContent="center" mt={4} direction="column" align="center">
                    {mode === 'pagination' && meta.totalPages > 0 && (
                        <PaginationMain
                            count={meta.total}
                            page={meta.page - 1} // El componente usa base 0, convertimos
                            pageSize={meta.limit}
                            onPageSelect={(page) => handlePageChange(page + 1)}
                        />
                    )}
                    {mode === 'infinite' && hasMore && (
                        <Button
                            size="sm"
                            onClick={() => {
                                if (ref && 'current' in ref && ref.current) {
                                    (ref.current as DataTableRef<T>).loadMore();
                                }
                            }}
                            isLoading={loadingMore}
                            loadingText="Cargando..."
                            leftIcon={<FiChevronDown />}
                            mt={2} minW={"400px"}
                            color={'primary.500'}
                            variant={'ghost'}
                        >
                            Cargar más
                        </Button>
                    )}
                </Flex>
            )}
        </Box>
    );
}

export const DataTable = forwardRef(DataTableInner) as <T>(
    props: DataTableProps<T> & { ref?: React.Ref<DataTableRef<T>> }
) => React.ReactElement;