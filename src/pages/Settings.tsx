import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useNotesStore } from '../store/notesSlice';
import { usePracticeStore } from '../store/practiceSlice';
import { useBackpackStore } from '../store/backpackSlice';
import { useTheme } from '../components/ThemeProvider';
import { 
  Download, 
  Upload, 
  Trash2, 
  Settings as SettingsIcon,
  Database,
  Moon,
  Sun,
  Monitor,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

export function Settings() {
  const { theme, setTheme } = useTheme();
  const { exportNotes, importNotes, clearNotes } = useNotesStore();
  const { exportAttempts, importAttempts, clearAttempts } = usePracticeStore();
  const { clearBackpack } = useBackpackStore();
  
  const [importData, setImportData] = useState('');
  const [isImporting, setIsImporting] = useState(false);

  const handleExportAll = () => {
    try {
      const exportData = {
        version: 1,
        timestamp: new Date().toISOString(),
        notes: exportNotes(),
        attempts: exportAttempts(),
        // Note: Backpack data is not exported as it's course selection data
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json',
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `apmanager-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('Data exported successfully!');
    } catch (error) {
      toast.error('Failed to export data');
      console.error('Export error:', error);
    }
  };

  const handleImportData = async () => {
    if (!importData.trim()) {
      toast.error('Please enter import data');
      return;
    }

    setIsImporting(true);
    try {
      const importObj = JSON.parse(importData);
      
      if (importObj.notes) {
        importNotes(JSON.stringify(importObj.notes));
      }
      
      if (importObj.attempts) {
        importAttempts(JSON.stringify(importObj.attempts));
      }
      
      setImportData('');
      toast.success('Data imported successfully!');
    } catch (error) {
      toast.error('Invalid import data format');
      console.error('Import error:', error);
    } finally {
      setIsImporting(false);
    }
  };

  const handleClearAllData = () => {
    if (confirm('Are you sure you want to clear ALL data? This action cannot be undone.')) {
      try {
        clearNotes();
        clearAttempts();
        clearBackpack();
        toast.success('All data cleared successfully');
      } catch (error) {
        toast.error('Failed to clear data');
        console.error('Clear error:', error);
      }
    }
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'light': return Sun;
      case 'dark': return Moon;
      default: return Monitor;
    }
  };

  const ThemeIcon = getThemeIcon();

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Manage your app preferences and data
          </p>
        </div>

        {/* Theme Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <SettingsIcon className="w-5 h-5 mr-2" />
              Appearance
            </CardTitle>
            <CardDescription>
              Customize the app's look and feel
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Theme
              </label>
              <div className="flex space-x-2">
                <Button
                  variant={theme === 'light' ? 'default' : 'outline'}
                  onClick={() => setTheme('light')}
                  className="flex items-center space-x-2"
                >
                  <Sun className="w-4 h-4" />
                  <span>Light</span>
                </Button>
                <Button
                  variant={theme === 'dark' ? 'default' : 'outline'}
                  onClick={() => setTheme('dark')}
                  className="flex items-center space-x-2"
                >
                  <Moon className="w-4 h-4" />
                  <span>Dark</span>
                </Button>
                <Button
                  variant={theme === 'system' ? 'default' : 'outline'}
                  onClick={() => setTheme('system')}
                  className="flex items-center space-x-2"
                >
                  <Monitor className="w-4 h-4" />
                  <span>System</span>
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Current theme: {theme === 'system' ? 'System Default' : theme.charAt(0).toUpperCase() + theme.slice(1)}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="w-5 h-5 mr-2" />
              Data Management
            </CardTitle>
            <CardDescription>
              Import, export, and manage your data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Export */}
            <div>
              <h4 className="font-medium text-foreground mb-2">Export Data</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Download all your notes and practice attempts as a JSON file
              </p>
              <Button onClick={handleExportAll} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export All Data
              </Button>
            </div>

            {/* Import */}
            <div>
              <h4 className="font-medium text-foreground mb-2">Import Data</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Import previously exported data. This will merge with existing data.
              </p>
              <div className="space-y-3">
                <textarea
                  value={importData}
                  onChange={(e) => setImportData(e.target.value)}
                  placeholder="Paste your exported JSON data here..."
                  className="w-full h-32 p-3 border rounded-md resize-none font-mono text-sm"
                />
                <div className="flex space-x-2">
                  <Button 
                    onClick={handleImportData} 
                    disabled={isImporting || !importData.trim()}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {isImporting ? 'Importing...' : 'Import Data'}
                  </Button>
                  <Button 
                    variant="ghost" 
                    onClick={() => setImportData('')}
                    disabled={!importData.trim()}
                  >
                    Clear
                  </Button>
                </div>
              </div>
            </div>

            {/* Clear Data */}
            <div className="border-t pt-6">
              <h4 className="font-medium text-foreground mb-2">Clear Data</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Warning: This will permanently delete all your data
              </p>
              <Button 
                variant="destructive" 
                onClick={handleClearAllData}
                className="flex items-center space-x-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear All Data</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* App Information */}
        <Card>
          <CardHeader>
            <CardTitle>App Information</CardTitle>
            <CardDescription>
              Version and technical details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Version:</span>
                <span className="ml-2 font-medium">1.0.0</span>
              </div>
              <div>
                <span className="text-muted-foreground">Build:</span>
                <span className="ml-2 font-medium">Development</span>
              </div>
              <div>
                <span className="text-muted-foreground">Storage:</span>
                <span className="ml-2 font-medium">Local (IndexedDB)</span>
              </div>
              <div>
                <span className="text-muted-foreground">Framework:</span>
                <span className="ml-2 font-medium">React + TypeScript</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Keyboard Shortcuts */}
        <Card>
          <CardHeader>
            <CardTitle>Keyboard Shortcuts</CardTitle>
            <CardDescription>
              Quick access to app features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Open Command Palette</span>
                  <kbd className="px-2 py-1 text-xs font-semibold bg-muted rounded border">
                    {navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'}+K
                  </kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Search Courses</span>
                  <kbd className="px-2 py-1 text-xs font-semibold bg-muted rounded border">
                    /
                  </kbd>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Navigate Back</span>
                  <kbd className="px-2 py-1 text-xs font-semibold bg-muted rounded border">
                    ←
                  </kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Navigate Forward</span>
                  <kbd className="px-2 py-1 text-xs font-semibold bg-muted rounded border">
                    →
                  </kbd>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Status */}
        <Card>
          <CardHeader>
            <CardTitle>Data Status</CardTitle>
            <CardDescription>
              Current state of your data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium">Notes</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {useNotesStore.getState().notes.length} notes
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium">Practice Attempts</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {usePracticeStore.getState().attempts.length} attempts
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium">Backpack Courses</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {useBackpackStore.getState().courses.length} courses
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
