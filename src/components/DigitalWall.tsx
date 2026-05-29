import React from 'react';
import { useAudio } from '../hooks/useAudio';

const COLUMN_1_ITEMS = [
  {
    title: 'vertexShader.glsl',
    content: `void main() {
  vUv = uv;
  vec3 pos = position;
  pos.z += sin(pos.x * 10.0 + time) * 0.1;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}`
  },
  {
    title: 'edgeNode.rs',
    content: `#[tokio::main]
async fn main() -> Result<(), Error> {
    let state = State::init().await?;
    let mut stream = TcpStream::connect("127.0.0.1:8080").await?;
    loop {
        stream.write_all(b"PING").await?;
    }
}`
  },
  {
    title: 'neuralTrainer.ts',
    content: `const model = tf.sequential();
model.add(tf.layers.dense({ units: 128, activation: 'relu', inputShape: [64] }));
model.add(tf.layers.dense({ units: 10, activation: 'softmax' }));
model.compile({ optimizer: 'adam', loss: 'categoricalCrossentropy' });`
  },
  {
    title: 'matrixProjection.glsl',
    content: `float speed = time * 2.0;
vec2 grid = fract(uv * 20.0);
float line = step(0.95, grid.x) + step(0.95, grid.y);
gl_FragColor = vec4(vec3(0.0, 1.0, 0.53) * line, 1.0);`
  }
];

const COLUMN_2_ITEMS = [
  {
    label: 'NODE STATUS: ACTIVE',
    metric: '98.4% CAP',
    details: 'Neural routing channels open. Shard load distributed. Edge latency: 1.2ms. Handshake verified.'
  },
  {
    label: 'BLOCKCHAIN SYNC',
    metric: 'BLOCK #842,912',
    details: 'Decentralized contract signature matched. Gas limit optimized. Block time: 0.8s. Threat rating: SAFE.'
  },
  {
    label: 'WEBAUDIO OUT',
    metric: '44.1kHz STEREO',
    details: 'Master polyphony active. 32 oscillators compiling. Frequency modulation LFO: 0.15Hz. Volume: 0.08.'
  },
  {
    label: 'WEBGPU KERNEL',
    metric: 'COMPILER: OK',
    details: 'WebGPU adapter loaded. Pipeline layout bound. Grid configuration: [64, 64, 1]. Compute shaders online.'
  }
];

const COLUMN_3_ITEMS = [
  {
    title: 'R3FScene.tsx',
    content: `return (
  <Canvas camera={{ position: [0, 1.2, 3.2] }}>
    <ambientLight intensity={0.15} />
    <spotLight position={[2, 4, 3]} intensity={2.5} color="#00f0ff" />
    <Grid args={[30, 30]} cellSize={0.5} cellColor="#00f0ff" />
  </Canvas>
);`
  },
  {
    title: 'wasmBridge.rs',
    content: `#[wasm_bindgen]
pub fn process_pixels(buffer: &mut [u8]) {
    for pixel in buffer.chunks_mut(4) {
        let r = pixel[0] as f32;
        pixel[0] = (r * 0.393) as u8;
    }
}`
  },
  {
    title: 'authFlow.ts',
    content: `const auth = new AuthClient({
  domain: "auth.expo.net",
  clientId: "client_94f8b2c",
  redirectUri: window.location.origin
});
const session = await auth.getSession();`
  },
  {
    title: 'audioSynth.ts',
    content: `const osc = ctx.createOscillator();
const gain = ctx.createGain();
osc.frequency.setValueAtTime(55, ctx.currentTime);
gain.gain.setValueAtTime(0.06, ctx.currentTime);
osc.connect(gain);`
  }
];

