import type { Step } from '@/lib/schema'
import { replaceStepTokens } from '@/lib/scale'
import { Typography } from 'antd'

export function StepList({ steps, baseServings, currentServings }: { steps: Step[]; baseServings: number; currentServings: number }) {
  return (
    <ol className="list-decimal pl-6 space-y-2">
      {steps.map((s) => (
        <li key={s.order}><Typography.Text>{replaceStepTokens(s.text, baseServings, currentServings)}</Typography.Text></li>
      ))}
    </ol>
  )
}
