export default function Loading() {
  return (
    <div className="max-w-6xl mx-auto p-6 flex items-center justify-center min-h-[50vh]">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
        <p className="text-sm text-muted-foreground">加载中...</p>
      </div>
    </div>
  )
}
