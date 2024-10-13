import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link";
import { Output } from "@prisma/client";

export default function Component({ outputs }: { outputs: Output[] }) {

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {outputs.map((output) => (
          <Card key={output.id}>
            <Link href={`/outputs/${output.id}`}>
              <CardHeader>
                <CardTitle>{output.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge>{output.language}</Badge>
                <p className="mt-2 text-sm text-gray-500">{output.createdAt.toLocaleString()}</p>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>
      <Button asChild
        size="lg"
        className="fixed bottom-8 right-8 rounded-full shadow-lg"
      >
        <Link href="/outputs/new">
          <PlusCircle className="mr-2 h-4 w-4" /> New Output
        </Link>
      </Button>
    </div>
  )
}