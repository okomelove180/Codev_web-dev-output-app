import { cn } from "@/lib/utils"
import Link from "next/link"

export default function CodevLogo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("transition-opacity hover:opacity-80", className)}>
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 200 60" 
        className="w-32 h-8"
      >
        <g className="stroke-logo-blue"> {/* 絵の部分は常に青色 */}
          <path 
              d="M20 15 L35 30 L20 45" 
            fill="none" 
            className="stroke-primary" 
            strokeWidth="4" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          
          <path 
            d="M45 25 Q50 30 45 35" 
            fill="none" 
            className="stroke-primary" 
            strokeWidth="3.5" 
            strokeLinecap="round"
          />
          <path 
            d="M50 20 Q57 30 50 40" 
            fill="none" 
            className="stroke-primary" 
            strokeWidth="3.5" 
            strokeLinecap="round"
          />
          <path 
            d="M55 15 Q65 30 55 45" 
            fill="none" 
            className="stroke-primary" 
            strokeWidth="3.5" 
            strokeLinecap="round"
            />
        </g>

        <text 
          x="75" 
          y="40" 
          className="fill-primary font-semibold text-[36px]"
          style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
          >
          codev
        </text>
      </svg>
    </Link>
  )
}