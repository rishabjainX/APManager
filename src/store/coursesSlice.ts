import { create } from 'zustand';

export interface APCourse {
  id: string;
  name: string;
  subject: string;
  meanScore: number;
  passRate: number;
  difficultyRating: number;
  stars: number;
  description: string;
  emoji: string;
  tags: string[];
  units: { [key: string]: string };
  bigIdeas: string[];
  prerequisites: string;
  labRequirement: string;
  exam: string;
}

export interface CoursesState {
  courses: APCourse[];
  filteredCourses: APCourse[];
  searchQuery: string;
  selectedSubject: string;
  selectedDifficulty: string;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchCourses: () => Promise<void>;
  setSearchQuery: (query: string) => void;
  setSelectedSubject: (subject: string) => void;
  setSelectedDifficulty: (difficulty: string) => void;
  clearFilters: () => void;
  getCourseById: (id: string) => APCourse | undefined;
  applyFilters: () => void;
}

// Function to compute difficulty rating based on mean score and pass rate
function computeDifficultyRating(meanScore: number, passRate: number): number {
  // Lower mean score and lower pass rate = higher difficulty
  // Scale: 1 (easiest) to 5 (hardest)
  
  // Normalize mean score (1-5 scale, where 5 is best)
  const normalizedScore = (meanScore - 1) / 4; // 1-5 scale
  
  // Normalize pass rate (0-1 scale, where 1 is 100%)
  const normalizedPassRate = passRate / 100;
  
  // Weight: 60% pass rate, 40% mean score
  const difficulty = (1 - normalizedPassRate) * 0.6 + (1 - normalizedScore) * 0.4;
  
  // Convert to 1-5 scale and round to 1 decimal
  return Math.round((difficulty * 4 + 1) * 10) / 10;
}

// Function to convert difficulty rating to stars
function difficultyToStars(difficulty: number): number {
  if (difficulty <= 1.5) return 1;
  if (difficulty <= 2.5) return 2;
  if (difficulty <= 3.5) return 3;
  if (difficulty <= 4.5) return 4;
  return 5;
}

