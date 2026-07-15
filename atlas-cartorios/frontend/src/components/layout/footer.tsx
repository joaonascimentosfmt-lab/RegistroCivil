'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function Footer() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <footer className="flex h-8 items-center justify-between border-t bg-background px-4 text-xs text-muted-foreground">
      <div className="flex items-center gap-2">
        <span>Usuário: Admin</span>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span>Online</span>
        </div>
        <span>{format(currentTime, "HH:mm:ss")}</span>
        <span>{format(currentTime, "dd/MM/yyyy", { locale: ptBR })}</span>
        <span>v1.0.0</span>
        <span>Serventia: 1º Ofício</span>
      </div>
    </footer>
  );
}
