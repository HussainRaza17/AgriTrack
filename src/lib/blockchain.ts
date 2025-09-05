import { Batch, Event, BatchFormData } from '@/types';

const STORAGE_KEY = 'agri_blockchain_data';
const FARMER_ID = 'farmer_001'; // Simulated farmer ID

// Generate unique batch ID
export const generateBatchID = (): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `AGRI-${timestamp}${random}`.toUpperCase();
};

// Get all batches from localStorage
export const getAllBatches = (): Record<string, Batch> => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : {};
};

// Save batches to localStorage
const saveBatches = (batches: Record<string, Batch>): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(batches));
};

// Get batches for current farmer
export const getFarmerBatches = (): Batch[] => {
  const allBatches = getAllBatches();
  return Object.values(allBatches).filter(batch => batch.farmerID === FARMER_ID);
};

// Get single batch by ID
export const getBatchById = (batchID: string): Batch | null => {
  const allBatches = getAllBatches();
  return allBatches[batchID] || null;
};

// Create new batch (simulate blockchain immutability)
export const createBatch = (formData: BatchFormData): Batch => {
  const batchID = generateBatchID();
  const now = new Date().toISOString();
  
  const initialEvent: Event = {
    timestamp: now,
    action: 'Harvested',
    actor: 'Farmer',
    details: `${formData.quantity}kg of ${formData.produceType} harvested at ${formData.location}`
  };

  const newBatch: Batch = {
    batchID,
    produceType: formData.produceType,
    quantity: formData.quantity,
    harvestDate: formData.harvestDate,
    location: formData.location,
    farmerID: FARMER_ID,
    status: 'Harvested',
    certificateUrl: formData.certificate ? `cert_${batchID}.pdf` : undefined,
    history: [initialEvent],
    createdAt: now
  };

  // Save to "blockchain" (localStorage)
  const allBatches = getAllBatches();
  allBatches[batchID] = newBatch;
  saveBatches(allBatches);

  return newBatch;
};

// Add event to batch history (simulate blockchain immutability)
export const addEventToBatch = (batchID: string, event: Omit<Event, 'timestamp'>): boolean => {
  const allBatches = getAllBatches();
  const batch = allBatches[batchID];
  
  if (!batch) return false;

  const newEvent: Event = {
    ...event,
    timestamp: new Date().toISOString()
  };

  // Simulate immutability - create new array instead of modifying existing
  batch.history = [...batch.history, newEvent];
  
  // Update status based on latest event action
  if (event.action.includes('Transferred to Distributor') || event.action.includes('Distributor')) {
    batch.status = 'At Distributor';
  } else if (event.action.includes('Dispatched') || event.action.includes('Transit')) {
    batch.status = 'In Transit';
  } else if (event.action.includes('Received at Retailer') || event.action.includes('Retailer')) {
    batch.status = 'At Retailer';
  } else if (event.action.includes('Sold')) {
    batch.status = 'Sold';
  }

  saveBatches(allBatches);
  return true;
};

// Generate QR code URL for batch
export const generateQRCodeURL = (batchID: string): string => {
  const baseURL = window.location.origin;
  return `${baseURL}/trace/${batchID}`;
};

// Get next possible status for a batch
export const getNextStatus = (currentStatus: string): string | null => {
  const statusFlow = {
    'Harvested': 'At Distributor',
    'At Distributor': 'In Transit',
    'In Transit': 'At Retailer',
    'At Retailer': 'Sold'
  };
  
  return statusFlow[currentStatus as keyof typeof statusFlow] || null;
};

// Check if batch can be updated
export const canUpdateBatchStatus = (batch: Batch): boolean => {
  return batch.status !== 'Sold' && getNextStatus(batch.status) !== null;
};

// Initialize with sample data if empty
export const initializeSampleData = (): void => {
  const existingData = getAllBatches();
  if (Object.keys(existingData).length === 0) {
    // Create sample batch
    const sampleBatch = createBatch({
      produceType: 'Tomatoes',
      quantity: 150,
      harvestDate: '2024-08-15',
      location: 'Green Valley Farm, Odisha'
    });

    // Add some sample events with delays to show progression
    setTimeout(() => {
      addEventToBatch(sampleBatch.batchID, {
        action: 'Transferred to Distributor',
        actor: 'Farmer',
        details: 'Batch transferred to ABC Distribution Center for quality inspection and packaging'
      });
    }, 100);

    setTimeout(() => {
      addEventToBatch(sampleBatch.batchID, {
        action: 'Dispatched for Delivery',
        actor: 'Distributor',
        details: 'Quality check completed. Batch dispatched via refrigerated truck to retail locations'
      });
    }, 200);
  }
};