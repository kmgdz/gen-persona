export interface InscriptionRecord {
  title: string;
  description: string;
  traits: string[];
  emoji: string;
  txHash: string;
  timestamp: number;
}

export function saveInscription(address: string, recordData: InscriptionRecord) {
  if (!address) return;
  const key = `genPersona_inscriptions_${address.toLowerCase()}`;
  const existing = getInscriptions(address);
  // Avoid duplicates if same txhash somehow
  if (!existing.find((n) => n.txHash === recordData.txHash)) {
    existing.push(recordData);
    localStorage.setItem(key, JSON.stringify(existing));
  }
}

export function getInscriptions(address: string): InscriptionRecord[] {
  if (!address) return [];
  const key = `genPersona_inscriptions_${address.toLowerCase()}`;
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}
