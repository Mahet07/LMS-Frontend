import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, Users, Star, BookOpen, Play, CheckCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';

const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();

  const [course, setCourse] = useState<any>(null);
  const [enrolled, setEnrolled] = useState(false);
  const [enrollmentId, setEnrollmentId] = useState<string | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<any>(null);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);

  const courseAPI = 'http://localhost:8080/api/courses';
  const enrollAPI = 'http://localhost:8080/api/student/enrollments';

  // ✅ Fetch course details
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(`${courseAPI}/${id}`);
        setCourse(res.data);
        if (res.data.lessons?.length > 0) {
          setSelectedLesson(res.data.lessons[0]);
        }
      } catch (err) {
        console.error('Error fetching course:', err);
      }
    };

    fetchCourse();
  }, [id]);

  // ✅ Check if the student is already enrolled
  useEffect(() => {
    const checkEnrollment = async () => {
      if (!user || user.role !== 'student') return;
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(
          `http://localhost:8080/api/student/enrollments/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (res.data) {
          setEnrolled(true);
          setEnrollmentId(res.data.id);
          setCompletedLessons(res.data.completedLessons || []);
        }
      } catch (err: any) {
        if (err.response && err.response.status === 404) {
          setEnrolled(false);
        } else {
          console.error('Error checking enrollment:', err);
        }
      }
    };

    checkEnrollment();
  }, [id, user]);

  // ✅ Handle enrollment (POST)
  const handleEnroll = async () => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Authentication required',
        description: 'Please login to enroll in courses',
      });
      return;
    }

    if (user.role !== 'student') {
      toast({
        variant: 'destructive',
        title: 'Access denied',
        description: 'Only students can enroll in courses',
      });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `http://localhost:8080/api/student/enroll/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setEnrolled(true);
      setEnrollmentId(res.data.id);
      toast({
        title: 'Enrollment successful!',
        description: `You are now enrolled in ${course?.title}`,
      });
    } catch (err: any) {
      console.error('Enrollment failed:', err);
      toast({
        variant: 'destructive',
        title: 'Enrollment failed',
        description:
          err.response?.data?.message || 'Something went wrong while enrolling.',
      });
    }
  };

  // ✅ Toggle lesson completion — now syncs with backend
  const toggleLessonComplete = async (lessonId: string) => {
    if (!enrollmentId) return;

    const token = localStorage.getItem('token');
    const alreadyCompleted = completedLessons.includes(lessonId);

    try {
      const url = alreadyCompleted
        ? `${enrollAPI}/${enrollmentId}/uncomplete-lesson`
        : `${enrollAPI}/${enrollmentId}/complete-lesson`;

      await axios.put(
        url,
        { lessonId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (alreadyCompleted) {
        setCompletedLessons(completedLessons.filter((id) => id !== lessonId));
      } else {
        setCompletedLessons([...completedLessons, lessonId]);
      }

      toast({
        title: alreadyCompleted ? 'Lesson unmarked' : 'Lesson completed!',
        description: alreadyCompleted
          ? 'Progress reverted successfully.'
          : 'Progress saved successfully.',
      });
    } catch (err) {
      console.error('Error updating lesson progress:', err);
      toast({
        variant: 'destructive',
        title: 'Error saving progress',
        description: 'Could not update lesson progress.',
      });
    }
  };

  // ✅ Loading state
  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-muted-foreground">Loading course...</p>
      </div>
    );
  }

  const progress = course.lessons?.length
    ? (completedLessons.length / course.lessons.length) * 100
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Link
          to="/courses"
          className="inline-flex items-center gap-2 text-primary hover:underline mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Courses
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {selectedLesson && enrolled ? (
              <Card>
                <CardContent className="p-0">
                  <div className="aspect-video bg-black">
                    {selectedLesson.type === 'video' ? (
                      <iframe
                        src={selectedLesson.url}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-white">
                        <p>Content type: {selectedLesson.type}</p>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h2 className="font-heading text-2xl font-bold mb-2">
                      {selectedLesson.title}
                    </h2>
                    <p className="text-muted-foreground">
                      {selectedLesson.description}
                    </p>
                    <div className="flex items-center gap-4 mt-4">
                      <Badge variant="outline">
                        <Clock className="h-3 w-3 mr-1" />
                        {selectedLesson.duration}
                      </Badge>
                      <Button
                        variant={
                          completedLessons.includes(selectedLesson.id)
                            ? 'default'
                            : 'outline'
                        }
                        size="sm"
                        onClick={() => toggleLessonComplete(selectedLesson.id)}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        {completedLessons.includes(selectedLesson.id)
                          ? 'Completed'
                          : 'Mark Complete'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-0">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-96 object-cover"
                  />
                  <div className="p-6">
                    <h1 className="font-heading text-4xl font-bold mb-4">
                      {course.title}
                    </h1>
                    <p className="text-lg text-muted-foreground mb-6">
                      {course.description}
                    </p>
                    {!enrolled ? (
                      <Button
                        onClick={handleEnroll}
                        size="lg"
                        className="gradient-primary gap-2"
                      >
                        <BookOpen className="h-5 w-5" />
                        Enroll Now - ${course.price}
                      </Button>
                    ) : (
                      <Badge
                        variant="secondary"
                        className="bg-green-500 text-white text-lg px-4 py-2"
                      >
                        Success
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div>
            <Card className="sticky top-20">
              <CardContent className="p-6">
                <h3 className="font-heading text-xl font-bold mb-4">
                  Course Details
                </h3>
                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Instructor</span>
                    <span className="font-medium">{course.instructorName}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Level</span>
                    <Badge variant="outline">{course.level}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Duration</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {course.duration}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Students</span>
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {course.enrolledStudents}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Rating</span>
                    <span className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-warning text-warning" />
                      {course.rating}
                    </span>
                  </div>
                </div>

                {enrolled && (
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Progress</span>
                      <span className="text-sm text-muted-foreground">
                        {Math.round(progress)}%
                      </span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                )}

                <div>
                  <h4 className="font-heading font-semibold mb-3">
                    Course Content
                  </h4>
                  <div className="space-y-2">
                    {course.lessons?.map((lesson: any) => (
                      <button
                        key={lesson.id}
                        onClick={() => enrolled && setSelectedLesson(lesson)}
                        disabled={!enrolled}
                        className={`w-full text-left p-3 rounded-lg border transition-all ${
                          selectedLesson?.id === lesson.id
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        } ${!enrolled && 'opacity-50 cursor-not-allowed'}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5">
                            {completedLessons.includes(lesson.id) ? (
                              <CheckCircle className="h-5 w-5 text-success" />
                            ) : (
                              <Play className="h-5 w-5 text-muted-foreground" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm line-clamp-1">
                              {lesson.title}
                            </p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                              <Clock className="h-3 w-3" />
                              {lesson.duration}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
