import React from 'react';
import { 
  Leaf,      // Herbaceous
  Droplets,  // Sweet (Syrup)
  Citrus,    // Sour
  Sparkles,  // Spicy
  Cherry,    // Fruity
  Wind,      // Smoky (Alternative)
  Waves,     // Bitter (Tonic/Quinine)
  Zap        // Savory/Umami
} from 'lucide-react';

const SPIRIT_COLORS = {
  // Ambers & Browns
  WHISKEY: { bg: '#f2a65aff', text: '#373737ff' },
  BOURBON: { bg: '#fdcc82ff', text: '#373737ff' },
  RYE: { bg: '#de6229ff', text: '#ffffff' },
  SCOTCH: { bg: '#a16622ff', text: '#ffffff' },
  'COGNAC / BRANDY': { bg: '#4e1955ff', text: '#ffffff' },

  // Clears & Lights
  GIN: { bg: '#92ead8ff', text: '#004085' },
  VODKA: { bg: '#e0fcfdff', text: '#495057' },
  'TEQUILA / MEZCAL': { bg: '#eff86dff', text: '#155724' },

  // Others
  RUM: { bg: '#e9c71bff', text: '#721c24' },
  OTHER: { bg: '#d6d6d6ff', text: '#373737ff' },

  // Fallback
  DEFAULT: { bg: '#fdcc82ff', text: '#373737ff' },
};

const FLAVOR_CONFIG = {
  BITTER:     { icon: Waves,       color: '#6b4f4fff' }, 
  SWEET:      { icon: Droplets,    color: '#f3b43fff' },
  SAVORY:     { icon: Zap,         color: '#8b8b37ff' }, 
  SOUR:       { icon: Citrus,      color: '#d4af37ff' }, 
  SPICED:      { icon: Sparkles,    color: '#e67e22ff' }, 
  FRUITY:     { icon: Cherry,      color: '#e62e2eff' }, 
  SMOKY:      { icon: Wind,        color: '#7f8c8dff' }, 
  HERBACEOUS: { icon: Leaf,        color: '#499144ff' }, 
  DEFAULT:    { icon: Leaf,        color: '#373737ff' }
};

const Badge = ({ children, type = 'spirit' }) => {
  
  const label = children?.toString() || '';
  const lookupKey = label.toUpperCase();

  let IconToRender = null;
  let iconColor = '#373737ff';

  const baseStyle = {
    fontSize: '0.75rem',
    fontWeight: '600',
    borderRadius: '1rem',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    whiteSpace: 'nowrap'
  };

  // 2. Conditional Styles
  let typeStyle = {};

  if (type === 'spirit') {
    const colors = SPIRIT_COLORS[lookupKey] || SPIRIT_COLORS.DEFAULT;
    typeStyle = {
      backgroundColor: colors.bg,
      color: colors.text,
      padding: '0.1rem 0.6rem',
      textTransform: 'uppercase',
    };
  } else if (type === 'flavor') {
    const config = FLAVOR_CONFIG[lookupKey] || FLAVOR_CONFIG.DEFAULT;
    IconToRender = config.icon;
    iconColor = config.color;
    
    typeStyle = {
      backgroundColor: 'transparent',
      color: '#373737ff',
      padding: '0',
      textTransform: 'capitalize',
      fontWeight: '500', 
    };
  }

  const finalStyle = { ...baseStyle, ...typeStyle };

  return (
    <span style={finalStyle}>
      {IconToRender && (
        <IconToRender size={14} color={iconColor} strokeWidth={2.5} />
      )}
      {label}
    </span>
  );
};

export default Badge;