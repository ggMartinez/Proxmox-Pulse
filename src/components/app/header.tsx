import { Cpu } from 'lucide-react';

export function AppHeader() {
  return (
    <div className="flex h-14 items-center px-2">
      <div className="mr-4 flex items-center">
        <Cpu className="h-6 w-6 mr-2 text-primary" />
        <span className="font-bold text-lg group-data-[collapsible=icon]:hidden">Proxmox Pulse</span>
      </div>
    </div>
  );
}
