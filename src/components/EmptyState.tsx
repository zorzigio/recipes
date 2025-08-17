export function EmptyState({ message }: { message: string }) {
  return (
    <div role="status" aria-live="polite" className="text-center text-muted-foreground py-12">
      {message}
    </div>
  )
}
