import { LineItem } from "./line-item";

export interface Basket {
    receiptNumber: number;
    cashierName: string;
    cashierId: number;
    date: Date;
    location: string;
    voided: boolean;
    lineItems: LineItem[];
}
