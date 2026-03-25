// ============================================================
// HSEQ PORTAL — COMPLETE MOCK DATA
// 12Monday Technologies | PRL Demo
// ============================================================

export const MOCK_USERS = [
  { id: 1, name: "Ahmed Kamal", email: "admin@prl.com.pk", password: "Admin@123", role: "super_admin", department: "HSEQ", avatar: "AK", phone: "+92-300-1234567" },
  { id: 2, name: "Sana Mirza", email: "hseq.officer@prl.com.pk", password: "Hseq@123", role: "hseq_officer", department: "HSEQ", avatar: "SM", phone: "+92-300-2345678" },
  { id: 3, name: "Tariq Hussain", email: "focal.ops@prl.com.pk", password: "Focal@123", role: "focal_person", department: "Operations", avatar: "TH", phone: "+92-300-3456789" },
  { id: 4, name: "Maryam Shah", email: "employee@prl.com.pk", password: "Emp@123", role: "employee", department: "Maintenance", avatar: "MS", phone: "+92-300-4567890" },
  { id: 5, name: "Bilal Raza", email: "focal.maint@prl.com.pk", password: "Focal@123", role: "focal_person", department: "Maintenance", avatar: "BR", phone: "+92-300-5678901" },
  { id: 6, name: "Nadia Iqbal", email: "focal.proc@prl.com.pk", password: "Focal@123", role: "focal_person", department: "Process", avatar: "NI", phone: "+92-300-6789012" },
  { id: 7, name: "Kamran Ali", email: "focal.elec@prl.com.pk", password: "Focal@123", role: "focal_person", department: "Electrical", avatar: "KA", phone: "+92-300-7890123" },
];

export const DEPARTMENTS = [
  "Operations", "Maintenance", "Process", "Electrical", "Instrumentation",
  "Fire & Safety", "HSEQ", "Utilities", "Technical Services", "Logistics"
];

export const LOCATIONS = [
  "CDU-1 Area", "CDU-2 Area", "VDU Area", "Crude Tank Farm", "Product Tank Farm",
  "Utilities Area", "Cooling Tower", "Effluent Treatment Plant", "Control Room",
  "Warehouse / Store", "Jetty Area", "Fire Station", "Admin Block", "Workshop"
];

export const OBSERVATION_CATEGORIES = [
  "Unsafe Act", "Unsafe Condition", "Near Miss", "Good Practice", "Environmental",
  "Housekeeping", "PPE Compliance", "Fire Safety", "Electrical Safety", "Process Safety"
];

export const ACTION_ACTIVITY_TYPES = [
  "Potential to Incident", "Management Walkthrough", "Internal Audit",
  "External Audit", "Incident Investigation", "Mock Drill", "Inspection", "Other Activity"
];

