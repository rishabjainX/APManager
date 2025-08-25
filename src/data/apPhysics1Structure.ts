export interface APTopic {
  id: string;
  unitId: string;
  name: string;
  description: string;
  learningObjectives: string[];
  status: 'not-started' | 'reviewing-in-class' | 'lesson-taught' | 'reviewing' | 'done';
  notes: string[];
}

export interface APUnit {
  id: string;
  name: string;
  description: string;
  weighting: string;
  topics: APTopic[];
}

export interface APCourseStructure {
  id: string;
  name: string;
  description: string;
  units: APUnit[];
}

export const apPhysics1Structure: APCourseStructure = {
  id: 'physics-1-algebra-based',
  name: 'AP Physics 1: Algebra-Based',
  description: 'Algebra-based mechanics, energy, momentum, rotation, oscillations, and fluids.',
  units: [
    {
      id: 'kinematics',
      name: 'Kinematics',
      description: 'Motion in one and two dimensions, including displacement, velocity, and acceleration',
      weighting: '10-16%',
      topics: [
        {
          id: 'motion-in-one-dimension',
          unitId: 'kinematics',
          name: 'Motion in One Dimension',
          description: 'Linear motion with constant acceleration',
          learningObjectives: [
            'Define displacement, velocity, and acceleration',
            'Use kinematic equations to solve problems',
            'Interpret position-time and velocity-time graphs'
          ],
          status: 'not-started',
          notes: []
        },
        {
          id: 'motion-in-two-dimensions',
          unitId: 'kinematics',
          name: 'Motion in Two Dimensions',
          description: 'Projectile motion and vector analysis',
          learningObjectives: [
            'Analyze projectile motion using vector components',
            'Apply kinematic equations to 2D motion',
            'Understand independence of horizontal and vertical motion'
          ],
          status: 'not-started',
          notes: []
        }
      ]
    },
    {
      id: 'dynamics',
      name: 'Dynamics',
      description: 'Forces and Newton\'s laws of motion',
      weighting: '16-20%',
      topics: [
        {
          id: 'newtons-laws',
          unitId: 'dynamics',
          name: 'Newton\'s Laws of Motion',
          description: 'The three fundamental laws governing motion',
          learningObjectives: [
            'State and apply Newton\'s three laws',
            'Draw free-body diagrams',
            'Solve problems involving multiple forces'
          ],
          status: 'not-started',
          notes: []
        },
        {
          id: 'friction-and-normal-forces',
          unitId: 'dynamics',
          name: 'Friction and Normal Forces',
          description: 'Contact forces and their effects',
          learningObjectives: [
            'Calculate frictional forces',
            'Understand static vs kinetic friction',
            'Analyze inclined plane problems'
          ],
          status: 'not-started',
          notes: []
        }
      ]
    },
    {
      id: 'circular-motion-gravitation',
      name: 'Circular Motion & Gravitation',
      description: 'Uniform circular motion and gravitational forces',
      weighting: '6-8%',
      topics: [
        {
          id: 'uniform-circular-motion',
          unitId: 'circular-motion-gravitation',
          name: 'Uniform Circular Motion',
          description: 'Motion in a circular path at constant speed',
          learningObjectives: [
            'Calculate centripetal acceleration',
            'Understand centripetal force',
            'Apply circular motion concepts to real-world scenarios'
          ],
          status: 'not-started',
          notes: []
        },
        {
          id: 'universal-gravitation',
          unitId: 'circular-motion-gravitation',
          name: 'Universal Gravitation',
          description: 'Newton\'s law of universal gravitation',
          learningObjectives: [
            'Apply the law of universal gravitation',
            'Calculate gravitational field strength',
            'Understand orbital motion'
          ],
          status: 'not-started',
          notes: []
        }
      ]
    },
    {
      id: 'energy',
      name: 'Energy',
      description: 'Work, energy, and conservation of energy',
      weighting: '20-24%',
      topics: [
        {
          id: 'work-and-energy',
          unitId: 'energy',
          name: 'Work and Energy',
          description: 'Work done by forces and energy transformations',
          learningObjectives: [
            'Calculate work done by constant and variable forces',
            'Understand kinetic and potential energy',
            'Apply work-energy theorem'
          ],
          status: 'not-started',
          notes: []
        },
        {
          id: 'conservation-of-energy',
          unitId: 'energy',
          name: 'Conservation of Energy',
          description: 'Energy conservation in isolated systems',
          learningObjectives: [
            'Apply conservation of mechanical energy',
            'Account for energy losses due to friction',
            'Analyze energy transformations in complex systems'
          ],
          status: 'not-started',
          notes: []
        }
      ]
    },
    {
      id: 'momentum',
      name: 'Momentum',
      description: 'Linear momentum and its conservation',
      weighting: '10-16%',
      topics: [
        {
          id: 'linear-momentum',
          unitId: 'momentum',
          name: 'Linear Momentum',
          description: 'Momentum as a vector quantity',
          learningObjectives: [
            'Calculate linear momentum',
            'Understand impulse and momentum change',
            'Apply conservation of momentum in collisions'
          ],
          status: 'not-started',
          notes: []
        },
        {
          id: 'collisions',
          unitId: 'momentum',
          name: 'Collisions',
          description: 'Elastic and inelastic collisions',
          learningObjectives: [
            'Distinguish between elastic and inelastic collisions',
            'Analyze one-dimensional collisions',
            'Apply momentum conservation in two dimensions'
          ],
          status: 'not-started',
          notes: []
        }
      ]
    },
    {
      id: 'simple-harmonic-motion',
      name: 'Simple Harmonic Motion',
      description: 'Oscillatory motion and periodic systems',
      weighting: '4-6%',
      topics: [
        {
          id: 'oscillations',
          unitId: 'simple-harmonic-motion',
          name: 'Oscillations',
          description: 'Periodic motion and simple harmonic oscillators',
          learningObjectives: [
            'Identify simple harmonic motion',
            'Calculate period and frequency',
            'Understand energy in oscillating systems'
          ],
          status: 'not-started',
          notes: []
        }
      ]
    },
    {
      id: 'torque-rotational-motion',
      name: 'Torque & Rotational Motion',
      description: 'Rotational dynamics and equilibrium',
      weighting: '10-16%',
      topics: [
        {
          id: 'rotational-kinematics',
          unitId: 'torque-rotational-motion',
          name: 'Rotational Kinematics',
          description: 'Angular displacement, velocity, and acceleration',
          learningObjectives: [
            'Define angular quantities',
            'Apply rotational kinematic equations',
            'Relate linear and angular quantities'
          ],
          status: 'not-started',
          notes: []
        },
        {
          id: 'torque-and-equilibrium',
          unitId: 'torque-rotational-motion',
          name: 'Torque and Equilibrium',
          description: 'Rotational forces and static equilibrium',
          learningObjectives: [
            'Calculate torque',
            'Apply conditions for rotational equilibrium',
            'Analyze systems in static equilibrium'
          ],
          status: 'not-started',
          notes: []
        }
      ]
    },
    {
      id: 'fluids',
      name: 'Fluids',
      description: 'Fluid statics and dynamics',
      weighting: '4-6%',
      topics: [
        {
          id: 'fluid-statics',
          unitId: 'fluids',
          name: 'Fluid Statics',
          description: 'Pressure and buoyancy in fluids',
          learningObjectives: [
            'Calculate pressure in fluids',
            'Understand buoyant force',
            'Apply Archimedes\' principle'
          ],
          status: 'not-started',
          notes: []
        },
        {
          id: 'fluid-dynamics',
          unitId: 'fluids',
          name: 'Fluid Dynamics',
          description: 'Flow of fluids and Bernoulli\'s principle',
          learningObjectives: [
            'Understand continuity equation',
            'Apply Bernoulli\'s principle',
            'Analyze fluid flow problems'
          ],
          status: 'not-started',
          notes: []
        }
      ]
    }
  ]
};

// Status options for topics
export const topicStatusOptions = [
  { value: 'not-started', label: 'Not Started', color: 'bg-gray-100 text-gray-700' },
  { value: 'reviewing-in-class', label: 'Reviewing in Class', color: 'bg-blue-100 text-blue-700' },
  { value: 'lesson-taught', label: 'Lesson Taught', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'reviewing', label: 'Reviewing', color: 'bg-orange-100 text-orange-700' },
  { value: 'done', label: 'Done', color: 'bg-green-100 text-green-700' }
];

// Helper function to get status color
export function getStatusColor(status: string): string {
  const statusOption = topicStatusOptions.find(option => option.value === status);
  return statusOption ? statusOption.color : 'bg-gray-100 text-gray-700';
}

// Helper function to get status label
export function getStatusLabel(status: string): string {
  const statusOption = topicStatusOptions.find(option => option.value === status);
  return statusOption ? statusOption.label : 'Unknown';
}
