"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Package } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth.store';


const navItems = [
  { href: '/', label: 'Tableau de bord', icon: Home, allowedRoles: ['ALL'] },
  { href: '/products', label: 'Produits', icon: Package, allowedRoles: ['PHARMACIEN'] },
  { href: '/stock/entry', label: 'Entrée Stock', icon: Package, allowedRoles: ['MAGASINIER'] },
  { href: '/stock/exit', label: 'Sortie Stock', icon: Package, allowedRoles: ['MAGASINIER'] },
  { href: '/inventory', label: 'Inventaire', icon: Package, allowedRoles: ['MAGASINIER'] },
  { href: '/products/suppliers', label: 'Fournisseurs', icon: Package, allowedRoles: ['PHARMACIEN'] },
  { href: '/products/categories', label: 'Catégories', icon: Package, allowedRoles: ['PHARMACIEN'] },
  { href: '/audit', label: 'Audit', icon: Package, allowedRoles: ['AUDITEUR'] },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuthStore();

  const filteredNavItems = navItems.filter(item => {
    // Admin has access to everything
    if (user?.role === 'ADMIN' || user?.role === 'ADMIN_IT') return true;

    // 'ALL' role is accessible to everyone
    if (item.allowedRoles.includes('ALL')) return true;

    // Check specific role
    if (user && item.allowedRoles.includes(user.role)) return true;

    return false;
  });

  return (
    <div className="hidden w-64 flex-shrink-0 border-r border-white/5 bg-black/20 backdrop-blur-xl md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-16 items-center border-b border-white/5 px-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-white">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-primary">
              <Package className="h-5 w-5" />
            </div>
            <span>StockCare</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-4">
          <nav className="grid items-start px-4 text-sm font-medium gap-1">
            {filteredNavItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200',
                    'hover:bg-white/5 hover:text-white',
                    isActive
                      ? 'bg-primary/10 text-primary shadow-[0_0_15px_rgba(var(--primary),0.3)] font-semibold'
                      : 'text-muted-foreground'
                  )}
                >
                  <item.icon className={cn("h-4 w-4", isActive && "text-primary")} />
                  {item.label}
                  {isActive && (
                    <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_currentColor]" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="mt-auto p-4 border-t border-white/5">
          <div className="rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 p-4 border border-white/5">
            <p className="text-xs font-medium text-white mb-1">Stock Status</p>
            <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden">
              <div className="h-full bg-primary w-3/4 rounded-full" />
            </div>
            <p className="text-[10px] text-muted-foreground mt-2">Systems Operational</p>
          </div>
        </div>
      </div>
    </div>
  );
}
