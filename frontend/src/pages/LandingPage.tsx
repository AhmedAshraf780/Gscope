import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import '../App.css'
import { Header } from '../components/landing/Header'
import { HeroSection } from '../components/landing/HeroSection'
import { FeaturesSection } from '../components/landing/FeaturesSection'
import { WorkflowSection } from '../components/landing/WorkflowSection'
import { PricingSection } from '../components/landing/PricingSection'
import { CTASection } from '../components/landing/CTASection'

export function LandingPage() {
  const pageRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const context = gsap.context(() => {
      gsap.from('[data-reveal="hero"]', {
        y: 36,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.12,
      })

      gsap.from('[data-reveal="section"]', {
        y: 48,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.08,
        delay: 0.35,
      })

      gsap.to('[data-float="slow"]', {
        y: -18,
        x: 12,
        duration: 4.6,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: 0.2,
      })

      gsap.to('[data-float="pulse"]', {
        scale: 1.06,
        opacity: 0.88,
        duration: 2.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: 0.18,
      })
    }, pageRef)

    return () => context.revert()
  }, [])

  return (
    <div ref={pageRef} className="min-h-screen bg-[var(--canvas)] text-[var(--ink)]">
      <main className="relative isolate overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-90">
          <div
            data-float="pulse"
            className="hero-orb absolute left-[8%] top-16 h-44 w-44 rounded-full bg-[radial-gradient(circle_at_center,_rgba(255,212,102,0.55),_rgba(255,212,102,0))] blur-2xl"
          />
          <div
            data-float="slow"
            className="hero-orb absolute right-[8%] top-28 h-60 w-60 rounded-full bg-[radial-gradient(circle_at_center,_rgba(55,114,255,0.32),_rgba(55,114,255,0))] blur-2xl"
          />
          <div
            data-float="pulse"
            className="hero-orb absolute bottom-20 left-1/2 h-52 w-52 -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,_rgba(255,122,69,0.24),_rgba(255,122,69,0))] blur-2xl"
          />
          <div className="grid-overlay absolute inset-0" />
        </div>

        <section className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 pb-16 pt-6 sm:px-8 lg:px-10">
          <Header />
          <HeroSection />
        </section>

        <FeaturesSection />
        <WorkflowSection />
        <PricingSection />
        <CTASection />
      </main>
    </div>
  )
}

