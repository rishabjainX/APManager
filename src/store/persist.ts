import localforage from 'localforage';

// Configure localForage
localforage.config({
  name: 'apmanager',
  storeName: 'apmanager_store',
});

export interface PersistConfig<T> {
  key: string;
  version: number;
  migrate?: (oldData: any, version: number) => T;
}

export class PersistStore<T> {
  private config: PersistConfig<T>;
  private data: T | null = null;
  private listeners: Set<(data: T) => void> = new Set();

  constructor(config: PersistConfig<T>) {
    this.config = config;
    this.load();
  }

  async load(): Promise<void> {
    try {
      const stored = await localforage.getItem(this.config.key);
      if (stored && typeof stored === 'object' && 'version' in stored && 'data' in stored) {
        const { version, data } = stored as { version: number; data: any };
        
        if (version === this.config.version) {
          this.data = data;
        } else if (this.config.migrate) {
          this.data = this.config.migrate(data, version);
        } else {
          // If no migration function and versions don't match, reset to default
          this.data = null;
        }
      }
    } catch (error) {
      console.error('Failed to load persisted data:', error);
      this.data = null;
    }
    
    this.notifyListeners();
  }

  async save(data: T): Promise<void> {
    try {
      this.data = data;
      await localforage.setItem(this.config.key, {
        version: this.config.version,
        data,
        timestamp: Date.now(),
      });
      this.notifyListeners();
    } catch (error) {
      console.error('Failed to save persisted data:', error);
    }
  }

  get(): T | null {
    return this.data;
  }

  subscribe(listener: (data: T) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    if (this.data !== null) {
      this.listeners.forEach(listener => listener(this.data!));
    }
  }

  async clear(): Promise<void> {
    try {
      await localforage.removeItem(this.config.key);
      this.data = null;
      this.notifyListeners();
    } catch (error) {
      console.error('Failed to clear persisted data:', error);
    }
  }
}

// Migration utilities
export function createMigration<T>(
  fromVersion: number,
  toVersion: number,
  migrate: (data: any) => T
) {
  return { fromVersion, toVersion, migrate };
}

export function applyMigrations<T>(
  data: any,
  currentVersion: number,
  migrations: Array<{ fromVersion: number; toVersion: number; migrate: (data: any) => T }>
): T {
  let migratedData = data;
  
  // Sort migrations by fromVersion
  const sortedMigrations = migrations.sort((a, b) => a.fromVersion - b.fromVersion);
  
  for (const migration of sortedMigrations) {
    if (migration.fromVersion === currentVersion) {
      migratedData = migration.migrate(migratedData);
      currentVersion = migration.toVersion;
    }
  }
  
  return migratedData;
}
