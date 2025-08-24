import { useState, useEffect } from "react";

const schedule = [
  { time: "6:40 AM", task: "Drink warm water with turmeric + black pepper" },
  { time: "7:00 AM", task: "Brush + Oil Pull + Rinse" },
  { time: "7:30 AM", task: "20 min sunlight on face" },
  { time: "7:50 AM", task: "Ice pack on eyes (5 min)" },
  { time: "8:00 AM", task: "Breakfast: eggs + spinach + almonds" },
  { time: "12:30 PM", task: "Lunch: rice/chapati + dal + fish/soybean + salad + carrot" },
  { time: "2:30 PM", task: "Coconut oil massage on moustache patch" },
  { time: "6:00 PM", task: "Fruit snack: guava/apple + pumpkin seeds" },
  { time: "7:00 PM", task: "15 min walk outside" },
  { time: "8:30 PM", task: "Dinner: soup + paneer/tofu or grilled chicken" },
  { time: "9:00 PM", task: "Chamomile tea" },
  { time: "9:30 PM", task: "Floss + brush (night routine)" },
  { time: "10:00 PM", task: "Wash face + castor oil on moustache patch" },
  { time: "10:30 PM", task: "Sleep" },
];

export default function App() {
  const [done, setDone] = useState({});

  useEffect(() => {
    const saved = localStorage.getItem("schedule");
    if (saved) setDone(JSON.parse(saved));

    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(console.error);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("schedule", JSON.stringify(done));
  }, [done]);

  useEffect(() => {
    const checkNotifications = () => {
      const now = new Date();
      const currentTime = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

      schedule.forEach(({ time, task }) => {
        if (time === currentTime && !done[time]) {
          if ("Notification" in window && Notification.permission === "granted") {
            new Notification("Reminder", { body: task });
          }
        }
      });
    };

    const interval = setInterval(checkNotifications, 60000);
    return () => clearInterval(interval);
  }, [done]);

  const toggleTask = (time) => {
    setDone({ ...done, [time]: !done[time] });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 p-6">
      <h1 className="text-2xl font-bold text-center mb-6">Daily Discipline Schedule</h1>
      <div className="grid gap-4 max-w-lg mx-auto">
        {schedule.map(({ time, task }) => (
          <div
            key={time}
            className={`p-4 rounded-2xl shadow-md flex items-center justify-between ${
              done[time] ? "bg-green-200" : "bg-white"
            }`}
          >
            <div>
              <p className="font-semibold">{time}</p>
              <p className="text-sm text-gray-700">{task}</p>
            </div>
            <button
              onClick={() => toggleTask(time)}
              className={`px-4 py-2 rounded-xl font-semibold ${
                done[time] ? "bg-green-600 text-white" : "bg-gray-200"
              }`}
            >
              {done[time] ? "✔ Done" : "Mark"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}