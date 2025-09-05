"use client";

interface KinirLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'black' | 'white';
  showSubtitle?: boolean;
  square?: boolean;
  style?: React.CSSProperties;
  subtitleStyle?: React.CSSProperties;
}

export default function KinirLogo({ 
  className = "", 
  size = 'lg', 
  color = 'black',
  showSubtitle = true,
  square = false,
  style = {},
  subtitleStyle = {}
}: KinirLogoProps) {
  // Size mapping for the logo text
  const sizeClasses = {
    sm: 'text-2xl sm:text-3xl',
    md: 'text-3xl sm:text-4xl md:text-5xl',
    lg: 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl',
    xl: 'text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl'
  };

  // Size mapping for the container padding
  const containerPadding = {
    sm: square ? 'px-0.5 py-1 sm:px-1 sm:py-2' : 'px-3 sm:px-4 py-2 sm:py-3',
    md: square ? 'px-0.5 py-1 sm:px-1 sm:py-2 md:px-1.5 md:py-3' : 'px-4 sm:px-5 md:px-6 py-3 sm:py-4 md:py-5',
    lg: square ? 'px-0.5 py-1 sm:px-1 sm:py-2 md:px-1.5 md:py-3' : 'px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5',
    xl: square ? 'px-0.5 py-1 sm:px-1 sm:py-2 md:px-1.5 md:py-3' : 'px-6 sm:px-8 md:px-10 py-4 sm:py-5 md:py-6'
  };

  const textColor = color === 'white' ? 'text-white' : 'text-black';
  const subtitleColor = color === 'white' ? 'text-white' : 'text-black';

  return (
    <div 
      className={`bg-tribal-striped text-white ${containerPadding[size]} shadow-xl border border-white/20 backdrop-blur-sm ${square ? 'block' : 'inline-block'} ${className}`}
      style={square ? { 
        ...style, 
        aspectRatio: '1/1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      } : style}
    >
      <div className="flex items-center" style={{ marginTop: '8%' }}>
        <h1 
          className={`relative font-normal tracking-wider drop-shadow-md font-kiner ${textColor} cursor-pointer kinir-logo ${sizeClasses[size]}`}
          style={{ lineHeight: '1', display: 'inline-block' }}
        >
          <span className="double-underline" style={{ display: 'inline-block' }}>K</span>
          <span className="double-underline" style={{ display: 'inline-block' }}>i</span>
          <span style={{ display: 'inline-block' }}>n</span>
          <span className="double-underline" style={{ display: 'inline-block' }}>i</span>
          <span style={{ display: 'inline-block' }}>r</span>
          {showSubtitle && (
            <span 
              className={`absolute ${subtitleColor} subtitle`}
              style={{ 
                top: '111%', 
                right: '5%', 
                fontSize: '0.454645726rem',
                whiteSpace: 'nowrap', 
                fontFamily: '"Monotype Corsiva", cursive', 
                letterSpacing: '-0.05em', 
                transform: 'translateY(-50%)',
                ...subtitleStyle
              }}
            >
              <span className="dots-typewriter"></span>Anything Tribal
            </span>
          )}
        </h1>
      </div>
    </div>
  );
}
