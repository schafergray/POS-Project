import { Item } from "./item";

export interface LineItem {
    items: Item[];
    quantity: number;
    voided: boolean;
}
