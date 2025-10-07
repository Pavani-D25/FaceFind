import React, { useState, useEffect } from "react";
import {
  Camera,
  Users,
  Zap,
  Shield,
  Upload,
  Search,
  Bell,
  ChevronRight,
  CheckCircle,
  Star,
  Menu,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function FaceFind() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <Camera className="w-6 h-6" />,
      title: "AI Face Detection",
      description:
        "Advanced deep learning algorithms detect and recognize faces in group photos with 99% accuracy",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Instant Matching",
      description:
        "Match profile photos with group images in seconds, processing hundreds of photos simultaneously",
    },
    {
      icon: <Bell className="w-6 h-6" />,
      title: "Auto Delivery",
      description:
        "Automatically notify and share group photos with identified individuals - no manual tagging",
    },
  ];

  const steps = [
    {
      icon: <Upload />,
      title: "Upload Profile",
      desc: "Users upload their profile photo",
    },
    {
      icon: <Camera />,
      title: "Upload Groups",
      desc: "Photographers upload group photos",
    },
    {
      icon: <Search />,
      title: "AI Matches",
      desc: "System finds faces automatically",
    },
    { icon: <Bell />, title: "Auto Share", desc: "Photos delivered to users" },
  ];

  const pricing = [
    {
      name: "Starter",
      price: "$29",
      period: "/month",
      features: [
        "Up to 1,000 photos",
        "10 events per month",
        "Basic face recognition",
        "Email support",
        "5 GB storage",
      ],
      popular: false,
    },
    {
      name: "Professional",
      price: "$99",
      period: "/month",
      features: [
        "Up to 10,000 photos",
        "Unlimited events",
        "Advanced AI recognition",
        "Priority support",
        "50 GB storage",
        "Custom branding",
        "Analytics dashboard",
      ],
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      features: [
        "Unlimited photos",
        "Unlimited events",
        "Dedicated AI server",
        "24/7 phone support",
        "Unlimited storage",
        "White label solution",
        "API access",
        "Custom integrations",
      ],
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
     {/* Navigation */}
<nav
  className={`fixed w-full z-50 transition-all duration-300 ${
    scrolled
      ? "bg-slate-900/95 backdrop-blur-lg shadow-lg"
      : "bg-transparent"
  }`}
>
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between items-center h-16">
      <div className="flex items-center space-x-2">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
          <Camera className="w-6 h-6" />
        </div>
        <span className="text-xl font-bold">FaceFind</span>
      </div>

      {/* ✅ FIXED: Desktop Navigation with Links */}
      <div className="hidden md:flex items-center space-x-8">
        <a href="#features" className="hover:text-purple-400 transition">
          Features
        </a>
        <a href="#how-it-works" className="hover:text-purple-400 transition">
          How It Works
        </a>
        <a href="#pricing" className="hover:text-purple-400 transition">
          Pricing
        </a>
        <Link to="/login" className="px-4 py-2 text-purple-400 hover:text-purple-300 transition">
          Sign In
        </Link>
        <Link 
          to="/signup" 
          className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all"
        >
          Get Started
        </Link>
      </div>

      <button
        className="md:hidden"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? <X /> : <Menu />}
      </button>
    </div>
  </div>

  {/* ✅ Mobile menu already has Links - this is correct */}
  {mobileMenuOpen && (
    <div className="md:hidden bg-slate-900/95 backdrop-blur-lg border-t border-purple-500/20">
      <div className="px-4 py-4 space-y-3">
        <a href="#features" className="block hover:text-purple-400 transition">
          Features
        </a>
        <a href="#how-it-works" className="block hover:text-purple-400 transition">
          How It Works
        </a>
        <a href="#pricing" className="block hover:text-purple-400 transition">
          Pricing
        </a>
        <Link to="/login" className="block px-4 py-2 text-purple-400 hover:text-purple-300 transition">
          Sign In
        </Link>
        <Link 
          to="/signup" 
          className="block px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all text-center"
        >
          Get Started
        </Link>
      </div>
    </div>
  )}
</nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-block px-4 py-2 bg-purple-500/20 rounded-full border border-purple-500/30 text-purple-300 text-sm">
                🚀 AI-Powered Photo Recognition
              </div>

              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                Find Yourself in
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {" "}
                  Group Photos{" "}
                </span>
                Automatically
              </h1>

              <p className="text-xl text-gray-300">
                Revolutionary AI technology that identifies individuals in group
                photos and delivers them automatically. Perfect for
                photographers, event organizers, and anyone dealing with large
                photo collections.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/signup"
                  className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-semibold hover:shadow-2xl hover:shadow-purple-500/50 transition-all transform hover:scale-105 flex items-center justify-center"
                >
                  Start Free Trial
                  <ChevronRight className="ml-2 w-5 h-5" />
                </Link>
                <button className="px-8 py-4 bg-white/10 backdrop-blur rounded-lg font-semibold hover:bg-white/20 transition-all border border-white/20">
                  Watch Demo
                </button>
              </div>

              <div className="flex items-center gap-8 pt-4">
                <div>
                  <div className="flex items-center text-yellow-400 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-400">
                    500+ Happy Photographers
                  </p>
                </div>
                <div className="h-12 w-px bg-white/20"></div>
                <div>
                  <p className="text-2xl font-bold">99.2%</p>
                  <p className="text-sm text-gray-400">Recognition Accuracy</p>
                </div>
              </div>
            </div>

            {/* <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl blur-3xl opacity-30 animate-pulse"></div>
              <div className="relative bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/30">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-slate-700/50 rounded-xl">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-3 bg-slate-600 rounded w-3/4 mb-2"></div>
                      <div className="h-2 bg-slate-600 rounded w-1/2"></div>
                    </div>
                    <CheckCircle className="w-6 h-6 text-green-400" />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div
                        key={i}
                        className="aspect-square bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg animate-pulse"
                        style={{ animationDelay: `${i * 0.1}s` }}
                      ></div>
                    ))}
                  </div>

                  <div className="p-4 bg-green-500/20 border border-green-500/30 rounded-xl">
                    <div className="flex items-center gap-2 text-green-400">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-semibold">3 matches found!</span>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl blur-3xl opacity-30 animate-pulse"></div>
              <div className="relative bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/30">
                <div className="space-y-4">
                  {/* Profile Upload Example */}
                  <div className="flex items-center gap-3 p-4 bg-slate-700/50 rounded-xl">
                    <img 
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" 
                      alt="Profile" 
                      className="w-12 h-12 rounded-full object-cover border-2 border-purple-500"
                    />
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-white">Sarah Johnson</div>
                      <div className="text-xs text-gray-400">Profile uploaded</div>
                    </div>
                    <CheckCircle className="w-6 h-6 text-green-400" />
                  </div>

                  {/* Group Photo Grid */}
                  <div className="grid grid-cols-3 gap-3">
                    <img 
                      src="https://images.unsplash.com/photo-1511895426328-dc8714191300?w=200&h=200&fit=crop" 
                      alt="Group 1" 
                      className="aspect-square rounded-lg object-cover border-2 border-green-400/50 shadow-lg shadow-green-400/20"
                    />
                    <img 
                      src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=200&h=200&fit=crop" 
                      alt="Group 2" 
                      className="aspect-square rounded-lg object-cover"
                    />
                    <img 
                      src="https://images.unsplash.com/photo-1543269865-cbf427effbad?w=200&h=200&fit=crop" 
                      alt="Group 3" 
                      className="aspect-square rounded-lg object-cover border-2 border-green-400/50 shadow-lg shadow-green-400/20"
                    />
                    <img 
                      src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=200&h=200&fit=crop" 
                      alt="Group 4" 
                      className="aspect-square rounded-lg object-cover"
                    />
                    <img 
                      src="https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=200&h=200&fit=crop" 
                      alt="Group 5" 
                      className="aspect-square rounded-lg object-cover border-2 border-green-400/50 shadow-lg shadow-green-400/20"
                    />
                    <img 
                      src="https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?w=200&h=200&fit=crop" 
                      alt="Group 6" 
                      className="aspect-square rounded-lg object-cover"
                    />
                  </div>

                  {/* Match Result */}
                  <div className="p-4 bg-green-500/20 border border-green-500/30 rounded-xl">
                    <div className="flex items-center gap-2 text-green-400 mb-2">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-semibold">3 matches found!</span>
                    </div>
                    <p className="text-xs text-gray-400">Photos automatically delivered to Sarah's account</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-400">
              Everything you need to manage and deliver photos effortlessly
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className={`p-8 rounded-2xl transition-all duration-500 cursor-pointer ${
                  activeFeature === idx
                    ? "bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-2 border-purple-500/50 transform scale-105"
                    : "bg-slate-800/30 border border-slate-700/50 hover:border-purple-500/30"
                }`}
                onMouseEnter={() => setActiveFeature(idx)}
              >
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-8 mt-16">
            <div className="p-8 bg-slate-800/30 rounded-2xl border border-slate-700/50">
              <Users className="w-12 h-12 text-purple-400 mb-4" />
              <h3 className="text-2xl font-bold mb-3">Batch Processing</h3>
              <p className="text-gray-400">
                Upload hundreds of group photos at once. Our AI processes them
                in parallel, saving you hours of manual work.
              </p>
            </div>
            <div className="p-8 bg-slate-800/30 rounded-2xl border border-slate-700/50">
              <Shield className="w-12 h-12 text-purple-400 mb-4" />
              <h3 className="text-2xl font-bold mb-3">Privacy First</h3>
              <p className="text-gray-400">
                End-to-end encryption for all photos. Users control their data
                and can delete their profile anytime.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-gray-400">
              Simple, fast, and fully automated
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, idx) => (
              <div key={idx} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4 transform transition hover:scale-110">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-gray-400">{step.desc}</p>
                </div>
                {idx < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-1/2 w-full h-px bg-gradient-to-r from-purple-500 to-pink-500"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Simple Pricing</h2>
            <p className="text-xl text-gray-400">
              Choose the plan that fits your needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {pricing.map((plan, idx) => (
              <div
                key={idx}
                className={`relative p-8 rounded-2xl transition-all ${
                  plan.popular
                    ? "bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-2 border-purple-500 transform scale-105"
                    : "bg-slate-800/30 border border-slate-700/50"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-sm font-semibold">
                    Most Popular
                  </div>
                )}

                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-5xl font-bold">{plan.price}</span>
                  <span className="text-gray-400">{plan.period}</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/signup"
                  className={`w-full py-3 rounded-lg font-semibold transition-all flex items-center justify-center ${
                    plan.popular
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-lg hover:shadow-purple-500/50"
                      : "bg-slate-700 hover:bg-slate-600"
                  }`}
                >
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-12 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-3xl border border-purple-500/30">
            <h2 className="text-4xl font-bold mb-4">
              Ready to Transform Your Photo Workflow?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join hundreds of photographers who save hours every week
            </p>
            <Link
              to="/signup"
              className="px-10 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-semibold text-lg hover:shadow-2xl hover:shadow-purple-500/50 transition-all transform hover:scale-105"
            >
              Start Your Free Trial
            </Link>
            <p className="text-sm text-gray-400 mt-4">
              No credit card required • 14-day free trial
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-black/40 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Camera className="w-5 h-5" />
                </div>
                <span className="text-lg font-bold">FaceFind</span>
              </div>
              <p className="text-gray-400 text-sm">
                AI-powered group photo recognition and delivery system.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-purple-400 transition">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-purple-400 transition">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-purple-400 transition">
                    API
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-purple-400 transition">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-purple-400 transition">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-purple-400 transition">
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-purple-400 transition">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-purple-400 transition">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-purple-400 transition">
                    Security
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800 text-center text-sm text-gray-400">
            © 2025 FaceFind. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
