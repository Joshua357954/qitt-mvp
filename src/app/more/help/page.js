"use client";
import MainLayout from "@/components/MainLayout";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Mail,
  Phone,
  Instagram,
  Twitter,
  Facebook,
  ChevronDown,
} from "lucide-react";

export default function Help() {
  const [activeIndex, setActiveIndex] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const faqs = [
    {
      question: "How do I get started with Qitt?",
      answer:
        "Simply create an account and follow our onboarding tutorial to begin your journey.",
    },
    {
      question: "Is there a mobile app available?",
      answer: "Yes! Qitt is available on both iOS and Android platforms.",
    },
    {
      question: "How can I reset my password?",
      answer:
        "Go to the login page and click 'Forgot Password' to receive a reset link via email.",
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, PayPal, and bank transfers.",
    },
    {
      question: "How do I cancel my subscription?",
      answer:
        "You can manage your subscription in the Account Settings section.",
    },
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const toggleAllFAQs = () => {
    setIsExpanded(!isExpanded);
    setActiveIndex(isExpanded ? null : 0);
  };

  return (
    <MainLayout route="Help">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          Help Center
        </h1>
        <p className="text-lg text-muted-foreground text-center mb-12">
          Find answers or get in touch with our team
        </p>

        {/* FAQ Section */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">
              Frequently Asked Questions
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleAllFAQs}
              className="text-muted-foreground"
            >
              {isExpanded ? "Collapse All" : "Expand All"}
            </Button>
          </div>

          <div className="space-y-2">
            {faqs.map((faq, index) => (
              <Card key={index} className="overflow-hidden">
                <button
                  className="w-full flex justify-between items-center p-4 text-left hover:bg-accent/50 transition-colors"
                  onClick={() => toggleFAQ(index)}
                >
                  <h3 className="font-medium text-lg">{faq.question}</h3>
                  <ChevronDown
                    className={`w-5 h-5 transition-transform duration-200 ${
                      activeIndex === index ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <div
                  className={`transition-all duration-300 overflow-hidden ${
                    activeIndex === index ? "max-h-96" : "max-h-0"
                  }`}
                >
                  <CardContent className="p-4 pt-0 text-muted-foreground">
                    {faq.answer}
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Contact Form */}
        <section className="mb-16">
          <Card>
            <CardHeader className="text-2xl font-semibold">
              Still need help?
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input placeholder="Your name" />
                  <Input placeholder="Your email" type="email" />
                </div>
                <Textarea placeholder="How can we help you?" rows={5} />
                <div className="flex flex-col sm:flex-row justify-end gap-3">
                  <Button variant="outline" type="button" className="gap-2">
                    <Phone className="w-4 h-4" />
                    Call Us
                  </Button>
                  <Button type="submit" className="gap-2">
                    <Mail className="w-4 h-4" />
                    Send Message
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </section>

        {/* Social Media */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Connect With Us</h2>
          <div className="flex justify-center space-x-6">
            <a
              href="#"
              className="p-2 rounded-full hover:bg-accent transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-6 h-6" />
            </a>
            <a
              href="#"
              className="p-2 rounded-full hover:bg-accent transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="w-6 h-6" />
            </a>
            <a
              href="#"
              className="p-2 rounded-full hover:bg-accent transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="w-6 h-6" />
            </a>
          </div>
          <p className="text-center text-sm text-muted-foreground mt-2">
            Follow @useqitt for updates and tips
          </p>
        </section>
      </div>
    </MainLayout>
  );
}
