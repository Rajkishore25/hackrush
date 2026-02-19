// Mock AI analyzer for testing without OpenAI API key
export async function mockAnalyzeContent(content: string, inputType: string) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Simple keyword-based mock analysis
  const lowerContent = content.toLowerCase();
  
  let riskScore = 0;
  let flags: string[] = [];
  let suspiciousPhrases: any[] = [];
  
  // Check for common scam indicators
  if (lowerContent.includes('urgent') || lowerContent.includes('act now')) {
    riskScore += 20;
    flags.push('Urgency Pressure');
    suspiciousPhrases.push({
      text: 'Urgent action required',
      reason: 'Creates false sense of urgency',
      category: 'Pressure Tactics'
    });
  }
  
  if (lowerContent.includes('wire transfer') || lowerContent.includes('bitcoin') || lowerContent.includes('gift card')) {
    riskScore += 30;
    flags.push('Suspicious Payment Method');
    suspiciousPhrases.push({
      text: 'Unusual payment method requested',
      reason: 'Legitimate employers rarely request wire transfers or cryptocurrency',
      category: 'Payment Red Flag'
    });
  }
  
  if (lowerContent.includes('$') && (lowerContent.includes('000') || lowerContent.includes('k/'))) {
    const salaryMatch = content.match(/\$[\d,]+/);
    if (salaryMatch) {
      const amount = parseInt(salaryMatch[0].replace(/[$,]/g, ''));
      if (amount > 100000) {
        riskScore += 25;
        flags.push('Unrealistic Salary');
      }
    }
  }
  
  if (lowerContent.includes('@gmail.com') || lowerContent.includes('@yahoo.com') || lowerContent.includes('@hotmail.com')) {
    riskScore += 15;
    flags.push('Non-Corporate Email Domain');
    suspiciousPhrases.push({
      text: 'Using free email service',
      reason: 'Legitimate companies typically use corporate email domains',
      category: 'Email Verification'
    });
  }
  
  if (lowerContent.includes('no experience') && lowerContent.includes('high pay')) {
    riskScore += 20;
    flags.push('Too Good To Be True');
  }
  
  if (lowerContent.includes('work from home') && lowerContent.includes('easy money')) {
    riskScore += 15;
    flags.push('Work From Home Scam Indicators');
  }

  // Determine risk level
  let riskLevel: 'low' | 'moderate' | 'high' | 'critical';
  if (riskScore >= 70) riskLevel = 'critical';
  else if (riskScore >= 50) riskLevel = 'high';
  else if (riskScore >= 30) riskLevel = 'moderate';
  else riskLevel = 'low';

  // Generate summary
  let summary = '';
  if (riskLevel === 'critical') {
    summary = 'CRITICAL RISK: Multiple severe red flags detected. This appears to be a scam. Do not proceed.';
  } else if (riskLevel === 'high') {
    summary = 'HIGH RISK: Several concerning indicators found. Exercise extreme caution and verify independently.';
  } else if (riskLevel === 'moderate') {
    summary = 'MODERATE RISK: Some suspicious elements detected. Recommend additional verification before proceeding.';
  } else {
    summary = 'LOW RISK: No major red flags detected, but always verify job offers through official channels.';
  }

  return {
    risk_score: Math.min(riskScore, 100),
    risk_level: riskLevel,
    flags,
    suspicious_phrases: suspiciousPhrases,
    company_verification: {
      found: false,
      name: 'Unknown',
      trust_score: 0,
      details: 'Mock analysis - company verification not available without OpenAI API'
    },
    salary_analysis: {
      plausible: riskScore < 50,
      reason: riskScore >= 50 ? 'Compensation appears unusually high for stated requirements' : 'Compensation appears reasonable'
    },
    summary
  };
}
