import { Item } from "./item";

export interface LineItem {
    item: Item;
    quantity: number;
    voided: boolean;
}
