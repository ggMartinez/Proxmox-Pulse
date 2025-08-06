import { VmList } from '@/components/app/vm-list';
import { vms } from '@/lib/mock-data';

export default function VirtualMachinesPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-6">Virtual Machines</h1>
      <VmList initialVms={vms} />
    </div>
  );
}
