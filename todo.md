# Agricultural Supply Chain Traceability App - MVP Implementation

## Core Features to Implement:
1. **Farmer Dashboard** - Main interface for farmers
2. **Batch Registration Form** - Form to register new produce batches
3. **Batch Confirmation** - Success screen with QR code
4. **Public Traceability Page** - Consumer-facing batch history
5. **Data Management** - localStorage simulation of blockchain

## Files to Create/Modify:

### 1. `src/pages/Index.tsx` - Main Dashboard
- Navigation between farmer and consumer views
- Farmer's batch list
- Register new batch button

### 2. `src/pages/RegisterBatch.tsx` - Batch Registration Form
- Form with produce type, quantity, harvest date, location
- File upload simulation for quality certificate
- Submit to blockchain functionality

### 3. `src/pages/BatchConfirmation.tsx` - Confirmation Screen
- Display generated batch ID
- QR code generation and display
- Download QR code functionality

### 4. `src/pages/TraceabilityPage.tsx` - Public Traceability
- Display batch details and supply chain journey
- Timeline of events
- Certifications section

### 5. `src/lib/blockchain.ts` - Data Management
- localStorage-based data persistence
- Batch creation and management
- Event logging with immutability simulation

### 6. `src/components/QRCodeGenerator.tsx` - QR Code Component
- Generate QR codes for batches
- Download functionality

### 7. `src/types/index.ts` - Type definitions
- Batch, Event, and other data structures

### 8. Update `src/App.tsx` - Routing
- Add routes for all pages

## Data Structure:
```typescript
interface Batch {
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

interface Event {
  timestamp: string;
  action: string;
  actor: string;
  details: string;
}
```

## Implementation Priority:
1. Set up types and data management
2. Create farmer dashboard
3. Build registration form
4. Add confirmation screen with QR code
5. Create public traceability page
6. Test complete user flow