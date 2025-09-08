import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { User, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import type { PersonalDetails } from '@/lib/data';

interface PersonalDetailsStepProps {
  data: Partial<PersonalDetails>;
  onUpdate: (data: Partial<PersonalDetails>) => void;
  onNext: () => void;
}

export function PersonalDetailsStep({ data, onUpdate, onNext }: PersonalDetailsStepProps) {
  const [formData, setFormData] = useState<Partial<PersonalDetails>>(data);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    onUpdate(formData);
  }, [formData, onUpdate]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName || formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Please enter your full name (min 2 characters)';
    }

    if (!formData.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone || !/^\+?[1-9]\d{6,14}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData.address || formData.address.trim().length < 10) {
      newErrors.address = 'Please enter your complete address';
    }

    if (formData.age && (formData.age < 1 || formData.age > 120)) {
      newErrors.age = 'Please enter a valid age';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onNext();
    }
  };

  const handleInputChange = (field: keyof PersonalDetails, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-accent/50 border-accent">
        <CardContent className="pt-4">
          <p className="text-sm text-accent-foreground">
            <strong>Required fields are marked with *</strong>
            <br />
            Your information is secure and will only be used for booking purposes.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Name */}
        <div className="space-y-2">
          <Label htmlFor="fullName" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Full Name *
          </Label>
          <Input
            id="fullName"
            value={formData.fullName || ''}
            onChange={(e) => handleInputChange('fullName', e.target.value)}
            placeholder="Enter your full name"
            className={errors.fullName ? 'border-destructive' : ''}
          />
          {errors.fullName && (
            <p className="text-sm text-destructive">{errors.fullName}</p>
          )}
        </div>

        {/* Age */}
        <div className="space-y-2">
          <Label htmlFor="age" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Age
          </Label>
          <Input
            id="age"
            type="number"
            value={formData.age || ''}
            onChange={(e) => handleInputChange('age', parseInt(e.target.value) || 0)}
            placeholder="Enter your age"
            min="1"
            max="120"
            className={errors.age ? 'border-destructive' : ''}
          />
          {errors.age && (
            <p className="text-sm text-destructive">{errors.age}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email" className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Email Address *
          </Label>
          <Input
            id="email"
            type="email"
            value={formData.email || ''}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="your.email@example.com"
            className={errors.email ? 'border-destructive' : ''}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email}</p>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="phone" className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            Phone Number *
          </Label>
          <Input
            id="phone"
            value={formData.phone || ''}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            placeholder="+91 9876543210"
            className={errors.phone ? 'border-destructive' : ''}
          />
          {errors.phone && (
            <p className="text-sm text-destructive">{errors.phone}</p>
          )}
          <p className="text-xs text-muted-foreground">
            Include country code if outside India
          </p>
        </div>
      </div>

      {/* Address */}
      <div className="space-y-2">
        <Label htmlFor="address" className="flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          Address *
        </Label>
        <Textarea
          id="address"
          value={formData.address || ''}
          onChange={(e) => handleInputChange('address', e.target.value)}
          placeholder="Enter your complete address including city, state, and pincode"
          rows={3}
          className={errors.address ? 'border-destructive' : ''}
        />
        {errors.address && (
          <p className="text-sm text-destructive">{errors.address}</p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between pt-6">
        <div></div>
        <Button onClick={handleSubmit} size="lg" className="min-w-32">
          Next Step
        </Button>
      </div>
    </div>
  );
}