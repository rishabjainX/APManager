import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useBackpackStore } from '../store/backpackSlice';
import { useCoursesStore } from '../store/coursesSlice';
import { useNotesStore } from '../store/notesSlice';
import { usePracticeStore } from '../store/practiceSlice';
import { CourseStatus } from '../store/backpackSlice';
import { 
  Briefcase, 
  Trash2, 
  Edit3, 
  Target, 
  Clock, 
  CheckCircle,
  ArrowUp,
  ArrowDown,
  MoreHorizontal,
  BookOpen,
  TrendingUp
} from 'lucide-react';
import { formatDate, getRelativeTime } from '../utils/time';
import toast from 'react-hot-toast';

export function Backpack() {
  const { 
    courses: backpackCourses, 
    updateCourseStatus, 
    updateCourseDifficulty, 
    removeCourse,
    reorderCourses 
  } = useBackpackStore();
  const { courses: allCourses } = useCoursesStore();
  const { notes } = useNotesStore();
  const { attempts } = usePracticeStore();
  const [selectedCourses, setSelectedCourses] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<'name' | 'difficulty' | 'recent'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const getCourseDetails = (courseId: string) => {
    return allCourses.find(c => c.id === courseId);
  };

  const getCourseProgress = (courseId: string) => {
    const courseNotes = notes.filter(n => n.courseId === courseId);
    const courseAttempts = attempts.filter(a => a.courseId === courseId);
    const course = allCourses.find(c => c.id === courseId);
    
    if (!course) return { notes: 0, attempts: 0, units: 0, percentage: 0 };
    
    const unitsWithNotes = new Set(courseNotes.map(n => n.unitId)).size;
    const percentage = Math.round((unitsWithNotes / course.units.length) * 100);
    
    return {
      notes: courseNotes.length,
      attempts: courseAttempts.length,
      units: course.units.length,
      percentage,
    };
  };

  const handleStatusChange = (courseId: string, status: CourseStatus) => {
    updateCourseStatus(courseId, status);
    toast.success('Course status updated');
  };

  const handleDifficultyChange = (courseId: string, difficulty: 1 | 2 | 3 | 4 | 5) => {
    updateCourseDifficulty(courseId, difficulty);
    toast.success('Difficulty updated');
  };

  const handleRemoveCourse = (courseId: string) => {
    if (confirm('Are you sure you want to remove this course from your backpack?')) {
      removeCourse(courseId);
      toast.success('Course removed from backpack');
    }
  };

  const handleBulkStatusChange = (status: CourseStatus) => {
    selectedCourses.forEach(courseId => {
      updateCourseStatus(courseId, status);
    });
    setSelectedCourses(new Set());
    toast.success(`Updated ${selectedCourses.size} courses to ${status}`);
  };

  const handleBulkRemove = () => {
    if (confirm(`Are you sure you want to remove ${selectedCourses.size} courses from your backpack?`)) {
      selectedCourses.forEach(courseId => {
        removeCourse(courseId);
      });
      setSelectedCourses(new Set());
      toast.success(`Removed ${selectedCourses.size} courses from backpack`);
    }
  };

  const toggleCourseSelection = (courseId: string) => {
    const newSelected = new Set(selectedCourses);
    if (newSelected.has(courseId)) {
      newSelected.delete(courseId);
    } else {
      newSelected.add(courseId);
    }
    setSelectedCourses(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedCourses.size === backpackCourses.length) {
      setSelectedCourses(new Set());
    } else {
      setSelectedCourses(new Set(backpackCourses.map(c => c.id)));
    }
  };

  const sortedCourses = [...backpackCourses].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'name':
        const courseA = getCourseDetails(a.courseId);
        const courseB = getCourseDetails(b.courseId);
        comparison = (courseA?.name || '').localeCompare(courseB?.name || '');
        break;
      case 'difficulty':
        comparison = a.difficulty - b.difficulty;
        break;
      case 'recent':
        comparison = new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime();
        break;
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const getStatusIcon = (status: CourseStatus) => {
    switch (status) {
      case 'planned': return Clock;
      case 'in-progress': return Target;
      case 'completed': return CheckCircle;
      default: return Clock;
    }
  };

  const getStatusColor = (status: CourseStatus) => {
    switch (status) {
      case 'planned': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  if (backpackCourses.length === 0) {
    return (
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <Briefcase className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-foreground mb-4">
              Your Backpack is Empty
            </h1>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Start building your AP course collection by exploring available courses and adding them to your backpack.
            </p>
            <Link to="/explore">
              <Button size="lg">
                <BookOpen className="w-4 h-4 mr-2" />
                Explore Courses
              </Button>
            </Link>
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
          <h1 className="text-3xl font-bold text-foreground mb-2">My Backpack</h1>
          <p className="text-muted-foreground">
            Manage your selected AP courses and track your progress
          </p>
        </div>

        {/* Bulk Actions */}
        {selectedCourses.size > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Edit3 className="w-5 h-5 mr-2" />
                Bulk Actions ({selectedCourses.size} selected)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkStatusChange('planned')}
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Mark as Planned
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkStatusChange('in-progress')}
                >
                  <Target className="w-4 h-4 mr-2" />
                  Mark as In Progress
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkStatusChange('completed')}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark as Completed
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleBulkRemove}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remove Selected
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Course Management</CardTitle>
            <CardDescription>
              Sort, filter, and manage your courses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center gap-4">
              {/* Sort Controls */}
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'name' | 'difficulty' | 'recent')}
                  className="px-3 py-1 border rounded-md text-sm"
                >
                  <option value="name">Name</option>
                  <option value="difficulty">Difficulty</option>
                  <option value="recent">Recent Activity</option>
                </select>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                >
                  {sortOrder === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                </Button>
              </div>

              {/* Select All */}
              <Button
                variant="outline"
                size="sm"
                onClick={toggleSelectAll}
              >
                {selectedCourses.size === backpackCourses.length ? 'Deselect All' : 'Select All'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Course List */}
        <div className="space-y-4">
          {sortedCourses.map((backpackCourse, index) => {
            const course = getCourseDetails(backpackCourse.courseId);
            const progress = getCourseProgress(backpackCourse.courseId);
            const StatusIcon = getStatusIcon(backpackCourse.status);
            
            if (!course) return null;

            return (
              <Card key={backpackCourse.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={selectedCourses.has(backpackCourse.id)}
                      onChange={() => toggleCourseSelection(backpackCourse.id)}
                      className="mt-1 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                    />

                    {/* Course Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-foreground mb-1">
                            {course.name}
                          </h3>
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge variant="outline">{course.subject}</Badge>
                            <Badge 
                              variant="outline" 
                              className={`${getStatusColor(backpackCourse.status)} border-0`}
                            >
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {backpackCourse.status.replace('-', ' ')}
                            </Badge>
                          </div>
                        </div>
                        
                        {/* Actions */}
                        <div className="flex items-center space-x-2">
                          <Link to={`/course/${course.id}`}>
                            <Button variant="ghost" size="sm">
                              <BookOpen className="w-4 h-4" />
                            </Button>
                          </Link>
                          <div className="relative">
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-3">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium">{progress.percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progress.percentage}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="text-muted-foreground">Units</div>
                          <div className="font-medium">{progress.units}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Notes</div>
                          <div className="font-medium">{progress.notes}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Attempts</div>
                          <div className="font-medium">{progress.attempts}</div>
                        </div>
                      </div>

                      {/* Difficulty and Activity */}
                      <div className="flex items-center justify-between mt-3 pt-3 border-t">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <span className="text-sm text-muted-foreground">Difficulty:</span>
                            <div className="flex space-x-1">
                              {[1, 2, 3, 4, 5].map((level) => (
                                <button
                                  key={level}
                                  onClick={() => handleDifficultyChange(backpackCourse.id, level)}
                                  className={`w-3 h-3 rounded-full transition-colors ${
                                    level <= backpackCourse.difficulty
                                      ? 'bg-primary'
                                      : 'bg-gray-300 dark:bg-gray-600'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Last activity: {getRelativeTime(backpackCourse.lastActivity)}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
