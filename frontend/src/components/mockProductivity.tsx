// utils/mockProductivity.ts
export interface ProductiveModel {
    updatedAt: string;
    name: string;
    productivity?: number;
  }
  
  function generateRandomDate(daysAgo: number): string {
    const now = new Date();
    const pastDate = new Date(now.getTime() - Math.random() * daysAgo * 24 * 60 * 60 * 1000);
    return pastDate.toISOString();
  }
  
  function generateMockData(count: number, daysAgo: number): ProductiveModel[] {
    const names = ["Project Alpha", "Task Beta", "Meeting Gamma", "Review Delta", "Deploy Epsilon"];
    const data: ProductiveModel[] = [];
  
    for (let i = 0; i < count; i++) {
      data.push({
        updatedAt: generateRandomDate(daysAgo),
        name: names[Math.floor(Math.random() * names.length)],
        productivity: Math.floor(Math.random() * 50) + 1,
      });
    }
  
    return data;
  }
  
  const mockProductivity = {
    lastSeven: generateMockData(60, 7),
    lastThirty: generateMockData(50, 30),
    lastSixtyFive: generateMockData(70, 365),
  };

  export default mockProductivity;