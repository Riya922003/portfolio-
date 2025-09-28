"use client";

import Image from 'next/image'
import { Github, Linkedin, Server, ShieldCheck, Database, Zap, Code, Mail, Twitter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import dynamic from 'next/dynamic'
const Globe = dynamic(() => import('@/components/Globe'), { ssr: false })
const LottiePlayer = dynamic(() => import('@/components/LottiePlayer'), { ssr: false })
import TechVisual from '@/components/TechVisual'
import TechMarquee from '@/components/TechMarquee'
import ElectricBorder from '@/components/ElectricBorder'
const PixelCard = dynamic(() => import('@/components/PixelCard'), { ssr: false })
const RippleGrid = dynamic(() => import('@/components/RippleGrid'), { ssr: false })
const Particles = dynamic(() => import('@/components/Particles'), { ssr: false })
import InsideScoopCard from '@/components/InsideScoopCard'
import { Users } from 'lucide-react'

import { useEffect } from 'react'

const Home = () => {
    useEffect(() => {
        // client mount hook (no debug logs)
    }, [])

    return (
        <main className="relative bg-black-100 text-white min-h-screen flex justify-center items-center flex-col overflow-hidden mx-auto sm:px-10 px-5">
            <div className="max-w-7xl w-full">
                <section className="relative py-16 md:py-24">
                    {/* Ballpit background for hero */}
                    <div className="absolute inset-0 z-0">
                        {/* Ballpit background for hero — explicit height so canvas can size and we position canvas absolute to fill */}
                        <div style={{position: 'relative', overflow: 'hidden', height: '600px', width: '100%'}}>
                            <Particles
                                particleColors={["#ffffff", "#ffffff"]}
                                particleCount={200}
                                particleSpread={10}
                                speed={0.1}
                                particleBaseSize={100}
                                moveParticlesOnHover={true}
                                alphaParticles={false}
                                disableRotation={false}
                            />
                        </div>
                    </div>
                    <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 items-center">
                        {/* Left column - Services (moved left like inspiration) */}
                        <aside className="order-3 md:order-1">
                            <h3 className="text-lg uppercase text-neutral-300 mb-6 tracking-wide">SERVICE</h3>
                            <ul className="flex flex-col gap-4">
                                <li className="flex items-center gap-3 p-3 rounded-md border border-neutral-800 bg-neutral-900/40 hover:border-transparent transition-colors relative overflow-hidden">
                                    <span className="absolute inset-0 ring-gradient opacity-0 hover:opacity-100 transition-opacity"></span>
                                    <Server className="w-5 h-5 text-neutral-400" />
                                    <div className="flex flex-col">
                                        <span className="font-medium text-neutral-100">Backend Development</span>
                                        <span className="text-xs text-neutral-400">APIs, microservices, integrations</span>
                                    </div>
                                </li>

                                <li className="flex items-center gap-3 p-3 rounded-md border border-neutral-800 bg-neutral-900/40 hover:border-transparent transition-colors relative overflow-hidden">
                                    <span className="absolute inset-0 ring-gradient opacity-0 hover:opacity-100 transition-opacity"></span>
                                    <ShieldCheck className="w-5 h-5 text-neutral-400" />
                                    <div className="flex flex-col">
                                        <span className="font-medium text-neutral-100">Secure API Design</span>
                                        <span className="text-xs text-neutral-400">Authentication & authorisation</span>
                                    </div>
                                </li>

                                <li className="flex items-center gap-3 p-3 rounded-md border border-neutral-800 bg-neutral-900/40 hover:border-transparent transition-colors relative overflow-hidden">
                                    <span className="absolute inset-0 ring-gradient opacity-0 hover:opacity-100 transition-opacity"></span>
                                    <Database className="w-5 h-5 text-neutral-400" />
                                    <div className="flex flex-col">
                                        <span className="font-medium text-neutral-100">Database Architecture</span>
                                        <span className="text-xs text-neutral-400">Design & optimization</span>
                                    </div>
                                </li>

                                <li className="flex items-center gap-3 p-3 rounded-md border border-neutral-800 bg-neutral-900/40 hover:border-transparent transition-colors relative overflow-hidden">
                                    <span className="absolute inset-0 ring-gradient opacity-0 hover:opacity-100 transition-opacity"></span>
                                    <Zap className="w-5 h-5 text-neutral-400" />
                                    <div className="flex flex-col">
                                        <span className="font-medium text-neutral-100">DevOps &amp; CI/CD</span>
                                        <span className="text-xs text-neutral-400">Pipelines & automation</span>
                                    </div>
                                </li>
                            </ul>
                        </aside>

                        {/* Middle column - big centered name + framed image */}
                        <div className="order-2 md:order-2 flex flex-col items-center">
                            <h1 className="text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 text-center">Riya Gupta</h1>

                            <div className="relative mt-2">
                                {/* outer decorative frame replaced with ElectricBorder for consistent effect */}
                                <ElectricBorder color="#7df9ff" speed={1} chaos={0.6} thickness={2} className="rounded-full inline-block" style={{}}>
                                    <div className="w-[420px] h-[420px] rounded-full p-2 flex items-center justify-center">
                                        <div className="w-full h-full rounded-full bg-neutral-900/80 flex items-center justify-center">
                                            <Image
                                                src="/assets/images/profile.jpg"
                                                width={320}
                                                height={320}
                                                alt="Riya Gupta"
                                                className="rounded-full object-cover w-[320px] h-[320px]"
                                            />
                                        </div>
                                    </div>
                                </ElectricBorder>
                            </div>

                            <div className="mt-6">
                                <PixelCard variant="blue" className="inline-block" gap={4} speed={120} colors="#7df9ff,#60a5fa" noFocus={true}>
                                    <div style={{position: 'relative', padding: 2}}>
                                        <a href="/exp(3).pdf" target="_blank" rel="noopener noreferrer" download className="inline-block px-6 py-3 rounded-md text-neutral-100">Download Resume</a>
                                    </div>
                                </PixelCard>
                            </div>

                            <div className="flex gap-6 text-sm text-neutral-400 mt-8">
                                <div className="group text-center bg-neutral-800/60 px-4 py-3 rounded-md hover:bg-neutral-100/90 transition-colors">
                                    <div className="font-semibold text-neutral-100 group-hover:text-black">3+</div>
                                    <div className="text-xs">years webdev</div>
                                </div>
                                <div className="group text-center bg-neutral-800/60 px-4 py-3 rounded-md hover:bg-neutral-100/90 transition-colors">
                                    <div className="font-semibold text-neutral-100 group-hover:text-black">2+</div>
                                    <div className="text-xs">years programming</div>
                                </div>
                                <div className="group text-center bg-neutral-800/60 px-4 py-3 rounded-md hover:bg-neutral-100/90 transition-colors">
                                    <div className="font-semibold text-neutral-100 group-hover:text-black">10+</div>
                                    <div className="text-xs">major projects</div>
                                </div>
                            </div>
                        </div>

                        {/* Right column - description & social */}
                        <div className="order-1 md:order-3">
                            <h2 className="text-2xl md:text-3xl font-semibold text-white mb-3">Turning Logic into Launch</h2>
                            <p className="text-lg text-neutral-300 mb-4">I engineer high-performance backend systems built for scale and reliability. From crafting secure APIs and resilient databases to automating deployments, I build the robust foundations that power modern applications and handle real-world traffic with ease.</p>


                            <div className="flex items-center gap-4 mb-6">
                                <a href="https://github.com/Riya922003" target="_blank" rel="noopener noreferrer" className="transition-colors duration-200 hover:text-neutral-200">
                                    <Github className="w-6 h-6 text-neutral-200" />
                                </a>
                                <a href="https://www.linkedin.com/in/riya-gupta-9b5947251" target="_blank" rel="noopener noreferrer" className="transition-colors duration-200 hover:text-neutral-200">
                                    <Linkedin className="w-6 h-6 text-neutral-200" />
                                </a>
                                <a href="https://twitter.com/your_twitter_handle" target="_blank" rel="noopener noreferrer" className="transition-colors duration-200 hover:text-neutral-200">
                                    <Twitter className="w-6 h-6 text-neutral-200" />
                                </a>
                            </div>

                            <div>
                                <PixelCard variant="blue" className="inline-block" gap={4} speed={120} colors="#7df9ff,#60a5fa" noFocus={true}>
                                    <div style={{position: 'relative', padding: 2}}>
                                        <a href="mailto:riya@example.com" className="inline-block px-6 py-3 rounded-md text-neutral-100">Send a message</a>
                                    </div>
                                </PixelCard>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Highlights & Arsenal bento grid */}
                <section className="mt-12">
                    <h2 className="text-2xl font-semibold mb-4">Highlights & Arsenal</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 auto-rows-[220px] gap-4">
                        {/* Card base style: p-4 rounded-lg border border-neutral-800 bg-neutral-900/50 backdrop-blur-sm overflow-hidden */}

                        {/* Card A: Collaboration (Large top-left) */}
                        <div className="p-6 rounded-lg border border-neutral-300 bg-white overflow-hidden md:col-span-2 lg:col-span-3 relative">
                            {/* Ripple grid background */}
                            <div className="absolute inset-0 z-0 pointer-events-none">
                                <RippleGrid opacity={0.12} gridColor="#60a5fa" gridSize={12.0} gridThickness={12.0} glowIntensity={0.06} />
                            </div>
                            {/* ParticleConstellation removed per request; keep RippleGrid only */}
                            <div className="relative z-10 flex items-start gap-6">
                                <div className="flex-shrink-0">
                                    <Users className="w-8 h-8 text-neutral-200" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-lg text-black">Collaboration</h4>
                                    <p className="text-sm text-black mt-2">I believe the best products are built by teams, not individuals. I thrive in environments that value clear communication, iterative feedback, and a shared passion for quality.</p>
                                    <div className="mt-6 flex gap-3" role="list">
                                        <span className="px-3 py-1 bg-neutral-800/30 rounded text-xs">Client-first</span>
                                        <span className="px-3 py-1 bg-neutral-800/30 rounded text-xs">Transparent</span>
                                        <span className="px-3 py-1 bg-neutral-800/30 rounded text-xs">Iterative</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Card B: Technologies (Tall right-side with animated background and scrolling rows) */}
                        <div className="p-4 rounded-lg border border-neutral-800 bg-neutral-900/50 backdrop-blur-sm overflow-hidden md:col-span-1 lg:col-span-1 lg:row-span-2 relative">
                            <div className="animated-lines absolute inset-0 pointer-events-none" aria-hidden="true"></div>
                            <div className="relative z-10 text-center">
                                <h3 className="font-semibold mb-3">Passionate about cutting-edge technologies</h3>
                                <div className="w-full h-36 flex flex-col items-center justify-center">
                                    {/* floating tabs — moving marquee rows (centered) */}
                                    <div className="w-full max-w-lg">
                                        <div className="mb-3">
                                            <TechMarquee items={["React.js","Next.js","TypeScript","Prisma","Zustand","Zod"]} speed={20} />
                                        </div>
                                        <div className="mb-3">
                                            <TechMarquee items={["Node.js","Express","GraphQL","Docker","Postgres","MongoDB"]} reverse speed={16} />
                                        </div>
                                        <div className="mb-0">
                                            <TechMarquee items={["Vercel","AWS","CI/CD","pnpm","Linux","Clerk"]} speed={22} />
                                        </div>
                                    </div>
                                </div>
                                
                            </div>
                            {/* subtle animated person image in bottom-right as background */}
                            <Image
                                src="/assets/images/worker.gif"
                                alt="Person working on desktop"
                                width={640}
                                height={480}
                                className="absolute left-1/2 top-[34%] -translate-x-1/2 opacity-100 pointer-events-none z-0 object-contain w-64 h-48 md:w-80 md:h-64 lg:w-96 lg:h-72 max-w-none"
                            />
                            <div className="mt-4 relative z-10">
                                <TechVisual />
                            </div>
                        </div>

                        {/* Card C: Globe (Tall left-middle) */}
                        <div className="p-4 rounded-lg border border-neutral-800 bg-neutral-900/50 backdrop-blur-sm overflow-hidden md:col-span-2 lg:col-span-1 md:row-span-2 flex items-center justify-center flex-col">
                            <div aria-hidden="false" role="group" tabIndex={0} className="w-full h-full flex items-center justify-center mb-2">
                                <div className="w-full h-full flex items-center justify-center flex-col">
                                    <Globe />
                                    <div className="text-sm text-neutral-400 mt-4 text-center">Flexible with time zones — available for rotational schedules and cross-region collaboration.</div>
                                </div>
                            </div>
                        </div>

                        {/* Card C2: Availability (beside Globe to complete bento) */}
                        <div className="p-6 rounded-lg border border-neutral-800 bg-neutral-900/50 backdrop-blur-sm overflow-hidden md:col-span-2 lg:col-span-1 md:row-span-2 flex flex-col items-center text-center relative">
                            {/* floating top-right pill */}
                            

                            <h4 className="font-semibold text-2xl lg:text-3xl mb-2">Availability</h4>
                            <p className="text-sm text-neutral-400 mb-3">Open to new projects — I work remotely and can overlap core hours for meetings.</p>

                            <div className="flex flex-wrap gap-2 justify-center mb-4">
                                <span className="px-3 py-1 bg-neutral-800/30 rounded text-xs">Remote</span>
                                <span className="px-3 py-1 bg-neutral-800/30 rounded text-xs">On-site</span>
                                <span className="px-3 py-1 bg-neutral-800/30 rounded text-xs">Internship</span>
                                <span className="px-3 py-1 bg-neutral-800/30 rounded text-xs">Contract</span>
                                <span className="px-3 py-1 bg-neutral-800/30 rounded text-xs">Rotational</span>
                                <span className="px-3 py-1 bg-neutral-800/30 rounded text-xs">Night shifts</span>
                                <span className="px-3 py-1 bg-neutral-800/30 rounded text-xs">Day shifts</span>
                                <span className="px-3 py-1 bg-neutral-800/30 rounded text-xs">WFH</span>
                                <span className="px-3 py-1 bg-neutral-800/30 rounded text-xs">WFI</span>
                            </div>

                            <div className="mt-2">
                                <div className="text-3xl font-bold">Mon — Fri</div>
                                <div className="text-sm text-neutral-400">9:00 — 18:00 (IST) — overlaps available on request</div>
                            </div>

                            <div className="mt-6">
                                <ElectricBorder color="#7df9ff" speed={1} chaos={0.6} thickness={2} className="mx-auto" style={{}}>
                                    <a href="mailto:riya@example.com" className="mx-auto inline-block px-6 py-3 rounded-md border border-neutral-700 text-neutral-100 bg-gradient-to-br from-neutral-800/60 to-neutral-900/60 hover:from-rose-500 hover:to-cyan-500 transition-all">Get in touch</a>
                                </ElectricBorder>
                            </div>

                        </div>

                        {/* Card D: CTA with Lottie (Medium) */}
                        <div className="p-4 rounded-lg border border-neutral-800 bg-neutral-900/40 backdrop-blur-sm overflow-hidden md:col-span-2 lg:col-span-2 h-full relative">
                            <InsideScoopCard />
                        </div>

                        {/* Card 5: Project Showcase (Small) */}
                        <div className="p-4 rounded-lg border border-neutral-800 bg-neutral-900/50 backdrop-blur-sm overflow-hidden">
                            <h4 className="font-semibold">Websites that stand out</h4>
                            <div className="mt-3 rounded-md h-28 flex items-center justify-center overflow-hidden">
                                <img src="/assets/images/project-thumb.svg" alt="Project thumbnail" className="object-cover w-full h-full rounded-md" />
                            </div>
                            <div className="mt-3">
                                <a href="/projects" className="text-sm text-rose-400 hover:underline focus:outline-none focus:ring-2 focus:ring-rose-400 rounded" aria-label="Read more about projects">Read More</a>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
};
export default Home;