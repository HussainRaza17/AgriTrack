import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Truck, Building, Store, CheckCircle } from 'lucide-react';
import { getBatchById, addEventToBatch } from '@/lib/blockchain';
import { Batch } from '@/types';

const STATUS_PROGRESSION = {
  'Harvested': {
    next: 'At Distributor',
    action: 'Transferred to Distributor',
    actor: 'Farmer',
    icon: Building,
    description: 'Batch has been transferred to the distribution center'
  },
  'At Distributor': {
    next: 'In Transit',
    action: 'Dispatched for Delivery',
    actor: 'Distributor',
    icon: Truck,
    description: 'Batch is now in transit to retailer'
  },
  'In Transit': {
    next: 'At Retailer',
    action: 'Received at Retailer',
    actor: 'Logistics',
    icon: Store,
    description: 'Batch has been delivered and received at retail location'
  },
  'At Retailer': {
    next: 'Sold',
    action: 'Sold to Consumer',
    actor: 'Retailer',
    icon: CheckCircle,
    description: 'Batch has been sold to end consumer'
  }
};

export default function UpdateStatus() {
  const { batchId } = useParams<{ batchId: string }>();
  const navigate = useNavigate();
  const [batch, setBatch] = useState<Batch | null>(null);
  const [customDetails, setCustomDetails] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (batchId) {
      const batchData = getBatchById(batchId);
      setBatch(batchData);
      
      // Set default details based on current status
      if (batchData && STATUS_PROGRESSION[batchData.status as keyof typeof STATUS_PROGRESSION]) {
        const progression = STATUS_PROGRESSION[batchData.status as keyof typeof STATUS_PROGRESSION];
        setCustomDetails(progression.description);
      }
    }
  }, [batchId]);

  if (!batch) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">Batch Not Found</h2>
            <p className="text-muted-foreground mb-4">The requested batch could not be found.</p>
            <Button onClick={() => navigate('/')}>Return to Dashboard</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentProgression = STATUS_PROGRESSION[batch.status as keyof typeof STATUS_PROGRESSION];
  
  if (!currentProgression) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Batch Complete</h2>
            <p className="text-muted-foreground mb-4">
              This batch has reached its final status and cannot be updated further.
            </p>
            <Button onClick={() => navigate('/')}>Return to Dashboard</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleStatusUpdate = async () => {
    if (!batch || !currentProgression) return;

    setIsUpdating(true);

    // Simulate processing time
    setTimeout(() => {
      const success = addEventToBatch(batch.batchID, {
        action: currentProgression.action,
        actor: currentProgression.actor,
        details: customDetails || currentProgression.description
      });

      setIsUpdating(false);

      if (success) {
        navigate(`/trace/${batch.batchID}`);
      } else {
        alert('Failed to update batch status. Please try again.');
      }
    }, 1500);
  };

  const IconComponent = currentProgression.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Update Batch Status</h1>
          <p className="text-muted-foreground">Update the supply chain status for batch {batch.batchID}</p>
        </div>

        <div className="space-y-6">
          {/* Current Batch Info */}
          <Card>
            <CardHeader>
              <CardTitle>Current Batch Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Batch ID</p>
                  <p className="text-lg font-mono">{batch.batchID}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Produce</p>
                  <p className="text-lg">{batch.produceType} ({batch.quantity} kg)</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Current Status</p>
                  <p className="text-lg font-semibold text-blue-600">{batch.status}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Last Updated</p>
                  <p className="text-sm">{new Date(batch.history[batch.history.length - 1].timestamp).toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status Update Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <IconComponent className="w-5 h-5 mr-2 text-green-600" />
                Update to: {currentProgression.next}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Status Change Details</h4>
                <p className="text-sm text-blue-700">
                  <strong>Action:</strong> {currentProgression.action}<br />
                  <strong>Actor:</strong> {currentProgression.actor}<br />
                  <strong>New Status:</strong> {currentProgression.next}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="details">Event Details</Label>
                <Textarea
                  id="details"
                  value={customDetails}
                  onChange={(e) => setCustomDetails(e.target.value)}
                  placeholder="Enter additional details about this status change..."
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  Describe any relevant information about this status change (optional)
                </p>
              </div>

              <div className="pt-4">
                <Button 
                  onClick={handleStatusUpdate}
                  disabled={isUpdating}
                  className="w-full bg-green-600 hover:bg-green-700"
                  size="lg"
                >
                  {isUpdating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Updating Status...
                    </>
                  ) : (
                    <>
                      <IconComponent className="w-4 h-4 mr-2" />
                      Update to {currentProgression.next}
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Supply Chain Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Supply Chain Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(STATUS_PROGRESSION).map(([status, info], index) => {
                  const isCompleted = batch.history.some(event => event.action.includes(status) || batch.status === status);
                  const isCurrent = batch.status === status;
                  const isNext = currentProgression?.next === status;
                  
                  return (
                    <div key={status} className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isCompleted ? 'bg-green-100 text-green-600' :
                        isCurrent ? 'bg-blue-100 text-blue-600' :
                        isNext ? 'bg-yellow-100 text-yellow-600' :
                        'bg-gray-100 text-gray-400'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-current" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={`font-medium ${
                          isCurrent ? 'text-blue-600' : 
                          isNext ? 'text-yellow-600' :
                          isCompleted ? 'text-green-600' : 'text-gray-400'
                        }`}>
                          {status}
                        </p>
                        {isCurrent && (
                          <p className="text-xs text-blue-500">Current Status</p>
                        )}
                        {isNext && (
                          <p className="text-xs text-yellow-600">Next Status</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}