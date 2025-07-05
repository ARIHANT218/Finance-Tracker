'use client';

import Link from 'next/link';
import { NavigationMenu, NavigationMenuItem, NavigationMenuList, NavigationMenuLink } from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils'; // shadcn utility for class merging

export default function NavBar() {
  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b">
      <NavigationMenu className="max-w-4xl mx-auto px-4 py-3">
        <NavigationMenuList>
          {[
            { href: '/', label: 'Home' },
            { href: '/transactions', label: 'Dashboard' },
          ].map(({ href, label }) => (
            <NavigationMenuItem key={href}>
              <Link href={href} legacyBehavior passHref>
                <NavigationMenuLink
                  className={cn(
                    'px-3 py-2 rounded-md font-medium transition-colors',
                    'hover:bg-muted hover:text-foreground/90',
                  )}
                >
                  {label}
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
}
