export function customerFirstName(metadata?: Record<string, unknown>) {
  const value = metadata?.full_name || metadata?.name || metadata?.given_name;
  return typeof value === 'string' && value.trim() ? value.trim().split(/\s+/)[0] : '';
}
export function customerGreeting(name: string, hour = new Date().getHours()) {
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  return `${greeting}${name ? `, ${name}` : ''}.`;
}
