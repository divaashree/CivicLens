// Calculate days remaining or days taken for SLA
export const calculateSLA = (createdAt, resolvedAt, status) => {
  const created = new Date(createdAt);
  const now = new Date();
  const resolved = resolvedAt ? new Date(resolvedAt) : null;

  // Default SLA: 7 days
  const SLA_DAYS = 7;
  const SLA_MS = SLA_DAYS * 24 * 60 * 60 * 1000;

  if (status === "resolved" && resolved) {
    // Calculate time taken
    const timeTaken = resolved - created;
    const daysTaken = Math.floor(timeTaken / (24 * 60 * 60 * 1000));
    const onTime = timeTaken <= SLA_MS;
    return {
      text: `Resolved in ${daysTaken} day${daysTaken !== 1 ? "s" : ""}`,
      isMet: onTime,
      type: "resolved",
    };
  } else {
    // Calculate time remaining
    const slaDeadline = new Date(created.getTime() + SLA_MS);
    const timeRemaining = slaDeadline - now;
    const daysRemaining = Math.ceil(timeRemaining / (24 * 60 * 60 * 1000));

    let statusText = "";
    let isMet = true;

    if (daysRemaining <= 0) {
      statusText = "⚠️ SLA Overdue";
      isMet = false;
    } else if (daysRemaining === 1) {
      statusText = "⏰ SLA: 1 day remaining";
      isMet = true;
    } else {
      statusText = `SLA: ${daysRemaining} days remaining`;
      isMet = true;
    }

    return {
      text: statusText,
      isMet,
      type: "pending",
    };
  }
};
