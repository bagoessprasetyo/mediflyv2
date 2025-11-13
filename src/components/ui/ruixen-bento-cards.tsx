"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface PlusCardProps {
  className?: string
  title: string
  description: string
  icon?: React.ComponentType<{ className?: string }>
  children?: React.ReactNode
}

const PlusCard: React.FC<PlusCardProps> = ({
  className = "",
  title,
  description,
  icon: Icon,
  children,
}) => {
  return (
    <div
      className={cn(
        "relative border border-dashed border-zinc-400/50 rounded-lg p-6 bg-white min-h-[200px]",
        "flex flex-col justify-between transition-all duration-300 hover:border-zinc-500/70 hover:shadow-sm",
        className
      )}
    >
      <CornerPlusIcons />
      
      {/* Content */}
      <div className="relative z-10 space-y-3 flex-1">
        {Icon && (
          <div className="w-10 h-10 bg-zinc-100 rounded-xl flex items-center justify-center mb-4">
            <Icon className="w-5 h-5 text-zinc-600" />
          </div>
        )}
        <h3 className="text-xl font-bold text-gray-900">
          {title}
        </h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>
      </div>

      {/* Additional content */}
      {children && (
        <div className="relative z-10 mt-4">
          {children}
        </div>
      )}
    </div>
  )
}

const CornerPlusIcons = () => (
  <>
    <PlusIcon className="absolute -top-3 -left-3 bg-white" />
    <PlusIcon className="absolute -top-3 -right-3 bg-white" />
    <PlusIcon className="absolute -bottom-3 -left-3 bg-white" />
    <PlusIcon className="absolute -bottom-3 -right-3 bg-white" />
  </>
)

const PlusIcon = ({ className }: { className?: string }) => (
  <div className={`w-6 h-6 flex items-center justify-center ${className}`}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      width={16}
      height={16}
      strokeWidth="2"
      stroke="currentColor"
      className="text-zinc-400"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
    </svg>
  </div>
)

export { PlusCard, CornerPlusIcons, PlusIcon }
export default PlusCard