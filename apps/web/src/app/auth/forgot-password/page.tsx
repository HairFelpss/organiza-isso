```tsx
'use client';

import { Button } from "@organiza-isso-app/ui/button";
import Link from "next/link";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // TODO: Implement password reset logic
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-full max-w-md p-8 space-y-6 bg-card rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-bold text-text">Check Your Email</h2>
          <p className="text-textSecondary">
            We've sent password reset instructions to {email}
          </p>
          <Link href="/auth/login">
            <Button variant="secondary" size="lg" style={{ width: '100%' }}>
              Return to Login
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-8 space-y-6 bg-card rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-text">Reset Password</h2>
        <p className="text-center text-textSecondary">
          Enter your email address and we'll send you instructions to reset your password.
        </p>
        
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

          <Button variant="primary" size="lg" style={{ width: '100%' }}>
            Send Reset Instructions
          </Button>
        </form>

        <div className="text-sm text-center">
          <Link href="/auth/login" className="text-primary hover:text-primaryDark">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
```