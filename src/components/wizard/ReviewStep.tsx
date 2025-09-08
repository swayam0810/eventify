import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  getVenueById, 
  getServiceById, 
  formatCurrency, 
  generateBookingReference,
  eventTypes,
  budgetRanges,
  type PersonalDetails,
  type EventDetails,
  type BookingItem 
} from '@/lib/data';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Users, 
  DollarSign,
  CheckCircle,
  Building,
  Utensils,
  Camera,
  Music,
  Flower2
} from 'lucide-react';

interface BookingData {
  personalDetails: Partial<PersonalDetails>;
  eventDetails: Partial<EventDetails>;
  selectedServices: BookingItem[];
  selectedVenue?: string;
}

interface ReviewStepProps {
  bookingData: BookingData;
  onPrevious: () => void;
}

export function ReviewStep({ bookingData, onPrevious }: ReviewStepProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const selectedVenue = bookingData.selectedVenue 
    ? getVenueById(bookingData.selectedVenue) 
    : null;

  const getServiceIcon = (category: string) => {
    switch (category) {
      case 'food':
        return <Utensils className="w-4 h-4" />;
      case 'photography':
        return <Camera className="w-4 h-4" />;
      case 'entertainment':
        return <Music className="w-4 h-4" />;
      case 'decoration':
        return <Flower2 className="w-4 h-4" />;
      default:
        return <Building className="w-4 h-4" />;
    }
  };

  const calculateTotal = () => {
    const venuePrice = selectedVenue?.basePrice || 0;
    const servicesTotal = bookingData.selectedServices.reduce(
      (sum, item) => sum + item.subtotal, 
      0
    );
    return venuePrice + servicesTotal;
  };

  const getEventTypeLabel = (value: string) => {
    return eventTypes.find(type => type.value === value)?.label || value;
  };

  const getBudgetRangeLabel = (value: string) => {
    return budgetRanges.find(range => range.value === value)?.label || value;
  };

  const handleSubmitBooking = async () => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const referenceId = generateBookingReference();
      
      toast({
        title: "Booking Submitted Successfully!",
        description: `Your booking reference is ${referenceId}. We'll contact you within 24 hours.`,
      });

      // In a real app, you would save to database/JSON file here
      console.log('Booking submitted:', {
        ...bookingData,
        referenceId,
        status: 'pending',
        totalEstimatedCost: calculateTotal(),
        createdAt: new Date().toISOString(),
      });

    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Personal Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Personal Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">{bookingData.personalDetails.fullName}</span>
            {bookingData.personalDetails.age && (
              <Badge variant="outline">Age: {bookingData.personalDetails.age}</Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <span>{bookingData.personalDetails.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-muted-foreground" />
            <span>{bookingData.personalDetails.phone}</span>
          </div>
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-muted-foreground mt-1" />
            <span className="text-sm">{bookingData.personalDetails.address}</span>
          </div>
        </CardContent>
      </Card>

      {/* Event Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Event Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="default">
              {getEventTypeLabel(bookingData.eventDetails.eventType || '')}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">
              {new Date(bookingData.eventDetails.preferredDate || '').toLocaleDateString('en-IN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span>{bookingData.eventDetails.attendees} attendees</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-muted-foreground" />
            <span>{getBudgetRangeLabel(bookingData.eventDetails.budgetRange || '')}</span>
          </div>
          {bookingData.eventDetails.notes && (
            <div className="mt-4">
              <h4 className="font-medium text-sm mb-2">Additional Notes:</h4>
              <p className="text-sm text-muted-foreground p-3 bg-muted rounded-md">
                {bookingData.eventDetails.notes}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Selected Venue */}
      {selectedVenue && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="w-5 h-5" />
              Selected Venue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium">{selectedVenue.name}</h4>
                <p className="text-sm text-muted-foreground">{selectedVenue.description}</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {selectedVenue.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {selectedVenue.capacity} capacity
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold">{formatCurrency(selectedVenue.basePrice)}</div>
                <Badge variant="secondary">{selectedVenue.type}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Selected Services */}
      {bookingData.selectedServices.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Selected Services</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {bookingData.selectedServices.map((item) => {
                const service = getServiceById(item.serviceId);
                if (!service) return null;

                return (
                  <div key={item.serviceId} className="flex justify-between items-start">
                    <div className="flex items-start gap-3">
                      {getServiceIcon(service.category)}
                      <div>
                        <h4 className="font-medium">{service.name}</h4>
                        <p className="text-sm text-muted-foreground">{service.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline">{service.category}</Badge>
                          <span className="text-sm text-muted-foreground">
                            Quantity: {item.quantity} {service.unit}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{formatCurrency(item.subtotal)}</div>
                      <div className="text-sm text-muted-foreground">
                        {formatCurrency(item.unitPrice)} × {item.quantity}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Total Cost */}
      <Card className="bg-accent/50 border-accent">
        <CardContent className="pt-6">
          <div className="space-y-2">
            {selectedVenue && (
              <div className="flex justify-between">
                <span>Venue Cost</span>
                <span className="font-medium">{formatCurrency(selectedVenue.basePrice)}</span>
              </div>
            )}
            {bookingData.selectedServices.length > 0 && (
              <div className="flex justify-between">
                <span>Services Cost</span>
                <span className="font-medium">
                  {formatCurrency(
                    bookingData.selectedServices.reduce((sum, item) => sum + item.subtotal, 0)
                  )}
                </span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between text-lg font-semibold">
              <span>Total Estimated Cost</span>
              <span className="text-primary">{formatCurrency(calculateTotal())}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              * Final cost may vary based on actual requirements and customizations
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Important Note */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <h4 className="font-medium text-primary mb-2">What happens next?</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Our team will review your booking within 24 hours</li>
                <li>• We'll contact you to confirm availability and finalize details</li>
                <li>• A dedicated event coordinator will be assigned to you</li>
                <li>• Payment options and schedule will be discussed</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between pt-6">
        <Button onClick={onPrevious} variant="outline" size="lg">
          Previous
        </Button>
        <Button
          onClick={handleSubmitBooking}
          size="lg"
          variant="hero"
          disabled={isSubmitting}
          className="min-w-40"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Booking'}
        </Button>
      </div>
    </div>
  );
}