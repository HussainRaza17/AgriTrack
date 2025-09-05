import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import RegisterBatch from './pages/RegisterBatch';
import BatchConfirmation from './pages/BatchConfirmation';
import TraceabilityPage from './pages/TraceabilityPage';
import UpdateStatus from './pages/UpdateStatus';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/register" element={<RegisterBatch />} />
          <Route path="/confirmation/:batchId" element={<BatchConfirmation />} />
          <Route path="/trace/:batchId" element={<TraceabilityPage />} />
          <Route path="/update-status/:batchId" element={<UpdateStatus />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;