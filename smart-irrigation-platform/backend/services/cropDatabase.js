/**
 * Crop Database Service
 * 
 * A comprehensive knowledge base of crop irrigation parameters based on
 * FAO (Food and Agriculture Organization) Irrigation & Drainage Paper No. 56.
 * 
 * Each crop profile contains scientifically-backed data including:
 * - Growth stage durations and crop coefficients (Kc)
 * - Optimal soil moisture ranges
 * - Root depth and drought tolerance
 * - Water requirements in mm/day
 * 
 * Reference: Allen, R.G., Pereira, L.S., Raes, D., Smith, M. (1998).
 * "Crop evapotranspiration - Guidelines for computing crop water requirements"
 * FAO Irrigation and Drainage Paper 56.
 */

const CROP_DATABASE = {
  wheat: {
    name: "Wheat",
    scientificName: "Triticum aestivum",
    category: "Cereal",
    totalGrowingDays: 150,
    stages: {
      initial:      { days: 20, kc: 0.35, description: "Germination and early seedling growth" },
      development:  { days: 35, kc: 0.75, description: "Tillering and stem elongation" },
      mid:          { days: 55, kc: 1.15, description: "Heading and flowering — peak water demand" },
      late:         { days: 40, kc: 0.45, description: "Grain filling and maturation — reduce water" },
    },
    optimalSoilMoisture: { min: 40, max: 70 },  // percentage
    rootDepth: { initial: 0.15, max: 1.2 },       // meters
    waterRequirement: { min: 3.5, max: 6.5 },     // mm/day
    droughtTolerance: "moderate",
    optimalTemperature: { min: 12, max: 25 },      // °C
    criticalStages: ["mid"],  // stages where water stress causes maximum yield loss
    soilPreference: ["loam", "clay-loam", "silt-loam"],
    irrigationMethod: "flood or sprinkler",
    notes: "Wheat is most sensitive to water stress during heading and flowering. Excess water during late stage can cause lodging."
  },

  rice: {
    name: "Rice",
    scientificName: "Oryza sativa",
    category: "Cereal",
    totalGrowingDays: 140,
    stages: {
      initial:      { days: 30, kc: 1.05, description: "Transplanting and establishment (standing water)" },
      development:  { days: 30, kc: 1.15, description: "Tillering phase" },
      mid:          { days: 50, kc: 1.20, description: "Panicle initiation and flowering" },
      late:         { days: 30, kc: 0.90, description: "Grain ripening — drain field before harvest" },
    },
    optimalSoilMoisture: { min: 80, max: 100 },
    rootDepth: { initial: 0.10, max: 0.6 },
    waterRequirement: { min: 6.0, max: 10.0 },
    droughtTolerance: "low",
    optimalTemperature: { min: 20, max: 35 },
    criticalStages: ["initial", "mid"],
    soilPreference: ["clay", "clay-loam"],
    irrigationMethod: "flood (paddy)",
    notes: "Rice typically requires standing water of 5-10 cm during most of the growing season. Alternate wetting and drying (AWD) can save 15-30% water."
  },

  corn: {
    name: "Corn (Maize)",
    scientificName: "Zea mays",
    category: "Cereal",
    totalGrowingDays: 130,
    stages: {
      initial:      { days: 20, kc: 0.40, description: "Emergence and early vegetative growth" },
      development:  { days: 35, kc: 0.80, description: "Rapid leaf and stalk growth (V6-VT)" },
      mid:          { days: 45, kc: 1.20, description: "Tasseling, silking, and grain set — critical period" },
      late:         { days: 30, kc: 0.55, description: "Dent and physiological maturity" },
    },
    optimalSoilMoisture: { min: 45, max: 75 },
    rootDepth: { initial: 0.15, max: 1.5 },
    waterRequirement: { min: 4.0, max: 7.5 },
    droughtTolerance: "moderate",
    optimalTemperature: { min: 18, max: 33 },
    criticalStages: ["mid"],
    soilPreference: ["loam", "sandy-loam", "silt-loam"],
    irrigationMethod: "drip or sprinkler",
    notes: "Corn is extremely sensitive to drought stress during tasseling and silking. Even 2-3 days of moisture stress during pollination can reduce yield by 20-30%."
  },

  barley: {
    name: "Barley",
    scientificName: "Hordeum vulgare",
    category: "Cereal",
    totalGrowingDays: 130,
    stages: {
      initial:      { days: 15, kc: 0.35, description: "Germination and seedling establishment" },
      development:  { days: 30, kc: 0.70, description: "Tillering and stem extension" },
      mid:          { days: 50, kc: 1.10, description: "Heading, flowering, and early grain fill" },
      late:         { days: 35, kc: 0.40, description: "Grain maturation and drying" },
    },
    optimalSoilMoisture: { min: 35, max: 65 },
    rootDepth: { initial: 0.15, max: 1.0 },
    waterRequirement: { min: 3.0, max: 5.5 },
    droughtTolerance: "high",
    optimalTemperature: { min: 10, max: 24 },
    criticalStages: ["mid"],
    soilPreference: ["loam", "sandy-loam"],
    irrigationMethod: "sprinkler or flood",
    notes: "Barley is more drought-tolerant than wheat but sensitive during heading. Often used as a rotation crop to improve soil health."
  },

  sugarcane: {
    name: "Sugarcane",
    scientificName: "Saccharum officinarum",
    category: "Cash Crop",
    totalGrowingDays: 365,
    stages: {
      initial:      { days: 40, kc: 0.40, description: "Germination and sprouting" },
      development:  { days: 70, kc: 0.85, description: "Tillering and early grand growth" },
      mid:          { days: 180, kc: 1.25, description: "Grand growth phase — maximum water demand" },
      late:         { days: 75, kc: 0.70, description: "Maturation and sugar accumulation — reduce water" },
    },
    optimalSoilMoisture: { min: 55, max: 85 },
    rootDepth: { initial: 0.20, max: 1.8 },
    waterRequirement: { min: 5.0, max: 9.0 },
    droughtTolerance: "low",
    optimalTemperature: { min: 20, max: 38 },
    criticalStages: ["development", "mid"],
    soilPreference: ["loam", "clay-loam"],
    irrigationMethod: "furrow or drip",
    notes: "Sugarcane needs consistent moisture during grand growth. Withholding water 3-4 weeks before harvest improves sugar content by enhancing sucrose accumulation."
  },

  cotton: {
    name: "Cotton",
    scientificName: "Gossypium hirsutum",
    category: "Cash Crop",
    totalGrowingDays: 180,
    stages: {
      initial:      { days: 30, kc: 0.35, description: "Emergence and early vegetative growth" },
      development:  { days: 50, kc: 0.70, description: "Squaring phase and canopy development" },
      mid:          { days: 60, kc: 1.15, description: "Flowering and boll development" },
      late:         { days: 40, kc: 0.50, description: "Boll opening and defoliation" },
    },
    optimalSoilMoisture: { min: 40, max: 70 },
    rootDepth: { initial: 0.15, max: 1.4 },
    waterRequirement: { min: 4.0, max: 7.0 },
    droughtTolerance: "moderate",
    optimalTemperature: { min: 20, max: 36 },
    criticalStages: ["mid"],
    soilPreference: ["loam", "clay-loam", "black-soil"],
    irrigationMethod: "drip or furrow",
    notes: "Cotton has a deep taproot and can access subsoil moisture. Critical period for irrigation is during flowering and boll formation."
  },

  soybean: {
    name: "Soybean",
    scientificName: "Glycine max",
    category: "Legume",
    totalGrowingDays: 120,
    stages: {
      initial:      { days: 20, kc: 0.35, description: "Emergence and unifoliate development" },
      development:  { days: 30, kc: 0.75, description: "Vegetative growth (V2-V6)" },
      mid:          { days: 40, kc: 1.10, description: "Flowering and pod set (R1-R5)" },
      late:         { days: 30, kc: 0.50, description: "Seed filling and maturity (R6-R8)" },
    },
    optimalSoilMoisture: { min: 45, max: 70 },
    rootDepth: { initial: 0.15, max: 1.0 },
    waterRequirement: { min: 3.5, max: 6.0 },
    droughtTolerance: "moderate",
    optimalTemperature: { min: 20, max: 30 },
    criticalStages: ["mid"],
    soilPreference: ["loam", "clay-loam", "silt-loam"],
    irrigationMethod: "sprinkler or drip",
    notes: "As a legume, soybean fixes atmospheric nitrogen. Water stress during R3-R5 (pod and seed development) causes maximum yield reduction."
  },

  potato: {
    name: "Potato",
    scientificName: "Solanum tuberosum",
    category: "Tuber",
    totalGrowingDays: 120,
    stages: {
      initial:      { days: 25, kc: 0.45, description: "Sprouting and early canopy growth" },
      development:  { days: 30, kc: 0.75, description: "Canopy expansion and stolon development" },
      mid:          { days: 35, kc: 1.10, description: "Tuber initiation and bulking — critical period" },
      late:         { days: 30, kc: 0.70, description: "Tuber maturation — reduce irrigation gradually" },
    },
    optimalSoilMoisture: { min: 60, max: 80 },
    rootDepth: { initial: 0.10, max: 0.6 },
    waterRequirement: { min: 4.0, max: 6.5 },
    droughtTolerance: "low",
    optimalTemperature: { min: 15, max: 25 },
    criticalStages: ["development", "mid"],
    soilPreference: ["sandy-loam", "loam"],
    irrigationMethod: "drip or sprinkler",
    notes: "Potato has a shallow root system and requires consistent moisture. Irregular watering causes tuber cracking, hollow heart, and secondary growth."
  },

  tomato: {
    name: "Tomato",
    scientificName: "Solanum lycopersicum",
    category: "Vegetable",
    totalGrowingDays: 140,
    stages: {
      initial:      { days: 30, kc: 0.45, description: "Transplanting and initial vegetative growth" },
      development:  { days: 35, kc: 0.75, description: "Rapid vegetative growth and first flowering" },
      mid:          { days: 45, kc: 1.15, description: "Fruit set and development — high water demand" },
      late:         { days: 30, kc: 0.80, description: "Fruit ripening — reduce water for flavor concentration" },
    },
    optimalSoilMoisture: { min: 50, max: 75 },
    rootDepth: { initial: 0.15, max: 1.0 },
    waterRequirement: { min: 3.5, max: 6.0 },
    droughtTolerance: "moderate",
    optimalTemperature: { min: 18, max: 30 },
    criticalStages: ["mid"],
    soilPreference: ["loam", "sandy-loam"],
    irrigationMethod: "drip",
    notes: "Drip irrigation is strongly recommended for tomatoes to reduce foliar diseases. Reducing water during ripening enhances Brix (sugar content) and flavor."
  },

  onion: {
    name: "Onion",
    scientificName: "Allium cepa",
    category: "Vegetable",
    totalGrowingDays: 130,
    stages: {
      initial:      { days: 20, kc: 0.50, description: "Transplanting and root establishment" },
      development:  { days: 30, kc: 0.70, description: "Leaf growth and bulb initiation" },
      mid:          { days: 50, kc: 1.00, description: "Bulb expansion — needs consistent moisture" },
      late:         { days: 30, kc: 0.65, description: "Bulb maturation — stop irrigation 10 days before harvest" },
    },
    optimalSoilMoisture: { min: 55, max: 75 },
    rootDepth: { initial: 0.10, max: 0.4 },
    waterRequirement: { min: 3.0, max: 5.5 },
    droughtTolerance: "low",
    optimalTemperature: { min: 13, max: 28 },
    criticalStages: ["mid"],
    soilPreference: ["loam", "silt-loam"],
    irrigationMethod: "drip or sprinkler",
    notes: "Onion has a very shallow root system and requires frequent, light irrigation. Over-watering near harvest causes storage rot."
  },

  groundnut: {
    name: "Groundnut (Peanut)",
    scientificName: "Arachis hypogaea",
    category: "Legume",
    totalGrowingDays: 120,
    stages: {
      initial:      { days: 20, kc: 0.35, description: "Germination and emergence" },
      development:  { days: 30, kc: 0.70, description: "Vegetative growth and flowering begins" },
      mid:          { days: 40, kc: 1.00, description: "Pegging, pod formation, and seed development" },
      late:         { days: 30, kc: 0.55, description: "Pod maturation — reduce water" },
    },
    optimalSoilMoisture: { min: 40, max: 65 },
    rootDepth: { initial: 0.15, max: 0.8 },
    waterRequirement: { min: 3.5, max: 5.5 },
    droughtTolerance: "moderate",
    optimalTemperature: { min: 22, max: 32 },
    criticalStages: ["mid"],
    soilPreference: ["sandy-loam", "loam"],
    irrigationMethod: "sprinkler or furrow",
    notes: "Groundnut needs well-drained soil. Critical period is during pegging when the gynophore penetrates the soil — calcium availability and moisture are both essential."
  },

  mustard: {
    name: "Mustard",
    scientificName: "Brassica juncea",
    category: "Oilseed",
    totalGrowingDays: 110,
    stages: {
      initial:      { days: 20, kc: 0.30, description: "Germination and rosette stage" },
      development:  { days: 25, kc: 0.65, description: "Stem elongation and branching" },
      mid:          { days: 35, kc: 1.00, description: "Flowering and siliqua formation" },
      late:         { days: 30, kc: 0.40, description: "Seed development and maturity" },
    },
    optimalSoilMoisture: { min: 35, max: 60 },
    rootDepth: { initial: 0.10, max: 0.8 },
    waterRequirement: { min: 2.5, max: 4.5 },
    droughtTolerance: "high",
    optimalTemperature: { min: 10, max: 25 },
    criticalStages: ["mid"],
    soilPreference: ["loam", "sandy-loam"],
    irrigationMethod: "flood or sprinkler",
    notes: "Mustard is relatively drought-tolerant but responds well to 2-3 irrigations at critical stages. First irrigation at flowering is most important."
  },

  chickpea: {
    name: "Chickpea (Gram)",
    scientificName: "Cicer arietinum",
    category: "Legume",
    totalGrowingDays: 110,
    stages: {
      initial:      { days: 15, kc: 0.35, description: "Germination and seedling establishment" },
      development:  { days: 25, kc: 0.65, description: "Branching and vegetative growth" },
      mid:          { days: 40, kc: 0.95, description: "Flowering and pod development" },
      late:         { days: 30, kc: 0.40, description: "Pod filling and maturity" },
    },
    optimalSoilMoisture: { min: 30, max: 55 },
    rootDepth: { initial: 0.15, max: 1.0 },
    waterRequirement: { min: 2.5, max: 4.0 },
    droughtTolerance: "high",
    optimalTemperature: { min: 10, max: 28 },
    criticalStages: ["mid"],
    soilPreference: ["loam", "sandy-loam", "clay-loam"],
    irrigationMethod: "sprinkler or flood",
    notes: "Chickpea is a rabi crop that mostly relies on residual soil moisture. Excess irrigation can promote Ascochyta blight. One light irrigation at flowering is usually sufficient."
  },

  millet: {
    name: "Pearl Millet (Bajra)",
    scientificName: "Pennisetum glaucum",
    category: "Cereal",
    totalGrowingDays: 90,
    stages: {
      initial:      { days: 15, kc: 0.30, description: "Emergence and early growth" },
      development:  { days: 20, kc: 0.65, description: "Tillering and stem elongation" },
      mid:          { days: 30, kc: 1.00, description: "Heading and grain filling" },
      late:         { days: 25, kc: 0.40, description: "Grain maturation" },
    },
    optimalSoilMoisture: { min: 25, max: 55 },
    rootDepth: { initial: 0.15, max: 1.5 },
    waterRequirement: { min: 2.0, max: 4.5 },
    droughtTolerance: "very high",
    optimalTemperature: { min: 25, max: 40 },
    criticalStages: ["mid"],
    soilPreference: ["sandy", "sandy-loam", "loam"],
    irrigationMethod: "flood or sprinkler",
    notes: "Millet is one of the most drought-resistant cereals. Its deep root system can extract water from deeper soil layers. Ideal for arid and semi-arid regions."
  },

  sorghum: {
    name: "Sorghum (Jowar)",
    scientificName: "Sorghum bicolor",
    category: "Cereal",
    totalGrowingDays: 110,
    stages: {
      initial:      { days: 15, kc: 0.30, description: "Emergence and seedling" },
      development:  { days: 25, kc: 0.65, description: "Vegetative growth and tillering" },
      mid:          { days: 40, kc: 1.05, description: "Boot, heading, and grain fill" },
      late:         { days: 30, kc: 0.45, description: "Physiological maturity" },
    },
    optimalSoilMoisture: { min: 30, max: 60 },
    rootDepth: { initial: 0.15, max: 1.5 },
    waterRequirement: { min: 3.0, max: 5.5 },
    droughtTolerance: "very high",
    optimalTemperature: { min: 22, max: 38 },
    criticalStages: ["mid"],
    soilPreference: ["loam", "clay-loam", "sandy-loam"],
    irrigationMethod: "furrow or flood",
    notes: "Sorghum can enter dormancy during drought and resume growth when water is available again. This 'stay-green' trait makes it excellent for water-scarce regions."
  },
};

