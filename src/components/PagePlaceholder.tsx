interface PagePlaceholderProps {
  title: string
  description?: string
}

export function PagePlaceholder({ title, description }: PagePlaceholderProps) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-bold text-primary">{title}</h1>
      {description ? <p className="mt-2 text-foreground">{description}</p> : null}
    </div>
  )
}
