'use server';

import { z } from 'zod';

const loginSchema = z.object({
  // serverUrl is now handled by an environment variable
  username: z.string().min(1, { message: 'Username is required.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
  realm: z.enum(['pam', 'pve']),
});

type LoginResult = 
  | { success: true; data: { username: string; token: string, csrfToken: string } }
  | { success: false; error: string };

export async function loginAction(credentials: unknown): Promise<LoginResult> {
  const parsed = loginSchema.safeParse(credentials);

  if (!parsed.success) {
    return { success: false, error: parsed.error.errors.map(e => e.message).join(', ') };
  }

  const { username, password, realm } = parsed.data;
  const fullUsername = `${username}@${realm}`;

  // Read server URL from environment variable
  const serverUrl = process.env.PROXMOX_SERVER;

  if (!serverUrl) {
      return { success: false, error: 'PROXMOX_SERVER environment variable is not set.' };
  }

  try {
    //
    // IMPORTANT: This is where you would make the actual API call to your Proxmox server.
    // The following code is a simulation.
    //
    // Example using fetch:
    /*
    const response = await fetch(`${serverUrl}/api2/json/access/ticket`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `username=${encodeURIComponent(fullUsername)}&password=${encodeURIComponent(password)}`,
      // In production, you might need to handle self-signed certificates.
      // For Node.js environments, this might involve using an agent with `rejectUnauthorized: false`.
      // This is not recommended for production use.
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { success: false, error: `Authentication failed: ${response.statusText} ${errorData.message || ''}`.trim() };
    }

    const data = await response.json();
    const token = data.data.ticket;
    const csrfToken = data.data.CSRFPreventionToken;
    
    // You would typically store the ticket and CSRF token in a secure HttpOnly cookie
    // or another secure server-side session mechanism.
    
    return { success: true, data: { username, token, csrfToken } };
    */
    
    // Simulating a successful API call for demonstration purposes
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (username && password) {
        return { success: true, data: { username: fullUsername, token: 'fake-proxmox-ticket', csrfToken: 'fake-csrf-token' } };
    } else {
        return { success: false, error: 'Invalid credentials provided.' };
    }

  } catch (error) {
    console.error('Proxmox API request failed:', error);
    if (error instanceof Error) {
        // Network errors or other exceptions
        if (error.message.includes('ECONNREFUSED')) {
            return { success: false, error: 'Connection refused. Check the server URL and ensure the Proxmox API is accessible.' };
        }
        return { success: false, error: `An unexpected network error occurred: ${error.message}` };
    }
    return { success: false, error: 'An unknown error occurred during login.' };
  }
}