const classifyIssue = (description) => {
  const text = description.toLowerCase();

  if (text.includes("pothole") || text.includes("road")) {
    return { category: "road", severity: 8 };
  }

  if (text.includes("garbage") || text.includes("waste")) {
    return { category: "garbage", severity: 6 };
  }

  if (text.includes("water") || text.includes("leak")) {
    return { category: "water", severity: 7 };
  }

  return { category: "other", severity: 3 };
};

module.exports = classifyIssue;