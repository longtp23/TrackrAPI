export const formatReleaseDate = (releaseDate) => {
  const dateObject = new Date(releaseDate);
  const format = { year: "numeric", month: "short", day: "numeric" };
  const formattedReleaseDate = dateObject
    .toLocaleString("en-US", format)
    .toUpperCase();
  return formattedReleaseDate;
};


export const formatReleaseYear = (releaseDate) => {
  const dateObject = new Date(releaseDate);
  const releaseYear = dateObject.getFullYear();
  return releaseYear;
};



export const formatPrice = (price) => {
  const convertedPrice = price.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
  return convertedPrice;
};

export const formatTimePosted = (targetDate) => {
  // Get the current date and time
  const currentDate = new Date();

  // Convert the target date string to a Date object
  const targetDateTime = new Date(targetDate);

  // Calculate the time difference in milliseconds
  const timeDifference = currentDate.getTime() - targetDateTime.getTime();

  // Convert the time difference to seconds
  const secondsDifference = Math.floor(timeDifference / 1000);

  // Define the time thresholds in seconds
  const minuteThreshold = 60;
  const hourThreshold = 60 * 60;
  const dayThreshold = 24 * 60 * 60;
  const monthThreshold = 30 * dayThreshold;
  const yearThreshold = 12 * monthThreshold;

  // Calculate the time posted based on the thresholds
  if (secondsDifference < minuteThreshold) {
    return "Just now";
  } else if (secondsDifference < hourThreshold) {
    const minutes = Math.floor(secondsDifference / 60);
    return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  } else if (secondsDifference < dayThreshold) {
    const hours = Math.floor(secondsDifference / 3600);
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  } else if (secondsDifference < monthThreshold) {
    const days = Math.floor(secondsDifference / (24 * 3600));
    return `${days} day${days === 1 ? "" : "s"} ago`;
  } else if (secondsDifference < yearThreshold) {
    const months = Math.floor(secondsDifference / monthThreshold);
    return `${months} month${months === 1 ? "" : "s"} ago`;
  } else {
    const years = Math.floor(secondsDifference / yearThreshold);
    return `${years} year${years === 1 ? "" : "s"} ago`;
  }
};
