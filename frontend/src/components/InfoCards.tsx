import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Coffee, Gift, Zap } from 'lucide-react';

export default function InfoCards() {
  const stickerConditions = [
    {
      icon: Coffee,
      title: 'Purchase Coffee',
      description: 'Earn 1-3 sticker pieces per coffee purchase',
      color: 'bg-amber-100 text-amber-800',
    },
    {
      icon: Gift,
      title: 'Daily Visit',
      description: 'Get bonus pieces for consecutive visits',
      color: 'bg-green-100 text-green-800',
    },
    {
      icon: Zap,
      title: 'Special Events',
      description: 'Rare pieces during promotional periods',
      color: 'bg-purple-100 text-purple-800',
    },
  ];

  return (
    <section className="mb-12">
      <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        How to Earn Sticker Pieces
      </h3>
      <div className="grid md:grid-cols-3 gap-6">
        {stickerConditions.map((condition, index) => (
          <Card key={index} className="text-center">
            <CardHeader>
              <div
                className={`w-16 h-16 rounded-full ${condition.color} flex items-center justify-center mx-auto mb-4`}
              >
                <condition.icon className="h-8 w-8" />
              </div>
              <CardTitle>{condition.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                {condition.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
