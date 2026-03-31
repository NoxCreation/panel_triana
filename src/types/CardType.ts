import { CurrencyType } from "./CurrencyType";

export type CardType = {
    id: string;
    number: string;
    name: string;
    currencyId: string;
    currency: CurrencyType
}