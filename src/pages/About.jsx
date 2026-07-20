import React from 'react'
import { Shield, Users, Target, Award } from 'lucide-react'

const About = () => {
  return (
    <div className="min-h-screen">
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-900/90 via-indigo-900/80 to-purple-950/90 text-white py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 animate-pulse-glow"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 animate-pulse-glow"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl sm:text-6xl font-bold mb-4 tracking-tight">About Sallagar</h1>
          <p className="text-xl text-white/90 max-w-2xl font-light">
            Your trusted product advisor for honest reviews and expert recommendations
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Mission */}
        <div className="glassmorphism rounded-3xl shadow-lg p-8 mb-12 hover:shadow-2xl hover:shadow-purple-200/50 transition-all duration-500 ease-out hover:-translate-y-2">
          <div className="flex items-start mb-4">
            <Target className="h-10 w-10 text-purple-600 mr-4 flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Our Mission</h2>
              <p className="text-slate-600 leading-relaxed">
                At Sallagar, we believe that everyone deserves access to honest, unbiased product information. 
                Our mission is to help consumers make informed purchasing decisions by providing comprehensive 
                reviews, expert insights, and transparent recommendations. We're committed to cutting through 
                marketing noise and delivering the truth about products.
              </p>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="glassmorphism rounded-3xl shadow-lg p-8 hover:shadow-2xl hover:shadow-purple-200/50 transition-all duration-500 ease-out hover:-translate-y-3 hover:scale-[1.02]">
            <Shield className="h-12 w-12 text-purple-600 mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">Unbiased Reviews</h3>
            <p className="text-slate-600">
              We maintain strict editorial independence. Our reviews are never influenced by manufacturers or advertisers.
            </p>
          </div>
          <div className="glassmorphism rounded-3xl shadow-lg p-8 hover:shadow-2xl hover:shadow-purple-200/50 transition-all duration-500 ease-out hover:-translate-y-3 hover:scale-[1.02]">
            <Users className="h-12 w-12 text-purple-600 mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">Expert Team</h3>
            <p className="text-slate-600">
              Our team consists of industry experts and passionate researchers dedicated to thorough product analysis.
            </p>
          </div>
          <div className="glassmorphism rounded-3xl shadow-lg p-8 hover:shadow-2xl hover:shadow-purple-200/50 transition-all duration-500 ease-out hover:-translate-y-3 hover:scale-[1.02]">
            <Award className="h-12 w-12 text-purple-600 mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">Quality First</h3>
            <p className="text-slate-600">
              We invest significant time in research and testing to ensure our recommendations meet the highest standards.
            </p>
          </div>
        </div>

        {/* Story */}
        <div className="glassmorphism rounded-3xl shadow-lg p-8 hover:shadow-2xl hover:shadow-purple-200/50 transition-all duration-500 ease-out hover:-translate-y-2">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Our Story</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            Sallagar was founded with a simple idea: make product research easier and more trustworthy. 
            Frustrated by biased reviews and overwhelming product choices, we set out to create a platform 
            that consumers could rely on for honest, well-researched information.
          </p>
          <p className="text-slate-600 leading-relaxed">
            Today, we've grown into a trusted resource for thousands of readers who rely on our recommendations 
            before making purchases. We continue to uphold our founding principles of honesty, transparency, 
            and consumer advocacy in everything we do.
          </p>
        </div>
      </div>
    </div>
  )
}

export default About
