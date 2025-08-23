export type APSubject = "Science" | "Math" | "History" | "English" | "CS" | "World Language" | "Other";

export interface APTopic {
  id: string;
  title: string;
  refCode?: string;
}

export interface APUnit {
  id: string;
  title: string;
  topics: APTopic[];
}

export interface APCourse {
  id: string;
  name: string;
  subject: APSubject;
  units: APUnit[];
}

export interface APFrameworkAdapter {
  getCourses(): Promise<APCourse[]>;
  getCourse(id: string): Promise<APCourse | null>;
  getUnits(courseId: string): Promise<APUnit[]>;
  getUnit(courseId: string, unitId: string): Promise<APUnit | null>;
}

// Static mock data for development
const staticCourses: APCourse[] = [
  {
    id: "ap-chemistry",
    name: "AP Chemistry",
    subject: "Science",
    units: [
      {
        id: "unit-1",
        title: "Atomic Structure and Properties",
        topics: [
          { id: "topic-1-1", title: "Moles and Molar Mass", refCode: "1.1" },
          { id: "topic-1-2", title: "Mass Spectroscopy of Elements", refCode: "1.2" },
          { id: "topic-1-3", title: "Elemental Composition of Pure Substances", refCode: "1.3" },
          { id: "topic-1-4", title: "Composition of Mixtures", refCode: "1.4" },
          { id: "topic-1-5", title: "Atomic Structure and Electron Configuration", refCode: "1.5" },
          { id: "topic-1-6", title: "Photoelectron Spectroscopy", refCode: "1.6" },
          { id: "topic-1-7", title: "Periodic Trends", refCode: "1.7" },
          { id: "topic-1-8", title: "Valence Electrons and Ionic Compounds", refCode: "1.8" },
        ],
      },
      {
        id: "unit-2",
        title: "Molecular and Ionic Compound Structure and Properties",
        topics: [
          { id: "topic-2-1", title: "Types of Chemical Bonds", refCode: "2.1" },
          { id: "topic-2-2", title: "Intramolecular Force and Potential Energy", refCode: "2.2" },
          { id: "topic-2-3", title: "Structure of Ionic Solids", refCode: "2.3" },
          { id: "topic-2-4", title: "Structure of Metals and Alloys", refCode: "2.4" },
          { id: "topic-2-5", title: "Lewis Diagrams", refCode: "2.5" },
          { id: "topic-2-6", title: "Resonance and Formal Charge", refCode: "2.6" },
          { id: "topic-2-7", title: "VSEPR and Bond Hybridization", refCode: "2.7" },
        ],
      },
    ],
  },
  {
    id: "ap-calculus-bc",
    name: "AP Calculus BC",
    subject: "Math",
    units: [
      {
        id: "unit-1",
        title: "Limits and Continuity",
        topics: [
          { id: "topic-1-1", title: "Introducing Calculus: Can Change Occur at an Instant?", refCode: "1.1" },
          { id: "topic-1-2", title: "Defining Limits and Using Limit Notation", refCode: "1.2" },
          { id: "topic-1-3", title: "Estimating Limit Values from Graphs", refCode: "1.3" },
          { id: "topic-1-4", title: "Estimating Limit Values from Tables", refCode: "1.4" },
          { id: "topic-1-5", title: "Determining Limits Using Algebraic Properties", refCode: "1.5" },
          { id: "topic-1-6", title: "Determining Limits Using Algebraic Manipulation", refCode: "1.6" },
          { id: "topic-1-7", title: "Selecting Procedures for Determining Limits", refCode: "1.7" },
          { id: "topic-1-8", title: "Determining Limits Using the Squeeze Theorem", refCode: "1.8" },
          { id: "topic-1-9", title: "Connecting Multiple Representations of Limits", refCode: "1.9" },
          { id: "topic-1-10", title: "Exploring Types of Discontinuities", refCode: "1.10" },
          { id: "topic-1-11", title: "Defining Continuity at a Point", refCode: "1.11" },
          { id: "topic-1-12", title: "Confirming Continuity Over an Interval", refCode: "1.12" },
          { id: "topic-1-13", title: "Removing Discontinuities", refCode: "1.13" },
          { id: "topic-1-14", title: "Connecting Infinite Limits and Vertical Asymptotes", refCode: "1.14" },
          { id: "topic-1-15", title: "Connecting Limits at Infinity and Horizontal Asymptotes", refCode: "1.15" },
        ],
      },
      {
        id: "unit-2",
        title: "Differentiation: Definition and Basic Derivative Rules",
        topics: [
          { id: "topic-2-1", title: "Defining Average and Instantaneous Rates of Change at a Point", refCode: "2.1" },
          { id: "topic-2-2", title: "Defining the Derivative of a Function and Using Derivative Notation", refCode: "2.2" },
          { id: "topic-2-3", title: "Estimating Derivatives of a Function at a Point", refCode: "2.3" },
          { id: "topic-2-4", title: "Connecting Differentiability and Continuity", refCode: "2.4" },
          { id: "topic-2-5", title: "Applying the Power Rule", refCode: "2.5" },
          { id: "topic-2-6", title: "Derivative Rules: Constant, Sum, Difference, and Constant Multiple", refCode: "2.6" },
          { id: "topic-2-7", title: "Derivatives of cos(x), sin(x), e^x, and ln(x)", refCode: "2.7" },
          { id: "topic-2-8", title: "The Product Rule", refCode: "2.8" },
          { id: "topic-2-9", title: "The Quotient Rule", refCode: "2.9" },
          { id: "topic-2-10", title: "Finding the Derivatives of Tangent, Cotangent, Secant, and/or Cosecant Functions", refCode: "2.10" },
        ],
      },
    ],
  },
  {
    id: "ap-world-history",
    name: "AP World History: Modern",
    subject: "History",
    units: [
      {
        id: "unit-1",
        title: "The Global Tapestry",
        topics: [
          { id: "topic-1-1", title: "Developments in East Asia from c. 1200 to c. 1450", refCode: "1.1" },
          { id: "topic-1-2", title: "Developments in Dar al-Islam from c. 1200 to c. 1450", refCode: "1.2" },
          { id: "topic-1-3", title: "Developments in South and Southeast Asia from c. 1200 to c. 1450", refCode: "1.3" },
          { id: "topic-1-4", title: "State Building in the Americas", refCode: "1.4" },
          { id: "topic-1-5", title: "State Building in Africa", refCode: "1.5" },
          { id: "topic-1-6", title: "Developments in Europe from c. 1200 to c. 1450", refCode: "1.6" },
          { id: "topic-1-7", title: "Comparison in the Period from c. 1200 to c. 1450", refCode: "1.7" },
        ],
      },
      {
        id: "unit-2",
        title: "Networks of Exchange",
        topics: [
          { id: "topic-2-1", title: "The Silk Roads", refCode: "2.1" },
          { id: "topic-2-2", title: "The Mongol Empire and the Making of the Modern World", refCode: "2.2" },
          { id: "topic-2-3", title: "Exchange in the Indian Ocean", refCode: "2.3" },
          { id: "topic-2-4", title: "Trans-Saharan Trade Routes", refCode: "2.4" },
          { id: "topic-2-5", title: "Cultural Consequences of Connectivity", refCode: "2.5" },
          { id: "topic-2-6", title: "Environmental Consequences of Connectivity", refCode: "2.6" },
          { id: "topic-2-7", title: "Comparison of Economic Exchange", refCode: "2.7" },
        ],
      },
    ],
  },
  {
    id: "ap-english-language",
    name: "AP English Language and Composition",
    subject: "English",
    units: [
      {
        id: "unit-1",
        title: "You'll learn to identify and analyze the claims in a text and determine whether the writer backs up their assertions with logical reasoning and reliable evidence.",
        topics: [
          { id: "topic-1-1", title: "Identifying the purpose and intended audience of a text", refCode: "1.1" },
          { id: "topic-1-2", title: "Examining how evidence supports a claim", refCode: "1.2" },
          { id: "topic-1-3", title: "Developing paragraphs as part of an effective argument", refCode: "1.3" },
        ],
      },
      {
        id: "unit-2",
        title: "You'll learn about how writers organize information and evidence to support a specific argument and appeal to a specific audience.",
        topics: [
          { id: "topic-2-1", title: "Analyzing audience and its relationship to the purpose of an argument", refCode: "2.1" },
          { id: "topic-2-2", title: "Building an argument with relevant and strategic evidence", refCode: "2.2" },
          { id: "topic-2-3", title: "Developing a thesis statement and line of reasoning", refCode: "2.3" },
          { id: "topic-2-4", title: "Introducing, integrating, and citing evidence", refCode: "2.4" },
          { id: "topic-2-5", title: "Developing a line of reasoning and commentary", refCode: "2.5" },
          { id: "topic-2-6", title: "Using transitions to connect ideas throughout an argument", refCode: "2.6" },
        ],
      },
    ],
  },
];

