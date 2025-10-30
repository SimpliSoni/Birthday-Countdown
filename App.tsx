
import React, { useState, useEffect, useRef } from 'react';
import useCountdown from './hooks/useCountdown';
import CountdownCard from './components/CountdownCard';

// Helper hook to get the previous value, useful for detecting state changes.
// FIX: Add trailing comma to generic type parameter list to disambiguate from a JSX tag in .tsx files.
const usePrevious = <T,>(value: T): T | undefined => {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
};


export const App: React.FC = () => {
    // Calculate target date (next November 10th)
    const getTargetDate = () => {
      const now = new Date();
      let targetYear = now.getFullYear();
      const targetDate = new Date(targetYear, 10, 10, 0, 0, 0); // Month is 0-indexed, so 10 is November.
  
      if (now.getTime() > targetDate.getTime()) {
        targetDate.setFullYear(targetYear + 1);
      }
      
      return targetDate;
    };
  
    const targetDate = getTargetDate();
    const { days, hours, minutes, seconds } = useCountdown(targetDate);
    const isFinished = days === 0 && hours === 0 && minutes === 0 && seconds === 0;
    const prevIsFinished = usePrevious(isFinished);
  
    const [notificationPermission, setNotificationPermission] = useState('default');
    const [showConfetti, setShowConfetti] = useState(false);
  
    useEffect(() => {
      if ('Notification' in window) {
        setNotificationPermission(Notification.permission);
      }
    }, []);
  
    useEffect(() => {
      if (prevIsFinished === false && isFinished === true) {
        setShowConfetti(true);
        
        if (notificationPermission === 'granted') {
          try {
            new Notification("It's Simran's Birthday! 🎉", {
              body: "The wait is over! Time to celebrate!",
              icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🎂</text></svg>',
              tag: 'birthday-notification',
              requireInteraction: true
            });
          } catch (error) {
            console.error('Failed to show notification:', error);
          }
        }
      }
    }, [isFinished, prevIsFinished, notificationPermission]);
  
    const handleNotificationRequest = async () => {
      if (!('Notification' in window)) {
        alert("This browser does not support desktop notifications.");
        return;
      }
      
      try {
        const permission = await Notification.requestPermission();
        setNotificationPermission(permission);
        
        if (permission === 'granted') {
          new Notification("Notifications Enabled! 🔔", {
            body: "You'll be notified when it's Simran's birthday!",
            icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🎉</text></svg>'
          });
        }
      } catch (error) {
        console.error('Failed to request notification permission:', error);
      }
    };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-rose-100 to-teal-100 p-4 overflow-hidden relative">
      <div className="absolute inset-0 animated-bg opacity-50"></div>
      
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="confetti absolute w-2 h-2 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                backgroundColor: ['#ff6b6b', '#4ecdc4', '#ffe66d', '#a8e6cf', '#ff8b94'][Math.floor(Math.random() * 5)],
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      )}

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
            <p className="mt-4 text-xl">Hope your day is filled with joy and happiness!</p>
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

      {!isFinished && (
        <div className="mt-10 z-10">
          {notificationPermission === 'granted' && (
            <button 
              disabled 
              className="bg-green-500 text-white font-bold py-3 px-6 rounded-lg cursor-not-allowed opacity-80 shadow-md"
            >
              ✓ Notifications Enabled
            </button>
          )}
          {notificationPermission === 'denied' && (
            <div className="text-center">
              <button 
                disabled 
                className="bg-red-500 text-white font-bold py-3 px-6 rounded-lg cursor-not-allowed opacity-80 shadow-md"
              >
                ✗ Notifications Blocked
              </button>
              <p className="mt-2 text-sm text-gray-600">Enable notifications in your browser settings</p>
            </div>
          )}
          {notificationPermission === 'default' && (
            <button 
              onClick={handleNotificationRequest} 
              className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75"
            >
              🔔 Notify Me on Her Birthday!
            </button>
          )}
        </div>
      )}
      
      <footer className="absolute bottom-4 text-gray-500/50 text-sm z-10">
        Made with ❤️ using React & Tailwind CSS
      </footer>
    </main>
  );
};