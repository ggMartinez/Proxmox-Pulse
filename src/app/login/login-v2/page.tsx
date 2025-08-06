
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Cpu } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { loginAction } from './actions';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function LoginPageV2() {
  const router = useRouter();
  const { login } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState('root');
  const [password, setPassword] = useState('');
  const [realm, setRealm] = useState('pam');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await loginAction({ username, password, realm });

      if (result.success) {
        // In a real app, result.data would contain the auth token and user info
        login(result.data.username, result.data.token);
        toast({ title: 'Login Successful', description: 'Welcome back!' });
        router.push('/virtual-machines');
      } else {
        toast({ title: 'Login Failed', description: result.error, variant: 'destructive' });
        setIsLoading(false);
      }
    } catch (error) {
       toast({ title: 'Login Error', description: 'An unexpected error occurred.', variant: 'destructive' });
       setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex items-center justify-center gap-2 text-3xl font-bold">
          <Cpu className="h-10 w-10 text-primary" />
          <span>Proxmox Pulse</span>
        </div>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Enter your Proxmox server credentials to continue.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin}>
              <div className="grid gap-4">
                 <div className="grid gap-2 text-left">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="root"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div className="grid gap-2 text-left">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                 <div className="grid gap-2 text-left">
                    <Label htmlFor="realm">Realm</Label>
                    <Select value={realm} onValueChange={setRealm} disabled={isLoading}>
                        <SelectTrigger id="realm">
                            <SelectValue placeholder="Select a realm" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="pam">Linux PAM</SelectItem>
                            <SelectItem value="pve">Proxmox VE</SelectItem>
                        </SelectContent>
                    </Select>
                 </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Login
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
