"use client";
import {
  useScroll,
  useTransform,
  motion,
} from "motion/react";
import React, { useEffect, useRef, useState } from "react";

export interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

export const Timeline = ({
  data,
  title = "Projects & Experience",
  description = "A timeline of projects built end-to-end, work experience, and milestones.",
}: {
  data: TimelineEntry[];
  title?: React.ReactNode;
  description?: React.ReactNode;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);

      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          setHeight(entry.contentRect.height);
        }
      });
      resizeObserver.observe(ref.current);
      return () => resizeObserver.disconnect();
    }
  }, [ref]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 15%", "end 95%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.05], [0, 1]);

  return (
    <div
      className="w-full bg-transparent font-sans md:px-10 text-paper relative z-10"
      ref={containerRef}
    >
      <div className="max-w-7xl mx-auto py-12 md:py-20 px-2 sm:px-4 md:px-8 lg:px-10">
        <h2 className="text-2xl sm:text-3xl md:text-5xl mb-3 sm:mb-4 text-paper max-w-4xl font-bold tracking-tight">
          {title}
        </h2>
        {description && (
          <p className="text-dim text-xs sm:text-sm md:text-base max-w-lg">
            {description}
          </p>
        )}
      </div>

      <div ref={ref} className="relative max-w-7xl mx-auto pb-16 md:pb-20">
        {data.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
            className="flex justify-start pt-8 md:pt-40 md:gap-10"
          >
            <div className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-full">
              <motion.div
                initial={{ scale: 0.85, opacity: 0.6 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: false, margin: "-80px 0px -120px 0px" }}
                transition={{ duration: 0.3 }}
                className="h-9 w-9 sm:h-10 sm:w-10 absolute left-1.5 sm:left-3 md:left-3 rounded-full bg-onyx/90 border border-neutral-700/80 backdrop-blur-md flex items-center justify-center transition-all duration-300"
              >
                <div className="relative flex items-center justify-center">
                  <span className="absolute -inset-1 rounded-full bg-cyan-400/30 blur-sm animate-pulse" />
                  <div className="relative h-3 w-3 sm:h-3.5 sm:w-3.5 rounded-full bg-gradient-to-tr from-cyan-400 to-indigo-500 border border-cyan-300 shadow-[0_0_12px_rgba(56,189,248,0.9)]" />
                </div>
              </motion.div>
              <motion.h3
                initial={{ opacity: 0.45 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: false, margin: "-80px 0px -120px 0px" }}
                transition={{ duration: 0.3 }}
                className="hidden md:block text-xl md:pl-20 md:text-5xl font-bold text-neutral-200"
              >
                {item.title}
              </motion.h3>
            </div>

            <div className="relative pl-12 sm:pl-16 md:pl-4 pr-1 sm:pr-4 w-full">
              <motion.h3
                initial={{ opacity: 0.45 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: false, margin: "-80px 0px -120px 0px" }}
                transition={{ duration: 0.3 }}
                className="md:hidden block text-xl sm:text-2xl mb-3 sm:mb-4 text-left font-bold text-neutral-200"
              >
                {item.title}
              </motion.h3>
              {item.content}{" "}
            </div>
          </motion.div>
        ))}

        {/* Static Background Guide Track */}
        <div
          style={{
            height: height + "px",
          }}
          className="absolute md:left-8 left-6 top-0 overflow-hidden w-[3px] bg-neutral-800/60 rounded-full [mask-image:linear-gradient(to_bottom,transparent_0%,black_5%,black_95%,transparent_100%)] pointer-events-none"
        >
          {/* Animated Radiant Neon Beam */}
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0 w-full bg-gradient-to-t from-cyan-400 via-indigo-500 to-transparent from-[0%] via-[20%] rounded-full shadow-[0_0_18px_rgba(56,189,248,0.9),0_0_35px_rgba(99,102,241,0.6)]"
          />
        </div>

        {/* Traveling Luminous Spark at Beam Head */}
        <motion.div
          style={{
            top: heightTransform,
            opacity: opacityTransform,
          }}
          className="absolute md:left-8 left-6 -translate-x-[4.5px] -translate-y-1.5 pointer-events-none z-30"
        >
          <div className="relative flex items-center justify-center">
            <span className="absolute -inset-1 rounded-full bg-cyan-400/60 blur-xs animate-ping" />
            <div className="w-3 h-3 rounded-full bg-cyan-300 border border-white shadow-[0_0_12px_rgba(56,189,248,1),0_0_24px_rgba(56,189,248,0.8)]" />
          </div>
        </motion.div>
      </div>
    </div>
  );
};