// Soil type adjustment factors for water infiltration and holding capacity
const SOIL_TYPES = {
  sandy:       { name: "Sandy",       waterHolding: 0.70, infiltrationRate: "high",     adjustmentFactor: 1.20, description: "Drains quickly, needs more frequent irrigation" },
  "sandy-loam": { name: "Sandy Loam", waterHolding: 0.80, infiltrationRate: "moderate-high", adjustmentFactor: 1.10, description: "Good drainage with moderate retention" },
  loam:        { name: "Loam",        waterHolding: 1.00, infiltrationRate: "moderate",  adjustmentFactor: 1.00, description: "Ideal balance of drainage and retention (reference)" },
  "silt-loam": { name: "Silt Loam",   waterHolding: 1.05, infiltrationRate: "moderate",  adjustmentFactor: 0.95, description: "Good retention, moderate drainage" },
  "clay-loam": { name: "Clay Loam",   waterHolding: 1.10, infiltrationRate: "low-moderate", adjustmentFactor: 0.90, description: "Higher retention, slower drainage" },
  clay:        { name: "Clay",        waterHolding: 1.15, infiltrationRate: "low",       adjustmentFactor: 0.85, description: "Very high retention but risk of waterlogging" },
  "black-soil": { name: "Black Soil (Vertisol)", waterHolding: 1.20, infiltrationRate: "very low", adjustmentFactor: 0.80, description: "Shrink-swell clay, excellent for cotton" },
};

