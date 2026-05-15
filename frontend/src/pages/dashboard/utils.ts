export const getMemberActivity = (endDate: string) => {
  if (!endDate) {
    return {
      label: "Active",
      className: "bg-emerald-400/14 text-emerald-200",
    };
  }

  const end = new Date(endDate);
  if (Number.isNaN(end.getTime())) {
    return {
      label: "Active",
      className: "bg-emerald-400/14 text-emerald-200",
    };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  const diffInDays = Math.ceil(
    (end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffInDays < 0) {
    return {
      label: "Inactive",
      className: "bg-rose-400/14 text-rose-200",
    };
  }

  if (diffInDays <= 3) {
    return {
      label: "Expiring Soon",
      className: "bg-amber-400/14 text-amber-200",
    };
  }

  return {
    label: "Active",
    className: "bg-emerald-400/14 text-emerald-200",
  };
};
