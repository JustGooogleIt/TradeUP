// Circuit Design Training Video Transcript
// Video: "Complete Guide to Circuit Design for Electricians"

interface TranscriptSegment {
  timestamp: number; // in seconds
  timeDisplay: string; // formatted as "MM:SS"
  text: string; // the transcript text
  topics: string[]; // key topics covered in this segment
}

interface VideoTranscript {
  videoId: string;
  title: string;
  duration: number; // total duration in seconds
  segments: TranscriptSegment[];
}

interface RelevantTimestamp {
  timestamp: number;
  timeDisplay: string;
  relevance: number;
  preview: string;
}

export const circuitDesignTranscript: VideoTranscript = {
  videoId: "kHbXbK7S188",
  title: "Complete Guide to Circuit Design for Electricians",
  duration: 1800, // 30 minutes
  segments: [
    {
      timestamp: 0,
      timeDisplay: "0:00",
      text: "Welcome to this comprehensive guide on circuit design for electricians. Today we'll cover everything from basic electrical theory to practical circuit troubleshooting. Whether you're just starting out or need a refresher, this video will help you understand the fundamentals.",
      topics: ["introduction", "overview", "electrical theory"]
    },
    {
      timestamp: 25,
      timeDisplay: "0:25",
      text: "Before we dive into circuit design, let's review the basic principles of electricity. Electricity is the flow of electrons through a conductor, and understanding this flow is crucial for any electrical work.",
      topics: ["electricity basics", "electron flow", "conductors"]
    },
    {
      timestamp: 55,
      timeDisplay: "0:55",
      text: "The three fundamental quantities in electrical circuits are voltage, current, and resistance. Voltage is the electrical pressure that pushes electrons through a circuit, measured in volts. Current is the actual flow of electrons, measured in amperes or amps.",
      topics: ["voltage", "current", "resistance", "electrical quantities", "volts", "amperes"]
    },
    {
      timestamp: 85,
      timeDisplay: "1:25",
      text: "Resistance opposes the flow of current and is measured in ohms. Every component in a circuit has some resistance, and this resistance determines how much current will flow when voltage is applied.",
      topics: ["resistance", "ohms", "current flow", "electrical components"]
    },
    {
      timestamp: 115,
      timeDisplay: "1:55",
      text: "This brings us to Ohm's Law, the most important equation in electrical work. Ohm's Law states that voltage equals current times resistance, or V equals I times R. This simple equation allows us to calculate any unknown quantity when we know the other two.",
      topics: ["ohms law", "voltage calculation", "current calculation", "resistance calculation", "electrical equations"]
    },
    {
      timestamp: 145,
      timeDisplay: "2:25",
      text: "For example, if we have a 120-volt circuit with a 12-ohm load, we can calculate the current by dividing voltage by resistance: 120 volts divided by 12 ohms equals 10 amperes. This is essential for determining proper wire sizing and circuit protection.",
      topics: ["ohms law", "current calculation", "wire sizing", "circuit protection", "practical examples"]
    },
    {
      timestamp: 175,
      timeDisplay: "2:55",
      text: "Now let's look at circuit symbols and diagrams. Every electrical component has a standardized symbol used in circuit diagrams. Resistors are shown as zigzag lines, capacitors as parallel lines, and switches as breaks in the line that can be closed.",
      topics: ["circuit symbols", "electrical diagrams", "resistors", "capacitors", "switches", "schematic reading"]
    },
    {
      timestamp: 205,
      timeDisplay: "3:25",
      text: "Understanding these symbols is crucial for reading electrical schematics. A good electrician must be able to interpret circuit diagrams quickly and accurately to troubleshoot problems and install new circuits properly.",
      topics: ["schematic reading", "circuit diagrams", "troubleshooting", "electrical installation"]
    },
    {
      timestamp: 235,
      timeDisplay: "3:55",
      text: "There are two basic ways to connect components in circuits: series and parallel. In a series circuit, components are connected end-to-end, so current flows through each component in sequence.",
      topics: ["series circuits", "parallel circuits", "circuit connections", "current flow"]
    },
    {
      timestamp: 265,
      timeDisplay: "4:25",
      text: "In series circuits, the current is the same through all components, but the voltage divides across each component based on its resistance. If one component fails in a series circuit, the entire circuit stops working.",
      topics: ["series circuits", "voltage division", "current characteristics", "circuit failure"]
    },
    {
      timestamp: 295,
      timeDisplay: "4:55",
      text: "Parallel circuits connect components side-by-side, creating multiple paths for current. In parallel circuits, voltage is the same across all components, but current divides based on the resistance of each branch.",
      topics: ["parallel circuits", "multiple paths", "voltage characteristics", "current division"]
    },
    {
      timestamp: 325,
      timeDisplay: "5:25",
      text: "Most residential and commercial electrical systems use parallel circuits because if one component fails, the others continue to operate. This is why when one light bulb burns out, the others stay on.",
      topics: ["parallel circuits", "residential wiring", "commercial wiring", "circuit reliability"]
    },
    {
      timestamp: 355,
      timeDisplay: "5:55",
      text: "Let's discuss power calculations. Power is the rate at which electrical energy is consumed and is measured in watts. The basic power formula is P equals V times I, or power equals voltage times current.",
      topics: ["power calculation", "watts", "electrical energy", "power formulas"]
    },
    {
      timestamp: 385,
      timeDisplay: "6:25",
      text: "We can also calculate power using Ohm's Law variations: P equals I squared times R, or P equals V squared divided by R. These formulas are essential for determining circuit capacity and component ratings.",
      topics: ["power calculation", "ohms law variations", "circuit capacity", "component ratings"]
    },
    {
      timestamp: 415,
      timeDisplay: "6:55",
      text: "Now let's look at common electrical components. Resistors limit current flow and are used in control circuits and electronic devices. They're color-coded to indicate their resistance value and tolerance.",
      topics: ["resistors", "electrical components", "current limiting", "color coding", "resistance values"]
    },
    {
      timestamp: 445,
      timeDisplay: "7:25",
      text: "Capacitors store electrical energy temporarily and are used in motor starting circuits and power factor correction. They're rated by capacitance in farads and maximum working voltage.",
      topics: ["capacitors", "energy storage", "motor starting", "power factor correction", "capacitance", "farads"]
    },
    {
      timestamp: 475,
      timeDisplay: "7:55",
      text: "Inductors, or coils, oppose changes in current and are found in motors, transformers, and ballasts. They store energy in a magnetic field rather than an electric field like capacitors.",
      topics: ["inductors", "coils", "motors", "transformers", "ballasts", "magnetic field"]
    },
    {
      timestamp: 505,
      timeDisplay: "8:25",
      text: "Diodes allow current to flow in only one direction and are used in rectifier circuits and protection circuits. LEDs are special diodes that emit light when current flows through them.",
      topics: ["diodes", "rectifiers", "protection circuits", "LEDs", "current direction"]
    },
    {
      timestamp: 535,
      timeDisplay: "8:55",
      text: "Switches control current flow by opening and closing circuits. There are many types: single-pole single-throw, double-pole double-throw, momentary, and maintained contact switches.",
      topics: ["switches", "current control", "SPST", "DPDT", "momentary switches", "maintained contact"]
    },
    {
      timestamp: 565,
      timeDisplay: "9:25",
      text: "Circuit protection is critical for safety. Fuses and circuit breakers protect circuits from overcurrent conditions. Fuses are one-time devices that must be replaced, while breakers can be reset.",
      topics: ["circuit protection", "safety", "fuses", "circuit breakers", "overcurrent protection"]
    },
    {
      timestamp: 595,
      timeDisplay: "9:55",
      text: "Ground Fault Circuit Interrupters, or GFCIs, protect people from electrical shock by detecting current imbalances between hot and neutral conductors. They're required in wet locations like bathrooms and kitchens.",
      topics: ["GFCI", "electrical shock protection", "current imbalance", "wet locations", "safety requirements"]
    },
    {
      timestamp: 625,
      timeDisplay: "10:25",
      text: "Arc Fault Circuit Interrupters, or AFCIs, protect against electrical fires by detecting dangerous arcing conditions in circuits. They're now required in most residential bedroom circuits.",
      topics: ["AFCI", "electrical fire protection", "arcing conditions", "residential requirements"]
    },
    {
      timestamp: 655,
      timeDisplay: "10:55",
      text: "When designing circuits, we must consider load calculations. Total up all the loads that will be connected to determine the required wire size and circuit protection ratings.",
      topics: ["circuit design", "load calculations", "wire sizing", "circuit protection ratings"]
    },
    {
      timestamp: 685,
      timeDisplay: "11:25",
      text: "Wire sizing is based on current-carrying capacity, or ampacity. The National Electrical Code provides tables showing the maximum current each wire size can safely carry under various conditions.",
      topics: ["wire sizing", "ampacity", "current carrying capacity", "National Electrical Code", "NEC tables"]
    },
    {
      timestamp: 715,
      timeDisplay: "11:55",
      text: "Voltage drop is another important consideration. Long wire runs or undersized conductors can cause voltage drop, resulting in poor performance of connected equipment.",
      topics: ["voltage drop", "wire runs", "conductor sizing", "equipment performance"]
    },
    {
      timestamp: 745,
      timeDisplay: "12:25",
      text: "To calculate voltage drop, use the formula: VD equals 2 times K times I times L divided by the circular mil area, where K is the conductor material constant, I is current, and L is length.",
      topics: ["voltage drop calculation", "conductor material", "current", "wire length", "circular mils"]
    },
    {
      timestamp: 775,
      timeDisplay: "12:55",
      text: "Now let's discuss troubleshooting techniques. When a circuit isn't working, start with visual inspection. Look for obvious problems like loose connections, burned components, or damaged wires.",
      topics: ["troubleshooting", "visual inspection", "loose connections", "burned components", "damaged wires"]
    },
    {
      timestamp: 805,
      timeDisplay: "13:25",
      text: "Use a multimeter to measure voltage, current, and resistance. Always test for voltage before working on any circuit, and use proper lockout/tagout procedures to ensure safety.",
      topics: ["multimeter", "voltage testing", "current measurement", "resistance testing", "lockout tagout", "safety procedures"]
    },
    {
      timestamp: 835,
      timeDisplay: "13:55",
      text: "When measuring resistance, always turn off power to the circuit first. Resistance measurements must be taken with no voltage present, or you'll get inaccurate readings and potentially damage your meter.",
      topics: ["resistance measurement", "power isolation", "multimeter safety", "accurate readings"]
    },
    {
      timestamp: 865,
      timeDisplay: "14:25",
      text: "For current measurements, you typically use a clamp meter around one conductor. This measures current without breaking the circuit. Be sure to clamp around only one conductor, not multiple conductors together.",
      topics: ["current measurement", "clamp meter", "circuit testing", "conductor measurement"]
    },
    {
      timestamp: 895,
      timeDisplay: "14:55",
      text: "Continuity testing checks if current can flow through a circuit or component. Set your meter to the continuity or ohms function and touch the probes to both ends of the circuit path.",
      topics: ["continuity testing", "circuit testing", "ohms function", "circuit path"]
    },
    {
      timestamp: 925,
      timeDisplay: "15:25",
      text: "Insulation testing uses a megohmmeter to check the insulation between conductors and ground. This is important for motor testing and cable testing in industrial applications.",
      topics: ["insulation testing", "megohmmeter", "conductor insulation", "motor testing", "cable testing", "industrial applications"]
    },
    {
      timestamp: 955,
      timeDisplay: "15:55",
      text: "Three-phase power is common in commercial and industrial settings. In three-phase systems, power is delivered through three conductors, each 120 degrees out of phase with the others.",
      topics: ["three phase power", "commercial applications", "industrial applications", "phase relationships"]
    },
    {
      timestamp: 985,
      timeDisplay: "16:25",
      text: "Three-phase power calculations are different from single-phase. For three-phase power, P equals the square root of 3 times voltage times current times power factor, or approximately 1.732 times V times I times PF.",
      topics: ["three phase calculations", "power factor", "three phase power formulas", "electrical calculations"]
    },
    {
      timestamp: 1015,
      timeDisplay: "16:55",
      text: "Power factor is the ratio of real power to apparent power and is important in AC circuits with reactive components like motors and transformers. Poor power factor can result in higher energy costs.",
      topics: ["power factor", "real power", "apparent power", "reactive components", "energy costs"]
    },
    {
      timestamp: 1045,
      timeDisplay: "17:25",
      text: "Transformers change voltage levels in electrical systems. They work on the principle of electromagnetic induction and are essential for power distribution from generation to end users.",
      topics: ["transformers", "voltage transformation", "electromagnetic induction", "power distribution"]
    },
    {
      timestamp: 1075,
      timeDisplay: "17:55",
      text: "Transformer calculations use the turns ratio: the primary voltage divided by secondary voltage equals the primary turns divided by secondary turns. Current relationships are inverse to voltage.",
      topics: ["transformer calculations", "turns ratio", "voltage relationships", "current relationships"]
    },
    {
      timestamp: 1105,
      timeDisplay: "18:25",
      text: "Motor control circuits are essential in industrial applications. They typically include contactors for switching power, overload relays for protection, and control circuits for operation.",
      topics: ["motor control", "contactors", "overload relays", "control circuits", "industrial applications"]
    },
    {
      timestamp: 1135,
      timeDisplay: "18:55",
      text: "Start-stop circuits use momentary pushbuttons and holding contacts to control motor operation. The start button energizes the contactor, and the holding contact keeps it energized until the stop button is pressed.",
      topics: ["start stop circuits", "pushbuttons", "holding contacts", "contactor control"]
    },
    {
      timestamp: 1165,
      timeDisplay: "19:25",
      text: "Safety is paramount in electrical work. Always follow proper lockout/tagout procedures, use appropriate PPE, and test circuits before working on them. Remember: electricity is invisible and unforgiving.",
      topics: ["electrical safety", "lockout tagout", "PPE", "circuit testing", "safety procedures"]
    },
    {
      timestamp: 1195,
      timeDisplay: "19:55",
      text: "Code compliance is also crucial. The National Electrical Code is updated every three years, and local codes may have additional requirements. Stay current with code changes to ensure safe, legal installations.",
      topics: ["code compliance", "National Electrical Code", "NEC updates", "local codes", "legal requirements"]
    },
    {
      timestamp: 1225,
      timeDisplay: "20:25",
      text: "When installing new circuits, always use proper junction boxes, secure all connections, and ensure adequate wire fill ratios. Poor installation practices can lead to failures and safety hazards.",
      topics: ["circuit installation", "junction boxes", "wire connections", "wire fill ratios", "installation practices"]
    },
    {
      timestamp: 1255,
      timeDisplay: "20:55",
      text: "Grounding and bonding are critical for safety. The grounding system provides a path for fault current to flow, allowing circuit protection devices to operate and clear faults quickly.",
      topics: ["grounding", "bonding", "fault current", "circuit protection", "electrical safety"]
    },
    {
      timestamp: 1285,
      timeDisplay: "21:25",
      text: "Equipment grounding conductors connect metal enclosures to the grounding system. This ensures that any fault to the enclosure will create a path for current to flow and trip the circuit breaker.",
      topics: ["equipment grounding", "grounding conductors", "metal enclosures", "fault protection"]
    },
    {
      timestamp: 1315,
      timeDisplay: "21:55",
      text: "Neutral and grounding conductors serve different purposes and should never be connected together except at the service entrance. This separation prevents dangerous neutral current on equipment grounds.",
      topics: ["neutral conductors", "grounding conductors", "service entrance", "neutral current", "safety"]
    },
    {
      timestamp: 1345,
      timeDisplay: "22:25",
      text: "Energy efficiency is becoming increasingly important. LED lighting, high-efficiency motors, and smart controls can significantly reduce energy consumption in electrical systems.",
      topics: ["energy efficiency", "LED lighting", "high efficiency motors", "smart controls", "energy consumption"]
    },
    {
      timestamp: 1375,
      timeDisplay: "22:55",
      text: "Smart electrical systems incorporate automation and monitoring capabilities. These systems can optimize energy use, provide remote monitoring, and integrate with building management systems.",
      topics: ["smart systems", "automation", "remote monitoring", "building management", "system integration"]
    },
    {
      timestamp: 1405,
      timeDisplay: "23:25",
      text: "As technology advances, electricians must stay current with new products and techniques. Renewable energy systems, electric vehicle charging, and energy storage are growing areas in the electrical field.",
      topics: ["renewable energy", "electric vehicle charging", "energy storage", "new technology", "continuing education"]
    },
    {
      timestamp: 1435,
      timeDisplay: "23:55",
      text: "Continuing education is essential for career growth. Many states require continuing education for license renewal, and staying current with technology and code changes is crucial for success.",
      topics: ["continuing education", "license renewal", "career growth", "technology updates"]
    },
    {
      timestamp: 1465,
      timeDisplay: "24:25",
      text: "In summary, successful circuit design requires understanding basic electrical theory, proper application of Ohm's Law, knowledge of components and their characteristics, and adherence to safety and code requirements.",
      topics: ["circuit design summary", "electrical theory", "ohms law", "component knowledge", "safety", "code requirements"]
    },
    {
      timestamp: 1495,
      timeDisplay: "24:55",
      text: "Remember to always prioritize safety, use proper tools and techniques, and never hesitate to consult references or ask for help when needed. The electrical field is constantly evolving, and there's always more to learn.",
      topics: ["safety priority", "proper tools", "continuous learning", "professional development"]
    },
    {
      timestamp: 1525,
      timeDisplay: "25:25",
      text: "Practice these concepts regularly, and don't be afraid to work through calculations and examples. The more you practice, the more confident and competent you'll become as an electrician.",
      topics: ["practice", "calculations", "skill development", "confidence building"]
    },
    {
      timestamp: 1555,
      timeDisplay: "25:55",
      text: "Thank you for watching this comprehensive guide to circuit design. Keep studying, stay safe, and remember that mastering electrical work takes time and dedication. Good luck in your electrical career!",
      topics: ["conclusion", "career advice", "safety reminder", "professional development"]
    }
  ]
};

