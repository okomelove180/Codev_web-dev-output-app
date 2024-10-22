import { cn } from "@/lib/utils"
import Link from "next/link"

export default function CodevLogo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("transition-opacity hover:opacity-80", className)}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60">
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: "#3B82F6" }} />
            <stop offset="100%" style={{ stopColor: "#8B5CF6" }} />
          </linearGradient>
        </defs>
        
        <path 
          d="M20 15 L35 30 L20 45" 
          fill="none" 
          stroke="url(#gradient)" 
          strokeWidth="4" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        
        <path d="M45 25 Q50 30 45 35" fill="none" stroke="url(#gradient)" strokeWidth="3.5" strokeLinecap="round"/>
        <path d="M50 20 Q57 30 50 40" fill="none" stroke="url(#gradient)" strokeWidth="3.5" strokeLinecap="round"/>
        <path d="M55 15 Q65 30 55 45" fill="none" stroke="url(#gradient)" strokeWidth="3.5" strokeLinecap="round"/>
        
        <text 
          x="75" 
          y="40" 
          font-family="system-ui, -apple-system, sans-serif" 
          font-weight="600" 
          font-size="28" 
          fill="url(#gradient)"
        >
          codev
        </text>
      </svg>
    </Link>
  )
}