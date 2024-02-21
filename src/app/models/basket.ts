import { LineItem } from "./line-item";

export interface Basket {
    basketStarted: boolean;
    receiptNumber: number;
    cashierName: string;
    cashierId: number;
    date: Date;
    location: string;
    voided: boolean;
    lineItems: LineItem[];
    subTotal: number;
    taxApplied: number;
    total: number;
}
