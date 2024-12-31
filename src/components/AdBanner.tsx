import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export function AdBanner() {
  const adRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (!window.adsbygoogle) {
      window.adsbygoogle = [];
    }

    const initAd = () => {
      if (initialized.current || !adRef.current) return;
      
      try {
        initialized.current = true;
        window.adsbygoogle.push({});
      } catch (err) {
        console.error('AdSense error:', err);
      }
    };

    // Wait for the container to be properly sized
    const observer = new ResizeObserver((entries) => {
      const [entry] = entries;
      if (entry?.contentRect.width > 0) {
        initAd();
      }
    });

    if (adRef.current) {
      observer.observe(adRef.current);
    }

    return () => {
      observer.disconnect();
      initialized.current = false;
    };
  }, []);

  return (
    <div className="w-[300px] h-[600px]">
      <div 
        ref={adRef}
        className="sticky top-4 w-[300px] h-[600px] bg-gray-50 rounded-lg border border-gray-200 overflow-hidden"
      >
        <ins
          className="adsbygoogle"
          style={{
            display: 'block',
            width: '300px',
            height: '600px'
          }}
          data-ad-client="ca-pub-YOUR_PUBLISHER_ID"
          data-ad-slot="YOUR_AD_SLOT_ID"
          data-ad-format="vertical"
          data-full-width-responsive="false"
        />
      </div>
    </div>
  );
}