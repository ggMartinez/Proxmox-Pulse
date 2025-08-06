'use client';

import { usePathname } from 'next/navigation';
import { SidebarProvider, Sidebar, SidebarInset, SidebarTrigger, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarGroup, SidebarGroupLabel } from '@/components/ui/sidebar';
import { AppHeader } from '@/components/app/header';
import { Server, Box, Database } from 'lucide-react';
import Link from 'next/link';
import { AuthGuard } from './auth-guard';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === '/login') {
    return <>{children}</>;
  }

  return (
    <AuthGuard>
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
            <AppHeader />
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarGroup>
                <SidebarGroupLabel>Node</SidebarGroupLabel>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/virtual-machines">
                      <Server />
                      Virtual Machines
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/containers">
                      <Box />
                      Containers
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/storages">
                      <Database />
                      Storages
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarGroup>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <header className="flex items-center gap-4 border-b p-4 md:hidden">
            <SidebarTrigger />
            <h2 className="text-lg font-semibold">Proxmox Pulse</h2>
          </header>
          <main className="flex-1 p-4 md:p-8">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  );
}
