'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, ArrowLeft, Database, EyeOff, Server, HardDrive, KeyRound } from 'lucide-react';
import { Navbar } from '@/components/common/Navbar';

export default function PrivacyPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen pt-24 pb-28 px-4 sm:px-6 max-w-4xl mx-auto font-sans text-zinc-300">
        {/* Navigation Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-sky-400 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to PulsePilot Home</span>
          </Link>
        </div>

        {/* Title Header */}
        <div className="border-b border-[#1E293B] pb-8 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono mb-3">
            <Lock className="w-3.5 h-3.5" />
            <span>Zero-Knowledge Biometric Covenant</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
            Privacy Policy & Data Sovereignty
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-2 font-mono">
            Zero External Telemetry Egress • 100% On-Device SQLite Enclave • Last Updated: November 24, 2026
          </p>
        </div>

        {/* Highlight Guarantee Box */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-sky-500/10 to-indigo-500/10 border border-emerald-500/30 mb-8 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <ShieldCheck className="w-5 h-5" />
            <span>The 0-Bytes Egress Fundamental Guarantee</span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
            Unlike commercial health trackers (Apple Health, Whoop, Oura, Garmin) that sync heart rate,
            sleep architecture, and stress logs to remote cloud servers, PulsePilot enforces an absolute
            <strong> zero-egress architecture</strong>. Every biometric record, simulated telemetry stream,
            and user password hash is stored exclusively in your local SQLite database on localhost.
          </p>
        </div>

        {/* Policy Sections */}
        <div className="space-y-8 text-sm leading-relaxed">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#101721] border border-[#1E293B] text-emerald-400">
                01
              </span>
              <span>Information Stored in Your Local Vault</span>
            </h2>
            <p>
              When you initialize a biometric profile or run the PulsePilot local services, the following
              data structures are maintained inside <code>pulse_pilot.db</code> on your local disk:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-zinc-400 text-xs sm:text-sm font-mono">
              <li>
                <strong className="text-white">User Profile Data:</strong> Full Name, Email, Target Sleep Hours,
                Focus Goal Hours.
              </li>
              <li>
                <strong className="text-white">Cryptographic Credentials:</strong> Password SHA-256 hash and unique
                16-byte cryptographically secure salt. Raw passwords are never written to disk.
              </li>
              <li>
                <strong className="text-white">Biometric Telemetry Snapshots:</strong> Sleep hours, deep sleep ratio,
                sleep debt deficit, resting heart rate (RHR), baseline RHR, HRV RMSSD, daily screen time, and calendar
                density.
              </li>
              <li>
                <strong className="text-white">Audit & Action Receipts:</strong> Verification receipts of approved
                calendar and email actions, complete with SHA verification hashes.
              </li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#101721] border border-[#1E293B] text-emerald-400">
                02
              </span>
              <span>No Cloud Tracking, No Analytics, No Third-Party SDKs</span>
            </h2>
            <p>
              PulsePilot contains:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 rounded-xl bg-[#0C121D] border border-[#1E293B] flex items-center gap-3">
                <EyeOff className="w-5 h-5 text-rose-400 shrink-0" />
                <span className="text-xs text-zinc-300">Zero Google Analytics or telemetry pixels</span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#0C121D] border border-[#1E293B] flex items-center gap-3">
                <Server className="w-5 h-5 text-rose-400 shrink-0" />
                <span className="text-xs text-zinc-300">Zero external advertising or tracker networks</span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#0C121D] border border-[#1E293B] flex items-center gap-3">
                <HardDrive className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="text-xs text-zinc-300">100% self-hosted on localhost:8000 and localhost:3000</span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#0C121D] border border-[#1E293B] flex items-center gap-3">
                <KeyRound className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="text-xs text-zinc-300">CORS restricted strictly to local client origins</span>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#101721] border border-[#1E293B] text-emerald-400">
                03
              </span>
              <span>Chrome Extension & Shadow DOM Isolation</span>
            </h2>
            <p>
              The PulsePilot Attention Sentinel Chrome Extension (Manifest V3) interacts solely with your local
              FastAPI server (<code>http://127.0.0.1:8000/state</code>). It does not transmit webpage URLs, browsing
              history, search queries, or form inputs to any external server.
            </p>
            <p>
              When Cognitive Load Mode activates, DOM alterations (clutter hiding, margin centering, and the 1.5s
              Hold-to-Confirm button injection) take place exclusively inside the browser runtime memory and an isolated
              Shadow DOM container.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#101721] border border-[#1E293B] text-emerald-400">
                04
              </span>
              <span>Hardware Smartwatch & Sensor Data Isolation</span>
            </h2>
            <p>
              For both simulated streams and future hardware smartwatch integrations (e.g. ESP32 microcontroller,
              MAX30102 optical sensor, WearOS or Bluetooth Low Energy devices), raw optical photoplethysmography (PPG)
              and accelerometer packets communicate directly over local COM ports, USB serial, or Web Bluetooth.
              No intermediate cloud bridge is ever permitted.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#101721] border border-[#1E293B] text-emerald-400">
                05
              </span>
              <span>Complete Data Erasure & Portability</span>
            </h2>
            <p>
              Because your data is housed in a standard SQLite file, you maintain 100% absolute ownership:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-zinc-400 text-xs sm:text-sm">
              <li>To export all records: Copy or inspect <code>pulse_pilot.db</code> using any SQLite viewer.</li>
              <li>To permanently erase all history: Delete the database file or purge specific user rows. No cloud backups or lingering replicas exist.</li>
            </ul>
          </section>
        </div>

        {/* Footer Guarantee */}
        <div className="mt-12 pt-6 border-t border-[#1E293B] flex items-center justify-between text-xs font-mono text-zinc-500">
          <span>PulsePilot Security & Privacy Enclave</span>
          <span className="text-emerald-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Zero-Knowledge Architecture Verified</span>
          </span>
        </div>
      </main>
    </>
  );
}
