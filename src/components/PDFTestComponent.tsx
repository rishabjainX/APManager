import React, { useState } from 'react';
import CourseStructureService from '../services/courseStructureService';
import type { ParsedCourseStructure } from '../utils/pdfParser';

const PDFTestComponent: React.FC = () => {
  const [courseId, setCourseId] = useState('physics-1-algebra-based');
  const [structure, setStructure] = useState<ParsedCourseStructure | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const courseStructureService = CourseStructureService.getInstance();
  const availableCourses = courseStructureService.getAvailableCourseIds();

  const testPDFParsing = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log(`Testing PDF parsing for course: ${courseId}`);
      const result = await courseStructureService.getCourseStructure(courseId);
      setStructure(result);
      console.log('Parsing result:', result);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('PDF parsing error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const clearCache = () => {
    courseStructureService.clearCache();
    setStructure(null);
    setError(null);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">PDF Parser Test</h1>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Select Course:</label>
          <select 
            value={courseId} 
            onChange={(e) => setCourseId(e.target.value)}
            className="w-full p-2 border rounded"
          >
            {availableCourses.map(id => (
              <option key={id} value={id}>{id}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-4">
          <button
            onClick={testPDFParsing}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Parsing...' : 'Test PDF Parsing'}
          </button>
          
          <button
            onClick={clearCache}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Clear Cache
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            <strong>Error:</strong> {error}
          </div>
        )}

        {structure && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Parsed Structure for {structure.name}</h2>
            
            <div className="space-y-4">
              {structure.units.map(unit => (
                <div key={unit.id} className="border rounded p-4">
                  <h3 className="font-semibold text-lg">
                    {unit.name} {unit.weighting && `(${unit.weighting})`}
                  </h3>
                  
                  <div className="mt-2 space-y-2">
                    {unit.topics.map(topic => (
                      <div key={topic.id} className="ml-4 border-l-2 border-gray-300 pl-4">
                        <h4 className="font-medium">{topic.name}</h4>
                        {topic.learningObjectives.length > 0 && (
                          <ul className="mt-1 text-sm text-gray-600">
                            {topic.learningObjectives.map((objective, index) => (
                              <li key={index}>• {objective}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PDFTestComponent;
