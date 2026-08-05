"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { GraduationCap, BarChart3, Brain, Target, TrendingUp, Users, FileCheck, ArrowRight, LayoutDashboard } from "lucide-react"

const LEDGER_ROWS = [
  { code: "MATH 301", title: "Linear Algebra", units: 4, grade: "A" },
  { code: "PHYS 214", title: "Thermodynamics", units: 3, grade: "A-" },
  { code: "CSCI 220", title: "Data Structures", units: 4, grade: "A" },
  { code: "ECON 101", title: "Microeconomics", units: 3, grade: "B+" },
]

const FEATURES = [
  {
    tag: "ANLY",
    icon: BarChart3,
    title: "Smart analytics",
    body: "Every semester plotted against the last, so a slipping grade shows up before it becomes a pattern.",
  },
  {
    tag: "ADVR",
    icon: Brain,
    title: "AI academic advisor",
    body: "Ask what a B+ in Organic Chemistry does to your CGPA, and get a straight answer with a study plan attached.",
  },
  {
    tag: "GOAL",
    icon: Target,
    title: "Target CGPA planner",
    body: "Set the class of degree you're aiming for. We work backward to the grades each remaining course needs.",
  },
  {
    tag: "TRND",
    icon: TrendingUp,
    title: "Weak-spot detection",
    body: "Courses ranked by grade point, worst first, so you know exactly where the next study session should go.",
  },
  {
    tag: "ADMN",
    icon: Users,
    title: "Admin dashboard",
    body: "Department-wide CGPA distributions, cohort trends, and probation flags — built for registrars, not just students.",
  },
  {
    tag: "REC",
    icon: FileCheck,
    title: "Result management",
    body: "Enter results once. Get automatic grade-point conversion, credit totals, and a transcript-ready PDF.",
  },
]

function useReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReduced(mq.matches)
    const handler = () => setReduced(mq.matches)
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [])
  return reduced
}

function LedgerWidget() {
  const reducedMotion = useReducedMotion()
  const [visibleRows, setVisibleRows] = useState(reducedMotion ? LEDGER_ROWS.length : 0)
  const [gpa, setGpa] = useState(reducedMotion ? 3.82 : 0)

  useEffect(() => {
    if (reducedMotion) {
      setVisibleRows(LEDGER_ROWS.length)
      setGpa(3.82)
      return
    }
    let row = 0
    const rowTimer = setInterval(() => {
      row += 1
      setVisibleRows(row)
      if (row >= LEDGER_ROWS.length) {
        clearInterval(rowTimer)
        const target = 3.82
        let current = 0
        const gpaTimer = setInterval(() => {
          current += target / 24
          if (current >= target) {
            current = target
            clearInterval(gpaTimer)
          }
          setGpa(current)
        }, 25)
      }
    }, 350)
    return () => clearInterval(rowTimer)
  }, [reducedMotion])

  return (
    <div className="relative rounded-sm bg-[#ECEFEA] text-[#0E1626] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.55)] rotate-[-1.2deg] p-6 sm:p-8 w-full max-w-md mx-auto">
      <div className="absolute -top-3 -right-3 h-14 w-14 rounded-full border-2 border-[#C7A03D] flex items-center justify-center rotate-12 bg-[#ECEFEA]">
        <span className="text-[7px] font-mono tracking-widest text-[#B23430] font-bold leading-tight text-center">
          VERIFIED
          <br />
          RECORD
        </span>
      </div>
      <p className="font-mono text-[10px] tracking-[0.25em] text-zinc-500 uppercase mb-1">
        Semester Transcript
      </p>
      <div className="h-px bg-[#0E1626]/15 mb-3" />
      <div className="space-y-2 mb-4 min-h-[168px]">
        {LEDGER_ROWS.map((row, i) => (
          <div
            key={row.code}
            className={`flex items-center justify-between font-mono text-xs sm:text-[13px] transition-opacity duration-500 ${
              i < visibleRows ? "opacity-100" : "opacity-0"
            }`}
          >
            <span className="text-[#0E1626]/50 w-[68px] shrink-0">{row.code}</span>
            <span className="flex-1 text-[#0E1626] truncate px-2">{row.title}</span>
            <span className="text-[#0E1626]/50 w-8 text-right">{row.units}cr</span>
            <span className="w-8 text-right font-semibold text-[#B23430]">{row.grade}</span>
          </div>
        ))}
      </div>
      <div className="h-px bg-[#0E1626]/15 mb-3" />
      <div className="flex items-end justify-between">
        <span className="font-mono text-[10px] tracking-[0.25em] text-zinc-500 uppercase">
          Cumulative GPA
        </span>
        <span className="font-serif text-3xl font-bold tabular-nums">{gpa.toFixed(2)}</span>
      </div>
    </div>
  )
}

