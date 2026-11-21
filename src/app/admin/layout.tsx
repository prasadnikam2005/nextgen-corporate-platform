'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState<boolean>(true);

  useEffect(() => {
    if (pathname === '/admin/login') {
      setChecking(false);
      return;
    }

    const checkAuth = async () => {
      try {
        if (supabase) {
          const { data } = await supabase.auth.getSession();
          if (data?.session) {
            setChecking(false);
            return;
          }
        }
      } catch {
        // continue to demo check
      }

      const demoAuth = localStorage.getItem('nexora_admin_auth');
      if (demoAuth) {
        try {
          const parsed = JSON.parse(demoAuth);
          if (parsed.authenticated) {
            setChecking(false);
            return;
          }
        } catch {
          // invalid json
        }
      }

      // Redirect unauthenticated visitor to login
      router.replace('/admin/login');
    };

    checkAuth();
  }, [pathname, router]);

  if (checking && pathname !== '/admin/login') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-slate-500">Verifying enterprise credentials...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
