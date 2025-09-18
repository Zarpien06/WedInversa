import { Suspense, useState, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  OrbitControls, 
  PerspectiveCamera, 
  Environment, 
  Float,
  Sparkles,
  Stars
} from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Settings,
  Headphones,
  Eye,
  Hand,
  Zap
} from 'lucide-react';

// Componente de esfera interactiva flotante
function InteractiveSphere({ position, color, scale = 1 }: { position: [number, number, number], color: string, scale?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.3;
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
      meshRef.current.scale.setScalar(scale * (hovered ? 1.2 : 1) * (clicked ? 0.9 : 1));
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh
        ref={meshRef}
        position={position}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onPointerDown={() => setClicked(true)}
        onPointerUp={() => setClicked(false)}
      >
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial 
          color={color} 
          emissive={hovered ? color : '#000000'}
          emissiveIntensity={hovered ? 0.3 : 0}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
    </Float>
  );
}

// Componente de partículas interactivas
function ParticleField() {
  const points = useRef<THREE.Points>(null);
  const particleCount = 1000;

  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 50;
    positions[i + 1] = (Math.random() - 0.5) * 50;
    positions[i + 2] = (Math.random() - 0.5) * 50;

    colors[i] = Math.random();
    colors[i + 1] = Math.random();
    colors[i + 2] = Math.random();
  }

  useFrame((state) => {
    if (points.current) {
      points.current.rotation.x = state.clock.elapsedTime * 0.05;
      points.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleCount}  
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.1} vertexColors sizeAttenuation />
    </points>
  );
}

// Escena 3D principal
function Scene3D() {
  const { camera } = useThree();
  
  useEffect(() => {
    camera.position.set(0, 0, 10);
  }, [camera]);

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 10]} />
      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      
      {/* Iluminación ambiental */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, -10, -5]} color="#ff0080" intensity={0.5} />
      
      {/* Entorno y estrellas */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />
      <Environment preset="night" />
      
      {/* Partículas de fondo */}
      <ParticleField />
      
      {/* Efectos de chispas */}
      <Sparkles count={100} scale={20} size={2} speed={0.4} />
      
      {/* Objetos interactivos */}
      <InteractiveSphere position={[-3, 2, 0]} color="#ff6b6b" scale={0.8} />
      <InteractiveSphere position={[3, -1, -2]} color="#4ecdc4" scale={1.2} />
      <InteractiveSphere position={[0, 0, 3]} color="#45b7d1" scale={1} />
      <InteractiveSphere position={[-2, -3, -1]} color="#f9ca24" scale={0.9} />
      <InteractiveSphere position={[4, 1, 1]} color="#f0932b" scale={1.1} />
    </>
  );
}

// Panel de control UI
function ControlPanel() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  return (
    <motion.div 
      className="fixed bottom-4 left-4 right-4 z-10"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1 }}
    >
      <div className="bg-black/20 backdrop-blur-lg rounded-2xl p-4 border border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-3 rounded-full bg-cyan-500/20 hover:bg-cyan-500/30 transition-colors border border-cyan-500/30"
            >
              {isPlaying ? <Pause className="w-6 h-6 text-cyan-400" /> : <Play className="w-6 h-6 text-cyan-400" />}
            </button>
            
            <button 
              onClick={() => setVolume(!volume)}
              className="p-3 rounded-full bg-purple-500/20 hover:bg-purple-500/30 transition-colors border border-purple-500/30"
            >
              {volume ? <Volume2 className="w-6 h-6 text-purple-400" /> : <VolumeX className="w-6 h-6 text-purple-400" />}
            </button>

            <div className="hidden sm:flex items-center space-x-2 text-white/80">
              <Headphones className="w-4 h-4" />
              <span className="text-sm">Audio Espacial</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-4 text-white/60 text-sm">
              <div className="flex items-center space-x-1">
                <Eye className="w-4 h-4" />
                <span>VR Ready</span>
              </div>
              <div className="flex items-center space-x-1">
                <Hand className="w-4 h-4" />
                <span>Gestos</span>
              </div>
              <div className="flex items-center space-x-1">
                <Zap className="w-4 h-4" />
                <span>60 FPS</span>
              </div>
            </div>
            
            <button 
              onClick={() => setShowSettings(!showSettings)}
              className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <Settings className="w-5 h-5 text-white" />
            </button>
            
            <button className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
              <Maximize className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Loading Screen
function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center z-50">
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div 
          className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full mx-auto mb-4"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <motion.h2 
          className="text-2xl font-bold text-white mb-2"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Cargando Experiencia Inmersiva
        </motion.h2>
        <p className="text-cyan-300">Preparando el futuro del internet...</p>
      </motion.div>
    </div>
  );
}

// Componente principal
export default function App() {
  const [loading, setLoading] = useState(true);
  const [showUI, setShowUI] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'h' || e.key === 'H') {
        setShowUI(!showUI);
      }
    };

    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [showUI]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="w-full h-screen bg-black overflow-hidden relative">
      {/* Header UI */}
      <AnimatePresence>
        {showUI && (
          <motion.header 
            className="fixed top-4 left-4 right-4 z-10"
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="bg-black/20 backdrop-blur-lg rounded-2xl p-4 border border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                    Internet Inmersivo
                  </h1>
                  <p className="text-white/60 text-sm">Experiencia 3D Interactiva</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400 text-sm">Conectado</span>
                </div>
              </div>
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      {/* Escena 3D */}
      <Canvas className="w-full h-full">
        <Suspense fallback={null}>
          <Scene3D />
        </Suspense>
      </Canvas>

      {/* Panel de control */}
      <AnimatePresence>
        {showUI && <ControlPanel />}
      </AnimatePresence>

      {/* Hint para ocultar UI */}
      <AnimatePresence>
        {showUI && (
          <motion.div 
            className="fixed top-4 right-4 z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 2 }}
          >
            <div className="bg-black/40 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20">
              <p className="text-white/70 text-xs">Presiona 'H' para ocultar UI</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gradiente de fondo */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-cyan-900/20 pointer-events-none" />
    </div>
  );
}
