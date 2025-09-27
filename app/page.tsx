"use client";

import Image from 'next/image'
import { Github, Linkedin, Server, ShieldCheck, Database, Zap, Code, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'

import { useEffect } from 'react'

const Home = () => {
    useEffect(() => {
        console.log('Home mounted (client)')
    }, [])

    return (
        <main className="relative bg-black-100 text-white min-h-screen flex justify-center items-center flex-col overflow-hidden mx-auto sm:px-10 px-5">
            <div className="max-w-7xl w-full">
                <section className="py-16 md:py-24">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 items-center">
                        {/* Left column - Introduction */}
                        <div className="flex flex-col gap-4">
                            <h1 className="text-5xl lg:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">Riya Gupta</h1>
                            <p className="text-lg text-neutral-300">I build robust and scalable backend systems.</p>
                            <p className="text-neutral-400">I specialize in designing secure APIs, building resilient databases, and automating deployments. With a focus on performance and reliability, I help teams ship scalable services that stand up to real-world traffic.</p>

                            <div className="flex items-center space-x-6 mt-4">
                                <a href="https://github.com/Riya922003" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="transition-colors duration-200 hover:text-neutral-200">
                                    <Github className="w-6 h-6 text-neutral-200" />
                                </a>

                                <a href="https://www.linkedin.com/in/riya-gupta-9b5947251" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="transition-colors duration-200 hover:text-neutral-200">
                                    <Linkedin className="w-6 h-6 text-neutral-200" />
                                </a>

                                <a href="https://leetcode.com/u/riyagupta4079/" target="_blank" rel="noopener noreferrer" aria-label="LeetCode" className="transition-colors duration-200 hover:text-neutral-200">
                                    <Code className="w-6 h-6 text-neutral-200" />
                                </a>
                            </div>
                        </div>

                        {/* Middle column - Image, CTA, Stats */}
                        <div className="flex flex-col items-center gap-4">
                            <div className="p-1 rounded-full bg-gradient-to-tr from-rose-500 via-violet-500 to-cyan-500">
                                <div className="rounded-full bg-neutral-900 p-1">
                                    <Image
                                        src="/assets/images/profile.jpg"
                                        width={232}
                                        height={232}
                                        alt="Riya Gupta"
                                        className="rounded-full object-cover"
                                    />
                                </div>
                            </div>

                            <div>
                                <Button variant="secondary" className="inline-flex items-center">
                                    <Mail className="w-4 h-4 mr-2" />
                                    Connect with me
                                </Button>
                            </div>

                            <div className="flex gap-4 text-sm text-neutral-400 mt-4">
                                <span>3+ years webdev</span>
                                <span>2+ years programming languages</span>
                                <span>10+ major projects</span>
                            </div>
                        </div>

                        {/* Right column - Services */}
                        <div>
                            <h2 className="text-2xl font-semibold mb-4">What I Offer</h2>

                            <ul className="flex flex-col gap-3">
                                <li className="flex items-center gap-3 p-3 rounded-md border border-neutral-800 bg-neutral-900/50 hover:border-neutral-700 transition-colors">
                                    <Server className="w-5 h-5 text-neutral-400" />
                                    <span className="font-medium text-neutral-100">Backend Development</span>
                                </li>

                                <li className="flex items-center gap-3 p-3 rounded-md border border-neutral-800 bg-neutral-900/50 hover:border-neutral-700 transition-colors">
                                    <ShieldCheck className="w-5 h-5 text-neutral-400" />
                                    <span className="font-medium text-neutral-100">Secure API Design</span>
                                </li>

                                <li className="flex items-center gap-3 p-3 rounded-md border border-neutral-800 bg-neutral-900/50 hover:border-neutral-700 transition-colors">
                                    <Database className="w-5 h-5 text-neutral-400" />
                                    <span className="font-medium text-neutral-100">Database Architecture</span>
                                </li>

                                <li className="flex items-center gap-3 p-3 rounded-md border border-neutral-800 bg-neutral-900/50 hover:border-neutral-700 transition-colors">
                                    <Zap className="w-5 h-5 text-neutral-400" />
                                    <span className="font-medium text-neutral-100">DevOps &amp; CI/CD Automation</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
};
export default Home;