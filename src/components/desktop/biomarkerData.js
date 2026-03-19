// biomarkerData.js
// 100+ biomarkers across 10 clinical categories
// status: 'optimal' | 'normal' | 'borderline_high' | 'borderline_low' | 'high' | 'low' | 'critical_high' | 'critical_low'

export const CATEGORIES = [
  'Blood Health',
  'Heart Health',
  'Hormone Health',
  'Immune Health',
  'Inflammation',
  'Kidney Health',
  'Liver Health',
  'Metabolic Health',
  'Nutrients & Vitamins',
  'Thyroid Health',
];

// section: 'positive' | 'watch' | 'negative'
export const BIOMARKERS = [
  // ── Blood Health ─────────────────────────────────────
  { id: 'b1',  category: 'Blood Health', name: 'Hemoglobin',         value: 14.8,  unit: 'g/dL',      status: 'optimal',         section: 'positive', range: [13.5, 17.5], detail: 'Carries oxygen from lungs to tissues.' },
  { id: 'b2',  category: 'Blood Health', name: 'Hematocrit',         value: 44,    unit: '%',          status: 'normal',          section: 'positive', range: [41, 53],     detail: 'Percentage of red cells in blood.' },
  { id: 'b3',  category: 'Blood Health', name: 'RBC Count',          value: 5.1,   unit: 'M/µL',       status: 'optimal',         section: 'positive', range: [4.5, 5.9],   detail: 'Total red blood cell count.' },
  { id: 'b4',  category: 'Blood Health', name: 'WBC Count',          value: 6.2,   unit: 'K/µL',       status: 'normal',          section: 'positive', range: [4.5, 11.0],  detail: 'Total white blood cell count.' },
  { id: 'b5',  category: 'Blood Health', name: 'Platelets',          value: 225,   unit: 'K/µL',       status: 'optimal',         section: 'positive', range: [150, 400],   detail: 'Cells responsible for clotting.' },
  { id: 'b6',  category: 'Blood Health', name: 'MCV',                value: 88,    unit: 'fL',         status: 'normal',          section: 'positive', range: [80, 96],     detail: 'Mean corpuscular volume — red cell size.' },
  { id: 'b7',  category: 'Blood Health', name: 'MCH',                value: 29.5,  unit: 'pg',         status: 'optimal',         section: 'positive', range: [27, 33],     detail: 'Mean corpuscular hemoglobin per cell.' },
  { id: 'b8',  category: 'Blood Health', name: 'Neutrophils',        value: 62,    unit: '%',          status: 'normal',          section: 'positive', range: [50, 70],     detail: 'Primary immune responders to infection.' },
  { id: 'b9',  category: 'Blood Health', name: 'Lymphocytes',        value: 30,    unit: '%',          status: 'optimal',         section: 'positive', range: [20, 40],     detail: 'Adaptive immune cells.' },
  { id: 'b10', category: 'Blood Health', name: 'Eosinophils',        value: 6.8,   unit: '%',          status: 'borderline_high', section: 'watch',    range: [1, 6],       detail: 'Elevated — often linked to allergy or parasites.' },
  { id: 'b11', category: 'Blood Health', name: 'Basophils',          value: 0.5,   unit: '%',          status: 'normal',          section: 'positive', range: [0, 1],       detail: 'Rare WBC involved in allergic responses.' },
  { id: 'b12', category: 'Blood Health', name: 'Ferritin',           value: 13,    unit: 'ng/mL',      status: 'low',             section: 'negative', range: [30, 300],    detail: 'Iron storage protein — critically low, risk of anemia.' },
  { id: 'b13', category: 'Blood Health', name: 'Serum Iron',         value: 55,    unit: 'µg/dL',      status: 'borderline_low',  section: 'watch',    range: [60, 170],    detail: 'Slightly below optimal. Monitor alongside ferritin.' },
  { id: 'b14', category: 'Blood Health', name: 'Iron Saturation',    value: 12,    unit: '%',          status: 'low',             section: 'negative', range: [20, 50],     detail: 'Critically low iron saturation — suggests iron deficiency.' },
  { id: 'b15', category: 'Blood Health', name: 'TIBC',               value: 390,   unit: 'µg/dL',      status: 'borderline_high', section: 'watch',    range: [250, 370],   detail: 'Total iron-binding capacity — elevated in iron deficiency.' },

  // ── Heart Health ─────────────────────────────────────
  { id: 'h1',  category: 'Heart Health', name: 'LDL Cholesterol',    value: 142,   unit: 'mg/dL',      status: 'high',            section: 'negative', range: [0, 100],     detail: 'Too high. Major cardiovascular risk factor.' },
  { id: 'h2',  category: 'Heart Health', name: 'HDL Cholesterol',    value: 62,    unit: 'mg/dL',      status: 'optimal',         section: 'positive', range: [60, 100],    detail: '"Good" cholesterol — reduces heart risk.' },
  { id: 'h3',  category: 'Heart Health', name: 'Total Cholesterol',  value: 218,   unit: 'mg/dL',      status: 'borderline_high', section: 'watch',    range: [0, 200],     detail: 'Slightly elevated. Driven primarily by LDL.' },
  { id: 'h4',  category: 'Heart Health', name: 'Triglycerides',      value: 189,   unit: 'mg/dL',      status: 'high',            section: 'negative', range: [0, 150],     detail: 'Elevated — associated with metabolic syndrome.' },
  { id: 'h5',  category: 'Heart Health', name: 'Blood Pressure Sys', value: 118,   unit: 'mmHg',       status: 'optimal',         section: 'positive', range: [90, 120],    detail: 'Systolic blood pressure — excellent.' },
  { id: 'h6',  category: 'Heart Health', name: 'Blood Pressure Dia', value: 76,    unit: 'mmHg',       status: 'optimal',         section: 'positive', range: [60, 80],     detail: 'Diastolic blood pressure — excellent.' },
  { id: 'h7',  category: 'Heart Health', name: 'Resting Heart Rate', value: 58,    unit: 'bpm',        status: 'optimal',         section: 'positive', range: [50, 70],     detail: 'Athletic range. Excellent cardiorespiratory fitness.' },
  { id: 'h8',  category: 'Heart Health', name: 'VO2 Max',            value: 41,    unit: 'mL/kg/min',  status: 'normal',          section: 'positive', range: [38, 55],     detail: 'Aerobic capacity — good for age group.' },
  { id: 'h9',  category: 'Heart Health', name: 'ApoB',               value: 98,    unit: 'mg/dL',      status: 'borderline_high', section: 'watch',    range: [0, 90],      detail: 'Atherogenic particle carrier — slightly elevated.' },
  { id: 'h10', category: 'Heart Health', name: 'Lipoprotein(a)',      value: 32,    unit: 'nmol/L',     status: 'borderline_high', section: 'watch',    range: [0, 30],      detail: 'Genetic cardiovascular risk marker.' },
  { id: 'h11', category: 'Heart Health', name: 'Homocysteine',       value: 11.2,  unit: 'µmol/L',     status: 'borderline_high', section: 'watch',    range: [5, 10],      detail: 'Cardiovascular inflammation marker. Reduce with B-vitamins.' },
  { id: 'h12', category: 'Heart Health', name: 'hsCRP (Cardiac)',    value: 3.1,   unit: 'mg/L',       status: 'high',            section: 'negative', range: [0, 1],       detail: 'High-sensitivity CRP — significant cardiovascular risk.' },

  // ── Hormone Health ───────────────────────────────────
  { id: 'hr1', category: 'Hormone Health', name: 'Testosterone (T)',  value: 520,   unit: 'ng/dL',     status: 'normal',          section: 'positive', range: [400, 900],   detail: 'Within healthy range for age.' },
  { id: 'hr2', category: 'Hormone Health', name: 'Free Testosterone', value: 12,    unit: 'pg/mL',     status: 'borderline_low',  section: 'watch',    range: [15, 40],     detail: 'Low-normal. May affect energy and body composition.' },
  { id: 'hr3', category: 'Hormone Health', name: 'DHEA-S',            value: 185,   unit: 'µg/dL',     status: 'normal',          section: 'positive', range: [150, 500],   detail: 'Adrenal hormone. Normal for age.' },
  { id: 'hr4', category: 'Hormone Health', name: 'Cortisol (AM)',     value: 21,    unit: 'µg/dL',     status: 'borderline_high', section: 'watch',    range: [6, 18],      detail: 'Elevated stress hormone — suggests chronic stress.' },
  { id: 'hr5', category: 'Hormone Health', name: 'Estradiol',         value: 28,    unit: 'pg/mL',     status: 'normal',          section: 'positive', range: [10, 40],     detail: 'Estrogen — balanced and within range.' },
  { id: 'hr6', category: 'Hormone Health', name: 'LH',                value: 5.2,   unit: 'mIU/mL',    status: 'optimal',         section: 'positive', range: [1.7, 8.6],   detail: 'Luteinizing hormone — normal.' },
  { id: 'hr7', category: 'Hormone Health', name: 'FSH',               value: 4.8,   unit: 'mIU/mL',    status: 'optimal',         section: 'positive', range: [1.5, 12.4],  detail: 'Follicle-stimulating hormone — normal.' },
  { id: 'hr8', category: 'Hormone Health', name: 'IGF-1',             value: 158,   unit: 'ng/mL',     status: 'normal',          section: 'positive', range: [115, 307],   detail: 'Growth factor — normal.' },
  { id: 'hr9', category: 'Hormone Health', name: 'Prolactin',         value: 8.3,   unit: 'ng/mL',     status: 'optimal',         section: 'positive', range: [2, 18],      detail: 'Within healthy range.' },
  { id: 'hr10',category: 'Hormone Health', name: 'Progesterone',      value: 0.4,   unit: 'ng/mL',     status: 'normal',          section: 'positive', range: [0.2, 1.4],   detail: 'Normal for luteal phase.' },
  { id: 'hr11',category: 'Hormone Health', name: 'Aldosterone',       value: 18.5,  unit: 'ng/dL',     status: 'borderline_high', section: 'watch',    range: [2, 16],      detail: 'Slightly elevated — can affect blood pressure and potassium.' },

  // ── Immune Health ────────────────────────────────────
  { id: 'im1', category: 'Immune Health', name: 'IgG',                value: 1120,  unit: 'mg/dL',     status: 'normal',          section: 'positive', range: [700, 1600],  detail: 'Main antibody in blood — good immune memory.' },
  { id: 'im2', category: 'Immune Health', name: 'IgA',                value: 280,   unit: 'mg/dL',     status: 'normal',          section: 'positive', range: [70, 400],    detail: 'Mucosal immune defense.' },
  { id: 'im3', category: 'Immune Health', name: 'IgM',                value: 95,    unit: 'mg/dL',     status: 'normal',          section: 'positive', range: [40, 230],    detail: 'First responder antibody.' },
  { id: 'im4', category: 'Immune Health', name: 'IgE',                value: 142,   unit: 'IU/mL',     status: 'high',            section: 'negative', range: [0, 100],     detail: 'Elevated — suggests allergy or parasites.' },
  { id: 'im5', category: 'Immune Health', name: 'NK Cell Activity',   value: 65,    unit: '%',          status: 'normal',          section: 'positive', range: [40, 80],     detail: 'Natural killer cells — normal activity.' },
  { id: 'im6', category: 'Immune Health', name: 'CD4 Count',          value: 880,   unit: 'cells/µL',  status: 'optimal',         section: 'positive', range: [500, 1500],  detail: 'Helper T-cells — strong immune function.' },
  { id: 'im7', category: 'Immune Health', name: 'CD8 Count',          value: 420,   unit: 'cells/µL',  status: 'normal',          section: 'positive', range: [180, 700],   detail: 'Cytotoxic T-cells — normal.' },
  { id: 'im8', category: 'Immune Health', name: 'Complement C3',      value: 1.1,   unit: 'g/L',        status: 'normal',          section: 'positive', range: [0.9, 1.8],   detail: 'Complement immune protein.' },
  { id: 'im9', category: 'Immune Health', name: 'ANA Titer',          value: 1.0,   unit: 'ratio',      status: 'normal',          section: 'positive', range: [0, 1.0],     detail: 'Antinuclear antibody — negative/normal.' },

  // ── Inflammation ─────────────────────────────────────
  { id: 'in1', category: 'Inflammation', name: 'CRP (hsCRP)',         value: 3.2,   unit: 'mg/L',       status: 'high',            section: 'negative', range: [0, 1.0],     detail: 'Significant systemic inflammation.' },
  { id: 'in2', category: 'Inflammation', name: 'IL-6',                value: 5.8,   unit: 'pg/mL',      status: 'high',            section: 'negative', range: [0, 3.0],     detail: 'Pro-inflammatory cytokine — elevated.' },
  { id: 'in3', category: 'Inflammation', name: 'TNF-alpha',           value: 14.2,  unit: 'pg/mL',      status: 'borderline_high', section: 'watch',    range: [0, 10],      detail: 'Inflammatory cytokine — watch closely.' },
  { id: 'in4', category: 'Inflammation', name: 'ESR',                 value: 22,    unit: 'mm/hr',      status: 'borderline_high', section: 'watch',    range: [0, 20],      detail: 'Erythrocyte sedimentation rate — mildly elevated.' },
  { id: 'in5', category: 'Inflammation', name: 'Fibrinogen',          value: 390,   unit: 'mg/dL',      status: 'borderline_high', section: 'watch',    range: [200, 350],   detail: 'Clotting + inflammatory protein — above range.' },
  { id: 'in6', category: 'Inflammation', name: 'Uric Acid',           value: 7.2,   unit: 'mg/dL',      status: 'high',            section: 'negative', range: [3.4, 7.0],   detail: 'Elevated — gout risk, metabolic inflammation.' },

  // ── Kidney Health ────────────────────────────────────
  { id: 'k1',  category: 'Kidney Health', name: 'Creatinine',         value: 1.0,   unit: 'mg/dL',      status: 'normal',          section: 'positive', range: [0.7, 1.3],   detail: 'Kidney waste clearance — normal.' },
  { id: 'k2',  category: 'Kidney Health', name: 'BUN',                value: 16,    unit: 'mg/dL',      status: 'normal',          section: 'positive', range: [7, 25],      detail: 'Blood urea nitrogen — normal kidney function.' },
  { id: 'k3',  category: 'Kidney Health', name: 'eGFR',               value: 88,    unit: 'mL/min',     status: 'normal',          section: 'positive', range: [60, 120],    detail: 'Estimated glomerular filtration rate — good kidney function.' },
  { id: 'k4',  category: 'Kidney Health', name: 'Urine Albumin/Cr',   value: 28,    unit: 'mg/g',       status: 'borderline_high', section: 'watch',    range: [0, 30],      detail: 'Just at upper limit — early kidney stress marker.' },
  { id: 'k5',  category: 'Kidney Health', name: 'Potassium',          value: 4.1,   unit: 'mEq/L',      status: 'optimal',         section: 'positive', range: [3.5, 5.0],   detail: 'Electrolyte balance — excellent.' },
  { id: 'k6',  category: 'Kidney Health', name: 'Sodium',             value: 139,   unit: 'mEq/L',      status: 'normal',          section: 'positive', range: [136, 145],   detail: 'Electrolyte and fluid balance — normal.' },
  { id: 'k7',  category: 'Kidney Health', name: 'Bicarbonate',        value: 25,    unit: 'mEq/L',      status: 'optimal',         section: 'positive', range: [22, 29],     detail: 'Acid-base balance — normal.' },

  // ── Liver Health ─────────────────────────────────────
  { id: 'lv1', category: 'Liver Health', name: 'ALT',                  value: 38,   unit: 'U/L',        status: 'normal',          section: 'positive', range: [7, 56],      detail: 'Liver enzyme — within range.' },
  { id: 'lv2', category: 'Liver Health', name: 'AST',                  value: 32,   unit: 'U/L',        status: 'normal',          section: 'positive', range: [10, 40],     detail: 'Liver/muscle enzyme — normal.' },
  { id: 'lv3', category: 'Liver Health', name: 'GGT',                  value: 62,   unit: 'U/L',        status: 'borderline_high', section: 'watch',    range: [9, 48],      detail: 'Elevated — liver stress or alcohol exposure.' },
  { id: 'lv4', category: 'Liver Health', name: 'ALP',                  value: 75,   unit: 'U/L',        status: 'normal',          section: 'positive', range: [44, 147],    detail: 'Alkaline phosphatase — normal.' },
  { id: 'lv5', category: 'Liver Health', name: 'Total Bilirubin',      value: 0.8,  unit: 'mg/dL',      status: 'optimal',         section: 'positive', range: [0.2, 1.2],   detail: 'Liver processing byproduct — excellent.' },
  { id: 'lv6', category: 'Liver Health', name: 'Direct Bilirubin',     value: 0.2,  unit: 'mg/dL',      status: 'optimal',         section: 'positive', range: [0, 0.3],     detail: 'Conjugated bilirubin — normal.' },
  { id: 'lv7', category: 'Liver Health', name: 'Albumin',              value: 4.4,  unit: 'g/dL',       status: 'optimal',         section: 'positive', range: [3.5, 5.0],   detail: 'Liver synthesis protein — excellent.' },
  { id: 'lv8', category: 'Liver Health', name: 'Total Protein',        value: 7.2,  unit: 'g/dL',       status: 'normal',          section: 'positive', range: [6.3, 8.2],   detail: 'Liver function marker — normal.' },

  // ── Metabolic Health ─────────────────────────────────
  { id: 'm1',  category: 'Metabolic Health', name: 'HbA1c',            value: 5.4,  unit: '%',          status: 'optimal',         section: 'positive', range: [4.0, 5.6],   detail: '3-month average blood sugar — excellent.' },
  { id: 'm2',  category: 'Metabolic Health', name: 'Fasting Glucose',  value: 92,   unit: 'mg/dL',      status: 'normal',          section: 'positive', range: [70, 100],    detail: 'Fasting blood sugar — normal.' },
  { id: 'm3',  category: 'Metabolic Health', name: 'Fasting Insulin',  value: 7.6,  unit: 'µU/mL',      status: 'optimal',         section: 'positive', range: [2, 10],      detail: 'Low insulin — excellent insulin sensitivity.' },
  { id: 'm4',  category: 'Metabolic Health', name: 'HOMA-IR',          value: 1.74, unit: 'index',      status: 'normal',          section: 'positive', range: [0.5, 2.0],   detail: 'Insulin resistance index — good.' },
  { id: 'm5',  category: 'Metabolic Health', name: 'Body Fat %',       value: 33.7, unit: '%',          status: 'high',            section: 'negative', range: [10, 25],     detail: 'Body fat well above optimal range.' },
  { id: 'm6',  category: 'Metabolic Health', name: 'BMI',              value: 27.4, unit: 'kg/m²',      status: 'borderline_high', section: 'watch',    range: [18.5, 24.9], detail: 'Overweight range — lifestyle changes recommended.' },
  { id: 'm7',  category: 'Metabolic Health', name: 'Waist Circumference',value: 96, unit: 'cm',         status: 'high',            section: 'negative', range: [0, 90],      detail: 'Central adiposity — elevated cardiometabolic risk.' },
  { id: 'm8',  category: 'Metabolic Health', name: 'Copper',           value: 118,  unit: 'µg/dL',      status: 'normal',          section: 'positive', range: [70, 140],    detail: 'Trace mineral — within normal limits.' },
  { id: 'm9',  category: 'Metabolic Health', name: 'Zinc',             value: 72,   unit: 'µg/dL',      status: 'normal',          section: 'positive', range: [60, 130],    detail: 'Immune and metabolic mineral — normal.' },
  { id: 'm10', category: 'Metabolic Health', name: 'Magnesium',        value: 1.8,  unit: 'mg/dL',      status: 'borderline_low',  section: 'watch',    range: [1.9, 2.7],   detail: 'Slightly low — affects sleep, energy, and muscle function.' },

  // ── Nutrients & Vitamins ─────────────────────────────
  { id: 'n1',  category: 'Nutrients & Vitamins', name: 'Vitamin D',     value: 19.7, unit: 'ng/mL',    status: 'low',             section: 'negative', range: [40, 80],     detail: 'Critically low. Affects bone, immune, and mood.' },
  { id: 'n2',  category: 'Nutrients & Vitamins', name: 'Vitamin B12',   value: 320,  unit: 'pg/mL',    status: 'borderline_low',  section: 'watch',    range: [400, 900],   detail: 'Below optimal. Risk of neuropathy and fatigue.' },
  { id: 'n3',  category: 'Nutrients & Vitamins', name: 'Folate',        value: 8.4,  unit: 'ng/mL',    status: 'normal',          section: 'positive', range: [5.4, 40],    detail: 'B-vitamin for DNA synthesis — normal.' },
  { id: 'n4',  category: 'Nutrients & Vitamins', name: 'Vitamin A',     value: 55,   unit: 'µg/dL',    status: 'normal',          section: 'positive', range: [38, 98],     detail: 'Retinol — within healthy range.' },
  { id: 'n5',  category: 'Nutrients & Vitamins', name: 'Vitamin E',     value: 10.2, unit: 'mg/L',     status: 'normal',          section: 'positive', range: [5.5, 17],    detail: 'Antioxidant vitamin — normal.' },
  { id: 'n6',  category: 'Nutrients & Vitamins', name: 'Vitamin K',     value: 0.4,  unit: 'ng/mL',    status: 'borderline_low',  section: 'watch',    range: [0.5, 2.5],   detail: 'Slight deficiency — important for bone and clotting.' },
  { id: 'n7',  category: 'Nutrients & Vitamins', name: 'Omega-3 Index', value: 5.2,  unit: '%',         status: 'borderline_low',  section: 'watch',    range: [8, 12],      detail: 'Well below optimal. Increase fatty fish or supplementation.' },
  { id: 'n8',  category: 'Nutrients & Vitamins', name: 'CoQ10',         value: 0.48, unit: 'µg/mL',    status: 'borderline_low',  section: 'watch',    range: [0.6, 1.5],   detail: 'Below optimal — can cause fatigue and reduced cellular energy.' },
  { id: 'n13', category: 'Nutrients & Vitamins', name: 'Omega 6/3 Ratio',value: 12.5, unit: 'ratio',    status: 'high',            section: 'negative', range: [1, 4],       detail: 'High pro-inflammatory fatty acid ratio.' },
  { id: 'n9',  category: 'Nutrients & Vitamins', name: 'Selenium',      value: 115,  unit: 'µg/L',     status: 'normal',          section: 'positive', range: [70, 150],    detail: 'Antioxidant trace mineral — good.' },
  { id: 'n10', category: 'Nutrients & Vitamins', name: 'Iodine (Urine)',value: 90,   unit: 'µg/L',     status: 'borderline_low',  section: 'watch',    range: [100, 199],   detail: 'Slightly insufficient. Impacts thyroid function.' },
  { id: 'n11', category: 'Nutrients & Vitamins', name: 'Calcium',       value: 9.5,  unit: 'mg/dL',    status: 'optimal',         section: 'positive', range: [8.5, 10.2],  detail: 'Bone and nerve mineral — excellent.' },
  { id: 'n12', category: 'Nutrients & Vitamins', name: 'Phosphorus',    value: 3.7,  unit: 'mg/dL',    status: 'normal',          section: 'positive', range: [2.5, 4.5],   detail: 'Mineral for energy metabolism — normal.' },

  // ── Thyroid Health ───────────────────────────────────
  { id: 'th1', category: 'Thyroid Health', name: 'TSH',               value: 5.1,   unit: 'µIU/mL',    status: 'borderline_high', section: 'watch',    range: [0.4, 4.0],   detail: 'Slightly elevated — early hypothyroid signal.' },
  { id: 'th2', category: 'Thyroid Health', name: 'Free T4',           value: 1.1,   unit: 'ng/dL',     status: 'normal',          section: 'positive', range: [0.8, 1.8],   detail: 'Thyroxine — within range.' },
  { id: 'th3', category: 'Thyroid Health', name: 'Free T3',           value: 2.8,   unit: 'pg/mL',     status: 'borderline_low',  section: 'watch',    range: [3.0, 4.5],   detail: 'Active thyroid hormone — slightly low.' },
  { id: 'th4', category: 'Thyroid Health', name: 'Reverse T3',        value: 22,    unit: 'ng/dL',     status: 'high',            section: 'negative', range: [9, 20],      detail: 'Elevated — can block active T3 and cause fatigue.' },
  { id: 'th5', category: 'Thyroid Health', name: 'Anti-TPO Ab',       value: 38,    unit: 'IU/mL',     status: 'borderline_high', section: 'watch',    range: [0, 34],      detail: 'Slightly elevated — early Hashimoto\'s marker.' },
  { id: 'th6', category: 'Thyroid Health', name: 'Anti-Tg Ab',        value: 18,    unit: 'IU/mL',     status: 'normal',          section: 'positive', range: [0, 40],      detail: 'Thyroglobulin antibody — normal.' },
  { id: 'th7', category: 'Thyroid Health', name: 'Thyroglobulin',     value: 12,    unit: 'ng/mL',     status: 'normal',          section: 'positive', range: [2, 35],      detail: 'Thyroid tissue marker — normal.' },
];

// Helper: filter by section
export const getBySection = (section) => BIOMARKERS.filter(b => b.section === section);

// Helper: group by category
export const groupByCategory = (markers) =>
  markers.reduce((acc, m) => {
    (acc[m.category] = acc[m.category] || []).push(m);
    return acc;
  }, {});

// Section summary
export const SECTION_META = {
  positive: {
    label: 'Working For You',
    count: getBySection('positive').length,
    color: { bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.2)', accent: 'rgb(34,197,94)', text: 'rgb(74,222,128)' },
  },
  watch: {
    label: 'Watch Closely',
    count: getBySection('watch').length,
    color: { bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.2)', accent: 'rgb(245,158,11)', text: 'rgb(251,191,36)' },
  },
  negative: {
    label: 'Needs Attention',
    count: getBySection('negative').length,
    color: { bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.2)', accent: 'rgb(239,68,68)', text: 'rgb(252,165,165)' },
  },
};
