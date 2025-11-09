import React, { useEffect, useState } from 'react';
import {
  Users,
  BookOpen,
  Award,
  TrendingUp,
  Trash2,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

const AdminDashboard: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch users & courses on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, coursesRes] = await Promise.all([
          api.get('/admin/users', {
            headers: { Authorization: `Bearer ${user?.token}` },
          }),
          api.get('/admin/courses', {
            headers: { Authorization: `Bearer ${user?.token}` },
          }),
        ]);
        setUsers(usersRes.data);
        setCourses(coursesRes.data);
      } catch (err) {
        toast({
          variant: 'destructive',
          title: 'Error loading admin data',
          description: 'Please check your backend connection or token.',
        });
        console.error('Admin data load failed:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, toast]);

  // Delete user
  const handleDeleteUser = async (userId: string) => {
    try {
      await api.delete(`/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      setUsers(users.filter((u) => u.id !== userId));
      toast({ title: '✅ User deleted successfully' });
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Failed to delete user',
        description: 'Please try again later.',
      });
    }
  };

  // Approve or disapprove course
  const handleToggleCourseApproval = async (courseId: string, isApproved: boolean) => {
    try {
      const endpoint = isApproved
        ? `/admin/courses/${courseId}/disapprove`
        : `/admin/courses/${courseId}/approve`;
      const res = await api.put(
        endpoint,
        {},
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );
      setCourses(
        courses.map((c) => (c.id === courseId ? res.data : c))
      );
      toast({
        title: `Course ${isApproved ? 'disapproved' : 'approved'} successfully`,
      });
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Failed to update course status',
        description: 'Please try again later.',
      });
    }
  };

  // Delete course
  const handleDeleteCourse = async (courseId: string) => {
    try {
      await api.delete(`/admin/courses/${courseId}`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      setCourses(courses.filter((c) => c.id !== courseId));
      toast({ title: '✅ Course deleted successfully' });
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Failed to delete course',
        description: 'Please try again later.',
      });
    }
  };

  // Stats cards
  const stats = [
    {
      icon: Users,
      title: 'Total Users',
      value: users.length,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      icon: BookOpen,
      title: 'Total Courses',
      value: courses.length,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      icon: Award,
      title: 'Active Instructors',
      value: users.filter((u) => u.role === 'INSTRUCTOR').length,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      icon: TrendingUp,
      title: 'Active Students',
      value: users.filter((u) => u.role === 'STUDENT').length,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
  ];

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading admin dashboard...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="font-heading text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage users, courses, and platform settings
          </p>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                    <p className="font-heading text-3xl font-bold">{stat.value}</p>
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

        {/* User Management */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="font-heading">User Management</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          user.role === 'ADMIN'
                            ? 'default'
                            : user.role === 'INSTRUCTOR'
                            ? 'secondary'
                            : 'outline'
                        }
                      >
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Course Management */}
        <Card>
          <CardHeader>
            <CardTitle className="font-heading">Course Management</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Instructor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell className="font-medium">{course.title}</TableCell>
                    <TableCell>{course.instructorName}</TableCell>
                    <TableCell>
                      <Badge variant={course.isApproved ? 'default' : 'secondary'}>
                        {course.isApproved ? 'Approved' : 'Pending'}
                      </Badge>
                    </TableCell>
                    <TableCell>{course.enrolledStudents}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleToggleCourseApproval(course.id, course.isApproved)
                          }
                        >
                          {course.isApproved ? (
                            <XCircle className="h-4 w-4 text-warning" />
                          ) : (
                            <CheckCircle className="h-4 w-4 text-success" />
                          )}
                        </Button>
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
