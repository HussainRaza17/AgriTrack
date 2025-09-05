import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Package, Eye, Leaf, BarChart3, RefreshCw } from 'lucide-react';
import { getFarmerBatches, initializeSampleData, canUpdateBatchStatus } from '@/lib/blockchain';
import { Batch } from '@/types';

export default function FarmerDashboard() {
  const navigate = useNavigate();
  const [batches, setBatches] = useState<Batch[]>([]);

  useEffect(() => {
    // Initialize sample data if needed
    initializeSampleData();
    
    // Load farmer's batches
    const farmerBatches = getFarmerBatches();
    setBatches(farmerBatches);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Harvested': return 'bg-green-100 text-green-800';
      case 'In Transit': return 'bg-yellow-100 text-yellow-800';
      case 'At Distributor': return 'bg-blue-100 text-blue-800';
      case 'At Retailer': return 'bg-purple-100 text-purple-800';
      case 'Sold': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const refreshBatches = () => {
    const farmerBatches = getFarmerBatches();
    setBatches(farmerBatches);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Agricultural Supply Chain Dashboard
              </h1>
              <p className="text-lg text-muted-foreground">
                Manage your produce batches and track their journey through the supply chain
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={refreshBatches}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <div className="flex items-center space-x-2">
                <Leaf className="w-8 h-8 text-green-600" />
                <span className="text-xl font-semibold text-green-600">AgriTrace</span>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Batches</p>
                    <p className="text-2xl font-bold">{batches.length}</p>
                  </div>
                  <Package className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active Batches</p>
                    <p className="text-2xl font-bold">
                      {batches.filter(b => b.status !== 'Sold').length}
                    </p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Updatable</p>
                    <p className="text-2xl font-bold">
                      {batches.filter(b => canUpdateBatchStatus(b)).length}
                    </p>
                  </div>
                  <RefreshCw className="w-8 h-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Quantity</p>
                    <p className="text-2xl font-bold">
                      {batches.reduce((sum, batch) => sum + batch.quantity, 0)} kg
                    </p>
                  </div>
                  <Leaf className="w-8 h-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Register New Batch Card */}
          <div className="lg:col-span-1">
            <Card className="h-full border-2 border-dashed border-green-300 bg-green-50/50 hover:bg-green-50 transition-colors">
              <CardContent className="p-6 text-center h-full flex flex-col justify-center">
                <Plus className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Register New Batch</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Add a new produce batch to the blockchain
                </p>
                <Button 
                  onClick={() => navigate('/register')}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* My Batches */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="w-5 h-5 mr-2" />
                  My Batches
                </CardTitle>
              </CardHeader>
              <CardContent>
                {batches.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No batches yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Start by registering your first produce batch
                    </p>
                    <Button onClick={() => navigate('/register')}>
                      Register First Batch
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {batches.map((batch) => (
                      <div
                        key={batch.batchID}
                        className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                              <Package className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                              <h4 className="font-medium">{batch.batchID}</h4>
                              <p className="text-sm text-muted-foreground">
                                {batch.produceType} • {batch.quantity} kg
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={getStatusColor(batch.status)}>
                              {batch.status}
                            </Badge>
                            {canUpdateBatchStatus(batch) && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigate(`/update-status/${batch.batchID}`)}
                                className="text-orange-600 border-orange-200 hover:bg-orange-50"
                              >
                                <RefreshCw className="w-4 h-4 mr-1" />
                                Update
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate(`/trace/${batch.batchID}`)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Harvest Date</p>
                            <p className="font-medium">{formatDate(batch.harvestDate)}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Location</p>
                            <p className="font-medium truncate">{batch.location}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Events</p>
                            <p className="font-medium">{batch.history.length}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Last Updated</p>
                            <p className="font-medium">{formatDate(batch.history[batch.history.length - 1].timestamp)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Powered by blockchain technology • Secure • Transparent • Immutable
          </p>
        </div>
      </div>
    </div>
  );
}