import { useState, useEffect, memo } from "react";
import { getTimeOfDay, getGreetingMessage } from "../utils/dateUtils.js";

const PersonalGreeting = memo(function PersonalGreeting({ name = "dedek wulan yey💗💗" }) {
  const [greeting, setGreeting] = useState("");
  const [timeOfDay, setTimeOfDay] = useState("");

  useEffect(() => {
    const updateGreeting = () => {
      const currentTimeOfDay = getTimeOfDay();
      const greetingMessage = getGreetingMessage(currentTimeOfDay, name);

      setTimeOfDay(currentTimeOfDay);
      setGreeting(greetingMessage);
    };

    // Update greeting immediately
    updateGreeting();

    // Update greeting every minute to catch time changes
    const interval = setInterval(updateGreeting, 60000);

    return () => clearInterval(interval);
  }, [name]);

  return (
    <div className="personal-greeting text-center mb-4">
      <h2 className="greeting-text text-warm mb-2">{greeting}</h2>
      <p className="greeting-subtitle text-light opacity-75">Semoga hari ini penuh berkah dan kedamaian aminn yeyy💗💗💗</p>
    </div>
  );
});

export default PersonalGreeting;
