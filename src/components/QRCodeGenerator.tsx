import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download } from 'lucide-react';

interface QRCodeGeneratorProps {
  batchID: string;
  url: string;
}

export const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ batchID, url }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  // Generate QR code using a simple pattern (in real app, use QR library)
  const generateQRPattern = () => {
    const pattern = [];
    
    // Create a simple pattern based on batch ID
    for (let i = 0; i < 25; i++) {
      const row = [];
      for (let j = 0; j < 25; j++) {
        // Create pattern based on batch ID hash
        const hash = (batchID.charCodeAt((i + j) % batchID.length) + i * j) % 3;
        row.push(hash > 0);
      }
      pattern.push(row);
    }
    
    return pattern;
  };

  const downloadQRCode = async () => {
    setIsDownloading(true);
    
    // Simulate download process
    setTimeout(() => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const size = 400;
      canvas.width = size;
      canvas.height = size;
      
      if (ctx) {
        // White background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, size, size);
        
        // Draw QR pattern
        const pattern = generateQRPattern();
        const cellSize = size / 25;
        
        ctx.fillStyle = '#000000';
        pattern.forEach((row, i) => {
          row.forEach((cell, j) => {
            if (cell) {
              ctx.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
            }
          });
        });
      }
      
      // Download
      const link = document.createElement('a');
      link.download = `QR_${batchID}.png`;
      link.href = canvas.toDataURL();
      link.click();
      
      setIsDownloading(false);
    }, 1000);
  };

  const pattern = generateQRPattern();

  return (
    <Card className="p-6 text-center">
      <div className="space-y-4">
        <div className="flex justify-center">
          <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
            <svg width="200" height="200" className="border">
              {pattern.map((row, i) =>
                row.map((cell, j) => (
                  <rect
                    key={`${i}-${j}`}
                    x={j * 8}
                    y={i * 8}
                    width="8"
                    height="8"
                    fill={cell ? '#000000' : '#ffffff'}
                  />
                ))
              )}
            </svg>
          </div>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Scan this QR code to view batch traceability
          </p>
          <p className="text-xs font-mono bg-gray-100 p-2 rounded">
            {url}
          </p>
        </div>
        
        <Button 
          onClick={downloadQRCode} 
          disabled={isDownloading}
          className="w-full"
        >
          <Download className="w-4 h-4 mr-2" />
          {isDownloading ? 'Generating...' : 'Download QR Code'}
        </Button>
      </div>
    </Card>
  );
};