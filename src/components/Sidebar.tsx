import { Link, useLocation } from 'react-router-dom';
import { useTheme } from './ThemeProvider';
import { useBackpackStore } from '../store/backpackSlice';
import { 
  Home, 
  Search, 
  Briefcase, 
  Settings, 
  Moon, 
  Sun, 
  Monitor,
  BookOpen,
  Target,
  TrendingUp
} from 'lucide-react';

export function Sidebar() {
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const backpackCourses = useBackpackStore(state => state.courses);

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Explore', href: '/explore', icon: Search },
    { name: 'Backpack', href: '/backpack', icon: Briefcase, badge: backpackCourses.length },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  const getThemeIcon = () => {
    if (theme === 'light') return Sun;
    if (theme === 'dark') return Moon;
    return Monitor;
  };

  const ThemeIcon = getThemeIcon();

  return (
    <div className="w-64 bg-card border-r border-border h-screen flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">AP Manager</h1>
            <p className="text-xs text-muted-foreground">Course Management</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive(item.href)
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.name}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="ml-auto bg-primary-foreground text-primary text-xs px-2 py-1 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Quick Stats */}
      {backpackCourses.length > 0 && (
        <div className="p-4 border-t border-border">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Active Courses</span>
              <span className="font-medium">{backpackCourses.length}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">In Progress</span>
              <span className="font-medium">
                {backpackCourses.filter(c => c.status === 'in-progress').length}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        >
          <ThemeIcon className="w-4 h-4" />
          <span>
            {theme === 'light' && 'Light'}
            {theme === 'dark' && 'Dark'}
            {theme === 'system' && 'System'}
          </span>
        </button>
      </div>
    </div>
  );
}
