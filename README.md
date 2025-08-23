# AP Manager

A production-ready desktop application for students to manage AP coursework. Built with React, TypeScript, and Vite, featuring a clean, keyboard-friendly interface optimized for desktop use.

## Features

### 🎒 AP Class Explorer + Backpack
- **Course Discovery**: Browse and search through all available AP courses
- **Smart Filtering**: Filter by subject category (Science, Math, History, English, CS, World Language, Other)
- **Personal Backpack**: Add courses to your personal collection with custom difficulty ratings
- **Status Management**: Track courses as "planned", "in-progress", or "completed"
- **Bulk Actions**: Reorder, remove, or update multiple courses at once

### 📝 Unit-aligned Notes with AP Tags
- **Markdown Support**: Rich text editor with full markdown capabilities
- **AP Topic Integration**: Automatic tag suggestions based on official AP Course and Exam Descriptions (CEDs)
- **Smart Organization**: Notes automatically organized by course and unit
- **Offline Capable**: All notes saved locally via IndexedDB
- **Import/Export**: Backup and restore your notes as JSON

### 🎯 Practice Hub by Unit
- **FRQ & MCQ Practice**: Access past Free Response Questions and Multiple Choice Questions
- **Unit-based Organization**: Practice questions organized by course units
- **Progress Tracking**: Monitor your accuracy and time spent per unit
- **Practice Sessions**: Timed practice sessions with detailed analytics
- **Performance Analytics**: Track streaks and improvement over time

### 📊 Progress & Planning Dashboard
- **Visual Progress**: See your progress across all courses at a glance
- **Unit Coverage**: Track which units you've completed notes for
- **Practice Analytics**: Monitor your performance trends
- **Quick Actions**: Fast access to common tasks

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: Zustand
- **Routing**: React Router v6
- **Storage**: localForage (IndexedDB wrapper)
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **Testing**: Vitest + Testing Library

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd apmanager
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run typecheck` - Run TypeScript type checking
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run test` - Run tests
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Run tests with coverage

## Data Architecture

### AP Framework Adapter
The app uses a flexible adapter pattern for AP course data:

- **Static Adapter** (Current): Mock data for 4 popular AP courses with 2 units each
- **Remote Adapter** (Future): Placeholder for College Board API integration

### Data Models
```typescript
// Course Structure
interface APCourse {
  id: string;
  name: string;
  subject: APSubject;
  units: APUnit[];
}

// Unit Structure  
interface APUnit {
  id: string;
  title: string;
  topics: APTopic[];
}

// Note Structure
interface Note {
  id: string;
  courseId: string;
  unitId: string;
  title: string;
  bodyMarkdown: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}
```

### Persistence Strategy
- **localForage**: Wraps IndexedDB for cross-browser compatibility
- **Versioned Schemas**: Supports data migration between app versions
- **Offline First**: All data stored locally, no internet required

## Keyboard Shortcuts

- `⌘/Ctrl + K` - Open command palette
- `/` - Quick search (when focused on search inputs)
- `←/→` - Navigate back/forward

## Data Import/Export

### Export
1. Go to Settings → Data Management
2. Click "Export All Data"
3. Download will include notes and practice attempts

### Import
1. Go to Settings → Data Management
2. Paste exported JSON data
3. Click "Import Data"
4. Data will be merged with existing content

## Customization

### Adding New AP Courses
1. Edit `src/adapters/apFramework.ts`
2. Add course data to `staticCourses` array
3. Include units and topics following the established pattern

### Styling
- Uses Tailwind CSS with custom CSS variables
- Dark/light mode support
- Responsive design optimized for desktop

## Development

### Project Structure
```
src/
├── adapters/          # Data adapters (AP Framework, FRQ/MCQ)
├── components/        # Reusable UI components
│   ├── ui/           # Base UI components (Button, Card, etc.)
│   └── ...           # Feature-specific components
├── pages/            # Route components
├── store/            # Zustand state management
├── utils/            # Utility functions
└── test/             # Test setup and utilities
```

### State Management
- **coursesSlice**: AP course data and search
- **backpackSlice**: User's selected courses
- **notesSlice**: Note management and persistence
- **practiceSlice**: Practice attempts and analytics

### Adding New Features
1. Create component in appropriate directory
2. Add to store if state management needed
3. Update routing if new page required
4. Add to command palette if global access needed

## Testing

The app includes comprehensive testing setup:

- **Unit Tests**: Test individual functions and components
- **Integration Tests**: Test component interactions
- **E2E Tests**: Test complete user workflows

Run tests with:
```bash
npm run test
```

## Deployment

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

The built files will be in the `dist/` directory, ready for deployment to any static hosting service.

## Future Enhancements

- **Cloud Sync**: Optional cloud storage with Supabase
- **Real AP Data**: Integration with College Board's official CED API
- **Study Recommendations**: AI-powered study suggestions
- **Collaborative Features**: Share notes and study groups
- **Mobile App**: React Native companion app

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For questions or issues:
- Check the documentation
- Review existing issues
- Create a new issue with detailed information

---

Built with ❤️ for AP students everywhere.
