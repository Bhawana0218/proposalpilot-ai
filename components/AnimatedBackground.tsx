"use client";

export default function AnimatedBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="orb orb-cyan" />
      <div className="orb orb-purple" />
      <div className="orb orb-blue" />
    </div>
  );
}
