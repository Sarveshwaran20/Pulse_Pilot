'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  Cpu,
  Bluetooth,
  Usb,
  Sliders,
  CheckCircle2,
  Clock,
  Zap,
  Layers,
  ArrowRight,
  Code
} from 'lucide-react';
import { useAppStore } from '@/lib/store';

export function HardwarePPGLab() {
  const { biometrics } = useAppStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [hardwareMode, setHardwareMode] = useState<'SIMULATED' | 'ESP32_SERIAL' | 'SMARTWATCH_BLE'>('SIMULATED');
  const [injectedNoise, setInjectedNoise] = useState(15);
  const [pulseRate, setPulseRate] = useState(biometrics.restingHr || 72);
  const [lastIBI, setLastIBI] = useState(820);
  const [activeWavelength, setActiveWavelength] = useState<'GREEN' | 'INFRARED'>('GREEN');
  const [showCodeGuide, setShowCodeGuide] = useState(false);

  // Sync pulse rate with biometrics
  useEffect(() => {
    if (biometrics.restingHr) {
      setPulseRate(biometrics.restingHr);
    }
  }, [biometrics.restingHr]);

  // Real-time PPG Waveform Oscilloscope Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let t = 0;
    const points: number[] = [];
    const maxPoints = 280;

    const render = () => {
      t += 0.055;
      const width = (canvas.width = canvas.parentElement?.clientWidth || 600);
      const height = (canvas.height = 160);

      // Heartbeat frequency derived from pulseRate
      const freq = (pulseRate / 60) * 1.8;

      // Realistic PPG curve: Systolic peak + dicrotic notch
      const baseWave =
        Math.sin(t * freq) * 0.5 +
        Math.pow(Math.max(0, Math.sin(t * freq)), 4) * 0.6 +
        Math.sin(t * freq * 2.2 + 0.8) * 0.18;

      // Noise and sensor artifact injection
      const noise = (Math.random() - 0.5) * (injectedNoise / 100) * 0.4;
      const sample = baseWave + noise;

      points.push(sample);
      if (points.length > maxPoints) points.shift();

      ctx.clearRect(0, 0, width, height);

      // Grid Lines
      ctx.strokeStyle = 'rgba(30, 41, 59, 0.4)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw PPG Trace
      const waveColor =
        activeWavelength === 'GREEN'
          ? 'rgb(16, 185, 129)' // 525nm Green LED absorption
          : 'rgb(244, 63, 94)'; // 880nm Infrared LED absorption

      ctx.beginPath();
      ctx.strokeStyle = waveColor;
      ctx.lineWidth = 2.2;
      ctx.shadowColor = waveColor;
      ctx.shadowBlur = 8;

      const step = width / (maxPoints - 1);
      const midY = height * 0.55;
      const amp = height * 0.32;

      for (let i = 0; i < points.length; i++) {
        const x = i * step;
        const y = midY - points[i] * amp;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Draw glowing scanning needle at current tip
      if (points.length > 0) {
        const lastX = (points.length - 1) * step;
        const lastY = midY - points[points.length - 1] * amp;
        ctx.fillStyle = '#FFFFFF';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(lastX, lastY, 4, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    // Periodic IBI jitter calculation
    const ibiTimer = setInterval(() => {
      const calculatedIBI = Math.round(60000 / pulseRate + (Math.random() - 0.5) * 28);
      setLastIBI(calculatedIBI);
    }, 1200);

    return () => {
      cancelAnimationFrame(animId);
      clearInterval(ibiTimer);
    };
  }, [pulseRate, injectedNoise, activeWavelength]);

  return (
    <div className="rounded-2xl bg-[#090E17] border border-[#1E293B] p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden backdrop-blur-xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1A2536]">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-mono tracking-widest text-emerald-400 uppercase font-semibold">
              Hardware Bridge & Telemetry Ingest Lab
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
            Optical PPG Oscilloscope & Smartwatch Interface
          </h3>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Currently running on high-fidelity mathematical cardiac simulation. Ready to bridge directly to
            a physical ESP32 optical pulse sensor or an old WearOS/BLE smartwatch with zero cloud dependencies.
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-[#05080E] rounded-xl border border-[#1A2536] text-xs font-mono">
          <button
            onClick={() => setHardwareMode('SIMULATED')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              hardwareMode === 'SIMULATED'
                ? 'bg-[#142032] text-sky-400 border border-sky-500/30 font-semibold shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Simulated</span>
          </button>
          <button
            onClick={() => setHardwareMode('ESP32_SERIAL')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              hardwareMode === 'ESP32_SERIAL'
                ? 'bg-[#142032] text-emerald-400 border border-emerald-500/30 font-semibold shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Usb className="w-3.5 h-3.5" />
            <span>ESP32 USB</span>
          </button>
          <button
            onClick={() => setHardwareMode('SMARTWATCH_BLE')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              hardwareMode === 'SMARTWATCH_BLE'
                ? 'bg-[#142032] text-indigo-400 border border-indigo-500/30 font-semibold shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Bluetooth className="w-3.5 h-3.5" />
            <span>Smartwatch BLE</span>
          </button>
        </div>
      </div>

      {/* Live Oscilloscope Waveform Display */}
      <div className="rounded-xl bg-[#05080E] border border-[#172233] p-4 relative">
        <div className="flex items-center justify-between pb-3 text-xs font-mono text-zinc-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-white font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>RAW PHOTOPLETHYSMOGRAM (PPG) TRACE</span>
            </span>
            <span>•</span>
            <span>Wavelength:</span>
            <button
              onClick={() => setActiveWavelength('GREEN')}
              className={`px-2 py-0.5 rounded text-[10px] cursor-pointer ${
                activeWavelength === 'GREEN'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              525nm Green (Capillary)
            </button>
            <button
              onClick={() => setActiveWavelength('INFRARED')}
              className={`px-2 py-0.5 rounded text-[10px] cursor-pointer ${
                activeWavelength === 'INFRARED'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              880nm IR (Arterial SpO2)
            </button>
          </div>

          <div className="flex items-center gap-4 text-zinc-400">
            <span>IBI: <strong className="text-sky-400">{lastIBI} ms</strong></span>
            <span>HRV RMSSD: <strong className="text-white">{biometrics.hrvRmssd} ms</strong></span>
            <span>Sample Rate: <strong className="text-emerald-400">100 Hz</strong></span>
          </div>
        </div>

        {/* Canvas Screen */}
        <canvas ref={canvasRef} className="w-full h-40 block rounded-lg" />
      </div>

      {/* Control Sliders & Telemetry Ingest Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Heart Rate Modulation */}
        <div className="p-4 rounded-xl bg-[#0B111D] border border-[#1E293B] space-y-2">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-zinc-400">Cardiac Frequency</span>
            <span className="text-white font-bold">{pulseRate} bpm</span>
          </div>
          <input
            type="range"
            min={45}
            max={140}
            value={pulseRate}
            onChange={(e) => setPulseRate(parseInt(e.target.value))}
            className="w-full accent-sky-400 cursor-pointer"
          />
          <span className="text-[10px] text-zinc-500 block">
            Controls harmonic cardiac rhythm & R-R interval spacing
          </span>
        </div>

        {/* Sensor Noise & Movement Artifacts */}
        <div className="p-4 rounded-xl bg-[#0B111D] border border-[#1E293B] space-y-2">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-zinc-400">Sensor Noise & Artifacts</span>
            <span className="text-amber-400 font-bold">{injectedNoise}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={60}
            value={injectedNoise}
            onChange={(e) => setInjectedNoise(parseInt(e.target.value))}
            className="w-full accent-amber-400 cursor-pointer"
          />
          <span className="text-[10px] text-zinc-500 block">
            Simulates arm motion, poor skin contact, and vascular drift
          </span>
        </div>

        {/* Hardware Status / Pairing Action */}
        <div className="p-4 rounded-xl bg-[#0B111D] border border-[#1E293B] flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase text-zinc-500 block">
              PHYSICAL HARDWARE INGEST
            </span>
            <p className="text-xs font-semibold text-white mt-0.5">
              {hardwareMode === 'SIMULATED'
                ? 'Autonomous Simulation (Active)'
                : hardwareMode === 'ESP32_SERIAL'
                ? 'USB COM Port (ttyUSB0 Ready)'
                : 'Bluetooth GATT Heart Rate (0x180D)'}
            </p>
          </div>

          <button
            onClick={() => setShowCodeGuide(!showCodeGuide)}
            className="mt-2 text-left text-xs font-mono text-sky-400 hover:text-sky-300 flex items-center gap-1.5 cursor-pointer"
          >
            <Code className="w-3.5 h-3.5" />
            <span>{showCodeGuide ? 'Hide ESP32 Firmware Guide' : 'View ESP32 and Smartwatch Ingest Guide'}</span>
          </button>
        </div>
      </div>

      {/* Hardware Guide Drawer */}
      {showCodeGuide && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="p-5 rounded-xl bg-[#05080E] border border-[#1E293B] space-y-3 text-xs font-mono text-zinc-300"
        >
          <div className="flex items-center justify-between border-b border-[#1A2536] pb-2">
            <span className="text-sky-400 font-bold">
              ESP32 + MAX30102 4-Pin Hardware Hookup & Local Ingest
            </span>
            <span className="text-zinc-500">Baud: 115200</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px]">
            <div>
              <strong className="text-white block mb-1">Wiring Diagram:</strong>
              <p className="text-zinc-400">
                • VCC ➔ ESP32 3.3V Pin<br />
                • GND ➔ ESP32 GND Pin<br />
                • SDA ➔ ESP32 GPIO21 (I2C Data)<br />
                • SCL ➔ ESP32 GPIO22 (I2C Clock)
              </p>
            </div>
            <div>
              <strong className="text-white block mb-1">Local Ingest Endpoint:</strong>
              <p className="text-zinc-400">
                POST http://127.0.0.1:8000/telemetry/ingest<br />
                Payload: <code>{JSON.stringify({ resting_hr: 72, hrv_rmssd: 34, raw_ppg: [812, 815] })}</code>
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
