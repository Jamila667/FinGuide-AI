import { describe, it, expect, vi } from 'vitest';
import bcrypt from 'bcryptjs';

describe('Authentication Utils', () => {
  it('should hash a password correctly', async () => {
    const password = 'mySecretPassword';
    const hash = await bcrypt.hash(password, 10);
    
    expect(hash).not.toBe(password);
    expect(hash.length).toBeGreaterThan(20);
  });

  it('should compare a valid password', async () => {
    const password = 'mySecretPassword';
    const hash = await bcrypt.hash(password, 10);
    
    const isValid = await bcrypt.compare(password, hash);
    expect(isValid).toBe(true);
  });

  it('should reject an invalid password', async () => {
    const password = 'mySecretPassword';
    const hash = await bcrypt.hash(password, 10);
    
    const isValid = await bcrypt.compare('wrongPassword', hash);
    expect(isValid).toBe(false);
  });
});
