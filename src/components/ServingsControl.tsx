import { Dispatch, SetStateAction } from 'react'
import { Button, InputNumber } from 'antd'

export function ServingsControl({ value, setValue }: { value: number; setValue: Dispatch<SetStateAction<number>> }) {
  return (
    <div className="inline-flex items-center gap-2">
      <label className="text-sm">Servings</label>
      <InputNumber min={1} value={value} onChange={(v) => setValue(Number(v) || 1)} />
      <Button onClick={() => setValue((s) => Math.max(1, s - 1))}>-</Button>
      <Button onClick={() => setValue((s) => s + 1)}>+</Button>
    </div>
  )
}
