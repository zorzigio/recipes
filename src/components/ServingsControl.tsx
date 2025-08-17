import { Dispatch, SetStateAction } from 'react'

export function ServingsControl({ value, setValue }: { value: number; setValue: Dispatch<SetStateAction<number>> }) {
  return (
    <div className="inline-flex items-center gap-2">
      <label className="text-sm">Servings</label>
      <input type="number" className="border rounded px-2 py-1 w-20" min={1} value={value} onChange={(e) => setValue(parseInt(e.target.value) || 1)} />
      <button className="border rounded px-3 py-1" onClick={() => setValue((s) => Math.max(1, s - 1))}>-</button>
      <button className="border rounded px-3 py-1" onClick={() => setValue((s) => s + 1)}>+</button>
    </div>
  )
}
