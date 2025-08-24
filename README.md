# AP Course Manager

A comprehensive desktop application for students to manage AP coursework, built with React, TypeScript, and Vite.

## 🚀 Features

- **AP Course Explorer**: Browse all available AP courses with detailed information
- **Interactive Course Cards**: Hover effects and detailed modals for each course
- **Smart Filtering**: Search by name, subject, difficulty, and tags
- **Unit Weightings**: Color-coded unit importance based on exam weight
- **Exam Information**: Dates, formats, and requirements for each course
- **College Board Integration**: Direct links to official course descriptions

## 🛠️ CSV Data Management

The app now uses a **CSV-based data system** that makes it easy to:
- Add new courses
- Update existing course information
- Manage practice questions and resources
- Keep data synchronized across the app

### 📁 File Structure

```
src/
├── data/
│   ├── courses.csv          # Main course data
│   └── coursesData.ts       # CSV import logic
├── utils/
│   ├── csvImporter.ts       # CSV parsing utilities
│   └── csvHelpers.ts        # CSV export/validation helpers
└── store/
    └── coursesSlice.ts      # Zustand store using CSV data
```

### 📊 CSV Format

Your `courses.csv` file should have these columns:

```csv
id,name,subject,meanScore,passRate,description,emoji,tags,units,bigIdeas,prerequisites,labRequirement,exam,examDate
```

#### Example Row:
```csv
biology,Biology,Sciences,3.15,68.3,"Introductory college-level biology...",🧬,"life sciences,systems,ecology,genetics","Chemistry of Life:8-11%,Cells:10-13%","Evolution,Energetics,Information Storage & Transmission",High school biology and chemistry,25% of time in labs,"3 hours: 60 multiple choice (50%), 6 free-response (50%)","Monday, May 4, 2026 - 8:00 AM"
```

### 🔧 Adding New Courses

1. **Open `src/data/courses.csv`**
2. **Add a new row** following the format above
3. **Save the file** - the app automatically reloads the data
4. **No code changes needed!**

### 📝 CSV Field Details

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `id` | string | Unique identifier (lowercase, no spaces) | `biology`, `calculus-bc` |
| `name` | string | Course name | `Biology`, `Calculus BC` |
| `subject` | string | Subject category | `Sciences`, `Mathematics` |
| `meanScore` | number | Average AP exam score | `3.15` |
| `passRate` | number | Percentage of students who pass | `68.3` |
| `description` | string | Course description | `"Introductory college-level..."` |
| `emoji` | string | Course emoji | `🧬`, `📊` |
| `tags` | string | Comma-separated tags | `"life sciences,systems,ecology"` |
| `units` | string | Unit:weighting pairs | `"Unit 1:10-15%,Unit 2:20-25%"` |
| `bigIdeas` | string | Comma-separated big ideas | `"Evolution,Energetics"` |
| `prerequisites` | string | Course prerequisites | `High school biology` |
| `labRequirement` | string | Lab requirements | `25% of time in labs` |
| `exam` | string | Exam format | `"3 hours: 60 MC, 6 FRQ"` |
| `examDate` | string | Exam date | `"Monday, May 4, 2026 - 8:00 AM"` |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
git clone <your-repo>
cd apmanager
npm install
npm run dev
```

### Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run test         # Run tests
```

## 🔄 Data Updates

### Adding New Courses
1. Edit `src/data/courses.csv`
2. Add new row with all required fields
3. Save file - app automatically updates

### Updating Existing Courses
1. Find the course row in `courses.csv`
2. Modify any field values
3. Save file - changes appear immediately

### Adding Practice Questions
Future feature: Add a `practice-questions.csv` file with:
- Question text
- Course ID
- Unit
- Question type (MCQ/FRQ)
- Answer and explanation

## 🎯 Next Features

- **Backpack System**: Save and organize selected courses
- **Notes Editor**: Markdown notes with AP tags
- **Practice Hub**: FRQ and MCQ practice sessions
- **Progress Tracking**: Monitor study progress per course
- **Study Planner**: Weekly schedules and reminders

## 🐛 Troubleshooting

### CSV Import Issues
- Check that all required fields are filled
- Ensure proper CSV formatting (commas, quotes)
- Verify file encoding is UTF-8

### Data Not Loading
- Check browser console for errors
- Verify CSV file path is correct
- Restart development server

### Type Errors
- Run `npx tsc --noEmit` to check for issues
- Ensure CSV data matches expected format

## 📚 Resources

- [AP Central](https://apcentral.collegeboard.org/) - Official AP resources
- [College Board](https://collegeboard.org/) - AP program information
- [Vite Documentation](https://vitejs.dev/) - Build tool docs
- [React Documentation](https://react.dev/) - React framework docs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
