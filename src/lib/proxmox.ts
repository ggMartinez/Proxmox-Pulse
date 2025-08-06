'use server';
import type { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';
import fetch from 'node-fetch';
import type { VM, Container } from './mock-data';

type ApiResult<T> = { success: true; data: T } | { success: false; error: string };

type ApiClient = {
  serverUrl: string;
  node: string;
  headers: {
    Cookie: string;
    CSRFPreventionToken: string;
    'Content-Type': string;
  };
}

function getApiClient(cookies: ReadonlyRequestCookies): ApiResult<ApiClient> {
  const ticket = cookies.get('PVEAuthCookie')?.value;
  const csrfToken = cookies.get('CSRFPreventionToken')?.value;
  const serverUrl = 'https://proxmox.ggmartinez.cloudns.pro';
  const node = cookies.get('PVENode')?.value;

  if (!ticket || !csrfToken || !serverUrl || !node) {
    console.error('getApiClient: Missing auth data in cookies.', {
        hasTicket: !!ticket,
        hasCsrf: !!csrfToken,
        hasNode: !!node
    });
    return { success: false, error: 'Not authenticated or server not configured.' };
  }

  const headers = {
    'Cookie': `PVEAuthCookie=${ticket}`,
    'CSRFPreventionToken': csrfToken,
    'Content-Type': 'application/json',
  };

  return { success: true, data: { serverUrl, node, headers } };
}

export async function getVms(cookies: ReadonlyRequestCookies): Promise<ApiResult<VM[]>> {
  const clientResult = getApiClient(cookies);
  if (!clientResult.success) {
    return clientResult;
  }
  const { serverUrl, node, headers } = clientResult.data;

  try {
    const url = `${serverUrl}/api2/json/nodes/${node}/qemu`;
    const response = await fetch(url, {
      method: 'GET',
      headers: headers,
    });

    if (!response.ok) {
       const errorText = await response.text();
       console.error(`Failed to fetch VMs from ${url}. Status: ${response.status}. Body: ${errorText}`);
       return { success: false, error: `API Error (${response.status}): ${response.statusText}. Check server logs for more details.` };
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
    return { success: false, error: error instanceof Error ? error.message : 'An unknown error occurred while fetching VMs.' };
  }
}

export async function getContainers(cookies: ReadonlyRequestCookies): Promise<ApiResult<Container[]>> {
    const clientResult = getApiClient(cookies);
    if (!clientResult.success) {
        return clientResult;
    }
    const { serverUrl, node, headers } = clientResult.data;

    try {
        const url = `${serverUrl}/api2/json/nodes/${node}/lxc`;
        const response = await fetch(url, {
            method: 'GET',
            headers: headers,
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Failed to fetch Containers from ${url}. Status: ${response.status}. Body: ${errorText}`);
            return { success: false, error: `API Error (${response.status}): ${response.statusText}. Check server logs for more details.` };
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
        return { success: false, error: error instanceof Error ? error.message : 'An unknown error occurred while fetching containers.' };
    }
}