export const MOCK_OBSERVATIONS = [
  {
    id: "OBS-2025-001", date: "2025-05-12", location: "CDU-1 Area", department: "Operations",
    category: "Unsafe Act", status: "Closed",
    description: "Operator observed working at height on the CDU-1 fractionation column without wearing a full body harness. The scaffold was at approximately 4 meters height. Immediate verbal warning given.",
    correctiveAction: "1. Immediate stop work issued. 2. Operator provided harness from site safety store. 3. Toolbox talk conducted with entire shift crew on fall protection requirements.",
    evidence: ["obs_001_photo1.jpg"],
    assignedTo: 3, assignedToName: "Tariq Hussain", cc: [2],
    createdBy: 2, createdByName: "Sana Mirza",
    dueDate: "2025-05-19", closedDate: "2025-05-17",
    reminderSent: false, priority: "High"
  },
  {
    id: "OBS-2025-002", date: "2025-05-15", location: "Crude Tank Farm", department: "Operations",
    category: "Unsafe Condition", status: "Closed",
    description: "Spill containment bund wall at Tank T-103 found with a crack approximately 30cm long at the base. Risk of hydrocarbon spread in case of tank overflow or leak.",
    correctiveAction: "Bund wall repaired with cement grout. Repair inspected and signed off by Civil team on 18-May-2025.",
    evidence: ["obs_002_photo1.jpg", "obs_002_photo2.jpg"],
    assignedTo: 5, assignedToName: "Bilal Raza", cc: [2, 1],
    createdBy: 2, createdByName: "Sana Mirza",
    dueDate: "2025-05-22", closedDate: "2025-05-18",
    reminderSent: false, priority: "High"
  },
  {
    id: "OBS-2025-003", date: "2025-05-18", location: "Electrical Substation B", department: "Electrical",
    category: "Electrical Safety", status: "Open",
    description: "Arc flash boundary marking found faded and partially missing at Substation B MCC panels. Workers may not be aware of arc flash exclusion zones. Signage replacement required urgently.",
    correctiveAction: "Pending: New arc flash boundary tape and signage ordered. Installation scheduled.",
    evidence: ["obs_003_photo1.jpg"],
    assignedTo: 7, assignedToName: "Kamran Ali", cc: [2],
    createdBy: 2, createdByName: "Sana Mirza",
    dueDate: "2025-05-28", closedDate: null,
    reminderSent: true, priority: "High"
  },
  {
    id: "OBS-2025-004", date: "2025-05-20", location: "VDU Area", department: "Process",
    category: "Near Miss", status: "In Progress",
    description: "Process operator slipped on wet floor near VDU charge pump. No injury sustained. Floor was wet due to a small process water leak from a flanged joint. Operator caught themselves on handrail.",
    correctiveAction: "Flange joint repaired same day. Non-slip grip tape applied to floor area. Investigation to determine root cause of flange leak ongoing.",
    evidence: ["obs_004_photo1.jpg"],
    assignedTo: 6, assignedToName: "Nadia Iqbal", cc: [1, 2],
    createdBy: 2, createdByName: "Sana Mirza",
    dueDate: "2025-06-03", closedDate: null,
    reminderSent: false, priority: "Critical"
  },
  {
    id: "OBS-2025-005", date: "2025-05-21", location: "Workshop", department: "Maintenance",
    category: "Good Practice", status: "Closed",
    description: "Maintenance team in the workshop observed maintaining excellent 5S housekeeping standards. All tools properly tagged and stored, walkways clear, waste properly segregated. Commendable effort.",
    correctiveAction: "Positive observation — no corrective action required. Team commended in departmental meeting.",
    evidence: [],
    assignedTo: 5, assignedToName: "Bilal Raza", cc: [],
    createdBy: 2, createdByName: "Sana Mirza",
    dueDate: "2025-05-28", closedDate: "2025-05-22",
    reminderSent: false, priority: "Low"
  },
  {
    id: "OBS-2025-006", date: "2025-05-22", location: "Effluent Treatment Plant", department: "HSEQ",
    category: "Environmental", status: "Open",
    description: "Oily water sheen observed at the ETP outlet channel discharge point. Sheen suggests elevated oil content in treated effluent above permissible limits. Sample collected and sent to lab.",
    correctiveAction: "Pending lab results. ETP operator has increased oil skimmer frequency. Outfall discharge temporarily diverted to holding pond.",
    evidence: ["obs_006_photo1.jpg", "obs_006_sample.pdf"],
    assignedTo: 6, assignedToName: "Nadia Iqbal", cc: [1, 2],
    createdBy: 1, createdByName: "Ahmed Kamal",
    dueDate: "2025-06-05", closedDate: null,
    reminderSent: false, priority: "Critical"
  },
  {
    id: "OBS-2025-007", date: "2025-05-23", location: "Control Room", department: "Operations",
    category: "PPE Compliance", status: "Closed",
    description: "Control room found with satisfactory PPE compliance. All operators wearing required safety footwear and eyewear. Emergency shower equipment found fully functional and access unobstructed.",
    correctiveAction: "No corrective action required. Documented as positive observation.",
    evidence: [],
    assignedTo: 3, assignedToName: "Tariq Hussain", cc: [],
    createdBy: 2, createdByName: "Sana Mirza",
    dueDate: "2025-05-30", closedDate: "2025-05-25",
    reminderSent: false, priority: "Low"
  },
  {
    id: "OBS-2025-008", date: "2025-05-25", location: "Fire Station", department: "Fire & Safety",
    category: "Fire Safety", status: "In Progress",
    description: "Annual inspection of fire hydrant network found 3 hydrants in the CDU-2 area with insufficient flow pressure (below 7 bar specification). Flow test records indicate degradation since last inspection.",
    correctiveAction: "Hydrant network pressure test scheduled. Maintenance team investigating blockage in header line. Interim measure: additional portable extinguisher positioned at CDU-2.",
    evidence: ["obs_008_flowtest.pdf"],
    assignedTo: 5, assignedToName: "Bilal Raza", cc: [1, 2],
    createdBy: 2, createdByName: "Sana Mirza",
    dueDate: "2025-06-10", closedDate: null,
    reminderSent: true, priority: "High"
  },
  {
    id: "OBS-2025-009", date: "2025-05-26", location: "Product Tank Farm", department: "Operations",
    category: "Housekeeping", status: "Closed",
    description: "Tank T-205 bund area found with accumulated debris including plastic packaging, rags, and empty containers. Fire risk due to flammable materials accumulation in hydrocarbon area.",
    correctiveAction: "Area cleaned same day by operations team. Waste removed to designated collection point. Housekeeping checklist updated to include tank farm bund areas.",
    evidence: ["obs_009_before.jpg", "obs_009_after.jpg"],
    assignedTo: 3, assignedToName: "Tariq Hussain", cc: [],
    createdBy: 2, createdByName: "Sana Mirza",
    dueDate: "2025-05-28", closedDate: "2025-05-27",
    reminderSent: false, priority: "Medium"
  },
  {
    id: "OBS-2025-010", date: "2025-05-28", location: "Utilities Area", department: "Utilities",
    category: "Process Safety", status: "Open",
    description: "Steam tracing on a critical instrument impulse line at the utilities boiler found non-functional. Instrument reading may be unreliable in cold weather conditions. Risk of incorrect process data to DCS.",
    correctiveAction: "Pending: Steam trap repair work order raised (WO-2025-1847). Instrument Engineering notified to add manual verification check until steam tracing restored.",
    evidence: [],
    assignedTo: 7, assignedToName: "Kamran Ali", cc: [6, 2],
    createdBy: 2, createdByName: "Sana Mirza",
    dueDate: "2025-06-07", closedDate: null,
    reminderSent: false, priority: "Medium"
  },
  {
    id: "OBS-2025-011", date: "2025-04-05", location: "CDU-2 Area", department: "Operations",
    category: "Unsafe Act", status: "Closed",
    description: "Two workers observed using mobile phones in a designated No-Phone zone near the crude oil charge pump area. Site policy and signage are clear. Workers stated they were unaware of the zone.",
    correctiveAction: "Workers counseled. Additional No-Phone zone signage installed. Topic added to monthly safety induction refresher.",
    evidence: [], assignedTo: 3, assignedToName: "Tariq Hussain", cc: [],
    createdBy: 2, createdByName: "Sana Mirza",
    dueDate: "2025-04-12", closedDate: "2025-04-10", reminderSent: false, priority: "Medium"
  },
  {
    id: "OBS-2025-012", date: "2025-04-10", location: "Cooling Tower", department: "Utilities",
    category: "Unsafe Condition", status: "Closed",
    description: "Access ladder to Cooling Tower Cell 3 platform found with a missing rung at the 2-meter level. Area cordoned off pending repair.",
    correctiveAction: "Ladder rung welded and repaired by maintenance. Load test performed. Cordon removed after approval from safety officer.",
    evidence: ["obs_012_ladder.jpg"],
    assignedTo: 5, assignedToName: "Bilal Raza", cc: [2],
    createdBy: 2, createdByName: "Sana Mirza",
    dueDate: "2025-04-17", closedDate: "2025-04-15", reminderSent: false, priority: "High"
  },
  {
    id: "OBS-2025-013", date: "2025-03-15", location: "Warehouse / Store", department: "Logistics",
    category: "Housekeeping", status: "Closed",
    description: "Chemical storage area in warehouse found with improperly stored containers — acids and bases stored in adjacent racks without adequate segregation. Risk of reactive chemical interaction.",
    correctiveAction: "Chemical segregation implemented per MSDS requirements. Color-coded storage zones applied. Storekeepers retrained on chemical compatibility.",
    evidence: [], assignedTo: 5, assignedToName: "Bilal Raza", cc: [],
    createdBy: 1, createdByName: "Ahmed Kamal",
    dueDate: "2025-03-22", closedDate: "2025-03-20", reminderSent: false, priority: "High"
  },
  {
    id: "OBS-2025-014", date: "2025-03-20", location: "Admin Block", department: "HSEQ",
    category: "Good Practice", status: "Closed",
    description: "HSEQ department has successfully completed 100% digital PTW issuance for the past 30 days, eliminating paper-based permits entirely. This represents a significant improvement in traceability.",
    correctiveAction: "Positive observation — no action required. Shared as best practice in refinery-wide safety bulletin.",
    evidence: [], assignedTo: 2, assignedToName: "Sana Mirza", cc: [1],
    createdBy: 1, createdByName: "Ahmed Kamal",
    dueDate: "2025-03-27", closedDate: "2025-03-21", reminderSent: false, priority: "Low"
  },
  {
    id: "OBS-2025-015", date: "2025-02-10", location: "Jetty Area", department: "Operations",
    category: "Near Miss", status: "Closed",
    description: "During crude oil ship unloading at the jetty, a loading arm connection hose developed a small leak at the coupling. Leak detected by olfactory cue before significant spill. Operations halted immediately.",
    correctiveAction: "Hose coupling replaced. Full pre-connection inspection checklist now mandatory before each tanker berth. Near-miss investigation report filed.",
    evidence: ["obs_015_hose.jpg", "obs_015_report.pdf"],
    assignedTo: 3, assignedToName: "Tariq Hussain", cc: [1, 2],
    createdBy: 2, createdByName: "Sana Mirza",
    dueDate: "2025-02-17", closedDate: "2025-02-15", reminderSent: false, priority: "Critical"
  },
];

