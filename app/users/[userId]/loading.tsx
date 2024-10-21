import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-6 md:grid-cols-4">
        <div className="md:col-span-3">
          <Skeleton className="h-[200px] w-full" />
        </div>
        <Skeleton className="h-[200px] w-full" />
        <Skeleton className="h-[300px] w-full md:col-span-4" />
        <Skeleton className="h-[400px] w-full md:col-span-3" />
        <Skeleton className="h-[200px] w-full" />
        <Skeleton className="h-[200px] w-full md:col-span-2" />
        <Skeleton className="h-[300px] w-full md:col-span-4" />
      </div>
    </div>
  )
} 