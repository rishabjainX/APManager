import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useBackpackStore } from '../store/backpackSlice';
import { useCoursesStore } from '../store/coursesSlice';
import { useNotesStore } from '../store/notesSlice';
import { usePracticeStore } from '../store/practiceSlice';
import { 
  BookOpen, 
  Target, 
  TrendingUp, 
  Plus, 
  ArrowRight,
  Clock,
  CheckCircle,
  Circle,
  Search,
  Briefcase,
  Settings
} from 'lucide-react';
import { formatDate } from '../utils/time';

export function Dashboard() {
  const { courses: backpackCourses, getCoursesByStatus } = useBackpackStore();
  const { courses: allCourses } = useCoursesStore();
  const { notes } = useNotesStore();
  const { attempts } = usePracticeStore();

  useEffect(() => {
    // Ensure courses are loaded
    if (allCourses.length === 0) {
      // This will trigger the store to fetch courses
    }
  }, [allCourses.length]);

  const inProgressCourses = getCoursesByStatus('in-progress');
  const plannedCourses = getCoursesByStatus('planned');
  const completedCourses = getCoursesByStatus('completed');

  const totalNotes = notes.length;
  const totalAttempts = attempts.length;
  const recentNotes = notes
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 3);

  const getCourseProgress = (courseId: string) => {
    const courseNotes = notes.filter(n => n.courseId === courseId);
    const courseAttempts = attempts.filter(a => a.courseId === courseId);
    const course = allCourses.find(c => c.id === courseId);
    
    if (!course) return { notes: 0, attempts: 0, units: 0 };
    
    return {
      notes: courseNotes.length,
      attempts: courseAttempts.length,
      units: course.units.length,
    };
  };

  const getOverallProgress = () => {
    if (backpackCourses.length === 0) return 0;
    
    const totalUnits = backpackCourses.reduce((sum, backpackCourse) => {
      const course = allCourses.find(c => c.id === backpackCourse.courseId);
      return sum + (course?.units.length || 0);
    }, 0);
    
    const completedUnits = backpackCourses.reduce((sum, backpackCourse) => {
      const course = allCourses.find(c => c.id === backpackCourse.courseId);
      if (!course) return sum;
      
      const courseNotes = notes.filter(n => n.courseId === backpackCourse.courseId);
      const uniqueUnitsWithNotes = new Set(courseNotes.map(n => n.unitId)).size;
      
      return sum + uniqueUnitsWithNotes;
    }, 0);
    
    return totalUnits > 0 ? Math.round((completedUnits / totalUnits) * 100) : 0;
  };

  if (backpackCourses.length === 0) {
    return (
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-foreground mb-4">
              Welcome to AP Manager
            </h1>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Start building your AP course collection by exploring available courses and adding them to your backpack.
            </p>
            <div className="space-x-4">
              <Link to="/explore">
                <Button size="lg">
                  <Search className="w-4 h-4 mr-2" />
                  Explore Courses
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Track your progress across {backpackCourses.length} AP courses
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{backpackCourses.length}</div>
              <p className="text-xs text-muted-foreground">
                {inProgressCourses.length} in progress
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getOverallProgress()}%</div>
              <p className="text-xs text-muted-foreground">
                Units with notes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Notes</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalNotes}</div>
              <p className="text-xs text-muted-foreground">
                Across all courses
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Practice Attempts</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalAttempts}</div>
              <p className="text-xs text-muted-foreground">
                FRQs and MCQs
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Course Progress */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Active Courses */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="w-5 h-5 mr-2" />
                Active Courses
              </CardTitle>
              <CardDescription>
                Courses you're currently working on
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {inProgressCourses.length > 0 ? (
                inProgressCourses.map((backpackCourse) => {
                  const course = allCourses.find(c => c.id === backpackCourse.courseId);
                  const progress = getCourseProgress(backpackCourse.courseId);
                  
                  if (!course) return null;
                  
                  return (
                    <div key={backpackCourse.id} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium">{course.name}</h4>
                          <Badge variant="secondary">{course.subject}</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {progress.notes} notes • {progress.attempts} attempts
                        </div>
                      </div>
                      <Link to={`/course/${course.id}`}>
                        <Button variant="ghost" size="sm">
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <Circle className="w-8 h-8 mx-auto mb-2" />
                  <p>No courses in progress</p>
                  <p className="text-sm">Start working on a planned course</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Recent Activity
              </CardTitle>
              <CardDescription>
                Your latest notes and practice attempts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentNotes.length > 0 ? (
                recentNotes.map((note) => {
                  const course = allCourses.find(c => c.id === note.courseId);
                  if (!course) return null;
                  
                  return (
                    <div key={note.id} className="flex items-center space-x-3 p-3 rounded-lg border">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{note.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {course.name} • {formatDate(note.updatedAt)}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <BookOpen className="w-8 h-8 mx-auto mb-2" />
                  <p>No recent activity</p>
                  <p className="text-sm">Start taking notes to see them here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Link to="/explore">
                <Button variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Course
                </Button>
              </Link>
              <Link to="/backpack">
                <Button variant="outline">
                  <Briefcase className="w-4 h-4 mr-2" />
                  Manage Backpack
                </Button>
              </Link>
              <Link to="/settings">
                <Button variant="outline">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
