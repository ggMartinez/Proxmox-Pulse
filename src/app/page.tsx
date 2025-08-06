import { AppHeader } from '@/components/app/header';
import { NodeStatusCard } from '@/components/app/node-status-card';
import { VmList } from '@/components/app/vm-list';
import { vms, nodeStats } from '@/lib/mock-data';
import { Cpu, MemoryStick, HardDrive, Network } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <AppHeader />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 container max-w-screen-2xl">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <NodeStatusCard
            title="CPU Usage"
            value={nodeStats.cpu}
            icon={<Cpu className="h-4 w-4 text-muted-foreground" />}
            footerText="Total CPU utilization across all nodes"
          />
          <NodeStatusCard
            title="Memory Usage"
            value={nodeStats.memory}
            icon={<MemoryStick className="h-4 w-4 text-muted-foreground" />}
            footerText="Total memory utilization"
          />
          <NodeStatusCard
            title="Disk Usage"
            value={nodeStats.disk}
            icon={<HardDrive className="h-4 w-4 text-muted-foreground" />}
            footerText="Total disk space consumed"
          />
          <NodeStatusCard
            title="Network Traffic"
            value={nodeStats.network}
            icon={<Network className="h-4 w-4 text-muted-foreground" />}
            footerText="Current network throughput"
          />
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight mb-4">Virtual Machines &amp; Containers</h2>
          <VmList initialVms={vms} />
        </div>
      </main>
    </div>
  );
}
