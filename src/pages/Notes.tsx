import React, { useState, useEffect } from 'react';
import { useCoursesStore } from '../store/coursesSlice';
import { useBackpackStore } from '../store/backpackSlice';
import { ChevronRight, ChevronDown, AlertCircle, ChevronUp, Check } from 'lucide-react';

const Notes: React.FC = () => {
  const { courses, fetchCourses } = useCoursesStore();
  const { selectedCourses } = useBackpackStore();
  
  const [selectedCourseId, setSelectedCourseId] = useState<string>('physics-1-algebra-based');
  const [isCourseDropdownOpen, setIsCourseDropdownOpen] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  // Get courses from backpack
  const backpackCourses = courses.filter(course => selectedCourses.includes(course.id));
  
  // Get the currently selected course
  const selectedCourse = courses.find(course => course.id === selectedCourseId);

  const handleCourseChange = (courseId: string) => {
    setSelectedCourseId(courseId);
    setIsCourseDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.course-dropdown')) {
        setIsCourseDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex h-screen bg-background">
      {/* Left Sidebar - Course Navigation */}
      <div className="w-80 bg-card border-r overflow-y-auto">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold mb-2">Course Structure</h2>
          <div className="text-sm text-muted-foreground">
            {selectedCourse?.name || 'Select Course'}
          </div>
          <div className="text-xs text-amber-600 mt-1">
            ⚠️ PDF structure loading coming soon
          </div>
        </div>

        <div className="p-4">
          <div className="text-center py-8 text-muted-foreground">
            <div className="text-4xl mb-4">📚</div>
            <p className="text-sm">Course structure will be loaded from PDFs</p>
            <p className="text-xs mt-2">For now, showing placeholder content</p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b bg-card">
          <div className="flex items-center gap-3">
            <div className="relative course-dropdown">
              <button
                onClick={() => setIsCourseDropdownOpen(!isCourseDropdownOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border bg-background hover:bg-accent transition-colors"
              >
                <span className="text-2xl">{selectedCourse?.emoji || '📚'}</span>
                <span className="font-bold text-lg">{selectedCourse?.name || 'Select Course'}</span>
                {isCourseDropdownOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              
              {/* Course Dropdown */}
              {isCourseDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-card border rounded-lg shadow-lg z-10">
                  <div className="p-2">
                    <div className="text-xs font-medium text-muted-foreground px-2 py-1 mb-2">
                      Select Course
                    </div>
                    {backpackCourses.map((course) => (
                      <button
                        key={course.id}
                        onClick={() => handleCourseChange(course.id)}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded hover:bg-accent transition-colors text-left"
                      >
                        <span className="text-xl">{course.emoji}</span>
                        <div className="flex-1">
                          <div className="font-medium">{course.name}</div>
                          <div className="text-xs text-muted-foreground">{course.subject}</div>
                        </div>
                        {course.id === selectedCourseId && (
                          <Check size={16} className="text-primary" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          <p className="text-muted-foreground mt-2">
            Course structure will be loaded from PDFs soon
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 p-8">
          <div className="text-center py-12 text-muted-foreground">
            <div className="text-6xl mb-4">🚧</div>
            <h3 className="text-lg font-medium mb-2">PDF Structure Loading Coming Soon</h3>
            <p className="mb-4">We're working on loading course structures from PDFs</p>
            <p className="text-sm">For now, you can switch between courses using the dropdown above</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notes;
