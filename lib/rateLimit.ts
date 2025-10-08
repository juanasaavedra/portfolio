const windowMs = 60 * 1000;
const maxRequests = 20;

const store = new Map<string, { count: number; expires: number }>();

export function rateLimit(identifier: string) {
  const now = Date.now();
  const record = store.get(identifier);

  if (!record || record.expires < now) {
    store.set(identifier, { count: 1, expires: now + windowMs });
    return { success: true };
  }

  if (record.count >= maxRequests) {
    return { success: false };
  }

  record.count += 1;
  store.set(identifier, record);
  return { success: true };
}