export default function HomePage() {
  const { data: session, status } = useSession()
  
  return (
    <div className="min-h-screen bg-[#0E1626] text-[#F1EEE4] font-body">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;0,9..144,900;1,9..144,500&family=IBM+Plex+Mono:wght@400;500;600&family=Inter:wght@400;500;600&display=swap');
        .font-serif { font-family: 'Fraunces', ui-serif, Georgia, serif; }
        .font-mono { font-family: 'IBM Plex Mono', ui-monospace, monospace; }
        .font-body { font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation-duration: 0.001ms !important; transition-duration: 0.001ms !important; }
        }
      `}</style>

      {/* Navigation */}
      <nav className="border-b border-white/10 bg-[#0E1626]/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-full border border-[#C7A03D]/70 flex items-center justify-center">
              <GraduationCap className="h-4 w-4 text-[#C7A03D]" />
            </div>
            <span className="font-serif text-lg font-semibold tracking-tight">CGPA AI</span>
          </div>
          <div className="flex items-center gap-3">
            {status === "loading" ? (
              <div className="h-9 w-24 bg-white/10 animate-pulse rounded-sm" />
            ) : session ? (
              <Link href="/dashboard">
                <Button className="bg-[#C7A03D] text-[#0E1626] hover:bg-[#dab24f] font-semibold rounded-sm">
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/auth/signin">
                  <Button variant="ghost" className="text-[#F1EEE4] hover:bg-white/10 hover:text-[#F1EEE4]">
                    Sign in
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button className="bg-[#C7A03D] text-[#0E1626] hover:bg-[#dab24f] font-semibold rounded-sm">
                    Get started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="container mx-auto px-4 pt-16 pb-24 md:pt-24 md:pb-32">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 mb-6">
              <span className="h-px w-8 bg-[#C7A03D]" />
              <span className="font-mono text-xs tracking-[0.25em] text-[#C7A03D] uppercase">
                Official Performance Record
              </span>
            </div>
            <h1 className="font-serif text-5xl md:text-6xl font-semibold tracking-tight leading-[1.05] mb-6">
              Every course.
              <br />
              Every grade point.
              <br />
              <span className="italic font-medium text-[#C7A03D]">One accurate record.</span>
            </h1>
            <p className="text-lg text-[#B7BFD4] max-w-md mb-8 leading-relaxed">
              CGPA AI turns raw results into a live transcript. GPA calculated the moment you
              enter a grade, insight generated the moment a trend appears.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              {session ? (
                <Link href="/dashboard">
                  <Button
                    size="lg"
                    className="bg-[#C7A03D] text-[#0E1626] hover:bg-[#dab24f] font-semibold rounded-sm px-7"
                  >
                    <LayoutDashboard className="h-5 w-5 mr-2" />
                    Go to Dashboard
                  </Button>
                </Link>
              ) : (
                <Link href="/auth/signup">
                  <Button
                    size="lg"
                    className="bg-[#C7A03D] text-[#0E1626] hover:bg-[#dab24f] font-semibold rounded-sm px-7"
                  >
                    Start tracking — free
                  </Button>
                </Link>
              )}
              <Link href="/about" className="group inline-flex items-center gap-2 text-sm font-medium text-[#F1EEE4]">
                See how it works
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
          <LedgerWidget />
        </div>
      </section>

      {/* Features — ledger list */}
      <section className="border-t border-white/10">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-lg mb-12">
            <span className="font-mono text-xs tracking-[0.25em] text-[#C7A03D] uppercase">
              What's inside
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-semibold mt-3 mb-3">
              The full record, not just the number
            </h2>
            <p className="text-[#B7BFD4]">
              A CGPA is one line on a page. Here's everything that sits behind it.
            </p>
          </div>

          <div className="border-t border-white/10">
            {FEATURES.map((feature) => (
              <div
                key={feature.tag}
                className="group grid grid-cols-[auto_1fr_auto] sm:grid-cols-[100px_auto_1fr_auto] items-center gap-4 sm:gap-6 py-6 border-b border-white/10 transition-colors hover:bg-white/[0.03] px-2 -mx-2"
              >
                <span className="hidden sm:block font-mono text-xs tracking-[0.2em] text-[#5C6A8C]">
                  {feature.tag}
                </span>
                <feature.icon className="h-5 w-5 text-[#C7A03D] shrink-0" />
                <div>
                  <h3 className="font-serif text-lg font-semibold mb-1 inline-block relative">
                    {feature.title}
                    <span className="absolute left-0 -bottom-0.5 h-[2px] w-0 bg-[#B23430] transition-all duration-300 group-hover:w-full" />
                  </h3>
                  <p className="text-sm text-[#B7BFD4] leading-relaxed max-w-md">{feature.body}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-[#5C6A8C] transition-all opacity-0 group-hover:opacity-100 group-hover:translate-x-1 justify-self-end" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="border-t border-b border-[#C7A03D]/30 bg-[#0B1220]">
        <div className="container mx-auto px-4 py-20 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-semibold mb-4 max-w-xl mx-auto">
            Your next transcript starts with this semester.
          </h2>
          <p className="text-[#B7BFD4] mb-8 max-w-md mx-auto">
            Enter your results once. GPA, trend, and class of degree update themselves from there.
          </p>
          {session ? (
            <Link href="/dashboard">
              <Button
                size="lg"
                className="bg-[#C7A03D] text-[#0E1626] hover:bg-[#dab24f] font-semibold rounded-sm px-8"
              >
                <LayoutDashboard className="h-5 w-5 mr-2" />
                Go to Dashboard
              </Button>
            </Link>
          ) : (
            <Link href="/auth/signup">
              <Button
                size="lg"
                className="bg-[#C7A03D] text-[#0E1626] hover:bg-[#dab24f] font-semibold rounded-sm px-8"
              >
                Create your free account
              </Button>
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2.5">
              <div className="h-6 w-6 rounded-full border border-[#C7A03D]/70 flex items-center justify-center">
                <GraduationCap className="h-3 w-3 text-[#C7A03D]" />
              </div>
              <span className="font-serif text-sm font-semibold">CGPA AI</span>
            </div>
            <p className="font-mono text-xs tracking-wide text-[#5C6A8C]">
              © 2026 CGPA AI — Academic Performance Records
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}