/**
 * Determines the current growth stage of a crop based on planting date.
 * @param {string} cropKey - Key from CROP_DATABASE
 * @param {Date} plantingDate - When the crop was planted
 * @returns {{ stage: string, dayInStage: number, totalDaysSincePlanting: number, kc: number, stageInfo: object }}
 */
function getCurrentGrowthStage(cropKey, plantingDate) {
  const crop = CROP_DATABASE[cropKey.toLowerCase()];
  if (!crop) return null;

  const now = new Date();
  const daysSincePlanting = Math.floor((now - new Date(plantingDate)) / (1000 * 60 * 60 * 24));
  
  let accumulatedDays = 0;
  for (const [stageName, stageData] of Object.entries(crop.stages)) {
    accumulatedDays += stageData.days;
    if (daysSincePlanting <= accumulatedDays) {
      const dayInStage = stageData.days - (accumulatedDays - daysSincePlanting);
      return {
        stage: stageName,
        dayInStage,
        totalDaysSincePlanting: daysSincePlanting,
        kc: stageData.kc,
        stageInfo: stageData,
        progressPercent: Math.round((daysSincePlanting / crop.totalGrowingDays) * 100),
      };
    }
  }

  // Past harvest time
  return {
    stage: "harvested",
    dayInStage: daysSincePlanting - crop.totalGrowingDays,
    totalDaysSincePlanting: daysSincePlanting,
    kc: 0,
    stageInfo: { description: "Crop has reached maturity and should be harvested" },
    progressPercent: 100,
  };
}

