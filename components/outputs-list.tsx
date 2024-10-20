import Link from 'next/link'
import { Output } from '@prisma/client'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface OutputListProps {
  outputs: Output[]
}

export function OutputList({ outputs }: OutputListProps) {
  return (
    <div className="space-y-4">
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
  )
}