export const MOCK_ACTION_ITEMS = [
  {
    id: "ACT-2025-001", activityType: "Incident Investigation",
    title: "CDU-1 Heat Exchanger Tube Rupture — CAPA Implementation",
    date: "2025-05-02", incidentRef: "INC-2025-003",
    incidentDate: "2025-04-28", incidentType: "Process — Equipment Failure",
    severity: "High Potential", rootCause: "Corrosion under insulation (CUI) due to delayed inspection. Last inspection was 18 months ago vs. 12-month requirement per integrity schedule.",
    immediateAction: "Heat exchanger isolated, bypassed. Process rerouted to standby unit.",
    correctiveAction: "1. Full CUI inspection of all CDU-1 heat exchangers. 2. Integrity inspection schedule updated to 6-month frequency. 3. Online monitoring probes installed at 4 critical points.",
    preventiveAction: "CUI program audit across all process units. Contractor briefing on CUI identification. Updated risk-based inspection (RBI) model.",
    assignedTo: 6, assignedToName: "Nadia Iqbal",
    dueDate: "2025-06-15", status: "In Progress",
    department: "Process", createdBy: 1, createdByName: "Ahmed Kamal",
    completionEvidence: "", priority: "Critical"
  },
  {
    id: "ACT-2025-002", activityType: "Internal Audit",
    title: "ISO 14001 NC — ETP Discharge Monitoring Records Gap",
    date: "2025-05-05", auditRef: "INT-AUD-2025-02",
    auditStandard: "ISO 14001:2015", clauseRef: "9.1.1 — Monitoring, measurement, analysis and evaluation",
    ncCategory: "Minor Non-Conformance", auditArea: "Environmental Management — ETP",
    finding: "ETP discharge monitoring records found incomplete for January–February 2025. 6 required daily readings missing from register. Does not meet regulatory reporting requirement.",
    correctiveAction: "Missing records reconstructed from lab system data. Register format updated with mandatory field validation. Responsible person re-assigned.",
    preventiveAction: "Monthly record completeness check added to HSEQ monthly review agenda.",
    assignedTo: 6, assignedToName: "Nadia Iqbal",
    dueDate: "2025-06-05", status: "Closed",
    department: "HSEQ", createdBy: 2, createdByName: "Sana Mirza",
    completionEvidence: "Updated ETP register attached. Lab data reconciliation report submitted.", priority: "Medium"
  },
  {
    id: "ACT-2025-003", activityType: "Management Walkthrough",
    title: "MD Walkthrough — Permit to Work Compliance Gaps in Maintenance",
    date: "2025-05-08", walkthroughDate: "2025-05-07",
    managersPresent: "MD, GM Operations, HSEQ Manager",
    areasVisited: "CDU-1 Maintenance Area, Workshop, Electrical Substation A",
    finding: "During MD walkthrough, 2 out of 5 active maintenance jobs found without valid PTW displayed at worksite. Workers could not produce permits when asked. This is a critical safety violation.",
    correctiveAction: "All active jobs halted until PTWs verified and displayed. PTW awareness session conducted for all maintenance crew (30 personnel). Spot check regime introduced: HSEQ officer to verify 3 random jobs per shift.",
    assignedTo: 5, assignedToName: "Bilal Raza",
    dueDate: "2025-05-22", status: "Closed",
    department: "Maintenance", createdBy: 1, createdByName: "Ahmed Kamal",
    completionEvidence: "PTW spot check log showing 100% compliance for past 10 days. Training attendance sheet attached.", priority: "Critical"
  },
  {
    id: "ACT-2025-004", activityType: "Mock Drill",
    title: "Emergency Response Drill — Gas Leak Scenario CDU-2",
    date: "2025-05-10", drillDate: "2025-05-09",
    drillType: "Emergency Response — Toxic Gas Release",
    scenario: "Simulated H2S gas release from sour water stripper overhead line in CDU-2. Evacuation of 45 personnel, emergency response team deployment, HAZMAT team activation.",
    responseTime: "First responder: 4 min 22 sec (Target: <3 min)",
    gapsIdentified: "1. Muster point 3 (near cooling tower) overcrowded — personnel from 2 departments assigned same muster. 2. Emergency siren not audible in Substation B. 3. 3 personnel did not know their muster point.",
    correctiveAction: "1. Muster point 3 split into 3A and 3B with revised department assignments. 2. Additional siren installed at Substation B. 3. Emergency response re-induction for all 3 personnel identified.",
    assignedTo: 7, assignedToName: "Kamran Ali",
    dueDate: "2025-06-10", status: "In Progress",
    department: "HSEQ", createdBy: 2, createdByName: "Sana Mirza",
    completionEvidence: "", priority: "High"
  },
  {
    id: "ACT-2025-005", activityType: "External Audit",
    title: "OGRA Regulatory Audit — PSM Documentation Observations",
    date: "2025-04-15", auditorBody: "OGRA (Oil & Gas Regulatory Authority)",
    auditType: "Process Safety Management (PSM) Regulatory Audit",
    auditGrade: "Satisfactory with Observations", regulatoryRef: "OGRA PSM Guidelines 2023 — Clause 4.2",
    finding: "Process Safety Information (PSI) documents for 3 critical process units (CDU-1, VDU, SRU) not updated to reflect recent process modifications made in Q4 2024. PSI must reflect current operating conditions.",
    correctiveAction: "PSI documents reviewed and updated for all 3 units. Management of Change (MOC) register cross-referenced to ensure all Q4 2024 modifications captured. Updated PSI submitted to OGRA within 30-day deadline.",
    assignedTo: 6, assignedToName: "Nadia Iqbal",
    dueDate: "2025-05-15", status: "Closed",
    department: "Process", createdBy: 1, createdByName: "Ahmed Kamal",
    completionEvidence: "Updated PSI documents (3 units) attached. OGRA acknowledgement receipt on file.", priority: "High"
  },
  {
    id: "ACT-2025-006", activityType: "Inspection",
    title: "Monthly Fire & Gas Detector Inspection — 4 Units Offline",
    date: "2025-05-12", inspectionType: "Fire & Gas Detection System Inspection",
    inspector: "Sana Mirza", checklistRef: "INSP-FGS-001",
    area: "CDU-1, CDU-2, Tank Farm, Utilities",
    deficiencies: "4 flame detectors found offline / fault condition: FD-CDU1-007, FD-CDU2-003, FD-TF-012, FD-UTIL-005. 1 gas detector sensor expired (GD-CDU2-009 — sensor life exceeded by 3 months).",
    correctiveAction: "All 4 flame detectors investigated: 2 replaced (faulty units), 2 reset and reconfigured. Gas detector GD-CDU2-009 sensor replaced. All units tested and returned to service.",
    assignedTo: 7, assignedToName: "Kamran Ali",
    dueDate: "2025-05-19", status: "Closed",
    department: "Electrical", createdBy: 2, createdByName: "Sana Mirza",
    completionEvidence: "Inspection completion record signed by Electrical Department. All detectors showing healthy status on SCADA.", priority: "Critical"
  },
  {
    id: "ACT-2025-007", activityType: "Potential to Incident",
    title: "Near-Miss: Falling Object Risk — CDU Pipe Rack Corroded Support",
    date: "2025-05-14",
    nearMissDescription: "Maintenance engineer identified severely corroded pipe support bracket on CDU-1 Pipe Rack Level 3. Bracket had lost approximately 60% of cross-section to corrosion. Imminent risk of falling pipe support (estimated weight 25 kg) onto walkway below, which carries 100+ personnel per shift.",
    riskSeverity: "Life-Threatening — Potential Fatality",
    immediateControls: "Area below cordoned off immediately. Access to walkway Section 3A suspended. Temporary support installed by rigging crew within 2 hours.",
    rcaRequired: true, rcaAssignee: "Nadia Iqbal",
    permanentFix: "Full replacement of corroded bracket with new hot-dip galvanized support. Complete visual survey of all Pipe Rack supports scheduled.",
    assignedTo: 5, assignedToName: "Bilal Raza",
    dueDate: "2025-05-28", status: "In Progress",
    department: "Maintenance", createdBy: 2, createdByName: "Sana Mirza",
    completionEvidence: "", priority: "Critical"
  },
  {
    id: "ACT-2025-008", activityType: "Other Activity",
    title: "Safety Climate Survey — Low Score in Night Shift Compliance",
    date: "2025-04-20",
    description: "Annual safety climate survey results show night shift workers scoring 38% lower on 'Management Visibility & Support' and 'Safety Compliance Confidence' compared to day shift. 120 personnel surveyed.",
    source: "Annual HSEQ Safety Climate Survey 2025",
    responsibleParty: "HSEQ Manager + Operations Management",
    targetDate: "2025-07-31",
    correctiveAction: "1. Management walkthrough schedule now includes 2 dedicated night shift visits per month. 2. Night shift HSEQ Officer position created. 3. Anonymous safety reporting hotline established. 4. Night shift safety recognition program launched.",
    assignedTo: 3, assignedToName: "Tariq Hussain",
    dueDate: "2025-07-31", status: "In Progress",
    department: "HSEQ", createdBy: 1, createdByName: "Ahmed Kamal",
    completionEvidence: "", priority: "Medium"
  },
];

