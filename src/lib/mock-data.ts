export type VM = {
  id: string;
  name: string;
  status: 'running' | 'stopped';
  cpuUsage: number;
  memoryUsage: number;
  maxCpu: number;
  maxMemory: number; // in GB
};

export const vms: VM[] = [
  { id: '100', name: 'ubuntu-lts-webserver', status: 'running', cpuUsage: 25, memoryUsage: 50, maxCpu: 4, maxMemory: 8 },
  { id: '101', name: 'win11-dev-machine', status: 'stopped', cpuUsage: 0, memoryUsage: 0, maxCpu: 8, maxMemory: 16 },
  { id: '102', name: 'docker-host', status: 'running', cpuUsage: 60, memoryUsage: 75, maxCpu: 6, maxMemory: 12 },
  { id: '103', name: 'home-assistant-vm', status: 'running', cpuUsage: 15, memoryUsage: 40, maxCpu: 2, maxMemory: 4 },
  { id: '104', name: 'pfsense-router', status: 'running', cpuUsage: 5, memoryUsage: 20, maxCpu: 1, maxMemory: 2 },
  { id: '105', name: 'plex-media-server', status: 'stopped', cpuUsage: 0, memoryUsage: 0, maxCpu: 4, maxMemory: 8 },
];

export type Container = {
    id: string;
    name: string;
    status: 'running' | 'stopped';
    cpuUsage: number;
    memoryUsage: number;
    diskUsage: number;
}

export const containers: Container[] = [
    { id: '201', name: 'nginx-proxy', status: 'running', cpuUsage: 5, memoryUsage: 10, diskUsage: 30 },
    { id: '202', name: 'pi-hole', status: 'running', cpuUsage: 2, memoryUsage: 15, diskUsage: 25 },
    { id: '203', name: 'unifi-controller', status: 'stopped', cpuUsage: 0, memoryUsage: 0, diskUsage: 50 },
];

export type Storage = {
    id: string;
    name: string;
    type: 'LVM-Thin' | 'Directory' | 'ZFS';
    usage: number;
}

export const storages: Storage[] = [
    { id: 'local-lvm', name: 'local-lvm', type: 'LVM-Thin', usage: 75 },
    { id: 'local-zfs', name: 'local-zfs', type: 'ZFS', usage: 45 },
    { id: 'backups', name: 'backups', type: 'Directory', usage: 90 },
]

export type NodeStats = {
  cpu: number;
  memory: number;
  disk: number;
  network: number;
};

export const nodeStats: NodeStats = {
  cpu: 45,
  memory: 65,
  disk: 80,
  network: 22,
};
