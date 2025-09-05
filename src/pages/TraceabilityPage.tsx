import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MapPin, Calendar, User, Package, FileText, Clock } from 'lucide-react';
import { getBatchById } from '@/lib/blockchain';
import { Batch } from '@/types';

export default function TraceabilityPage() {
  const { batchId } = useParams<{ batchId: string }>();
  const [batch, setBatch] = useState<Batch | null>(null);

  useEffect(() => {
    if (batchId) {
      const batchData = getBatchById(batchId);
      setBatch(batchData);
    }
  }, [batchId]);

  if (!batch) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Batch Not Found</h2>
            <p className="text-muted-foreground">
              The requested batch could not be found in the blockchain.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <Package className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Scan to Trace: {batch.produceType}
          </h1>
          <p className="text-lg text-muted-foreground">
            Complete supply chain journey for Batch {batch.batchID}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Key Details */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="w-5 h-5 mr-2" />
                  Batch Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Status</span>
                  <Badge className={getStatusColor(batch.status)}>
                    {batch.status}
                  </Badge>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <User className="w-4 h-4 mt-1 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Farm</p>
                      <p className="text-sm text-muted-foreground">Farm XYZ</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-4 h-4 mt-1 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Location</p>
                      <p className="text-sm text-muted-foreground">{batch.location}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Calendar className="w-4 h-4 mt-1 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Harvest Date</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(batch.harvestDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Package className="w-4 h-4 mt-1 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Quantity</p>
                      <p className="text-sm text-muted-foreground">{batch.quantity} kg</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Certifications */}
            {batch.certificateUrl && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Certifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <FileText className="w-8 h-8 text-green-600" />
                    <div>
                      <p className="text-sm font-medium">Quality Certificate</p>
                      <p className="text-xs text-muted-foreground">Verified and uploaded</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Supply Chain Journey */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Supply Chain Journey
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Complete timeline of events recorded on the blockchain
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {batch.history.map((event, index) => (
                    <div key={index} className="relative">
                      {/* Timeline line */}
                      {index < batch.history.length - 1 && (
                        <div className="absolute left-4 top-8 w-0.5 h-16 bg-gray-200" />
                      )}
                      
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <div className="w-3 h-3 bg-green-600 rounded-full" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="text-sm font-medium text-gray-900">
                              {event.action}
                            </h4>
                            <Badge variant="outline" className="text-xs">
                              {event.actor}
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-2">
                            {event.details}
                          </p>
                          
                          <p className="text-xs text-gray-500">
                            {formatDate(event.timestamp)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <Card className="bg-gray-50">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">
                This information is secured by blockchain technology and cannot be altered.
                <br />
                Batch ID: <span className="font-mono font-medium">{batch.batchID}</span>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}