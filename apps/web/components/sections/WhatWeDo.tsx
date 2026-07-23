"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Monitor,
  Smartphone,
  Gamepad2,
  ShieldCheck,
  Bot,
  Cloud,
  ArrowRight,
} from "lucide-react";

export const EASING = {
  OUT: "easeOut" as const,
  IN: "easeIn" as const,
  IN_OUT: "easeInOut" as const,
  LINEAR: "linear" as const,
} as const

const services = [
  {
    icon: Monitor,
    title: "Web Development",
    desc: "Modern, responsive, high-performance websites and web apps built to scale.",
    href: "/services/web-development",
    color: "#1452CC",
    dim: "rgba(20,82,204,0.1)",
  },
  {
    icon: Smartphone,
    title: "App Development",
    desc: "Android & iOS apps that engage users and drive business growth.",
    href: "/services/app-development",
    color: "#22C55E",
    dim: "rgba(34,197,94,0.1)",
  },
  {
    icon: Gamepad2,
    title: "Game Development",
    desc: "2D/3D games for web, mobile and desktop — Unity & Unreal Engine.",
    href: "/services/game-development",
    color: "#9333EA",
    dim: "rgba(147,51,234,0.1)",
  },
  {
    icon: ShieldCheck,
    title: "Security Testing",
    desc: "Vulnerability assessment & penetration testing for web and mobile apps.",
    href: "/services/security-testing",
    color: "#DC2626",
    dim: "rgba(220,38,38,0.1)",
  },
  {
    icon: Bot,
    title: "AI & Automation",
    desc: "Intelligent AI solutions and automation pipelines to grow your business.",
    href: "/services/ai-automation",
    color: "#F59E0B",
    dim: "rgba(245,158,11,0.1)",
  },
  {
    icon: Cloud,
    title: "Cloud & DevOps",
    desc: "Scalable cloud infrastructure and DevOps pipelines on AWS, GCP, Azure.",
    href: "/services/cloud-devops",
    color: "#0EA5E9",
    dim: "rgba(14,165,233,0.1)",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: EASING.OUT },
  },
};

export function WhatWeDo() {
  return (
    <section className="py-24 relative" aria-labelledby="what-we-do-heading">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-bx-border to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs font-mono font-semibold uppercase tracking-[0.2em] mb-3"
            style={{ color: "#1452CC" }}
          >
            What We Do
          </motion.p>
          <motion.h2
            id="what-we-do-heading"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="text-3xl sm:text-4xl font-bold mb-4 text-[var(--text-primary)]"
          >
            Full-Spectrum Tech Services
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="max-w-xl mx-auto text-[var(--text-secondary)]"
          >
            From concept to deployment — we build, secure, and scale digital
            products that make an impact.
          </motion.p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {services.map((svc) => {
            const Icon = svc.icon;
            return (
              <motion.div key={svc.title} variants={item}>
                <Link
                  href={svc.href}
                  className="group block h-full card p-6 rounded-2xl hover:-translate-y-1 transition-all duration-200"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-200"
                    style={{ background: svc.dim }}
                  >
                    <Icon className="w-6 h-6" style={{ color: svc.color }} />
                  </div>
                  <h3
                    className="font-semibold text-base mb-2 text-[var(--text-primary)]"
                  >
                    {svc.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed mb-4 text-[var(--text-secondary)]"
                  >
                    {svc.desc}
                  </p>
                  <span
                    className="inline-flex items-center gap-1 text-xs font-semibold"
                    style={{ color: svc.color }}
                  >
                    Explore{" "}
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
