import React from 'react';
import logoSrc from './logo.svg';

export function LogoMultimidia() {
  return (
    <div className="flex justify-center">
      <img src={logoSrc} alt="Multimídia" className="h-10" />
    </div>
  );
}
