import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ExternalLink } from "lucide-react"
import { Output, RelatedLink } from "@prisma/client"
import { Button } from "./ui/button"
import Link from "next/link"

const formatMarkdown = (text: string) => {
  return text
    .replace(/\n/g, '<br>')
    .replace(/##\s(.*)/g, '<h2 class="text-xl font-semibold mt-2 mb-1">$1</h2>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
}


type OutputWithRelatedLinks = Output & {
  relatedLinks: RelatedLink[];
};

interface OutputDetailPreviewProps {
  output: OutputWithRelatedLinks;
}

export default function Component({ output }: OutputDetailPreviewProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Original Text</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{output.originalContent}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Corrected Text</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{output.correctedContent}</p>
          </CardContent>
        </Card>
      </div>
      <Separator className="my-8" />
      <Card>
        <CardHeader>
          <CardTitle>Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">{output.analysis}</p>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Related Links</h3>
              <Badge>{output.language}</Badge>
            </div>
            {output.relatedLinks.map((link, index) => (
              <div key={index} className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                  <Badge variant={link.isOfficial ? "default" : "secondary"}>
                    {link.isOfficial ? "Official" : "Community"}
                  </Badge>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline flex items-center"
                  >
                    {link.siteName}
                    <ExternalLink className="ml-1 h-4 w-4" />
                  </a>
                </div>
                <div className="text-sm text-gray-600">
                  {formatMarkdown(link.summary)}
                </div>
                {!link.isOfficial && (
                  <p className="text-xs text-gray-400">Likes: {link.likes_count}</p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Button asChild
        size="lg"
        className="fixed bottom-8 right-8 rounded-full shadow-lg"
      >
        <Link href="/outputs">
          Output一覧に戻る
        </Link>
      </Button>

    </div>
  )
}