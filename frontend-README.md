# EduLearn - Learning Management System Frontend

A complete, production-ready **Learning Management System (LMS)** built with **React 18, Vite, TypeScript, Tailwind CSS, and shadcn/ui**.

![EduLearn](https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=1200&h=400&fit=crop)

## 🚀 Features

### Authentication System
- **Login & Signup** with role-based access (Admin, Instructor, Student)
- JWT simulation via localStorage
- Protected routes with role validation
- Auto-redirect based on user role

### Admin Dashboard
- User management (view, delete users)
- Course approval system
- Platform statistics and analytics
- User role management

### Instructor Dashboard
- Create and manage courses
- Add lessons (video, PDF, audio, text)
- Track enrolled students
- View course analytics
- Edit/delete courses

### Student Dashboard
- Browse available courses
- Enroll in courses (prevents duplicates)
- Track learning progress
- View completed lessons
- Progress analytics

### Course & Lesson Features
- Advanced search and filtering
- Video/PDF lesson viewer
- Progress tracking per course
- Lesson completion marking
- Course ratings and reviews

### UI/UX
- Modern, responsive design with Tailwind CSS
- Beautiful gradient hero sections
- Smooth animations and transitions
- shadcn/ui component library
- Lucide React icons
- Inter font (body) + Poppins font (headings)
- Dark mode support (optional)

## 📁 Project Structure

```
frontend/
├── public/
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── CourseCard.tsx
│   │   └── ProtectedRoute.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx
│   ├── data/                # JSON mock data
│   │   ├── users.json
│   │   ├── courses.json
│   │   ├── lessons.json
│   │   └── enrollments.json
│   ├── pages/
│   │   ├── admin/
│   │   │   └── AdminDashboard.tsx
│   │   ├── instructor/
│   │   │   ├── InstructorDashboard.tsx
│   │   │   └── CreateCourse.tsx
│   │   ├── student/
│   │   │   └── StudentDashboard.tsx
│   │   ├── Index.tsx
│   │   ├── Login.tsx
│   │   ├── Signup.tsx
│   │   ├── Courses.tsx
│   │   ├── CourseDetail.tsx
│   │   └── NotFound.tsx
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── .env.example
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## 🛠️ Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Utility-first CSS
- **shadcn/ui** - Component library
- **React Router DOM** - Client-side routing
- **Lucide React** - Icon library
- **React Query** - Data fetching (ready for backend integration)

## 📦 Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

4. **Start development server**
```bash
npm run dev
```

The app will be available at `http://localhost:8080`

## 🔐 Demo Credentials

### Admin Account
- **Email:** admin@edulearn.com
- **Password:** admin123

### Instructor Account
- **Email:** instructor@edulearn.com
- **Password:** instructor123

### Student Account
- **Email:** student@edulearn.com
- **Password:** student123

## 🚀 Deployment

### Vercel
```bash
npm run build
vercel deploy
```

### Netlify
```bash
npm run build
netlify deploy --prod
```

## 📊 Dummy Data

The app uses JSON files in `src/data/` to simulate backend responses:

- **users.json**: 11 users (3 admins, 3 instructors, 5 students)
- **courses.json**: 5 courses across different categories
- **lessons.json**: 15 lessons with video URLs
- **enrollments.json**: 7 sample enrollments with progress tracking

## 🎨 Design System

The design system is defined in:
- `src/index.css` - Color tokens, gradients, animations
- `tailwind.config.ts` - Extended Tailwind configuration

### Color Palette
- **Primary:** Deep indigo (#1e1b4b)
- **Accent:** Vibrant teal (#06b6d4)
- **Success:** Green (#16a34a)
- **Warning:** Amber (#f59e0b)

### Typography
- **Headings:** Poppins (600-800)
- **Body:** Inter (300-700)

## 🔒 Authentication Flow

1. User submits login/signup form
2. Credentials validated against `users.json`
3. User object stored in AuthContext + localStorage
4. JWT token simulated and stored
5. Protected routes check user role
6. Auto-redirect to role-specific dashboard

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Collapsible navigation
- Touch-friendly UI elements

## 🧩 Component Architecture

### Context Providers
- **AuthProvider**: Manages authentication state globally
- **QueryClientProvider**: React Query for data fetching
- **TooltipProvider**: Global tooltip configuration

### Protected Routes
```tsx
<ProtectedRoute allowedRoles={['admin']}>
  <AdminDashboard />
</ProtectedRoute>
```

### Course Card Component
Reusable card with:
- Course thumbnail
- Metadata (duration, students, rating)
- Category and level badges
- CTA button

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔮 Future Enhancements

- [ ] Real backend integration (Express/Node.js)
- [ ] Video streaming with progress tracking
- [ ] Real-time chat between students/instructors
- [ ] Certificate generation upon completion
- [ ] Payment integration (Stripe)
- [ ] Email notifications
- [ ] Advanced analytics dashboard
- [ ] Quiz and assessment system
- [ ] Discussion forums

## 🤝 Contributing

Contributions welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- **Your Name** - Initial work

## 🙏 Acknowledgments

- shadcn/ui for the component library
- Lucide for beautiful icons
- Unsplash for stock images
- YouTube for educational video embeds

---

**Made with ❤️ using React + TypeScript + Tailwind CSS**
