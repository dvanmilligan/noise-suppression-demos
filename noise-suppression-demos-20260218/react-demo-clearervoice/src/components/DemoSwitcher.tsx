import { useState } from 'react';
import './DemoSwitcher.css';
import { GuxButton } from 'genesys-spark-components-react';
import Card from './Card';

interface Demo {
  id: string;
  name: string;
  icon: string;
  description: string;
  directory: string;
  command: string;
  port: number;
  status: 'active' | 'available' | 'coming-soon';
  features: string[];
  website?: string;
}

const demos: Demo[] = [
  {
    id: 'baseline',
    name: 'Baseline Demo',
    icon: '📱',
    description: 'Standard WebRTC with browser\'s built-in noise suppression. This is the reference implementation.',
    directory: 'react-demo-app',
    command: 'cd ~/kiro/genesys-cloud-webrtc-sdk && lsof -ti :8443 | xargs kill -9 2>/dev/null; cd react-demo-app && npm run dev',
    port: 8443,
    status: 'available',
    features: ['Standard WebRTC', 'Browser noise suppression', 'Reference implementation'],
    website: 'https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints/noiseSuppression'
  },
  {
    id: 'speex',
    name: 'Speex Demo',
    icon: '🎯',
    description: 'Open-source Speex noise suppression. Runs entirely in browser with zero latency.',
    directory: 'react-demo-clearervoice',
    command: 'cd ~/kiro/genesys-cloud-webrtc-sdk && lsof -ti :8443 | xargs kill -9 2>/dev/null; cd react-demo-clearervoice && npm run dev',
    port: 8443,
    status: 'active',
    features: ['Real-time processing', 'Open-source (BSD)', 'No backend required'],
    website: 'https://www.speex.org/'
  },
  {
    id: 'rnnoise',
    name: 'RNNoise Demo',
    icon: '🤖',
    description: 'AI-based RNNoise for advanced noise suppression. Experimental feature.',
    directory: 'react-demo-rnnoise',
    command: 'cd ~/kiro/genesys-cloud-webrtc-sdk && lsof -ti :8443 | xargs kill -9 2>/dev/null; cd react-demo-rnnoise && npm run dev',
    port: 8443,
    status: 'available',
    features: ['AI-based processing', 'Advanced algorithms', 'Experimental'],
    website: 'https://jmvalin.ca/demo/rnnoise/'
  },
  {
    id: 'deepfilternet',
    name: 'DeepFilterNet Demo',
    icon: '🔬',
    description: 'State-of-the-art deep learning noise suppression. Coming soon!',
    directory: 'react-demo-deepfilternet',
    command: 'cd ~/kiro/genesys-cloud-webrtc-sdk && lsof -ti :8443 | xargs kill -9 2>/dev/null; cd react-demo-deepfilternet && npm run dev',
    port: 8443,
    status: 'coming-soon',
    features: ['Deep learning', 'State-of-the-art quality', 'Full-band 48kHz'],
    website: 'https://github.com/Rikorose/DeepFilterNet'
  }
];

export default function DemoSwitcher() {
  const [showModal, setShowModal] = useState(false);
  const [selectedDemo, setSelectedDemo] = useState<Demo | null>(null);
  const [copiedCommand, setCopiedCommand] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const currentDemo = demos.find(d => d.status === 'active') || demos[0];

  const handleDemoClick = (demo: Demo) => {
    if (demo.status === 'coming-soon') {
      alert(`${demo.name} is coming soon! This feature is currently under development.`);
      return;
    }
    
    if (demo.id === currentDemo.id) {
      return; // Already on this demo
    }
    setSelectedDemo(demo);
    setShowModal(true);
  };

  const handleCopyCommand = () => {
    if (selectedDemo) {
      navigator.clipboard.writeText(selectedDemo.command).then(() => {
        setCopiedCommand(true);
        setTimeout(() => setCopiedCommand(false), 2000);
      }).catch(() => {
        alert('Failed to copy command. Please copy manually.');
      });
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedDemo(null);
    setCopiedCommand(false);
  };

  return (
    <>
      <Card className='demo-switcher-container'>
        <div 
          className="demo-switcher-header" 
          onClick={() => setIsExpanded(!isExpanded)}
          style={{ cursor: 'pointer' }}
        >
          <div className="demo-switcher-title">
            <span style={{ fontSize: '24px', marginRight: '10px' }}>🔄</span>
            <div>
              <h4>Switch Demo {isExpanded ? '▼' : '▶'}</h4>
              <p className="current-demo">Currently viewing: <strong>{currentDemo.name}</strong></p>
            </div>
          </div>
        </div>

        {isExpanded && (
          <div className="demo-switcher-content">
            <p className="switcher-info">
              Compare different noise suppression technologies. Click a demo to see launch instructions.
            </p>
            <div className="demo-grid">
              {demos.map(demo => (
                <div 
                  key={demo.id} 
                  className={`demo-card ${demo.status === 'active' ? 'active' : ''} ${demo.status === 'coming-soon' ? 'coming-soon' : ''}`}
                  onClick={() => handleDemoClick(demo)}
                >
                  <span className="demo-icon">{demo.icon}</span>
                  <div className="demo-card-header">
                    <h5>{demo.name}</h5>
                    {demo.status === 'active' && (
                      <span className="badge badge-active">Current</span>
                    )}
                  </div>
                  <p className="demo-description-short">{demo.description.split('.')[0]}</p>
                  <ul className="demo-features">
                    {demo.features.slice(0, 2).map((feature, idx) => (
                      <li key={idx}>
                        <span style={{ marginRight: '8px' }}>✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  {demo.website && (
                    <a 
                      href={demo.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="demo-website-link"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Learn more →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Modal */}
      {showModal && selectedDemo && (
        <div className="demo-modal-overlay" onClick={handleCloseModal}>
          <div className="demo-modal" onClick={(e) => e.stopPropagation()}>
            <div className="demo-modal-header">
              <span className="demo-modal-icon">{selectedDemo.icon}</span>
              <h2>{selectedDemo.name}</h2>
            </div>
            
            <p className="demo-modal-description">{selectedDemo.description}</p>
            
            <div className="demo-modal-command">
              <div className="command-label">Terminal Command:</div>
              <div className="command-box">
                <code>{selectedDemo.command}</code>
                <button 
                  className="copy-button"
                  onClick={handleCopyCommand}
                >
                  {copiedCommand ? '✓ Copied!' : 'Copy'}
                </button>
              </div>
            </div>

            <div className="demo-modal-warning">
              <div className="warning-icon">ℹ️</div>
              <div>
                <strong>Note</strong>
                <p>The command will automatically stop any demo running on port 8443 before starting the new one.</p>
              </div>
            </div>

            <div className="demo-modal-steps">
              <h4>How to Launch:</h4>
              <ol>
                <li>Copy the command above</li>
                <li>Open your terminal</li>
                <li>Paste and run the command (it will navigate to the project, stop the current demo, and start the new one)</li>
                <li>Wait for server to start (you'll see "Local: https://localhost:8443/")</li>
                <li>Refresh this page</li>
              </ol>
            </div>

            <div className="demo-modal-actions">
              <button 
                className="modal-button modal-button-primary"
                onClick={handleCopyCommand}
              >
                {copiedCommand ? '✓ Copied to Clipboard' : 'Copy Command'}
              </button>
              <button 
                className="modal-button modal-button-secondary"
                onClick={handleCloseModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
