'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/lib/hooks/use-sidebar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  LayoutDashboard,
  ClipboardList,
  FileText,
  Users,
  Building2,
  FolderOpen,
  DollarSign,
  ShieldAlert,
  Calendar,
  BarChart3,
  ScrollText,
  Settings,
  UserCog,
  Shield,
  ChevronLeft,
  ChevronRight,
  Scale,
} from 'lucide-react';

type NavItem = {
  label: string;
  href: string;
  icon: React.ElementType;
};

type NavGroup = {
  label: string;
  items: NavItem[];
};

const navGroups: NavGroup[] = [
  {
    label: 'Principal',
    items: [{ label: 'Dashboard', href: '/', icon: LayoutDashboard }],
  },
  {
    label: 'Cadastros',
    items: [
      { label: 'Pessoas', href: '/people', icon: Users },
      { label: 'Imóveis', href: '/properties', icon: Building2 },
    ],
  },
  {
    label: 'Operações',
    items: [
      { label: 'Protocolos', href: '/protocols', icon: ClipboardList },
      { label: 'Documentos', href: '/documents', icon: FolderOpen },
      { label: 'Financeiro', href: '/finance', icon: DollarSign },
      { label: 'Atendimento', href: '/attendance', icon: Calendar },
    ],
  },
  {
    label: 'Compliance',
    items: [
      { label: 'SISCOAF', href: '/siscoaf', icon: ShieldAlert },
      { label: 'Agenda', href: '/schedule', icon: Calendar },
    ],
  },
  {
    label: 'Administrativo',
    items: [
      { label: 'Relatórios', href: '/reports', icon: BarChart3 },
      { label: 'Auditoria', href: '/audit', icon: ScrollText },
      { label: 'Configurações', href: '/settings', icon: Settings },
      { label: 'Usuários', href: '/users', icon: UserCog },
      { label: 'Permissões', href: '/roles', icon: Shield },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isOpen, toggle } = useSidebar();

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 flex h-screen flex-col bg-sidebar text-sidebar-foreground transition-all duration-300 ease-in-out',
        isOpen ? 'w-64' : 'w-16'
      )}
    >
      <div className="flex h-16 items-center justify-between px-4">
        {isOpen ? (
          <div className="flex items-center gap-2">
            <Scale className="h-7 w-7 text-sidebar-active" />
            <span className="text-lg font-bold tracking-tight">Atlas</span>
          </div>
        ) : (
          <Scale className="mx-auto h-7 w-7 text-sidebar-active" />
        )}
        <button
          onClick={toggle}
          className="rounded-md p-1.5 text-sidebar-foreground/60 hover:bg-sidebar-hover hover:text-sidebar-foreground transition-colors"
        >
          {isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
      </div>

      <Separator className="bg-sidebar-hover" />

      <ScrollArea className="flex-1 px-2 py-4 scrollbar-thin">
        <nav className="flex flex-col gap-6">
          {navGroups.map((group) => (
            <div key={group.label}>
              {isOpen && (
                <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/50">
                  {group.label}
                </p>
              )}
              <ul className="flex flex-col gap-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    item.href === '/'
                      ? pathname === '/'
                      : pathname.startsWith(item.href);

                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                          isActive
                            ? 'bg-sidebar-active text-white'
                            : 'text-sidebar-foreground/70 hover:bg-sidebar-hover hover:text-sidebar-foreground'
                        )}
                        title={!isOpen ? item.label : undefined}
                      >
                        <Icon className="h-5 w-5 flex-shrink-0" />
                        {isOpen && <span>{item.label}</span>}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </ScrollArea>
    </aside>
  );
}
