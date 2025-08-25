# AP Manager

A comprehensive application for managing AP (Advanced Placement) courses, tracking progress, and organizing study notes.

## Features

### 🎒 Course Management
- **Explore AP Courses**: Browse all available AP courses with detailed information
- **Course Backpack**: Add courses to your personal collection for easy access
- **Course Details**: View comprehensive information including units, exam format, and prerequisites
- **Progress Tracking**: Monitor your progress across multiple AP courses

### 📝 Notes System
- **Structured Notes**: Create notes organized by course, unit, and topic
- **Status Tracking**: Track your progress through different learning stages:
  - Not Started
  - Reviewing in Class
  - Lesson Taught
  - Reviewing
  - Done
- **Markdown Support**: Write rich notes with markdown formatting
- **Live Preview**: Toggle between edit and preview modes
- **Search & Filter**: Find notes quickly with search functionality

### 📊 Progress Dashboard
- **Visual Progress**: See your progress through AP Physics 1 units and topics
- **Progress Bars**: Visual representation of completion status
- **Recent Activity**: Track your latest notes and progress
- **Statistics**: Overview of courses, notes, and overall progress

### 🔄 Data Management
- **Export/Import**: Backup and restore your notes and progress data
- **Persistent Storage**: Your data is automatically saved locally
- **Cross-session**: Progress and notes persist between browser sessions

## AP Physics 1 Course Structure

The app includes a complete AP Physics 1 curriculum structure based on the College Board framework:

### Units Covered:
1. **Kinematics** (10-16%) - Motion in one and two dimensions
2. **Dynamics** (16-20%) - Forces and Newton's laws
3. **Circular Motion & Gravitation** (6-8%) - Uniform circular motion and gravitational forces
4. **Energy** (20-24%) - Work, energy, and conservation
5. **Momentum** (10-16%) - Linear momentum and conservation
6. **Simple Harmonic Motion** (4-6%) - Oscillatory motion
7. **Torque & Rotational Motion** (10-16%) - Rotational dynamics
8. **Fluids** (4-6%) - Fluid statics and dynamics

Each unit contains detailed topics with learning objectives and status tracking.

## Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```

3. **Build for Production**:
   ```bash
   npm run build
   ```

## Usage

### Adding Courses
1. Navigate to the "Explore" page
2. Browse available AP courses
3. Click on a course to view details
4. Add it to your backpack

### Taking Notes
1. Go to the "Notes" page
2. Select a course, unit, and topic
3. Click "New Note" to create a note
4. Use markdown for rich formatting
5. Toggle preview mode to see formatted content
6. Update topic status as you progress

### Tracking Progress
1. View your dashboard for an overview
2. Monitor progress through individual units
3. Update topic statuses as you complete sections
4. Export your data for backup

## Technology Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Routing**: React Router
- **Build Tool**: Vite
- **Icons**: Lucide React

## Data Structure

The app uses a hierarchical structure:
- **Courses** → **Units** → **Topics** → **Notes**
- Each level can have associated metadata and progress tracking
- Notes are linked to specific topics for organization
- Status tracking provides progress visibility

## Contributing

This is a personal project for AP course management. The structure is designed to be easily extensible for additional AP courses beyond Physics 1.

## License

MIT License - feel free to use and modify for your own AP studies!