export const DigitalWall: React.FC = () => {
  const { playHover } = useAudio();

  return (
    <section
      id="digital-wall"
      style={{
        padding: '120px 0',
        position: 'relative',
        zIndex: 10,
        background: 'linear-gradient(to bottom, transparent, rgba(5, 8, 22, 0.95) 10%, rgba(5, 8, 22, 0.95) 90%, transparent)',
        overflow: 'hidden'
      }}
    >
      <div className="container">
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <span
            style={{
              fontFamily: "'Orbitron', sans-serif",
              fontSize: '0.8rem',
              color: '#ec4899',
              letterSpacing: '5px',
              textTransform: 'uppercase',
              display: 'block',
              marginBottom: '15px'
            }}
            className="text-glow-purple"
          >
            REALTIME STREAM
          </span>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '20px', letterSpacing: '1px' }}>
            DIGITAL EXPOSITION WALL
          </h2>
          <div style={{ width: '80px', height: '4px', background: 'linear-gradient(90deg, #ec4899, #8b5cf6)', margin: '0 auto', borderRadius: '2px' }} />
        </div>

        {/* Wall Columns Grid */}
        <div
          className="digital-wall-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '30px',
            height: '600px',
            overflow: 'hidden',
            position: 'relative',
            maskImage: 'linear-gradient(to bottom, transparent 0%, #000 15%, #000 85%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, #000 15%, #000 85%, transparent 100%)'
          }}
        >
          {/* Column 1 (Scrolls Up) */}
          <div className="scroll-col-up" style={{ display: 'flex', flexDirection: 'column', gap: '30px', animation: 'scrollUp 25s linear infinite' }}>
            {[...COLUMN_1_ITEMS, ...COLUMN_1_ITEMS].map((item, idx) => (
              <div
                key={idx}
                className="glass-panel"
                style={{
                  padding: '20px',
                  border: '1px solid rgba(0, 240, 255, 0.1)',
                  backgroundColor: 'rgba(5, 8, 22, 0.7)'
                }}
                onMouseEnter={playHover}
              >
                <div style={{ fontSize: '0.75rem', color: '#00f0ff', fontFamily: "'Orbitron', sans-serif", marginBottom: '10px', fontWeight: 700, letterSpacing: '1px' }}>
                  {item.title}
                </div>
                <pre style={{
                  fontFamily: 'monospace',
                  fontSize: '0.7rem',
                  color: '#9ca3af',
                  whiteSpace: 'pre-wrap',
                  lineHeight: '1.4',
                  backgroundColor: 'rgba(0,0,0,0.3)',
                  padding: '12px',
                  borderRadius: '4px'
                }}>
                  <code>{item.content}</code>
                </pre>
              </div>
            ))}
          </div>

          {/* Column 2 (Scrolls Down) */}
          <div className="scroll-col-down" style={{ display: 'flex', flexDirection: 'column', gap: '30px', animation: 'scrollDown 20s linear infinite' }}>
            {[...COLUMN_2_ITEMS, ...COLUMN_2_ITEMS].map((item, idx) => (
              <div
                key={idx}
                className="glass-panel-purple"
                style={{
                  padding: '24px',
                  border: '1px solid rgba(139, 92, 246, 0.15)',
                  backgroundColor: 'rgba(5, 8, 22, 0.7)'
                }}
                onMouseEnter={playHover}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.75rem', color: '#8b5cf6', fontFamily: "'Orbitron', sans-serif", fontWeight: 700, letterSpacing: '1px' }}>
                    {item.label}
                  </span>
                  <span style={{ fontSize: '0.65rem', color: '#00ff88', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 }}>
                    {item.metric}
                  </span>
                </div>
                <p style={{ fontSize: '0.8rem', color: '#9ca3af', lineHeight: '1.5' }}>
                  {item.details}
                </p>
              </div>
            ))}
          </div>

          {/* Column 3 (Scrolls Up) */}
          <div className="scroll-col-up" style={{ display: 'flex', flexDirection: 'column', gap: '30px', animation: 'scrollUp 30s linear infinite' }}>
            {[...COLUMN_3_ITEMS, ...COLUMN_3_ITEMS].map((item, idx) => (
              <div
                key={idx}
                className="glass-panel"
                style={{
                  padding: '20px',
                  border: '1px solid rgba(0, 240, 255, 0.1)',
                  backgroundColor: 'rgba(5, 8, 22, 0.7)'
                }}
                onMouseEnter={playHover}
              >
                <div style={{ fontSize: '0.75rem', color: '#00f0ff', fontFamily: "'Orbitron', sans-serif", marginBottom: '10px', fontWeight: 700, letterSpacing: '1px' }}>
                  {item.title}
                </div>
                <pre style={{
                  fontFamily: 'monospace',
                  fontSize: '0.7rem',
                  color: '#9ca3af',
                  whiteSpace: 'pre-wrap',
                  lineHeight: '1.4',
                  backgroundColor: 'rgba(0,0,0,0.3)',
                  padding: '12px',
                  borderRadius: '4px'
                }}>
                  <code>{item.content}</code>
                </pre>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Embedded CSS for Columns scrolling and responsiveness */}
      <style>{`
        @keyframes scrollUp {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        @keyframes scrollDown {
          0% { transform: translateY(-50%); }
          100% { transform: translateY(0); }
        }
        .scroll-col-up:hover, .scroll-col-down:hover {
          animation-play-state: paused;
        }
        
        @media (max-width: 768px) {
          .digital-wall-grid {
            height: auto !important;
            overflow: visible !important;
            mask-image: none !important;
            -webkit-mask-image: none !important;
          }
          .scroll-col-up, .scroll-col-down {
            animation-duration: 40s !important; /* Slow down scrolling on mobile for readability */
          }
        }
      `}</style>
    </section>
  );
};
