'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function HomePage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const features = [
    {
      icon: '📊',
      title: 'Real-time Analytics',
      description: 'Track orders, revenue, and performance metrics in real-time with powerful dashboards.',
    },
    {
      icon: '🍽️',
      title: 'Smart Ordering',
      description: 'Streamline order management from kitchen to table with intelligent routing.',
    },
    {
      icon: '👥',
      title: 'Team Management',
      description: 'Manage staff roles, schedules, and permissions with granular control.',
    },
    {
      icon: '💳',
      title: 'Integrated Payments',
      description: 'Accept payments seamlessly with built-in POS and invoice generation.',
    },
    {
      icon: '📱',
      title: 'Mobile Ready',
      description: 'Access your restaurant from anywhere with responsive mobile design.',
    },
    {
      icon: '🔒',
      title: 'Enterprise Security',
      description: 'Bank-level security with encrypted data and role-based access control.',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Restaurant Owner',
      company: 'The Modern Kitchen',
      quote: 'RestoTrack transformed how we operate. Order accuracy improved by 97% and our staff loves the intuitive interface.',
    },
    {
      name: 'Michael Rodriguez',
      role: 'Head Chef',
      company: 'Culinary Arts Bistro',
      quote: 'The kitchen management system is a game-changer. We reduced preparation time by 40% and eliminated order confusion.',
    },
    {
      name: 'Emily Watson',
      role: 'Operations Manager',
      company: 'Harbor View Restaurant',
      quote: 'Real-time analytics helped us optimize our menu and increase revenue by 35% in just three months.',
    },
  ];

  return (
    <>
      {/* Global Cinematic Background */}
      <div className="fixed inset-0 -z-10 bg-[#0a0a0a]">
        {/* Radial gradient spotlight */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(40,40,40,0.4)_0%,transparent_60%)]" />
        
        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,rgba(0,0,0,0.8)_100%)]" />
        
        {/* Noise texture */}
        <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay"
             style={{
               backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='3.5' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
             }}
        />
        
        {/* Subtle moving light */}
        <motion.div
          className="absolute w-[800px] h-[800px] rounded-full opacity-20 blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(34,197,94,0.15) 0%, transparent 70%)',
            left: mousePosition.x - 400,
            top: mousePosition.y - 400,
          }}
          transition={{ type: 'spring', damping: 50, stiffness: 100 }}
        />
      </div>

      {/* Glass Navbar */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.6, 0.05, 0.1, 0.9] }}
        className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 backdrop-blur-xl bg-black/20"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="RestoTrack" className="h-8 w-auto" />
            <span className="text-white font-bold text-xl">RestaurantOS</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">Features</a>
            <a href="#testimonials" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">Testimonials</a>
            <Link href="/login">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all shadow-lg shadow-green-600/20"
              >
                Sign In
              </motion.button>
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-20">
        <div className="max-w-7xl mx-auto w-full">
          <motion.div
            style={{ opacity }}
            className="text-center space-y-8"
          >
            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.6, 0.05, 0.1, 0.9] }}
              className="space-y-4"
            >
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-white tracking-tight leading-[1.1]"
                  style={{ letterSpacing: '-0.03em' }}>
                Restaurant<br />
                Management<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600">
                  Reimagined
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
                The all-in-one platform that helps restaurants operate smarter,
                serve faster, and grow revenue.
              </p>
            </motion.div>

            {/* Video Section */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: [0.6, 0.05, 0.1, 0.9] }}
              className="relative max-w-5xl mx-auto"
            >
              {/* Glow effect behind video */}
              <div className="absolute -inset-4 bg-gradient-to-r from-green-600/20 to-green-600/20 blur-3xl opacity-50" />
              
              <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-auto"
                >
                  <source src="/landing-video.mp4" type="video/mp4" />
                </video>
              </div>
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6, ease: [0.6, 0.05, 0.1, 0.9] }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link href="/login">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(34,197,94,0.3)' }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative px-8 py-4 bg-green-600 text-white rounded-xl font-semibold text-lg overflow-hidden shadow-xl shadow-green-600/20"
                >
                  <span className="relative z-10">Get Started Free</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-700 opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.button>
              </Link>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 border-2 border-white/20 text-white rounded-xl font-semibold text-lg hover:border-white/40 hover:bg-white/5 transition-all"
              >
                Watch Demo
              </motion.button>
            </motion.div>

            {/* Developer Credit */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="pt-8"
            >
              <p className="text-gray-500 text-sm font-medium">
                Developed By <span className="text-white font-semibold">Rohit Munamarthi</span>
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-6 h-10 border-2 border-white/20 rounded-full flex items-start justify-center p-2"
          >
            <motion.div className="w-1.5 h-3 bg-white/40 rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6" style={{ letterSpacing: '-0.02em' }}>
              Everything you need
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Powerful features designed for modern restaurants
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="group relative p-8 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10 transition-all cursor-pointer"
              >
                {/* Subtle glow on hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-green-600/0 to-green-600/0 group-hover:from-green-600/5 group-hover:to-transparent transition-all" />
                
                <div className="relative">
                  <div className="text-5xl mb-6">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="relative py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6" style={{ letterSpacing: '-0.02em' }}>
              Trusted by restaurants
            </h2>
            <p className="text-xl text-gray-400">
              See what our customers are saying
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="relative p-8 rounded-2xl border border-white/5 bg-white/[0.02] hover:border-white/10 transition-all"
              >
                <div className="mb-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-green-500 text-xl">★</span>
                    ))}
                  </div>
                  <p className="text-gray-300 text-lg leading-relaxed italic">
                    "{testimonial.quote}"
                  </p>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-600 to-green-700 flex items-center justify-center text-white font-bold text-lg">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-white">{testimonial.name}</div>
                    <div className="text-sm text-gray-400">{testimonial.role}</div>
                    <div className="text-sm text-gray-500">{testimonial.company}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <h2 className="text-5xl md:text-6xl font-bold text-white leading-tight" style={{ letterSpacing: '-0.02em' }}>
              Ready to transform<br />your restaurant?
            </h2>
            
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Join hundreds of restaurants already using RestaurantOS
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/login">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(34,197,94,0.3)' }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-lg shadow-2xl shadow-green-600/20 transition-all"
                >
                  Start Free Trial
                </motion.button>
              </Link>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-5 border-2 border-white/20 text-white rounded-xl font-bold text-lg hover:border-white/40 hover:bg-white/5 transition-all"
              >
                Schedule Demo
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/5 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="RestoTrack" className="h-8 w-auto" />
              <span className="text-white font-bold">RestaurantOS</span>
            </div>
            
            <div className="flex gap-8 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-white/5 text-center text-sm text-gray-500">
            <p>© 2026 RestaurantOS. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
