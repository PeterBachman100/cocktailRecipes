import React from 'react';
import { Leaf, Droplets, Citrus, Sparkles, Cherry, Wind, Waves, Zap } from 'lucide-react';

const SPIRIT_COLORS = {
  WHISKEY: { bg: '#f2a65a88', text: '#373737ff' },
  BOURBON: { bg: '#fdcc8280', text: '#373737ff' },
  RYE: { bg: '#de622975', text: '#2c2c2cff' },
  SCOTCH: { bg: '#a1662277', text: '#ffffff' },
  COGNAC: { bg: '#4e19557b', text: '#ffffffff' },
  BRANDY: { bg: '#4e19557b', text: '#ffffffff' },
  'FORTIFIED WINE': { bg: '#4e19557b', text: '#ffffffff' },
  GIN: { bg: '#92ead873', text: '#323232ff' },
  VODKA: { bg: '#e0fcfd98', text: '#495057' },
  'TEQUILA / MEZCAL': { bg: '#e8fc778d', text: '#252525ff' },
  RUM: { bg: '#e9c71b72', text: '#474747ff' },
  LIQUEUR: { bg: '#000000', text: '#ffffff' },
  OTHER: { bg: '#d6d6d67b', text: '#373737ff' },
  DEFAULT: { bg: '#a9a9a981', text: '#373737ff' },
};

const FLAVOR_CONFIG = {
  BITTER:     { icon: Waves,       color: '#6b4f4fff' }, 
  SWEET:      { icon: Droplets,    color: '#f3b43fff' },
  SAVORY:     { icon: Zap,         color: '#8b8b37ff' }, 
  SOUR:       { icon: Citrus,      color: '#d4af37ff' }, 
  SPICED:     { icon: Sparkles,    color: '#e67e22ff' }, 
  FRUITY:     { icon: Cherry,      color: '#e62e2eff' }, 
  SMOKY:      { icon: Wind,        color: '#7f8c8dff' }, 
  HERBAL:     { icon: Leaf,        color: '#499144ff' }, 
  DEFAULT:    { icon: Leaf,        color: '#373737ff' }
};

const Badge = ({ children, type = 'spirit', onClick }) => {
  
  const label = children?.toString() || '';
  const lookupKey = label.toUpperCase();
  const Component = onClick ? 'button' : 'span';

  let IconToRender = null;
  let dynamicVars = {};

  if (type === 'spirit') {
    const colors = SPIRIT_COLORS[lookupKey] || SPIRIT_COLORS.DEFAULT;
    dynamicVars = {
      '--badge-bg': colors.bg,
      '--badge-text': colors.text
    };
  } if (type === 'flavor') {
    const config = FLAVOR_CONFIG[lookupKey] || FLAVOR_CONFIG.DEFAULT;
    IconToRender = config.icon;
    dynamicVars = { '--icon-color': config.color };
    
  } 

  const classNames = `Badge Badge--${type}`;

  return (
    <Component 
      className={classNames}
      style={dynamicVars}
      onClick={onClick}
      type={onClick ? "button" : undefined} 
    >
      {IconToRender && <IconToRender className="Badge_icon" size={20} color={dynamicVars['--icon-color'] || '#373737ff'} strokeWidth={2.5} />}
      {label}
    </Component>
  );
};

export default Badge;