// ── Desktop Plan Data ─────────────────────────────────────────────
// Categories and action items used in the DesktopPlanPanel accordion.

export const BASE_SCORE = 65;
export const MAX_ACHIEVABLE = 80;

export const CATEGORIES = [
  {
    id: 'supplements', icon: '💊', name: 'Supplements',
    items: [
      {
        id: 'vd', icon: '☀️', name: 'Vitamin D3 + K2', gain: 7, timeline: '8 wks',
        detail: 'Your D level at 19.69 ng/mL is significantly below optimal (50–70). A daily 5,000 IU D3 with K2 supplement will begin raising levels within 3–4 weeks.',
      },
      {
        id: 'iron', icon: '🩸', name: 'Iron + Vitamin C', gain: 5, timeline: '12 wks',
        detail: 'Low ferritin is affecting energy and recovery. Take 65mg elemental iron with 500mg Vitamin C on an empty stomach — C dramatically improves absorption.',
      },
      {
        id: 'mg', icon: '🧪', name: 'Magnesium Glycinate', gain: 2, timeline: '4 wks',
        detail: 'Magnesium deficiency is widespread and often missed. 400mg glycinate before bed supports sleep quality, cortisol regulation, and thyroid conversion.',
      },
      {
        id: 'omega', icon: '🐟', name: 'Omega-3 (EPA/DHA)', gain: 2, timeline: '8 wks',
        detail: '2g combined EPA/DHA daily reduces inflammatory markers. Your CRP is currently controlled — this is maintenance and insurance.',
      },
    ],
  },
  {
    id: 'food', icon: '🥗', name: 'Food & Nutrition',
    items: [
      {
        id: 'diet', icon: '🐠', name: 'Anti-inflammatory Diet', gain: 3, timeline: '6 wks',
        detail: 'Add fatty fish 3× per week, reduce refined carbs, include turmeric + black pepper daily. Keep your HbA1c in optimal range by feeding it properly.',
      },
      {
        id: 'protein', icon: '🥩', name: 'Protein Optimisation', gain: 2, timeline: '8 wks',
        detail: 'Aim for 1.6–2g protein per kg bodyweight. Your TSH marker suggests suboptimal muscle protein synthesis — consistent intake stabilises this.',
      },
      {
        id: 'glucose', icon: '🫐', name: 'Blood Sugar Management', gain: 1, timeline: '4 wks',
        detail: 'HbA1c is excellent at 5.4%, but proactive habits protect it. Eat protein before carbs, reduce liquid sugars, walk after large meals.',
      },
    ],
  },
  {
    id: 'movement', icon: '🏃', name: 'Movement',
    items: [
      {
        id: 'cardio', icon: '🚶', name: 'Zone 2 Cardio', gain: 4, timeline: '8 wks',
        detail: '3× 40-minute walks or easy cycling per week at conversational pace. Zone 2 improves metabolic efficiency, reduces inflammation, and supports thyroid.',
      },
      {
        id: 'str', icon: '🏋️', name: 'Resistance Training', gain: 2, timeline: '12 wks',
        detail: '2× per week full-body strength training. At your body fat %, this is the most potent natural hormonal stimulus available.',
      },
    ],
  },
  {
    id: 'sleep', icon: '😴', name: 'Sleep',
    items: [
      {
        id: 'sleep', icon: '🌙', name: 'Sleep Protocol', gain: 2, timeline: '4 wks',
        detail: 'Aim for 7.5 hrs, consistent wake time, no screens 1hr before bed. Your TSH and body composition markers both indicate cortisol elevation from poor sleep.',
      },
      {
        id: 'sleepenv', icon: '❄️', name: 'Sleep Environment', gain: 1, timeline: '2 wks',
        detail: 'Room temperature 16–19°C, blackout curtains, no devices charging near bed. Highest-ROI sleep intervention with zero cost.',
      },
    ],
  },
  {
    id: 'stress', icon: '🧘', name: 'Stress Management',
    items: [
      {
        id: 'breath', icon: '🌬️', name: 'Breathwork (Daily)', gain: 1, timeline: '2 wks',
        detail: '5 minutes of box breathing or 4-7-8 breathing measurably reduces cortisol. Particularly effective done before sleep.',
      },
      {
        id: 'hrv', icon: '💗', name: 'HRV Tracking', gain: 1, timeline: 'Ongoing',
        detail: 'Track morning HRV with a wearable. HRV data gives you a daily readiness signal — telling you whether to push or rest.',
      },
    ],
  },
  {
    id: 'alcohol', icon: '🍷', name: 'Reduce Alcohol',
    items: [
      {
        id: 'alc', icon: '🍷', name: 'Alcohol Reduction', gain: 0, timeline: '4 wks',
        detail: 'Reducing below 7 units/week protects liver markers. Heavy drinking significantly impacts GGT, ALT, and inflammatory markers.',
      },
    ],
  },
];

export const ALL_ITEMS = CATEGORIES.flatMap(c => c.items).sort((a, b) => b.gain - a.gain);
