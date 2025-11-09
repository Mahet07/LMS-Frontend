import React, { useEffect, useState } from "react";
import { Plus, BookOpen, Users, Eye, Edit, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/api";

interface Course {
  id: string;
  title: string;
  category: string;
  isApproved: boolean;
  enrolledStudents: number;
  rating: number;
}

const InstructorDashboard: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch instructor courses from backend
  const fetchCourses = async () => {
    try {
      const response = await api.get("/instructor/courses", {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      setCourses(response.data || []);
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast({
        variant: "destructive",
        title: "Failed to load courses",
        description: "Unable to fetch courses from the server.",
      });
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete course from backend
  const handleDeleteCourse = async (courseId: string) => {
    try {
      await api.delete(`/instructor/courses/${courseId}`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      setCourses(courses.filter((c) => c.id !== courseId));
      toast({
        title: "Course deleted",
        description: "Your course has been removed successfully.",
      });
    } catch (error) {
      console.error("Error deleting course:", error);
      toast({
        variant: "destructive",
        title: "Failed to delete",
        description: "An error occurred while deleting the course.",
      });
    }
  };

  useEffect(() => {
    if (user) fetchCourses();
  }, [user]);

  const totalStudents = courses.reduce(
    (sum, course) => sum + (course.enrolledStudents || 0),
    0
  );
  const totalCourses = courses.length;
  const approvedCourses = courses.filter((c) => c.isApproved).length;
  const avgRating =
    courses.reduce((sum, c) => sum + (c.rating || 0), 0) /
    (courses.length || 1);

  const stats = [
    {
      icon: BookOpen,
      title: "Total Courses",
      value: totalCourses,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: Users,
      title: "Total Students",
      value: totalStudents,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      icon: Eye,
      title: "Approved Courses",
      value: approvedCourses,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      icon: BookOpen,
      title: "Avg Rating",
      value: avgRating.toFixed(1),
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
  ];

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-heading text-4xl font-bold mb-2">
              Instructor Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage your courses and track student progress
            </p>
          </div>
          <Link to="/instructor/create-course">
            <Button className="gradient-primary gap-2">
              <Plus className="h-5 w-5" />
              Create New Course
            </Button>
          </Link>
        </div>

        {/* Statistics */}
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

        {/* Courses Table */}
        <Card>
          <CardHeader>
            <CardTitle className="font-heading">My Courses</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center text-muted-foreground py-8">
                Loading courses...
              </p>
            ) : courses.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Course</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Students</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {courses.map((course) => (
                    <TableRow key={course.id}>
                      <TableCell className="font-medium">
                        {course.title}
                      </TableCell>
                      <TableCell>{course.category}</TableCell>
                      <TableCell>
                        <Badge
                          variant={course.isApproved ? "default" : "secondary"}
                        >
                          {course.isApproved ? "Approved" : "Pending"}
                        </Badge>
                      </TableCell>
                      <TableCell>{course.enrolledStudents || 0}</TableCell>
                      <TableCell>{course.rating?.toFixed(1) || "—"}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link to={`/courses/${course.id}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link to={`/instructor/edit-course/${course.id}`}>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteCourse(course.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-xl font-medium mb-2">No courses yet</p>
                <p className="text-muted-foreground mb-4">
                  Create your first course to start teaching.
                </p>
                <Link to="/instructor/create-course">
                  <Button className="gradient-primary gap-2">
                    <Plus className="h-5 w-5" />
                    Create Course
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InstructorDashboard;
