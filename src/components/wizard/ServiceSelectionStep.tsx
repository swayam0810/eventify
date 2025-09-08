import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  getVenues, 
  getServices, 
  formatCurrency, 
  type BookingItem, 
  type EventDetails,
  type Venue,
  type Service 
} from '@/lib/data';
import { 
  MapPin, 
  Users, 
  Check, 
  Plus, 
  Minus,
  Utensils,
  Camera,
  Music,
  Flower2,
  Building
} from 'lucide-react';

interface ServiceSelectionStepProps {
  data: {
    selectedServices: BookingItem[];
    selectedVenue?: string;
    eventDetails: Partial<EventDetails>;
  };
  onUpdate: (data: {
    selectedServices: BookingItem[];
    selectedVenue?: string;
  }) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export function ServiceSelectionStep({ data, onUpdate, onNext, onPrevious }: ServiceSelectionStepProps) {
  const [selectedVenue, setSelectedVenue] = useState<string | undefined>(data.selectedVenue);
  const [selectedServices, setSelectedServices] = useState<BookingItem[]>(data.selectedServices);
  
  const venues = getVenues();
  const services = getServices();
  const attendees = data.eventDetails.attendees || 0;

  // Filter venues based on capacity
  const suitableVenues = venues.filter(venue => venue.capacity >= attendees);

  useEffect(() => {
    onUpdate({ selectedServices, selectedVenue });
  }, [selectedServices, selectedVenue, onUpdate]);

  const handleVenueSelect = (venueId: string) => {
    setSelectedVenue(venueId);
  };

  const handleServiceToggle = (service: Service, checked: boolean) => {
    if (checked) {
      const quantity = service.unit === 'per_person' ? attendees : 1;
      const newItem: BookingItem = {
        serviceId: service.id,
        quantity,
        unitPrice: service.basePrice,
        subtotal: service.basePrice * quantity,
      };
      setSelectedServices(prev => [...prev, newItem]);
    } else {
      setSelectedServices(prev => prev.filter(item => item.serviceId !== service.id));
    }
  };

  const handleQuantityChange = (serviceId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      setSelectedServices(prev => prev.filter(item => item.serviceId !== serviceId));
      return;
    }

    setSelectedServices(prev =>
      prev.map(item =>
        item.serviceId === serviceId
          ? { ...item, quantity: newQuantity, subtotal: item.unitPrice * newQuantity }
          : item
      )
    );
  };

  const getServiceIcon = (category: string) => {
    switch (category) {
      case 'food':
        return <Utensils className="w-5 h-5" />;
      case 'photography':
        return <Camera className="w-5 h-5" />;
      case 'entertainment':
        return <Music className="w-5 h-5" />;
      case 'decoration':
        return <Flower2 className="w-5 h-5" />;
      default:
        return <Building className="w-5 h-5" />;
    }
  };

  const calculateTotal = () => {
    const venuePrice = selectedVenue ? venues.find(v => v.id === selectedVenue)?.basePrice || 0 : 0;
    const servicesTotal = selectedServices.reduce((sum, item) => sum + item.subtotal, 0);
    return venuePrice + servicesTotal;
  };

  const isServiceSelected = (serviceId: string) => {
    return selectedServices.some(item => item.serviceId === serviceId);
  };

  const getServiceQuantity = (serviceId: string) => {
    const item = selectedServices.find(item => item.serviceId === serviceId);
    return item?.quantity || 1;
  };

  return (
    <div className="space-y-8">
      {/* Venue Selection */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Building className="w-5 h-5 text-primary" />
          Select Venue
        </h3>
        
        {suitableVenues.length === 0 ? (
          <Card className="border-warning bg-warning/10">
            <CardContent className="pt-4">
              <p className="text-warning-foreground">
                No venues found that can accommodate {attendees} attendees. 
                Please contact us for custom arrangements.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {suitableVenues.map((venue) => (
              <Card
                key={venue.id}
                className={`cursor-pointer transition-all ${
                  selectedVenue === venue.id
                    ? 'ring-2 ring-primary bg-accent/50'
                    : 'hover:shadow-md'
                }`}
                onClick={() => handleVenueSelect(venue.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base flex items-center gap-2">
                      {selectedVenue === venue.id && (
                        <Check className="w-4 h-4 text-primary" />
                      )}
                      {venue.name}
                    </CardTitle>
                    <Badge variant="secondary">{venue.type}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      {venue.location}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="w-4 h-4" />
                      Capacity: {venue.capacity} guests
                    </div>
                    <p className="text-sm text-muted-foreground">{venue.description}</p>
                    <div className="text-lg font-semibold text-primary">
                      {formatCurrency(venue.basePrice)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Service Selection */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Select Services</h3>
        
        <div className="grid gap-4">
          {services.map((service) => {
            const isSelected = isServiceSelected(service.id);
            const quantity = getServiceQuantity(service.id);
            
            return (
              <Card key={service.id} className="transition-all hover:shadow-md">
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={(checked) => 
                          handleServiceToggle(service, checked as boolean)
                        }
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getServiceIcon(service.category)}
                          <h4 className="font-medium">{service.name}</h4>
                          <Badge variant="outline">{service.category}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {service.description}
                        </p>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {service.features.map((feature) => (
                            <Badge key={feature} variant="secondary" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                        <div className="text-sm font-medium">
                          {formatCurrency(service.basePrice)} {service.unit}
                        </div>
                      </div>
                    </div>
                    
                    {isSelected && (
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleQuantityChange(service.id, quantity - 1)}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <Input
                          type="number"
                          value={quantity}
                          onChange={(e) => 
                            handleQuantityChange(service.id, parseInt(e.target.value) || 1)
                          }
                          className="w-16 h-8 text-center"
                          min="1"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleQuantityChange(service.id, quantity + 1)}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Cost Summary */}
      {(selectedVenue || selectedServices.length > 0) && (
        <Card className="bg-accent/50 border-accent">
          <CardHeader>
            <CardTitle className="text-lg">Cost Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {selectedVenue && (
                <div className="flex justify-between">
                  <span>Venue</span>
                  <span className="font-medium">
                    {formatCurrency(venues.find(v => v.id === selectedVenue)?.basePrice || 0)}
                  </span>
                </div>
              )}
              {selectedServices.map((item) => {
                const service = services.find(s => s.id === item.serviceId);
                return (
                  <div key={item.serviceId} className="flex justify-between">
                    <span>
                      {service?.name} × {item.quantity}
                    </span>
                    <span className="font-medium">
                      {formatCurrency(item.subtotal)}
                    </span>
                  </div>
                );
              })}
              <div className="border-t pt-2 flex justify-between text-lg font-semibold">
                <span>Total Estimated Cost</span>
                <span className="text-primary">{formatCurrency(calculateTotal())}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between pt-6">
        <Button onClick={onPrevious} variant="outline" size="lg">
          Previous
        </Button>
        <Button
          onClick={onNext}
          size="lg"
          disabled={!selectedVenue && selectedServices.length === 0}
          className="min-w-32"
        >
          Review Booking
        </Button>
      </div>
    </div>
  );
}