import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { SidebarProvider, Sidebar, SidebarInset, SidebarTrigger, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarGroup, SidebarGroupLabel } from '@/components/ui/sidebar';
import { AppHeader } from '@/components/app/header';
import { Server, Box, Database, Home } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Proxmox Pulse',
  description: 'A responsive, mobile-friendly frontend app for Proxmox-VE server management.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
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
        <Toaster />
      </body>
    </html>
  );
}
