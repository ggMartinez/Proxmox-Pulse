'use server';
import { cookies } from 'next/headers';
import fetch from 'node-fetch';
import type { VM, Container } from './mock-data';

type ApiResult<T> = { success: true; data: T } | { success: false; error: string };

async function getApiClient() {
  const cookieStore = cookies();
  const ticket = cookieStore.get('PVEAuthCookie')?.value;
  const csrfToken = cookieStore.get('CSRFPreventionToken')?.value;
  const serverUrl = process.env.PROXMOX_SERVER;
  const node = cookieStore.get('PVENode')?.value;

  if (!ticket || !csrfToken || !serverUrl || !node) {
    return { success: false, error: 'Not authenticated or server not configured.' };
  }

  const headers = {
    'Cookie': `PVEAuthCookie=${ticket}`,
    'CSRFPreventionToken': csrfToken,
    'Content-Type': 'application/json',
  };

  return { success: true, serverUrl, node, headers };
}

export async function getVms(): Promise<ApiResult<VM[]>> {
  const client = await getApiClient();
  if (!client.success) {
    return client;
  }

  try {
    const response = await fetch(`${client.serverUrl}/api2/json/nodes/${client.node}/qemu`, {
      method: 'GET',
      headers: client.headers,
    });

    if (!response.ok) {
       const errorData = await response.json().catch(() => ({}));
      // @ts-ignore
      return { success: false, error: `API Error: ${response.statusText} (${response.status}). ${errorData.message || ''}`.trim() };
    }

    const result: any = await response.json();
    const vms: VM[] = result.data.map((vm: any) => ({
      id: vm.vmid.toString(),
      name: vm.name,
      status: vm.status,
      cpuUsage: Math.round(vm.cpu * 100),
      memoryUsage: Math.round((vm.mem / vm.maxmem) * 100),
      maxCpu: vm.maxcpu,
      maxMemory: Math.round(vm.maxmem / (1024 * 1024 * 1024)), // Convert bytes to GB
    }));

    return { success: true, data: vms };
  } catch (error) {
    console.error('Failed to fetch VMs:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function getContainers(): Promise<ApiResult<Container[]>> {
    const client = await getApiClient();
    if (!client.success) {
        return client;
    }

    try {
        const response = await fetch(`${client.serverUrl}/api2/json/nodes/${client.node}/lxc`, {
            method: 'GET',
            headers: client.headers,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            // @ts-ignore
            return { success: false, error: `API Error: ${response.statusText} (${response.status}). ${errorData.message || ''}`.trim() };
        }

        const result: any = await response.json();
        const containers: Container[] = result.data.map((ct: any) => ({
            id: ct.vmid.toString(),
            name: ct.name,
            status: ct.status,
            cpuUsage: Math.round(ct.cpu * 100),
            memoryUsage: Math.round((ct.mem / ct.maxmem) * 100),
            diskUsage: Math.round((ct.disk / ct.maxdisk) * 100),
        }));
        
        return { success: true, data: containers };

    } catch (error) {
        console.error('Failed to fetch Containers:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}
