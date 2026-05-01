import React from 'react';
import { Download, Building2, GraduationCap, Trophy, ChevronRight, Mail, Linkedin, Globe } from 'lucide-react';

export default function Careers() {
  return (
    <div className="py-24 px-6 max-w-4xl mx-auto">
      <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
         <div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-2">Careers <span className="text-slate-300">/</span> About Me</h1>
            <p className="text-slate-500 text-lg">Actually, ClearSpend is currently a one-man army. Let's build together.</p>
         </div>
         <button
            onClick={() => window.print()}
            className="bg-brand text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 shadow-lg shadow-emerald-900/10 hover:bg-emerald-900 transition-colors">
            <Download size={18} />
            Download PDF
         </button>
      </div>

      <div className="bg-white rounded-[2rem] border border-emerald-50 shadow-2xl p-8 md:p-12 text-slate-800">
        <div className="border-b-4 border-brand pb-8 mb-8 text-center space-y-4">
           <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight uppercase break-words">Vineet Bhasin, CFA</h2>
           <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-slate-600 font-medium">
             <a href="mailto:vb528@georgetown.edu" className="flex items-center gap-2 hover:text-brand break-all"><Mail size={16} className="shrink-0" /> vb528@georgetown.edu</a>
             <span className="hidden sm:inline">|</span>
             <a href="https://linkedin.com/in/vineet-bhasin-cfa" className="flex items-center gap-2 hover:text-brand break-all"><Linkedin size={16} className="shrink-0" /> in/vineet-bhasin-cfa</a>
             <span className="hidden sm:inline">|</span>
             <span className="flex items-center gap-2 whitespace-nowrap">(202) 650-3664</span>
           </div>
        </div>

        {/* Education */}
        <section className="mb-12">
           <div className="flex items-center gap-3 border-b-2 border-slate-100 pb-2 mb-6">
              <GraduationCap className="text-brand" size={24} />
              <h3 className="text-xl font-bold tracking-widest uppercase text-slate-800">Education</h3>
           </div>
           
           <div className="space-y-8">
             <div>
               <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2">
                 <h4 className="text-lg font-bold">Georgetown University, McDonough School of Business</h4>
                 <span className="text-slate-500 font-bold text-sm">Washington D.C.</span>
               </div>
               <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 text-brand font-medium">
                 <p className="italic">Master of Business Administration</p>
                 <span className="text-sm">July 2024 - May 2026</span>
               </div>
               <ul className="space-y-2 text-slate-600 list-disc ml-5">
                  <li className="pl-2"><strong>Teaching Assistant:</strong> Tutored 200+ peers in Analytical Problem Solving course; recorded sessions for future tutor trainings</li>
                  <li className="pl-2"><strong>Peer Advisor</strong> for students recruiting in Venture Capital and Corporate Finance roles that helped in securing internships</li>
                  <li className="pl-2"><strong>Consulting Project with Neuberger Berman:</strong> Built a growth strategy to expand their private equity and credit investment arm in Japan; crafted a data-backed GTM strategy for fundraises by collecting data through structured interviews with asset managers</li>
               </ul>
             </div>

             <div className="flex flex-col md:flex-row justify-between items-start md:items-center font-bold">
               <h4 className="text-lg">CFA Charterholder</h4>
               <span className="text-brand">July 2023</span>
             </div>

             <div>
               <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2">
                 <h4 className="text-lg font-bold">University of Delhi</h4>
                 <span className="text-slate-500 font-bold text-sm">New Delhi, India</span>
               </div>
               <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 text-brand font-medium">
                 <p className="italic">Bachelor of Management Studies</p>
                 <span className="text-sm">August 2017 - June 2020</span>
               </div>
               <ul className="space-y-2 text-slate-600 list-disc ml-5">
                  <li className="pl-2"><strong>President of Consulting Club:</strong> Completed 25+ projects; Bain-BCG actively recruited and added the school as a target school</li>
               </ul>
             </div>
           </div>
        </section>

        {/* Experience */}
        <section className="mb-12">
           <div className="flex items-center gap-3 border-b-2 border-slate-100 pb-2 mb-6">
              <Building2 className="text-brand" size={24} />
              <h3 className="text-xl font-bold tracking-widest uppercase text-slate-800">Experience</h3>
           </div>

           <div className="space-y-10">
             <div>
               <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2">
                 <h4 className="text-base sm:text-lg font-bold uppercase tracking-widest break-words">Amazon</h4>
                 <span className="text-slate-500 font-bold text-sm">Seattle, WA</span>
               </div>
               <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 text-brand font-medium">
                 <p className="italic">Finance Manager Intern</p>
                 <span className="text-sm">May 2025 - August 2025</span>
               </div>
               <ul className="space-y-3 text-slate-600 list-disc ml-5">
                  <li className="pl-2"><strong>Business Performance Analysis:</strong> Owned performance analysis for Amazon's $16B+ all-up 3P Seller business across three regions by partnering with engineering and data science teams to rebuild extraction logics applied to data, improving segmentation accuracy</li>
                  <li className="pl-2"><strong>Unit Economics Modeling:</strong> Built a working unit economics frameworks capturing fees, costs, and variable expenses on actual transaction data that replaced assumption-based rollups in the central P&L system, saving 2,300+ hours/year in manual reconciliation</li>
                  <li className="pl-2"><strong>Margin Diagnostics:</strong> Modeled contribution margins by integrating ARPU, CAC, LTV uplift metrics and headcount, identifying key cost levers and revenue drivers and quantifying ROI across acquisition channels, pricing strategies, and customer segments</li>
               </ul>
             </div>

             <div>
               <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2">
                 <h4 className="text-base sm:text-lg font-bold uppercase tracking-widest break-words">Reasoned Ventures <span className="text-sm font-medium normal-case text-slate-500">($150M multi-stage fund)</span></h4>
                 <span className="text-slate-500 font-bold text-sm">Mumbai, India</span>
               </div>
               <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 text-brand font-medium">
                 <p className="italic">Investment Associate</p>
                 <span className="text-sm">October 2023 - June 2024</span>
               </div>
               <ul className="space-y-3 text-slate-600 list-disc ml-5">
                  <li className="pl-2"><strong>Commercial Due Diligence:</strong> Built an investment evaluation framework combining quantitative metrics (ARR, cash burn, LTV/CAC, latency) and qualitative factors (moat, team, scalability); allocated $10M in two Series-A rounds in software infrastructure companies</li>
                  <li className="pl-2"><strong>Financial Forecasts:</strong> Established valuation benchmarks for 15+ Fintech and Enterprise SaaS targets by performing a precedents study of recent fundraises; normalized EBITDA and Revenue multiples (EV/EBITDA, EV/Sales) across a peer group of 10+ public and private companies to determine appropriate entry valuation ranges, adjusting for size and control premiums</li>
                  <li className="pl-2"><strong>Monetization Strategy Support:</strong> Defined subscription, usage-based and one-time pricing models for a portfolio company (e-commerce sellers' enabler), tested for pricing changes and bundling strategies, and modeled willingness to pay and price elasticity; unlocked revenue streams of $1M, increased premium tier adoption by 57% and secured $3M of fundraising commitments</li>
               </ul>
             </div>

             <div>
               <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2">
                 <h4 className="text-base sm:text-lg font-bold uppercase tracking-widest break-words">Transition VC <span className="text-sm font-medium normal-case text-slate-500">($80M Early-Stage Fund)</span></h4>
                 <span className="text-slate-500 font-bold text-sm">Bangalore, India</span>
               </div>
               <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 text-brand font-medium">
                 <p className="italic">Investment Associate</p>
                 <span className="text-sm">May 2022 - September 2023</span>
               </div>
               <ul className="space-y-3 text-slate-600 list-disc ml-5">
                  <li className="pl-2"><strong>Deal Ownership:</strong> Led execution of $1.5M+ in early-stage investments by translating financial forecasts and product strategy into IC memos, executing term sheets, SSA/SHA agreements, and deal closures with legal partners, owning end-to-end financial evaluation</li>
                  <li className="pl-2"><strong>Investment Committee Materials:</strong> Prepared investment memos synthesizing technical and commercial diligence using Tableau and Quicksight; implemented a standardized reporting framework and a base statistical model that reduced memo creation time by 73%</li>
                  <li className="pl-2"><strong>Strategy Evaluation:</strong> Created revenue builds (bottom-up/cohort/funnel based) and cost builds, and integrated forecasts with unit economics and capex models to see financial impact of product decisions like new segment, price change and faster roadmap</li>
                  <li className="pl-2"><strong>Opportunity Sizing:</strong> Built TAM/SAM/SOM analysis, conducted customer interviews and did competitor benchmarking to identify white spaces, define target segments and acquisition channels, understand product roadmaps and prioritize product features</li>
                  <li className="pl-2"><strong>Capital Strategy:</strong> Secured $2M from the Kerala Government and participated in formation of startup policies worth over $35M</li>
                  <li className="pl-2"><strong>Talent Development:</strong> Mentored four analysts and supervised diligence checklists; improving deal throughput by 70% m-o-m</li>
               </ul>
             </div>

             <div>
               <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2">
                 <h4 className="text-base sm:text-lg font-bold uppercase tracking-widest break-words">Oxane Partners <span className="text-sm font-medium normal-case text-slate-500">(Private Credit Solutions managing $800B AUM)</span></h4>
                 <span className="text-slate-500 font-bold text-sm">Gurugram, India</span>
               </div>
               <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 text-brand font-medium">
                 <p className="italic">Analyst - Portfolio Management Group</p>
                 <span className="text-sm">October 2020 - August 2021</span>
               </div>
               <ul className="space-y-3 text-slate-600 list-disc ml-5">
                  <li className="pl-2"><strong>Portfolio Monitoring:</strong> Led onboarding of $100M+ U.S. and European distressed mortgage portfolios by setting up valuation models, risk monitoring frameworks and SQL-based data pipelines for monthly data extraction. Conducted sensitivity analysis on interest rate and default scenarios; developed automated report generation, cutting manual effort by 80% and delivery time from five to two days</li>
               </ul>
             </div>
           </div>
        </section>

        {/* Distinctions */}
        <section>
           <div className="flex items-center gap-3 border-b-2 border-slate-100 pb-2 mb-6">
              <Trophy className="text-brand" size={24} />
              <h3 className="text-xl font-bold tracking-widest uppercase text-slate-800">Distinctions</h3>
           </div>
           
           <div className="space-y-6">
             <div className="grid md:grid-cols-[200px_1fr] gap-4">
                <h4 className="font-bold text-slate-800 mt-1">Side Projects</h4>
                <p className="text-slate-600 leading-relaxed">
                  Assisted a family restauranteur expand to six pizza stores by doing location mapping and establishing best practices of cashflow and human resource management; sold three stores for a 3x return within a year. Built an operations management plan for a family Airbnb venture comprising of 50+ residential properties.
                </p>
             </div>
             <div className="grid md:grid-cols-[200px_1fr] gap-4">
                <h4 className="font-bold text-slate-800">Technical Skills</h4>
                <p className="text-slate-600">
                  Financial modeling, M-365, SQL, Bloomberg, CapitalIQ, Alteryx, Tableau, PowerBi, Hyperion, Cognos
                </p>
             </div>
           </div>
        </section>

      </div>
    </div>
  );
}
