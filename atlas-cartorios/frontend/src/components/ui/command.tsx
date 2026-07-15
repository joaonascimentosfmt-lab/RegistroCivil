import * as React from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

function useCommandFilter<T extends Record<string, unknown>>(items: T[], searchKeys: (keyof T)[]) {
  const [query, setQuery] = React.useState('');

  const filtered = React.useMemo(() => {
    if (!query.trim()) return items;
    const lower = query.toLowerCase();
    return items.filter((item) =>
      searchKeys.some((key) => {
        const val = item[key];
        return typeof val === 'string' && val.toLowerCase().includes(lower);
      })
    );
  }, [items, query, searchKeys]);

  return { query, setQuery, filtered };
}

interface CommandDialogProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

function CommandDialog({ children, open, onOpenChange }: CommandDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden p-0">
        <VisuallyHidden asChild>
          <DialogTitle>Command Menu</DialogTitle>
        </VisuallyHidden>
        <div className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface CommandInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  wrapperClassName?: string;
}

const CommandInput = React.forwardRef<HTMLInputElement, CommandInputProps>(
  ({ className, wrapperClassName, ...props }, ref) => (
    <div
      className={cn('flex items-center border-b px-3', wrapperClassName)}
      cmdk-input-wrapper=""
    >
      <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
      <input
        ref={ref}
        className={cn(
          'flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        {...props}
      />
    </div>
  )
);
CommandInput.displayName = 'CommandInput';

interface CommandListProps extends React.HTMLAttributes<HTMLDivElement> {
  maxHeight?: string;
}

const CommandList = React.forwardRef<HTMLDivElement, CommandListProps>(
  ({ className, maxHeight = '300px', ...props }, ref) => (
    <div
      ref={ref}
      className={cn('overflow-y-auto', className)}
      style={{ maxHeight }}
      cmdk-list=""
      {...props}
    />
  )
);
CommandList.displayName = 'CommandList';

const CommandEmpty = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('py-6 text-center text-sm text-muted-foreground', className)}
    cmdk-empty=""
    {...props}
  />
));
CommandEmpty.displayName = 'CommandEmpty';

interface CommandGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  heading?: string;
}

const CommandGroup = React.forwardRef<HTMLDivElement, CommandGroupProps>(
  ({ className, heading, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground',
        className
      )}
      cmdk-group=""
      {...props}
    >
      {heading && (
        <div cmdk-group-heading="">
          {heading}
        </div>
      )}
      {children}
    </div>
  )
);
CommandGroup.displayName = 'CommandGroup';

interface CommandItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  onSelect?: (value: string) => void;
  disabled?: boolean;
}

const CommandItem = React.forwardRef<HTMLDivElement, CommandItemProps>(
  ({ className, value, onSelect, disabled, ...props }, ref) => {
    const handleClick = () => {
      if (!disabled && onSelect && value) {
        onSelect(value);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !disabled && onSelect && value) {
        onSelect(value);
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-accent hover:text-accent-foreground',
          className
        )}
        role="option"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled}
        data-disabled={disabled}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        cmdk-item=""
        {...props}
      />
    );
  }
);
CommandItem.displayName = 'CommandItem';

const CommandSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('-mx-1 h-px bg-border', className)}
    cmdk-separator=""
    {...props}
  />
));
CommandSeparator.displayName = 'CommandSeparator';

const CommandShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn(
        'ml-auto text-xs tracking-widest text-muted-foreground',
        className
      )}
      {...props}
    />
  );
};
CommandShortcut.displayName = 'CommandShortcut';

export {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
  useCommandFilter,
};
