
'use server';

import { z } from 'zod';
import fetch from 'node-fetch';
import { cookies } from 'next/headers';


const loginSchema = z.object({
  username: z.string().min(1, { message: 'Username is required.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
  realm: z.enum(['pam', 'pve']),
});

type LoginResult = 
  | { success: true; data: { username: string } }
  | { success: false; error: string };

export async function loginAction(credentials: unknown): Promise<LoginResult> {
  const parsed = loginSchema.safeParse(credentials);

  if (!parsed.success) {
    return { success: false, error: parsed.error.errors.map(e => e.message).join(', ') };
  }

  const { username, password, realm } = parsed.data;
  const fullUsername = `${username}@${realm}`;
  const serverUrl = 'https://proxmox.ggmartinez.cloudns.pro';

  try {
    const response = await fetch(`${serverUrl}/api2/json/access/ticket`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `username=${encodeURIComponent(fullUsername)}&password=${encodeURIComponent(password)}`,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      // @ts-ignore
      return { success: false, error: `Authentication failed: ${response.statusText} ${errorData.message || ''}`.trim() };
    }

    const responseData: any = await response.json();
    const data = responseData.data;
    
    if (!data || !data.ticket || !data.CSRFPreventionToken || !data.clustername) {
        console.error('Invalid response from Proxmox API:', responseData);
        return { success: false, error: 'Invalid response from Proxmox API. Missing token, CSRF token, or cluster name.' };
    }
    
    const ticket = data.ticket;
    const csrfToken = data.CSRFPreventionToken;
    const node = data.clustername;

    const cookieStore = cookies();
    // Set cookies for session management
    cookieStore.set('PVEAuthCookie', ticket, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'lax',
    });
    cookieStore.set('CSRFPreventionToken', csrfToken, {
        httpOnly: false, // Must be readable by client-side JS for API calls
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'lax',
    });
     cookieStore.set('PVEUser', fullUsername, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'lax',
    });
    cookieStore.set('PVENode', node, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'lax',
    });

    return { success: true, data: { username: fullUsername } };

  } catch (error) {
    console.error('Proxmox API request failed:', error);
    if (error instanceof Error) {
        if (error.message.includes('ECONNREFUSED')) {
            return { success: false, error: 'Connection refused. Check the server URL and ensure the Proxmox API is accessible.' };
        }
        if (error.message.includes('invalid json response body')) {
             return { success: false, error: 'Invalid response from server. Check the server URL.' };
        }
        return { success: false, error: `An unexpected network error occurred: ${error.message}` };
    }
    return { success: false, error: 'An unknown error occurred during login.' };
  }
}

export async function logoutAction() {
    const cookieStore = cookies();
    cookieStore.delete('PVEAuthCookie');
    cookieStore.delete('CSRFPreventionToken');
    cookieStore.delete('PVEUser');
    cookieStore.delete('PVENode');
}

export async function checkAuthStatus() {
    const cookieStore = cookies();
    const userCookie = cookieStore.get('PVEUser');
    const isAuthenticated = !!userCookie;
    const user = isAuthenticated ? { username: userCookie.value } : null;
    return { isAuthenticated, user };
}
