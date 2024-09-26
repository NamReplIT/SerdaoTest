// Helper function to get Monday and Sunday of a specific week
export const getWeekRange = (date: Date): { monday: Date, sunday: Date } => {
    const dayOfWeek = date.getDay(); // 0 is Sunday, 1 is Monday, etc.
    const distanceToMonday = (dayOfWeek === 0 ? 6 : dayOfWeek - 1); // Adjust if it's Sunday
    const monday = new Date(date);
    monday.setDate(date.getDate() - distanceToMonday);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    // Return Monday and Sunday dates for the given week
    return {
        monday,
        sunday
    };
};

export const getMonday = (date: Date) => {
    const monday = new Date(date);
    const day = monday.getDay();
    const diff = monday.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Sunday being 0
    monday.setDate(diff);
    return monday;
};


