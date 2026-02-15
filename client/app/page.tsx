'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black flex flex-col items-center justify-center p-8">
      {/* Logo */}
      <div className="mb-8 opacity-0 animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
        <img 
          src="/logo.png" 
          alt="RestoTrack Logo" 
          className="h-24 w-auto"
        />
      </div>

      {/* Video Container */}
      <div className="w-full max-w-4xl opacity-0 animate-fade-in" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
        <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-slate-800">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-auto"
          >
            <source src="/landing-video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Developer Credit */}
        <div className="mt-6 text-center">
          <p className="text-slate-400 text-sm font-medium">
            Developed By <span className="text-white font-semibold">Rohit Munamarthi</span>
          </p>
        </div>
      </div>

      {/* CTA Button */}
      <div className="mt-12 opacity-0 animate-fade-in" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
        <Link href="/login">
          <button className="px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold rounded-xl
                           hover:from-green-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all
                           hover:scale-105 active:scale-95">
            Get Started
          </button>
        </Link>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
      `}</style>
    </div>
  );
}