class StaticAPFrameworkAdapter implements APFrameworkAdapter {
  async getCourses(): Promise<APCourse[]> {
    return staticCourses;
  }

  async getCourse(id: string): Promise<APCourse | null> {
    return staticCourses.find(course => course.id === id) || null;
  }

  async getUnits(courseId: string): Promise<APUnit[]> {
    const course = await this.getCourse(courseId);
    return course?.units || [];
  }

  async getUnit(courseId: string, unitId: string): Promise<APUnit | null> {
    const course = await this.getCourse(courseId);
    return course?.units.find(unit => unit.id === unitId) || null;
  }
}

// Remote adapter placeholder for future College Board integration
class RemoteAPFrameworkAdapter implements APFrameworkAdapter {
  async getCourses(): Promise<APCourse[]> {
    // TODO: Implement API call to College Board or other official source
    throw new Error("Remote AP Framework not yet implemented");
  }

  async getCourse(id: string): Promise<APCourse | null> {
    // TODO: Implement API call to College Board or other official source
    throw new Error("Remote AP Framework not yet implemented");
  }

  async getUnits(courseId: string): Promise<APUnit[]> {
    // TODO: Implement API call to College Board or other official source
    throw new Error("Remote AP Framework not yet implemented");
  }

  async getUnit(courseId: string, unitId: string): Promise<APUnit | null> {
    // TODO: Implement API call to College Board or other official source
    throw new Error("Remote AP Framework not yet implemented");
  }
}

// Export the static adapter as default
export const apFramework = new StaticAPFrameworkAdapter();

// Export the remote adapter for future use
export const remoteAPFramework = new RemoteAPFrameworkAdapter();

// Factory function to switch between adapters
export function createAPFrameworkAdapter(type: 'static' | 'remote' = 'static'): APFrameworkAdapter {
  return type === 'static' ? apFramework : remoteAPFramework;
}
