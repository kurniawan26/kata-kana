'use client'
import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { href: '/learning', label: 'Study Chart' },
  { href: '/quiz', label: 'Quiz' },
  { href: '/draw', label: 'Drawing' },
]

function Nav() {
  const [open, setOpen] = React.useState(false)
  const pathname = usePathname()

  return (
    <>
      <div className="flex items-center justify-between w-full">
        <Link href="/" className="font-bold text-base shrink-0">
          QKana
        </Link>

        {/* Desktop links */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                pathname === link.href
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-md hover:bg-accent transition-colors"
          onClick={() => setOpen(v => !v)}
          aria-label="Toggle menu"
        >
          <span className="text-lg leading-none">{open ? '✕' : '☰'}</span>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden fixed inset-x-0 top-16 z-50 bg-background border-b shadow-md">
          <nav className="flex flex-col p-3 gap-1">
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  'px-4 py-3 rounded-md text-sm font-medium transition-colors',
                  pathname === link.href
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-accent'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  )
}

export default Nav
