// next.d.ts
import 'next'

declare module 'next' {
  interface PageProps {
    params?: Record<string, string | string[]>
    searchParams?: Record<string, string | string[] | undefined>
  }

  interface LayoutProps {
    children?: React.ReactNode
    params?: Record<string, string | string[]>
  }
}