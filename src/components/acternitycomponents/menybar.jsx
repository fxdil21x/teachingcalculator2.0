"use client";

import { useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";

import {
  Calculator,
  Calendar,
  FileText,
  BarChart3,
  BookOpen,
} from "lucide-react";

import { cn } from "../../lib/utils";

/* ================= NAV ITEMS ================= */
const NAV_ITEMS = [
  { id: "today", label: "Calculate", icon: Calculator },
  { id: "monthly", label: "Hours", icon: Calendar },
  { id: "batch-report", label: "Batches", icon: BookOpen },
  { id: "salary", label: "Salary", icon: FileText },
  { id: "insights", label: "Insights", icon: BarChart3 },
];

/* ================= FLOATING DOCK EXPORT ================= */
export const FloatingDock = ({
  items,
  desktopClassName,
  mobileClassName,
  activeTab,
  onTabChange
}) => {
  return (
    <>
      <FloatingDockDesktop 
        items={items} 
        className={desktopClassName}
        activeTab={activeTab}
        onTabChange={onTabChange}
      />
      <FloatingDockMobile 
        items={items} 
        className={mobileClassName}
        activeTab={activeTab}
        onTabChange={onTabChange}
      />
    </>
  );
};

/* ================= FLOATING DOCK MOBILE ================= */
const FloatingDockMobile = ({
  items,
  className,
  activeTab,
  onTabChange
}) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={cn("relative block md:hidden", className)}>
      <AnimatePresence>
        {open && (
          <motion.div
            layoutId="nav"
            className="absolute inset-x-0 bottom-full mb-2 flex flex-col gap-2">
            {items.map((item, idx) => (
              <motion.div
                key={item.id || item.title}
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
                transition={{ delay: (items.length - 1 - idx) * 0.05 }}>
                <button
                  onClick={() => {
                    if (item.id && onTabChange) {
                      onTabChange(item.id);
                    }
                    setOpen(false);
                  }}
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full transition-all",
                    activeTab === item.id
                      ? "bg-blue-500 text-white"
                      : "bg-gray-50 dark:bg-neutral-900"
                  )}>
                  <div className="h-4 w-4">{item.icon}</div>
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={() => setOpen(!open)}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 dark:bg-neutral-800">
        <div className="h-5 w-5 text-neutral-500 dark:text-neutral-400" />
      </button>
    </div>
  );
};

/* ================= FLOATING DOCK DESKTOP ================= */
const FloatingDockDesktop = ({
  items,
  className,
  activeTab,
  onTabChange
}) => {
  let mouseX = useMotionValue(Infinity);
  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn(
        "mx-auto hidden h-16 items-end gap-4 rounded-2xl backdrop-blur-md bg-white/10 px-4 pb-3 md:flex dark:bg-white/5",
        className
      )}>
      {items.map((item) => (
        <IconContainer 
          mouseX={mouseX} 
          key={item.id || item.title}
          {...item}
          isActive={activeTab === item.id}
          onTabChange={onTabChange}
        />
      ))}
    </motion.div>
  );
};

/* ================= ICON CONTAINER ================= */
function IconContainer({
  mouseX,
  title,
  icon,
  href,
  id,
  isActive,
  onTabChange
}) {
  const ref = useRef(null);
  const [hovered, setHovered] = useState(false);

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? {
      x: 0,
      width: 0,
    };
    return val - bounds.x - bounds.width / 2;
  });

  const width = useSpring(
    useTransform(distance, [-150, 0, 150], [40, 80, 40]),
    { stiffness: 150, damping: 12 }
  );

  const height = useSpring(
    useTransform(distance, [-150, 0, 150], [40, 80, 40]),
    { stiffness: 150, damping: 12 }
  );

  return (
    <motion.div
      ref={ref}
      style={{ width, height }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => id && onTabChange && onTabChange(id)}
      className={cn(
        "flex items-center justify-center rounded-full p-2 relative cursor-pointer transition-colors",
        isActive 
          ? "bg-blue-500 text-white shadow-lg" 
          : "bg-gray-200 dark:bg-neutral-800"
      )}>
      {/* Tooltip */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0 }}
            className="absolute -top-8 left-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap"
          >
            {title}
          </motion.div>
        )}
      </AnimatePresence>
      <div className="h-4 w-4">{icon}</div>
    </motion.div>
  );
}

