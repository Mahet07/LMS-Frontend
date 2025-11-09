import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Users, Star, BookOpen } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  instructorName: string;
  thumbnail: string;
  duration: string;
  enrolledStudents: number;
  rating: number;
  price: number;
  level: string;
  category: string;
}

const CourseCard: React.FC<CourseCardProps> = ({
  id,
  title,
  description,
  instructorName,
  thumbnail,
  duration,
  enrolledStudents,
  rating,
  price,
  level,
  category,
}) => {
  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-accent/20">
      <div className="relative overflow-hidden">
        <img
          src={thumbnail}
          alt={title}
          className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-2 right-2">
          <Badge className="bg-accent text-accent-foreground">{category}</Badge>
        </div>
      </div>

      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <Badge variant="outline">{level}</Badge>
          <div className="flex items-center gap-1 text-sm font-medium">
            <Star className="h-4 w-4 fill-warning text-warning" />
            <span>{rating}</span>
          </div>
        </div>
        <h3 className="font-heading text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">By {instructorName}</p>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{enrolledStudents}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t pt-4">
        <span className="font-heading text-2xl font-bold text-primary">${price}</span>
        <Link to={`/courses/${id}`}>
          <Button className="gradient-primary gap-2">
            <BookOpen className="h-4 w-4" />
            View Course
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default CourseCard;