/**
 * Calculates precise water requirement for a crop given conditions.
 * Uses the formula: ETc = Kc × ET0 × soilFactor
 * Where ET0 is reference evapotranspiration (can be estimated or provided by weather service)
 * 
 * @param {string} cropKey - Crop identifier
 * @param {string} soilType - Soil type key
 * @param {number} areaHectares - Field area in hectares
 * @param {Date} plantingDate - When the crop was planted
 * @param {number} et0 - Reference evapotranspiration in mm/day (default: 5.0 for tropical/subtropical)
 * @returns {object} - Detailed water requirement calculation
 */
function calculateWaterRequirement(cropKey, soilType = "loam", areaHectares = 1, plantingDate = null, et0 = 5.0) {
  const crop = CROP_DATABASE[cropKey.toLowerCase()];
  if (!crop) return { error: `Crop '${cropKey}' not found in database` };

  const soil = SOIL_TYPES[soilType] || SOIL_TYPES["loam"];
  const growthStage = plantingDate ? getCurrentGrowthStage(cropKey, plantingDate) : null;

  // Crop coefficient: use growth stage Kc if planting date provided, else use mid-season (peak) Kc
  const kc = growthStage ? growthStage.kc : crop.stages.mid.kc;

  // Crop evapotranspiration: ETc = Kc × ET0
  const etc = kc * et0;

  // Adjusted for soil type
  const adjustedEtc = etc * soil.adjustmentFactor;

  // Convert mm/day to liters/day for the field
  // 1 mm of water over 1 hectare = 10,000 liters
  const litersPerDay = adjustedEtc * 10000 * areaHectares;
  const litersPerWeek = litersPerDay * 7;

  // Determine irrigation frequency based on soil type and crop
  const irrigationInterval = soil.waterHolding >= 1.0 ? 
    (crop.droughtTolerance === "high" || crop.droughtTolerance === "very high" ? 7 : 5) :
    (crop.droughtTolerance === "high" || crop.droughtTolerance === "very high" ? 5 : 3);

  const litersPerIrrigation = litersPerDay * irrigationInterval;

  return {
    crop: crop.name,
    soilType: soil.name,
    currentStage: growthStage ? growthStage.stage : "mid (assumed)",
    cropCoefficient: kc,
    referenceET: et0,
    cropET: Math.round(etc * 100) / 100,
    adjustedET: Math.round(adjustedEtc * 100) / 100,
    soilAdjustmentFactor: soil.adjustmentFactor,
    area: areaHectares,
    areaUnit: "hectares",
    dailyWaterNeed: {
      mm: Math.round(adjustedEtc * 100) / 100,
      liters: Math.round(litersPerDay),
    },
    weeklyWaterNeed: {
      mm: Math.round(adjustedEtc * 7 * 100) / 100,
      liters: Math.round(litersPerWeek),
    },
    irrigationSchedule: {
      intervalDays: irrigationInterval,
      litersPerIrrigation: Math.round(litersPerIrrigation),
      method: crop.irrigationMethod,
    },
    growthStage: growthStage,
    optimalMoisture: crop.optimalSoilMoisture,
    isCriticalStage: growthStage ? crop.criticalStages.includes(growthStage.stage) : false,
    recommendation: generateRecommendation(crop, growthStage, soil),
  };
}

