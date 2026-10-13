"use client";

import { cn } from "@/lib/utils";
import {
  AnimatePresence,
  type MotionValue,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import React, { useRef, useState } from "react";

export interface FloatingDockItem {
  title: string;
  icon: React.ReactNode;
  href?: string;
  onClick?: () => void;
  active?: boolean;
  className?: string;
  isDivider?: boolean;
}

export const FloatingDock = ({
  items,
  desktopClassName,
  mobileClassName,
  baseSize = 40,
  magnifiedSize = 80,
  distanceLimit = 150,
}: {
  items: FloatingDockItem[];
  desktopClassName?: string;
  mobileClassName?: string;
  baseSize?: number;
  magnifiedSize?: number;
  distanceLimit?: number;
}) => {
  return (
    <>
      <FloatingDockDesktop
        items={items}
        className={desktopClassName}
        baseSize={baseSize}
        magnifiedSize={magnifiedSize}
        distanceLimit={distanceLimit}
      />
      <FloatingDockMobile items={items} className={mobileClassName} />
    </>
  );
};

export const FloatingDockMobile = ({
  items,
  className,
}: {
  items: FloatingDockItem[];
  className?: string;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={cn("relative block md:hidden", className)}>
      <AnimatePresence>
        {open && (
          <motion.div
            layoutId="nav"
            className="absolute inset-x-0 bottom-full mb-2 flex flex-col gap-2"
          >
            {items
              .filter((item) => !item.isDivider)
              .map((item, idx) => {
                const content = (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 dark:bg-neutral-900 shadow-md">
                    <div className="h-5 w-5 flex items-center justify-center">{item.icon}</div>
                  </div>
                );

                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    exit={{
                      opacity: 0,
                      y: 10,
                      transition: {
                        delay: idx * 0.05,
                      },
                    }}
                    transition={{ delay: (items.length - 1 - idx) * 0.05 }}
                  >
                    {item.onClick ? (
                      <button
                        type="button"
                        onClick={item.onClick}
                        className="cursor-pointer"
                      >
                        {content}
                      </button>
                    ) : (
                      <a href={item.href || "#"}>{content}</a>
                    )}
                  </motion.div>
                );
              })}
          </motion.div>
        )}
      </AnimatePresence>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 dark:bg-neutral-800 shadow-md"
        aria-label="Toggle Dock"
      >
        <IconLayoutNavbarCollapse className="h-5 w-5 text-neutral-500 dark:text-neutral-400" />
      </button>
    </div>
  );
};

export const FloatingDockDesktop = ({
  items,
  className,
  baseSize = 40,
  magnifiedSize = 80,
  distanceLimit = 150,
}: {
  items: FloatingDockItem[];
  className?: string;
  baseSize?: number;
  magnifiedSize?: number;
  distanceLimit?: number;
}) => {
  const mouseX = useMotionValue(Infinity);

  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn(
        "mx-auto flex h-16 items-end gap-3 rounded-2xl bg-white/30 backdrop-blur-xl border border-white/30 px-3 pb-3 shadow-2xl overflow-visible",
        className
      )}
    >
      {items.map((item, idx) =>
        item.isDivider ? (
          <div
            key={`divider-${idx}`}
            className="w-[1px] h-6 bg-white/30 self-center mx-1 rounded-full shrink-0"
          />
        ) : (
          <IconContainer
            mouseX={mouseX}
            key={item.title}
            baseSize={baseSize}
            magnifiedSize={magnifiedSize}
            distanceLimit={distanceLimit}
            {...item}
          />
        )
      )}
    </motion.div>
  );
};

export function IconContainer({
  mouseX,
  title,
  icon,
  href,
  onClick,
  active,
  className,
  baseSize = 40,
  magnifiedSize = 80,
  distanceLimit = 150,
}: FloatingDockItem & {
  mouseX: MotionValue<number>;
  baseSize?: number;
  magnifiedSize?: number;
  distanceLimit?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    const scrollX = typeof window !== "undefined" ? window.scrollX : 0;
    return val - (bounds.x + scrollX) - bounds.width / 2;
  });

  const widthTransform = useTransform(
    distance,
    [-distanceLimit, 0, distanceLimit],
    [baseSize, magnifiedSize, baseSize]
  );
  const heightTransform = useTransform(
    distance,
    [-distanceLimit, 0, distanceLimit],
    [baseSize, magnifiedSize, baseSize]
  );

  const widthTransformIcon = useTransform(
    distance,
    [-distanceLimit, 0, distanceLimit],
    [baseSize * 0.7, magnifiedSize * 0.7, baseSize * 0.7]
  );
  const heightTransformIcon = useTransform(
    distance,
    [-distanceLimit, 0, distanceLimit],
    [baseSize * 0.7, magnifiedSize * 0.7, baseSize * 0.7]
  );

  const width = useSpring(widthTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  const height = useSpring(heightTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  const widthIcon = useSpring(widthTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  const heightIcon = useSpring(heightTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  const [hovered, setHovered] = useState(false);

  const dockItemContent = (
    <motion.div
      ref={ref}
      style={{ width, height }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "relative flex aspect-square items-center justify-center rounded-[10px] bg-white/90 shadow-sm cursor-pointer select-none transition-shadow hover:shadow-md",
        className
      )}
    >
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 6, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 2, x: "-50%" }}
            className="absolute -top-7 left-1/2 w-fit rounded-md border border-white/20 bg-black/80 px-2 py-0.5 text-[11px] font-sans font-medium whitespace-pre text-white shadow-lg pointer-events-none z-40 backdrop-blur-md"
          >
            {title}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        style={{ width: widthIcon, height: heightIcon }}
        className="flex items-center justify-center overflow-hidden rounded-[8px]"
      >
        {icon}
      </motion.div>

      {/* Active running application dot indicator */}
      {active && (
        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-black/70 rounded-full shadow-sm" />
      )}
    </motion.div>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="outline-none border-none p-0 bg-transparent flex items-end cursor-pointer"
      >
        {dockItemContent}
      </button>
    );
  }

  if (href) {
    const isExternal = href.startsWith("http");
    return (
      <a
        href={href}
        {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className="outline-none border-none p-0 flex items-end cursor-pointer"
      >
        {dockItemContent}
      </a>
    );
  }

  return <div className="flex items-end">{dockItemContent}</div>;
}

function IconLayoutNavbarCollapse({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M3 9h18" />
      <path d="m14 15-2-2-2 2" />
    </svg>
  );
}