export const KPI_DATA = {
  summary: {
    totalObservations: 127,
    openObservations: 18,
    closedObservations: 99,
    inProgressObservations: 10,
    totalActions: 64,
    openActions: 14,
    closedActions: 45,
    inProgressActions: 5,
    overdueObservations: 4,
    overdueActions: 3,
    observationClosureRate: 78,
    actionClosureRate: 70,
    lostTimeIncidents: 0,
    nearMisses: 7,
    firstAidCases: 3,
    safetyWalkthroughs: 12,
    auditsCompleted: 8,
    ltir: 0.0,
    trir: 2.4,
  },
  monthlyTrend: [
    { month: "Jan", observations: 14, actionsOpen: 8, actionsClosed: 6, nearMisses: 1, incidents: 0 },
    { month: "Feb", observations: 18, actionsOpen: 11, actionsClosed: 9, nearMisses: 2, incidents: 0 },
    { month: "Mar", observations: 22, actionsOpen: 9, actionsClosed: 14, nearMisses: 1, incidents: 0 },
    { month: "Apr", observations: 19, actionsOpen: 12, actionsClosed: 10, nearMisses: 0, incidents: 0 },
    { month: "May", observations: 28, actionsOpen: 14, actionsClosed: 16, nearMisses: 3, incidents: 0 },
    { month: "Jun", observations: 16, actionsOpen: 6, actionsClosed: 7, nearMisses: 0, incidents: 0 },
    { month: "Jul", observations: 10, actionsOpen: 4, actionsClosed: 5, nearMisses: 0, incidents: 0 },
  ],
  observationsByCategory: [
    { category: "Unsafe Act", count: 28, color: "#E8640A" },
    { category: "Unsafe Condition", count: 24, color: "#1B3F7B" },
    { category: "Near Miss", count: 7, color: "#DC2626" },
    { category: "Good Practice", count: 22, color: "#16A34A" },
    { category: "Environmental", count: 9, color: "#0891B2" },
    { category: "Housekeeping", count: 15, color: "#7C3AED" },
    { category: "PPE Compliance", count: 11, color: "#D97706" },
    { category: "Fire Safety", count: 7, color: "#EA580C" },
    { category: "Electrical Safety", count: 4, color: "#2563EB" },
  ],
  observationsByDepartment: [
    { department: "Operations", observations: 42, closed: 35, open: 7 },
    { department: "Maintenance", observations: 28, closed: 22, open: 6 },
    { department: "Process", observations: 19, closed: 15, open: 4 },
    { department: "Electrical", observations: 12, closed: 10, open: 2 },
    { department: "HSEQ", observations: 10, closed: 9, open: 1 },
    { department: "Utilities", observations: 8, closed: 5, open: 3 },
    { department: "Fire & Safety", observations: 5, closed: 4, open: 1 },
    { department: "Logistics", observations: 3, closed: 3, open: 0 },
  ],
  actionsByType: [
    { type: "Inspection", count: 18, color: "#1B3F7B" },
    { type: "Internal Audit", count: 12, color: "#2E6DB4" },
    { type: "Management Walkthrough", count: 10, color: "#E8640A" },
    { type: "Incident Investigation", count: 8, color: "#DC2626" },
    { type: "Potential to Incident", count: 7, color: "#D97706" },
    { type: "Mock Drill", count: 5, color: "#16A34A" },
    { type: "External Audit", count: 3, color: "#7C3AED" },
    { type: "Other Activity", count: 1, color: "#6B7280" },
  ],
  overdueItems: [
    { id: "OBS-2025-003", type: "Observation", title: "Arc flash boundary marking missing — Substation B", assignedTo: "Kamran Ali", dueDate: "2025-05-28", daysOverdue: 5, priority: "High" },
    { id: "OBS-2025-010", type: "Observation", title: "Steam tracing failure on instrument impulse line", assignedTo: "Kamran Ali", dueDate: "2025-06-07", daysOverdue: 0, priority: "Medium" },
    { id: "ACT-2025-001", type: "Action Item", title: "CDU-1 Heat Exchanger Tube Rupture CAPA", assignedTo: "Nadia Iqbal", dueDate: "2025-06-15", daysOverdue: 0, priority: "Critical" },
    { id: "ACT-2025-007", type: "Action Item", title: "Falling Object Risk — CDU Pipe Rack Support", assignedTo: "Bilal Raza", dueDate: "2025-05-28", daysOverdue: 5, priority: "Critical" },
  ]
};

