// src/pages/instructor/CreateCourse.tsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/api';

const CreateCourse: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    level: 'Beginner',
    duration: '',
    price: '',
    thumbnail: '',
  });

  const [lessons, setLessons] = useState<any[]>([]);
  const [currentLesson, setCurrentLesson] = useState({
    title: '',
    description: '',
    type: 'video',
    url: '',
    duration: '',
  });

  const [loading, setLoading] = useState(false);

  const categories = [
    'Web Development',
    'Data Science',
    'Design',
    'Mobile Development',
    'Marketing',
    'Business',
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLessonInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCurrentLesson({ ...currentLesson, [e.target.name]: e.target.value });
  };

const handleAddLesson = () => {
  if (!currentLesson.title || !currentLesson.url) {
    toast({
      variant: 'destructive',
      title: 'Incomplete lesson',
      description: 'Please fill in all lesson fields',
    });
    return;
  }

  // ✅ Automatically convert YouTube watch URL to embed format
  let formattedUrl = currentLesson.url.trim();
  if (formattedUrl.includes('youtube.com/watch')) {
    const videoIdMatch = formattedUrl.match(/v=([^&]+)/);
    if (videoIdMatch && videoIdMatch[1]) {
      formattedUrl = `https://www.youtube.com/embed/${videoIdMatch[1]}`;
    }
  } else if (formattedUrl.includes('youtu.be/')) {
    const videoIdMatch = formattedUrl.match(/youtu\.be\/([^?]+)/);
    if (videoIdMatch && videoIdMatch[1]) {
      formattedUrl = `https://www.youtube.com/embed/${videoIdMatch[1]}`;
    }
  }

  setLessons([
    ...lessons,
    {
      ...currentLesson,
      url: formattedUrl, // ✅ use the embedded link
      id: `lesson-${Date.now()}`,
      order: lessons.length + 1,
    },
  ]);

  setCurrentLesson({
    title: '',
    description: '',
    type: 'video',
    url: '',
    duration: '',
  });

  toast({
    title: 'Lesson added',
    description: 'Lesson has been added to the course',
  });
};


  const handleRemoveLesson = (index: number) => {
    setLessons(lessons.filter((_, i) => i !== index));
  };

  // ✅ Submit handler integrated with backend API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.category) {
      toast({
        variant: 'destructive',
        title: 'Incomplete form',
        description: 'Please fill in all required fields',
      });
      return;
    }

    if (lessons.length === 0) {
      toast({
        variant: 'destructive',
        title: 'No lessons',
        description: 'Please add at least one lesson to the course',
      });
      return;
    }

    try {
      setLoading(true);

      const payload = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        level: formData.level, // ✅ backend expects "Beginner" (not uppercase)
        duration: formData.duration,
        price: parseFloat(formData.price || '0'),
        thumbnail: formData.thumbnail,
        lessons: lessons.map((l) => ({
          title: l.title,
          description: l.description,
          type: l.type, // backend expects lowercase "video"
          url: l.url,
          duration: l.duration,
          order: l.order,
        })),
      };

      // ✅ Properly configured Axios call
      const response = await api.post('/instructor/courses', payload, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        validateStatus: () => true, // prevent axios from throwing on 201
      });

      if (response.status === 201 || response.status === 200) {
        toast({
          title: '✅ Course created successfully!',
          description: `Your course "${formData.title}" was created.`,
        });
        navigate('/instructor/dashboard');
      } else {
        console.error('❌ Unexpected backend response:', response);
        toast({
          variant: 'destructive',
          title: 'Error creating course',
          description: response.data?.message || 'Unexpected server error.',
        });
      }
    } catch (error: any) {
      console.error('❌ Error creating course:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to create course',
        description:
          error.response?.data?.message ||
          'Something went wrong while creating the course.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link
          to="/instructor/dashboard"
          className="inline-flex items-center gap-2 text-primary hover:underline mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        <h1 className="font-heading text-4xl font-bold mb-8">Create New Course</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* COURSE INFORMATION */}
          <Card>
            <CardHeader>
              <CardTitle className="font-heading">Course Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Course Title *</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Complete Web Development Bootcamp"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe what students will learn..."
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="level">Level *</Label>
                  <Select
                    value={formData.level}
                    onValueChange={(value) => setFormData({ ...formData, level: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Total Duration</Label>
                  <Input
                    id="duration"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    placeholder="e.g., 40 hours"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="99.99"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="thumbnail">Thumbnail URL</Label>
                <Input
                  id="thumbnail"
                  name="thumbnail"
                  value={formData.thumbnail}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </CardContent>
          </Card>

          {/* LESSONS SECTION */}
          <Card>
            <CardHeader>
              <CardTitle className="font-heading">Add Lessons</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                <div className="space-y-2">
                  <Label htmlFor="lessonTitle">Lesson Title</Label>
                  <Input
                    id="lessonTitle"
                    name="title"
                    value={currentLesson.title}
                    onChange={handleLessonInputChange}
                    placeholder="e.g., Introduction to React"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lessonDescription">Lesson Description</Label>
                  <Textarea
                    id="lessonDescription"
                    name="description"
                    value={currentLesson.description}
                    onChange={handleLessonInputChange}
                    placeholder="Briefly describe this lesson..."
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="lessonType">Content Type</Label>
                    <Select
                      value={currentLesson.type}
                      onValueChange={(value) => setCurrentLesson({ ...currentLesson, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="video">Video</SelectItem>
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="audio">Audio</SelectItem>
                        <SelectItem value="text">Text</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lessonUrl">Content URL</Label>
                    <Input
                      id="lessonUrl"
                      name="url"
                      value={currentLesson.url}
                      onChange={handleLessonInputChange}
                      placeholder="https://..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lessonDuration">Duration</Label>
                    <Input
                      id="lessonDuration"
                      name="duration"
                      value={currentLesson.duration}
                      onChange={handleLessonInputChange}
                      placeholder="15:30"
                    />
                  </div>
                </div>

                <Button type="button" onClick={handleAddLesson} variant="outline" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Lesson
                </Button>
              </div>

              {lessons.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold">Added Lessons ({lessons.length})</h4>
                  {lessons.map((lesson, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{lesson.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {lesson.type} • {lesson.duration}
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveLesson(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Link to="/instructor/dashboard">
              <Button type="button" variant="outline" disabled={loading}>
                Cancel
              </Button>
            </Link>
            <Button type="submit" className="gradient-primary" disabled={loading}>
              {loading ? 'Creating...' : 'Create Course'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCourse;
