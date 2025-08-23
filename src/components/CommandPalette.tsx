import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Command } from 'cmdk';
import { useBackpackStore } from '../store/backpackSlice';
import { useCoursesStore } from '../store/coursesSlice';
import { 
  Search, 
  Plus, 
  Briefcase, 
  BookOpen, 
  Target,
  Settings,
  Home
} from 'lucide-react';

interface CommandItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { courses } = useCoursesStore();
  const { addCourse } = useBackpackStore();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const commandItems: CommandItem[] = [
    {
      id: 'dashboard',
      title: 'Go to Dashboard',
      subtitle: 'View your progress overview',
      icon: Home,
      action: () => {
        navigate('/');
        setOpen(false);
      },
    },
    {
      id: 'explore',
      title: 'Explore Courses',
      subtitle: 'Browse available AP courses',
      icon: Search,
      action: () => {
        navigate('/explore');
        setOpen(false);
      },
    },
    {
      id: 'backpack',
      title: 'Go to Backpack',
      subtitle: 'View your selected courses',
      icon: Briefcase,
      action: () => {
        navigate('/backpack');
        setOpen(false);
      },
    },
    {
      id: 'settings',
      title: 'Settings',
      subtitle: 'Manage app preferences',
      icon: Settings,
      action: () => {
        navigate('/settings');
        setOpen(false);
      },
    },
    ...courses.map(course => ({
      id: `add-${course.id}`,
      title: `Add ${course.name} to Backpack`,
      subtitle: `${course.subject} • ${course.units.length} units`,
      icon: Plus,
      action: () => {
        addCourse(course.id);
        setOpen(false);
      },
    })),
  ];

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
    >
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]">
        <Command className="w-full max-w-2xl rounded-lg border bg-card shadow-lg">
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <Command.Input
              placeholder="Search commands..."
              className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <Command.List className="max-h-[300px] overflow-y-auto p-2">
            <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
              No commands found.
            </Command.Empty>
            {commandItems.map((item) => {
              const Icon = item.icon;
              return (
                <Command.Item
                  key={item.id}
                  value={item.id}
                  onSelect={item.action}
                  className="flex cursor-pointer items-center space-x-3 rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                >
                  <Icon className="h-4 w-4" />
                  <div className="flex-1">
                    <div className="font-medium">{item.title}</div>
                    {item.subtitle && (
                      <div className="text-xs text-muted-foreground">
                        {item.subtitle}
                      </div>
                    )}
                  </div>
                </Command.Item>
              );
            })}
          </Command.List>
        </Command>
      </div>
    </Command.Dialog>
  );
}
