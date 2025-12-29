
import React, { useEffect, useRef, memo } from 'react';

const MarketWidget: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetId = "tradingview_widget_" + Math.random().toString(36).substring(7);

  useEffect(() => {
    // Helper to load script
    const loadScript = () => {
        if (typeof window.TradingView !== 'undefined' && containerRef.current) {
            new window.TradingView.widget({
              autosize: true,
              symbol: "BMFBOVESPA:WIN1!",
              interval: "1", // Updated to 1 minute as requested
              timezone: "America/Sao_Paulo",
              theme: "dark",
              style: "1",
              locale: "br",
              enable_publishing: false,
              backgroundColor: "rgba(10, 10, 15, 1)",
              gridColor: "rgba(255, 255, 255, 0.05)",
              allow_symbol_change: false,
              container_id: containerRef.current.id,
              hide_side_toolbar: true,
              hide_top_toolbar: true,
              details: false,
              hotlist: false,
              calendar: false,
              toolbar_bg: "#0A0A0F",
              save_image: false
            });
          }
    }

    const scriptId = 'tradingview-widget-script';
    const existingScript = document.getElementById(scriptId);

    if (!existingScript) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://s3.tradingview.com/tv.js';
      script.async = true;
      script.onload = loadScript;
      document.head.appendChild(script);
    } else {
      loadScript();
    }
  }, []);

  return (
    <div className="w-full h-full relative z-10 rounded-2xl overflow-hidden border border-white/5 bg-[#0A0A0F]">
       <div id={widgetId} ref={containerRef} className="h-full w-full" />
    </div>
  );
};

declare global {
  interface Window {
    TradingView: any;
  }
}

export default memo(MarketWidget);