/* ================= PAGE COMPONENT ================= */
export default function Page() {
  const [activeTab, setActiveTab] = useState("today");

  const items = NAV_ITEMS.map((item) => ({
    ...item,
    icon: <item.icon className="h-full w-full" />,
  }));

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center">
      
      {/* ===== PAGE CONTENT ===== */}
      <div className="text-center mb-20">
        <h1 className="text-2xl font-bold mb-2">Active Tab</h1>
        <p className="text-blue-400 text-lg">{activeTab}</p>
      </div>

      {/* ===== DESKTOP DOCK ===== */}
      <DesktopDock
        items={items}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* ===== MOBILE NAV ===== */}
      <MobileNav
        items={items}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </div>
  );
}
function MobileNav({ items, activeTab, onTabChange }) {
  return (
    <div className="fixed bottom-4 left-1/2 z-50 w-[95%] -translate-x-1/2 md:hidden">
      <div className="flex items-center justify-between rounded-2xl 
        bg-white/10 backdrop-blur-xl px-4 py-3 shadow-xl border border-white/10">

        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className="flex flex-col items-center justify-center flex-1"
          >
            <div
              className={`p-2 rounded-full transition-all
                ${
                  activeTab === item.id
                    ? "bg-blue-500 text-white scale-110 shadow-lg"
                    : "text-slate-400"
                }`}
            >
              <div className="h-5 w-5">{item.icon}</div>
            </div>

            <span
              className={`text-[10px] mt-1 ${
                activeTab === item.id
                  ? "text-blue-400"
                  : "text-slate-400"
              }`}
            >
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ================= DESKTOP DOCK ================= */
function DesktopDock({ items, activeTab, onTabChange }) {
  const mouseX = useMotionValue(Infinity);

  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className="hidden md:flex h-16 items-end gap-4 rounded-2xl 
      bg-white/10 backdrop-blur-xl px-4 pb-3 shadow-xl"
    >
      {items.map((item) => (
        <DockIcon
          key={item.id}
          mouseX={mouseX}
          {...item}
          activeTab={activeTab}
          onTabChange={onTabChange}
        />
      ))}
    </motion.div>
  );
}

/* ================= ICON ================= */
function DockIcon({
  mouseX,
  title,
  icon,
  id,
  activeTab,
  onTabChange,
}) {
  const ref = useRef(null);
  const [hovered, setHovered] = useState(false);

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() || {
      x: 0,
      width: 0,
    };
    return val - bounds.x - bounds.width / 2;
  });

  const width = useSpring(
    useTransform(distance, [-150, 0, 150], [40, 80, 40]),
    { stiffness: 150, damping: 12 }
  );

  const height = useSpring(
    useTransform(distance, [-150, 0, 150], [40, 80, 40]),
    { stiffness: 150, damping: 12 }
  );

  const iconSize = useSpring(
    useTransform(distance, [-150, 0, 150], [20, 40, 20]),
    { stiffness: 150, damping: 12 }
  );

  return (
    <div onClick={() => onTabChange(id)} className="cursor-pointer">
      <motion.div
        ref={ref}
        style={{ width, height }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`relative flex items-center justify-center rounded-full
          ${
            activeTab === id
              ? "bg-blue-500 text-white scale-110 shadow-lg"
              : "bg-gray-200 dark:bg-neutral-800"
          }`}
      >
        {/* Tooltip */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 10, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0 }}
              className="absolute -top-8 left-1/2 bg-black text-white text-xs px-2 py-1 rounded"
            >
              {title}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          style={{ width: iconSize, height: iconSize }}
          className="flex items-center justify-center"
        >
          {icon}
        </motion.div>
      </motion.div>
    </div>
  );
}