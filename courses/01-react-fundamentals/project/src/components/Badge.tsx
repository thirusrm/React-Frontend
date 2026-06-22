interface BadgeProps {
  children: React.ReactNode
  variant?: string
}

export default function Badge({
  children,
}: BadgeProps) {
  return <span>{children}</span>
}