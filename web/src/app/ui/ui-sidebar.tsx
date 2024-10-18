import { Grid, GridColProps, GridProps, NavLink, NavLinkProps } from '@mantine/core'
import { ReactNode, useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'

export interface KeypairUiGridItem extends NavLinkProps {
  path: string
  label?: ReactNode
}
export interface KeypairUiGridRoutesProps extends GridProps {
  children: ReactNode
  basePath: string
  routes: KeypairUiGridItem[]
  leftColProps?: GridColProps
  rightColProps?: GridColProps
}

export function UiSidebar({
  basePath,
  children,
  routes,
  leftColProps,
  rightColProps,
  ...props
}: KeypairUiGridRoutesProps) {
  const { pathname } = useLocation()

  const links = useMemo(
    () =>
      routes
        .filter((app) => app.label)
        .map(({ path, label, ...props }) => {
          const to = `${basePath}/${path}`
          return (
            <NavLink active={pathname.startsWith(to)} component={Link} key={path} label={label} to={to} {...props} />
          )
        }),
    [basePath, pathname, routes],
  )

  return (
    <Grid {...props}>
      <Grid.Col span={{ base: 12, sm: 2 }} {...rightColProps}>
        {links}
      </Grid.Col>
      <Grid.Col span={{ base: 12, sm: 10 }} {...leftColProps}>
        {children}
      </Grid.Col>
    </Grid>
  )
}
