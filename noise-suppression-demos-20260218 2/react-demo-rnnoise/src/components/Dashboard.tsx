import './Dashboard.css';
import Softphone from './Softphone';
import Devices from './Devices';
import Header from './Header';
import VoiceIsolation from './VoiceIsolation';
import RNNoiseSettings from './RNNoiseSettings';
import DiagnosticExport from './DiagnosticExport';
import DemoSwitcher from './DemoSwitcher';
import AdvancedMicSettings from './AdvancedMicSettings';
import CallRecorder from './CallRecorder';


export default function Dashboard() {
  return (
    <div className='dashboard-container'>
      <Header></Header>
      <DemoSwitcher></DemoSwitcher>
      <AdvancedMicSettings></AdvancedMicSettings>
      <VoiceIsolation></VoiceIsolation>
      <RNNoiseSettings></RNNoiseSettings>
      <CallRecorder></CallRecorder>
      <DiagnosticExport></DiagnosticExport>
      <Devices></Devices>
      <Softphone></Softphone>
    </div>
  )
}
