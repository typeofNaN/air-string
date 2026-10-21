import { cn } from '../../lib/utils'

const heights = [
  'h-[15px] -rotate-[18deg]',
  'h-[31px]',
  'h-9',
  'h-[31px]',
  'h-6',
]
export function GestureGlyph({ fingers }: { fingers: readonly boolean[] }) {
  return (
    <span className="flex h-11 items-end gap-0.5" aria-hidden="true">
      {fingers.map((active, index) => (
        <i
          key={index}
          className={cn(
            'block w-[5px] origin-bottom rounded-full border border-[#85877d]',
            heights[index],
            active && 'border-terra bg-terra',
          )}
        />
      ))}
    </span>
  )
}
