"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  BarChart3, 
  Users, 
  FileText, 
  ChevronDown, 
  CheckCircle, 
  ArrowRight,
  Star,
  Building2,
  Lock,
  Zap,
  Globe,
  Target,
  TrendingUp,
  Award,
  Play
} from "lucide-react";

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const products = [
    {
      title: "Vendor Risk Management",
      description: "Control third-party vendor risk and improve your cyber security posture.",
      features: ["AI-powered Assessments", "Security Questionnaires", "Continuous Monitoring"],
      icon: <Shield className="h-6 w-6" />
    },
    {
      title: "Breach Risk Monitoring",
      description: "Monitor your business for data breaches and protect your customers' trust.",
      features: ["Attack Surface Management", "Threat Monitoring", "Real-time Alerts"],
      icon: <BarChart3 className="h-6 w-6" />
    },
    {
      title: "User Risk Management",
      description: "Unify identity, behavior, and threat signals to secure your workforce.",
      features: ["Identity Management", "Behavior Analytics", "Threat Detection"],
      icon: <Users className="h-6 w-6" />
    },
    {
      title: "Trust Exchange",
      description: "Streamline your trust management process with security questionnaire automation.",
      features: ["Questionnaire AI", "Trust Page", "Automation"],
      icon: <FileText className="h-6 w-6" />
    }
  ];

  const advantages = [
    {
      number: "01",
      title: "Unified",
      description: "Take control with a unified view of cyber risk across your organization."
    },
    {
      number: "02", 
      title: "Continuous",
      description: "Stay ahead of compliance by detecting control lapses as they happen."
    },
    {
      number: "03",
      title: "Actionable", 
      description: "React faster with AI powered detection, prioritization and orchestration."
    },
    {
      number: "04",
      title: "Measurable",
      description: "Monitor performance through a single real-time posture loop."
    }
  ];

  const testimonials = [
    {
      quote: "What used to take us a month to complete can now be done in a week. That's a 400% increase in productivity, and it means we can assess vendors much more quickly and keep pace with the business.",
      author: "Chemist Warehouse",
      role: "Security Team"
    },
    {
      quote: "UpGuard has saved us around 2,000 hours of assessment time, equivalent to two personnel per year.",
      author: "St John WA", 
      role: "IT Department"
    },
    {
      quote: "UpGuard isn't just a tool — it's an enabler. It helps us demonstrate to clients, regulators, and internal stakeholders that we take cybersecurity seriously. That's a game-changer in today's threat landscape.",
      author: "Anglo-Eastern",
      role: "Risk Management"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <Shield className="h-8 w-8 text-blue-500" />
                <span className="text-xl font-bold">GRC Atlas</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <div className="relative group">
                <button className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors">
                  <span>Products</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                <div className="absolute top-full left-0 mt-2 w-64 bg-gray-800 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="p-4 space-y-3">
                    <a href="#vendor-risk" className="block text-white hover:text-blue-400 transition-colors">
                      <div className="font-semibold">Vendor Risk Management</div>
                      <div className="text-sm text-gray-400">Control third-party vendor risk</div>
                    </a>
                    <a href="#breach-risk" className="block text-white hover:text-blue-400 transition-colors">
                      <div className="font-semibold">Breach Risk Monitoring</div>
                      <div className="text-sm text-gray-400">Monitor data breaches</div>
                    </a>
                    <a href="#user-risk" className="block text-white hover:text-blue-400 transition-colors">
                      <div className="font-semibold">User Risk Management</div>
                      <div className="text-sm text-gray-400">Secure your workforce</div>
                    </a>
                    <a href="#trust-exchange" className="block text-white hover:text-blue-400 transition-colors">
                      <div className="font-semibold">Trust Exchange</div>
                      <div className="text-sm text-gray-400">Questionnaire automation</div>
                    </a>
                  </div>
                </div>
              </div>
              <div className="relative group">
                <button className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors">
                  <span>Solutions</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                <div className="absolute top-full left-0 mt-2 w-64 bg-gray-800 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="p-4 space-y-3">
                    <a href="#financial-services" className="block text-white hover:text-blue-400 transition-colors">
                      <div className="font-semibold">Financial Services</div>
                      <div className="text-sm text-gray-400">Secure customer data</div>
                    </a>
                    <a href="#technology" className="block text-white hover:text-blue-400 transition-colors">
                      <div className="font-semibold">Technology</div>
                      <div className="text-sm text-gray-400">Scale securely</div>
                    </a>
                    <a href="#healthcare" className="block text-white hover:text-blue-400 transition-colors">
                      <div className="font-semibold">Healthcare</div>
                      <div className="text-sm text-gray-400">Compliance & security</div>
                    </a>
                  </div>
                </div>
              </div>
              <a href="/pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</a>
              <div className="relative group">
                <button className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors">
                  <span>Resources</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                <div className="absolute top-full left-0 mt-2 w-64 bg-gray-800 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="p-4 space-y-3">
                    <a href="#blog" className="block text-white hover:text-blue-400 transition-colors">
                      <div className="font-semibold">Blog</div>
                      <div className="text-sm text-gray-400">Latest cybersecurity insights</div>
                    </a>
                    <a href="#breaches" className="block text-white hover:text-blue-400 transition-colors">
                      <div className="font-semibold">Breaches</div>
                      <div className="text-sm text-gray-400">Security research & news</div>
                    </a>
                    <a href="#resources" className="block text-white hover:text-blue-400 transition-colors">
                      <div className="font-semibold">eBooks & Reports</div>
                      <div className="text-sm text-gray-400">Insights and guides</div>
                    </a>
                    <a href="#events" className="block text-white hover:text-blue-400 transition-colors">
                      <div className="font-semibold">Events</div>
                      <div className="text-sm text-gray-400">Webinars & conferences</div>
                    </a>
                  </div>
                </div>
              </div>
              <a href="#customers" className="text-gray-300 hover:text-white transition-colors">Customers</a>
              <a href="#tour" className="text-gray-300 hover:text-white transition-colors">Tour</a>
              <a href="/signin" className="text-gray-300 hover:text-white transition-colors">Login</a>
            </div>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <a href="#" className="text-gray-300 hover:text-white underline transition-colors">
                Free trial
              </a>
              <Button 
                onClick={() => window.location.href = '/contact'}
                className="bg-gray-800 hover:bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2"
              >
                Get a demo
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-300 hover:text-white"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl lg:text-7xl font-bold mb-8 leading-tight">
              Risk clarity.
              <br />
              <span className="text-gray-400">Without the noise.</span>
            </h1>
            <p className="text-xl lg:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              Take control of cyber risk with the only platform that spans your supply chain, 
              attack surface, workforce, and trust relationships.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                onClick={() => window.location.href = '/contact'}
                size="lg"
                className="bg-white text-black hover:bg-gray-100 text-lg px-8 py-4 rounded-lg font-semibold"
              >
                Get a demo
              </Button>
              <Button 
                onClick={() => window.location.href = '/signin'}
                variant="outline"
                size="lg"
                className="border-gray-600 text-white hover:bg-gray-800 text-lg px-8 py-4 rounded-lg font-semibold"
              >
                Free trial
              </Button>
            </div>
            
            {/* Trust indicators */}
            <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 text-gray-400">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-400" />
                <span>Trusted by 45,000+ companies worldwide</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-blue-400" />
                <span>Voted #1 on G2</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-20 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product, index) => (
              <Card key={index} className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-colors">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      {product.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-white">{product.title}</h3>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {product.description}
                  </p>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    {product.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-2 text-sm text-gray-400">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Button 
                    onClick={() => {
                      if (product.title.includes('Vendor')) {
                        window.location.href = '/dashboard?tab=vendors';
                      } else if (product.title.includes('Breach')) {
                        window.location.href = '/dashboard?tab=risks';
                      } else if (product.title.includes('User')) {
                        window.location.href = '/dashboard?tab=settings';
                      } else if (product.title.includes('Trust')) {
                        window.location.href = '/dashboard?tab=vendors';
                      }
                    }}
                    variant="outline" 
                    className="w-full mt-4 border-gray-600 text-white hover:bg-gray-700"
                  >
                    Explore {product.title.split(' ')[0]}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* The CRPM Advantage */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              The CRPM Advantage
            </h2>
            <h3 className="text-2xl text-gray-400 mb-8">
              One posture. One platform.
            </h3>
            <Button 
              variant="outline"
              className="border-gray-600 text-white hover:bg-gray-800"
            >
              Explore the platform
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {advantages.map((advantage, index) => (
              <div key={index} className="text-center">
                <div className="text-6xl font-bold text-gray-600 mb-4">
                  {advantage.number}
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  {advantage.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {advantage.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="customers" className="py-20 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">
              Trusted by teams like yours
            </h2>
            <Button 
              onClick={() => window.location.href = '/contact'}
              variant="outline"
              className="border-gray-600 text-white hover:bg-gray-800"
            >
              Read all case studies
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-8">
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    "{testimonial.quote}"
                  </p>
                  <div className="border-t border-gray-700 pt-4">
                    <p className="font-semibold text-white">{testimonial.author}</p>
                    <p className="text-gray-400 text-sm">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            The unchallenged leader in third‑party risk management
          </h2>
          <div className="flex items-center justify-center gap-2 mb-8">
            <Award className="h-6 w-6 text-yellow-400" />
            <span className="text-xl text-gray-300">Voted #1 on G2</span>
          </div>
          <p className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto">
            Experience superior visibility and a simpler approach to cyber risk management
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => window.location.href = '/contact'}
              size="lg"
              className="bg-white text-black hover:bg-gray-100 text-lg px-8 py-4 rounded-lg font-semibold"
            >
              Get a demo
            </Button>
            <Button 
              onClick={() => window.location.href = '/signin'}
              variant="outline"
              size="lg"
              className="border-gray-600 text-white hover:bg-gray-800 text-lg px-8 py-4 rounded-lg font-semibold"
            >
              Free trial
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
            <div>
              <h3 className="text-white font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/dashboard?tab=reports" className="hover:text-white transition-colors">Reporting</a></li>
                <li><a href="/contact" className="hover:text-white transition-colors">Services</a></li>
                <li><a href="/dashboard?tab=vendors" className="hover:text-white transition-colors">Security ratings</a></li>
                <li><a href="/contact" className="hover:text-white transition-colors">Integrations</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Products</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/dashboard?tab=vendors" className="hover:text-white transition-colors">Vendor Risk</a></li>
                <li><a href="/dashboard?tab=risks" className="hover:text-white transition-colors">Breach Risk</a></li>
                <li><a href="/dashboard?tab=settings" className="hover:text-white transition-colors">User Risk</a></li>
                <li><a href="/dashboard?tab=vendors" className="hover:text-white transition-colors">Trust Exchange</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Solutions</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#financial-services" className="hover:text-white transition-colors">Financial Services</a></li>
                <li><a href="#technology" className="hover:text-white transition-colors">Technology</a></li>
                <li><a href="#healthcare" className="hover:text-white transition-colors">Healthcare</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#blog" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#breaches" className="hover:text-white transition-colors">Breaches</a></li>
                <li><a href="#resources" className="hover:text-white transition-colors">eBooks & Reports</a></li>
                <li><a href="#events" className="hover:text-white transition-colors">Events</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/contact" className="hover:text-white transition-colors">About us</a></li>
                <li><a href="/contact" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="/contact" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="/contact" className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Quick links</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/dashboard?tab=vendors" className="hover:text-white transition-colors">Third-Party Risk Management</a></li>
                <li><a href="/dashboard?tab=risks" className="hover:text-white transition-colors">Attack Surface Management</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Shield className="h-6 w-6 text-blue-500" />
              <span className="text-lg font-bold">GRC Atlas</span>
            </div>
            <div className="text-gray-400 text-sm">
              © 2024 GRC Atlas, Inc. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
