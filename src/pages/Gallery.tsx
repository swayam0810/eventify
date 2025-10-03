import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Quote, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import weddingHallImg from '@/assets/gallery-wedding-hall.jpg';
import birthdayDecorImg from '@/assets/gallery-birthday-decor.jpg';
import corporateEventImg from '@/assets/gallery-corporate-event.jpg';
import outdoorVenueImg from '@/assets/gallery-outdoor-venue.jpg';
import cateringImg from '@/assets/gallery-catering.jpg';
import stageDecorImg from '@/assets/gallery-stage-decor.jpg';

const galleryImages = [
  {
    id: 1,
    src: weddingHallImg,
    title: 'Elegant Wedding Hall',
    category: 'Wedding',
    description: 'Luxurious wedding venue with chandelier lighting and floral centerpieces'
  },
  {
    id: 2,
    src: birthdayDecorImg,
    title: 'Birthday Party Setup',
    category: 'Birthday',
    description: 'Vibrant birthday party decoration with themed elements'
  },
  {
    id: 3,
    src: corporateEventImg,
    title: 'Corporate Conference',
    category: 'Corporate',
    description: 'Professional corporate event with modern setup'
  },
  {
    id: 4,
    src: outdoorVenueImg,
    title: 'Outdoor Evening Event',
    category: 'Wedding',
    description: 'Romantic outdoor venue with elegant lighting'
  },
  {
    id: 5,
    src: cateringImg,
    title: 'Gourmet Catering',
    category: 'Catering',
    description: 'Professional catering service with exquisite presentation'
  },
  {
    id: 6,
    src: stageDecorImg,
    title: 'Stage Decoration',
    category: 'Wedding',
    description: 'Beautiful stage setup with floral arrangements'
  }
];

const testimonials = [
  {
    id: 1,
    name: 'Priya & Rahul Sharma',
    event: 'Wedding Celebration',
    rating: 5,
    text: 'Absolutely phenomenal service! Our wedding was a dream come true. The team handled every detail perfectly, from the stunning decorations to the delicious catering. Highly recommended!',
    date: 'December 2024'
  },
  {
    id: 2,
    name: 'Aditya Patel',
    event: 'Corporate Annual Meet',
    rating: 5,
    text: 'Professional and efficient! They organized our corporate event for 500+ attendees flawlessly. The venue setup was impressive and everything ran smoothly.',
    date: 'November 2024'
  },
  {
    id: 3,
    name: 'Sneha Reddy',
    event: 'Birthday Party',
    rating: 5,
    text: 'My daughter\'s 5th birthday party was magical! The themed decorations were amazing and all the kids had a blast. Thank you for making it so special!',
    date: 'January 2025'
  },
  {
    id: 4,
    name: 'Vikram & Anjali Mehta',
    event: 'Anniversary Celebration',
    rating: 5,
    text: 'Exceeded our expectations! The outdoor setup was breathtaking and the attention to detail was remarkable. Our 25th anniversary was unforgettable.',
    date: 'October 2024'
  }
];

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const categories = ['All', 'Wedding', 'Birthday', 'Corporate', 'Catering'];

  const filteredImages = selectedCategory === 'All' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
              EventPro Gallery
            </h1>
            <div className="w-32" />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* Gallery Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Our Event Gallery
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Explore our portfolio of beautifully executed events
            </p>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category)}
                className="min-w-[100px]"
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {filteredImages.map((image) => (
              <Card key={image.id} className="group overflow-hidden hover:shadow-brand transition-all duration-300">
                <CardContent className="p-0">
                  <div className="relative overflow-hidden aspect-video">
                    <img
                      src={image.src}
                      alt={image.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                      <Badge className="w-fit mb-2">{image.category}</Badge>
                      <h3 className="text-white text-xl font-semibold mb-2">{image.title}</h3>
                      <p className="text-white/90 text-sm">{image.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="mb-12">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Client Testimonials
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Hear what our happy clients have to say
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="hover:shadow-brand transition-shadow duration-300">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <Quote className="h-10 w-10 text-primary flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-5 w-5 fill-warning text-warning" />
                        ))}
                      </div>
                      <p className="text-foreground mb-4 leading-relaxed italic">
                        "{testimonial.text}"
                      </p>
                    </div>
                  </div>
                  <div className="border-t pt-4">
                    <p className="font-semibold text-lg">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.event}</p>
                    <p className="text-xs text-muted-foreground mt-1">{testimonial.date}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center py-12 px-4">
          <Card className="max-w-3xl mx-auto bg-gradient-to-br from-primary/10 to-primary-dark/10 border-primary/20">
            <CardContent className="p-12">
              <h3 className="text-3xl font-bold mb-4">Ready to Create Your Perfect Event?</h3>
              <p className="text-muted-foreground mb-8 text-lg">
                Let us bring your vision to life with our expert event management services
              </p>
              <Link to="/#booking">
                <Button size="lg" className="font-semibold">
                  Book Your Event Now
                </Button>
              </Link>
            </CardContent>
          </Card>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8 bg-muted/50">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2025 EventPro. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Gallery;
