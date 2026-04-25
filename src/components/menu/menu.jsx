import React from "react";
import { FloatingDock } from "../acternitycomponents/menybar";
import {
  IconCalculator,
  IconClock,
  IconPackage,
  IconCoin,
  IconTrendingUp,
} from "@tabler/icons-react";

export function FloatingDockDemo({ activeTab = "today", onTabChange }) {
  const links = [
    {
      id: "today",
      title: "Calculate",
      icon: (
        <IconCalculator className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
    },
    {
      id: "monthly",
      title: "Hours",
      icon: (
        <IconClock className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
    },
    {
      id: "batch-report",
      title: "Batches",
      icon: (
        <IconPackage className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
    },
    {
      id: "salary",
      title: "Salary",
      icon: (
        <IconCoin className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
    },
    {
      id: "insights",
      title: "Insights",
      icon: (
        <IconTrendingUp className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
    },
  ];

  const itemsWithClick = links.map((item) => ({
    ...item,
    onClick: () => onTabChange && onTabChange(item.id),
  }));

  return (
    <div className="flex items-center justify-center w-full">
      <FloatingDock
        mobileClassName="translate-y-20"
        items={itemsWithClick}
        activeTab={activeTab}
        onTabChange={onTabChange}
      />
    </div>
  );
}
