import { toast as sonnerToast } from 'sonner';
import { type ClassValue } from 'clsx';

type ToastProps = {
  title?: string;
  description?: string;
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info';
  duration?: number;
};

const variantStyles: Record<string, { className?: ClassValue }> = {
  success: { className: 'bg-emerald-600 text-white border-emerald-700' },
  error: { className: 'bg-red-600 text-white border-red-700' },
  warning: { className: 'bg-amber-500 text-white border-amber-600' },
  info: { className: 'bg-blue-600 text-white border-blue-700' },
  default: {},
};

function toast({ title, description, variant = 'default', duration }: ToastProps) {
  const style = variantStyles[variant];

  if (variant === 'default') {
    return sonnerToast(title, {
      description,
      duration,
    });
  }

  const node = (
    <div className="flex flex-col gap-1">
      {title && <div className="text-sm font-semibold">{title}</div>}
      {description && (
        <div className="text-sm opacity-90">{description}</div>
      )}
    </div>
  );

  return sonnerToast(node, {
    duration,
    className: style.className as string | undefined,
  });
}

function useToast() {
  return {
    toast,
    success: (props: Omit<ToastProps, 'variant'>) =>
      toast({ ...props, variant: 'success' }),
    error: (props: Omit<ToastProps, 'variant'>) =>
      toast({ ...props, variant: 'error' }),
    warning: (props: Omit<ToastProps, 'variant'>) =>
      toast({ ...props, variant: 'warning' }),
    info: (props: Omit<ToastProps, 'variant'>) =>
      toast({ ...props, variant: 'info' }),
    dismiss: sonnerToast.dismiss,
    promise: sonnerToast.promise,
  };
}

type ToasterProps = {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center';
  richColors?: boolean;
  expand?: boolean;
  closeButton?: boolean;
};

function Toaster({
  position = 'top-right',
  richColors = false,
  expand = false,
  closeButton = true,
}: ToasterProps) {
  const { Toaster: SonnerToaster } = require('sonner');
  return (
    <SonnerToaster
      position={position}
      richColors={richColors}
      expand={expand}
      closeButton={closeButton}
      toastOptions={{
        className: 'border',
      }}
    />
  );
}

export { toast, useToast, Toaster };
export type { ToastProps, ToasterProps };
