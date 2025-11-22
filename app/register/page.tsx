'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { pb } from '@/lib/pocketbase'
import { Loader2, Lock, Mail, ArrowRight, User } from 'lucide-react'
import Link from 'next/link'

export default function RegisterPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirm, setPasswordConfirm] = useState('')

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setIsLoading(true)
        setError('')

        if (password !== passwordConfirm) {
            setError('Passwords do not match')
            setIsLoading(false)
            return
        }

        try {
            // 1. Create user
            await pb.collection('users').create({
                email,
                password,
                passwordConfirm,
                emailVisibility: true,
                role: 'admin' // Default role as requested
            })

            // 2. Auto login
            await pb.collection('users').authWithPassword(email, password)

            // 3. Set cookie
            document.cookie = pb.authStore.exportToCookie({ httpOnly: false })

            router.push('/dashboard')
        } catch (e: any) {
            console.error(e)
            setError(e.message || 'Failed to register')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center p-6">
            <div className="w-full max-w-md">

                <div className="bg-white/60 backdrop-blur-2xl border border-white/50 shadow-2xl rounded-3xl p-8 md:p-10">
                    <div className="text-center mb-8">
                        <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-gray-900/20">
                            <User className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
                        <p className="text-gray-500 text-sm mt-2">Join the automation workspace</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm text-center font-medium">
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 ml-1">Email</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-gray-900 transition-colors" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-white/50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-gray-400 focus:ring-4 focus:ring-gray-100 transition-all"
                                        placeholder="name@example.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 ml-1">Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-gray-900 transition-colors" />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-white/50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-gray-400 focus:ring-4 focus:ring-gray-100 transition-all"
                                        placeholder="••••••••"
                                        minLength={8}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 ml-1">Confirm Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-gray-900 transition-colors" />
                                    <input
                                        type="password"
                                        value={passwordConfirm}
                                        onChange={(e) => setPasswordConfirm(e.target.value)}
                                        className="w-full bg-white/50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-gray-400 focus:ring-4 focus:ring-gray-100 transition-all"
                                        placeholder="••••••••"
                                        minLength={8}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-gray-900/20 hover:shadow-xl hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    Create Account <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <p className="text-center text-gray-500 text-sm mt-8">
                    Already have an account? <Link href="/login" className="text-gray-900 font-medium hover:underline">Sign In</Link>
                </p>
            </div>
        </div>
    )
}
