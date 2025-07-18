'use client'

import { useState, useEffect } from 'react'

/**
 * Responsive breakpoints matching the terminal theme
 */
export const breakpoints = {
  mobile: 480,
  tablet: 768,
  desktop: 1024,
  wide: 1200
} as const

export type Breakpoint = keyof typeof breakpoints

/**
 * Hook for detecting responsive breakpoints and screen size changes
 */
export function useResponsive() {
  const [screenSize, setScreenSize] = useState<{
    width: number
    height: number
  }>({ width: 0, height: 0 })
  
  const [currentBreakpoint, setCurrentBreakpoint] = useState<Breakpoint>('desktop')
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [isDesktop, setIsDesktop] = useState(true)
  const [isWide, setIsWide] = useState(false)

  useEffect(() => {
    const updateScreenSize = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      
      setScreenSize({ width, height })
      
      // Determine current breakpoint
      let breakpoint: Breakpoint = 'desktop'
      if (width <= breakpoints.mobile) {
        breakpoint = 'mobile'
      } else if (width <= breakpoints.tablet) {
        breakpoint = 'tablet'
      } else if (width <= breakpoints.desktop) {
        breakpoint = 'desktop'
      } else {
        breakpoint = 'wide'
      }
      
      setCurrentBreakpoint(breakpoint)
      
      // Set boolean flags for convenience
      setIsMobile(width <= breakpoints.mobile)
      setIsTablet(width > breakpoints.mobile && width <= breakpoints.tablet)
      setIsDesktop(width > breakpoints.tablet && width <= breakpoints.desktop)
      setIsWide(width > breakpoints.desktop)
    }

    // Set initial values
    updateScreenSize()
    
    // Add event listener for window resize
    window.addEventListener('resize', updateScreenSize)
    
    // Cleanup
    return () => window.removeEventListener('resize', updateScreenSize)
  }, [])

  return {
    screenSize,
    currentBreakpoint,
    isMobile,
    isTablet,
    isDesktop,
    isWide,
    // Utility functions
    isAtLeast: (breakpoint: Breakpoint) => screenSize.width >= breakpoints[breakpoint],
    isAtMost: (breakpoint: Breakpoint) => screenSize.width <= breakpoints[breakpoint],
    isBetween: (min: Breakpoint, max: Breakpoint) => 
      screenSize.width >= breakpoints[min] && screenSize.width <= breakpoints[max]
  }
}

/**
 * Hook for managing collapsible sidebar state with responsive behavior
 */
export function useSidebarCollapse() {
  const { isMobile } = useResponsive()
  const [isCollapsed, setIsCollapsed] = useState(false)

  // Auto-collapse on mobile by default
  useEffect(() => {
    setIsCollapsed(isMobile)
  }, [isMobile])

  const toggleCollapse = () => {
    setIsCollapsed(prev => !prev)
  }

  const collapse = () => {
    setIsCollapsed(true)
  }

  const expand = () => {
    setIsCollapsed(false)
  }

  return {
    isCollapsed,
    toggleCollapse,
    collapse,
    expand,
    isMobile
  }
}

/**
 * Hook for managing touch-friendly interactions
 */
export function useTouchFriendly() {
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  useEffect(() => {
    // Detect touch capability
    const hasTouchSupport = 'ontouchstart' in window || 
                           navigator.maxTouchPoints > 0 || 
                           (navigator as any).msMaxTouchPoints > 0

    setIsTouchDevice(hasTouchSupport)
  }, [])

  return {
    isTouchDevice,
    // Minimum touch target size (44px as per WCAG guidelines)
    minTouchTarget: 44,
    // Touch-friendly spacing
    touchSpacing: isTouchDevice ? '0.75rem' : '0.5rem'
  }
}

/**
 * Hook for managing responsive font sizes
 */
export function useResponsiveFontSize() {
  const { currentBreakpoint } = useResponsive()

  const getFontSize = (base: number = 14): number => {
    switch (currentBreakpoint) {
      case 'mobile':
        return Math.max(base * 0.85, 11)
      case 'tablet':
        return base * 0.9
      case 'desktop':
        return base
      case 'wide':
        return base * 1.1
      default:
        return base
    }
  }

  const getLineHeight = (base: number = 1.4): number => {
    switch (currentBreakpoint) {
      case 'mobile':
        return base * 1.1
      case 'tablet':
        return base * 1.05
      default:
        return base
    }
  }

  return {
    fontSize: getFontSize(),
    lineHeight: getLineHeight(),
    getFontSize,
    getLineHeight
  }
}

/**
 * Hook for managing responsive grid layouts
 */
export function useResponsiveGrid() {
  const { currentBreakpoint, screenSize } = useResponsive()

  const getGridColumns = (
    mobile: number = 1,
    tablet: number = 2,
    desktop: number = 3,
    wide: number = 4
  ): number => {
    switch (currentBreakpoint) {
      case 'mobile':
        return mobile
      case 'tablet':
        return tablet
      case 'desktop':
        return desktop
      case 'wide':
        return wide
      default:
        return desktop
    }
  }

  const getGridGap = (): string => {
    switch (currentBreakpoint) {
      case 'mobile':
        return '0.5rem'
      case 'tablet':
        return '0.75rem'
      case 'desktop':
        return '1rem'
      case 'wide':
        return '1.25rem'
      default:
        return '1rem'
    }
  }

  return {
    getGridColumns,
    getGridGap,
    screenSize
  }
}

/**
 * Hook for managing responsive layout behavior
 */
export function useResponsiveLayout() {
  const { isMobile, isTablet, currentBreakpoint, screenSize } = useResponsive()
  const { isTouchDevice } = useTouchFriendly()

  // Determine if we should use mobile layout
  const shouldUseMobileLayout = isMobile || (isTablet && isTouchDevice)

  // Get responsive padding based on screen size
  const getResponsivePadding = (base: number = 16): string => {
    switch (currentBreakpoint) {
      case 'mobile':
        return `${Math.max(base * 0.75, 8)}px`
      case 'tablet':
        return `${base * 0.9}px`
      case 'desktop':
        return `${base}px`
      case 'wide':
        return `${base * 1.1}px`
      default:
        return `${base}px`
    }
  }

  // Get responsive margin based on screen size
  const getResponsiveMargin = (base: number = 8): string => {
    switch (currentBreakpoint) {
      case 'mobile':
        return `${Math.max(base * 0.5, 4)}px`
      case 'tablet':
        return `${base * 0.75}px`
      case 'desktop':
        return `${base}px`
      case 'wide':
        return `${base * 1.25}px`
      default:
        return `${base}px`
    }
  }

  // Get responsive border radius
  const getResponsiveBorderRadius = (): string => {
    // Terminal aesthetic uses sharp corners, but we can adjust for touch
    return isTouchDevice ? '2px' : '0px'
  }

  // Get responsive transition duration
  const getResponsiveTransition = (): string => {
    return isMobile ? '0.2s' : '0.15s'
  }

  return {
    shouldUseMobileLayout,
    isTouchDevice,
    getResponsivePadding,
    getResponsiveMargin,
    getResponsiveBorderRadius,
    getResponsiveTransition,
    screenSize,
    currentBreakpoint
  }
}