import './Dashboard.css';
import Softphone from './Softphone';
import Devices from './Devices';
import Header from './Header';
import BaselineInfo from './BaselineInfo';
import DemoSwitcher from './DemoSwitcher';
import DiagnosticExport from './DiagnosticExport';
import AdvancedMicSettings from './AdvancedMicSettings';


export default function Dashboard() {
  return (
    <div className='dashboard-container'>
      <Header></Header>
      <DemoSwitcher></DemoSwitcher>
      <AdvancedMicSettings></AdvancedMicSettings>
      <BaselineInfo></BaselineInfo>
      <DiagnosticExport></DiagnosticExport>
      <Devices></Devices>
      <Softphone></Softphone>
    </div>
  )
}
