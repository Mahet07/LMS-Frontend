import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Users, Award, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Index: React.FC = () => {
  const features = [
    {
      icon: BookOpen,
      title: 'Diverse Courses',
      description: 'Access thousands of courses across multiple disciplines and skill levels',
    },
    {
      icon: Users,
      title: 'Expert Instructors',
      description: 'Learn from industry professionals and experienced educators',
    },
    {
      icon: Award,
      title: 'Certificates',
      description: 'Earn recognized certificates upon course completion',
    },
    {
      icon: TrendingUp,
      title: 'Track Progress',
      description: 'Monitor your learning journey with detailed analytics',
    },
  ];

  return (
    <div className="min-h-screen">
      <section className="gradient-hero py-20 md:py-32 text-white animate-fade-in">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-heading text-5xl md:text-7xl font-bold mb-6 animate-slide-up">
            Transform Your Future
            <br />
            <span className="text-accent-light">With Quality Education</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl mx-auto">
            Join thousands of learners worldwide. Access expert-led courses, track your progress, and achieve your goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/courses">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-glow gap-2">
                Explore Courses
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl font-bold mb-4">Why Choose EduLearn?</h2>
            <p className="text-xl text-muted-foreground">
              Everything you need for a successful learning journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-2 hover:border-accent transition-all duration-300 hover:shadow-lg">
                <CardContent className="pt-6">
                  <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="font-heading text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-heading text-4xl font-bold mb-6">Ready to Start Learning?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join our community today and unlock your potential with expert-led courses
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" className="gradient-primary shadow-glow gap-2">
                  Create Account
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/courses">
                <Button size="lg" variant="outline">
                  Browse Courses
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="font-heading text-4xl font-bold mb-2">10,000+</div>
              <div className="text-primary-foreground/80">Active Students</div>
            </div>
            <div>
              <div className="font-heading text-4xl font-bold mb-2">500+</div>
              <div className="text-primary-foreground/80">Expert Instructors</div>
            </div>
            <div>
              <div className="font-heading text-4xl font-bold mb-2">1,200+</div>
              <div className="text-primary-foreground/80">Courses Available</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
