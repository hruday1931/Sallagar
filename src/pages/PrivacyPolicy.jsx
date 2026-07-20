import React from 'react'
import { Shield, Cookie, Lock, Eye } from 'lucide-react'

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen">
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-900/90 via-indigo-900/80 to-purple-950/90 text-white py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 animate-pulse-glow"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 animate-pulse-glow"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-4">
            <Shield className="h-10 w-10 mr-4" />
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight">Privacy Policy</h1>
          </div>
          <p className="text-xl text-white/90 max-w-2xl font-light">
            Your privacy is important to us. This policy explains how we handle your data.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="prose prose-lg max-w-none">
          <div className="glassmorphism rounded-3xl shadow-xl p-8 mb-8">
            <p className="text-slate-600 mb-6 leading-relaxed">
              Last updated: June 2024
            </p>
            <p className="text-slate-600 mb-6 leading-relaxed">
              At Sallagar, accessible from https://sallagar.com, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Sallagar and how we use it.
            </p>
          </div>

          <div className="glassmorphism rounded-3xl shadow-xl p-8 mb-8">
            <div className="flex items-center mb-4">
              <Eye className="h-6 w-6 text-purple-600 mr-3" />
              <h2 className="text-2xl font-bold text-slate-900">Log Files</h2>
            </div>
            <p className="text-slate-600 mb-4 leading-relaxed">
              Sallagar follows a standard procedure of using log files. These files log visitors when they visit websites. The information collected includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks.
            </p>
            <p className="text-slate-600 leading-relaxed">
              These are not linked to any personally identifiable information. The purpose is to analyze trends, administer the site, track users' movement on the website, and gather demographic information.
            </p>
          </div>

          <div className="glassmorphism rounded-3xl shadow-xl p-8 mb-8">
            <div className="flex items-center mb-4">
              <Cookie className="h-6 w-6 text-purple-600 mr-3" />
              <h2 className="text-2xl font-bold text-slate-900">Cookies and Web Beacons</h2>
            </div>
            <p className="text-slate-600 mb-4 leading-relaxed">
              Like any other website, Sallagar uses 'cookies'. These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.
            </p>
          </div>

          <div className="glassmorphism rounded-3xl shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Google DoubleClick DART Cookie</h2>
            <p className="text-slate-600 mb-4 leading-relaxed">
              Google is one of a third-party vendor on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to our site and other sites on the internet.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Users may opt out of the use of the DART cookie by visiting the Google ad and content network privacy policy at the Google advertising and content network privacy policy page.
            </p>
          </div>

          <div className="glassmorphism rounded-3xl shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Google AdSense & Third-Party Vendors</h2>
            <p className="text-slate-600 mb-4 leading-relaxed">
              We use third-party advertising companies to serve ads when you visit our website. These companies may use information about your visits to this and other websites in order to provide advertisements about goods and services of interest to you.
            </p>
          </div>

          <div className="glassmorphism rounded-3xl shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Amazon Affiliate Disclosure</h2>
            <p className="text-slate-600 mb-4 leading-relaxed">
              As an Amazon Associate, we earn from qualifying purchases. This means that when you click on links to Amazon products and make a purchase, we may receive a small commission at no additional cost to you.
            </p>
            <p className="text-slate-600 leading-relaxed">
              We participate in various affiliate advertising programs including Amazon Associates, Flipkart Affiliate Program, and others. These programs are designed to provide a means for sites to earn advertising fees by advertising and linking to these platforms.
            </p>
          </div>

          <div className="glassmorphism rounded-3xl shadow-xl p-8">
            <div className="flex items-center mb-4">
              <Lock className="h-6 w-6 text-purple-600 mr-3" />
              <h2 className="text-2xl font-bold text-slate-900">Data Security</h2>
            </div>
            <p className="text-slate-600 mb-4 leading-relaxed">
              We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure.
            </p>
            <p className="text-slate-600 leading-relaxed">
              While we strive to protect your personal information, we cannot guarantee absolute security. Any transmission of personal information is at your own risk.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicy
