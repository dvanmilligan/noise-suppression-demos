import './Dashboard.css';
import Softphone from './Softphone';
import Devices from './Devices';
import Header from './Header';
import SpeexNoiseSuppress from './SpeexNoiseSuppress';
import DemoSwitcher from './DemoSwitcher';
import CallRecorder from './CallRecorder';
import DiagnosticExport from './DiagnosticExport';
import AdvancedMicSettings from './AdvancedMicSettings';
import SpeexSettings from './SpeexSettings';


export default function Dashboard() {
  return (
    <div className='dashboard-container'>
      <Header></Header>
      <DemoSwitcher></DemoSwitcher>
      <AdvancedMicSettings></AdvancedMicSettings>
      <SpeexNoiseSuppress></SpeexNoiseSuppress>
      <SpeexSettings></SpeexSettings>
      <CallRecorder></CallRecorder>
      <DiagnosticExport></DiagnosticExport>
      <Devices></Devices>
      <Softphone></Softphone>
    </div>
  )
}
