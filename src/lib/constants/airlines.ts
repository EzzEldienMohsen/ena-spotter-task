export interface Airline {
  code: string;
  name: string;
}

export const AIRLINES: Airline[] = [
  { code: 'AA', name: 'American Airlines' },
  { code: 'DL', name: 'Delta Air Lines' },
  { code: 'UA', name: 'United Airlines' },
  { code: 'WN', name: 'Southwest Airlines' },
  { code: 'B6', name: 'JetBlue Airways' },
  { code: 'AS', name: 'Alaska Airlines' },
  { code: 'NK', name: 'Spirit Airlines' },
  { code: 'F9', name: 'Frontier Airlines' },
  { code: 'G4', name: 'Allegiant Air' },
  { code: 'BA', name: 'British Airways' },
  { code: 'AF', name: 'Air France' },
  { code: 'LH', name: 'Lufthansa' },
  { code: 'KL', name: 'KLM Royal Dutch Airlines' },
  { code: 'IB', name: 'Iberia' },
  { code: 'AZ', name: 'Alitalia' },
  { code: 'LX', name: 'Swiss International Air Lines' },
  { code: 'OS', name: 'Austrian Airlines' },
  { code: 'SN', name: 'Brussels Airlines' },
  { code: 'TP', name: 'TAP Air Portugal' },
  { code: 'EK', name: 'Emirates' },
  { code: 'QR', name: 'Qatar Airways' },
  { code: 'EY', name: 'Etihad Airways' },
  { code: 'TK', name: 'Turkish Airlines' },
  { code: 'SQ', name: 'Singapore Airlines' },
  { code: 'CX', name: 'Cathay Pacific' },
  { code: 'JL', name: 'Japan Airlines' },
  { code: 'NH', name: 'All Nippon Airways' },
  { code: 'KE', name: 'Korean Air' },
  { code: 'OZ', name: 'Asiana Airlines' },
  { code: 'CA', name: 'Air China' },
  { code: 'CZ', name: 'China Southern Airlines' },
  { code: 'MU', name: 'China Eastern Airlines' },
  { code: 'QF', name: 'Qantas' },
  { code: 'VA', name: 'Virgin Australia' },
  { code: 'AC', name: 'Air Canada' },
];

export function getAirlineName(code: string): string {
  const airline = AIRLINES.find(a => a.code === code);
  return airline ? airline.name : code;
}
