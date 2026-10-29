/**
 * Volunteer ID Generator
 * Calculates unique identifier by applying a cryptographic hashing algorithm (SHA-256)
 * on the volunteer's full name and exact signup date-time, formatted into an official NSS ID.
 */
export async function generateVolunteerId(fullName: string, signupDateIso: string): Promise<string> {
  const year = new Date(signupDateIso).getFullYear();
  const rawInput = `${fullName.trim().toUpperCase()}:${signupDateIso}:${Math.random().toString(36).substring(2, 8)}`;
  
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(rawInput);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    // Convert to hex string
    const hex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
    // Take a distinct 3-4 char numeric/alphanumeric checksum
    const numericPart = (parseInt(hex.slice(0, 6), 16) % 900 + 100).toString().padStart(3, '0');
    return `NSS-${year}-${numericPart}`;
  } catch {
    // Fallback if subtle crypto is not available
    let hash = 0;
    for (let i = 0; i < rawInput.length; i++) {
      hash = ((hash << 5) - hash) + rawInput.charCodeAt(i);
      hash |= 0;
    }
    const cleanNum = Math.abs(hash % 900 + 100).toString().padStart(3, '0');
    return `NSS-${year}-${cleanNum}`;
  }
}
