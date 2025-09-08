import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookingWizard } from '@/components/BookingWizard';
import { Dashboard } from '@/components/Dashboard';
import { 
  Calendar, 
  Users, 
  Star, 
  Award, 
  ArrowRight, 
  CheckCircle,
  Heart,
  Building,
  PartyPopper,
  Camera
} from 'lucide-react';
import { getBookings, formatCurrency } from '@/lib/data';
import heroImage from '@/assets/hero-event.jpg';

type View = 'home' | 'booking' | 'dashboard';

const Index = () => {
  const [currentView, setCurrentView] = useState<View>('home');
  const bookings = getBookings();

  if (currentView === 'booking') {
    return <BookingWizard />;
  }

  if (currentView === 'dashboard') {
    return <Dashboard onBack={() => setCurrentView('home')} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">EventPro</span>
          </div>
          
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => setCurrentView('dashboard')}
              className="hidden sm:flex"
            >
              My Bookings
            </Button>
            <Button 
              variant="hero" 
              onClick={() => setCurrentView('booking')}
              className="shadow-brand"
            >
              Book Event
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-90" />
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="relative container mx-auto px-4 py-24 lg:py-32">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              Create Unforgettable
              <span className="block bg-gradient-to-r from-white to-primary-light bg-clip-text text-transparent">
                Events
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 animate-slide-up">
              From intimate gatherings to grand celebrations, we make your special moments extraordinary
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
              <Button 
                size="xl" 
                variant="hero"
                onClick={() => setCurrentView('booking')}
                className="bg-white text-primary hover:bg-white/90 shadow-xl"
              >
                Start Planning <ArrowRight className="w-5 h-5" />
              </Button>
              <Button 
                size="xl" 
                variant="outline"
                onClick={() => setCurrentView('dashboard')}
                className="border-white text-white hover:bg-white/10"
              >
                View My Events
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">500+</div>
              <div className="text-muted-foreground">Events Organized</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">50+</div>
              <div className="text-muted-foreground">Premium Venues</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">98%</div>
              <div className="text-muted-foreground">Client Satisfaction</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">24/7</div>
              <div className="text-muted-foreground">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose EventPro?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We provide comprehensive event management services with attention to every detail
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Wedding Specialists</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Expert planning for your special day with cultural sensitivity and attention to tradition
                </p>
              </CardContent>
            </Card>

            <Card className="text-center shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Building className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Corporate Events</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Professional event management for conferences, meetings, and corporate celebrations
                </p>
              </CardContent>
            </Card>

            <Card className="text-center shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <PartyPopper className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Private Parties</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Birthdays, anniversaries, and celebrations that create lasting memories
                </p>
              </CardContent>
            </Card>

            <Card className="text-center shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Camera className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Full Service</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Complete packages including venues, catering, photography, and entertainment
                </p>
              </CardContent>
            </Card>

            <Card className="text-center shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Dedicated Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Personal event coordinator assigned to ensure everything runs smoothly
                </p>
              </CardContent>
            </Card>

            <Card className="text-center shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Quality Guaranteed</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Vetted vendors, premium venues, and quality assurance for peace of mind
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Recent Bookings Preview */}
      {bookings.length > 0 && (
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Recent Bookings</h2>
              <p className="text-muted-foreground">See what events our clients are planning</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {bookings.slice(0, 3).map((booking) => (
                <Card key={booking.id} className="shadow-lg">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{booking.eventDetails.eventType}</CardTitle>
                      <Badge 
                        variant={booking.status === 'confirmed' ? 'default' : 'secondary'}
                      >
                        {booking.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>{new Date(booking.eventDetails.preferredDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span>{booking.eventDetails.attendees} guests</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-muted-foreground" />
                        <span>{formatCurrency(booking.totalEstimatedCost)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-8">
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => setCurrentView('dashboard')}
              >
                View All Bookings
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
            Ready to Plan Your Perfect Event?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Join hundreds of satisfied clients who trusted us with their special moments
          </p>
          <Button 
            size="xl" 
            variant="hero"
            onClick={() => setCurrentView('booking')}
            className="bg-white text-primary hover:bg-white/90 shadow-xl"
          >
            Start Your Event Journey <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">EventPro</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2024 EventPro. Making your events extraordinary.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
