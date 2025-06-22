'use client';

import { useState } from 'react';
import {
  Camera,
  Upload,
  Scan,
  Coffee,
  Sparkles,
  CheckCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Input } from '@/components/ui/input';

export default function ScannerPage() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [particles, setParticles] = useState([]);

  const handleScan = () => {
    setIsScanning(true);
    // Simulate scanning process
    setTimeout(() => {
      setIsScanning(false);
      const mockResult = {
        cafe: 'Brew & Beans',
        items: [
          { name: 'Espresso', price: 3.5, stickerPieces: 2 },
          { name: 'Chocolate Croissant', price: 4.25, stickerPieces: 1 },
        ],
        total: 7.75,
        timestamp: new Date().toLocaleString(),
      };
      setScanResult(mockResult);

      // Generate particles
      const newParticles = [
        { id: 1, type: 'coffee', name: 'Espresso Piece #1', rarity: 'common' },
        { id: 2, type: 'coffee', name: 'Espresso Piece #2', rarity: 'common' },
        { id: 3, type: 'dessert', name: 'Croissant Piece #1', rarity: 'rare' },
      ];
      setParticles(newParticles);
    }, 3000);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleScan();
    }
  };

  return (
    <div className="min-h-screen  to-orange-100">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Receipt Scanner
          </h2>
          <p className="text-gray-600">
            Scan your coffee receipts to collect sticker pieces
          </p>
        </div>

        {!scanResult ? (
          <div className="grid md:grid-cols-2 gap-8">
            {/* Camera Scan */}
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Camera className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle>Camera Scan</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-6">
                  Use your device camera to scan a receipt in real-time
                </p>
                <Input
                  type="text"
                  placeholder="QR"
                  className="mb-4 w-full cursor-not-allowed"
                  readOnly
                  disabled
                  value={
                    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
                  }
                />
                <Button
                  onClick={handleScan}
                  disabled={isScanning}
                  className="w-full"
                  size="lg"
                >
                  {isScanning ? (
                    <>
                      <Scan className="h-5 w-5 mr-2 animate-spin" />
                      Scanning...
                    </>
                  ) : (
                    <>
                      <Camera className="h-5 w-5 mr-2" />
                      Start Camera Scan
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* File Upload */}
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle>Upload Receipt</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-6">
                  Upload a photo of your receipt from your device
                </p>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={isScanning}
                  />
                  <Button
                    variant="outline"
                    className="w-full"
                    size="lg"
                    disabled={isScanning}
                  >
                    {isScanning ? (
                      <>
                        <Scan className="h-5 w-5 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Upload className="h-5 w-5 mr-2" />
                        Choose File
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Scan Result */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <CardTitle className="text-green-800">
                    Receipt Scanned Successfully!
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Receipt Details</h4>
                    <p className="text-sm text-gray-600 mb-1">
                      Cafe: {scanResult.cafe}
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                      Time: {scanResult.timestamp}
                    </p>
                    <p className="text-sm text-gray-600">
                      Total: ${scanResult.total}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Items Purchased</h4>
                    {scanResult.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between text-sm mb-1"
                      >
                        <span>{item.name}</span>
                        <span>${item.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Collected Particles */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Sparkles className="h-6 w-6 text-amber-600" />
                  <span>Sticker Pieces Collected!</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  {particles.map((particle) => (
                    <div
                      key={particle.id}
                      className="bg-gradient-to-br from-amber-100 to-orange-100 p-4 rounded-lg border border-amber-200"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium">{particle.name}</h5>
                        <Badge
                          variant={
                            particle.rarity === 'rare' ? 'default' : 'secondary'
                          }
                        >
                          {particle.rarity}
                        </Badge>
                      </div>
                      <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded border-2 border-amber-500 flex items-center justify-center">
                        <Sparkles className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex space-x-4">
                  <Link href="/stickers">
                    <Button className="bg-amber-600 hover:bg-amber-700">
                      View My Stickers
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setScanResult(null);
                      setParticles([]);
                    }}
                  >
                    Scan Another Receipt
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tips */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Scanning Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Ensure the receipt is well-lit and clearly visible</li>
              <li>• Make sure all text on the receipt is readable</li>
              <li>• Receipts must be from participating coffee shops</li>
              <li>• Each receipt can only be scanned once</li>
              <li>
                • Rare sticker pieces have higher chances during special events
              </li>
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
