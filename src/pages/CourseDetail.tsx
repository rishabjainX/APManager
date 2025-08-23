import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useCoursesStore } from '../store/coursesSlice';
import { useBackpackStore } from '../store/backpackSlice';
import { useNotesStore } from '../store/notesSlice';
import { usePracticeStore } from '../store/practiceSlice';
import { 
  BookOpen, 
  Target, 
  Clock, 
  CheckCircle,
  Plus,
  ArrowRight,
  TrendingUp,
  FileText,
  BarChart3
} from 'lucide-react';
import { formatDate } from '../utils/time';

export function CourseDetail() {
  const { courseId } = useParams<{ courseId: string }>();
  const { getCourseById } = useCoursesStore();
  const { courses: backpackCourses, addCourse, getCourseById: getBackpackCourse } = useBackpackStore();
  const { notes } = useNotesStore();
  const { attempts } = usePracticeStore();

  if (!courseId) {
    return <div>Course not found</div>;
  }

  const course = getCourseById(courseId);
  const backpackCourse = getBackpackCourse(courseId);
  const courseNotes = notes.filter(n => n.courseId === courseId);
  const courseAttempts = attempts.filter(a => a.courseId === courseId);

  if (!course) {
    return (
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <h1 className="text-3xl font-bold text-foreground mb-4">Course Not Found</h1>
            <p className="text-muted-foreground mb-8">
              The course you're looking for doesn't exist.
            </p>
            <Link to="/explore">
              <Button>Explore Courses</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isInBackpack = backpackCourses.some(c => c.courseId === courseId);
  const totalUnits = course.units.length;
  const unitsWithNotes = new Set(courseNotes.map(n => n.unitId)).size;
  const progressPercentage = Math.round((unitsWithNotes / totalUnits) * 100);

  const getUnitProgress = (unitId: string) => {
    const unitNotes = courseNotes.filter(n => n.unitId === unitId);
    const unitAttempts = courseAttempts.filter(a => a.unitId === unitId);
    
    return {
      notes: unitNotes.length,
      attempts: unitAttempts.length,
      lastActivity: unitNotes.length > 0 
        ? Math.max(...unitNotes.map(n => new Date(n.updatedAt).getTime()))
        : 0
    };
  };

  const handleAddToBackpack = () => {
    addCourse(courseId);
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Course Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">{course.name}</h1>
            <div className="flex items-center space-x-4">
              <Badge variant="outline">{course.subject}</Badge>
              <span className="text-muted-foreground">
                {totalUnits} units • {course.units.reduce((sum, unit) => sum + unit.topics.length, 0)} topics
              </span>
            </div>
          </div>
          
          <div className="flex space-x-2">
            {!isInBackpack ? (
              <Button onClick={handleAddToBackpack}>
                <Plus className="w-4 h-4 mr-2" />
                Add to Backpack
              </Button>
            ) : (
              <Badge variant="secondary" className="flex items-center space-x-1">
                <BookOpen className="w-3 h-3" />
                <span>In Backpack</span>
              </Badge>
            )}
          </div>
        </div>

        {/* Progress Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Progress Overview
            </CardTitle>
            <CardDescription>
              Track your progress through this course
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">{progressPercentage}%</div>
                <div className="text-sm text-muted-foreground">Units Covered</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {unitsWithNotes} of {totalUnits} units
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">{courseNotes.length}</div>
                <div className="text-sm text-muted-foreground">Total Notes</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Across all units
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">{courseAttempts.length}</div>
                <div className="text-sm text-muted-foreground">Practice Attempts</div>
                <div className="text-xs text-muted-foreground mt-1">
                  FRQs and MCQs
                </div>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-6">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-muted-foreground">Overall Progress</span>
                <span className="font-medium">{progressPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700">
                <div 
                  className="bg-primary h-3 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Units List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="w-5 h-5 mr-2" />
              Course Units
            </CardTitle>
            <CardDescription>
              Explore units and track your progress
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {course.units.map((unit, index) => {
                const progress = getUnitProgress(unit.id);
                const hasNotes = progress.notes > 0;
                const hasAttempts = progress.attempts > 0;
                
                return (
                  <div key={unit.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-foreground">
                            Unit {index + 1}: {unit.title}
                          </h3>
                          <div className="flex space-x-1">
                            {hasNotes && (
                              <Badge variant="secondary" className="flex items-center space-x-1">
                                <FileText className="w-3 h-3" />
                                <span>{progress.notes}</span>
                              </Badge>
                            )}
                            {hasAttempts && (
                              <Badge variant="secondary" className="flex items-center space-x-1">
                                <BarChart3 className="w-3 h-3" />
                                <span>{progress.attempts}</span>
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="text-sm text-muted-foreground mb-3">
                          {unit.topics.length} topics
                        </div>
                        
                        {/* Topics Preview */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                          {unit.topics.slice(0, 4).map((topic) => (
                            <div key={topic.id} className="text-sm text-muted-foreground">
                              • {topic.title}
                            </div>
                          ))}
                          {unit.topics.length > 4 && (
                            <div className="text-sm text-muted-foreground">
                              • +{unit.topics.length - 4} more topics
                            </div>
                          )}
                        </div>
                        
                        {/* Last Activity */}
                        {progress.lastActivity > 0 && (
                          <div className="text-xs text-muted-foreground">
                            Last activity: {formatDate(progress.lastActivity)}
                          </div>
                        )}
                      </div>
                      
                      <Link to={`/course/${courseId}/unit/${unit.id}`}>
                        <Button variant="outline" size="sm">
                          <ArrowRight className="w-4 h-4 mr-2" />
                          Open Unit
                        </Button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks for this course
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Link to={`/course/${courseId}/unit/${course.units[0]?.id}`}>
                <Button variant="outline">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Start with First Unit
                </Button>
              </Link>
              
              <Link to="/backpack">
                <Button variant="outline">
                  <Target className="w-4 h-4 mr-2" />
                  Manage Course Status
                </Button>
              </Link>
              
              <Link to="/explore">
                <Button variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Another Course
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
