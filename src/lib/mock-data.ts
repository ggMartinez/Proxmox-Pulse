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
