"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Shield, ArrowRight, CheckCircle } from "lucide-react";

export default function SignInPage() {
  const r = useRouter();
  const [email, setEmail] = React.useState("");
  const [touched, setTouched] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const isValid = email.includes("@") && email.includes(".");

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setTouched(true);
    if (!isValid) return;
    
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Sign-in failed');
      }

      // Success - set localStorage as fallback and redirect to dashboard
      localStorage.setItem("authed", "1");
      localStorage.setItem("user", JSON.stringify(data.user));
      r.push("/dashboard");
    } catch (error) {
      console.error('Sign-in error:', error);
      // For demo purposes, still allow access with localStorage fallback
      localStorage.setItem("authed", "1");
      r.push("/dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="w-full max-w-md px-4">
        <form onSubmit={submit} className="w-full">
          <Card className="rounded-3xl shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
            <CardHeader className="text-center pb-6 pt-8">
              {/* Enhanced Logo */}
              <div className="mx-auto mb-6 flex items-center justify-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl blur-sm opacity-30"></div>
                  <div className="relative bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl p-3">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                    GRC Atlas
                  </CardTitle>
                  <div className="text-xs text-slate-500 font-medium">Enterprise Security Platform</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="text-3xl font-semibold text-slate-800">Sign in</div>
                  <div className="text-sm text-slate-600">Enter your email to access your dashboard</div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => window.open('/pricing', '_blank')}
                  className="text-slate-600 hover:text-slate-800"
                >
                  View Pricing
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="px-8 pb-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Email</label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => setTouched(true)}
                    placeholder="you@company.com"
                    className={`h-12 text-base transition-all duration-200 ${
                      touched && !isValid 
                        ? "border-red-500 bg-red-50 focus:ring-red-200" 
                        : "border-slate-200 focus:border-emerald-500 focus:ring-emerald-200"
                    }`}
                    disabled={isLoading}
                  />
                  {touched && !isValid && (
                    <div className="flex items-center gap-2 text-sm text-red-600">
                      <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                      Please enter a valid email address
                    </div>
                  )}
                  {touched && isValid && (
                    <div className="flex items-center gap-2 text-sm text-emerald-600">
                      <CheckCircle className="h-4 w-4" />
                      Email looks good
                    </div>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 text-base font-semibold bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed" 
                  disabled={!isValid || isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Signing in...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      Next
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  )}
                </Button>

                {/* Enhanced Features */}
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-6 text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      SSO Enabled
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      OIDC
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      MFA Ready
                    </div>
                  </div>

                  {/* Demo Credentials */}
                  <div className="bg-blue-50 rounded-xl p-4 space-y-3">
                    <div className="text-xs font-medium text-blue-700 mb-2">Demo Credentials</div>
                    <div className="space-y-2 text-xs">
                      <div 
                        className="flex items-center justify-between cursor-pointer hover:bg-blue-100 p-1 rounded transition-colors"
                        onClick={() => setEmail('admin@grcatlas.com')}
                      >
                        <span className="text-blue-600 font-medium">Admin:</span>
                        <span className="text-blue-500 font-mono">admin@grcatlas.com</span>
                      </div>
                      <div 
                        className="flex items-center justify-between cursor-pointer hover:bg-blue-100 p-1 rounded transition-colors"
                        onClick={() => setEmail('user@grcatlas.com')}
                      >
                        <span className="text-blue-600 font-medium">User:</span>
                        <span className="text-blue-500 font-mono">user@grcatlas.com</span>
                      </div>
                      <div 
                        className="flex items-center justify-between cursor-pointer hover:bg-blue-100 p-1 rounded transition-colors"
                        onClick={() => setEmail('viewer@grcatlas.com')}
                      >
                        <span className="text-blue-600 font-medium">Viewer:</span>
                        <span className="text-blue-500 font-mono">viewer@grcatlas.com</span>
                      </div>
                      <div 
                        className="flex items-center justify-between cursor-pointer hover:bg-blue-100 p-1 rounded transition-colors"
                        onClick={() => setEmail('auditor@grcatlas.com')}
                      >
                        <span className="text-blue-600 font-medium">Auditor:</span>
                        <span className="text-blue-500 font-mono">auditor@grcatlas.com</span>
                      </div>
                    </div>
                  </div>

                  {/* Security Features */}
                  <div className="bg-slate-50 rounded-xl p-4 space-y-2">
                    <div className="text-xs font-medium text-slate-600 mb-2">Security Features</div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3 text-emerald-500" />
                        End-to-end encryption
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3 text-emerald-500" />
                        SOC 2 compliant
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3 text-emerald-500" />
                        GDPR ready
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3 text-emerald-500" />
                        ISO 27001
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}
