'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Coffee, Gift, Star, Trophy } from 'lucide-react';

export default function CoffeeBeansPage() {
  const coffeeShops = [
    {
      id: 1,
      name: 'Brew & Bean Co.',
      logo: '/placeholder.svg?height=60&width=60',
      collectedBeans: 8,
      requiredBeans: 10,
      color: 'bg-amber-500',
      nextReward: 'Free Americano',
    },
    {
      id: 2,
      name: 'Morning Roast',
      logo: '/placeholder.svg?height=60&width=60',
      collectedBeans: 15,
      requiredBeans: 12,
      color: 'bg-orange-500',
      nextReward: 'Free Latte',
      canRedeem: true,
    },
    {
      id: 3,
      name: 'The Coffee Corner',
      logo: '/placeholder.svg?height=60&width=60',
      collectedBeans: 5,
      requiredBeans: 8,
      color: 'bg-yellow-500',
      nextReward: 'Free Cappuccino',
    },
    {
      id: 4,
      name: 'Espresso Express',
      logo: '/placeholder.svg?height=60&width=60',
      collectedBeans: 3,
      requiredBeans: 15,
      color: 'bg-amber-600',
      nextReward: 'Free Premium Blend',
    },
  ];

  const totalBeans = coffeeShops.reduce(
    (sum, shop) => sum + shop.collectedBeans,
    0
  );
  const availableRewards = coffeeShops.filter((shop) => shop.canRedeem).length;

  return (
    <div className="min-h-screen  p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="flex items-center p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-amber-100 rounded-full">
                  <Coffee className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalBeans}
                  </p>
                  <p className="text-sm text-gray-600">Total Beans Collected</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-green-100 rounded-full">
                  <Gift className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {availableRewards}
                  </p>
                  <p className="text-sm text-gray-600">Available Rewards</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-purple-100 rounded-full">
                  <Trophy className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {coffeeShops.length}
                  </p>
                  <p className="text-sm text-gray-600">Partner Shops</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Coffee Shops */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
            <Star className="h-6 w-6 text-amber-500" />
            Your Coffee Bean Collection
          </h2>

          <div className="grid gap-4">
            {coffeeShops.map((shop) => {
              const progress = Math.min(
                (shop.collectedBeans / shop.requiredBeans) * 100,
                100
              );
              const remaining = Math.max(
                shop.requiredBeans - shop.collectedBeans,
                0
              );

              return (
                <Card
                  key={shop.id}
                  className={`transition-all hover:shadow-lg ${
                    shop.canRedeem ? 'ring-2 ring-green-500' : ''
                  }`}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <img
                            src={'/coffee-bean.png'}
                            alt={`${shop.name} logo`}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          {shop.canRedeem && (
                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                              <Gift className="h-3 w-3 text-white" />
                            </div>
                          )}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{shop.name}</CardTitle>
                          <CardDescription>
                            Next reward: {shop.nextReward}
                          </CardDescription>
                        </div>
                      </div>
                      {shop.canRedeem && (
                        <Badge
                          variant="default"
                          className="bg-green-500 hover:bg-green-600"
                        >
                          Ready to Redeem!
                        </Badge>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">Progress</span>
                      <span className="text-gray-600">
                        {shop.collectedBeans} / {shop.requiredBeans} beans
                      </span>
                    </div>

                    <Progress value={progress} className="h-3" />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-4 h-4 rounded-full ${shop.color}`}
                        ></div>
                        <span className="text-sm text-gray-600">
                          {remaining > 0
                            ? `${remaining} beans to go`
                            : 'Goal reached!'}
                        </span>
                      </div>

                      {shop.canRedeem ? (
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Gift className="h-4 w-4 mr-2" />
                          Redeem Now
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm" disabled>
                          <Coffee className="h-4 w-4 mr-2" />
                          Keep Collecting
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your loyalty rewards</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button variant="outline">
              <Coffee className="h-4 w-4 mr-2" />
              Find Nearby Shops
            </Button>
            <Button variant="outline">
              <Star className="h-4 w-4 mr-2" />
              View Reward History
            </Button>
            <Button variant="outline">
              <Gift className="h-4 w-4 mr-2" />
              Browse All Rewards
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
