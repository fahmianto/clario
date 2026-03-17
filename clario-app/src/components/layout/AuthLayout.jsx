import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-[#f8fafc]">
      {/* Left Panel - Brand / Information */}
      <div className="hidden md:flex flex-col justify-between bg-primary-900 overflow-hidden relative p-12 lg:p-16 text-white text-opacity-90">
        
        {/* Subtle decorative background shapes */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-primary-800 opacity-50 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-primary-800 opacity-40 blur-3xl"></div>

        <div className="relative z-10 space-y-20">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 backdrop-blur-sm p-2 rounded-lg border border-white/20">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="currentColor"/>
              </svg>
            </div>
            <h1 className="text-2xl font-bold tracking-wide text-white">CLARIO</h1>
          </div>
          
          <div className="space-y-6 max-w-lg">
            <h2 className="text-4xl lg:text-5xl font-light leading-tight text-white">
              Elevate Your <br />
              <span className="font-semibold text-primary-200">Academic Publication</span> Quality.
            </h2>
            <p className="text-primary-200/80 text-lg sm:text-xl font-light leading-relaxed">
              The intelligent pre-submission peer-review platform. Designed to help you publish in reputable journals with confidence and precision.
            </p>
          </div>
        </div>
        
        <div className="relative z-10 text-primary-300 text-sm font-light tracking-wide">
          &copy; {new Date().getFullYear()} CLARIO Academic Platform.<br/>All rights reserved.
        </div>
      </div>

      {/* Right Panel - Form (Outlet) */}
      <div className="flex flex-col justify-center px-6 sm:px-12 lg:px-24 bg-white shadow-[-20px_0_40px_-10px_rgba(0,0,0,0.03)] z-20">
        {/* Mobile Logo */}
        <div className="md:hidden flex items-center gap-2 mb-10">
          <div className="bg-primary-600/10 text-primary-700 p-2 rounded-lg">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="currentColor"/>
              </svg>
          </div>
          <h1 className="text-xl font-bold text-slate-800 tracking-wide">CLARIO</h1>
        </div>
        
        <div className="w-full max-w-sm mx-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
