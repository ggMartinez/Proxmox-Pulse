'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';

const publicPaths = ['/login'];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading) {
      const isPublic = publicPaths.includes(pathname);
      
      if (!isAuthenticated && !isPublic) {
        router.push('/login');
      }
      
      if (isAuthenticated && isPublic) {
        router.push('/virtual-machines');
      }
    }
  }, [isAuthenticated, isLoading, router, pathname]);

  if (isLoading || (!isAuthenticated && !publicPaths.includes(pathname))) {
    // You can render a loading spinner here
    return (
      <div className="flex min-h-screen items-center justify-center">
        {/* Loading... or a spinner component */}
      </div>
    );
  }

  return <>{children}</>;
}
