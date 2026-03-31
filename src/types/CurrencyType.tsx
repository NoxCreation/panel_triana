export type CurrencyType = {
    id: string;
    code: string;
    name: string;
    exchangeRateToUsd: number;
    isLocal: boolean;
    isCardOnly: boolean;
}