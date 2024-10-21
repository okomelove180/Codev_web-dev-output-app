import { Badge } from '@/components/ui/badge'

interface SkillTagsProps {
  skills: string[]
}

export function SkillTags({ skills }: SkillTagsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {skills.map((skill, index) => (
        <Badge key={index} variant="secondary">{skill}</Badge>
      ))}
    </div>
  )
}