'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useSidebar } from '@/lib/hooks/use-sidebar';
import { useAuth } from '@/lib/hooks/use-auth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Menu,
  Search,
  Bell,
  User,
  Settings,
  LogOut,
  ChevronDown,
} from 'lucide-react';

const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/people': 'Pessoas',
  '/people/new': 'Nova Pessoa',
  '/properties': 'Imóveis',
  '/properties/new': 'Novo Imóvel',
  '/protocols': 'Protocolos',
  '/protocols/new': 'Novo Protocolo',
  '/documents': 'Documentos',
  '/finance': 'Financeiro',
  '/siscoaf': 'SISCOAF',
  '/siscoaf/indicators': 'Indicadores SISCOAF',
  '/siscoaf/analyses': 'Análises SISCOAF',
  '/siscoaf/decision-tree': 'Árvore de Decisão',
  '/reports': 'Relatórios',
  '/audit': 'Auditoria',
  '/users': 'Usuários',
  '/roles': 'Permissões',
  '/settings': 'Configurações',
  '/schedule': 'Agenda',
  '/attendance': 'Atendimento',
};

export function Topbar() {
  const pathname = usePathname();
  const { toggle } = useSidebar();
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const currentPage = pageTitles[pathname] || 'Atlas Cartórios';

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'AC';

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-topbar px-4 lg:px-6">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggle}
        className="text-topbar-foreground/60 hover:text-topbar-foreground"
      >
        <Menu className="h-5 w-5" />
      </Button>

      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-topbar-foreground">
          {currentPage}
        </span>
      </div>

      <div className="ml-auto flex items-center gap-3">
        <div className="relative hidden md:flex">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 w-64 pl-9 text-sm"
          />
        </div>

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <Badge className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center p-0 text-[10px]">
            3
          </Badge>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 px-2"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium md:inline">
                {user?.name || 'Usuário'}
              </span>
              <ChevronDown className="hidden h-4 w-4 text-muted-foreground md:block" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span>{user?.name || 'Usuário'}</span>
                <span className="text-xs font-normal text-muted-foreground">
                  {user?.email || 'usuario@cartorio.com'}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Perfil
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Configurações
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