/**
 * Generates a human-readable irrigation recommendation.
 */
function generateRecommendation(crop, growthStage, soil) {
  const lines = [];

  if (growthStage) {
    if (growthStage.stage === "harvested") {
      return "Crop has passed maturation. No irrigation needed. Prepare for harvest.";
    }

    lines.push(`${crop.name} is currently in the ${growthStage.stage} stage (Day ${growthStage.dayInStage}).`);
    lines.push(growthStage.stageInfo.description + ".");

    if (crop.criticalStages.includes(growthStage.stage)) {
      lines.push("⚠️ CRITICAL STAGE: Water stress now will cause significant yield loss. Maintain optimal soil moisture.");
    }

    if (growthStage.stage === "late") {
      lines.push("Consider reducing irrigation to promote maturation and improve quality.");
    }
  }

  lines.push(`Recommended irrigation method: ${crop.irrigationMethod}.`);
  lines.push(`Maintain soil moisture between ${crop.optimalSoilMoisture.min}% and ${crop.optimalSoilMoisture.max}%.`);
  lines.push(`Soil type (${soil.name}): ${soil.description}.`);

  if (crop.droughtTolerance === "low") {
    lines.push("This crop has LOW drought tolerance — do not delay irrigation.");
  } else if (crop.droughtTolerance === "very high") {
    lines.push("This crop has very high drought tolerance — it can withstand short dry spells.");
  }

  return lines.join(" ");
}

/**
 * Get all available crops as a summary list.
 */
function getAllCrops() {
  return Object.entries(CROP_DATABASE).map(([key, crop]) => ({
    key,
    name: crop.name,
    scientificName: crop.scientificName,
    category: crop.category,
    totalGrowingDays: crop.totalGrowingDays,
    waterRequirement: crop.waterRequirement,
    droughtTolerance: crop.droughtTolerance,
    optimalTemperature: crop.optimalTemperature,
    irrigationMethod: crop.irrigationMethod,
  }));
}

/**
 * Get detailed information about a specific crop.
 */
function getCropDetails(cropKey) {
  const key = cropKey.toLowerCase().replace(/\s+/g, "");
  // Also check for aliases
  const aliases = { maize: "corn", bajra: "millet", jowar: "sorghum", gram: "chickpea", peanut: "groundnut" };
  const resolvedKey = aliases[key] || key;
  return CROP_DATABASE[resolvedKey] || null;
}

module.exports = {
  CROP_DATABASE,
  SOIL_TYPES,
  getCurrentGrowthStage,
  calculateWaterRequirement,
  getAllCrops,
  getCropDetails,
};
