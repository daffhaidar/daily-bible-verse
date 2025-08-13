// Date utility functions for Daily Bible Verse app

export const getCurrentDate = () => new Date();

export const getDateSeed = (date = new Date()) => {
  // Create a consistent seed based on year, month, and day
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // getMonth() returns 0-11
  const day = date.getDate();

  return year * 10000 + month * 100 + day;
};

export const getTimeOfDay = (date = new Date()) => {
  const hour = date.getHours();

  if (hour >= 5 && hour < 12) {
    return "pagi";
  } else if (hour >= 12 && hour < 17) {
    return "siang";
  } else if (hour >= 17 && hour < 21) {
    return "sore";
  } else {
    return "malam";
  }
};

export const getGreetingMessage = (timeOfDay, name = "dedek wulan ehek yeyy💗💗💗") => {
  const greetings = {
    pagi: `Selamat pagi, ${name}! ✨`,
    siang: `Selamat siang, ${name}! ☀️`,
    sore: `Selamat sore, ${name}! 🌅`,
    malam: `Selamat malam, ${name}! 🌙`,
  };

  return greetings[timeOfDay] || `ehekk, ${name}! 💝`;
};
