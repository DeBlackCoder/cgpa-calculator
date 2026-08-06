"use client"

import { useSession } from "next-auth/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calculator, TrendingUp, Target, Award, ChevronRight, BarChart3, Calendar, FileCheck, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 }
}

export default function HomePage() {
  const { data: session, status } = useSession()

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">

      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50"
      >
        <div className="container mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <Calculator className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
            </motion.div>
            <span className="text-lg sm:text-xl font-bold text-gray-900">CGPA AI</span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            {status === "loading" ? (
              <div className="h-8 sm:h-9 w-20 sm:w-24 bg-gray-100 animate-pulse rounded-lg" />
            ) : session ? (
              <Link href="/dashboard">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="sm" className="h-8 sm:h-10 text-xs sm:text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                    Dashboard
                  </Button>
                </motion.div>
              </Link>
            ) : (
              <>
                <Link href="/auth/signin">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button size="sm" variant="ghost" className="h-8 sm:h-10 text-xs sm:text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                      Sign in
                    </Button>
                  </motion.div>
                </Link>
                <Link href="/auth/signup">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button size="sm" className="h-8 sm:h-10 text-xs sm:text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                      Get started
                    </Button>
                  </motion.div>
                </Link>
              </>
            )}
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="min-h-[calc(100vh-4rem)] flex items-center relative py-16 sm:py-20 md:py-24 text-gray-900 overflow-hidden">
        {/* Rectangular gradient background with diagonal split */}
        <div className="absolute inset-y-12 inset-x-4 sm:inset-x-8 md:inset-x-12 lg:inset-x-16 rounded-3xl overflow-hidden">
          {/* Bottom left side - Indigo */}
          <div className="absolute inset-0 bg-indigo-100" />
          
          {/* Top right side - Cyan with diagonal edge */}
          <div 
            className="absolute inset-0 bg-cyan-100"
            style={{
              clipPath: 'polygon(15% 100%, 80% 0%, 100% 0%, 100% 100%, 0% 100%)'
            }}
          />
        </div>
        
        {/* Floating tabs/cards */}
        <motion.div
          animate={{ 
            y: [0, -15, 0],
            rotate: [0, 2, 0]
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 right-10 bg-white rounded-xl shadow-lg p-4 border border-gray-100 hidden xl:block"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
              <Award className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600">Classification</p>
              <p className="text-sm font-bold text-gray-900">First Class</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          animate={{ 
            y: [0, 20, 0],
            rotate: [0, -3, 0]
          }}
          transition={{ 
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-32 left-10 bg-white rounded-xl shadow-lg p-4 border border-gray-100 hidden xl:block"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Calculator className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600">CGPA</p>
              <p className="text-sm font-bold text-gray-900">4.75 / 5.0</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          animate={{ 
            y: [0, -10, 0],
            x: [0, 5, 0]
          }}
          transition={{ 
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/3 right-20 bg-white rounded-xl shadow-lg p-3 border border-gray-100 hidden 2xl:block"
        >
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600">Trend</p>
              <p className="text-xs font-bold text-green-600">+0.25 ↑</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          animate={{ 
            y: [0, 12, 0],
            rotate: [0, 1, 0]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-20 right-1/4 bg-white rounded-xl shadow-lg p-3 border border-gray-100 hidden 2xl:block"
        >
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-orange-100 flex items-center justify-center">
              <Target className="h-4 w-4 text-orange-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600">Target</p>
              <p className="text-xs font-bold text-gray-900">4.50</p>
            </div>
          </div>
        </motion.div>
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-10 sm:gap-12 items-center">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 mb-6 sm:mb-8"
            >
              <span className="h-px w-6 sm:w-8 bg-blue-600" />
              <span className="font-mono text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.25em] text-blue-600 uppercase">
                Free for every student
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-serif text-4xl sm:text-5xl md:text-6xl font-semibold leading-[1.08] sm:leading-[1.05] tracking-tight mb-6 sm:mb-8"
            >
              Track every semester,
              <br />
              <span className="italic font-medium bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                hit your target CGPA
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg text-gray-600 mb-8 sm:mb-10 leading-relaxed"
            >
              Calculate your CGPA, track performance trends, get AI predictions, and plan the grades
              you need — all in one place.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-3 mb-10 sm:mb-14"
            >
              {session ? (
                <Link href="/dashboard" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-blue-600 text-white hover:bg-blue-700 font-semibold rounded-lg px-8 h-12 sm:h-14 shadow-lg shadow-blue-600/20"
                  >
                    Go to dashboard
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/auth/signup" className="w-full sm:w-auto">
                    <Button
                      size="lg"
                      className="w-full sm:w-auto bg-blue-600 text-white hover:bg-blue-700 font-semibold rounded-lg px-8 h-12 sm:h-14 shadow-lg shadow-blue-600/20"
                    >
                      Get started free
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="/auth/signin" className="w-full sm:w-auto">
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full sm:w-auto border-2 border-gray-200 bg-white text-gray-900 hover:bg-gray-50 rounded-lg px-8 h-12 sm:h-14"
                    >
                      Sign in
                    </Button>
                  </Link>
                </>
              )}
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex items-center gap-6 sm:gap-10 pt-7 border-t border-gray-200"
            >
              {[
                { value: "5.0", label: "Grading scale" },
                { value: "100+", label: "Departments" },
                { value: "Free", label: "Forever" },
              ].map((stat, i) => (
                <div key={stat.label} className={i > 0 ? "pl-6 sm:pl-10 border-l border-gray-200" : ""}>
                  <div className="font-serif text-xl sm:text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="font-mono text-[10px] sm:text-xs tracking-wide text-gray-500 uppercase mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:block relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-100">
              <div className="bg-gradient-to-br from-blue-50 to-white p-8 space-y-6">
                {/* Mock CGPA Card */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                  <p className="text-sm text-gray-600 mb-2">Current CGPA</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-5xl font-bold text-gray-900">4.75</p>
                    <p className="text-lg text-gray-500">/ 5.0</p>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-green-600">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-sm font-medium">+0.15 from last semester</span>
                  </div>
                </div>

                {/* Mock Semester Progress */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                  <p className="text-sm text-gray-600 mb-3">Semester Progress</p>
                  <div className="space-y-2">
                    {[
                      { course: "Data Structures", grade: "A", color: "bg-green-500" },
                      { course: "Algorithms", grade: "A", color: "bg-green-500" },
                      { course: "Web Dev", grade: "B+", color: "bg-blue-500" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className={`h-2 w-2 rounded-full ${item.color}`} />
                          <span className="text-gray-700">{item.course}</span>
                        </div>
                        <span className="font-semibold text-gray-900">{item.grade}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          </div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section className="relative py-16 sm:py-20 md:py-24 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
        {/* Light background image */}
        <div
          className="absolute inset-0 opacity-100"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1920&h=1080&fit=crop&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />

        <div className="container mx-auto px-4 sm:px-6 relative">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-12 sm:mb-16"
          >
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 border border-blue-100 rounded-full mb-4"
            >
              <Award className="h-3.5 w-3.5 text-blue-600" />
              <span className="text-xs sm:text-sm font-medium text-blue-700">All-in-one toolkit</span>
            </motion.div>
            <motion.h2
              variants={fadeInUp}
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 tracking-tight"
            >
              Everything you need to
              <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">excel academically</span>
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto"
            >
              More than a calculator — a complete academic performance management system
            </motion.p>
          </motion.div>

          {/* Bento Grid */}
          <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 md:gap-6 auto-rows-fr">
            {/* Large Feature */}
            <BentoCard
              className="col-span-2 row-span-2 bg-gradient-to-br from-blue-50 via-blue-50 to-blue-100 border-blue-200"
              icon={<Calculator className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />}
              iconBg="bg-blue-100"
              title="See how it's calculated"
              description="Credit-weighted CGPA with full per-semester breakdown — quality points ÷ units, shown step by step."
              large
            />

            {/* Tall card */}
            <BentoCard
              className="row-span-2 bg-gradient-to-br from-purple-50 via-purple-50 to-purple-100 border-purple-200"
              icon={<Target className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />}
              iconBg="bg-purple-100"
              title="Target grades"
              description="The average you need to hit your target class."
            />

            {/* Regular card */}
            <BentoCard
              className="bg-gradient-to-br from-green-50 via-green-50 to-green-100 border-green-200"
              icon={<TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />}
              iconBg="bg-green-100"
              title="CGPA trends"
              description="Track your progress over time."
            />

            {/* Wide card */}
            <BentoCard
              className="col-span-2 sm:col-span-1 bg-gradient-to-br from-orange-50 via-orange-50 to-orange-100 border-orange-200"
              icon={<BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />}
              iconBg="bg-orange-100"
              title="Analytics"
              description="Deep insights into performance."
            />

            {/* Regular card */}
            <BentoCard
              className="bg-gradient-to-br from-pink-50 via-pink-50 to-pink-100 border-pink-200"
              icon={<Award className="h-5 w-5 sm:h-6 sm:w-6 text-pink-600" />}
              iconBg="bg-pink-100"
              title="Your scale"
              description="5.0 or 4.0 grading."
            />

            {/* Wide card */}
            <BentoCard
              className="col-span-2 bg-gradient-to-br from-cyan-50 via-cyan-50 to-cyan-100 border-cyan-200"
              icon={<Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-cyan-600" />}
              iconBg="bg-cyan-100"
              title="Weekly timetable"
              description="Build and share your class schedule with ease."
            />
          </div>
        </div>
      </section>

      {/* Visual Features Section */}
      <section className="py-16 sm:py-20 md:py-24 bg-white relative overflow-hidden">
        {/* Light background image */}
        <div
          className="absolute inset-0 opacity-100"
        />

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-50 border border-green-100 rounded-full mb-4">
                <TrendingUp className="h-3.5 w-3.5 text-green-600" />
                <span className="text-xs sm:text-sm font-medium text-green-700">Performance Analytics</span>
              </div>
              <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
                Track your progress with detailed analytics
              </h3>
              <p className="text-base sm:text-lg text-gray-600 mb-6">
                Visualize your academic journey with interactive charts, semester breakdowns, and trend analysis. Identify patterns and make data-driven decisions.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Semester-by-semester GPA breakdown</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Performance trends and predictions</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Course-level grade insights</span>
                </li>
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-gray-100">
                <img
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop&q=80"
                  alt="Data analytics dashboard"
                  className="w-full h-auto"
                />
              </div>
            </motion.div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative order-2 lg:order-1"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-gray-100">
                <img
                  src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop&q=80"
                  alt="Student planning with calendar"
                  className="w-full h-auto"
                />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="order-1 lg:order-2"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-purple-50 border border-purple-100 rounded-full mb-4">
                <Target className="h-3.5 w-3.5 text-purple-600" />
                <span className="text-xs sm:text-sm font-medium text-purple-700">Goal Planning</span>
              </div>
              <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
                Set targets and plan your path to success
              </h3>
              <p className="text-base sm:text-lg text-gray-600 mb-6">
                Define your academic goals and get personalized recommendations on the grades you need to achieve them. Stay motivated with clear, actionable targets.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="h-4 w-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Calculate required grades for target CGPA</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="h-4 w-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700">AI-powered performance predictions</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="h-4 w-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Semester-wise planning tools</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Classification Guide */}
      <section className="py-16 sm:py-20 md:py-24 bg-white relative overflow-hidden">
        {/* Light background image */}
        <div
          className="absolute inset-0 opacity-100"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1680973543493-6c03e66402fe?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Ym9va3N8ZW58MHx8MHx8fDA%3D)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="text-center mb-12 sm:mb-16"
            >
              <motion.div
                variants={fadeInUp}
                className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 border border-blue-100 rounded-full mb-4"
              >
                <Award className="h-3.5 w-3.5 text-blue-600" />
                <span className="text-xs sm:text-sm font-medium text-blue-700">Class of degree</span>
              </motion.div>
              <motion.h2
                variants={fadeInUp}
                className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 tracking-tight"
              >
                Know where you
                <br className="hidden sm:block" />
                <span className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">stand academically</span>
              </motion.h2>
              <motion.p
                variants={fadeInUp}
                className="text-base sm:text-lg text-gray-600"
              >
                Clear classification guide for your CGPA
              </motion.p>
            </motion.div>

            <div className="space-y-3 sm:space-y-4">
              <ClassificationRow
                title="First Class Honour"
                range="4.50 – 5.00"
                color="bg-gradient-to-r from-green-50 to-emerald-50 border-green-300 text-green-900"
                badge="🏆"
              />
              <ClassificationRow
                title="Second Class Upper"
                range="3.50 – 4.49"
                color="bg-gradient-to-r from-blue-50 to-sky-50 border-blue-300 text-blue-900"
                badge="🥈"
              />
              <ClassificationRow
                title="Second Class Lower"
                range="2.40 – 3.49"
                color="bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-300 text-yellow-900"
                badge="🥉"
              />
              <ClassificationRow
                title="Third Class"
                range="1.50 – 2.39"
                color="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-300 text-orange-900"
                badge="📋"
              />
              <ClassificationRow
                title="Pass"
                range="1.00 – 1.49"
                color="bg-gradient-to-r from-gray-50 to-gray-100 border-gray-300 text-gray-900"
                badge="✓"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Creative Design */}
      <section className="relative py-16 sm:py-24 md:py-28 bg-[#2D3748] border-t border-b border-[#C7A03D]/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative max-w-3xl mx-auto"
          >
            {/* Stamp — echoes the ledger widget's "verified" seal elsewhere on the site */}
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 sm:left-auto sm:right-8 sm:translate-x-0 h-16 w-16 rounded-full border-2 border-[#C7A03D] bg-[#2D3748] flex items-center justify-center rotate-[-8deg] z-10">
              <span className="text-[8px] font-mono tracking-widest text-[#C7A03D] font-bold leading-tight text-center">
                NO COST
                <br />
                TO ENROLL
              </span>
            </div>

            <div className="rounded-sm bg-[#ECEFEA] text-[#2D3748] px-6 sm:px-12 py-12 sm:py-16 text-center">
              <span className="font-mono text-[10px] sm:text-xs tracking-[0.25em] text-[#B23430] uppercase">
                Enrollment Open
              </span>

              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight mt-4 mb-5 leading-[1.1]">
                Your record starts
                <br />
                <span className="italic font-medium">with this semester.</span>
              </h2>

              <p className="text-sm sm:text-base text-[#2D3748]/70 max-w-lg mx-auto mb-9 leading-relaxed">
                Join students who track every grade point the moment it lands. No card on file,
                no trial period — just an accurate record from day one.
              </p>

              {/* Ledger-style feature line, not colored icon bubbles */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mb-10 text-left sm:text-center">
                {[
                  { icon: FileCheck, label: "No setup required" },
                  { icon: Calculator, label: "Instant calculations" },
                  { icon: Award, label: "Progress tracked automatically" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-[#B23430] shrink-0" />
                    <span className="font-mono text-xs sm:text-[13px] tracking-tight text-[#2D3748]/80">
                      {label}
                    </span>
                  </div>
                ))}
              </div>

              {session ? (
                <Link href="/dashboard" className="inline-block w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-[#2D3748] text-[#F1EEE4] hover:bg-[#4A5568] font-semibold rounded-sm px-8 h-13"
                  >
                    Go to dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              ) : (
                <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                  <Link href="/auth/signup" className="w-full sm:w-auto">
                    <Button
                      size="lg"
                      className="w-full sm:w-auto bg-[#C7A03D] text-[#2D3748] hover:bg-[#dab24f] font-semibold rounded-sm px-8"
                    >
                      Start tracking — free
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/auth/signin" className="w-full sm:w-auto">
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full sm:w-auto border-[#2D3748]/30 bg-transparent hover:bg-[#2D3748] hover:text-[#F1EEE4] text-[#2D3748] font-semibold rounded-sm px-8"
                    >
                      Sign in
                    </Button>
                  </Link>
                </div>
              )}

              <p className="mt-7 font-mono text-[11px] tracking-wide text-[#2D3748]/50">
                No payment info required · Records stored securely
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-6 sm:py-8 md:py-10">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-2">
              <Calculator className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              <span className="text-xs sm:text-sm font-semibold text-gray-900">CGPA AI</span>
            </div>
            <p className="text-xs sm:text-sm text-gray-600">
              © 2026 CGPA AI. Built for students, with care.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function BentoCard({
  icon,
  title,
  description,
  className = "",
  iconBg = "bg-blue-100",
  large = false
}: {
  icon: React.ReactNode
  title: string
  description: string
  className?: string
  iconBg?: string
  large?: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
      className={`relative overflow-hidden bg-white p-5 sm:p-6 ${large ? 'md:p-8 lg:p-10' : 'md:p-7'} rounded-2xl border-2 hover:shadow-2xl transition-all duration-300 group ${className}`}
    >
      <motion.div
        className={`${large ? 'h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16' : 'h-10 w-10 sm:h-11 sm:w-11 md:h-12 md:w-12'} ${iconBg} rounded-xl flex items-center justify-center mb-4 sm:mb-5 shadow-sm group-hover:scale-110 transition-transform duration-300`}
        whileHover={{ rotate: 360 }}
        transition={{ duration: 0.6 }}
      >
        {icon}
      </motion.div>
      <h3 className={`${large ? 'text-lg sm:text-xl md:text-2xl lg:text-3xl' : 'text-base sm:text-lg md:text-xl'} font-bold text-gray-900 mb-2 sm:mb-3 leading-tight`}>
        {title}
      </h3>
      <p className={`text-gray-600 ${large ? 'text-sm sm:text-base md:text-lg' : 'text-xs sm:text-sm md:text-base'} leading-relaxed`}>
        {description}
      </p>
    </motion.div>
  )
}

function ClassificationRow({ title, range, color, badge }: { title: string; range: string; color: string; badge?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02, x: 5 }}
      className={`flex items-center justify-between p-4 sm:p-5 md:p-6 rounded-xl border-2 ${color} hover:shadow-lg transition-all duration-200 group cursor-pointer`}
    >
      <div className="flex items-center gap-3 sm:gap-4">
        {badge && (
          <motion.span
            className="text-xl sm:text-2xl group-hover:scale-110 transition-transform duration-200"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            {badge}
          </motion.span>
        )}
        <span className="font-bold text-sm sm:text-base md:text-lg">{title}</span>
      </div>
      <span className="font-mono font-semibold text-xs sm:text-sm md:text-base">{range}</span>
    </motion.div>
  )
}