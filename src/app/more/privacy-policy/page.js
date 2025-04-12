"use client";

import MainLayout from "@/components/MainLayout";
import React from "react";

export default function PrivacyPolicy() {
  return (
    <MainLayout route={"Privacy Policy"}>
      <div className="space-y-6 max-w-3xl mx-auto py-10 px-4">
        <p>
          At Qitt, we value your privacy and are committed to protecting your personal information. This policy explains how we collect, use, and protect your data.
        </p>

        <h2 className="text-xl font-semibold">1. Information We Collect</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>Personal details like your name, email, and institution.</li>
          <li>Account activity, preferences, and usage data.</li>
          <li>Messages, posts, and interactions on the platform.</li>
          <li>Payment details (if you subscribe or donate).</li>
        </ul>

        <h2 className="text-xl font-semibold">2. How We Use Your Data</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>To provide and improve your experience on Qitt.</li>
          <li>To personalize content and recommendations.</li>
          <li>To process transactions and support requests.</li>
          <li>To communicate updates, offers, and news.</li>
        </ul>

        <h2 className="text-xl font-semibold">3. Data Sharing</h2>
        <p>
          We do not sell your data. We may share limited information with trusted services (e.g. payments, analytics) to help operate Qitt securely and efficiently.
        </p>

        <h2 className="text-xl font-semibold">4. Your Rights</h2>
        <p>
          You can access, update, or delete your account information at any time. Contact us if you need help with this.
        </p>

        <h2 className="text-xl font-semibold">5. Security</h2>
        <p>
          We use standard security measures to protect your data from unauthorized access or misuse.
        </p>

        <h2 className="text-xl font-semibold">6. Cookies</h2>
        <p>
          Qitt uses cookies to improve functionality and analyze usage. You can adjust your browser settings to control cookies.
        </p>

        <h2 className="text-xl font-semibold">7. Changes to This Policy</h2>
        <p>
          We may update this policy occasionally. We'll notify you of any major changes through email or on the platform.
        </p>

        <h2 className="text-xl font-semibold">8. Contact</h2>
        <p>
          Have questions about your privacy? Reach out to us at <a href="mailto:useqitt@gmail.com" className="text-blue-600">support@qitt.com</a>.
        </p>
      </div>
    </MainLayout>
  );
}
