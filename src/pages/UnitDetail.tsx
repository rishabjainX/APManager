import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useCoursesStore } from '../store/coursesSlice';
import { useNotesStore } from '../store/notesSlice';
import { usePracticeStore } from '../store/practiceSlice';
import { frqmcqAdapter } from '../adapters/frqmcq';
import { 
  BookOpen, 
  Target, 
  FileText, 
  BarChart3,
  Plus,
  Save,
  Trash2,
  ExternalLink,
  Clock,
  CheckCircle,
  ArrowLeft,
  Play,
  Edit3
} from 'lucide-react';
import { formatDate, formatDuration } from '../utils/time';
import toast from 'react-hot-toast';

type TabType = 'notes' | 'practice';

export function UnitDetail() {
  const { courseId, unitId } = useParams<{ courseId: string; unitId: string }>();
  const [activeTab, setActiveTab] = useState<TabType>('notes');
  const [isEditing, setIsEditing] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const { getCourseById } = useCoursesStore();
  const { 
    notes, 
    createNote, 
    updateNote, 
    deleteNote, 
    getNotesByUnit,
    searchNotes 
  } = useNotesStore();
  const { 
    attempts, 
    getAccuracyByUnit, 
    getStreakByUnit,
    startSession 
  } = usePracticeStore();

  if (!courseId || !unitId) {
    return <div>Unit not found</div>;
  }

  const course = getCourseById(courseId);
  const unit = course?.units.find(u => u.id === unitId);
  const unitNotes = getNotesByUnit(courseId, unitId);
  const unitAttempts = attempts.filter(a => a.courseId === courseId && a.unitId === unitId);
  const accuracy = getAccuracyByUnit(courseId, unitId);
  const streak = getStreakByUnit(courseId, unitId);

  if (!course || !unit) {
    return (
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <h1 className="text-3xl font-bold text-foreground mb-4">Unit Not Found</h1>
            <p className="text-muted-foreground mb-8">
              The unit you're looking for doesn't exist.
            </p>
            <Link to={`/course/${courseId}`}>
              <Button>Back to Course</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleCreateNote = () => {
    const newNote = createNote(courseId, unitId, noteTitle || undefined, noteContent || undefined);
    setNoteTitle('');
    setNoteContent('');
    setIsEditing(false);
    toast.success('Note created successfully!');
  };

  const handleUpdateNote = () => {
    if (editingNoteId) {
      updateNote(editingNoteId, {
        title: noteTitle,
        bodyMarkdown: noteContent,
      });
      setNoteTitle('');
      setNoteContent('');
      setIsEditing(false);
      setEditingNoteId(null);
      toast.success('Note updated successfully!');
    }
  };

  const handleEditNote = (note: any) => {
    setEditingNoteId(note.id);
    setNoteTitle(note.title);
    setNoteContent(note.bodyMarkdown);
    setIsEditing(true);
  };

  const handleDeleteNote = (noteId: string) => {
    if (confirm('Are you sure you want to delete this note?')) {
      deleteNote(noteId);
      toast.success('Note deleted successfully!');
    }
  };

  const handleStartPractice = async (type: 'frq' | 'mcq') => {
    try {
      const questions = type === 'frq' 
        ? await frqmcqAdapter.getFRQs(courseId, unitId)
        : await frqmcqAdapter.getMCQs(courseId, unitId);
      
      if (questions.length === 0) {
        toast.error(`No ${type.toUpperCase()} questions available for this unit`);
        return;
      }

      const questionCount = type === 'mcq' 
        ? questions[0]?.count || 10 
        : Math.min(questions.length, 5);
      
      startSession(courseId, unitId, type, questionCount);
      toast.success(`${type.toUpperCase()} practice session started!`);
    } catch (error) {
      toast.error('Failed to start practice session');
    }
  };

  const filteredNotes = searchQuery 
    ? searchNotes(searchQuery, courseId, unitId)
    : unitNotes;

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Link to={`/course/${courseId}`}>
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Course
                </Button>
              </Link>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {course.name} - Unit {course.units.findIndex(u => u.id === unitId) + 1}
            </h1>
            <p className="text-muted-foreground text-lg">{unit.title}</p>
          </div>
          
          <div className="flex space-x-2">
            <Button onClick={() => setActiveTab('notes')} variant={activeTab === 'notes' ? 'default' : 'outline'}>
              <FileText className="w-4 h-4 mr-2" />
              Notes
            </Button>
            <Button onClick={() => setActiveTab('practice')} variant={activeTab === 'practice' ? 'default' : 'outline'}>
              <BarChart3 className="w-4 h-4 mr-2" />
              Practice
            </Button>
          </div>
        </div>

        {/* Unit Topics */}
        <Card>
          <CardHeader>
            <CardTitle>Unit Topics</CardTitle>
            <CardDescription>
              Official AP topics covered in this unit
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {unit.topics.map((topic) => (
                <div key={topic.id} className="flex items-center space-x-2 p-3 border rounded-lg">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <div className="flex-1">
                    <div className="font-medium">{topic.title}</div>
                    {topic.refCode && (
                      <div className="text-sm text-muted-foreground">Ref: {topic.refCode}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Notes Tab */}
        {activeTab === 'notes' && (
          <div className="space-y-6">
            {/* Notes Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Notes</h2>
              <Button onClick={() => setIsEditing(true)}>
                <Plus className="w-4 h-4 mr-2" />
                New Note
              </Button>
            </div>

            {/* Create/Edit Note */}
            {isEditing && (
              <Card>
                <CardHeader>
                  <CardTitle>
                    {editingNoteId ? 'Edit Note' : 'Create New Note'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    placeholder="Note title..."
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                  />
                  <textarea
                    placeholder="Write your notes in markdown..."
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    className="w-full h-64 p-3 border rounded-md resize-none font-mono text-sm"
                  />
                  <div className="flex space-x-2">
                    <Button onClick={editingNoteId ? handleUpdateNote : handleCreateNote}>
                      <Save className="w-4 h-4 mr-2" />
                      {editingNoteId ? 'Update Note' : 'Create Note'}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setIsEditing(false);
                        setEditingNoteId(null);
                        setNoteTitle('');
                        setNoteContent('');
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Search Notes */}
            <div className="relative">
              <Input
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            </div>

            {/* Notes List */}
            {filteredNotes.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No notes yet</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery ? 'No notes match your search.' : 'Start taking notes for this unit.'}
                  </p>
                  {!searchQuery && (
                    <Button onClick={() => setIsEditing(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create First Note
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredNotes.map((note) => (
                  <Card key={note.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{note.title}</CardTitle>
                          <CardDescription>
                            {formatDate(note.updatedAt)}
                          </CardDescription>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEditNote(note)}>
                            <Edit3 className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteNote(note.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="prose prose-sm max-w-none">
                        <pre className="whitespace-pre-wrap text-sm">{note.bodyMarkdown}</pre>
                      </div>
                      {note.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                          {note.tags.map((tag) => (
                            <Badge key={tag} variant="secondary">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Practice Tab */}
        {activeTab === 'practice' && (
          <div className="space-y-6">
            {/* Practice Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Practice</h2>
              <div className="flex space-x-2">
                <Button onClick={() => handleStartPractice('frq')}>
                  <Play className="w-4 h-4 mr-2" />
                  Start FRQ Practice
                </Button>
                <Button onClick={() => handleStartPractice('mcq')}>
                  <Play className="w-4 h-4 mr-2" />
                  Start MCQ Practice
                </Button>
              </div>
            </div>

            {/* Practice Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Practice Statistics</CardTitle>
                <CardDescription>
                  Your performance on this unit
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">{accuracy.percentage}%</div>
                    <div className="text-sm text-muted-foreground">Accuracy</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {accuracy.correct} of {accuracy.total} correct
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">{unitAttempts.length}</div>
                    <div className="text-sm text-muted-foreground">Total Attempts</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Across all question types
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">{streak}</div>
                    <div className="text-sm text-muted-foreground">Current Streak</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Consecutive 70%+ scores
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Attempts */}
            {unitAttempts.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Recent Practice Attempts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {unitAttempts.slice(0, 5).map((attempt) => (
                      <div key={attempt.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${
                            (attempt.correctCount / attempt.totalCount) >= 0.7 ? 'bg-green-500' : 'bg-red-500'
                          }`}></div>
                          <div>
                            <div className="font-medium">
                              {attempt.type.toUpperCase()} Practice
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {formatDate(attempt.date)}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">
                            {attempt.correctCount}/{attempt.totalCount}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {formatDuration(attempt.durationMinutes)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Available Questions */}
            <Card>
              <CardHeader>
                <CardTitle>Available Practice Questions</CardTitle>
                <CardDescription>
                  FRQs and MCQs for this unit
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <h3 className="font-medium">Free Response Questions</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Practice with past FRQs from official AP exams
                    </p>
                    <Button onClick={() => handleStartPractice('frq')} className="w-full">
                      <Play className="w-4 h-4 mr-2" />
                      Start FRQ Practice
                    </Button>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <BarChart3 className="w-5 h-5 text-green-600" />
                      <h3 className="font-medium">Multiple Choice Questions</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Test your knowledge with MCQs from practice exams
                    </p>
                    <Button onClick={() => handleStartPractice('mcq')} className="w-full">
                      <Play className="w-4 h-4 mr-2" />
                      Start MCQ Practice
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
