export interface Event {
  timestamp: string;
  action: string;
  actor: string;
  details: string;
}

export interface Batch {
  batchID: string;
  produceType: string;
  quantity: number;
  harvestDate: string;
  location: string;
  farmerID: string;
  status: string;
  certificateUrl?: string;
  history: Event[];
  createdAt: string;
}

export interface BatchFormData {
  produceType: string;
  quantity: number;
  harvestDate: string;
  location: string;
  certificate?: File;
}

export const PRODUCE_TYPES = [
  'Rice',
  'Wheat',
  'Tomatoes',
  'Potatoes',
  'Onions',
  'Corn',
  'Soybeans',
  'Cotton',
  'Sugarcane',
  'Tea',
  'Coffee'
] as const;

export const BATCH_STATUSES = [
  'Harvested',
  'In Transit',
  'At Distributor',
  'At Retailer',
  'Sold'
] as const;