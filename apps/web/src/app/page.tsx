'use client';


export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="text-xl font-bold text-text">Organiza Isso</div>
        
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-text">Welcome to Organiza Isso</h1>
        <p className="mt-4 text-textSecondary">
          This is a protected page. You can only see this if youre authenticated.
        </p>
      </main>
    </div>
  );
}
