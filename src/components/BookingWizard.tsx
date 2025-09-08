import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { PersonalDetailsStep } from './wizard/PersonalDetailsStep';
import { EventDetailsStep } from './wizard/EventDetailsStep';
import { ServiceSelectionStep } from './wizard/ServiceSelectionStep';
import { ReviewStep } from './wizard/ReviewStep';
import { CheckCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import type { PersonalDetails, EventDetails, BookingItem } from '@/lib/data';

interface BookingData {
  personalDetails: Partial<PersonalDetails>;
  eventDetails: Partial<EventDetails>;
  selectedServices: BookingItem[];
  selectedVenue?: string;
}

const steps = [
  { id: 1, title: 'Personal Details', description: 'Your information' },
  { id: 2, title: 'Event Details', description: 'Event information' },
  { id: 3, title: 'Service Selection', description: 'Choose services' },
  { id: 4, title: 'Review', description: 'Confirm booking' },
];

export function BookingWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState<BookingData>({
    personalDetails: {},
    eventDetails: {},
    selectedServices: [],
  });

  const progress = (currentStep / steps.length) * 100;

  const updateBookingData = (stepData: Partial<BookingData>) => {
    setBookingData(prev => ({ ...prev, ...stepData }));
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (step: number) => {
    if (step <= currentStep) {
      setCurrentStep(step);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <PersonalDetailsStep
            data={bookingData.personalDetails}
            onUpdate={(data) => updateBookingData({ personalDetails: data })}
            onNext={handleNext}
          />
        );
      case 2:
        return (
          <EventDetailsStep
            data={bookingData.eventDetails}
            onUpdate={(data) => updateBookingData({ eventDetails: data })}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 3:
        return (
          <ServiceSelectionStep
            data={{
              selectedServices: bookingData.selectedServices,
              selectedVenue: bookingData.selectedVenue,
              eventDetails: bookingData.eventDetails,
            }}
            onUpdate={(data) => updateBookingData(data)}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 4:
        return (
          <ReviewStep
            bookingData={bookingData}
            onPrevious={handlePrevious}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-secondary py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Book Your Event</h1>
          <p className="text-muted-foreground">Follow these simple steps to book your perfect event</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-4">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`flex flex-col items-center cursor-pointer transition-colors ${
                  step.id <= currentStep ? 'text-primary' : 'text-muted-foreground'
                }`}
                onClick={() => handleStepClick(step.id)}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 mb-2 transition-all ${
                    step.id < currentStep
                      ? 'bg-primary border-primary text-primary-foreground'
                      : step.id === currentStep
                      ? 'border-primary text-primary'
                      : 'border-muted text-muted-foreground'
                  }`}
                >
                  {step.id < currentStep ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-medium">{step.id}</span>
                  )}
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium">{step.title}</div>
                  <div className="text-xs text-muted-foreground">{step.description}</div>
                </div>
              </div>
            ))}
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Content */}
        <Card className="shadow-lg animate-fade-in">
          <CardHeader>
            <CardTitle className="text-xl">
              Step {currentStep}: {steps[currentStep - 1].title}
            </CardTitle>
          </CardHeader>
          <CardContent>{renderStep()}</CardContent>
        </Card>
      </div>
    </div>
  );
}