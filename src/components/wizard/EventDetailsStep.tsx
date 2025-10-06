import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Users, DollarSign, Heart, Building, PartyPopper } from 'lucide-react';
import { eventTypes, budgetRanges, type EventDetails } from '@/lib/data';

interface EventDetailsStepProps {
  data: Partial<EventDetails>;
  onUpdate: (data: Partial<EventDetails>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export function EventDetailsStep({ data, onUpdate, onNext, onPrevious }: EventDetailsStepProps) {
  const [formData, setFormData] = useState<Partial<EventDetails>>(data);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    onUpdate(formData);
  }, [formData, onUpdate]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.eventType) {
      newErrors.eventType = 'Please select an event type';
    }

    if (!formData.preferredDate) {
      newErrors.preferredDate = 'Please select an event date';
    } else {
      const selectedDate = new Date(formData.preferredDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.preferredDate = 'Please select a future date';
      }
    }

    if (!formData.attendees || formData.attendees < 1) {
      newErrors.attendees = 'Please enter the number of attendees (must be greater than 0)';
    }

    if (!formData.budgetRange) {
      newErrors.budgetRange = 'Please select a budget range';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onNext();
    }
  };

  const handleInputChange = (field: keyof EventDetails, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'wedding':
        return <Heart className="w-4 h-4" />;
      case 'corporate':
        return <Building className="w-4 h-4" />;
      case 'birthday':
        return <PartyPopper className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  // Get tomorrow's date as minimum date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <div className="space-y-6">
      <Card className="bg-accent/50 border-accent">
        <CardContent className="pt-4">
          <p className="text-sm text-accent-foreground">
            <strong>Tell us about your event</strong>
            <br />
            This information helps us recommend the best services and venues for you.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Event Type */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            {getEventIcon(formData.eventType || '')}
            Event Type *
          </Label>
          <Select
            value={formData.eventType || ''}
            onValueChange={(value) => handleInputChange('eventType', value)}
          >
            <SelectTrigger className={errors.eventType ? 'border-destructive' : ''}>
              <SelectValue placeholder="Select event type" />
            </SelectTrigger>
            <SelectContent>
              {eventTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.eventType && (
            <p className="text-sm text-destructive">{errors.eventType}</p>
          )}
        </div>

        {/* Preferred Date */}
        <div className="space-y-2">
          <Label htmlFor="preferredDate" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Preferred Date *
          </Label>
          <Input
            id="preferredDate"
            type="date"
            value={formData.preferredDate || ''}
            onChange={(e) => handleInputChange('preferredDate', e.target.value)}
            min={minDate}
            className={errors.preferredDate ? 'border-destructive' : ''}
          />
          {errors.preferredDate && (
            <p className="text-sm text-destructive">{errors.preferredDate}</p>
          )}
        </div>

        {/* Expected Attendees */}
        <div className="space-y-2">
          <Label htmlFor="attendees" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Expected Attendees *
          </Label>
          <Input
            id="attendees"
            type="number"
            value={formData.attendees || ''}
            onChange={(e) => handleInputChange('attendees', parseInt(e.target.value) || 0)}
            placeholder="Number of guests"
            min="1"
            className={errors.attendees ? 'border-destructive' : ''}
          />
          {errors.attendees && (
            <p className="text-sm text-destructive">{errors.attendees}</p>
          )}
        </div>

        {/* Budget Range */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Budget Range *
          </Label>
          <Select
            value={formData.budgetRange || ''}
            onValueChange={(value) => handleInputChange('budgetRange', value)}
          >
            <SelectTrigger className={errors.budgetRange ? 'border-destructive' : ''}>
              <SelectValue placeholder="Select budget range" />
            </SelectTrigger>
            <SelectContent>
              {budgetRanges.map((range) => (
                <SelectItem key={range.value} value={range.value}>
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.budgetRange && (
            <p className="text-sm text-destructive">{errors.budgetRange}</p>
          )}
        </div>
      </div>

      {/* Additional Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes">
          Additional Notes (Optional)
        </Label>
        <Textarea
          id="notes"
          value={formData.notes || ''}
          onChange={(e) => handleInputChange('notes', e.target.value)}
          placeholder="Any special requirements, cultural considerations, or other details..."
          rows={3}
        />
      </div>

      {/* Wedding-specific fields */}
      {formData.eventType === 'wedding' && (
        <Card className="bg-accent/30 border-accent">
          <CardContent className="pt-4">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Heart className="w-4 h-4 text-primary" />
              Wedding Details
            </h3>
            <p className="text-sm text-muted-foreground">
              For wedding events, we offer specialized packages including mehendi, sangeet, 
              and reception arrangements. Our team will contact you to discuss cultural 
              requirements and multiple function planning.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between pt-6">
        <Button onClick={onPrevious} variant="outline" size="lg">
          Previous
        </Button>
        <Button 
          onClick={handleSubmit} 
          size="lg" 
          className="min-w-32"
          disabled={!formData.eventType || !formData.preferredDate || !formData.attendees || !formData.budgetRange}
        >
          Next Step
        </Button>
      </div>
    </div>
  );
}