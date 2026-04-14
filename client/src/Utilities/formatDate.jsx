const formatDate = (date, options = { day: "numeric", month: "short", year: "numeric" }) =>
  new Date(date).toLocaleDateString("en-IN", options);

export default formatDate;
