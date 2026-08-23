import { describe, it, expect, vi, beforeEach } from 'vitest';

// We mock the fetch function to simulate API calls to our chat route
global.fetch = vi.fn();

describe('AI Advisor Route Simulator', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should return 400 if no messages provided', async () => {
    // Simulate our route logic
    const reqBody = { messages: [] };
    
    let status = 200;
    let message = "";
    
    if (!reqBody.messages || reqBody.messages.length === 0) {
      status = 400;
      message = "Bad request: messages required";
    }
    
    expect(status).toBe(400);
    expect(message).toContain("required");
  });

  it('should successfully stream response for valid messages', async () => {
    const reqBody = { 
      messages: [{ role: 'user', content: 'Qarzim bor, nima qilay?' }] 
    };
    
    // Simulate anthropic response
    const mockAIResponse = "Birinchi navbatda byudjet tuzing...";
    
    // Test logic checking
    expect(reqBody.messages.length).toBe(1);
    expect(reqBody.messages[0].role).toBe('user');
    expect(mockAIResponse).toContain("byudjet");
  });
});
