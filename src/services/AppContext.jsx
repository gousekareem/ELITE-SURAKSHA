import { createContext, useContext, useState } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser] = useState({
    name: 'Ramesh Kumar',
    phone: '',
    platform: 'Swiggy',
    city: 'hyderabad',
    tier: 'Standard',
    premium: 38,
    coverageLimit: 600,
    coverageExpiry: 'Mon, Jan 27',
    enrolled: false,
  });

  const [payouts, setPayouts] = useState([
    { id: 1, event: 'Heavy Rain',      date: 'Today, 14:32',   amt: 600, icon: '🌧️', city: 'Hyderabad', ref: 'ES2401-8821', status: 'PAID' },
    { id: 2, event: 'AQI Hazardous',   date: 'Jan 18, 09:15',  amt: 400, icon: '😷', city: 'Hyderabad', ref: 'ES2401-7734', status: 'PAID' },
    { id: 3, event: 'Platform Outage', date: 'Jan 15, 18:50',  amt: 300, icon: '📴', city: 'Hyderabad', ref: 'ES2401-6612', status: 'PAID' },
    { id: 4, event: 'Heavy Rain',      date: 'Jan 12, 13:20',  amt: 600, icon: '🌧️', city: 'Hyderabad', ref: 'ES2401-5509', status: 'PAID' },
    { id: 5, event: 'Extreme Heat',    date: 'Jan 09, 12:45',  amt: 250, icon: '🌡️', city: 'Hyderabad', ref: 'ES2401-4402', status: 'PAID' },
    { id: 6, event: 'Curfew',          date: 'Dec 28, 08:00',  amt: 500, icon: '🚫', city: 'Hyderabad', ref: 'ES2412-9901', status: 'PAID' },
  ]);

  const addPayout = (payout) => {
    const ref = `ES${Date.now().toString().slice(-8)}`;
    const newPayout = {
      id: Date.now(),
      date: new Date().toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
      ref,
      city: 'Hyderabad',
      status: 'PAID',
      ...payout,
    };
    setPayouts(prev => [newPayout, ...prev]);
    return newPayout;
  };

  return (
    <AppContext.Provider value={{ user, setUser, payouts, addPayout }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
