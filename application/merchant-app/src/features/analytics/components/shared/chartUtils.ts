export type TimeUnit = 'days' | 'weeks' | 'months';

export function formatDate(dateString: string, unit: TimeUnit): string {
  const date = new Date(dateString);
  
  switch (unit) {
    case 'days':
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    case 'weeks':
      return `Week ${Math.ceil(date.getDate() / 7)} ${date.toLocaleDateString('en-US', { month: 'short' })}`;
    case 'months':
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        year: '2-digit' 
      });
    default:
      return dateString;
  }
}

 