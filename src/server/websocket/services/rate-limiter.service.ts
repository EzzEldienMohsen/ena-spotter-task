// Rate limiter to stay within Amadeus API limits
// Conservative limit: 8 requests per second

export class RateLimiterService {
  private static instance: RateLimiterService;
  private requestCount: number = 0;
  private readonly maxRequestsPerSecond: number = 8;
  private resetInterval: NodeJS.Timeout | null = null;

  private constructor() {
    this.startResetInterval();
  }

  public static getInstance(): RateLimiterService {
    if (!RateLimiterService.instance) {
      RateLimiterService.instance = new RateLimiterService();
    }
    return RateLimiterService.instance;
  }

  private startResetInterval(): void {
    this.resetInterval = setInterval(() => {
      this.requestCount = 0;
    }, 1000); // Reset every second
  }

  public async waitForSlot(): Promise<void> {
    while (this.requestCount >= this.maxRequestsPerSecond) {
      // Wait 100ms and check again
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    this.requestCount++;
  }

  public getAvailableSlots(): number {
    return Math.max(0, this.maxRequestsPerSecond - this.requestCount);
  }

  public cleanup(): void {
    if (this.resetInterval) {
      clearInterval(this.resetInterval);
      this.resetInterval = null;
    }
  }
}
