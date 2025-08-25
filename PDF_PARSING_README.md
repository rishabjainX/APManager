# PDF Parsing System for AP Course Manager

## Overview
The AP Course Manager now includes a dynamic PDF parsing system that can automatically extract course structure from any AP course overview PDF. This replaces the hardcoded course structures with a flexible, extensible solution.

## Features

### ✅ **Dynamic PDF Parsing**
- Automatically parses AP course overview PDFs
- Extracts units, topics, and learning objectives
- Works with any AP course that has a PDF overview
- Caches parsed structures for performance

### ✅ **Smart Text Extraction**
- Uses PDF.js for client-side PDF processing
- Identifies common patterns in AP course structures
- Handles various PDF formats and layouts
- Fallback to generic structure if parsing fails

### ✅ **Extensible Course Support**
- Easy to add new courses by adding PDF URLs
- Currently supports 11 AP courses
- Automatically scales to new courses
- No code changes needed for new courses

## How It Works

### 1. **PDF Processing Pipeline**
```
PDF URL → PDF.js → Text Extraction → Pattern Matching → Structured Data
```

### 2. **Pattern Recognition**
The system looks for common AP course structure patterns:
- Unit identification: "Unit X: Name (X%)"
- Topic extraction: Bullet points, numbered lists
- Learning objectives: Structured content within topics

### 3. **Caching System**
- Parsed structures are cached locally
- Avoids re-parsing the same PDFs
- Improves performance for frequently accessed courses

## Supported Courses

Currently supports these AP courses with PDF overviews:

| Course ID | Course Name | PDF URL |
|-----------|-------------|---------|
| `physics-1-algebra-based` | AP Physics 1 | [Course at a Glance](https://apcentral.collegeboard.org/media/pdf/ap-physics-1-course-at-a-glance.pdf) |
| `chemistry` | AP Chemistry | [Course at a Glance](https://apcentral.collegeboard.org/media/pdf/ap-chemistry-course-at-a-glance.pdf) |
| `biology` | AP Biology | [Course at a Glance](https://apcentral.collegeboard.org/media/pdf/ap-biology-course-at-a-glance.pdf) |
| `calculus-ab` | AP Calculus AB | [Course at a Glance](https://apcentral.collegeboard.org/media/pdf/ap-calculus-ab-course-at-a-glance.pdf) |
| `calculus-bc` | AP Calculus BC | [Course at a Glance](https://apcentral.collegeboard.org/media/pdf/ap-calculus-bc-course-at-a-glance.pdf) |
| `statistics` | AP Statistics | [Course at a Glance](https://apcentral.collegeboard.org/media/pdf/ap-statistics-course-at-a-glance.pdf) |
| `computer-science-a` | AP Computer Science A | [Course at a Glance](https://apcentral.collegeboard.org/media/pdf/ap-computer-science-a-course-at-a-glance.pdf) |
| `english-literature` | AP English Literature | [Course at a Glance](https://apcentral.collegeboard.org/media/pdf/ap-english-literature-and-composition-course-at-a-glance.pdf) |
| `english-language` | AP English Language | [Course at a Glance](https://apcentral.collegeboard.org/media/pdf/ap-english-language-and-composition-course-at-a-glance.pdf) |
| `us-history` | AP US History | [Course at a Glance](https://apcentral.collegeboard.org/media/pdf/ap-united-states-history-course-at-a-glance.pdf) |
| `world-history` | AP World History | [Course at a Glance](https://apcentral.collegeboard.org/media/pdf/ap-world-history-modern-course-at-a-glance.pdf) |

## Adding New Courses

### 1. **Find the PDF URL**
- Go to [AP Central](https://apcentral.collegeboard.org/)
- Navigate to the course you want to add
- Find the "Course at a Glance" PDF
- Copy the direct PDF URL

### 2. **Add to Course Structure Service**
```typescript
// In src/services/courseStructureService.ts
export const COURSE_PDF_URLS: Record<string, string> = {
  // ... existing courses ...
  'your-course-id': 'https://apcentral.collegeboard.org/media/pdf/your-course-pdf.pdf',
};
```

### 3. **Test the Integration**
- Navigate to `/pdf-test` in the app
- Select your new course
- Click "Test PDF Parsing"
- Verify the structure is extracted correctly

## Testing the System

### **PDF Test Page**
Navigate to `/pdf-test` to test PDF parsing:
- Select any supported course
- Click "Test PDF Parsing" to parse the PDF
- View the extracted structure
- Clear cache to test fresh parsing

### **Notes Page**
The Notes page now automatically:
- Loads course structures from PDFs
- Shows loading states during parsing
- Displays parsed units and topics
- Handles errors gracefully

## Technical Implementation

### **Core Components**
- `PDFParser` (`src/utils/pdfParser.ts`): Main PDF processing logic
- `CourseStructureService` (`src/services/courseStructureService.ts`): Service layer for course management
- `Notes` component: Updated to use dynamic structures

### **Dependencies**
- `pdfjs-dist`: PDF.js library for PDF processing
- React hooks for state management
- TypeScript interfaces for type safety

### **Error Handling**
- Network errors during PDF download
- PDF parsing failures
- Invalid PDF formats
- Graceful fallbacks to generic structures

## Performance Considerations

### **Caching Strategy**
- Parsed structures cached in memory
- Avoids repeated PDF downloads
- Cache can be cleared for testing

### **PDF Processing**
- Limited to first 10 pages for performance
- Asynchronous processing with loading states
- Error boundaries for failed parsing

## Future Enhancements

### **Planned Features**
- Better topic extraction algorithms
- Learning objective parsing improvements
- PDF format validation
- Batch PDF processing

### **Potential Improvements**
- Machine learning for better pattern recognition
- Support for more PDF formats
- Collaborative course structure sharing
- Offline PDF storage

## Troubleshooting

### **Common Issues**

1. **PDF Not Loading**
   - Check if the PDF URL is accessible
   - Verify CORS policies allow PDF access
   - Check browser console for errors

2. **Structure Not Parsing**
   - PDF might have different format
   - Try clearing cache and retrying
   - Check console for parsing errors

3. **Performance Issues**
   - Large PDFs may take time to process
   - Consider PDF size optimization
   - Use caching for frequently accessed courses

### **Debug Information**
- Check browser console for detailed logs
- Use the PDF test page for isolated testing
- Verify PDF URLs are accessible

## Contributing

To improve the PDF parsing system:

1. **Test with different PDF formats**
2. **Improve pattern recognition algorithms**
3. **Add support for new course types**
4. **Optimize performance and caching**

---

**Note**: This system is designed to work with College Board's AP course overview PDFs. PDFs from other sources may require different parsing strategies.
