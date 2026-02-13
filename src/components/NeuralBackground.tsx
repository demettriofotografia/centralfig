
import React, { useEffect, useState, useRef } from 'react';

const NeuralBackground: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const { clientX, clientY } = e;
      const { width, height } = containerRef.current.getBoundingClientRect();
      const x = (clientX / width) * 100;
      const y = (clientY / height) * 100;
      
      // Suavização simples via state (o CSS cuidará da transição suave)
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none transition-colors duration-1000"
      style={{ 
        backgroundColor: '#050505',
        // Definindo variáveis CSS para os gradientes seguirem o mouse
        ['--mouse-x' as any]: `${mousePos.x}%`,
        ['--mouse-y' as any]: `${mousePos.y}%`,
      }}
    >
      {/* Camada 1: Gradiente de Luz que segue o mouse (Primário) */}
      <div 
        className="absolute inset-0 opacity-40 transition-all duration-700 ease-out"
        style={{
          background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(255, 77, 0, 0.15), transparent 80%)`
        }}
      ></div>

      {/* Camada 2: Blobs orgânicos estáticos mas pulsantes (como na imagem) */}
      <div className="absolute inset-0">
        {/* Blob Superior Esquerdo - Laranja Escuro */}
        <div className="absolute top-[-20%] left-[-10%] w-[100%] h-[100%] rounded-full bg-[#2a0f00] blur-[140px] animate-slow-float"></div>
        
        {/* O "Feixe" de luz da imagem - Central e Diagonal */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[40%] bg-gradient-to-r from-transparent via-[#FF4D00]/10 to-transparent rotate-[-35deg] blur-[100px] animate-pulse-slow"
        ></div>

        {/* Blob Dourado - Canto Inferior */}
        <div className="absolute bottom-[-30%] right-[-10%] w-[80%] h-[80%] rounded-full bg-[#FF8A00]/5 blur-[160px] animate-slow-float-reverse"></div>
      </div>

      {/* Camada 3: Luz de "Aura" que reage ao mouse de forma inversa para profundidade */}
      <div 
        className="absolute inset-0 opacity-20 transition-transform duration-1000 ease-out"
        style={{
          transform: `translate(${(mousePos.x - 50) * 0.05}%, ${(mousePos.y - 50) * 0.05}%)`,
          background: `radial-gradient(1000px circle at 50% 50%, rgba(255, 204, 128, 0.05), transparent 100%)`
        }}
      ></div>

      {/* Camada 4: Malha de Gradiente (Mesh) fluida baseada na imagem */}
      <div className="absolute inset-0 opacity-50 mix-blend-screen">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="meshGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#3d1900', stopOpacity: 0.2 }} />
              <stop offset="50%" style={{ stopColor: '#FF4D00', stopOpacity: 0.1 }} />
              <stop offset="100%" style={{ stopColor: '#050505', stopOpacity: 0 }} />
            </linearGradient>
          </defs>
          <path d="M0,0 C30,40 70,20 100,0 L100,100 C70,80 30,60 0,100 Z" fill="url(#meshGrad)">
            <animate 
              attributeName="d" 
              dur="25s" 
              repeatCount="indefinite"
              values="
                M0,0 C30,40 70,20 100,0 L100,100 C70,80 30,60 0,100 Z;
                M0,0 C10,60 90,40 100,0 L100,100 C90,60 10,40 0,100 Z;
                M0,0 C40,20 60,80 100,0 L100,100 C60,20 40,80 0,100 Z;
                M0,0 C30,40 70,20 100,0 L100,100 C70,80 30,60 0,100 Z
              "
            />
          </path>
        </svg>
      </div>

      {/* Camada 5: Textura de Grão Premium */}
      <div 
        className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      ></div>

      <style>{`
        @keyframes slow-float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(2%, 3%) scale(1.05); }
        }
        @keyframes slow-float-reverse {
          0%, 100% { transform: translate(0, 0) scale(1.05); }
          50% { transform: translate(-3%, -2%) scale(1); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.15; }
        }
        .animate-slow-float {
          animation: slow-float 15s ease-in-out infinite;
        }
        .animate-slow-float-reverse {
          animation: slow-float-reverse 18s ease-in-out infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 10s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default NeuralBackground;
