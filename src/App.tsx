/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef, FormEvent } from "react";
import {
  Sun,
  Mail,
  Phone,
  User,
  Clock,
  Coins,
  TrendingUp,
  Leaf,
  Shield,
  Info,
  Calendar,
  ArrowRight,
  Lock,
  Check,
  Sparkles,
  MapPin,
  Activity,
  FileText,
  ChevronDown,
  Menu,
  X,
  Plus,
  Flame,
  AlertTriangle,
  Award
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// --- Static Metadata For Solar Offerings ---
const SURIA_SCHEME_VALID_FROM = "2026-06-01T00:00:00+08:00"; // 1st June 2026
const SURIA_SCHEME_VALID_TO = "2026-12-31T23:59:59+08:00"; // 31st December 2026

interface CalculationResult {
  capacity: number;
  estCost: number;
  rebate: number;
  finalCost: number;
  monthlySavings: number;
  paybackYears: number;
  panelsCount: number;
  roofSpace: number;
  co2Offset: number; // tons per year
  tierLabel: string;
}

export default function App() {
  // Mobile navigation state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isLaunched: false,
  });

  // Calculator inputs
  const [billAmount, setBillAmount] = useState<number>(250);
  const [isHoveredResult, setIsHoveredResult] = useState<string | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    stateLocation: "Kuala Lumpur",
    propertyType: "Landed Terrace",
    preferredContact: "WhatsApp",
    agreePolicy: false,
    selectedSlotDate: "",
    selectedSlotTime: "Morning (10:00 AM - 1:00 PM)",
  });
  const [formStep, setFormStep] = useState<number>(1);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Active FAQ state
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Live Timer Countdown Logic
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const launchDate = new Date(SURIA_SCHEME_VALID_FROM).getTime();
      const difference = launchDate - now;

      if (difference <= 0) {
        setTimeLeft((prev) => ({ ...prev, isLaunched: true }));
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds, isLaunched: false });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, []);

  // Quick preset handle
  const setPreset = (amount: number) => {
    setBillAmount(amount);
  };

  // Malaysian Tariff Calculation Logic 2026
  const calculation: CalculationResult = useMemo(() => {
    let capacity = 4;
    let estCost = 16000;
    let rebate = 2400; // default for 4kWac (RM600 * 4)
    let finalCost = 13600;
    let monthlySavings = 120;
    let tierLabel = "Tier 1: Starter Saving";

    if (billAmount < 150) {
      capacity = 4;
      estCost = 16000;
      rebate = 2400;
      finalCost = 13600;
      monthlySavings = 120;
      tierLabel = "Tier 1: Comfort Eco";
    } else if (billAmount >= 150 && billAmount <= 300) {
      capacity = 5;
      estCost = 19500;
      rebate = 3000; // Cap at RM3,000 max
      finalCost = 16500;
      monthlySavings = 220;
      tierLabel = "Tier 2: Premium Residential Standard";
    } else if (billAmount >= 301 && billAmount <= 500) {
      capacity = 7;
      estCost = 26000;
      rebate = 3000; // Cap at RM3,000 max
      finalCost = 23000;
      monthlySavings = 380;
      tierLabel = "Tier 3: Executive Smart Power";
    } else {
      // billAmount > 500
      capacity = 10;
      estCost = 36000;
      rebate = 3000; // Cap at RM3,000 max
      finalCost = 33000;
      monthlySavings = 550;
      tierLabel = "Tier 4: Ultimate Energy Independence";
    }

    const paybackYears = Number((finalCost / (monthlySavings * 12)).toFixed(1));
    const panelsCount = Math.round((capacity * 1000) / 550); // Assuming 550W high-efficiency panels
    const roofSpace = capacity * 65; // Approx 65 sq ft per kWac including clearance
    const co2Offset = Number((capacity * 1.25).toFixed(2)); // Approx 1.25 tons of CO2 offset per year per kW in Malaysia grid factor

    return {
      capacity,
      estCost,
      rebate,
      finalCost,
      monthlySavings,
      paybackYears,
      panelsCount,
      roofSpace,
      co2Offset,
      tierLabel,
    };
  }, [billAmount]);

  // Form Submission Simulator
  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.email || !formData.agreePolicy) {
      alert("Please complete all required fields and accept the terms.");
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  const currentYear = new Date().getFullYear();

  const handleSmoothScroll = (targetId: string) => {
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-suria-dark font-sans text-white/90 antialiased selection:bg-suria-gold selection:text-black">
      {/* 1. STICKY NAVIGATION BAR */}
      <nav id="nav-container" className="sticky top-0 z-50 border-b border-white/10 bg-suria-dark/80 shadow-lg backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          {/* Logo Brand Group */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleSmoothScroll("hero")}>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-suria-gold text-black shadow-sm">
              <Sun className="h-6 w-6 stroke-[2.5]" />
            </div>
            <div>
              <span className="font-display text-xl font-bold tracking-tight text-white">
                MySuria<span className="text-suria-gold">Home</span>
              </span>
              <p className="hidden text-[9px] font-mono tracking-widest text-suria-teal sm:block uppercase">Malaysian Solar ATAP</p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => handleSmoothScroll("scheme-deep-dive")}
              className="text-sm font-medium text-slate-400 transition-colors hover:text-white"
            >
              SuRIA Scheme 2026
            </button>
            <button
              onClick={() => handleSmoothScroll("interactive-calculator")}
              className="text-sm font-medium text-slate-400 transition-colors hover:text-white"
            >
              Savings Calculator
            </button>
            <button
              onClick={() => handleSmoothScroll("why-solar")}
              className="text-sm font-medium text-slate-400 transition-colors hover:text-white"
            >
              Why Solar ATAP
            </button>
            <button
              onClick={() => handleSmoothScroll("faqs")}
              className="text-sm font-medium text-slate-400 transition-colors hover:text-white"
            >
              Eligibility & FAQs
            </button>
          </div>

          {/* Floating Action Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleSmoothScroll("site-survey")}
              className="relative hidden items-center justify-center rounded-lg bg-suria-gold px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-black transition-all hover:bg-yellow-500 hover:shadow-lg sm:flex"
            >
              Claim Rebate
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-400 hover:bg-white/10 hover:text-white md:hidden"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-white/10 bg-suria-dark md:hidden"
            >
              <div className="flex flex-col gap-4 px-4 py-6">
                <button
                  onClick={() => handleSmoothScroll("scheme-deep-dive")}
                  className="text-left text-base font-semibold text-slate-300 hover:text-white"
                >
                  SuRIA Scheme 2026
                </button>
                <button
                  onClick={() => handleSmoothScroll("interactive-calculator")}
                  className="text-left text-base font-semibold text-slate-300 hover:text-white"
                >
                  Savings Calculator
                </button>
                <button
                  onClick={() => handleSmoothScroll("why-solar")}
                  className="text-left text-base font-semibold text-slate-300 hover:text-white"
                >
                  Why Solar ATAP
                </button>
                <button
                  onClick={() => handleSmoothScroll("faqs")}
                  className="text-left text-base font-semibold text-slate-300 hover:text-white"
                >
                  Eligibility & FAQs
                </button>
                <button
                  onClick={() => handleSmoothScroll("site-survey")}
                  className="mt-2 w-full rounded-lg bg-suria-gold py-3 text-center text-sm font-bold uppercase tracking-widest text-black hover:bg-yellow-500"
                >
                  Claim RM3,000 Rebate
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* 2. HERO SECTION */}
      <section id="hero" className="relative overflow-hidden bg-gradient-to-b from-suria-dark directly to-suria-darker py-20 text-white md:oy-32 md:py-28">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        
        {/* Decorative ambient orbs */}
        <div className="absolute top-1/4 left-1/4 -z-10 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-suria-teal/5 blur-[130px]"></div>
        <div className="absolute right-10 bottom-10 -z-10 h-[500px] w-[500px] rounded-full bg-suria-gold/5 blur-[150px]"></div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7">
              {/* Urgent Notice Badge */}
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-suria-green/20 border border-suria-green px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-widest text-suria-teal">
                <Flame className="h-4 w-4 animate-pulse stroke-[2.5] text-suria-gold" />
                <span>PETRA Launch Announcement: 22 May 2026</span>
              </div>

              {/* Title & Slogan */}
              <h1 className="font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Harvest the sun, <br />
                <span className="bg-gradient-to-r from-yellow-300 via-suria-gold to-yellow-500 bg-clip-text text-transparent">
                  save more.
                </span>
              </h1>

              {/* Empathetic But Urgent Context */}
              <p className="mt-6 text-lg leading-relaxed text-slate-400">
                In an era highlighted by unpredictable foreign policy conflicts, rising logistical shortages, and escalating global energy index inflation, leaving your home open to traditional grid tariff increments is a financial trap. Malaysia TNB electricity costs are slated for imminent upward adjustment.
              </p>
              <p className="mt-4 text-base text-suria-teal">
                Take shielding action. For 7 months only, Malaysian property owners can claim the new federal government rebate of up to <strong>RM3,000 per individual installation</strong> under PETRA's 2026 breakthrough scheme.
              </p>

              {/* Live Status Summary */}
              <div className="mt-8 grid grid-cols-2 gap-4 border-t border-white/10 pt-8 sm:grid-cols-3">
                <div className="rounded-lg bg-white/5 p-3 border border-white/10">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest block">Available Rebates</span>
                  <p className="font-display text-lg font-bold text-suria-gold font-bold">Up to RM3,000</p>
                </div>
                <div className="rounded-lg bg-white/5 p-3 border border-white/10">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest block">Allocation Quota</span>
                  <p className="font-display text-lg font-bold text-white font-bold">250MW Only</p>
                </div>
                <div className="rounded-lg bg-white/5 p-3 border border-white/10 col-span-2 sm:col-span-1">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest block">Initiative Ends</span>
                  <p className="font-display text-lg font-bold text-suria-teal font-bold">31 Dec 2026</p>
                </div>
              </div>

              {/* Primary Call to Actions */}
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <button
                  onClick={() => handleSmoothScroll("interactive-calculator")}
                  className="group flex items-center justify-center gap-2 rounded-xl bg-suria-gold px-8 py-4 font-bold text-black shadow-md transition-all hover:bg-yellow-500 hover:shadow-yellow-550/20 cursor-pointer"
                >
                  Calculate My Bill Savings
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </button>
                <button
                  onClick={() => handleSmoothScroll("scheme-deep-dive")}
                  className="rounded-xl border border-white/10 bg-white/5 px-6 py-4 text-center font-medium text-slate-300 transition-colors hover:bg-white/10 cursor-pointer"
                >
                  Verify Eligible Schemes
                </button>
              </div>
            </div>

            {/* Right Interactive Sidebar Countdown/Widget Column */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-md">
                {/* Decorative solar overlay flare */}
                <div className="absolute top-0 right-0 h-16 w-16 -translate-y-5 translate-x-5 rounded-full bg-suria-gold/20 blur-xl"></div>

                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <span className="font-display text-sm font-bold tracking-tight text-white uppercase">Application Portal Status</span>
                  <span className="flex items-center gap-1.5 rounded bg-emerald-500/20 px-2 py-0.5 text-xs text-emerald-400">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Portal Active
                  </span>
                </div>

                {/* Live Countdown Clock */}
                <div className="mt-6 text-center">
                  <span className="text-xs text-slate-400 uppercase tracking-wide">SuRIA Scheme Enters Official Operations in:</span>
                  <div className="mt-3 grid grid-cols-4 gap-2">
                    <div className="rounded-xl bg-suria-dark border border-white/5 p-3">
                      <span className="block font-display text-3xl font-bold text-suria-gold">{timeLeft.days}</span>
                      <span className="text-[10px] text-slate-400 uppercase font-medium">Days</span>
                    </div>
                    <div className="rounded-xl bg-suria-dark border border-white/5 p-3">
                      <span className="block font-display text-3xl font-bold text-suria-gold">{timeLeft.hours}</span>
                      <span className="text-[10px] text-slate-400 uppercase font-medium">Hours</span>
                    </div>
                    <div className="rounded-xl bg-suria-dark border border-white/5 p-3">
                      <span className="block font-display text-3xl font-bold text-suria-gold">{timeLeft.minutes}</span>
                      <span className="text-[10px] text-slate-400 uppercase font-medium">Mins</span>
                    </div>
                    <div className="rounded-xl bg-suria-dark border border-white/5 p-3">
                      <span className="block font-display text-3xl font-bold text-suria-gold">{timeLeft.seconds}</span>
                      <span className="text-[10px] text-slate-400 uppercase font-medium">Secs</span>
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-suria-gold italic">First-come, first-served allocation applies!</p>
                </div>

                {/* Pre-launch reservation quota bar */}
                <div className="mt-6 border-t border-white/10 pt-5">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                    <span>Active Allocations Assigned (Landed Residential)</span>
                    <span className="font-semibold text-suria-teal">16% Blocked</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-suria-dark border border-white/5 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-suria-green to-suria-gold" style={{ width: "16%" }}></div>
                  </div>
                  <p className="mt-2 text-[11px] text-slate-400 flex items-center gap-1">
                    <Info className="h-3.5 w-3.5 text-suria-teal inline shrink-0" />
                    <span>Priority application registrations lock in the rebate queue today.</span>
                  </p>
                </div>

                {/* Form quick reference */}
                <button
                  onClick={() => handleSmoothScroll("site-survey")}
                  className="mt-6 w-full rounded-xl bg-suria-green py-3.5 text-center text-sm font-bold text-white transition-colors hover:bg-teal-800 shadow-md cursor-pointer"
                >
                  Pre-Register Active TNB Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SCHEME DEEP DIVE SECTION */}
      <section id="scheme-deep-dive" className="relative bg-suria-dark/40 py-20 sm:py-24 border-b border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center">
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Malaysia National SuRIA Home Solar Scheme
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-lg text-slate-400">
              The Ministry of Energy Transition and Water Transformation (PETRA) announced the breakthrough <strong>SuRIA Home Solar Rebate Initiative</strong> on May 22, 2026. This limited policy aims to offset electricity billing fatigue for active residential consumers.
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            
            {/* Stat 1: Max Quantum */}
            <div className="rounded-2xl bg-white/5 p-6 border border-white/10 hover:border-suria-gold/30 hover:shadow-lg transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-suria-gold/10 text-suria-gold mb-4">
                <Coins className="h-6 w-6 stroke-[2]" />
              </div>
              <h3 className="font-display text-lg font-bold text-white">Up to RM3,000 Max</h3>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                Direct rebate set at <strong>RM600 per kWac</strong> capacity, capping at a maximum RM3,000 cash deduction on equipment installation.
              </p>
            </div>

            {/* Stat 2: Validity */}
            <div className="rounded-2xl bg-white/5 p-6 border border-white/10 hover:border-suria-teal/30 hover:shadow-lg transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-suria-teal/10 text-suria-teal mb-4">
                <Clock className="h-6 w-6 stroke-[2]" />
              </div>
              <h3 className="font-display text-lg font-bold text-white">7-Month Strict Window</h3>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                Legally valid from <strong>1st June 2026 until 31st December 2026</strong>. Applications outside this window will be fully rejected.
              </p>
            </div>

            {/* Stat 3: Total Allocation */}
            <div className="rounded-2xl bg-white/5 p-6 border border-white/10 hover:border-suria-teal/30 hover:shadow-lg transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-suria-teal/10 text-suria-teal mb-4">
                <Award className="h-6 w-6 stroke-[2]" />
              </div>
              <h3 className="font-display text-lg font-bold text-white">250MW Capacity Pool</h3>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                Strict commercial state quota of 250 Megawatts AC. Fast applicant approvals rule. Once the MW pool is drained, the rebate halts immediately.
              </p>
            </div>

            {/* Stat 4: Eligibility Group */}
            <div className="rounded-2xl bg-white/5 p-6 border border-white/10 hover:border-suria-gold/30 hover:shadow-lg transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-suria-gold/10 text-suria-gold mb-4">
                <Shield className="h-6 w-6 stroke-[2]" />
              </div>
              <h3 className="font-display text-lg font-bold text-white">Domestic Low-Voltage</h3>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                Exclusively for Malaysian citizens with active <strong>low-voltage (LV) TNB individual accounts</strong>. Must be landed residential title.
              </p>
            </div>
          </div>

          {/* Detailed Roadmap Checklist Box */}
          <div className="mt-12 overflow-hidden rounded-2xl border border-white/10 bg-white/5 text-white shadow-xl">
            <div className="grid lg:grid-cols-12">
              
              {/* Map Left Side */}
              <div className="p-8 lg:col-span-7 lg:p-12">
                <span className="text-xs font-bold uppercase tracking-wider text-suria-teal">Step-by-Step Mechanism</span>
                <h3 className="mt-2 font-display text-2xl font-bold tracking-tight text-white">
                  How the Government Scheme is Disbursed
                </h3>
                <p className="mt-4 text-slate-300 text-sm">
                  The rebate operates under SEDA and PETRA direct oversight to prevent third-party solar gouging. The process integrates directly with certified Engineering, Procurement, Construction (EPC) dealers.
                </p>

                {/* Timeline Step list */}
                <div className="mt-8 space-y-6">
                  <div className="flex gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-suria-green font-mono text-sm font-bold text-suria-teal">
                      1
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">Pre-qualification Assessment</h4>
                      <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                        We map your TNB bill using Malaysian Solar ATAP standards to evaluate maximum safe physical roof sizing.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-suria-green font-mono text-sm font-bold text-suria-teal">
                      2
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">SEDA Registry Submission</h4>
                      <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                        Approved engineers submit your national identification (MyKad) and TNB coordinates for SuRIA quota booking of the 250MW pool.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-suria-green font-mono text-sm font-bold text-suria-teal">
                      3
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">Direct Ledger Deduction</h4>
                      <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                        The RM2,400 to RM3,000 grant quantum acts as a direct upfront hardware invoice rebate. You pay only the Net estimated Outlay!
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map right eligibility checklist summary */}
              <div className="border-t border-white/10 bg-white/[0.02] p-8 lg:col-span-5 lg:border-t-0 lg:border-l lg:p-12">
                <span className="text-xs font-bold uppercase tracking-wider text-suria-gold">Strict Eligibility Audit</span>
                <h4 className="mt-1 text-lg font-bold text-white">Official Criteria Check</h4>
                <p className="mt-2 text-xs text-slate-400">
                  Verify your account status prior to registering on-site:
                </p>

                {/* Checklist list */}
                <ul className="mt-6 space-y-3">
                  <li className="flex items-start gap-2.5 text-xs text-slate-300">
                    <Check className="h-5 w-5 shrink-0 text-suria-gold stroke-[3.5]" />
                    <span>Malaysian Citizen (Holds active MyKad identification)</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-xs text-slate-300">
                    <Check className="h-5 w-5 shrink-0 text-suria-gold stroke-[3.5]" />
                    <span>Registered owner of an active residential TNB meter</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-xs text-slate-300">
                    <Check className="h-5 w-5 shrink-0 text-suria-gold stroke-[3.5]" />
                    <span>Property type qualifies as landed domestic shelter (Terrace, Sem-D, Bungalow)</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-xs text-slate-300">
                    <Check className="h-5 w-5 shrink-0 text-suria-gold stroke-[3.5]" />
                    <span>Under Low-Voltage (LV) tariff schedule (excluding commercial flats or complexes)</span>
                  </li>
                </ul>

                <div className="mt-8 rounded-xl bg-suria-green/20 border border-white/10 p-4">
                  <p className="text-[11px] text-suria-teal leading-relaxed">
                    🌟 <strong>Consultant Alert:</strong> We help generate and compile SEDA documentation packages for free without additional admin overhead.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. INTERACTIVE ENERGY CALCULATOR SECTION */}
      <section id="interactive-calculator" className="relative bg-suria-dark py-20 sm:py-24 border-b border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-suria-teal bg-suria-green/20 border border-suria-green/45 px-3 py-1.5 rounded-full inline-block">Calculate Your Savings</span>
            <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Solar Return On Investment (ROI) Calculator
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-slate-400">
              Drag the input slider or type your average monthly Tenaga Nasional Berhad (TNB) electricity bill to map recommendations and view government rebates in real-time.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-12 items-start">
            
            {/* Left Box: Bill Inputs & Sliders */}
            <div className="rounded-2xl bg-white/5 p-6 shadow-xl border border-white/10 lg:col-span-5">
              <h3 className="font-display text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Activity className="h-5 w-5 text-suria-teal" />
                Step 1: Input Monthly TNB Bill
              </h3>

              {/* Amount visual display block */}
              <div className="mb-6 relative rounded-2xl bg-suria-darker border border-white/5 p-6 text-white text-center">
                <span className="text-xs uppercase tracking-widest text-slate-450 block text-slate-400">Monthly Average Bill</span>
                <div className="mt-2 flex items-center justify-center gap-1.5">
                  <span className="text-2xl font-semibold text-slate-500">RM</span>
                  <input
                    type="number"
                    value={billAmount}
                    min={50}
                    max={1500}
                    onChange={(e) => {
                      const amount = Number(e.target.value);
                      setBillAmount(amount);
                    }}
                    className="w-48 bg-transparent text-center font-display text-4xl font-extrabold tracking-tight text-suria-gold focus:outline-none focus:ring-0 border-b border-dashed border-white/20 pb-1"
                  />
                </div>
                <p className="mt-2 text-xs text-suria-teal uppercase font-mono tracking-widest font-semibold">{calculation.tierLabel}</p>
              </div>

              {/* Slider Input Row */}
              <div className="space-y-4">
                <div className="flex justify-between text-xs text-slate-400 font-medium font-mono">
                  <span>Min: RM50</span>
                  <span>Max: RM1,500</span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={1500}
                  step={10}
                  value={billAmount}
                  onChange={(e) => setBillAmount(Number(e.target.value))}
                  className="w-full h-2 rounded-lg bg-white/10 appearance-none cursor-pointer accent-suria-gold"
                />
              </div>

              {/* Bill Presets Selector */}
              <div className="mt-8">
                <span className="text-xs font-semibold uppercase text-slate-400 block mb-3">Or choose a common bill preset:</span>
                <div className="grid grid-cols-4 gap-2">
                  {[120, 250, 420, 750].map((preset) => (
                    <button
                      key={preset}
                      onClick={() => setPreset(preset)}
                      className={`rounded-lg py-2 text-center text-xs font-bold border transition-all cursor-pointer ${
                        billAmount === preset
                          ? "bg-suria-gold border-suria-gold text-black shadow-sm"
                          : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"
                      }`}
                    >
                      RM {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Small Energy inflation insight */}
              <div className="mt-8 rounded-xl bg-suria-gold/5 border border-suria-gold/15 p-4">
                <p className="text-xs text-slate-300 leading-relaxed flex gap-2.5">
                  <AlertTriangle className="h-5 w-5 text-suria-gold shrink-0" />
                  <span>
                    <strong>Electricity Inflation warning:</strong> Homes with TNB bills above RM220 sit in highest ICPT tariff bands. Shifting to solar cuts these penalizing surcharge rates immediately.
                  </span>
                </p>
              </div>
            </div>

            {/* Right Box: Dynamic Output Cards */}
            <div className="lg:col-span-7">
              <div className="grid gap-6 sm:grid-cols-2">
                
                {/* Out Card 1: Suggestion Capability */}
                <div
                  onMouseEnter={() => setIsHoveredResult("capacity")}
                  onMouseLeave={() => setIsHoveredResult(null)}
                  className={`rounded-2xl bg-white/5 p-6 border transition-all ${
                    isHoveredResult === "capacity" ? "border-suria-teal shadow-md transform -translate-y-0.5" : "border-white/10 shadow-sm"
                  }`}
                >
                  <span className="text-xs font-bold text-slate-455 text-slate-400 uppercase tracking-widest block">Recommended PV Capacity</span>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="font-display text-4xl font-extrabold text-suria-teal">{calculation.capacity}</span>
                    <span className="text-base font-bold text-slate-400">kWac</span>
                  </div>
                  <div className="mt-4 border-t border-white/5 pt-4 flex justify-between text-xs text-slate-400 font-mono">
                    <span>Est. Panels Required:</span>
                    <span className="font-bold text-white">{calculation.panelsCount} modules</span>
                  </div>
                  <div className="mt-2 flex justify-between text-xs text-slate-400 font-mono">
                    <span>Req. Roof Coverage:</span>
                    <span className="font-bold text-white">~{calculation.roofSpace} sq ft</span>
                  </div>
                </div>

                {/* Out Card 2: Direct Govt Grant */}
                <div
                  onMouseEnter={() => setIsHoveredResult("rebate")}
                  onMouseLeave={() => setIsHoveredResult(null)}
                  className={`rounded-2xl bg-white/5 p-6 border transition-all ${
                    isHoveredResult === "rebate" ? "border-suria-gold shadow-md transform -translate-y-0.5" : "border-white/10 shadow-sm"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-455 text-slate-400 uppercase tracking-widest block">Direct SuRIA Government Rebate</span>
                    <span className="rounded bg-suria-gold/10 px-2 py-0.5 text-[10px] font-bold text-suria-gold uppercase">PETRA ATAP</span>
                  </div>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-xl font-bold text-suria-gold">RM</span>
                    <span className="font-display text-4xl font-extrabold text-suria-gold">{calculation.rebate.toLocaleString()}</span>
                  </div>
                  <div className="mt-4 border-t border-white/5 pt-4 flex justify-between text-xs text-slate-400 font-mono">
                    <span>Rebate Rate:</span>
                    <span className="font-bold text-white font-semibold">RM600 per kWac</span>
                  </div>
                  <div className="mt-2 flex justify-between text-xs text-slate-400 font-mono">
                    <span>Max Grant Quota status:</span>
                    <span className="font-bold text-emerald-400">{calculation.rebate === 3000 ? "Maximum Locked" : "Claimable"}</span>
                  </div>
                </div>

                {/* Out Card 3: Final System Price Outlay */}
                <div
                  onMouseEnter={() => setIsHoveredResult("outlay")}
                  onMouseLeave={() => setIsHoveredResult(null)}
                  className={`rounded-2xl bg-white/5 p-6 border transition-all ${
                    isHoveredResult === "outlay" ? "border-suria-teal shadow-md transform -translate-y-0.5" : "border-white/10 shadow-sm"
                  }`}
                >
                  <span className="text-xs font-bold text-slate-455 text-slate-405 text-slate-400 uppercase tracking-widest block">Net Outlay Estimated Cost</span>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-xl font-bold text-slate-400 font-bold">RM</span>
                    <span className="font-display text-4xl font-extrabold text-white">{calculation.finalCost.toLocaleString()}</span>
                  </div>
                  <div className="mt-4 border-t border-white/5 pt-4 flex justify-between text-xs text-slate-400 font-mono">
                    <span>Gross Retail Value:</span>
                    <span className="line-through text-slate-550 text-slate-500">RM {calculation.estCost.toLocaleString()}</span>
                  </div>
                  <div className="mt-2 flex justify-between text-xs text-slate-400 font-mono">
                    <span>Deduction Savings:</span>
                    <span className="font-bold text-suria-teal">-RM {calculation.rebate.toLocaleString()}</span>
                  </div>
                </div>

                {/* Out Card 4: Project Monthly Bill Cuts */}
                <div
                  onMouseEnter={() => setIsHoveredResult("savings")}
                  onMouseLeave={() => setIsHoveredResult(null)}
                  className={`rounded-2xl bg-white/10 p-6 border transition-all text-white ${
                    isHoveredResult === "savings" ? "ring-2 ring-suria-gold shadow-md transform -translate-y-0.5" : "border-white/20 shadow-sm"
                  }`}
                >
                  <span className="text-xs font-bold text-slate-350 text-slate-300 uppercase tracking-widest block">Projected Monthly Savings</span>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-xl font-bold text-suria-gold">~RM</span>
                    <span className="font-display text-4xl font-extrabold text-suria-gold">{calculation.monthlySavings}</span>
                  </div>
                  <div className="mt-4 border-t border-white/10 pt-4 flex justify-between text-xs text-slate-350 font-mono">
                    <span>Est. Yearly Saving:</span>
                    <span className="font-bold text-white">RM {(calculation.monthlySavings * 12).toLocaleString()}</span>
                  </div>
                  <div className="mt-2 flex justify-between text-xs text-slate-350 font-mono font-bold">
                    <span>Payback Period:</span>
                    <span className="font-bold text-suria-teal font-bold">~{calculation.paybackYears} years</span>
                  </div>
                </div>
              </div>

              {/* Bonus carbon offset box */}
              <div className="mt-6 rounded-2xl bg-suria-green/10 p-5 border border-suria-green/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 flex shrink-0 items-center justify-center rounded-lg bg-suria-green text-suria-teal">
                    <Leaf className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <h4 className="text-sm font-bold text-white">Empathetic Environmental Footprint</h4>
                    <p className="text-xs text-slate-400">Offload systemic fuel burns. Shrink carbon indexes.</p>
                  </div>
                </div>
                <div className="text-right sm:text-right">
                  <span className="text-[10px] uppercase font-semibold text-suria-teal tracking-wider">CO2 Offset Equivalent</span>
                  <p className="font-display text-lg font-extrabold text-suria-gold font-bold">~{calculation.co2Offset} Tons / year</p>
                </div>
              </div>

              {/* Call-to-action button anchored downwards */}
              <div className="mt-6 text-center lg:text-left">
                <p className="text-xs text-slate-500 italic">
                  *Above is a calculation proxy based on 2026 Malaysia TNB tariff curves and typical solar yield coefficients in Southeast Asia.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. LEAD CAPTURE FORM SECTION */}
      <section id="site-survey" className="relative bg-suria-darker py-20 text-white sm:py-24 border-b border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-suria-dark via-suria-darker to-[#000505] opacity-90"></div>
        
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          
          {/* Header context */}
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-suria-gold bg-suria-gold/10 border border-suria-gold/20 px-3 py-1 rounded-full">Secured Allocation Booking</span>
            <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Lock in your RM3,000 SuRIA Rebate
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-slate-400">
              Reserve slot priority for a completely free site survey. Our certified SEDA engineers will model your roof space, assess structural tilt angles, and handle SEDA submission.
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl bg-white/5 text-white shadow-2xl border border-white/10 backdrop-blur-md">
            {/* Step Wizard visual header */}
            <div className="bg-white/[0.02] border-b border-white/10 px-6 py-4 flex justify-between items-center sm:px-10">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest font-mono">
                Step {formStep} of 2: Installation Specifics
              </span>
              <div className="flex gap-1">
                <span className={`h-1.5 w-10 rounded transition-all ${formStep >= 1 ? "bg-suria-gold animate-pulse" : "bg-white/10"}`}></span>
                <span className={`h-1.5 w-10 rounded transition-all ${formStep >= 2 ? "bg-suria-gold animate-pulse" : "bg-white/10"}`}></span>
              </div>
            </div>

            <div className="p-6 sm:p-10">
              
              {/* Form container */}
              {!isSubmitted ? (
                <form onSubmit={handleFormSubmit} className="space-y-6">
                  
                  {/* STEP 1: Solar requirements & properties */}
                  {formStep === 1 && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="space-y-6"
                    >
                      {/* Interactive Selection of estimated recommended capability */}
                      <div className="bg-suria-green/20 border border-suria-green/30 p-4 rounded-xl flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-bold uppercase text-suria-teal block">Pre-evaluated Solution:</span>
                          <span className="font-display text-base font-extrabold text-white">
                            {calculation.capacity} kWac System (Est. RM {calculation.finalCost.toLocaleString()} Net)
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 font-bold block uppercase mb-1">Rebate Value:</span>
                          <span className="text-sm rounded-full bg-suria-gold text-black font-extrabold px-3 py-1">
                            RM {calculation.rebate.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* General Property Inputs */}
                      <div className="grid gap-6 sm:grid-cols-2">
                        
                        {/* Input State Location */}
                        <div>
                          <label htmlFor="stateLocation" className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">
                            Property State location *
                          </label>
                          <select
                            id="stateLocation"
                            value={formData.stateLocation}
                            onChange={(e) => setFormData({ ...formData, stateLocation: e.target.value })}
                            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition-all focus:border-suria-gold focus:bg-suria-darker focus:outline-none"
                          >
                            {["Kuala Lumpur", "Selangor", "Johor", "Penang", "Perak", "Melaka", "Negeri Sembilan", "Kedah", "Pahang"].map((item) => (
                              <option key={item} value={item} className="bg-suria-dark text-white">
                                {item}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Input Property Style */}
                        <div>
                          <label htmlFor="propertyType" className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">
                            Landed Property Type *
                          </label>
                          <select
                            id="propertyType"
                            value={formData.propertyType}
                            onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition-all focus:border-suria-gold focus:bg-suria-darker focus:outline-none"
                          >
                            {["Landed Terrace", "Semi-Detached Home", "Bungalow / Villa", "Townhouse"].map((item) => (
                              <option key={item} value={item} className="bg-suria-dark text-white">
                                {item}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Calendar Site Survey Schedule Date */}
                        <div>
                          <label htmlFor="selectedSlotDate" className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">
                            Preferred Site Survey Date *
                          </label>
                          <input
                            type="date"
                            id="selectedSlotDate"
                            required
                            min="2026-05-24"
                            max="2026-12-31"
                            value={formData.selectedSlotDate}
                            onChange={(e) => setFormData({ ...formData, selectedSlotDate: e.target.value })}
                            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition-all focus:border-suria-gold focus:bg-suria-darker focus:outline-none"
                          />
                        </div>

                        {/* Schedule Time Slot */}
                        <div>
                          <label htmlFor="selectedSlotTime" className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">
                            Preferred Time Slot *
                          </label>
                          <select
                            id="selectedSlotTime"
                            value={formData.selectedSlotTime}
                            onChange={(e) => setFormData({ ...formData, selectedSlotTime: e.target.value })}
                            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition-all focus:border-suria-gold focus:bg-suria-darker focus:outline-none"
                          >
                            <option className="bg-suria-dark text-white">Morning (10:00 AM - 1:00 PM)</option>
                            <option className="bg-suria-dark text-white">Afternoon (1:00 PM - 4:00 PM)</option>
                            <option className="bg-suria-dark text-white">Late Afternoon (4:00 PM - 7:00 PM)</option>
                          </select>
                        </div>
                      </div>

                      {/* Next button widget */}
                      <div className="flex justify-end pt-4">
                        <button
                          type="button"
                          onClick={() => {
                            if (!formData.selectedSlotDate) {
                              alert("Please select a target Site Survey Date first.");
                              return;
                            }
                            setFormStep(2);
                          }}
                          className="flex items-center gap-2 rounded-xl bg-suria-gold border border-suria-gold hover:opacity-90 px-6 py-3.5 text-sm font-extrabold text-black transition-all shadow-md cursor-pointer"
                        >
                          Continue to Contact Info
                          <ArrowRight className="h-4 w-4 stroke-[2.5]" />
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 2: Personal Contact Information */}
                  {formStep === 2 && (
                    <motion.div
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="space-y-6"
                    >
                      <div className="grid gap-6 sm:grid-cols-2">
                        {/* Name Input */}
                        <div>
                          <label htmlFor="fullName" className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">
                            Full Name * (as in MyKad/TNB Bill)
                          </label>
                          <div className="relative">
                            <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                            <input
                              type="text"
                              id="fullName"
                              required
                              placeholder="Lee Wei Ming"
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-12 pr-4 text-sm font-semibold text-white focus:border-suria-gold focus:bg-suria-darker focus:outline-none"
                            />
                          </div>
                        </div>

                        {/* Mobile Number Input */}
                        <div>
                          <label htmlFor="phoneNumber" className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">
                            Contact Phone (WhatsApp support) *
                          </label>
                          <div className="relative">
                            <Phone className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                            <input
                              type="tel"
                              id="phoneNumber"
                              required
                              placeholder="+60 12-345 6789"
                              value={formData.phone}
                              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                              className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-12 pr-4 text-sm font-semibold text-white focus:border-suria-gold focus:bg-suria-darker focus:outline-none"
                            />
                          </div>
                        </div>

                        {/* Email Input */}
                        <div className="sm:col-span-2">
                          <label htmlFor="emailAddress" className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">
                            Email Address * (For official SEDA projection sheets)
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                            <input
                              type="email"
                              id="emailAddress"
                              required
                              placeholder="weiming.lee@gmail.com"
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-12 pr-4 text-sm font-semibold text-white focus:border-suria-gold focus:bg-suria-darker focus:outline-none"
                            />
                          </div>
                        </div>

                        {/* Contact Channel Preferment */}
                        <div className="sm:col-span-2">
                          <span className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">
                            Preferred Contact Method
                          </span>
                          <div className="grid grid-cols-3 gap-3">
                            {["WhatsApp", "Phone Call", "Email Address"].map((channel) => (
                              <button
                                key={channel}
                                type="button"
                                onClick={() => setFormData({ ...formData, preferredContact: channel })}
                                className={`rounded-xl py-3 text-center text-xs font-bold border transition-all cursor-pointer ${
                                  formData.preferredContact === channel
                                    ? "bg-suria-gold border-suria-gold text-black shadow-sm"
                                    : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"
                                }`}
                              >
                                {channel}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Policy Agreement Toggles */}
                      <div className="pt-2">
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.agreePolicy}
                            required
                            onChange={(e) => setFormData({ ...formData, agreePolicy: e.target.checked })}
                            className="mt-1 h-4 w-4 shrink-0 rounded border-white/20 text-suria-gold focus:ring-suria-teal bg-white/5 cursor-pointer"
                          />
                          <span className="text-xs text-slate-400 leading-relaxed">
                            I authorize MySuriaHome to pre-screen my status coordinates against SEDA and TNB databases. I understand details are strictly guarded in alignment with the Malaysia Personal Data Protection Act (PDPA) 2010.
                          </span>
                        </label>
                      </div>

                      {/* Sticky CTA line with Lock badge */}
                      <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <button
                          type="button"
                          onClick={() => setFormStep(1)}
                          className="text-xs font-bold text-slate-400 hover:text-suria-gold underline order-2 sm:order-1 cursor-pointer"
                        >
                          Back to Installation Specifics
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-suria-gold px-8 py-4 font-bold text-black border border-suria-gold transition-all hover:opacity-90 shadow-md order-1 sm:order-2 disabled:opacity-50 cursor-pointer"
                        >
                          {isSubmitting ? (
                            "Verifying Quota..."
                          ) : (
                            <>
                              Submit Rebate Registration
                              <Sparkles className="h-4.5 w-4.5 text-black animate-pulse" />
                            </>
                          )}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </form>
              ) : (
                /* GORGEOUS SUCCESS BOARD */
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="py-12 text-center"
                >
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-suria-green/30 text-suria-teal border border-suria-teal/50 mb-6">
                    <Check className="h-8 w-8 stroke-[3.5]" />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-white">
                    Application successfully registered!
                  </h3>
                  <p className="mx-auto mt-4 max-w-lg text-sm text-slate-300 leading-relaxed">
                    Thank you <strong>{formData.name}</strong>. We have allocated a priority slot for your property on <strong>{formData.selectedSlotDate}</strong> ({formData.selectedSlotTime})!
                  </p>
                  <p className="mx-auto mt-2 max-w-lg text-xs font-mono text-suria-gold bg-suria-gold/10 py-1.5 px-3 rounded-lg border border-suria-gold/20 inline-block font-bold">
                    Rebate Reference: MSH-2026-{Math.floor(100000 + Math.random() * 900000)}
                  </p>

                  <div className="mt-8 border-t border-white/10 pt-8 max-w-md mx-auto text-left space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-suria-teal font-mono">What Happens Next?</h4>
                    <ul className="space-y-2 text-xs text-slate-300">
                      <li className="flex gap-2">
                        <span className="font-bold text-white">1. Verification:</span> Our SEDA consultant reviews your location via GIS roof solar density mappings within 2 hours.
                      </li>
                      <li className="flex gap-2">
                        <span className="font-bold text-white">2. Document check:</span> Under SEDA rules, we'll reach out on <strong>{formData.preferredContact}</strong> ({formData.phone}) to request a PDF or photo snapshot of your TNB bill to verify correct transformer voltage scheduling.
                      </li>
                      <li className="flex gap-2">
                        <span className="font-bold text-white">3. Proposal Draft:</span> An engineer will draft custom AutoCAD layout configurations representing exact module structures for free.
                      </li>
                    </ul>
                  </div>

                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormStep(1);
                      setFormData({
                        name: "",
                        phone: "",
                        email: "",
                        stateLocation: "Kuala Lumpur",
                        propertyType: "Landed Terrace",
                        preferredContact: "WhatsApp",
                        agreePolicy: false,
                        selectedSlotDate: "",
                        selectedSlotTime: "Morning (10:00 AM - 1:00 PM)",
                      });
                    }}
                    className="mt-10 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-slate-300 hover:text-suria-gold hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    Submit another Assessment
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 6. WHY SOLAR VALUE PROP SECTION */}
      <section id="why-solar" className="relative bg-suria-dark py-20 sm:py-24 border-b border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Main layout: left titles, right layout grid */}
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            
            {/* Title column */}
            <div className="lg:col-span-5">
              <span className="text-xs font-bold uppercase tracking-widest text-suria-teal bg-suria-green/20 border border-suria-green/45 px-3 py-1.5 rounded-full inline-block">Macro Shield Focus</span>
              <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Shield Yourself From Constant Utility Surcharges
              </h2>
              <p className="mt-6 text-slate-400 leading-relaxed">
                As global fossil indices remain sensitive and erratic, importing fuel to run public grids means consumers bear the brunt of rising electricity costs.
              </p>
              <p className="mt-4 text-slate-400 leading-relaxed">
                Solar isn't just about saving green indexes anymore; it is active <strong>financial protection</strong>. An investment into independent power generation removes your exposure to future policy tariff escalation.
              </p>

              {/* Verified independent support block */}
              <div className="mt-8 flex gap-4 items-center bg-white/5 p-4 rounded-2xl border border-white/10">
                <Shield className="h-10 w-10 text-suria-gold shrink-0 animate-pulse" />
                <div>
                  <h4 className="text-sm font-bold text-white">Compliant Aligned SEDA Partners</h4>
                  <p className="text-xs text-slate-400">Every engineer in our network carries active SEDA and Energy Commission certification.</p>
                </div>
              </div>
            </div>

            {/* Value grid column */}
            <div className="lg:col-span-7 grid gap-6 sm:grid-cols-2">
              
              {/* Asset 1 */}
              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:border-suria-teal/30 hover:shadow-lg transition-all">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-suria-teal/10 text-suria-teal mb-4">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <h3 className="font-display text-base font-bold text-white">Hedge Inflation Spikes</h3>
                <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                  Malaysia's upcoming utility structural updates sit under active review. Locking in a solar system today locks in fixed generation costs for the next 25 years.
                </p>
              </div>

              {/* Asset 2 */}
              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:border-suria-teal/30 hover:shadow-lg transition-all">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-suria-gold/10 text-suria-gold mb-4">
                  <Coins className="h-5 w-5" />
                </div>
                <h3 className="font-display text-base font-bold text-white">Real Property Appreciation</h3>
                <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                  Multiple real estate index surveys indicate homes equipped with active solar setups register standard market premium increases of 5% - 8% over regular properties.
                </p>
              </div>

              {/* Asset 3 */}
              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:border-suria-teal/30 hover:shadow-lg transition-all">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-suria-teal/10 text-suria-teal mb-4">
                  <Clock className="h-5 w-5" />
                </div>
                <h3 className="font-display text-base font-bold text-white">Immediate ROI</h3>
                <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                  Rather than paying back after decades, solar begins offsetting billing columns the very millisecond the TNB smart meter finishes installation.
                </p>
              </div>

              {/* Asset 4 */}
              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:border-suria-teal/30 hover:shadow-lg transition-all">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-suria-gold/10 text-suria-gold mb-4">
                  <Sparkles className="h-5 w-5" />
                </div>
                <h3 className="font-display text-base font-bold text-white">Zero-Down Funding Available</h3>
                <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                  Leverage bank partner solar loans starting at 0% interest with monthly payments lower than what you'd save on your electric bill.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FAQS SECTION */}
      <section id="faqs" className="relative bg-suria-darker/60 py-20 sm:py-24 border-b border-white/5">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-suria-teal bg-suria-green/20 border border-suria-green/45 px-3 py-1.5 rounded-full inline-block">Learn Details First</span>
            <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-white">
              Understanding the SuRIA Rebate 2026
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-400">
              Find fast answers below regarding SEDA, TNB NEM matching, and policy specifics for home setups.
            </p>
          </div>

          {/* Accordion Questions container */}
          <div className="space-y-4 bg-white/5 p-6 rounded-2xl border border-white/10 shadow-xl backdrop-blur-md">
            {[
              {
                q: "What is PETRA and the SuRIA Home Solar Scheme?",
                a: "The Ministry of Energy Transition and Water Transformation (PETRA) launched the SuRIA Scheme on May 22, 2026, under Malaysia's Solar ATAP policy. It aims to accelerate roof solar adoption for landed residential owners and provides a RM600 per kWac direct rebate up to RM3,000 to applicants registration from 1st June 2026 to 31st December 2026.",
              },
              {
                q: "Is MySuriaHome the actual government portal?",
                a: "No. MySuriaHome is an independent, expert residential solar consulting platform built to guide Malaysian homeowners. We are not a public SEDA agency. We handle AutoCAD models, coordinate physical survey feasibility, and align applicants with certified EPC contractors who apply the RM3,000 discount directly onto retail hardware invoices.",
              },
              {
                q: "How does the Net Energy Metering (NEM) scheme integrate?",
                a: "The SuRIA rebate runs hand-in-hand with the TNB NEM Rakyat program. Any solar power generated that is not consumed in your home is automatically exported back to the TNB grid. You receive full 1:1 RM billing credits displayed directly in your myTNB application.",
              },
              {
                q: "Who is officially eligible for the SuRIA rebate?",
                a: "The rebate belongs strictly to Malaysian citizens possessing a valid MyKad and registered as active, low-voltage (LV) domestic individual consumers with Tenaga Nasional Berhad. Commercial properties, offices, apartments, condominiums, or non-citizens are fully barred from validation.",
              },
              {
                q: "Does the rebate count if I apply list entries past December 2026?",
                a: "No. The official policy window published by PETRA states the discount initiative ends strictly on 31st December 2026. Furthermore, because total funding is limited to a 250MW pool, allocations are distributed on a firm first-come, first-served schedule. Secure pre-qualification early is highly encouraged.",
              },
            ].map((faq, idx) => (
              <div key={idx} className="border-b border-white/5 last:border-b-0 pb-4 last:pb-0 pt-4 first:pt-0">
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="flex w-full items-center justify-between font-display text-left font-semibold text-white hover:text-suria-gold focus:outline-none cursor-pointer"
                >
                  <span className="text-sm sm:text-base">{faq.q}</span>
                  <ChevronDown className={`h-5 w-5 shrink-0 text-slate-400 transition-transform ${openFaq === idx ? "rotate-180 text-suria-gold" : ""}`} />
                </button>
                <AnimatePresence initial={false}>
                  {openFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed bg-white/[0.02] p-3.5 rounded-lg border border-white/5">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 8. FOOTER & DISCLAIMER SECTION */}
      <footer className="bg-[#010908]/90 text-slate-400 border-t border-white/5">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          
          <div className="grid gap-8 border-b border-white/5 pb-8 sm:grid-cols-2 lg:grid-cols-4">
            
            {/* Logo column */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded bg-suria-teal text-[#010b0a]">
                  <Sun className="h-5 w-5 fill-[#010b0a] stroke-[2.5]" />
                </div>
                <span className="font-display text-lg font-bold text-white tracking-tight">
                  MySuria<span className="text-suria-gold">Home</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-mono">
                "Harvest the sun, save more" <br />
                Protecting Malaysian landed residential properties against skyrocketing grid indices in 2026.
              </p>
            </div>

            {/* Links scheme */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Policies & Schemes</h4>
              <ul className="space-y-2 text-xs font-mono">
                <li>
                  <a href="#scheme-deep-dive" className="hover:text-suria-gold transition-colors">SuRIA Home Solar Grant</a>
                </li>
                <li>
                  <a href="#interactive-calculator" className="hover:text-suria-gold transition-colors">TNB Tariff Schedules 2026</a>
                </li>
                <li>
                  <span className="text-slate-500">NEM Rakyat Allocation (SEDA)</span>
                </li>
              </ul>
            </div>

            {/* Contact info column */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Connect Support</h4>
              <ul className="space-y-2 text-xs font-mono">
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-suria-teal shrink-0" />
                  <a href="mailto:support@mysuriahome.com" className="hover:text-suria-gold transition-colors">support@mysuriahome.com</a>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-suria-teal shrink-0" />
                  <span>+60 3-8000 2026</span>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-suria-teal shrink-0" />
                  <span>Kuala Lumpur, Malaysia</span>
                </li>
              </ul>
            </div>

            {/* Official resources */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Official Entities links</h4>
              <ul className="space-y-2 text-xs font-mono">
                <li>
                  <a href="https://www.seda.gov.mya" target="_blank" rel="noreferrer" className="hover:text-suria-gold transition-colors flex items-center gap-1">
                    SEDA Malaysia website
                  </a>
                </li>
                <li>
                  <a href="https://www.tnb.com.my" target="_blank" rel="noreferrer" className="hover:text-suria-gold transition-colors flex items-center gap-1">
                    Tenaga Nasional Berhad
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Legal Disclaimers & Copyright */}
          <div className="mt-8 flex flex-col gap-6 text-xs text-slate-555 text-slate-500 sm:flex-row sm:justify-between items-start">
            <div className="max-w-3xl space-y-2 leading-relaxed">
              <p>
                <strong>MySuriaHome Independent Solar Consultation Disclaimer:</strong>
                <br />
                `www.mysuriahome.com` is hosted by professional, independent solar consultants assisting consumer alignments. We are not representing, owned by, nor connected directly as an authorized arm of SEDA Malaysia (Sustainable Energy Development Authority), PETRA (Ministry of Energy Transition and Water Transformation), or Tenaga Nasional Berhad (TNB).
              </p>
              <p>
                All calculations shown on `www.mysuriahome.com` represent estimated projections modeled on active 2026 Malaysian standard residential low-voltage profiles, solar azimuth yield factors, and general EPC material costs. Physical output parameters vary based on actual household direction index, structural shade factors, and TNB meter inspection results.
              </p>
              <p>
                &copy; {currentYear} MySuriaHome. All corporate trademarks mentioned in this page (TNB, PETRA, SuRIA, SEDA, MyKad) are legal properties of their corresponding official governmental or enterprise owners.
              </p>
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
}
