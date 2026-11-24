import type { Metadata } from 'next';
import { Fraunces, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { SmoothScrollProvider } from '@/components/common/SmoothScroll';
import { CustomCursor } from '@/components/cursor/CustomCursor';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { LivingCircadianBackground } from '@/components/common/LivingCircadianBackground';
import { CircadianAICopilot } from '@/components/ai/CircadianAICopilot';

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'PulsePilot • Circadian Biological Intelligence HUD',
  description:
    'A local-first personal intelligence cockpit. Autonomic state calculation, Model Context Protocol action server with physical approval gating, and proactive in-browser cognitive load augmentation.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${plusJakarta.variable} ${jetbrainsMono.variable}`}
    >
      <body className="font-sans antialiased bg-hud-void text-hud-inkPrimary selection:bg-hud-accent selection:text-hud-void">
        <SmoothScrollProvider>
          {/* Custom living background animations */}
          <LivingCircadianBackground />

          {/* Subtle blueprint grid mask and animated noise grain */}
          <div className="fixed inset-0 pointer-events-none blueprint-grid z-0" />
          <div className="fixed inset-0 pointer-events-none film-grain z-0 opacity-40" />

          {/* Interactive Custom Cursor */}
          <CustomCursor />

          {/* Global Circadian AI Copilot Drawer */}
          <CircadianAICopilot />

          {/* Main Application Frame */}
          <div className="relative z-10 flex flex-col min-h-screen">
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </div>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
