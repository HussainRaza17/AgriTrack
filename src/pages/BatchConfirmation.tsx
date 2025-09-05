import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, ArrowLeft, Eye } from 'lucide-react';
import { getBatchById, generateQRCodeURL } from '@/lib/blockchain';
import { QRCodeGenerator } from '@/components/QRCodeGenerator';
import { Batch } from '@/types';

export default function BatchConfirmation() {
  const { batchId } = useParams<{ batchId: string }>();
  const navigate = useNavigate();
  const [batch, setBatch] = useState<Batch | null>(null);

  useEffect(() => {
    if (batchId) {
      const batchData = getBatchById(batchId);
      setBatch(batchData);
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

  const qrCodeURL = generateQRCodeURL(batch.batchID);

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
        </div>

        <div className="space-y-6">
          {/* Success Message */}
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-6 text-center">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-green-800 mb-2">
                Batch {batch.batchID} Created Successfully!
              </h1>
              <p className="text-green-700">
                Your produce batch has been registered on the blockchain and is now traceable.
              </p>
            </CardContent>
          </Card>

          {/* Batch Details */}
          <Card>
            <CardHeader>
              <CardTitle>Batch Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Produce Type</p>
                  <p className="text-lg">{batch.produceType}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Quantity</p>
                  <p className="text-lg">{batch.quantity} kg</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Harvest Date</p>
                  <p className="text-lg">{new Date(batch.harvestDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Location</p>
                  <p className="text-lg">{batch.location}</p>
                </div>
              </div>
              
              {batch.certificateUrl && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Quality Certificate</p>
                  <p className="text-sm text-blue-600">✓ Certificate uploaded</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* QR Code */}
          <Card>
            <CardHeader>
              <CardTitle className="text-center">QR Code for Traceability</CardTitle>
              <p className="text-center text-muted-foreground">
                Share this QR code with consumers to allow them to trace your produce
              </p>
            </CardHeader>
            <CardContent>
              <QRCodeGenerator batchID={batch.batchID} url={qrCodeURL} />
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={() => navigate(`/trace/${batch.batchID}`)}
              variant="outline"
              className="flex-1"
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview Traceability Page
            </Button>
            <Button 
              onClick={() => navigate('/')}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              Return to Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}