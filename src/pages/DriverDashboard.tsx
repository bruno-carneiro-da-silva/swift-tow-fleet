import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/AuthContext';
import { MapPin, DollarSign, Clock, Star, Navigation, User, Truck, CheckCircle } from 'lucide-react';

interface JobRequest {
  id: string;
  type: 'towing' | 'carrier';
  customer: {
    name: string;
    phone: string;
  };
  vehicle: {
    make: string;
    model: string;
    plate: string;
  };
  pickupLocation: string;
  dropoffLocation: string;
  distance: string;
  estimatedTime: string;
  price: number;
  priority: 'normal' | 'urgent';
}

interface ActiveJob extends JobRequest {
  status: 'accepted' | 'en-route' | 'arrived' | 'picked-up' | 'in-transit' | 'delivered';
  acceptedAt: string;
}

const DriverDashboard = () => {
  const { user, logout } = useAuth();
  const [isOnline, setIsOnline] = useState(false);
  const [activeJob, setActiveJob] = useState<ActiveJob | null>(null);
  
  // Mock data
  const [jobRequests] = useState<JobRequest[]>([
    {
      id: '1',
      type: 'towing',
      customer: { name: 'John Smith', phone: '+1 (555) 123-4567' },
      vehicle: { make: 'Honda', model: 'Civic', plate: 'ABC-123' },
      pickupLocation: '123 Main St, Downtown',
      dropoffLocation: '456 Oak Ave, Uptown',
      distance: '5.2 miles',
      estimatedTime: '25 min',
      price: 89.99,
      priority: 'urgent'
    },
    {
      id: '2',
      type: 'carrier',
      customer: { name: 'Sarah Johnson', phone: '+1 (555) 987-6543' },
      vehicle: { make: 'Toyota', model: 'Camry', plate: 'XYZ-789' },
      pickupLocation: '789 Pine St, Westside',
      dropoffLocation: '321 Elm Dr, Eastside',
      distance: '8.7 miles',
      estimatedTime: '35 min',
      price: 129.99,
      priority: 'normal'
    }
  ]);

  const [earnings] = useState({
    today: 245.50,
    week: 1200.75,
    month: 4850.25,
    totalJobs: 156
  });

  const handleAcceptJob = (job: JobRequest) => {
    const newActiveJob: ActiveJob = {
      ...job,
      status: 'accepted',
      acceptedAt: new Date().toISOString()
    };
    setActiveJob(newActiveJob);
  };

  const updateJobStatus = (newStatus: ActiveJob['status']) => {
    if (activeJob) {
      setActiveJob({ ...activeJob, status: newStatus });
    }
  };

  const completeJob = () => {
    setActiveJob(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'bg-blue-500';
      case 'en-route': return 'bg-yellow-500';
      case 'arrived': return 'bg-orange-500';
      case 'picked-up': return 'bg-purple-500';
      case 'in-transit': return 'bg-indigo-500';
      case 'delivered': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    return status.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">Driver Dashboard</h1>
            <p className="text-primary-foreground/80">Welcome, {user?.name}</p>
          </div>
          <Button variant="secondary" size="sm" onClick={logout}>
            <User className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
        
        {/* Online Status */}
        <div className="mt-4 flex items-center justify-between bg-primary-foreground/10 rounded-lg p-3">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-400' : 'bg-gray-400'}`} />
            <span className="font-medium">
              {isOnline ? 'Online - Available for jobs' : 'Offline'}
            </span>
          </div>
          <Switch
            checked={isOnline}
            onCheckedChange={setIsOnline}
            disabled={!!activeJob}
          />
        </div>
      </div>

      <div className="p-4">
        <Tabs defaultValue="jobs" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="jobs">Jobs</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="jobs" className="space-y-4">
            <h2 className="text-lg font-semibold">Available Jobs</h2>
            
            {!isOnline ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Truck className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Go Online to See Jobs</h3>
                  <p className="text-muted-foreground">Toggle the switch above to start receiving job requests</p>
                </CardContent>
              </Card>
            ) : activeJob ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Job In Progress</h3>
                  <p className="text-muted-foreground">Complete your current job to see new requests</p>
                </CardContent>
              </Card>
            ) : (
              jobRequests.map(job => (
                <Card key={job.id} className="border-l-4 border-l-primary">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg flex items-center">
                          {job.type === 'towing' ? 'Towing Request' : 'Car Carrier Request'}
                          {job.priority === 'urgent' && (
                            <Badge variant="destructive" className="ml-2">Urgent</Badge>
                          )}
                        </CardTitle>
                        <CardDescription>
                          {job.vehicle.make} {job.vehicle.model} • {job.vehicle.plate}
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-600">${job.price}</p>
                        <p className="text-sm text-muted-foreground">{job.distance} • {job.estimatedTime}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                        <span className="font-medium">From:</span>
                        <span className="ml-2">{job.pickupLocation}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                        <span className="font-medium">To:</span>
                        <span className="ml-2">{job.dropoffLocation}</span>
                      </div>
                    </div>

                    <div className="bg-muted/50 p-3 rounded-lg">
                      <p className="font-medium">{job.customer.name}</p>
                      <p className="text-sm text-muted-foreground">{job.customer.phone}</p>
                    </div>

                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => handleAcceptJob(job)}
                      >
                        <Navigation className="w-4 h-4 mr-2" />
                        Navigate
                      </Button>
                      <Button 
                        className="flex-1"
                        onClick={() => handleAcceptJob(job)}
                      >
                        Accept Job
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="active" className="space-y-4">
            <h2 className="text-lg font-semibold">Active Job</h2>
            
            {!activeJob ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">No Active Job</h3>
                  <p className="text-muted-foreground">Accept a job to start working</p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">
                        {activeJob.type === 'towing' ? 'Towing Service' : 'Car Carrier Service'}
                      </CardTitle>
                      <CardDescription>
                        {activeJob.vehicle.make} {activeJob.vehicle.model} • {activeJob.vehicle.plate}
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(activeJob.status)}>
                      {getStatusText(activeJob.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                      <span className="font-medium">From:</span>
                      <span className="ml-2">{activeJob.pickupLocation}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                      <span className="font-medium">To:</span>
                      <span className="ml-2">{activeJob.dropoffLocation}</span>
                    </div>
                  </div>

                  <div className="bg-muted/50 p-3 rounded-lg">
                    <p className="font-medium">{activeJob.customer.name}</p>
                    <p className="text-sm text-muted-foreground">{activeJob.customer.phone}</p>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-green-600">${activeJob.price}</span>
                    <span className="text-sm text-muted-foreground">
                      {activeJob.distance} • {activeJob.estimatedTime}
                    </span>
                  </div>

                  {/* Status Update Buttons */}
                  <div className="space-y-2">
                    {activeJob.status === 'accepted' && (
                      <Button className="w-full" onClick={() => updateJobStatus('en-route')}>
                        Mark as En Route
                      </Button>
                    )}
                    {activeJob.status === 'en-route' && (
                      <Button className="w-full" onClick={() => updateJobStatus('arrived')}>
                        Mark as Arrived
                      </Button>
                    )}
                    {activeJob.status === 'arrived' && (
                      <Button className="w-full" onClick={() => updateJobStatus('picked-up')}>
                        Mark as Picked Up
                      </Button>
                    )}
                    {activeJob.status === 'picked-up' && (
                      <Button className="w-full" onClick={() => updateJobStatus('in-transit')}>
                        Mark as In Transit
                      </Button>
                    )}
                    {activeJob.status === 'in-transit' && (
                      <Button className="w-full" onClick={() => updateJobStatus('delivered')}>
                        Mark as Delivered
                      </Button>
                    )}
                    {activeJob.status === 'delivered' && (
                      <Button className="w-full" onClick={completeJob}>
                        Complete Job
                      </Button>
                    )}
                  </div>

                  <Button variant="outline" className="w-full">
                    <Navigation className="w-4 h-4 mr-2" />
                    Open in Maps
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="earnings" className="space-y-4">
            <h2 className="text-lg font-semibold">Earnings</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <DollarSign className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">${earnings.today}</p>
                  <p className="text-sm text-muted-foreground">Today</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <DollarSign className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">${earnings.week}</p>
                  <p className="text-sm text-muted-foreground">This Week</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <DollarSign className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">${earnings.month}</p>
                  <p className="text-sm text-muted-foreground">This Month</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <Truck className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{earnings.totalJobs}</p>
                  <p className="text-sm text-muted-foreground">Total Jobs</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Earnings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { date: 'Today', amount: 89.99, jobs: 3 },
                    { date: 'Yesterday', amount: 145.50, jobs: 5 },
                    { date: 'Jan 13', amount: 67.25, jobs: 2 },
                  ].map((day, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-border/50 last:border-b-0">
                      <div>
                        <p className="font-medium">{day.date}</p>
                        <p className="text-sm text-muted-foreground">{day.jobs} jobs completed</p>
                      </div>
                      <p className="font-bold text-green-600">${day.amount}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Driver Profile</CardTitle>
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
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Vehicle Type</label>
                  <p className="text-lg capitalize">{user?.vehicleType}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Rating</label>
                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-yellow-500 mr-1" />
                    <span className="text-lg">4.8</span>
                    <span className="text-sm text-muted-foreground ml-2">(156 reviews)</span>
                  </div>
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

export default DriverDashboard;