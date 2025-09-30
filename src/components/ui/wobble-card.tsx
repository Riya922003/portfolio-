import React, { PropsWithChildren, useState } from 'react'

type Props = PropsWithChildren<{
  containerClassName?: string
  className?: string
}>

export function WobbleCard({ children, containerClassName = '', className = '' }: Props) {
  const [hover, setHover] = useState(false)

  return (
    <div
      className={`relative wobble-on-hover ${containerClassName}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className={`relative wobble-inner ${hover ? 'wobble-inner-animated' : ''} w-full h-full box-border rounded-xl overflow-hidden border border-neutral-800 bg-neutral-900/40 p-6 ${className}`}>
        {children}
      </div>
    </div>
  )
}

export default WobbleCard
