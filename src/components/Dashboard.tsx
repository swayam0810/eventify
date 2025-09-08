import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  getBookings, 
  getVenueById, 
  getServiceById, 
  formatCurrency,
  type Booking 
} from '@/lib/data';
import { 
  ArrowLeft, 
  Calendar, 
  Users, 
  MapPin, 
  Search,
  Filter,
  Eye,
  Edit,
  MoreHorizontal,
  Building,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';

interface DashboardProps {
  onBack: () => void;
}

export function Dashboard({ onBack }: DashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const bookings = getBookings();

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.personalDetails.fullName
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
      booking.referenceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.eventDetails.eventType.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-warning" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-destructive" />;
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'confirmed':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    completed: bookings.filter(b => b.status === 'completed').length,
  };

  if (selectedBooking) {
    return <BookingDetails booking={selectedBooking} onBack={() => setSelectedBooking(null)} />;
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="bg-background border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" onClick={onBack}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">My Bookings</h1>
                <p className="text-muted-foreground">Manage and track your event bookings</p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-4">
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-sm text-muted-foreground">Total Bookings</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="text-2xl font-bold text-warning">{stats.pending}</div>
                <p className="text-sm text-muted-foreground">Pending</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="text-2xl font-bold text-success">{stats.confirmed}</div>
                <p className="text-sm text-muted-foreground">Confirmed</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="text-2xl font-bold text-primary">{stats.completed}</div>
                <p className="text-sm text-muted-foreground">Completed</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search bookings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No bookings found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'You haven\'t made any bookings yet'
                }
              </p>
              {!searchTerm && statusFilter === 'all' && (
                <Button onClick={onBack}>Create Your First Booking</Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => {
              const venue = booking.selectedVenue ? getVenueById(booking.selectedVenue) : null;
              
              return (
                <Card key={booking.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{booking.referenceId}</h3>
                          <Badge variant={getStatusVariant(booking.status)} className="flex items-center gap-1">
                            {getStatusIcon(booking.status)}
                            {booking.status}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {new Date(booking.eventDetails.preferredDate).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            <span>{booking.eventDetails.attendees} guests</span>
                          </div>
                          
                          {venue && (
                            <div className="flex items-center gap-2">
                              <Building className="w-4 h-4" />
                              <span className="truncate">{venue.name}</span>
                            </div>
                          )}
                          
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-foreground">
                              {formatCurrency(booking.totalEstimatedCost)}
                            </span>
                          </div>
                        </div>
                        
                        <div className="mt-2">
                          <Badge variant="outline" className="capitalize">
                            {booking.eventDetails.eventType}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedBooking(booking)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// Booking Details Component
function BookingDetails({ booking, onBack }: { booking: Booking; onBack: () => void }) {
  const venue = booking.selectedVenue ? getVenueById(booking.selectedVenue) : null;

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="bg-background border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="outline" size="icon" onClick={onBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Booking Details</h1>
              <p className="text-muted-foreground">Reference: {booking.referenceId}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant={getStatusVariant(booking.status)} className="flex items-center gap-1">
              {getStatusIcon(booking.status)}
              {booking.status}
            </Badge>
            <span className="text-sm text-muted-foreground">
              Created on {new Date(booking.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Event Details */}
            <Card>
              <CardHeader>
                <CardTitle>Event Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Event Type</label>
                    <p className="capitalize">{booking.eventDetails.eventType}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Date</label>
                    <p>{new Date(booking.eventDetails.preferredDate).toLocaleDateString('en-IN', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Guests</label>
                    <p>{booking.eventDetails.attendees} attendees</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Budget</label>
                    <p>{booking.eventDetails.budgetRange}</p>
                  </div>
                </div>
                {booking.eventDetails.notes && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Notes</label>
                    <p className="text-sm mt-1 p-3 bg-muted rounded-md">{booking.eventDetails.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Contact Details */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Name</label>
                  <p>{booking.personalDetails.fullName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p>{booking.personalDetails.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Phone</label>
                  <p>{booking.personalDetails.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Address</label>
                  <p className="text-sm">{booking.personalDetails.address}</p>
                </div>
              </CardContent>
            </Card>

            {/* Selected Services */}
            {booking.selectedServices.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Selected Services</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {booking.selectedServices.map((item) => {
                      const service = getServiceById(item.serviceId);
                      if (!service) return null;

                      return (
                        <div key={item.serviceId} className="flex justify-between items-center py-2 border-b last:border-0">
                          <div>
                            <p className="font-medium">{service.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {item.quantity} × {formatCurrency(item.unitPrice)}
                            </p>
                          </div>
                          <p className="font-medium">{formatCurrency(item.subtotal)}</p>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            {/* Venue Information */}
            {venue && (
              <Card>
                <CardHeader>
                  <CardTitle>Venue</CardTitle>
                </CardHeader>
                <CardContent>
                  <h4 className="font-medium mb-2">{venue.name}</h4>
                  <p className="text-sm text-muted-foreground mb-3">{venue.description}</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{venue.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span>Capacity: {venue.capacity}</span>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t">
                    <p className="font-medium">{formatCurrency(venue.basePrice)}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Cost Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Cost Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {venue && (
                    <div className="flex justify-between">
                      <span>Venue</span>
                      <span>{formatCurrency(venue.basePrice)}</span>
                    </div>
                  )}
                  {booking.selectedServices.map((item) => {
                    const service = getServiceById(item.serviceId);
                    return (
                      <div key={item.serviceId} className="flex justify-between text-sm">
                        <span>{service?.name}</span>
                        <span>{formatCurrency(item.subtotal)}</span>
                      </div>
                    );
                  })}
                  <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span className="text-primary">{formatCurrency(booking.totalEstimatedCost)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );

  function getStatusVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
    switch (status) {
      case 'confirmed':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  }

  function getStatusIcon(status: string) {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-warning" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-destructive" />;
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  }
}