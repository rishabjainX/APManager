import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useCoursesStore } from '../store/coursesSlice';
import { useBackpackStore } from '../store/backpackSlice';
import { APSubject } from '../adapters/apFramework';
import { BookOpen, Plus, Search, Filter, X } from 'lucide-react';
import toast from 'react-hot-toast';

export function Explore() {
  const { filteredCourses, searchQuery, selectedSubject, setSearchQuery, setSelectedSubject, clearFilters } = useCoursesStore();
  const { addCourse, courses: backpackCourses } = useBackpackStore();
  const [isLoading, setIsLoading] = useState(false);

  const subjects: APSubject[] = ['Science', 'Math', 'History', 'English', 'CS', 'World Language', 'Other'];

  const handleAddToBackpack = async (courseId: string) => {
    setIsLoading(true);
    try {
      addCourse(courseId);
      toast.success('Course added to backpack!');
    } catch (error) {
      toast.error('Failed to add course to backpack');
    } finally {
      setIsLoading(false);
    }
  };

  const isInBackpack = (courseId: string) => {
    return backpackCourses.some(c => c.courseId === courseId);
  };

  const getSubjectColor = (subject: APSubject) => {
    const colors = {
      Science: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      Math: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      History: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      English: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      CS: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      'World Language': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
      Other: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
    };
    return colors[subject] || colors.Other;
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Explore AP Courses</h1>
          <p className="text-muted-foreground">
            Discover and add AP courses to your personal backpack
          </p>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="w-5 h-5 mr-2" />
              Search & Filters
            </CardTitle>
            <CardDescription>
              Find courses by name, subject, or content
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search courses, units, or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Subject Filter */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Subject Filter
              </label>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedSubject === 'All' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedSubject('All')}
                >
                  All Subjects
                </Button>
                {subjects.map((subject) => (
                  <Button
                    key={subject}
                    variant={selectedSubject === subject ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedSubject(subject)}
                  >
                    {subject}
                  </Button>
                ))}
              </div>
            </div>

            {/* Clear Filters */}
            {(searchQuery || selectedSubject !== 'All') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4 mr-2" />
                Clear Filters
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Results */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground">
              {filteredCourses.length} Course{filteredCourses.length !== 1 ? 's' : ''} Found
            </h2>
            {searchQuery && (
              <p className="text-sm text-muted-foreground">
                Results for "{searchQuery}"
              </p>
            )}
          </div>

          {filteredCourses.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No courses found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search terms or filters
                </p>
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <Card key={course.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{course.name}</CardTitle>
                        <CardDescription className="mt-1">
                          {course.units.length} units • {course.units.reduce((sum, unit) => sum + unit.topics.length, 0)} topics
                        </CardDescription>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={`${getSubjectColor(course.subject)} border-0`}
                      >
                        {course.subject}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Units Preview */}
                    <div>
                      <h4 className="text-sm font-medium text-foreground mb-2">Units</h4>
                      <div className="space-y-1">
                        {course.units.slice(0, 3).map((unit) => (
                          <div key={unit.id} className="text-sm text-muted-foreground">
                            • {unit.title}
                          </div>
                        ))}
                        {course.units.length > 3 && (
                          <div className="text-sm text-muted-foreground">
                            • +{course.units.length - 3} more units
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="pt-2">
                      {isInBackpack(course.id) ? (
                        <Button variant="outline" disabled className="w-full">
                          <BookOpen className="w-4 h-4 mr-2" />
                          Already in Backpack
                        </Button>
                      ) : (
                        <Button
                          onClick={() => handleAddToBackpack(course.id)}
                          disabled={isLoading}
                          className="w-full"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add to Backpack
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Course Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Course Categories</CardTitle>
            <CardDescription>
              Browse courses by subject area
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {subjects.map((subject) => {
                const subjectCourses = filteredCourses.filter(c => c.subject === subject);
                return (
                  <div
                    key={subject}
                    className="p-4 rounded-lg border hover:border-primary transition-colors cursor-pointer"
                    onClick={() => setSelectedSubject(subject)}
                  >
                    <div className="text-center">
                      <div className={`w-12 h-12 rounded-lg mx-auto mb-2 flex items-center justify-center ${getSubjectColor(subject)}`}>
                        <BookOpen className="w-6 h-6" />
                      </div>
                      <h3 className="font-medium text-foreground">{subject}</h3>
                      <p className="text-sm text-muted-foreground">
                        {subjectCourses.length} course{subjectCourses.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
