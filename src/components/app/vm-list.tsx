'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, Square, RotateCw, Activity } from 'lucide-react';
import type { VM } from '@/lib/mock-data';
import { OptimizationModal } from './optimization-modal';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

type VMListProps = {
  initialVms: VM[];
};

export function VmList({ initialVms }: VMListProps) {
  const [vms, setVms] = useState<VM[]>(initialVms);
  const [selectedVm, setSelectedVm] = useState<VM | null>(null);
  const { toast } = useToast();

  const handleAction = (vmId: string, action: 'start' | 'stop' | 'reboot') => {
    const vm = vms.find(v => v.id === vmId);
    if (!vm) return;

    let newStatus: 'running' | 'stopped' = vm.status;
    let message = '';
    
    switch (action) {
      case 'start':
        if (vm.status === 'stopped') {
          newStatus = 'running';
          message = `Starting ${vm.name}...`;
        } else {
          toast({ title: 'Info', description: `${vm.name} is already running.`, variant: 'default' });
          return;
        }
        break;
      case 'stop':
        if (vm.status === 'running') {
          newStatus = 'stopped';
          message = `Stopping ${vm.name}...`;
        } else {
          toast({ title: 'Info', description: `${vm.name} is already stopped.` });
          return;
        }
        break;
      case 'reboot':
         if (vm.status === 'running') {
          message = `Rebooting ${vm.name}...`;
          toast({ title: 'Rebooting VM', description: message });
          setVms(currentVms => currentVms.map(v => v.id === vmId ? { ...v, status: 'stopped' } : v));
          setTimeout(() => {
            setVms(currentVms => currentVms.map(v => v.id === vmId ? { ...v, status: 'running' } : v));
            toast({ title: 'VM Rebooted', description: `${vm.name} has been rebooted.` });
          }, 2000);
          return;
        } else {
          toast({ title: 'Info', description: `Cannot reboot ${vm.name} as it is stopped.`});
          return;
        }
    }

    if (newStatus !== vm.status) {
      setVms(currentVms => currentVms.map(v => v.id === vmId ? { ...v, status: newStatus } : v));
    }
    
    toast({
      title: `VM Action: ${action.charAt(0).toUpperCase() + action.slice(1)}`,
      description: message,
    });
  };

  return (
    <>
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Status</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">VM ID</TableHead>
              <TableHead className="hidden sm:table-cell">CPU</TableHead>
              <TableHead className="hidden sm:table-cell">Memory</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vms.map((vm) => (
              <TableRow key={vm.id}>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    <div className={cn('h-2 w-2 rounded-full mr-2', vm.status === 'running' ? 'bg-accent' : 'bg-muted-foreground')}></div>
                    {vm.status}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium">{vm.name}</TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">{vm.id}</TableCell>
                <TableCell className="hidden sm:table-cell text-muted-foreground">{vm.cpuUsage}%</TableCell>
                <TableCell className="hidden sm:table-cell text-muted-foreground">{vm.memoryUsage}%</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1 sm:gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleAction(vm.id, 'start')} disabled={vm.status === 'running'}>
                      <Play className="h-4 w-4" />
                      <span className="sr-only">Start</span>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleAction(vm.id, 'stop')} disabled={vm.status === 'stopped'}>
                      <Square className="h-4 w-4" />
                      <span className="sr-only">Stop</span>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleAction(vm.id, 'reboot')} disabled={vm.status === 'stopped'}>
                      <RotateCw className="h-4 w-4" />
                      <span className="sr-only">Reboot</span>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setSelectedVm(vm)}>
                      <Activity className="h-4 w-4 text-primary" />
                      <span className="sr-only">Optimize</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {selectedVm && (
        <OptimizationModal
          vm={selectedVm}
          isOpen={!!selectedVm}
          onClose={() => setSelectedVm(null)}
        />
      )}
    </>
  );
}
