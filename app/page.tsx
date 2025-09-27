"use client";

import Image from 'next/image'
import { Github, Linkedin, Server, ShieldCheck, Database, Zap, Code } from 'lucide-react'

import { useEffect } from 'react'

const Home = () => {
    useEffect(() => {
        console.log('Home mounted (client)')
    }, [])

    return (
        <main className="relative bg-black-100 text-white min-h-screen flex justify-center items-center flex-col overflow-hidden mx-auto sm:px-10 px-5">
            <div className="max-w-7xl w-full">
                <section className="py-16 md:py-24">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                        {/* Left column - Introduction */}
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold">Riya Gupta</h1>
                            <p className="text-lg text-neutral-300 mt-3">I build robust and scalable backend systems.</p>
                            <p className="mt-4 text-neutral-400">I specialize in designing secure APIs, building resilient databases, and automating deployments. With a focus on performance and reliability, I help teams ship scalable services that stand up to real-world traffic.</p>

                            <div className="flex items-center space-x-6 mt-4">
                                <a href="https://github.com/Riya922003" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="hover:opacity-90">
                                    <Github className="w-6 h-6 text-neutral-200" />
                                </a>

                                <a href="https://www.linkedin.com/in/riya-gupta-9b5947251" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:opacity-90">
                                    <Linkedin className="w-6 h-6 text-neutral-200" />
                                </a>

                                <a href="https://leetcode.com/u/riyagupta4079/" target="_blank" rel="noopener noreferrer" aria-label="LeetCode" className="hover:opacity-90">
                                    <Code className="w-6 h-6 text-neutral-200" />
                                </a>
                            </div>
                        </div>

                        {/* Middle column - Profile picture + Connect + Experience */}
                        <div className="flex flex-col items-center">
                            <Image
                                src="/assets/images/profile.jpg"
                                width={240}
                                height={240}
                                alt="Riya Gupta"
                                className="rounded-full p-2 border-2 border-neutral-700 object-cover"
                            />

                            <div className="mt-6">
                                <a
                                    href="https://www.linkedin.com/in/riya-gupta-9b5947251"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-5 py-3 bg-neutral-800 text-neutral-100 rounded-md shadow-sm hover:opacity-90"
                                >
                                    <Linkedin className="w-5 h-5" />
                                    Connect with me
                                </a>
                            </div>

                            <div className="mt-4 text-sm text-neutral-300 space-y-1">
                                <div>3+ years webdev</div>
                                <div>2+ years programming languages</div>
                                <div>10+ major projects</div>
                            </div>
                        </div>

                        {/* Right column - Services */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-2xl font-semibold">What I Offer</h2>
                                <span className="text-sm text-neutral-300">3+ years</span>
                            </div>

                            <ul className="space-y-3">
                                <li className="flex items-center bg-neutral-800 p-3 rounded-md">
                                    <Server className="w-6 h-6 text-neutral-200 mr-4" />
                                    <span>Backend Development</span>
                                </li>

                                <li className="flex items-center bg-neutral-800 p-3 rounded-md">
                                    <ShieldCheck className="w-6 h-6 text-neutral-200 mr-4" />
                                    <span>Secure API Design</span>
                                </li>

                                <li className="flex items-center bg-neutral-800 p-3 rounded-md">
                                    <Database className="w-6 h-6 text-neutral-200 mr-4" />
                                    <span>Database Architecture</span>
                                </li>

                                <li className="flex items-center bg-neutral-800 p-3 rounded-md">
                                    <Zap className="w-6 h-6 text-neutral-200 mr-4" />
                                    <span>DevOps &amp; CI/CD Automation</span>
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