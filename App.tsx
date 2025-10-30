import React, { useState, useEffect, useRef } from 'react';
import useCountdown from './hooks/useCountdown';
import CountdownCard from './components/CountdownCard';

// Helper hook to get the previous value, useful for detecting state changes.
const usePrevious = <T,>(value: T): T | undefined => {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
};


const App: React.FC = () => {
    // Target date: November 10th. This logic finds the next upcoming Nov 10.
    const now = new Date();
    let targetYear = now.getFullYear();
    // Month is 0-indexed, so 10 is November.
    const targetDate = new Date(targetYear, 10, 10, 0, 0, 0);

    // If Nov 10 of this year has already passed, set the target to next year.
    if (now.getTime() > targetDate.getTime()) {
      targetDate.setFullYear(targetYear + 1);
    }
    
  const { days, hours, minutes, seconds } = useCountdown(targetDate);
  const isFinished = days <= 0 && hours <= 0 && minutes <= 0 && seconds <= 0;
  const prevIsFinished = usePrevious(isFinished);

  const [notificationPermission, setNotificationPermission] = useState('default');

  // On component mount, check for existing notification permissions.
  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  // When the countdown finishes, if permission was granted, show a notification.
  useEffect(() => {
    if (prevIsFinished === false && isFinished === true && notificationPermission === 'granted') {
        new Notification("It's Simran's Birthday! 🎉", {
            body: "The wait is over! Time to celebrate!",
            // A simple birthday cake SVG icon
            icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🎂</text></svg>'
        });
    }
  }, [isFinished, prevIsFinished, notificationPermission]);

  const handleNotificationRequest = async () => {
    if (!('Notification' in window)) {
        alert("This browser does not support desktop notifications.");
        return;
    }
    // Request permission if it's not already granted or denied
    const permission = await Notification.requestPermission();
    setNotificationPermission(permission);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-rose-100 to-teal-100 p-4 overflow-hidden">
      <div className="absolute inset-0 animated-bg opacity-50"></div>
      <div className="text-center z-10">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-800 drop-shadow-md">
          Simran's Birthday Countdown
        </h1>
        <p className="mt-2 md:mt-4 text-lg md:text-2xl font-light text-gray-600">
          Get ready to celebrate on <span className="font-semibold">November 10th</span>!
        </p>
      </div>

      <div className="z-10 mt-8 md:mt-12">
        {isFinished ? (
          <div className="text-center text-white bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl p-8 shadow-2xl animate-pop-in">
            <h2 className="text-5xl font-bold">🎉 Happy Birthday, Simran! 🎉</h2>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-8">
            <CountdownCard value={days} label="Days" animationDelay="0s" />
            <CountdownCard value={hours} label="Hours" animationDelay="0.2s" />
            <CountdownCard value={minutes} label="Minutes" animationDelay="0.4s" />
            <CountdownCard value={seconds} label="Seconds" animationDelay="0.6s" />
          </div>
        )}
      </div>

      <div className="mt-10 z-10">
        {!isFinished && (
            <>
                {notificationPermission === 'granted' && (
                    <button disabled className="bg-green-500 text-white font-bold py-3 px-6 rounded-lg cursor-not-allowed opacity-80 shadow-md">
                        ✓ Notifications Enabled
                    </button>
                )}
                {notificationPermission === 'denied' && (
                    <button disabled className="bg-red-500 text-white font-bold py-3 px-6 rounded-lg cursor-not-allowed opacity-80 shadow-md">
                        ✗ Notifications Blocked
                    </button>
                )}
                {notificationPermission === 'default' && (
                    <button onClick={handleNotificationRequest} className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75">
                        Notify Me on her Birthday!
                    </button>
                )}
            </>
        )}
      </div>
      
      <footer className="absolute bottom-4 text-gray-500/50 text-sm z-10">
        Made with React & Tailwind CSS
      </footer>
    </main>
  );
};

export default App;
