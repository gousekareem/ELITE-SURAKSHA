import { useState } from 'react';
import { AppProvider } from './services/AppContext';
import SplashScreen       from './screens/SplashScreen';
import LoginScreen        from './screens/LoginScreen';
import VerificationScreen from './screens/VerificationScreen';
import DashboardScreen    from './screens/DashboardScreen';
import MonitoringScreen   from './screens/MonitoringScreen';
import SimulateScreen     from './screens/SimulateScreen';
import HistoryScreen      from './screens/HistoryScreen';

const SCREENS = { splash:SplashScreen, login:LoginScreen, verify:VerificationScreen, dashboard:DashboardScreen, monitoring:MonitoringScreen, simulate:SimulateScreen, history:HistoryScreen };
const FLOW    = ['splash','login','verify','dashboard'];

function Router() {
  const [screen, setScreen] = useState('splash');
  const Screen = SCREENS[screen] || DashboardScreen;

  const navigate = to => { window.scrollTo({ top:0, behavior:'smooth' }); setScreen(to); };
  const onNext   = () => { const i = FLOW.indexOf(screen); navigate(i>=0 && i<FLOW.length-1 ? FLOW[i+1] : 'dashboard'); };

  return <Screen onNext={onNext} onNav={navigate} />;
}

export default function App() {
  return <AppProvider><Router /></AppProvider>;
}
