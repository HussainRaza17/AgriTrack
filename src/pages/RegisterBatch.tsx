import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Upload, Loader2, ArrowLeft } from 'lucide-react';
import { PRODUCE_TYPES, BatchFormData } from '@/types';
import { createBatch } from '@/lib/blockchain';

export default function RegisterBatch() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<BatchFormData>({
    produceType: '',
    quantity: 0,
    harvestDate: '',
    location: '',
  });
  const [certificate, setCertificate] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.produceType || !formData.quantity || !formData.harvestDate || !formData.location) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    // Simulate blockchain processing time
    setTimeout(() => {
      const batch = createBatch({
        ...formData,
        certificate: certificate || undefined
      });
      
      setIsSubmitting(false);
      navigate(`/confirmation/${batch.batchID}`);
    }, 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCertificate(file);
    }
  };

  if (isSubmitting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-green-600" />
            <h2 className="text-xl font-semibold mb-2">Processing Batch Registration</h2>
            <p className="text-muted-foreground">Generating Batch ID and QR Code...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

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
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Register New Batch</h1>
          <p className="text-muted-foreground">Enter the details of your produce batch for blockchain registration</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Batch Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="produceType">Produce Type *</Label>
                  <Select 
                    value={formData.produceType} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, produceType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select produce type" />
                    </SelectTrigger>
                    <SelectContent>
                      {PRODUCE_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity (kg) *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={formData.quantity || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 0 }))}
                    placeholder="Enter quantity in kg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="harvestDate">Harvest Date *</Label>
                  <Input
                    id="harvestDate"
                    type="date"
                    value={formData.harvestDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, harvestDate: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Farm location (e.g., Green Valley Farm, Odisha)"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="certificate">Quality Certificate (Optional)</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    id="certificate"
                    type="file"
                    accept="/images/fileupload.jpg"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Label htmlFor="certificate" className="cursor-pointer">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600">
                      {certificate ? certificate.name : 'Click to upload quality certificate'}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG up to 10MB</p>
                  </Label>
                </div>
              </div>

              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                Submit to Blockchain
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}