import React from 'react'

export default function HomePage({children}: Readonly<{children: React.ReactNode}>) {
  return (
    <div>
      {children}
    </div>
  )
}
