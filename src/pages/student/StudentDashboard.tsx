import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Clock, Award, TrendingUp, Play } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import axios from "axios";

interface Course {
  id: string;
  title: string;
  description: string;
  instructorName: string;
  duration: string;
  thumbnail: string;
  totalLessons: number;
  rating: number;
}

interface Enrollment {
  id: string;
  courseId: string;
  progress: number;
  completedLessons: string[];
  enrolledAt: string;
  course: Course;
}

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const token = localStorage.getItem("token"); // must match what you store after login

        if (!token) {
          console.warn("No JWT token found in localStorage");
          setLoading(false);
          return;
        }

        const response = await axios.get<Enrollment[]>(
          "http://localhost:8080/api/student/enrollments",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setEnrollments(response.data);
      } catch (err) {
        console.error("Error fetching enrollments:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, []);

  const totalCourses = enrollments.length;
  const completedCourses = enrollments.filter((e) => e.progress === 100).length;
  const totalHours = enrollments.reduce((sum, e) => {
    const duration = parseInt(e.course?.duration?.replace(" hours", "") || "0");
    return sum + (isNaN(duration) ? 0 : duration);
  }, 0);
  const avgProgress =
    enrollments.reduce((sum, e) => sum + e.progress, 0) / (totalCourses || 1);

  const stats = [
    {
      icon: BookOpen,
      title: "Enrolled Courses",
      value: totalCourses,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: Award,
      title: "Completed",
      value: completedCourses,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      icon: Clock,
      title: "Learning Hours",
      value: totalHours,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      icon: TrendingUp,
      title: "Avg Progress",
      value: `${Math.round(avgProgress)}%`,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="font-heading text-4xl font-bold mb-2">
            My Learning Dashboard
          </h1>
          <p className="text-muted-foreground">
            Track your progress and continue learning
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {stat.title}
                    </p>
                    <p className="font-heading text-3xl font-bold">
                      {stat.value}
                    </p>
                  </div>
                  <div
                    className={`h-12 w-12 rounded-full ${stat.bgColor} flex items-center justify-center`}
                  >
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Enrollments Section */}
        <Card>
          <CardHeader>
            <CardTitle className="font-heading">My Courses</CardTitle>
          </CardHeader>
          <CardContent>
            {enrollments.length > 0 ? (
              <div className="space-y-4">
                {enrollments.map((enrollment) => {
                  const course = enrollment.course;
                  return (
                    <div
                      key={enrollment.id}
                      className="flex flex-col md:flex-row gap-4 p-4 border rounded-lg hover:shadow-lg transition-all"
                    >
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full md:w-48 h-32 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-heading text-xl font-semibold mb-1">
                              {course.title}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              By {course.instructorName} •{" "}
                              {course.totalLessons} lessons
                            </p>
                          </div>
                          <Badge
                            variant={
                              enrollment.progress === 100
                                ? "default"
                                : "secondary"
                            }
                          >
                            {enrollment.progress === 100
                              ? "Completed"
                              : "In Progress"}
                          </Badge>
                        </div>
                        <div className="mb-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">
                              Progress
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {enrollment.progress}%
                            </span>
                          </div>
                          <Progress value={enrollment.progress} className="h-2" />
                        </div>
                        <Link to={`/courses/${course.id}`}>
                          <Button className="gradient-primary gap-2">
                            <Play className="h-4 w-4" />
                            {enrollment.progress === 0
                              ? "Start Learning"
                              : "Continue Learning"}
                          </Button>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-xl font-medium mb-2">No enrolled courses yet</p>
                <p className="text-muted-foreground mb-4">
                  Start your learning journey by exploring our courses
                </p>
                <Link to="/courses">
                  <Button className="gradient-primary">Browse Courses</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboard;
