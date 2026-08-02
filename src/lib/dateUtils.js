export function getCycleMonth(dateString) {
  const date = dateString ? new Date(dateString) : new Date();
  let year = date.getFullYear();
  let month = date.getMonth(); // 0 to 11

  // If day is less than 23, it belongs to the previous month's cycle
  if (date.getDate() < 23) {
    month--;
    if (month < 0) {
      month = 11;
      year--;
    }
  }

  return `${year}-${String(month + 1).padStart(2, '0')}`;
}