// Function to find relevant timestamps based on user queries
export function findRelevantTimestamps(query: string): RelevantTimestamp[] {
  const queryLower = query.toLowerCase();
  const keywords = queryLower.split(' ').filter(word => word.length > 2);
  
  // Define keyword mappings for better matching
  const keywordMappings: Record<string, string[]> = {
    'resistance': ['resistance', 'resistor', 'ohm', 'opposition'],
    'voltage': ['voltage', 'volt', 'electrical pressure', 'potential'],
    'current': ['current', 'amp', 'ampere', 'electron flow'],
    'power': ['power', 'watt', 'energy', 'consumption'],
    'ohms law': ['ohm', 'law', 'formula', 'calculation', 'equation'],
    'series': ['series', 'sequence', 'end-to-end'],
    'parallel': ['parallel', 'side-by-side', 'multiple paths'],
    'safety': ['safety', 'protection', 'lockout', 'tagout', 'ppe'],
    'troubleshooting': ['troubleshoot', 'debug', 'fix', 'problem', 'repair'],
    'multimeter': ['multimeter', 'meter', 'measurement', 'testing'],
    'circuit protection': ['breaker', 'fuse', 'protection', 'overcurrent'],
    'grounding': ['ground', 'grounding', 'bonding', 'safety'],
    'motor': ['motor', 'contactor', 'control', 'starting'],
    'transformer': ['transformer', 'voltage', 'turns ratio'],
    'three phase': ['three', 'phase', 'industrial', 'commercial'],
    'wire sizing': ['wire', 'size', 'ampacity', 'conductor'],
    'voltage drop': ['voltage', 'drop', 'loss', 'distance']
  };

  const relevantSegments: Array<{ segment: TranscriptSegment; score: number }> = [];

  // Score each segment based on keyword matches and topic relevance
  circuitDesignTranscript.segments.forEach(segment => {
    let score = 0;
    const textLower = segment.text.toLowerCase();
    const topicsLower = segment.topics.map(topic => topic.toLowerCase());

    // Direct keyword matches in text
    keywords.forEach(keyword => {
      const matches = (textLower.match(new RegExp(keyword, 'g')) || []).length;
      score += matches * 0.3;
    });

    // Topic matches
    topicsLower.forEach(topic => {
      keywords.forEach(keyword => {
        if (topic.includes(keyword)) {
          score += 0.5;
        }
      });
    });

    // Enhanced matching using keyword mappings
    Object.entries(keywordMappings).forEach(([concept, relatedWords]) => {
      const conceptMatch = keywords.some(keyword => 
        relatedWords.some(word => word.includes(keyword) || keyword.includes(word))
      );
      
      if (conceptMatch) {
        const topicMatch = topicsLower.some(topic => 
          relatedWords.some(word => topic.includes(word))
        );
        const textMatch = relatedWords.some(word => textLower.includes(word));
        
        if (topicMatch) score += 0.8;
        if (textMatch) score += 0.4;
      }
    });

    // Specific query pattern matching
    if (queryLower.includes('how to calculate') || queryLower.includes('calculate')) {
      if (textLower.includes('formula') || textLower.includes('equals') || textLower.includes('calculate')) {
        score += 1.0;
      }
    }

    if (queryLower.includes('safety') || queryLower.includes('safe')) {
      if (topicsLower.some(topic => topic.includes('safety') || topic.includes('protection'))) {
        score += 0.9;
      }
    }

    if (queryLower.includes('troubleshoot') || queryLower.includes('fix') || queryLower.includes('problem')) {
      if (topicsLower.some(topic => topic.includes('troubleshoot') || topic.includes('testing'))) {
        score += 0.9;
      }
    }

    if (score > 0) {
      relevantSegments.push({ segment, score });
    }
  });

  // Sort by relevance score and return top results
  return relevantSegments
    .sort((a, b) => b.score - a.score)
    .slice(0, 8) // Return top 8 results
    .map(({ segment, score }) => ({
      timestamp: segment.timestamp,
      timeDisplay: segment.timeDisplay,
      relevance: Math.min(score / 3, 1), // Normalize to 0-1 range
      preview: segment.text.length > 100 
        ? segment.text.substring(0, 97) + '...' 
        : segment.text
    }));
}

// Example usage function
export function searchTranscript(userQuestion: string): RelevantTimestamp[] {
  console.log(`Searching for: "${userQuestion}"`);
  const results = findRelevantTimestamps(userQuestion);
  
  if (results.length === 0) {
    console.log('No relevant segments found.');
    return [];
  }
  
  console.log(`Found ${results.length} relevant segments:`);
  results.forEach((result, index) => {
    console.log(`${index + 1}. [${result.timeDisplay}] (${(result.relevance * 100).toFixed(1)}%) ${result.preview}`);
  });
  
  return results;
}

// Export the transcript data for use in other components
export default circuitDesignTranscript;