export const useCoursesStore = create<CoursesState>((set, get) => ({
  courses: [],
  filteredCourses: [],
  searchQuery: '',
  selectedSubject: 'All',
  selectedDifficulty: 'All',
  isLoading: false,
  error: null,

  fetchCourses: async () => {
    set({ isLoading: true, error: null });
    try {
      // Real AP course data from CSV with pass rates
      const allCourses: APCourse[] = [
        {
          id: 'african-american-studies',
          name: 'African American Studies',
          subject: 'History & Social Sciences',
          meanScore: 3.22,
          passRate: 72.6,
          difficultyRating: 3.4,
          stars: 3,
          description: 'Explore the history, culture, and contributions of African Americans through interdisciplinary study.',
          emoji: '📚',
          tags: ['culture', 'history', 'society', 'identity'],
          units: {
            'Unit 1: The African American Experience': '10%',
            'Unit 2: The Civil Rights Movement': '10%',
            'Unit 3: Contemporary Issues': '80%'
          },
          bigIdeas: ['Understanding the African American Experience', 'The Role of Civil Rights in American Society', 'The Impact of Contemporary Issues'],
          prerequisites: 'None',
          labRequirement: 'No lab',
          exam: 'AP World History'
        },
        {
          id: 'art-design-drawing',
          name: 'Art & Design: Drawing',
          subject: 'Arts',
          meanScore: 3.42,
          passRate: 83.8,
          difficultyRating: 2.9,
          stars: 3,
          description: 'Develop fundamental drawing skills and artistic expression through various media and techniques.',
          emoji: '✏️',
          tags: ['creativity', 'design', 'visual arts', 'portfolio'],
          units: {
            'Unit 1: Drawing Fundamentals': '20%',
            'Unit 2: Advanced Techniques': '30%',
            'Unit 3: Portfolio Development': '50%'
          },
          bigIdeas: ['Understanding Drawing Techniques', 'Developing Artistic Expression', 'Creating a Personal Portfolio'],
          prerequisites: 'None',
          labRequirement: 'No lab',
          exam: 'AP Art History'
        },
        {
          id: 'art-design-2d',
          name: 'Art & Design: 2-D',
          subject: 'Arts',
          meanScore: 3.31,
          passRate: 82.8,
          difficultyRating: 3.2,
          stars: 3,
          description: 'Create two-dimensional artwork using digital and traditional media with focus on design principles.',
          emoji: '🎨',
          tags: ['creativity', 'design', 'visual arts', 'portfolio'],
          units: {
            'Unit 1: Digital Design Basics': '30%',
            'Unit 2: Traditional Media': '30%',
            'Unit 3: Advanced Design': '40%'
          },
          bigIdeas: ['Understanding Design Principles', 'Applying Digital Tools', 'Creating a Personal Design Style'],
          prerequisites: 'None',
          labRequirement: 'No lab',
          exam: 'AP Art History'
        },
        {
          id: 'art-design-3d',
          name: 'Art & Design: 3-D',
          subject: 'Arts',
          meanScore: 3.04,
          passRate: 72.0,
          difficultyRating: 3.9,
          stars: 4,
          description: 'Explore three-dimensional art forms including sculpture, ceramics, and installation art.',
          emoji: '🗿',
          tags: ['creativity', 'design', 'visual arts', 'portfolio'],
          units: {
            'Unit 1: Sculpture Techniques': '30%',
            'Unit 2: Ceramics': '30%',
            'Unit 3: Installation Art': '40%'
          },
          bigIdeas: ['Understanding 3D Art Forms', 'Creating Sculptures', 'Developing Installation Art'],
          prerequisites: 'None',
          labRequirement: 'No lab',
          exam: 'AP Art History'
        },
        {
          id: 'art-history',
          name: 'Art History',
          subject: 'Arts',
          meanScore: 3.0,
          passRate: 62.7,
          difficultyRating: 4.0,
          stars: 4,
          description: 'Study the history of art from prehistoric times to the present across different cultures.',
          emoji: '🏛️',
          tags: ['culture', 'history', 'analysis', 'visual arts'],
          units: {
            'Unit 1: Prehistoric Art': '20%',
            'Unit 2: Ancient Art': '30%',
            'Unit 3: Modern Art': '50%'
          },
          bigIdeas: ['Understanding Art History', 'Analyzing Art Movements', 'Interpreting Artistic Styles'],
          prerequisites: 'None',
          labRequirement: 'No lab',
          exam: 'AP Art History'
        },
        {
          id: 'biology',
          name: 'Biology',
          subject: 'Sciences',
          meanScore: 3.15,
          passRate: 68.3,
          difficultyRating: 3.6,
          stars: 4,
          description: 'Introductory college-level biology course emphasizing evolution, cellular processes, genetics, ecology, and interactions.',
          emoji: '🧬',
          tags: ['life sciences', 'systems', 'ecology', 'genetics'],
          units: {
            'Chemistry of Life': '8–11%',
            'Cells': '10–13%',
            'Cellular Energetics': '12–16%',
            'Cell Communication & Cell Cycle': '10–15%',
            'Heredity': '8–11%',
            'Gene Expression & Regulation': '12–16%',
            'Natural Selection': '13–20%',
            'Ecology': '10–15%'
          },
          bigIdeas: ['Evolution', 'Energetics', 'Information Storage & Transmission', 'Systems Interactions'],
          prerequisites: 'High school biology and chemistry',
          labRequirement: '25% of time in inquiry-based labs; design experiments, analyze data, communicate results',
          exam: '3 hours: 60 multiple-choice (50%), 6 free-response (50%)'
        },
        {
          id: 'calculus-ab',
          name: 'Calculus AB',
          subject: 'Mathematics',
          meanScore: 3.22,
          passRate: 64.4,
          difficultyRating: 3.4,
          stars: 3,
          description: 'Study differential and integral calculus with applications to real-world problems.',
          emoji: '📐',
          tags: ['mathematics', 'calculus', 'analysis', 'functions'],
          units: {
            'Unit 1: Limits and Continuity': '20%',
            'Unit 2: Differentiation': '30%',
            'Unit 3: Integration': '50%'
          },
          bigIdeas: ['Understanding Limits and Continuity', 'Differentiating Functions', 'Integrating Functions'],
          prerequisites: 'None',
          labRequirement: 'No lab',
          exam: 'AP Calculus AB'
        },
        {
          id: 'calculus-bc',
          name: 'Calculus BC',
          subject: 'Mathematics',
          meanScore: 3.92,
          passRate: 80.9,
          difficultyRating: 1.6,
          stars: 2,
          description: 'Advanced calculus including series, parametric equations, and polar coordinates.',
          emoji: '🔢',
          tags: ['mathematics', 'calculus', 'series', 'advanced functions'],
          units: {
            'Unit 1: Series': '20%',
            'Unit 2: Parametric Equations': '30%',
            'Unit 3: Polar Coordinates': '50%'
          },
          bigIdeas: ['Understanding Infinite Series', 'Analyzing Parametric Equations', 'Interpreting Polar Coordinates'],
          prerequisites: 'Calculus AB',
          labRequirement: 'No lab',
          exam: 'AP Calculus BC'
        },
        {
          id: 'chemistry',
          name: 'Chemistry',
          subject: 'Sciences',
          meanScore: 3.31,
          passRate: 75.6,
          difficultyRating: 3.2,
          stars: 3,
          description: 'College-level general chemistry covering atomic structure, bonding, reactions, kinetics, thermodynamics, and equilibrium.',
          emoji: '⚗️',
          tags: ['physical sciences', 'laboratory', 'reactions', 'analysis'],
          units: {
            'Atomic Structure & Properties': '7–9%',
            'Molecular & Ionic Compounds': '7–9%',
            'Intermolecular Forces & Properties': '18–22%',
            'Chemical Reactions': '7–9%',
            'Kinetics': '7–9%',
            'Thermodynamics': '7–9%',
            'Equilibrium': '7–9%',
            'Acids & Bases': '11–15%',
            'Applications of Thermodynamics': '7–9%'
          },
          bigIdeas: ['Scale, Proportion, and Quantity', 'Structure and Properties', 'Transformations', 'Energy'],
          prerequisites: 'High school chemistry and Algebra II',
          labRequirement: '25% of time in labs; at least 16 labs (6 inquiry-based)',
          exam: '3 hours 15 min: 60 multiple-choice (50%), 7 free-response (50%)'
        },
        {
          id: 'chinese-language',
          name: 'Chinese Language',
          subject: 'World Languages',
          meanScore: 4.08,
          passRate: 88.5,
          difficultyRating: 1.2,
          stars: 1,
          description: 'Develop proficiency in Mandarin Chinese through reading, writing, speaking, and listening.',
          emoji: '🇨🇳',
          tags: ['language', 'culture', 'communication'],
          units: {
            'Unit 1: Basic Chinese': '20%',
            'Unit 2: Intermediate Chinese': '30%',
            'Unit 3: Advanced Chinese': '50%'
          },
          bigIdeas: ['Understanding Chinese Characters', 'Developing Chinese Grammar', 'Improving Chinese Listening Skills'],
          prerequisites: 'None',
          labRequirement: 'No lab',
          exam: 'AP Chinese Language'
        },
        {
          id: 'computer-science-a',
          name: 'Computer Science A',
          subject: 'Computer Science',
          meanScore: 3.18,
          passRate: 67.2,
          difficultyRating: 3.5,
          stars: 4,
          description: 'Learn Java programming and object-oriented design principles for software development.',
          emoji: '💻',
          tags: ['programming', 'algorithms', 'Java', 'logic'],
          units: {
            'Unit 1: Introduction to Programming': '20%',
            'Unit 2: Object-Oriented Programming': '30%',
            'Unit 3: Data Structures': '50%'
          },
          bigIdeas: ['Understanding Programming Concepts', 'Developing Object-Oriented Design', 'Learning Data Structures'],
          prerequisites: 'None',
          labRequirement: 'No lab',
          exam: 'AP Computer Science A'
        },
        {
          id: 'computer-science-principles',
          name: 'Computer Science Principles',
          subject: 'Computer Science',
          meanScore: 2.9,
          passRate: 64.0,
          difficultyRating: 4.2,
          stars: 4,
          description: 'Explore the foundational concepts of computing and their impact on society.',
          emoji: '🌐',
          tags: ['computer science', 'problem-solving', 'computing', 'innovation'],
          units: {
            'Unit 1: Introduction to Computer Science': '20%',
            'Unit 2: Programming': '30%',
            'Unit 3: Algorithms': '50%'
          },
          bigIdeas: ['Understanding Computer Science', 'Developing Problem-Solving Skills', 'Learning Algorithms'],
          prerequisites: 'None',
          labRequirement: 'No lab',
          exam: 'AP Computer Science Principles'
        },
        {
          id: 'economics-macro',
          name: 'Economics: Macroeconomics',
          subject: 'History & Social Sciences',
          meanScore: 3.13,
          passRate: 65.1,
          difficultyRating: 3.6,
          stars: 4,
          description: 'Study national economies, including GDP, inflation, unemployment, and fiscal policy.',
          emoji: '📊',
          tags: ['economics', 'markets', 'policy', 'global systems'],
          units: {
            'Unit 1: Introduction to Macroeconomics': '20%',
            'Unit 2: Economic Indicators': '30%',
            'Unit 3: Fiscal Policy': '50%'
          },
          bigIdeas: ['Understanding Macroeconomic Concepts', 'Analyzing Economic Indicators', 'Studying Fiscal Policy'],
          prerequisites: 'None',
          labRequirement: 'No lab',
          exam: 'AP Microeconomics'
        },
        {
          id: 'economics-micro',
          name: 'Economics: Microeconomics',
          subject: 'History & Social Sciences',
          meanScore: 3.24,
          passRate: 67.6,
          difficultyRating: 3.3,
          stars: 3,
          description: 'Explore individual economic decision-making, markets, and resource allocation.',
          emoji: '💰',
          tags: ['economics', 'decision-making', 'markets', 'analysis'],
          units: {
            'Unit 1: Supply and Demand': '20%',
            'Unit 2: Elasticity': '30%',
            'Unit 3: Market Structures': '50%'
          },
          bigIdeas: ['Understanding Supply and Demand', 'Analyzing Elasticity', 'Studying Market Structures'],
          prerequisites: 'None',
          labRequirement: 'No lab',
          exam: 'AP Microeconomics'
        },
        {
          id: 'english-language',
          name: 'English Language & Composition',
          subject: 'English',
          meanScore: 2.79,
          passRate: 54.6,
          difficultyRating: 4.5,
          stars: 4,
          description: 'Develop rhetorical analysis and argumentative writing skills for various audiences.',
          emoji: '✍️',
          tags: ['writing', 'rhetoric', 'analysis', 'communication'],
          units: {
            'Unit 1: Rhetorical Analysis': '20%',
            'Unit 2: Argumentative Writing': '30%',
            'Unit 3: Expository Writing': '50%'
          },
          bigIdeas: ['Understanding Rhetoric', 'Developing Argumentative Skills', 'Improving Expository Writing'],
          prerequisites: 'None',
          labRequirement: 'No lab',
          exam: 'AP English Language'
        },
        {
          id: 'english-literature',
          name: 'English Literature & Composition',
          subject: 'English',
          meanScore: 3.16,
          passRate: 72.4,
          difficultyRating: 3.5,
          stars: 4,
          description: 'Analyze literary works and develop critical thinking through close reading and writing.',
          emoji: '📖',
          tags: ['literature', 'analysis', 'critical thinking', 'writing'],
          units: {
            'Unit 1: Close Reading': '20%',
            'Unit 2: Literary Analysis': '30%',
            'Unit 3: Argumentative Essay': '50%'
          },
          bigIdeas: ['Understanding Close Reading', 'Developing Critical Thinking', 'Improving Argumentative Skills'],
          prerequisites: 'None',
          labRequirement: 'No lab',
          exam: 'AP English Literature'
        },
        {
          id: 'environmental-science',
          name: 'Environmental Science',
          subject: 'Sciences',
          meanScore: 2.8,
          passRate: 54.1,
          difficultyRating: 4.5,
          stars: 4,
          description: 'Introductory interdisciplinary course exploring ecological processes, Earth systems, human impact, and sustainability.',
          emoji: '🌍',
          tags: ['sustainability', 'ecosystems', 'science', 'environment'],
          units: {
            'Ecosystems': '6–8%',
            'Biodiversity': '6–8%',
            'Populations': '10–15%',
            'Earth Systems & Resources': '10–15%',
            'Land & Water Use': '10–15%',
            'Energy Resources & Consumption': '10–15%',
            'Atmospheric Pollution': '7–10%',
            'Aquatic & Terrestrial Pollution': '7–10%',
            'Global Change': '15–20%'
          },
          bigIdeas: ['Energy Transfer', 'Earth System Interactions', 'Species & Environment Interactions', 'Sustainability'],
          prerequisites: 'Two years of lab science (biology + physical science), one year algebra',
          labRequirement: '25% of time in labs/fieldwork, inquiry-based',
          exam: '2 hrs 40 min: 80 multiple-choice (60%), 3 free-response (40%)'
        },
        {
          id: 'european-history',
          name: 'European History',
          subject: 'History & Social Sciences',
          meanScore: 3.23,
          passRate: 71.6,
          difficultyRating: 3.4,
          stars: 3,
          description: 'Explore European history from the Renaissance to the present day.',
          emoji: '🏰',
          tags: ['history', 'analysis', 'culture', 'politics'],
          units: {
            'Unit 1: Renaissance to 1789': '20%',
            'Unit 2: 1789 to 1914': '30%',
            'Unit 3: 1914 to Present': '50%'
          },
          bigIdeas: ['Understanding European History', 'Analyzing Key Events', 'Interpreting Historical Patterns'],
          prerequisites: 'None',
          labRequirement: 'No lab',
          exam: 'AP European History'
        },
        {
          id: 'french-language',
          name: 'French Language',
          subject: 'World Languages',
          meanScore: 3.2,
          passRate: 72.3,
          difficultyRating: 3.4,
          stars: 3,
          description: 'Develop French language proficiency through cultural immersion and communication.',
          emoji: '🇫🇷',
          tags: ['language', 'culture', 'communication'],
          units: {
            'Unit 1: French Basics': '20%',
            'Unit 2: Intermediate French': '30%',
            'Unit 3: Advanced French': '50%'
          },
          bigIdeas: ['Understanding French Grammar', 'Developing French Listening Skills', 'Improving French Speaking Skills'],
          prerequisites: 'None',
          labRequirement: 'No lab',
          exam: 'AP French Language'
        },
        {
          id: 'german-language',
          name: 'German Language',
          subject: 'World Languages',
          meanScore: 3.32,
          passRate: 69.8,
          difficultyRating: 3.1,
          stars: 3,
          description: 'Master German language skills including reading, writing, speaking, and listening.',
          emoji: '🇩🇪',
          tags: ['language', 'culture', 'communication'],
          units: {
            'Unit 1: German Basics': '20%',
            'Unit 2: Intermediate German': '30%',
            'Unit 3: Advanced German': '50%'
          },
          bigIdeas: ['Understanding German Grammar', 'Developing German Listening Skills', 'Improving German Speaking Skills'],
          prerequisites: 'None',
          labRequirement: 'No lab',
          exam: 'AP German Language'
        },
        {
          id: 'government-comparative',
          name: 'Government & Politics: Comparative',
          subject: 'History & Social Sciences',
          meanScore: 3.18,
          passRate: 73.0,
          difficultyRating: 3.5,
          stars: 4,
          description: 'Compare political systems and institutions across different countries.',
          emoji: '🏛️',
          tags: ['politics', 'international', 'systems', 'analysis'],
          units: {
            'Unit 1: Political Systems': '20%',
            'Unit 2: International Relations': '30%',
            'Unit 3: Comparative Analysis': '50%'
          },
          bigIdeas: ['Understanding Political Systems', 'Analyzing International Relations', 'Studying Comparative Politics'],
          prerequisites: 'None',
          labRequirement: 'No lab',
          exam: 'AP Comparative Government'
        },
        {
          id: 'government-us',
          name: 'Government & Politics: U.S.',
          subject: 'History & Social Sciences',
          meanScore: 3.38,
          passRate: 73.0,
          difficultyRating: 3.0,
          stars: 3,
          description: 'Study American government, constitutional principles, and political processes.',
          emoji: '🇺🇸',
          tags: ['politics', 'government', 'law', 'civic engagement'],
          units: {
            'Unit 1: American Government': '20%',
            'Unit 2: Constitutional Principles': '30%',
            'Unit 3: Political Processes': '50%'
          },
          bigIdeas: ['Understanding American Government', 'Analyzing Constitutional Principles', 'Studying Political Processes'],
          prerequisites: 'None',
          labRequirement: 'No lab',
          exam: 'AP U.S. Government'
        },
        {
          id: 'human-geography',
          name: 'Human Geography',
          subject: 'History & Social Sciences',
          meanScore: 2.83,
          passRate: 56.1,
          difficultyRating: 4.4,
          stars: 4,
          description: 'Explore human patterns and processes that shape the Earth\'s surface.',
          emoji: '🌍',
          tags: ['geography', 'culture', 'population', 'globalization'],
          units: {
            'Unit 1: Human Geography': '20%',
            'Unit 2: Population': '30%',
            'Unit 3: Globalization': '50%'
          },
          bigIdeas: ['Understanding Human Geography', 'Analyzing Population Trends', 'Studying Globalization'],
          prerequisites: 'None',
          labRequirement: 'No lab',
          exam: 'AP Human Geography'
        },
        {
          id: 'italian-language',
          name: 'Italian Language',
          subject: 'World Languages',
          meanScore: 3.3,
          passRate: 72.4,
          difficultyRating: 3.2,
          stars: 3,
          description: 'Develop Italian language skills through cultural context and communication.',
          emoji: '🇮🇹',
          tags: ['language', 'culture', 'communication'],
          units: {
            'Unit 1: Italian Basics': '20%',
            'Unit 2: Intermediate Italian': '30%',
            'Unit 3: Advanced Italian': '50%'
          },
          bigIdeas: ['Understanding Italian Grammar', 'Developing Italian Listening Skills', 'Improving Italian Speaking Skills'],
          prerequisites: 'None',
          labRequirement: 'No lab',
          exam: 'AP Italian Language'
        },
        {
          id: 'japanese-language',
          name: 'Japanese Language',
          subject: 'World Languages',
          meanScore: 3.68,
          passRate: 76.1,
          difficultyRating: 2.2,
          stars: 2,
          description: 'Master Japanese language skills including reading, writing, speaking, and listening.',
          emoji: '🇯🇵',
          tags: ['language', 'culture', 'communication'],
          units: {
            'Unit 1: Japanese Basics': '20%',
            'Unit 2: Intermediate Japanese': '30%',
            'Unit 3: Advanced Japanese': '50%'
          },
          bigIdeas: ['Understanding Japanese Grammar', 'Developing Japanese Listening Skills', 'Improving Japanese Speaking Skills'],
          prerequisites: 'None',
          labRequirement: 'No lab',
          exam: 'AP Japanese Language'
        },
        {
          id: 'latin',
          name: 'Latin',
          subject: 'World Languages',
          meanScore: 2.77,
          passRate: 56.5,
          difficultyRating: 4.5,
          stars: 4,
          description: 'Study Latin language and literature to understand classical civilization and language roots.',
          emoji: '🏺',
          tags: ['language', 'literature', 'classics', 'culture'],
          units: {
            'Unit 1: Latin Basics': '20%',
            'Unit 2: Intermediate Latin': '30%',
            'Unit 3: Advanced Latin': '50%'
          },
          bigIdeas: ['Understanding Latin Grammar', 'Developing Latin Listening Skills', 'Improving Latin Speaking Skills'],
          prerequisites: 'None',
          labRequirement: 'No lab',
          exam: 'AP Latin'
        },
        {
          id: 'music-theory',
          name: 'Music Theory',
          subject: 'Arts',
          meanScore: 3.02,
          passRate: 60.1,
          difficultyRating: 3.9,
          stars: 4,
          description: 'Study the fundamentals of music including harmony, melody, rhythm, and form.',
          emoji: '🎵',
          tags: ['music', 'composition', 'analysis', 'performance'],
          units: {
            'Unit 1: Music Fundamentals': '20%',
            'Unit 2: Harmony': '30%',
            'Unit 3: Form and Analysis': '50%'
          },
          bigIdeas: ['Understanding Music Fundamentals', 'Analyzing Harmony', 'Studying Form and Analysis'],
          prerequisites: 'None',
          labRequirement: 'No lab',
          exam: 'AP Music Theory'
        },
        {
          id: 'physics-1',
          name: 'Physics 1: Algebra-Based',
          subject: 'Sciences',
          meanScore: 2.59,
          passRate: 47.3,
          difficultyRating: 5.0,
          stars: 5,
          description: 'Algebra-based physics introducing kinematics, dynamics, circular motion, energy, momentum, oscillations, torque, and fluids.',
          emoji: '⚡',
          tags: ['physics', 'motion', 'algebra', 'physical sciences'],
          units: {
            'Kinematics': '10–16%',
            'Dynamics': '16–20%',
            'Circular Motion & Gravitation': '6–8%',
            'Energy': '20–24%',
            'Momentum': '10–16%',
            'Simple Harmonic Motion': '4–6%',
            'Torque & Rotational Motion': '10–16%',
            'Fluids': '4–6%'
          },
          bigIdeas: ['Mechanics principles, motion, forces, energy, and systems'],
          prerequisites: 'Geometry and concurrent Algebra II',
          labRequirement: '25% of time in labs, inquiry-based',
          exam: '3 hours: 40 multiple-choice (50%), 4 free-response (50%)'
        },
        {
          id: 'physics-2',
          name: 'Physics 2: Algebra-Based',
          subject: 'Sciences',
          meanScore: 3.2,
          passRate: 70.5,
          difficultyRating: 3.4,
          stars: 3,
          description: 'Algebra-based physics course covering thermodynamics, electricity, circuits, magnetism, optics, and modern physics.',
          emoji: '🔋',
          tags: ['physics', 'energy', 'waves', 'electricity'],
          units: {
            'Thermodynamics': '10–12%',
            'Electric Force, Field, & Potential': '18–22%',
            'Electric Circuits': '10–14%',
            'Magnetism & Electromagnetism': '10–12%',
            'Geometric & Physical Optics': '12–14%',
            'Quantum, Atomic, & Nuclear Physics': '10–12%',
            'Fluids': '10–12%'
          },
          bigIdeas: ['Energy, electricity, magnetism, light, and quantum systems'],
          prerequisites: 'AP Physics 1 or similar; concurrent Precalculus',
          labRequirement: '25% of time in labs, inquiry-based',
          exam: '3 hours: 40 multiple-choice (50%), 4 free-response (50%)'
        },
        {
          id: 'physics-c-electricity',
          name: 'Physics C: Electricity & Magnetism',
          subject: 'Sciences',
          meanScore: 3.53,
          passRate: 71.6,
          difficultyRating: 2.6,
          stars: 3,
          description: 'Calculus-based physics course focusing on electrostatics, capacitors, circuits, magnetic fields, and electromagnetism.',
          emoji: '⚡',
          tags: ['physics', 'electricity', 'magnetism', 'calculus'],
          units: {
            'Electrostatics': '28–32%',
            'Conductors, Capacitors, Dielectrics': '14–17%',
            'Electric Circuits': '17–23%',
            'Magnetic Fields': '17–23%',
            'Electromagnetism': '14–20%'
          },
          bigIdeas: ['Electricity, magnetism, fields, and energy transfer'],
          prerequisites: 'Calculus (concurrent allowed)',
          labRequirement: '25% of time in labs, inquiry-based',
          exam: '1.5 hours: 40 multiple-choice (50%), 4 free-response (50%)'
        },
        {
          id: 'physics-c-mechanics',
          name: 'Physics C: Mechanics',
          subject: 'Sciences',
          meanScore: 3.5,
          passRate: 76.3,
          difficultyRating: 2.7,
          stars: 3,
          description: 'Calculus-based mechanics course covering kinematics, Newton\'s laws, energy, momentum, rotation, oscillations, and gravitation.',
          emoji: '🎯',
          tags: ['physics', 'motion', 'calculus', 'mechanics'],
          units: {
            'Kinematics': '14–20%',
            'Newton\'s Laws of Motion': '17–23%',
            'Work, Energy, & Power': '14–17%',
            'Systems of Particles & Linear Momentum': '14–17%',
            'Circular Motion & Rotation': '14–20%',
            'Oscillations': '6–14%',
            'Gravitation': '6–14%'
          },
          bigIdeas: ['Mechanics, motion, forces, rotation, energy'],
          prerequisites: 'Calculus (concurrent allowed)',
          labRequirement: '25% of time in labs, inquiry-based',
          exam: '3 hours: 40 multiple-choice (50%), 4 free-response (50%)'
        },
        {
          id: 'precalculus',
          name: 'Precalculus',
          subject: 'Mathematics',
          meanScore: 3.42,
          passRate: 75.6,
          difficultyRating: 2.9,
          stars: 3,
          description: 'Prepare for calculus by studying functions, trigonometry, and advanced algebra.',
          emoji: '📊',
          tags: ['mathematics', 'functions', 'algebra', 'preparation'],
          units: {
            'Unit 1: Functions': '20%',
            'Unit 2: Trigonometry': '30%',
            'Unit 3: Advanced Algebra': '50%'
          },
          bigIdeas: ['Understanding Functions', 'Developing Trigonometry Skills', 'Learning Advanced Algebra'],
          prerequisites: 'None',
          labRequirement: 'No lab',
          exam: 'AP Calculus AB'
        },
        {
          id: 'psychology',
          name: 'Psychology',
          subject: 'History & Social Sciences',
          meanScore: 2.97,
          passRate: 61.7,
          difficultyRating: 4.0,
          stars: 4,
          description: 'Study human behavior and mental processes through scientific research methods.',
          emoji: '🧠',
          tags: ['behavior', 'social science', 'analysis', 'research methods'],
          units: {
            'Unit 1: Introduction to Psychology': '20%',
            'Unit 2: Biological Bases of Behavior': '30%',
            'Unit 3: Psychological Perspectives': '50%'
          },
          bigIdeas: ['Understanding Psychology', 'Analyzing Biological Bases', 'Studying Psychological Perspectives'],
          prerequisites: 'None',
          labRequirement: 'No lab',
          exam: 'AP Psychology'
        },
        {
          id: 'research',
          name: 'Research',
          subject: 'History & Social Sciences',
          meanScore: 3.35,
          passRate: 79.4,
          difficultyRating: 3.1,
          stars: 3,
          description: 'Conduct original research and develop academic writing skills.',
          emoji: '🔬',
          tags: ['inquiry', 'analysis', 'methodology', 'academic writing'],
          units: {
            'Unit 1: Research Design': '20%',
            'Unit 2: Data Collection': '30%',
            'Unit 3: Analysis and Interpretation': '50%'
          },
          bigIdeas: ['Understanding Research Design', 'Learning Data Collection Methods', 'Analyzing and Interpreting Data'],
          prerequisites: 'None',
          labRequirement: 'No lab',
          exam: 'AP Research'
        },
        {
          id: 'seminar',
          name: 'Seminar',
          subject: 'History & Social Sciences',
          meanScore: 3.54,
          passRate: 67.0,
          difficultyRating: 2.6,
          stars: 3,
          description: 'Develop critical thinking and collaborative skills through discussion-based learning.',
          emoji: '💭',
          tags: ['communication', 'analysis', 'critical thinking', 'research'],
          units: {
            'Unit 1: Seminar Introduction': '20%',
            'Unit 2: Research Presentation': '30%',
            'Unit 3: Seminar Conclusion': '50%'
          },
          bigIdeas: ['Understanding Seminar Structure', 'Developing Presentation Skills', 'Improving Critical Thinking'],
          prerequisites: 'None',
          labRequirement: 'No lab',
          exam: 'AP Seminar'
        },
        {
          id: 'spanish-language',
          name: 'Spanish Language',
          subject: 'World Languages',
          meanScore: 3.2,
          passRate: 85.7,
          difficultyRating: 3.4,
          stars: 3,
          description: 'Develop Spanish language proficiency through cultural immersion and communication.',
          emoji: '🇪🇸',
          tags: ['language', 'culture', 'communication'],
          units: {
            'Unit 1: Spanish Basics': '20%',
            'Unit 2: Intermediate Spanish': '30%',
            'Unit 3: Advanced Spanish': '50%'
          },
          bigIdeas: ['Understanding Spanish Grammar', 'Developing Spanish Listening Skills', 'Improving Spanish Speaking Skills'],
          prerequisites: 'None',
          labRequirement: 'No lab',
          exam: 'AP Spanish Language'
        },
        {
          id: 'spanish-literature',
          name: 'Spanish Literature & Culture',
          subject: 'World Languages',
          meanScore: 3.38,
          passRate: 79.4,
          difficultyRating: 3.0,
          stars: 3,
          description: 'Study Spanish literature and cultural contexts from various time periods.',
          emoji: '📚',
          tags: ['literature', 'culture', 'analysis', 'language'],
          units: {
            'Unit 1: Spanish Literature': '20%',
            'Unit 2: Spanish Culture': '30%',
            'Unit 3: Spanish Language': '50%'
          },
          bigIdeas: ['Understanding Spanish Literature', 'Analyzing Spanish Culture', 'Studying Spanish Language'],
          prerequisites: 'None',
          labRequirement: 'No lab',
          exam: 'AP Spanish Literature'
        },
        {
          id: 'statistics',
          name: 'Statistics',
          subject: 'Mathematics',
          meanScore: 3.0,
          passRate: 61.8,
          difficultyRating: 4.0,
          stars: 4,
          description: 'Learn statistical methods for collecting, analyzing, and interpreting data.',
          emoji: '📈',
          tags: ['mathematics', 'probability', 'data', 'analysis'],
          units: {
            'Unit 1: Introduction to Statistics': '20%',
            'Unit 2: Data Collection': '30%',
            'Unit 3: Data Analysis': '50%'
          },
          bigIdeas: ['Understanding Statistics', 'Learning Data Collection Methods', 'Analyzing and Interpreting Data'],
          prerequisites: 'None',
          labRequirement: 'No lab',
          exam: 'AP Statistics'
        },
        {
          id: 'us-history',
          name: 'U.S. History',
          subject: 'History & Social Sciences',
          meanScore: 3.23,
          passRate: 72.2,
          difficultyRating: 3.4,
          stars: 3,
          description: 'Explore American history from pre-Columbian times to the present day.',
          emoji: '🇺🇸',
          tags: ['history', 'politics', 'society', 'culture'],
          units: {
            'Unit 1: Pre-Columbian to 1776': '20%',
            'Unit 2: 1776 to 1900': '30%',
            'Unit 3: 1900 to Present': '50%'
          },
          bigIdeas: ['Understanding U.S. History', 'Analyzing Key Events', 'Interpreting Historical Patterns'],
          prerequisites: 'None',
          labRequirement: 'No lab',
          exam: 'AP U.S. History'
        },
        {
          id: 'world-history',
          name: 'World History: Modern',
          subject: 'History & Social Sciences',
          meanScore: 3.11,
          passRate: 63.7,
          difficultyRating: 3.7,
          stars: 4,
          description: 'Study world history from 1200 CE to the present, focusing on global connections.',
          emoji: '🌏',
          tags: ['history', 'globalization', 'culture', 'politics'],
          units: {
            'Unit 1: Modern World Beginnings': '20%',
            'Unit 2: 19th Century': '30%',
            'Unit 3: 20th Century': '50%'
          },
          bigIdeas: ['Understanding Modern World History', 'Analyzing Key Events', 'Interpreting Historical Patterns'],
          prerequisites: 'None',
          labRequirement: 'No lab',
          exam: 'AP World History'
        }
      ];

      // Compute better difficulty ratings and stars based on pass rate and mean score
      const updatedCourses = allCourses.map(course => {
        const computedDifficulty = computeDifficultyRating(course.meanScore, course.passRate);
        const computedStars = difficultyToStars(computedDifficulty);
        
        return {
          ...course,
          difficultyRating: computedDifficulty,
          stars: computedStars
        };
      });

      set({ courses: updatedCourses, filteredCourses: updatedCourses, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch courses', 
        isLoading: false 
      });
    }
  },

  getCourseById: (id: string) => {
    return get().courses.find(course => course.id === id);
  },

  applyFilters: () => {
    const { courses, searchQuery, selectedSubject, selectedDifficulty } = get();
    
    let filtered = courses;

    // Filter by subject
    if (selectedSubject !== 'All') {
      filtered = filtered.filter(course => course.subject === selectedSubject);
    }

    // Filter by difficulty
    if (selectedDifficulty !== 'All') {
      const difficultyMap: { [key: string]: [number, number] } = {
        'Easy (1-2 stars)': [1, 2],
        'Medium (3 stars)': [3, 3],
        'Hard (4-5 stars)': [4, 5]
      };
      const [min, max] = difficultyMap[selectedDifficulty] || [1, 5];
      filtered = filtered.filter(course => course.stars >= min && course.stars <= max);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(course => 
        course.name.toLowerCase().includes(query) ||
        course.subject.toLowerCase().includes(query) ||
        course.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    set({ filteredCourses: filtered });
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
    get().applyFilters();
  },

  setSelectedSubject: (subject: string) => {
    set({ selectedSubject: subject });
    get().applyFilters();
  },

  setSelectedDifficulty: (difficulty: string) => {
    set({ selectedDifficulty: difficulty });
    get().applyFilters();
  },

  clearFilters: () => {
    set({ 
      searchQuery: '', 
      selectedSubject: 'All',
      selectedDifficulty: 'All',
      filteredCourses: get().courses 
    });
  },
}));
