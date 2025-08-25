import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useBackpackStore } from '../store/backpackSlice';
import { useCoursesStore } from '../store/coursesSlice';
import { useNotesStore } from '../store/notesSlice';
import { usePracticeStore } from '../store/practiceSlice';
import { apPhysics1Structure, getStatusColor, getStatusLabel } from '../data/apPhysics1Structure';
import { BookOpen, FileText, Target, CheckCircle } from 'lucide-react';
import { formatDate } from '../utils/time';

export function Dashboard() {
  const { selectedCourses } = useBackpackStore();
  const { courses: allCourses } = useCoursesStore();
  const { notes, topicStatuses, getTopicStatus } = useNotesStore();
  const { attempts } = usePracticeStore();

  useEffect(() => {
    // Ensure courses are loaded
    if (allCourses.length === 0) {
      // This will trigger the store to fetch courses
    }
  }, [allCourses.length]);

  // Get the full course objects for selected course IDs
  const backpackCourses = allCourses.filter(course => selectedCourses.includes(course.id));

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
      units: course.units ? Object.keys(course.units).length : 0,
    };
  };

  const getOverallProgress = () => {
    if (backpackCourses.length === 0) return 0;
    
    const totalUnits = backpackCourses.reduce((sum: number, course) => {
      return sum + (course.units ? Object.keys(course.units).length : 0);
    }, 0);
    
    const completedUnits = backpackCourses.reduce((sum: number, course) => {
      if (!course) return sum;
      
      const courseNotes = notes.filter(n => n.courseId === course.id);
      const uniqueUnitsWithNotes = new Set(courseNotes.map(n => n.unitId)).size;
      
      return sum + uniqueUnitsWithNotes;
    }, 0);
    
    return totalUnits > 0 ? Math.round((completedUnits / totalUnits) * 100) : 0;
  };

  // Calculate progress for AP Physics 1
  const physics1Topics = apPhysics1Structure.units.flatMap(unit => unit.topics);
  const totalTopics = physics1Topics.length;
  const completedTopics = physics1Topics.filter(topic => 
    getTopicStatus(apPhysics1Structure.id, topic.unitId, topic.id) === 'done'
  ).length;
  const inProgressTopics = physics1Topics.filter(topic => {
    const status = getTopicStatus(apPhysics1Structure.id, topic.unitId, topic.id);
    return status === 'reviewing' || status === 'reviewing-in-class' || status === 'lesson-taught';
  }).length;
  
  const progressPercentage = Math.round((completedTopics / totalTopics) * 100);
  
  if (selectedCourses.length === 0) {
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
      <h1 className="text-3xl font-bold text-foreground mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-card p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-2">Total Courses</h3>
          <p className="text-3xl font-bold text-primary">{selectedCourses.length}</p>
        </div>
        <div className="bg-card p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-2">Overall Progress</h3>
          <p className="text-3xl font-bold text-primary">{getOverallProgress()}%</p>
        </div>
        <div className="bg-card p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-2">Total Notes</h3>
          <p className="text-3xl font-bold text-primary">{totalNotes}</p>
        </div>
      </div>

      {/* Notes Progress Overview */}
      <div className="bg-card border rounded-lg p-6 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="text-primary" size={24} />
          <h2 className="text-xl font-semibold">AP Physics 1 Progress</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-1">{totalTopics}</div>
            <div className="text-sm text-muted-foreground">Total Topics</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-1">{completedTopics}</div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-1">{inProgressTopics}</div>
            <div className="text-sm text-muted-foreground">In Progress</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600 mb-1">{totalTopics - completedTopics - inProgressTopics}</div>
            <div className="text-sm text-muted-foreground">Not Started</div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Overall Progress</span>
            <span className="text-sm text-muted-foreground">{progressPercentage}%</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
        
        {/* Unit Progress */}
        <div className="space-y-3">
          <h3 className="font-medium text-foreground">Unit Progress</h3>
          {apPhysics1Structure.units.map((unit) => {
            const unitTopics = unit.topics;
            const unitCompleted = unitTopics.filter(topic => 
              getTopicStatus(apPhysics1Structure.id, unit.id, topic.id) === 'done'
            ).length;
            const unitProgress = Math.round((unitCompleted / unitTopics.length) * 100);
            
            return (
              <div key={unit.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{unit.name}</span>
                  <span className="text-xs text-muted-foreground">({unit.weighting})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {unitCompleted}/{unitTopics.length}
                  </span>
                  <div className="w-20 bg-secondary rounded-full h-1.5">
                    <div 
                      className="bg-primary h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${unitProgress}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Notes */}
      <div className="bg-card border rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="text-primary" size={24} />
          <h2 className="text-xl font-semibold">Recent Notes</h2>
        </div>
        
        {notes.length > 0 ? (
          <div className="space-y-3">
            {notes
              .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
              .slice(0, 5)
              .map((note) => (
                <div key={note.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50">
                  <div>
                    <h4 className="font-medium">{note.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {note.courseId} • {note.unitId} • {note.topicId}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(note.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <FileText size={32} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">No notes yet</p>
            <p className="text-xs">Start taking notes to track your progress</p>
          </div>
        )}
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
                Add New Course
              </Button>
            </Link>
            <Link to="/backpack">
              <Button variant="outline">
                Manage Backpack
              </Button>
            </Link>
            <Link to="/notes">
              <Button variant="outline">
                View Notes
              </Button>
            </Link>
            <Link to="/settings">
              <Button variant="outline">
                Settings
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
