import React from 'react'
import { FileText, AlertCircle, Scale } from 'lucide-react'

const TermsOfService = () => {
  return (
    <div className="min-h-screen">
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-900/90 via-indigo-900/80 to-purple-950/90 text-white py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 animate-pulse-glow"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 animate-pulse-glow"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-4">
            <FileText className="h-10 w-10 mr-4" />
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight">Terms of Service</h1>
          </div>
          <p className="text-xl text-white/90 max-w-2xl font-light">
            Please read these terms carefully before using Sallagar.
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
              Welcome to Sallagar. By accessing or using our website, you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access our service.
            </p>
          </div>

          <div className="glassmorphism rounded-3xl shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-slate-600 mb-4 leading-relaxed">
              By accessing and using Sallagar, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </div>

          <div className="glassmorphism rounded-3xl shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Use License</h2>
            <p className="text-slate-600 mb-4 leading-relaxed">
              Permission is granted to temporarily download one copy of the materials on Sallagar for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc pl-6 text-slate-600 space-y-2">
              <li>modify or copy the materials</li>
              <li>use the materials for any commercial purpose or for any public display</li>
              <li>attempt to reverse engineer any software contained on the website</li>
              <li>remove any copyright or other proprietary notations from the materials</li>
            </ul>
          </div>

          <div className="glassmorphism rounded-3xl shadow-xl p-8 mb-8">
            <div className="flex items-center mb-4">
              <Scale className="h-6 w-6 text-purple-600 mr-3" />
              <h2 className="text-2xl font-bold text-slate-900">3. Intellectual Property</h2>
            </div>
            <p className="text-slate-600 mb-4 leading-relaxed">
              All content on Sallagar, including but not limited to text, graphics, logos, images, and software, is the property of Sallagar or its content suppliers and is protected by international copyright laws.
            </p>
            <p className="text-slate-600 leading-relaxed">
              You may not use, reproduce, modify, or distribute any content from this website without express written permission from Sallagar.
            </p>
          </div>

          <div className="glassmorphism rounded-3xl shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">4. User Comments</h2>
            <p className="text-slate-600 mb-4 leading-relaxed">
              Certain parts of this website offer the opportunity for users to post and exchange opinions, information, material, and data. We do not filter, edit, publish, or review Comments prior to their presence on the website.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Comments represent the views and opinions of the persons who post them and do not reflect the views or opinions of Sallagar. We reserve the right to remove any comments that are inappropriate, offensive, or violate our policies.
            </p>
          </div>

          <div className="glassmorphism rounded-3xl shadow-xl p-8 mb-8">
            <div className="flex items-center mb-4">
              <AlertCircle className="h-6 w-6 text-purple-600 mr-3" />
              <h2 className="text-2xl font-bold text-slate-900">5. Limitation of Liability</h2>
            </div>
            <p className="text-slate-600 mb-4 leading-relaxed">
              In no event shall Sallagar or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on our website.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Sallagar does not warrant that the website will operate uninterrupted, error-free, or that defects will be corrected. The materials on this website are provided "as is" without warranty of any kind.
            </p>
          </div>

          <div className="glassmorphism rounded-3xl shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Affiliate Links</h2>
            <p className="text-slate-600 mb-4 leading-relaxed">
              Sallagar contains affiliate links to products and services. When you click on these links and make a purchase, we may receive a commission at no additional cost to you. This helps support our website and allows us to continue providing free content.
            </p>
            <p className="text-slate-600 leading-relaxed">
              We are not responsible for the products or services offered by our affiliate partners. Any issues with purchases should be directed to the respective merchant.
            </p>
          </div>

          <div className="glassmorphism rounded-3xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Governing Law</h2>
            <p className="text-slate-600 leading-relaxed">
              These terms and conditions are governed by and construed in accordance with the laws of India and you irrevocably submit to the exclusive jurisdiction of the courts in that state or location.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TermsOfService
