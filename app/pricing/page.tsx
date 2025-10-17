"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Shield, Zap, Building2, Users, BarChart3, Lock, Globe, Headphones } from "lucide-react";

export default function PricingPage() {
  const handlePlanClick = (planName: string) => {
    if (planName === 'Free') {
      // Redirect to sign-in for free trial
      window.location.href = '/signin';
    } else {
      // For paid plans, redirect to contact page
      window.location.href = '/contact';
    }
  };

  const handleStartTrial = () => {
    window.location.href = '/signin';
  };

  const handleScheduleDemo = () => {
    window.location.href = '/contact';
  };

  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "/month",
      description: "Discover the basics",
      features: [
        "Monitor 5 vendors for free",
        "Vendor security ratings",
        "Assessment & remediation workflows",
        "Basic risk scoring",
        "Standard support"
      ],
      cta: "Try for free",
      ctaVariant: "default" as const,
      popular: false,
      icon: <Shield className="h-6 w-6 text-blue-500" />
    },
    {
      name: "Starter",
      price: "$1,599",
      period: "/month",
      billing: "Billed annually",
      description: "Get started with Vendor Risk Management",
      features: [
        "Everything in Free, and:",
        "Monitor 50 vendors",
        "Monitor your own attack surface",
        "API & Integrations",
        "Typosquatting & identity breaches",
        "Advanced risk analytics",
        "Custom questionnaires"
      ],
      cta: "Book a demo",
      ctaVariant: "default" as const,
      popular: false,
      icon: <Zap className="h-6 w-6 text-green-500" />
    },
    {
      name: "Professional",
      price: "$3,333",
      period: "/month",
      billing: "Billed annually",
      description: "Streamline & scale your program",
      features: [
        "Everything in Starter, and:",
        "Monitor 150 vendors",
        "Custom co-branding",
        "Templates & automated vendor classification",
        "Audit log",
        "Advanced reporting",
        "Workflow automation",
        "Priority support"
      ],
      cta: "Book a demo",
      ctaVariant: "default" as const,
      popular: true,
      icon: <BarChart3 className="h-6 w-6 text-purple-500" />
    },
    {
      name: "Enterprise",
      price: "Contact us",
      period: "",
      description: "Built for large teams and multi-org operations",
      features: [
        "Everything in Professional, and:",
        "Monitor unlimited vendors",
        "Subsidiary monitoring",
        "Designated support",
        "Custom integrations",
        "Dedicated account manager",
        "SLA guarantees",
        "On-premise deployment option"
      ],
      cta: "Book a demo",
      ctaVariant: "default" as const,
      popular: false,
      icon: <Building2 className="h-6 w-6 text-orange-500" />
    }
  ];

  const enterpriseFeatures = [
    {
      icon: <Users className="h-5 w-5 text-blue-500" />,
      title: "Multi-tenant Architecture",
      description: "Support for multiple business units and subsidiaries"
    },
    {
      icon: <Lock className="h-5 w-5 text-green-500" />,
      title: "Advanced Security",
      description: "SSO, SAML, RBAC, and enterprise-grade encryption"
    },
    {
      icon: <Globe className="h-5 w-5 text-purple-500" />,
      title: "Global Compliance",
      description: "GDPR, CCPA, SOC 2, ISO 27001, and regional frameworks"
    },
    {
      icon: <Headphones className="h-5 w-5 text-orange-500" />,
      title: "24/7 Support",
      description: "Dedicated support team with guaranteed response times"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 border-b border-slate-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 px-6 py-3 rounded-full text-sm font-medium mb-8 border border-blue-500/30">
              <Shield className="h-4 w-4" />
              <span>Trusted by 500+ organizations worldwide</span>
            </div>
            <h1 className="text-6xl font-bold text-white mb-8 leading-tight">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-slate-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              Choose the perfect plan for your organization's TPRM needs. 
              Scale as you grow with our flexible pricing tiers designed for every stage of your journey.
            </p>
            <div className="flex items-center justify-center gap-8 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-400" />
                <span>30-day free trial</span>
              </div>
              <div className="w-1 h-1 bg-slate-500 rounded-full"></div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-400" />
                <span>No setup fees</span>
              </div>
              <div className="w-1 h-1 bg-slate-500 rounded-full"></div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-400" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan, index) => (
            <Card 
              key={plan.name} 
              className={`relative rounded-3xl transition-all duration-300 hover:shadow-2xl border-2 flex flex-col h-full ${
                plan.popular 
                  ? 'ring-2 ring-purple-500 shadow-2xl scale-105 border-purple-400 bg-gradient-to-br from-slate-800 to-slate-900' 
                  : 'hover:shadow-xl border-slate-600 hover:border-slate-500 bg-gradient-to-br from-slate-800 to-slate-900'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-purple-500 text-white px-4 py-1 text-sm font-medium">
                    <Star className="h-3 w-3 mr-1" />
                    Best value
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-6 pt-8">
                <div className="flex justify-center mb-6">
                  <div className={`p-4 rounded-2xl ${
                    plan.popular 
                      ? 'bg-purple-500/20 border border-purple-400/30' 
                      : plan.name === 'Free' 
                        ? 'bg-blue-500/20 border border-blue-400/30' 
                        : plan.name === 'Starter' 
                          ? 'bg-green-500/20 border border-green-400/30' 
                          : 'bg-orange-500/20 border border-orange-400/30'
                  }`}>
                    {plan.icon}
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-white mb-2">
                  {plan.name}
                </CardTitle>
                <div className="mb-4">
                  <span className="text-5xl font-bold text-white">
                    {plan.price}
                  </span>
                  <span className="text-slate-400 text-xl ml-1">
                    {plan.period}
                  </span>
                </div>
                {plan.billing && (
                  <p className="text-sm text-slate-400 mb-4 font-medium">
                    {plan.billing}
                  </p>
                )}
                <p className="text-slate-300 text-base leading-relaxed">
                  {plan.description}
                </p>
              </CardHeader>

              <CardContent className="pt-0 px-8 flex-1 flex flex-col">
                <ul className="space-y-4 mb-8 flex-1">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        <Check className="h-5 w-5 text-green-400" />
                      </div>
                      <span className="text-sm text-slate-300 leading-relaxed">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto">
                  <Button 
                    onClick={() => handlePlanClick(plan.name)}
                    className={`w-full h-14 text-base font-semibold ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-xl hover:shadow-2xl' 
                        : plan.name === 'Free'
                          ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-xl hover:shadow-2xl'
                          : plan.name === 'Starter'
                            ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-xl hover:shadow-2xl'
                            : 'bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white shadow-xl hover:shadow-2xl'
                    }`}
                    size="lg"
                  >
                    {plan.cta}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Enterprise Features */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-white/10 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Building2 className="h-4 w-4" />
              <span>Enterprise Ready</span>
            </div>
            <h2 className="text-4xl font-bold mb-6">
              Enterprise-Grade Features
            </h2>
            <p className="text-xl text-slate-300 max-w-4xl mx-auto leading-relaxed">
              Built for large organizations with complex compliance requirements and the highest security standards
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {enterpriseFeatures.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="flex justify-center mb-6">
                  <div className="p-4 rounded-2xl bg-white/10 group-hover:bg-white/20 transition-colors duration-300">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-300 text-base leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Everything you need to know about GRC Atlas pricing and features
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-slate-800/50 p-8 rounded-2xl shadow-xl border border-slate-600 hover:border-slate-500 transition-colors">
              <h3 className="text-xl font-semibold text-white mb-4">
                Can I change plans anytime?
              </h3>
              <p className="text-slate-300 leading-relaxed">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, 
                and we'll prorate any billing differences to ensure you only pay for what you use.
              </p>
            </div>
            
            <div className="bg-slate-800/50 p-8 rounded-2xl shadow-xl border border-slate-600 hover:border-slate-500 transition-colors">
              <h3 className="text-xl font-semibold text-white mb-4">
                What happens if I exceed my vendor limit?
              </h3>
              <p className="text-slate-300 leading-relaxed">
                We'll notify you when you're approaching your limit. You can upgrade your plan 
                or add additional vendors for $79/month per vendor with no long-term commitment.
              </p>
            </div>
            
            <div className="bg-slate-800/50 p-8 rounded-2xl shadow-xl border border-slate-600 hover:border-slate-500 transition-colors">
              <h3 className="text-xl font-semibold text-white mb-4">
                Is there a free trial?
              </h3>
              <p className="text-slate-300 leading-relaxed">
                Yes, we offer a 30-day free trial for all paid plans. No credit card required 
                to start your trial, and you can cancel anytime during the trial period.
              </p>
            </div>
            
            <div className="bg-slate-800/50 p-8 rounded-2xl shadow-xl border border-slate-600 hover:border-slate-500 transition-colors">
              <h3 className="text-xl font-semibold text-white mb-4">
                What support is included?
              </h3>
              <p className="text-slate-300 leading-relaxed">
                Free and Starter plans include standard email support. Professional plans get 
                priority support, and Enterprise plans include dedicated support and account management.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-blue-600 text-white py-20">
        <div className="max-w-6xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium mb-8">
            <Star className="h-4 w-4" />
            <span>Join 500+ organizations worldwide</span>
          </div>
          <h2 className="text-5xl font-bold mb-6 leading-tight">
            Ready to Transform Your TPRM?
          </h2>
          <p className="text-xl text-purple-100 mb-12 max-w-3xl mx-auto leading-relaxed">
            Join thousands of organizations already using GRC Atlas to streamline their vendor risk management, 
            ensure compliance, and reduce risk across their entire supply chain.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button 
              onClick={handleStartTrial}
              size="lg" 
              className="bg-white text-purple-600 hover:bg-purple-50 h-14 px-8 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <Shield className="h-5 w-5 mr-2" />
              Start Free Trial
            </Button>
            <Button 
              onClick={handleScheduleDemo}
              size="lg" 
              variant="outline" 
              className="border-2 border-white text-white hover:bg-white hover:text-purple-600 h-14 px-8 text-lg font-semibold"
            >
              <Users className="h-5 w-5 mr-2" />
              Schedule Demo
            </Button>
          </div>
          <p className="text-purple-200 text-sm mt-8">
            No credit card required • 30-day free trial • Cancel anytime
          </p>
        </div>
      </div>
    </div>
  );
}
