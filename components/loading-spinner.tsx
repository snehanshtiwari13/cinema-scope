"use client";

export function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      {/* Spinner container */}
      <div className="relative">
        {/* Outer ring */}
        <div className="h-16 w-16 rounded-full border-4 border-muted" />
        
        {/* Spinning ring */}
        <div className="absolute left-0 top-0 h-16 w-16 animate-spin rounded-full border-4 border-transparent border-t-primary" />
        
        {/* Inner glow */}
        <div className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-sm" />
      </div>
      
      <p className="mt-6 text-base text-muted-foreground animate-pulse">
        Searching movies...
      </p>
    </div>
  );
}
