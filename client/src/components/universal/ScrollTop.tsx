import { useEffect, ReactNode } from 'react'
import { useLocation } from 'react-router-dom'

interface ScrollTopProps {
  children?: ReactNode
}

const ScrollTop = (props: ScrollTopProps) => {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return props.children ? <>{props.children}</> : null
}

export default ScrollTop
