import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { MapPin, Clock, Star, Plus, Truck, History, User } from 'lucide-react';

interface Service {
  id: string;
  type: 'towing' | 'carrier';
  status: 'requested' | 'en-route' | 'picked-up' | 'in-transit' | 'delivered' | 'completed';
  pickupLocation: string;
  dropoffLocation: string;
  vehicle: {
    make: string;
    model: string;
    plate: string;
  };
  driver?: {
    name: string;
    rating: number;
    eta?: string;
  };
  price: number;
  createdAt: string;
}

const CustomerDashboard = () => {
  const { user, logout } = useAuth();
  const [activeService, setActiveService] = useState<Service | null>(null);
  
  // Mock data
  const [services] = useState<Service[]>([
    {
      id: '1',
      type: 'towing',
      status: 'in-transit',
      pickupLocation: '123 Main St, Downtown',
      dropoffLocation: '456 Oak Ave, Uptown',
      vehicle: { make: 'Honda', model: 'Civic', plate: 'ABC-123' },
      driver: { name: 'Mike Johnson', rating: 4.8, eta: '15 min' },
      price: 89.99,
      createdAt: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      type: 'carrier',
      status: 'completed',
      pickupLocation: '789 Pine St, Westside',
      dropoffLocation: '321 Elm Dr, Eastside',
      vehicle: { make: 'Toyota', model: 'Camry', plate: 'XYZ-789' },
      driver: { name: 'Sarah Davis', rating: 4.9 },
      price: 129.99,
      createdAt: '2024-01-10T14:20:00Z'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'requested': return 'bg-yellow-500';
      case 'en-route': return 'bg-blue-500';
      case 'picked-up': return 'bg-orange-500';
      case 'in-transit': return 'bg-purple-500';
      case 'delivered': return 'bg-green-500';
      case 'completed': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    return status.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const activeServices = services.filter(s => s.status !== 'completed');
  const completedServices = services.filter(s => s.status === 'completed');

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">Welcome, {user?.name}</h1>
            <p className="text-primary-foreground/80">Customer Dashboard</p>
          </div>
          <Button variant="secondary" size="sm" onClick={logout}>
            <User className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      <div className="p-4">
        <Tabs defaultValue="home" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="home">Home</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="home" className="space-y-6">
            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Truck className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-1">Request Towing</h3>
                  <p className="text-sm text-muted-foreground">Emergency roadside assistance</p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Plus className="w-6 h-6 text-secondary" />
                  </div>
                  <h3 className="font-semibold mb-1">Car Carrier</h3>
                  <p className="text-sm text-muted-foreground">Multi-vehicle transport</p>
                </CardContent>
              </Card>
            </div>

            {/* Active Service */}
            {activeServices.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Current Service</h2>
                {activeServices.map(service => (
                  <Card key={service.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">
                            {service.type === 'towing' ? 'Towing Service' : 'Car Carrier'}
                          </CardTitle>
                          <CardDescription>
                            {service.vehicle.make} {service.vehicle.model} • {service.vehicle.plate}
                          </CardDescription>
                        </div>
                        <Badge className={getStatusColor(service.status)}>
                          {getStatusText(service.status)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center text-sm">
                          <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                          <span className="font-medium">From:</span>
                          <span className="ml-2">{service.pickupLocation}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                          <span className="font-medium">To:</span>
                          <span className="ml-2">{service.dropoffLocation}</span>
                        </div>
                      </div>

                      {service.driver && (
                        <div className="bg-muted/50 p-3 rounded-lg">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium">{service.driver.name}</p>
                              <div className="flex items-center">
                                <Star className="w-4 h-4 text-yellow-500 mr-1" />
                                <span className="text-sm">{service.driver.rating}</span>
                              </div>
                            </div>
                            {service.driver.eta && (
                              <div className="text-right">
                                <p className="text-sm text-muted-foreground">ETA</p>
                                <p className="font-medium">{service.driver.eta}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="flex justify-between items-center pt-2">
                        <span className="text-lg font-bold">${service.price}</span>
                        <Button>Track Service</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="active" className="space-y-4">
            <h2 className="text-lg font-semibold">Active Services</h2>
            {activeServices.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">No Active Services</h3>
                  <p className="text-muted-foreground mb-4">You don't have any ongoing services</p>
                  <Button>Request New Service</Button>
                </CardContent>
              </Card>
            ) : (
              activeServices.map(service => (
                <Card key={service.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">
                        {service.type === 'towing' ? 'Towing Service' : 'Car Carrier'}
                      </h3>
                      <Badge className={getStatusColor(service.status)}>
                        {getStatusText(service.status)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {service.vehicle.make} {service.vehicle.model} • {service.vehicle.plate}
                    </p>
                    <Button size="sm" className="w-full">Track Service</Button>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <h2 className="text-lg font-semibold">Service History</h2>
            {completedServices.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <History className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">No Service History</h3>
                  <p className="text-muted-foreground">Your completed services will appear here</p>
                </CardContent>
              </Card>
            ) : (
              completedServices.map(service => (
                <Card key={service.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">
                        {service.type === 'towing' ? 'Towing Service' : 'Car Carrier'}
                      </h3>
                      <span className="text-lg font-bold">${service.price}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {service.vehicle.make} {service.vehicle.model} • {service.vehicle.plate}
                    </p>
                    <p className="text-xs text-muted-foreground mb-3">
                      {new Date(service.createdAt).toLocaleDateString()}
                    </p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 mr-1" />
                        <span className="text-sm">{service.driver?.rating}</span>
                        <span className="text-sm text-muted-foreground ml-1">
                          • {service.driver?.name}
                        </span>
                      </div>
                      <Button variant="outline" size="sm">View Details</Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Name</label>
                  <p className="text-lg">{user?.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="text-lg">{user?.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Phone</label>
                  <p className="text-lg">{user?.phone}</p>
                </div>
                <Button className="w-full mt-6">Edit Profile</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CustomerDashboard;