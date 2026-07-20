import React from 'react'
import { AlertTriangle, ShoppingBag, Info, ExternalLink } from 'lucide-react'

const Disclaimer = () => {
  return (
    <div className="min-h-screen">
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-900/90 via-indigo-900/80 to-purple-950/90 text-white py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 animate-pulse-glow"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 animate-pulse-glow"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-4">
            <AlertTriangle className="h-10 w-10 mr-4" />
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight">Disclaimer</h1>
          </div>
          <p className="text-xl text-white/90 max-w-2xl font-light">
            Important information about our affiliate partnerships and content.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="prose prose-lg max-w-none">
          <div className="glassmorphism rounded-3xl shadow-xl p-8 mb-8">
            <p className="text-slate-600 mb-6 leading-relaxed">
              Last updated: June 2024
            </p>
            <p className="text-slate-600 leading-relaxed">
              Please read this disclaimer carefully before using Sallagar. This disclaimer contains important information about our affiliate relationships and the nature of content on this website.
            </p>
          </div>

          <div className="glassmorphism rounded-3xl shadow-xl p-8 mb-8 border-2 border-purple-200">
            <div className="flex items-center mb-4">
              <ShoppingBag className="h-6 w-6 text-purple-600 mr-3" />
              <h2 className="text-2xl font-bold text-slate-900">Affiliate Disclosure</h2>
            </div>
            <p className="text-slate-600 mb-4 leading-relaxed font-semibold">
              Sallagar is a participant in various affiliate advertising programs designed to provide a means for sites to earn advertising fees by advertising and linking to partner websites.
            </p>
            <p className="text-slate-600 mb-4 leading-relaxed">
              We participate in the following affiliate programs:
            </p>
            <ul className="list-disc pl-6 text-slate-600 space-y-2 mb-4">
              <li><strong>Amazon Associates:</strong> As an Amazon Associate, we earn from qualifying purchases when you click our links and buy products on Amazon.</li>
              <li><strong>Flipkart Affiliate Program:</strong> We earn commissions when you purchase products through our Flipkart affiliate links.</li>
              <li><strong>AJIO Affiliate Program:</strong> We may earn commissions when you shop through our AJIO referral links.</li>
              <li><strong>Myntra Affiliate Program:</strong> We participate in Myntra's affiliate program and may earn commissions on qualifying purchases.</li>
              <li><strong>Other Partners:</strong> We may have affiliate relationships with other retailers and service providers.</li>
            </ul>
            <p className="text-slate-600 leading-relaxed">
              This comes at no extra cost to you. The commissions we earn help support our website and allow us to continue providing free content and recommendations.
            </p>
          </div>

          <div className="glassmorphism rounded-3xl shadow-xl p-8 mb-8">
            <div className="flex items-center mb-4">
              <Info className="h-6 w-6 text-purple-600 mr-3" />
              <h2 className="text-2xl font-bold text-slate-900">Educational & Informational Purpose Only</h2>
            </div>
            <p className="text-slate-600 mb-4 leading-relaxed">
              All information provided on Sallagar is for educational and informational purposes only. The content on this website is based on our research, experience, and opinions, and should not be considered professional advice.
            </p>
            <p className="text-slate-600 mb-4 leading-relaxed">
              For health, medical, financial, or legal matters, please consult with qualified professionals before making any decisions based on information found on this website.
            </p>
            <p className="text-slate-600 leading-relaxed">
              We strive to provide accurate and up-to-date information, but we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of the information contained on this website.
            </p>
          </div>

          <div className="glassmorphism rounded-3xl shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Product Recommendations</h2>
            <p className="text-slate-600 mb-4 leading-relaxed">
              Our product recommendations are based on our research, analysis, and genuine opinions. We only recommend products that we believe will provide value to our readers.
            </p>
            <p className="text-slate-600 mb-4 leading-relaxed">
              However, individual preferences and needs may vary. What works well for one person may not work for another. We encourage you to read reviews, compare prices, and make informed purchasing decisions.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Prices and availability of products are subject to change. We do not control the pricing, inventory, or policies of our affiliate partners. Any discrepancies should be addressed directly with the respective merchant.
            </p>
          </div>

          <div className="glassmorphism rounded-3xl shadow-xl p-8 mb-8">
            <div className="flex items-center mb-4">
              <ExternalLink className="h-6 w-6 text-purple-600 mr-3" />
              <h2 className="text-2xl font-bold text-slate-900">Third-Party Websites</h2>
            </div>
            <p className="text-slate-600 mb-4 leading-relaxed">
              Sallagar contains links to third-party websites, including affiliate partners. When you click on these links, you will be redirected to external websites that are not under our control.
            </p>
            <p className="text-slate-600 leading-relaxed">
              We have no control over the nature, content, and availability of those sites. The inclusion of any links does not necessarily imply a recommendation or endorse the views expressed within them. We are not responsible for the privacy practices or content of any third-party websites.
            </p>
          </div>

          <div className="glassmorphism rounded-3xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">No Endorsement</h2>
            <p className="text-slate-600 mb-4 leading-relaxed">
              Reference to any specific product, service, or company does not constitute an endorsement or recommendation by Sallagar unless explicitly stated.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Views and opinions expressed by our writers are their own and do not necessarily reflect the official policy or position of Sallagar or any of our affiliate partners.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Disclaimer