export const DYNAMIC_FORM_FIELDS = {
  "Potential to Incident": [
    { key: "nearMissDescription", label: "Near Miss / Potential Incident Description", type: "textarea", required: true },
    { key: "riskSeverity", label: "Risk Severity", type: "select", options: ["Low", "Medium", "High", "Life-Threatening — Potential Fatality"], required: true },
    { key: "immediateControls", label: "Immediate Controls Taken", type: "textarea", required: true },
    { key: "rcaRequired", label: "Root Cause Analysis Required?", type: "radio", options: ["Yes", "No"], required: true },
    { key: "rcaAssignee", label: "RCA Assigned To", type: "user_select", required: false, conditional: { field: "rcaRequired", value: "Yes" } },
    { key: "permanentFix", label: "Permanent Corrective Action", type: "textarea", required: true },
  ],
  "Management Walkthrough": [
    { key: "walkthroughDate", label: "Walkthrough Date", type: "date", required: true },
    { key: "managersPresent", label: "Managers / Leaders Present", type: "text", required: true },
    { key: "areasVisited", label: "Areas / Facilities Visited", type: "text", required: true },
    { key: "finding", label: "Observation / Finding", type: "textarea", required: true },
    { key: "correctiveAction", label: "Required Action", type: "textarea", required: true },
  ],
  "Internal Audit": [
    { key: "auditRef", label: "Audit Reference Number", type: "text", required: true },
    { key: "auditStandard", label: "Audit Standard / System", type: "select", options: ["ISO 14001:2015", "ISO 45001:2018", "ISO 9001:2015", "OHSAS 18001", "Internal HSEQ Standard"], required: true },
    { key: "clauseRef", label: "Clause Reference", type: "text", required: true },
    { key: "ncCategory", label: "NC Category", type: "select", options: ["Major Non-Conformance", "Minor Non-Conformance", "Observation", "Opportunity for Improvement"], required: true },
    { key: "auditArea", label: "Audit Area / Department", type: "text", required: true },
    { key: "finding", label: "Audit Finding", type: "textarea", required: true },
    { key: "correctiveAction", label: "Corrective Action", type: "textarea", required: true },
    { key: "preventiveAction", label: "Preventive Action", type: "textarea", required: false },
  ],
  "External Audit": [
    { key: "auditorBody", label: "Auditing Body / Authority", type: "text", required: true },
    { key: "auditType", label: "Audit Type", type: "text", required: true },
    { key: "auditGrade", label: "Audit Grade / Outcome", type: "select", options: ["Fully Compliant", "Satisfactory with Observations", "Partially Compliant", "Non-Compliant"], required: true },
    { key: "regulatoryRef", label: "Regulatory Reference", type: "text", required: false },
    { key: "finding", label: "Audit Finding / Observation", type: "textarea", required: true },
    { key: "correctiveAction", label: "Corrective Action Plan", type: "textarea", required: true },
  ],
  "Incident Investigation": [
    { key: "incidentRef", label: "Incident Reference Number", type: "text", required: true },
    { key: "incidentDate", label: "Incident Date", type: "date", required: true },
    { key: "incidentType", label: "Incident Type", type: "select", options: ["LTI — Lost Time Incident", "Recordable Injury", "First Aid Case", "Near Miss", "Property Damage", "Environmental Release", "Process — Equipment Failure", "Fire / Explosion"], required: true },
    { key: "severity", label: "Severity Level", type: "select", options: ["Minor", "Moderate", "Serious", "Critical / High Potential"], required: true },
    { key: "rootCause", label: "Root Cause (RCA Summary)", type: "textarea", required: true },
    { key: "immediateAction", label: "Immediate / Emergency Action Taken", type: "textarea", required: true },
    { key: "correctiveAction", label: "Corrective Action (CAPA)", type: "textarea", required: true },
    { key: "preventiveAction", label: "Preventive Action (Recurrence Prevention)", type: "textarea", required: true },
  ],
  "Mock Drill": [
    { key: "drillDate", label: "Drill Date", type: "date", required: true },
    { key: "drillType", label: "Drill Type / Scenario Name", type: "text", required: true },
    { key: "scenario", label: "Scenario Description", type: "textarea", required: true },
    { key: "responseTime", label: "Response Time (Actual vs Target)", type: "text", required: true },
    { key: "gapsIdentified", label: "Gaps / Deficiencies Identified", type: "textarea", required: true },
    { key: "correctiveAction", label: "Corrective Actions to Address Gaps", type: "textarea", required: true },
  ],
  "Inspection": [
    { key: "inspectionType", label: "Inspection Type", type: "select", options: ["Routine Safety Inspection", "Monthly Fire & Gas Inspection", "PTW Compliance Check", "PPE Inspection", "Housekeeping Inspection", "Electrical Inspection", "Pressure Safety Valve Inspection", "Emergency Equipment Check"], required: true },
    { key: "inspector", label: "Inspector Name / Team", type: "text", required: true },
    { key: "checklistRef", label: "Checklist Reference", type: "text", required: false },
    { key: "area", label: "Area / Equipment Inspected", type: "text", required: true },
    { key: "deficiencies", label: "Deficiencies Found", type: "textarea", required: true },
    { key: "correctiveAction", label: "Required Actions", type: "textarea", required: true },
  ],
  "Other Activity": [
    { key: "description", label: "Activity Description", type: "textarea", required: true },
    { key: "source", label: "Source / Origin of Action", type: "text", required: true },
    { key: "responsibleParty", label: "Responsible Party / Department", type: "text", required: true },
    { key: "correctiveAction", label: "Required Action", type: "textarea", required: true },
  ]
};

export const ROLE_PERMISSIONS = {
  super_admin:  { canCreate: true,  canAssign: true,  canClose: true,  canEdit: true,  canAdmin: true,  canViewAll: true  },
  hseq_officer: { canCreate: true,  canAssign: true,  canClose: true,  canEdit: false, canAdmin: false, canViewAll: true  },
  focal_person: { canCreate: false, canAssign: false, canClose: true,  canEdit: false, canAdmin: false, canViewAll: false },
  employee:     { canCreate: false, canAssign: false, canClose: false, canEdit: false, canAdmin: false, canViewAll: false },
};

export default {
  MOCK_USERS, DEPARTMENTS, LOCATIONS, OBSERVATION_CATEGORIES,
  ACTION_ACTIVITY_TYPES, MOCK_OBSERVATIONS, MOCK_ACTION_ITEMS,
  KPI_DATA, DYNAMIC_FORM_FIELDS, ROLE_PERMISSIONS
};
