'use client'
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import React from "react"

const  Links = [
    {
        title: 'Overview',
        href: '/admin/overview'
    },
    {
        title: 'Products',
        href: '/admin/products'
    },
    {
        title: 'Orders',
        href: '/admin/orders'
    },
    {
        title: 'Users',
        href: '/admin/users'
    }
]

const MainNav = ({className, ...props}: React.HTMLAttributes<HTMLElement>) => {
  const pathname = usePathname();
  return (
    <nav className={cn('flex items-center pl-0 space-x-4 lg:space-x-6', className)} {...props}>{Links.map((link)=><Link key={link.href} className={cn('text-sm font-medium transition-colors hover:text-primary', pathname.includes(link.href)/* if we are on the page */ ? '' : 'text-muted-foreground')} href={link.href}>{link.title}</Link>)}</nav>
  )
}

export default MainNav