export type SelectionInfo = { serviceGroup: string; service: string; quantity: number; pricePerItem: number };

export interface ISelectionRecord extends SelectionInfo {
  id: number;
  price: number;
}
