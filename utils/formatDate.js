const formatLogDate = (date) => {
  let time = new Date(date.seconds * 1000 + date.nanoseconds / 1000000);

  let today = new Date();
  console.log(`today is ${today}`);

  if (time.getFullYear() === today.getFullYear()) {
    return time.toLocaleDateString("en-us", { month: "long", day: "numeric" });
  } else {
    return time.toLocaleDateString("en-us", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
};

const daysPast = (date) => {
  const oneday = 24 * 60 * 60 * 1000;
  let postDate = new Date(date.seconds * 1000 + date.nanoseconds / 1000000);

  let today = new Date();
  const diffDays = Math.round(Math.abs((today - postDate) / oneday));
  if (diffDays > 0) {
    if (diffDays >= 7) {
      return `${Math.round(diffDays / 7)}w`;
    } else {
      return `${diffDays}d`;
    }
  } else {
    let diff = Math.abs(today - postDate);
    let minutes = Math.floor(diff / 1000 / 60);
    if (minutes > 60) {
      return `${Math.round(minutes / 60)}h`;
    } else if (minutes < 60 && minutes > 0) {
      return `${minutes}m`;
    } else {
      return `1m`;
    }
  }
};
export { formatLogDate, daysPast };
