'use client';
import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from './ui/badge';
import { MapPin, Star } from 'lucide-react';
import { Button } from './ui/button';

export default function NearbyCafes() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const ipadress = 'http://localhost:8080/companies';

  function getCompanies() {
    fetch(ipadress)
      .then((response) => response.json())
      .then((data) => {
        console.log('Companies from API:', data);

        const transformedCompanies = data.map((company: any) => {
          return {
            ...company,
            rating: company.rating || 4.5,
            location: company.location || 'AVM',
            distance:
              company.distance || `${(Math.random() * 2).toFixed(1)} km`,
            stickers: company.stickers || Math.floor(Math.random() * 20) + 1,
            image: company.image || '/coffee-shops.jpeg',
          };
        });

        console.log('Transformed Companies:', transformedCompanies); // Log the transformed data
        setCompanies(transformedCompanies);
        setLoading(false);
        console.log(companies);
      })
      .catch((error) => {
        console.error('Error fetching companies:', error);
      });
  }

  useEffect(() => {
    getCompanies();
  }, []);

  const renderCard = (company: any, isPlaceholder = false) => (
    <Card
      key={isPlaceholder ? 'placeholder' : company.id}
      className="overflow-hidden hover:shadow-lg transition-shadow opacity-80"
    >
      <div className="aspect-video bg-gray-200">
        <img
          src={company.image}
          alt={company.name}
          className="w-full h-full object-cover"
        />
      </div>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{company.name}</CardTitle>
          <Badge variant="secondary" className="bg-amber-100 text-amber-800">
            {company.stickers} stickers
          </Badge>
        </div>
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>{company.rating}</span>
          </div>
          <div className="flex items-center space-x-1">
            <MapPin className="h-4 w-4" />
            <span>{company.location}</span>
          </div>
          <span>{company.distance}</span>
        </div>
      </CardHeader>
      <CardContent>
        <Button className="w-full" variant="outline" disabled={isPlaceholder}>
          {isPlaceholder ? 'Cannot Load Data' : 'View Details'}
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <section>
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Nearby Cafes</h3>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading && (
          <p className="text-gray-500 col-span-full">Loading cafes...</p>
        )}

        {!loading && !error && companies.map((company) => renderCard(company))}

        {!loading &&
          error &&
          renderCard(
            {
              name: 'Something went wrong',
              stickers: 0,
              rating: 'N/A',
              location: 'Unknown',
              distance: '-',
              image: '/placeholder.svg',
            },
            true
          )}
      </div>
    </section>
  );
}
