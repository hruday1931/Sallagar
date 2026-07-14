import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Star, Shield, CheckCircle } from 'lucide-react'

const Hero = () => {
  return (
    <>
      <style>
        {`
          @keyframes float-3d-1 {
            0% { transform: translateY(0px) rotate(0deg) scale(1); }
            50% { transform: translateY(-25px) rotate(180deg) scale(1.05); }
            100% { transform: translateY(0px) rotate(360deg) scale(1); }
          }
          @keyframes float-3d-2 {
            0% { transform: translateY(0px) rotate(360deg) scale(1.05); }
            50% { transform: translateY(25px) rotate(180deg) scale(0.95); }
            100% { transform: translateY(0px) rotate(0deg) scale(1.05); }
          }
          @keyframes float-3d-3 {
            0% { transform: translateX(0px) translateY(0px) rotate(0deg) scale(1); }
            25% { transform: translateX(15px) translateY(-20px) rotate(90deg) scale(1.08); }
            50% { transform: translateX(0px) translateY(-35px) rotate(180deg) scale(1); }
            75% { transform: translateX(-15px) translateY(-20px) rotate(270deg) scale(1.08); }
            100% { transform: translateX(0px) translateY(0px) rotate(360deg) scale(1); }
          }
          @keyframes float-3d-4 {
            0% { transform: translateX(0px) translateY(0px) rotate(45deg) scale(0.95); }
            50% { transform: translateX(-20px) translateY(30px) rotate(225deg) scale(1.1); }
            100% { transform: translateX(0px) translateY(0px) rotate(405deg) scale(0.95); }
          }
        `}
      </style>
      <section className="relative overflow-hidden py-16 lg:py-20 bg-gradient-to-r from-[#064e3b] via-[#022c22] to-[#1e3a1e]">
      {/* Premium Ambient Light Leaks */}
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 animate-pulse"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/15 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 animate-pulse" style={{animationDelay: '1s'}}></div>
      
      {/* 3D Floating Transparent Elements */}
      {/* Floating Circles */}
      <div className="absolute top-16 left-[5%] w-16 h-16 bg-gradient-to-br from-emerald-400/30 to-teal-500/30 rounded-full backdrop-blur-sm border border-emerald-300/40 shadow-lg shadow-emerald-400/20" style={{animation: 'float-3d-1 8s ease-in-out infinite'}}></div>
      <div className="absolute top-32 right-[8%] w-20 h-20 bg-gradient-to-br from-indigo-400/25 to-purple-500/25 rounded-full backdrop-blur-sm border border-indigo-300/40 shadow-lg shadow-indigo-400/20" style={{animation: 'float-3d-2 10s ease-in-out infinite', animationDelay: '1s'}}></div>
      <div className="absolute bottom-24 left-[12%] w-14 h-14 bg-gradient-to-br from-amber-400/30 to-orange-500/30 rounded-full backdrop-blur-sm border border-amber-300/40 shadow shadow-amber-400/20" style={{animation: 'float-3d-3 9s ease-in-out infinite', animationDelay: '2s'}}></div>
      <div className="absolute top-[40%] right-[15%] w-12 h-12 bg-gradient-to-br from-pink-400/25 to-rose-500/25 rounded-full backdrop-blur-sm border border-pink-300/40 shadow shadow-pink-400/20" style={{animation: 'float-3d-4 7s ease-in-out infinite', animationDelay: '0.5s'}}></div>
      
      {/* Floating Squares */}
      <div className="absolute top-[15%] left-[20%] w-10 h-10 bg-gradient-to-br from-cyan-400/25 to-blue-500/25 rounded-lg backdrop-blur-sm border border-cyan-300/40 shadow-lg shadow-cyan-400/20" style={{animation: 'float-3d-2 11s ease-in-out infinite', animationDelay: '3s'}}></div>
      <div className="absolute bottom-[32%] right-[25%] w-8 h-8 bg-gradient-to-br from-violet-400/30 to-purple-500/30 rounded-lg backdrop-blur-sm border border-violet-300/40 shadow shadow-violet-400/20" style={{animation: 'float-3d-1 8s ease-in-out infinite', animationDelay: '1.5s'}}></div>
      
      {/* Floating Diamonds */}
      <div className="absolute top-[25%] right-[30%] w-6 h-6 bg-gradient-to-br from-emerald-400/35 to-green-500/35 backdrop-blur-sm border border-emerald-300/50 shadow-lg shadow-emerald-400/25" style={{animation: 'float-3d-3 12s ease-in-out infinite', animationDelay: '4s', transform: 'rotate(45deg)'}}></div>
      <div className="absolute bottom-[35%] left-[18%] w-8 h-8 bg-gradient-to-br from-teal-400/30 to-cyan-500/30 backdrop-blur-sm border border-teal-300/50 shadow shadow-teal-400/25" style={{animation: 'float-3d-4 9s ease-in-out infinite', animationDelay: '2.5s', transform: 'rotate(45deg)'}}></div>
      
      {/* Floating Triangles (using clip-path) */}
      <div className="absolute top-[45%] left-[8%] w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-b-[35px] border-b-emerald-400/30 backdrop-blur-sm" style={{animation: 'float-3d-1 10s ease-in-out infinite', animationDelay: '0.8s'}}></div>
      <div className="absolute top-[60%] right-[10%] w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-b-[28px] border-b-indigo-400/25 backdrop-blur-sm" style={{animation: 'float-3d-2 8s ease-in-out infinite', animationDelay: '3.5s'}}></div>
      
      {/* Floating Hexagons */}
      <div className="absolute top-[70%] left-[30%] w-12 h-12 bg-gradient-to-br from-rose-400/25 to-pink-500/25 backdrop-blur-sm border border-rose-300/40 shadow shadow-rose-400/20" style={{animation: 'float-3d-3 11s ease-in-out infinite', animationDelay: '1.2s', clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'}}></div>
      <div className="absolute top-[20%] right-[40%] w-10 h-10 bg-gradient-to-br from-sky-400/30 to-blue-500/30 backdrop-blur-sm border border-sky-300/40 shadow-lg shadow-sky-400/20" style={{animation: 'float-3d-4 9s ease-in-out infinite', animationDelay: '2.8s', clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'}}></div>
      
      {/* Small Particles */}
      <div className="absolute top-[12%] left-[35%] w-3 h-3 bg-emerald-400/40 rounded-full backdrop-blur-sm" style={{animation: 'float-3d-1 6s ease-in-out infinite', animationDelay: '0.3s'}}></div>
      <div className="absolute top-[55%] right-[22%] w-4 h-4 bg-indigo-400/35 rounded-full backdrop-blur-sm" style={{animation: 'float-3d-2 7s ease-in-out infinite', animationDelay: '1.8s'}}></div>
      <div className="absolute bottom-[18%] left-[45%] w-3 h-3 bg-amber-400/40 rounded-full backdrop-blur-sm" style={{animation: 'float-3d-3 5s ease-in-out infinite', animationDelay: '2.2s'}}></div>
      <div className="absolute top-[38%] left-[5%] w-2 h-2 bg-purple-400/45 rounded-full backdrop-blur-sm" style={{animation: 'float-3d-4 8s ease-in-out infinite', animationDelay: '0.7s'}}></div>
      <div className="absolute bottom-[45%] right-[5%] w-3 h-3 bg-teal-400/40 rounded-full backdrop-blur-sm" style={{animation: 'float-3d-1 7s ease-in-out infinite', animationDelay: '3.2s'}}></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Trust Badge */}
          <div className="inline-flex items-center bg-white/10 backdrop-blur-md border border-white/20 px-5 py-2.5 rounded-full shadow-lg shadow-amber-500/20 mb-10 animate-float">
            <Shield className="h-5 w-5 text-amber-300 mr-2" />
            <span className="text-sm font-medium text-white">Trusted by 10,000+ Readers</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-6 tracking-tight drop-shadow-lg" style={{textShadow: '0 0 40px rgba(255,255,255,0.3)'}}>
            आयुष्याचा खरा सल्लागार
          </h1>

          {/* Tagline */}
          <p className="text-2xl sm:text-3xl text-emerald-300 mb-6 max-w-3xl mx-auto font-light">
            Good Thoughts, Health, Ayurveda, ani Motivation
          </p>

          {/* Subheading */}
          <p className="text-lg text-amber-200/90 mb-10 max-w-2xl mx-auto leading-relaxed">
            Sallagar helps you discover the path to a better life through positive thoughts, 
            Ayurvedic wisdom, and motivational insights. Transform your life with confidence.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link to="/blog" className="bg-gradient-to-r from-emerald-400 to-emerald-600 hover:from-emerald-500 hover:to-emerald-700 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-105 shadow-lg shadow-emerald-500/40 hover:shadow-2xl hover:shadow-emerald-500/60 flex items-center animate-pulse">
              Explore Blog
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link to="/categories" className="bg-white/10 backdrop-blur-md border border-white/30 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-white/20 hover:border-white/50 transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-105 shadow-lg">
              Browse Categories
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-white/10">
              <div className="flex items-center justify-center mb-3">
                <Star className="h-5 w-5 text-amber-300 fill-current" />
                <Star className="h-5 w-5 text-amber-300 fill-current" />
                <Star className="h-5 w-5 text-amber-300 fill-current" />
                <Star className="h-5 w-5 text-amber-300 fill-current" />
                <Star className="h-5 w-5 text-amber-300 fill-current" />
              </div>
              <p className="text-sm font-medium text-white">500+ Inspiring Articles</p>
            </div>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-white/10">
              <CheckCircle className="h-10 w-10 text-emerald-300 mb-3 mx-auto" />
              <p className="text-sm font-medium text-white">100% Authentic Content</p>
            </div>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-white/10">
              <Shield className="h-10 w-10 text-emerald-300 mb-3 mx-auto" />
              <p className="text-sm font-medium text-white">Expert Wellness Team</p>
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  )
}

export default Hero
