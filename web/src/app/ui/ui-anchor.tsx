import { Anchor, AnchorProps } from '@mantine/core'
import { ReactNode } from 'react'
import { Link } from 'react-router-dom'

export interface UiAnchorProps extends AnchorProps {
  children: ReactNode
  href?: string
  to?: string
  target?: HTMLAnchorElement['target']
}

export function UiAnchor({ children, href, target, to, ...props }: UiAnchorProps) {
  return to ? (
    <Anchor component={Link} to={to} target={target} {...props}>
      {children}
    </Anchor>
  ) : href ? (
    <Anchor component="a" href={href} target={target} {...props}>
      {children}
    </Anchor>
  ) : (
    children
  )
}
