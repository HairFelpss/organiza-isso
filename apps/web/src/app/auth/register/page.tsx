```tsx
'use client';

import { Button } from "@organiza-isso-app/ui/button";
import Link from "next/link";
import { useState } from "react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    document: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement registration logic
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.id]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-card rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-text">Create Account</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-textSecondary">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-inputBorder bg-input p-2"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-textSecondary">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-inputBorder bg-input p-2"
              required
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-textSecondary">
              Phone
            </label>
            <input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-inputBorder bg-input p-2"
              required
            />
          </div>

          <div>
            <label htmlFor="document" className="block text-sm font-medium text-textSecondary">
              Document (CPF/CNPJ)
            </label>
            <input
              id="document"
              type="text"
              value={formData.document}
              onChange={handleChange}
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
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-inputBorder bg-input p-2"
              required
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-textSecondary">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-inputBorder bg-input p-2"
              required
            />
          </div>

          <Button variant="primary" size="lg" style={{ width: '100%' }}>
            Create Account
          </Button>
        </form>

        <div className="text-sm text-center text-textSecondary">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-primary hover:text-primaryDark">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
```