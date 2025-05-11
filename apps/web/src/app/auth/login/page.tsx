```tsx
'use client';

import { Button } from "@organiza-isso-app/ui/button";
import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement login logic
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-8 space-y-6 bg-card rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-text">Login</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-textSecondary">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border-inputBorder bg-input p-2"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-textSecondary">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-inputBorder bg-input p-2"
              required
            />
          </div>

          <Button variant="primary" size="lg" style={{ width: '100%' }}>
            Sign In
          </Button>
        </form>

        <div className="text-sm text-center space-y-2">
          <Link href="/auth/forgot-password" className="text-primary hover:text-primaryDark">
            Forgot password?
          </Link>
          <div className="text-textSecondary">
            Don't have an account?{' '}
            <Link href="/auth/register" className="text-primary hover:text-primaryDark">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
```