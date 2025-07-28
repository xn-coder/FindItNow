
import * as React from 'react';

export const GooglePlayIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 512 512"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M502.63,256l-90.38-90.38a14,14,0,0,0-15.09-2.36L56,256,397.16,348.74a14,14,0,0,0,15.09-2.36L502.63,256ZM56,256,4.06,14.06A14.06,14.06,0,0,0,0,24.18V487.82a14.06,14.06,0,0,0,4.06,10.12Z"
      fill="#000"
    />
    <path
      d="M397.16,157.26,56,256l341.16,98.74,57.84-35.15a14.12,14.12,0,0,0,0-24.84Z"
      fill="#ffD947"
    />
    <path d="M56,256,4.06,497.94A14.06,14.06,0,0,0,14.18,512H56Z" fill="#ff7656" />
    <path d="M56,256,14.18,0H56Z" fill="#69d2e1" />
    <path
      d="M397.16,354.74,56,256,14.18,512H397.16Z"
      opacity="0.15"
      style={{
        mixBlendMode: 'multiply',
      }}
    />
    <path
      d="M397.16,157.26,14.18,0H397.16Z"
      opacity="0.15"
      style={{
        mixBlendMode: 'multiply',
      }}
    />
  </svg>
);

export const AppStoreIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 512 512"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g fill="#000">
      <path d="m422.3 256-42.2-24.3v-72.9c0-26.6-9.7-48.4-29.2-65.5-20.1-17.5-45.8-26.6-77-26.6-25.5 0-48.1 6.3-67.8 19-17.8 11.4-32.4 28.5-43.7 51.3-11.3-22.8-25.9-40-43.7-51.3-19.7-12.7-42.3-19-67.8-19-31.2 0-56.9 9.1-77 26.6-19.5 17.1-29.2 38.9-29.2 65.5v228.4c0 26.6 9.7 48.4 29.2 65.5 20.1 17.5 45.8 26.6 77 26.6 25.5 0 48.1-6.3 67.8-19 17.8-11.4 32.4-28.5 43.7-51.3 11.3 22.8 25.9 40 43.7 51.3 19.7 12.7 42.3 19 67.8 19 31.2 0 56.9-9.1 77-26.6 19.5-17.1 29.2-38.9 29.2-65.5v-72.9l-42.2-24.3zm-147.1 53.3c-7.9 4.5-16.3 6.8-25.2 6.8s-17.3-2.3-25.2-6.8v-106.5c7.9-4.5 16.3-6.8 25.2-6.8s17.3 2.3 25.2 6.8v106.5z" />
    </g>
  </svg>
);

export const SecureReportsIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="16" />
        <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
);

export const FastMatchingIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
);

export const VerifiedUsersIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
);

export const StarIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
);
