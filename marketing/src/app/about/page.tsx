"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, MapPin, Users, Target, Heart, Sparkles } from "lucide-react";

const team = [
  { name: "Alex Johnson", role: "CEO & Founder", bio: "10+ years in AI and content marketing" },
  { name: "Sarah Chen", role: "CTO", bio: "Former Google engineer, AI specialist" },
  { name: "Michael Park", role: "Head of Product", bio: "Product leader from Hubspot" },
  { name: "Emily Davis", role: "Head of Marketing", bio: "Growth expert, scaled 3 startups" },
];

const values = [
  { icon: Target, title: "Innovation First", desc: "We push boundaries to deliver cutting-edge AI solutions" },
  { icon: Users, title: "Customer Success", desc: "Your success is our success. We're here to help you grow" },
  { icon: Heart, title: "Quality Content", desc: "We believe in creating content that truly adds value" },
  { icon: Sparkles, title: "Simplicity", desc: "Powerful features made simple and accessible for everyone" },
];

export default function AboutPage() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-[#52B2BF]/10 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <Badge className="mb-4 bg-[#52B2BF]/10 text-[#52B2BF]">About Us</Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900">
              Empowering Content Creators Worldwide
            </h1>
            <p className="mt-6 text-xl text-gray-600">
              We&apos;re on a mission to democratize content creation with AI technology.
            </p>
          </div>
        </div>
      </section>


      {/* Story */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
            <p className="text-gray-600 mb-4">
              Scalezix was founded in 2023 with a simple mission: make high-quality content creation accessible to everyone. 
              We saw businesses struggling to keep up with the demand for fresh, engaging content and knew there had to be a better way.
            </p>
            <p className="text-gray-600 mb-4">
              Today, we serve over 10,000 customers worldwide, from solo bloggers to Fortune 500 companies. 
              Our AI-powered platform has generated millions of articles, helping businesses grow their online presence and reach new audiences.
            </p>
            <p className="text-gray-600">
              We&apos;re just getting started. Our team is constantly innovating to bring you the most advanced content creation tools available.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Our Values</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full text-center">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#52B2BF] to-[#3d9aa6] rounded-xl flex items-center justify-center mx-auto mb-4">
                      <value.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{value.title}</h3>
                    <p className="text-sm text-gray-600">{value.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Get in Touch</h2>
            <p className="mt-4 text-gray-600">Have questions? We&apos;d love to hear from you.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="p-6 flex items-start gap-4">
                <Mail className="w-6 h-6 text-[#52B2BF] flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900">Email Us</h3>
                  <p className="text-gray-600">support@scalezix.com</p>
                  <p className="text-gray-600">sales@scalezix.com</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex items-start gap-4">
                <MapPin className="w-6 h-6 text-[#52B2BF] flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900">Location</h3>
                  <p className="text-gray-600">HARSH J KUHIKAR</p>
                  <p className="text-gray-600">India</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-[#52B2BF] to-[#3d9aa6]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Join Our Journey
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Be part of the content revolution.
          </p>
          <Link href="https://aiblog.scalezix.com/signup">
            <Button size="lg" className="bg-white text-[#52B2BF] hover:bg-gray-100">
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
