import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useCoursesStore } from './store/coursesSlice';
import { useBackpackStore } from './store/backpackSlice';
import { subjects, allTags } from './data/coursesData';
import { Star, X, Briefcase } from 'lucide-react';

// Simple Sidebar component
function Sidebar() {
  return (
    <div className="w-64 bg-card border-r min-h-screen p-4">
      <h1 className="text-xl font-bold mb-6">AP Manager</h1>
      <nav className="space-y-2">
        <a href="/" className="block p-2 rounded hover:bg-accent">Dashboard</a>
        <a href="/explore" className="block p-2 rounded hover:bg-accent">Explore Courses</a>
        <a href="/backpack" className="block p-2 rounded hover:bg-accent">My Backpack</a>
        <a href="/notes" className="block p-2 rounded hover:bg-accent">Notes</a>
        <a href="/practice" className="block p-2 rounded hover:bg-accent">Practice</a>
        <a href="/settings" className="block p-2 rounded hover:bg-accent">Settings</a>
      </nav>
    </div>
  );
}

// Course Detail Modal Component
function CourseDetailModal({ course, isOpen, onClose }: { course: any; isOpen: boolean; onClose: () => void }) {
  if (!isOpen || !course) return null;

  const renderStars = (stars: number) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            size={20}
            className={index < stars ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
          />
        ))}
      </div>
    );
  };

  const parseExamFormat = (examString: string) => {
    // Extract duration, MCQ count, and FRQ count from exam string
    // Format: "3 hours: 60 multiple choice (50%), 6 free-response (50%)"
    const durationMatch = examString.match(/(\d+(?:\s*hours?)?(?:\s*\d+\s*min)?)/i);
    
    // More flexible regex for multiple choice - handles various formats
    // Look for patterns like "60 multiple choice", "80 multiple choice", etc.
    const mcqMatch = examString.match(/(\d+)\s*(?:multiple\s*choice|multiple-choice|MC)/i);
    const frqMatch = examString.match(/(\d+)\s*(?:free-response|free\s*response|FRQ)/i);
    
    let duration = durationMatch ? durationMatch[1] : 'Varies';
    
    // If duration is just a number, assume it's hours
    if (/^\d+$/.test(duration)) {
      duration = `${duration} hours`;
    }
    
    return {
      duration: duration,
      mcqCount: mcqMatch ? mcqMatch[1] : '0',
      frqCount: frqMatch ? frqMatch[1] : '0'
    };
  };

  // Get color class for unit weighting based on percentage
  const getWeightingColor = (weighting: string) => {
    // Extract the highest percentage from ranges like "8–11%" or single values like "15%"
    const match = weighting.match(/(\d+)/);
    if (!match) return 'bg-gray-100 text-gray-700';
    
    const percentage = parseInt(match[1]);
    

    
    if (percentage >= 25) return 'bg-red-100 text-red-800 border-red-200'; // Very heavy
    if (percentage >= 20) return 'bg-orange-100 text-orange-800 border-orange-200'; // Heavy
    if (percentage >= 15) return 'bg-yellow-100 text-yellow-800 border-yellow-200'; // Medium-heavy
    if (percentage >= 10) return 'bg-blue-100 text-blue-800 border-blue-200'; // Medium
    if (percentage >= 5) return 'bg-green-100 text-green-800 border-green-200'; // Light
    return 'bg-gray-100 text-gray-700 border-gray-200'; // Very light
  };

  const examInfo = parseExamFormat(course.exam || '');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="text-6xl">{course.emoji}</div>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Course Information */}
            <div>
              <h2 className="text-3xl font-bold mb-3">{course.name}</h2>
              <p className="text-xl text-muted-foreground mb-4">{course.subject}</p>
              
              <p className="text-foreground mb-6 leading-relaxed text-lg">{course.description}</p>
              
              {/* Course Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-secondary p-4 rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">Mean Score</div>
                  <div className="text-2xl font-bold text-primary">{course.meanScore}</div>
                </div>
                <div className="bg-secondary p-4 rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">Pass Rate</div>
                  <div className="text-2xl font-bold text-primary">{course.passRate}%</div>
                </div>
              </div>
              
              {/* Difficulty Level */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Difficulty Level</h3>
                <div className="text-xl">{renderStars(course.stars)}</div>
              </div>
              
              {/* Exam Date */}
              {course.examDate && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Exam Date</h3>
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">📅</div>
                                              <div>
                          <div className="font-semibold text-blue-900">{course.examDate}</div>
                        </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Prerequisites */}
              {course.prerequisites && course.prerequisites !== 'None' && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Prerequisites</h3>
                  <div className="bg-secondary/50 p-4 rounded-lg">
                    <p className="text-foreground">{course.prerequisites}</p>
                  </div>
                </div>
              )}
              
              {/* Big Ideas */}
              {course.bigIdeas && course.bigIdeas.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Big Ideas</h3>
                  <div className="flex flex-wrap gap-2">
                    {course.bigIdeas.map((idea: string, index: number) => (
                      <span 
                        key={index}
                        className="px-3 py-2 bg-primary/10 text-primary text-sm rounded-full border border-primary/20"
                      >
                        {idea}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Right Column - Units, Exam */}
            <div className="space-y-6">
              {/* Units */}
              {course.units && Object.keys(course.units).length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Course Units</h3>
                  <div className="space-y-2">
                    {Object.entries(course.units).map(([unitName, weighting], index) => (
                      <div key={index} className="bg-secondary/50 p-3 rounded-lg border-l-4 border-primary">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-foreground">Unit {index + 1}: {unitName}</span>
                          <span className={`text-sm font-semibold px-2 py-1 rounded border ${getWeightingColor(weighting as string)}`}>
                            {weighting as string}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Exam Format */}
              {course.exam && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Exam Format</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {/* Duration */}
                    <div className="bg-primary/10 p-4 rounded-lg border border-primary/20 text-center">
                      <div className="text-2xl mb-2">⏱️</div>
                      <div className="text-sm text-muted-foreground">Duration</div>
                      <div className="font-semibold text-primary">{examInfo.duration}</div>
                    </div>
                    
                    {/* Multiple Choice */}
                    <div className="bg-secondary p-4 rounded-lg text-center">
                      <div className="text-2xl mb-2">📝</div>
                      <div className="text-sm text-muted-foreground">Multiple Choice</div>
                      <div className="font-semibold">{examInfo.mcqCount} questions</div>
                      <div className="text-xs text-muted-foreground">50% of score</div>
                    </div>
                    
                    {/* Free Response */}
                    <div className="bg-secondary p-4 rounded-lg text-center">
                      <div className="text-2xl mb-2">✍️</div>
                      <div className="text-sm text-muted-foreground">Free Response</div>
                      <div className="font-semibold">{examInfo.frqCount} questions</div>
                      <div className="text-xs text-muted-foreground">50% of score</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-3 mt-8">
            <button 
              onClick={() => {
                const { addCourse, removeCourse, isInBackpack } = useBackpackStore.getState();
                if (isInBackpack(course.id)) {
                  removeCourse(course.id);
                } else {
                  addCourse(course.id);
                }
              }}
              className={`flex-1 py-3 px-4 rounded-lg transition-all duration-200 font-medium flex items-center justify-center gap-2 ${
                useBackpackStore.getState().isInBackpack(course.id)
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-primary text-primary-foreground hover:bg-primary/90'
              }`}
            >
              <Briefcase size={20} />
              {useBackpackStore.getState().isInBackpack(course.id) ? 'In Backpack' : 'Add to Backpack'}
            </button>
            <a 
              href={`https://apcentral.collegeboard.org/courses/ap-${course.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-secondary text-secondary-foreground py-3 px-4 rounded-lg hover:bg-secondary/80 transition-colors font-medium text-center"
            >
              View Details
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// Course Card Component
function CourseCard({ course, onClick }: { course: any; onClick: () => void }) {
  const renderStars = (stars: number) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            size={20}
            className={index < stars ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
          />
        ))}
      </div>
    );
  };

  return (
    <div 
      className="bg-card border rounded-lg p-6 hover:shadow-lg transition-all duration-200 cursor-pointer transform hover:scale-[1.02] hover:border-primary/30"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="text-4xl">{course.emoji}</div>
        <div className="text-right">
          <div className="text-lg font-semibold">{renderStars(course.stars)}</div>
        </div>
      </div>
      
      <h3 className="text-xl font-semibold mb-2">{course.name}</h3>
      <p className="text-sm text-muted-foreground mb-3">{course.subject}</p>
      
      <p className="text-sm text-foreground mb-4 line-clamp-3">{course.description}</p>
      
      <div className="flex gap-2 mb-4 overflow-hidden">
        {course.tags.slice(0, 3).map((tag: string, index: number) => (
          <span 
            key={index}
            className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-full whitespace-nowrap flex-shrink-0"
          >
            {tag}
          </span>
        ))}
        {course.tags.length > 3 && (
          <span className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-full whitespace-nowrap flex-shrink-0">
            +{course.tags.length - 3} more
          </span>
        )}
      </div>
      
      <button 
        onClick={(e) => {
          e.stopPropagation(); // Prevent opening modal
          const { addCourse, removeCourse, isInBackpack } = useBackpackStore.getState();
          if (isInBackpack(course.id)) {
            removeCourse(course.id);
          } else {
            addCourse(course.id);
          }
        }}
        className={`w-full py-2 px-4 rounded transition-all duration-200 flex items-center justify-center gap-2 ${
          useBackpackStore.getState().isInBackpack(course.id)
            ? 'bg-green-600 text-white hover:bg-green-700'
            : 'bg-primary text-primary-foreground hover:bg-primary/90'
        }`}
      >
        <Briefcase size={16} />
        {useBackpackStore.getState().isInBackpack(course.id) ? 'In Backpack' : 'Add to Backpack'}
      </button>
    </div>
  );
}

// Simple placeholder pages
function Dashboard() {
  const { courses, fetchCourses } = useCoursesStore();
  
  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);
  
  console.log('Dashboard - courses:', courses); // Debug log
  
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-foreground mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-2">Total Courses</h3>
          <p className="text-3xl font-bold text-primary">{courses.length}</p>
        </div>
        <div className="bg-card p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-2">Available Subjects</h3>
          <p className="text-3xl font-bold text-primary">{subjects.length}</p>
        </div>
        <div className="bg-card p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-2">Total Tags</h3>
          <p className="text-3xl font-bold text-primary">{allTags.length}</p>
        </div>
      </div>
    </div>
  );
}

function Explore() {
  const { 
    filteredCourses, 
    searchQuery, 
    selectedSubject, 
    selectedDifficulty,
    fetchCourses,
    setSearchQuery, 
    setSelectedSubject, 
    setSelectedDifficulty, 
    clearFilters 
  } = useCoursesStore();
  
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);
  
  const availableSubjects = ['All', ...subjects];
  const difficultyOptions = ['All', 'Easy (1-2 stars)', 'Medium (3 stars)', 'Hard (4-5 stars)'];
  
  const handleCourseClick = (course: any) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCourse(null);
  };
  
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Explore AP Courses</h1>
        <p className="text-muted-foreground">Browse and search all available AP courses</p>
      </div>
      
      {/* Search and Filters */}
      <div className="bg-card border rounded-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Search Courses</label>
            <input
              type="text"
              placeholder="Search by name, subject, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          {/* Subject Filter */}
          <div>
            <label className="block text-sm font-medium mb-2">Subject</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {availableSubjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>
          
          {/* Difficulty Filter */}
          <div>
            <label className="block text-sm font-medium mb-2">Difficulty</label>
            <select
              value={
                selectedDifficulty === 0 ? 'All' :
                selectedDifficulty === 1 ? 'Easy (1-2 stars)' :
                selectedDifficulty === 3 ? 'Medium (3 stars)' :
                selectedDifficulty === 4 ? 'Hard (4-5 stars)' : 'All'
              }
              onChange={(e) => {
                const value = e.target.value;
                if (value === 'All') {
                  setSelectedDifficulty(0);
                } else if (value === 'Easy (1-2 stars)') {
                  setSelectedDifficulty(1);
                } else if (value === 'Medium (3 stars)') {
                  setSelectedDifficulty(3);
                } else if (value === 'Hard (4-5 stars)') {
                  setSelectedDifficulty(4);
                }
              }}
              className="w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {difficultyOptions.map(difficulty => (
                <option key={difficulty} value={difficulty}>{difficulty}</option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Clear Filters */}
        <div className="mt-4 flex justify-between items-center">
          <button
            onClick={clearFilters}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Clear all filters
          </button>
          <div className="text-sm text-muted-foreground">
            Showing {filteredCourses.length} of {filteredCourses.length} courses
          </div>
        </div>
      </div>
      
      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map(course => (
          <CourseCard key={course.id} course={course} onClick={() => handleCourseClick(course)} />
        ))}
      </div>
      
      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No courses found matching your criteria.</p>
          <button
            onClick={clearFilters}
            className="mt-4 text-primary hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}
      
      {/* Course Detail Modal */}
      <CourseDetailModal 
        course={selectedCourse} 
        isOpen={isModalOpen} 
        onClose={closeModal} 
      />
    </div>
  );
}

function Backpack() {
  const { selectedCourses, removeCourse, clearBackpack } = useBackpackStore();
  const { courses, fetchCourses } = useCoursesStore();
  
  // Ensure courses are loaded
  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);
  
  // Get the full course objects for selected course IDs
  const backpackCourses = courses.filter(course => selectedCourses.includes(course.id));
  
  // Debug logging
  console.log('Backpack - selectedCourses:', selectedCourses);
  console.log('Backpack - courses length:', courses.length);
  console.log('Backpack - backpackCourses length:', backpackCourses.length);
  
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-foreground">My Backpack</h1>
        {selectedCourses.length > 0 && (
          <button
            onClick={clearBackpack}
            className="text-sm text-red-600 hover:text-red-800 transition-colors"
          >
            Clear All
          </button>
        )}
      </div>
      
      {selectedCourses.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎒</div>
          <p className="text-muted-foreground text-lg mb-4">Your backpack is empty</p>
          <p className="text-muted-foreground">Browse courses and add them to your backpack to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {backpackCourses.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <p className="text-muted-foreground">Debug: No courses found in backpackCourses</p>
              <p className="text-sm text-muted-foreground">Selected IDs: {selectedCourses.join(', ')}</p>
              <p className="text-sm text-muted-foreground">Available course IDs: {courses.map(c => c.id).join(', ')}</p>
            </div>
          ) : (
            backpackCourses.map(course => (
            <div key={course.id} className="bg-card border rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="text-4xl">{course.emoji}</div>
                <button
                  onClick={() => removeCourse(course.id)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <h3 className="text-xl font-semibold mb-2">{course.name}</h3>
              <p className="text-sm text-muted-foreground mb-3">{course.subject}</p>
              
              <p className="text-sm text-foreground mb-4 line-clamp-3">{course.description}</p>
              
              <div className="flex gap-2 mb-4 overflow-hidden">
                {course.tags.slice(0, 3).map((tag: string, index: number) => (
                  <span 
                    key={index}
                    className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-full whitespace-nowrap flex-shrink-0"
                  >
                    {tag}
                  </span>
                ))}
                {course.tags.length > 3 && (
                  <span className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-full whitespace-nowrap flex-shrink-0">
                    +{course.tags.length - 3} more
                  </span>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  {course.meanScore} avg • {course.passRate}% pass
                </div>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, index) => (
                    <Star
                      key={index}
                      size={16}
                      className={index < course.stars ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))
          )}
        </div>
      )}
    </div>
  );
}

function Notes() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-foreground mb-6">Notes</h1>
      <p className="text-muted-foreground">Your study notes will appear here</p>
    </div>
  );
}

function Practice() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-foreground mb-6">Practice</h1>
      <p className="text-muted-foreground">Practice questions and sessions will appear here</p>
    </div>
  );
}

function Settings() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-foreground mb-6">Settings</h1>
      <p className="text-muted-foreground">App settings and preferences will appear here</p>
    </div>
  );
}

// Main App component
function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-background text-foreground">
        <Sidebar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/backpack" element={<Backpack />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/practice" element={<Practice />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
