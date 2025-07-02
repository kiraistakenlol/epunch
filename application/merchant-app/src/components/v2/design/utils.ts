import React from 'react'
import SVG from 'react-inlinesvg'
import { PunchCardStyleDto } from 'e-punch-common-core'

export const renderIconPreview = (style: PunchCardStyleDto) => {
  if (style.punchIcons) {
    try {
      return React.createElement('div', { className: 'flex space-x-1' }, [
        React.createElement('div', { 
          key: 'filled',
          className: 'w-4 h-4 flex items-center justify-center' 
        }, 
          style.punchIcons.filled 
            ? React.createElement(SVG, {
                src: `data:image/svg+xml;utf8,${encodeURIComponent(style.punchIcons.filled.data.svg_raw_content)}`,
                width: 16,
                height: 16
              })
            : React.createElement('span', { className: 'text-sm' }, '●')
        ),
        React.createElement('div', { 
          key: 'unfilled',
          className: 'w-4 h-4 flex items-center justify-center' 
        }, 
          style.punchIcons.unfilled 
            ? React.createElement(SVG, {
                src: `data:image/svg+xml;utf8,${encodeURIComponent(style.punchIcons.unfilled.data.svg_raw_content)}`,
                width: 16,
                height: 16
              })
            : React.createElement('span', { className: 'text-sm opacity-50' }, '○')
        )
      ])
    } catch (error) {
      console.warn('Failed to render custom icons:', error)
    }
  }
  
  // Default fallback
  return React.createElement('div', { className: 'flex space-x-1' }, [
    React.createElement('span', { key: 'filled', className: 'text-sm' }, '●'),
    React.createElement('span', { key: 'unfilled', className: 'text-sm opacity-50' }, '○')
  ])
}

export const getDefaultStyle = (): PunchCardStyleDto => ({
  primaryColor: null,
  secondaryColor: null,
  logoUrl: null,
  backgroundImageUrl: null,
  punchIcons: null
}) 