"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, Mail, Phone, MapPin, Clock, Users, CheckCircle } from "lucide-react";

export default function ContactPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      email: formData.get('email'),
      company: formData.get('company'),
      jobTitle: formData.get('jobTitle'),
      vendorCount: formData.get('vendorCount'),
      message: formData.get('message')
    };
    
    // Simulate form submission
    console.log('Form submitted:', data);
    alert('Thank you for your interest! Our sales team will contact you within 24 hours.');
    
    // Reset form
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 border-b border-slate-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 px-6 py-3 rounded-full text-sm font-medium mb-8 border border-blue-500/30">
              <Shield className="h-4 w-4" />
              <span>Get in touch with our experts</span>
            </div>
            <h1 className="text-6xl font-bold text-white mb-8 leading-tight">
              Contact Our Sales Team
            </h1>
            <p className="text-xl text-slate-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              Ready to transform your TPRM? Our experts are here to help you choose the perfect plan 
              and get started with GRC Atlas.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Form & Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-600">
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl font-bold text-white">
                Schedule a Demo
              </CardTitle>
              <p className="text-slate-300">
                Fill out the form below and we'll get back to you within 24 hours.
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      First Name
                    </label>
                    <Input 
                      type="text" 
                      name="firstName"
                      required
                      className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Last Name
                    </label>
                    <Input 
                      type="text" 
                      name="lastName"
                      required
                      className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                      placeholder="Doe"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Email Address
                  </label>
                  <Input 
                    type="email" 
                    name="email"
                    required
                    className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                    placeholder="john@company.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Company
                  </label>
                  <Input 
                    type="text" 
                    name="company"
                    required
                    className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                    placeholder="Acme Corporation"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Job Title
                  </label>
                  <Input 
                    type="text" 
                    name="jobTitle"
                    required
                    className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                    placeholder="CISO"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Number of Vendors
                  </label>
                  <select name="vendorCount" className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white">
                    <option>1-10 vendors</option>
                    <option>11-50 vendors</option>
                    <option>51-150 vendors</option>
                    <option>150+ vendors</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Message (Optional)
                  </label>
                  <textarea 
                    name="message"
                    rows={4}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400"
                    placeholder="Tell us about your TPRM needs..."
                  />
                </div>
                
                <Button 
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold"
                >
                  Schedule Demo
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <div className="space-y-8">
            <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-600">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-white">
                  Get in Touch
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-500/20 rounded-lg">
                    <Mail className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-slate-300">Email</p>
                    <p className="text-white font-medium">sales@grcatlas.com</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-500/20 rounded-lg">
                    <Phone className="h-5 w-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-slate-300">Phone</p>
                    <p className="text-white font-medium">+1 (555) 123-4567</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-500/20 rounded-lg">
                    <MapPin className="h-5 w-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-slate-300">Address</p>
                    <p className="text-white font-medium">123 Security St, San Francisco, CA 94105</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-orange-500/20 rounded-lg">
                    <Clock className="h-5 w-5 text-orange-400" />
                  </div>
                  <div>
                    <p className="text-slate-300">Business Hours</p>
                    <p className="text-white font-medium">Mon-Fri 9AM-6PM PST</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-600">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-white">
                  Why Choose GRC Atlas?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
                    <p className="text-slate-300">Enterprise-grade security and compliance</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
                    <p className="text-slate-300">30-day free trial with no credit card required</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
                    <p className="text-slate-300">Dedicated customer success team</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
                    <p className="text-slate-300">24/7 support for Enterprise customers</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
                    <p className="text-slate-300">Custom integrations and onboarding</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-blue-600 text-white py-20">
        <div className="max-w-6xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-3xl mx-auto">
            Join 500+ organizations already using GRC Atlas for their TPRM needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button 
              onClick={() => window.location.href = '/signin'}
              className="bg-white text-purple-600 hover:bg-purple-50 h-12 px-8 text-lg font-semibold"
            >
              Start Free Trial
            </Button>
            <Button 
              onClick={() => window.location.href = '/pricing'}
              variant="outline" 
              className="border-2 border-white text-white hover:bg-white hover:text-purple-600 h-12 px-8 text-lg font-semibold"
            >
              View Pricing
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
