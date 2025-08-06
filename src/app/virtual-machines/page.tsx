import { VmList } from '@/components/app/vm-list';
import { getVms } from '@/lib/proxmox';

export default async function VirtualMachinesPage() {
  const vms = await getVms();
  
  if (!vms.success) {
    return (
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-6">Virtual Machines</h1>
        <div className="p-4 rounded-md border border-destructive/50 bg-destructive/10 text-destructive">
          <p>Failed to load Virtual Machines: {vms.error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-6">Virtual Machines</h1>
      <VmList initialVms={vms.data} />
    </div>
  );
}
