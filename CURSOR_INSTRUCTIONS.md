# CURSOR BUILD INSTRUCTIONS
## HSEQ Portal Demo — 12Monday Technologies

> **Read this file first before writing any code.**
> This is your complete specification. Follow it exactly.

---

## STACK

- React 18 + Vite
- Ant Design 5.x (`antd`)
- Recharts (for all charts)
- React Router v6
- SheetJS (`xlsx`) for Excel export
- React Context for auth state
- All data from `src/data/mockData.js` — NO backend calls needed

Install command:
```bash
npm create vite@latest frontend -- --template react
cd frontend
npm install antd @ant-design/icons recharts xlsx react-router-dom
```

---

## COLOR PALETTE (use these exactly)

```js
const COLORS = {
  brandBlue:      '#1B3F7B',   // primary brand color
  brandLightBlue: '#2E6DB4',   // secondary blue
  accentOrange:   '#E8640A',   // accent / warnings
  lightBg:        '#EEF3FB',   // table alternate rows
  success:        '#16A34A',   // closed / good
  danger:         '#DC2626',   // overdue / critical
  warning:        '#D97706',   // medium priority
  darkText:       '#1A1A2E',
  grayText:       '#555566',
};
```

---

## FILE STRUCTURE TO CREATE

```
frontend/src/
├── data/
│   └── mockData.js              ← ALREADY PROVIDED — do not modify
├── context/
│   └── AuthContext.jsx          ← Auth state
├── components/
│   ├── layout/
│   │   ├── AppLayout.jsx        ← Sidebar + Header wrapper
│   │   └── Sidebar.jsx          ← Left navigation
│   ├── auth/
│   │   └── LoginPage.jsx        ← Login form
│   ├── dashboard/
│   │   ├── DashboardPage.jsx    ← Main dashboard
│   │   ├── KpiCards.jsx         ← Summary KPI cards row
│   │   ├── ObsTrendChart.jsx    ← Monthly trend line chart
│   │   ├── CategoryPieChart.jsx ← Observations by category
│   │   ├── DeptBarChart.jsx     ← Department performance bar
│   │   ├── ActionTypeChart.jsx  ← Action items by type
│   │   └── OverdueTable.jsx     ← Overdue items table
│   ├── observations/
│   │   ├── ObservationsPage.jsx ← List + filters + new button
│   │   ├── ObsTable.jsx         ← Table of observations
│   │   ├── ObsDetailModal.jsx   ← View/close/remind modal
│   │   └── NewObsModal.jsx      ← Create new observation form
│   ├── actions/
│   │   ├── ActionsPage.jsx      ← List + filters + new button
│   │   ├── ActionsTable.jsx     ← Table of action items
│   │   ├── ActionDetailModal.jsx← View/close action modal
│   │   └── NewActionModal.jsx   ← Dynamic form by type
│   └── admin/
│       └── AdminPage.jsx        ← User management (super_admin only)
├── App.jsx
└── main.jsx
```

---

## COMPONENT SPECIFICATIONS

### 1. AuthContext.jsx

```jsx
// Manages: currentUser, login(), logout()
// Login: match email+password against MOCK_USERS
// Store currentUser in localStorage for persistence
// Expose: currentUser, login(email, pass) => bool, logout()
```

### 2. LoginPage.jsx

- Full-screen centered card with PRL logo placeholder (blue circle with "PRL" text)
- Title: "HSEQ Portal" in brand blue
- Subtitle: "Pakistan Refinery Limited"
- Email and Password fields (Ant Design Form)
- "Sign In" button in brand blue
- Below form: small text "Demo Credentials" with a collapsed Ant Design Collapse/Accordion showing all 4 demo users in a table
- On successful login → navigate to /dashboard
- On failure → Ant Design message.error("Invalid credentials")

### 3. AppLayout.jsx + Sidebar.jsx

AppLayout wraps all authenticated pages with:
- Left sidebar (fixed, 240px wide, brand blue background)
- Top header (white, height 60px, shows current user name + role badge + logout button)
- Content area (light gray background, padding 24px)

Sidebar items:
```
🏠 Dashboard          → /dashboard
👁 Observations       → /observations
⚡ Action Items       → /actions
👤 Admin              → /admin   (ONLY visible if role === 'super_admin')
```

Sidebar footer: "12Monday Technologies" in small text, bottom of sidebar.

Active menu item: white text + slightly lighter blue background.

### 4. DashboardPage.jsx

Layout (top to bottom):
1. Page title: "HSEQ Dashboard" + date filter row (Month/Quarter/Year selector — visual only for demo)
2. "Export to Excel" button (top right) — exports KPI_DATA.summary as xlsx using SheetJS
3. KpiCards row (6 cards in a row)
4. Two charts side by side: ObsTrendChart (left, 60%) + CategoryPieChart (right, 40%)
5. Two charts side by side: DeptBarChart (left, 55%) + ActionTypeChart (right, 45%)
6. OverdueTable (full width)

### 5. KpiCards.jsx

Show 6 cards using Ant Design `<Card>` with colored top borders:

| Card | Value | Color |
|------|-------|-------|
| Total Observations | 127 | brandBlue |
| Open Observations | 18 | accentOrange |
| Closed This Month | 28 | success |
| Overdue Actions | 3 | danger |
| LTIR | 0.0 | success |
| Near Misses (YTD) | 7 | warning |

Each card: large number (36px bold), label below, small trend arrow (use ↑↓ unicode).

### 6. ObsTrendChart.jsx

Recharts LineChart with:
- X axis: months from KPI_DATA.monthlyTrend
- Lines: observations (blue), actionsOpen (orange), actionsClosed (green)
- Legend at bottom
- Tooltip on hover
- Title: "Monthly Observations & Actions Trend"

### 7. CategoryPieChart.jsx

Recharts PieChart (donut style, innerRadius=60):
- Data: KPI_DATA.observationsByCategory
- Use the `color` field from each item
- Legend on right side
- Title: "Observations by Category"

### 8. DeptBarChart.jsx

Recharts BarChart:
- Data: KPI_DATA.observationsByDepartment
- Stacked bars: closed (green) + open (orange)
- X axis: department names (angled 45 degrees)
- Title: "Department Safety Performance"

### 9. ActionTypeChart.jsx

Recharts BarChart (horizontal):
- Data: KPI_DATA.actionsByType
- Single bar with colors from data
- Title: "Action Items by Activity Type"

### 10. OverdueTable.jsx

Ant Design Table with columns:
- ID (tag with blue color)
- Type (tag: orange for Observation, red for Action Item)
- Title (truncated with ellipsis)
- Assigned To
- Due Date
- Days Overdue (red badge if > 0, else "On Track")
- Priority (colored tag: Critical=red, High=orange, Medium=yellow)

### 11. ObservationsPage.jsx

Top bar:
- Title "Observations" + count badge
- Filter row: Status dropdown, Category dropdown, Department dropdown, Search input
- "New Observation" button (brand blue) — opens NewObsModal

ObsTable columns:
- ID (monospace, blue link)
- Date
- Location
- Category (colored tag)
- Status (tag: Open=orange, In Progress=blue, Closed=green)
- Priority (tag: Critical=red, High=orange, Medium=yellow, Low=gray)
- Assigned To
- Due Date
- Actions: "View" button → opens ObsDetailModal

Clicking a row also opens ObsDetailModal.

### 12. ObsDetailModal.jsx

Modal (width 700px) showing all observation fields:
- Header: Observation ID + Status tag + Priority tag
- Two-column layout for metadata (date, location, dept, category)
- Full description text area (read-only)
- Corrective action text area (read-only)
- Assigned To + CC info
- Due Date + overdue warning if applicable
- Reminder badge if reminderSent = true

Action buttons at bottom (based on role permissions from ROLE_PERMISSIONS):
- "Send Reminder" button (if canAssign + status != Closed) → shows Ant Design message.success("Reminder sent to [name]")
- "Mark as Closed" button (if canClose + status != Closed) → updates status to Closed in local state
- "Close Modal" button

### 13. NewObsModal.jsx

Ant Design Form inside Modal (width 800px):
Fields:
1. Date (DatePicker, default today)
2. Location (Select from LOCATIONS)
3. Department (Select from DEPARTMENTS)
4. Category (Select from OBSERVATION_CATEGORIES)
5. Priority (Select: Critical/High/Medium/Low)
6. Description (TextArea, rows=4)
7. Corrective Action (TextArea, rows=3)
8. Assign To (Select from MOCK_USERS where role = focal_person or hseq_officer)
9. CC (MultiSelect from all MOCK_USERS)
10. Due Date (DatePicker)
11. Evidence (Upload button — visual only, shows file name but doesn't actually upload)

On Submit: add to local observations array, show message.success("Observation logged successfully"), close modal.
Only visible to roles with canCreate: true.

### 14. ActionsPage.jsx + ActionsTable.jsx

Similar to ObservationsPage but for action items.

Filter row: Activity Type dropdown, Status dropdown, Department dropdown, Priority dropdown.

Table columns:
- ID (blue tag)
- Activity Type (colored tag — each type has a unique color)
- Title (truncated)
- Department
- Status tag
- Priority tag
- Assigned To
- Due Date
- "View" button

### 15. NewActionModal.jsx — DYNAMIC FORM (Most Important Feature)

```jsx
// This is the key differentiator to show in the demo
// When activity type changes, the form fields change dynamically

const [activityType, setActivityType] = useState(null);
const fields = DYNAMIC_FORM_FIELDS[activityType] || [];
```

Form structure:
1. Activity Type (Select — this is the trigger field, shown prominently with label "Select Activity Type")
2. Title (text input, always shown)
3. Date (DatePicker, always shown)
4. Department (Select, always shown)
5. Assigned To (user Select, always shown)
6. Due Date (DatePicker, always shown)
7. Priority (Select, always shown)
8. --- DYNAMIC SECTION DIVIDER with text "Activity-Specific Details" ---
9. [Dynamic fields based on DYNAMIC_FORM_FIELDS[activityType]]

Dynamic field rendering:
- type: "textarea" → TextArea component
- type: "text" → Input component
- type: "date" → DatePicker component
- type: "select" → Select with options array
- type: "radio" → Radio.Group
- type: "user_select" → Select from MOCK_USERS
- conditional fields: only show if their condition is met

Show a highlighted info box when no type is selected:
"← Select an Activity Type above to load the relevant form fields"

When type is selected, animate in the fields with a smooth transition.

### 16. AdminPage.jsx

Only accessible if currentUser.role === 'super_admin'.
If another role tries to access /admin, redirect to /dashboard with message.warning.

Shows Ant Design Table of all MOCK_USERS:
- Name, Email, Role (colored tag), Department, Phone
- "Edit Role" button → opens a small modal to change role (updates local state only for demo)

---

## APP.JSX ROUTING

```jsx
<Routes>
  <Route path="/login" element={<LoginPage />} />
  <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
    <Route index element={<Navigate to="/dashboard" />} />
    <Route path="dashboard" element={<DashboardPage />} />
    <Route path="observations" element={<ObservationsPage />} />
    <Route path="actions" element={<ActionsPage />} />
    <Route path="admin" element={<AdminPage />} />
  </Route>
</Routes>
```

ProtectedRoute: if no currentUser, redirect to /login.

---

## DEMO TALKING POINTS (tell the evaluator during demo)

1. **Login** → "Four roles available — we'll log in as HSEQ Officer to show the full feature set"
2. **Dashboard** → "Real-time KPIs — 127 total observations, LTIR at 0.0, 3 overdue actions highlighted immediately"
3. **Dashboard filters** → "Data filterable by month, quarter, fiscal year — and exportable to Excel with one click"
4. **Observations** → "Log an observation — notice the Assign To and CC fields, just like the SOW requires"
5. **Action Items Dynamic Form** → "THIS is the key feature — watch what happens when I change the Activity Type" (switch from Inspection to Incident Investigation to show field change)
6. **Role demo** → "Log out, log in as Employee — observe same dashboard, but no create/assign buttons visible"
7. **Reminder** → "Open any Open observation, click Send Reminder — system confirms notification sent"

---

## EXCEL EXPORT IMPLEMENTATION

```jsx
import * as XLSX from 'xlsx';

const exportDashboard = () => {
  const ws = XLSX.utils.json_to_sheet([KPI_DATA.summary]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "HSEQ KPIs");
  
  // Add observations sheet
  const wsObs = XLSX.utils.json_to_sheet(
    MOCK_OBSERVATIONS.map(o => ({
      'Observation ID': o.id,
      'Date': o.date,
      'Location': o.location,
      'Department': o.department,
      'Category': o.category,
      'Status': o.status,
      'Priority': o.priority,
      'Assigned To': o.assignedToName,
      'Due Date': o.dueDate,
      'Closed Date': o.closedDate || 'Open',
    }))
  );
  XLSX.utils.book_append_sheet(wb, wsObs, "Observations");
  
  XLSX.writeFile(wb, `HSEQ_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
};
```

---

## STYLE NOTES

- Use Ant Design `ConfigProvider` to set primary color to #1B3F7B
- Sidebar: background #1B3F7B, text white, selected item background #2E6DB4
- KPI cards: white background, 4px colored top border, box shadow
- Status tags: Open=#E8640A, In Progress=#2E6DB4, Closed=#16A34A
- Priority tags: Critical=#DC2626, High=#E8640A, Medium=#D97706, Low=#6B7280
- All tables: use Ant Design Table with `size="small"` and `bordered`
- Charts: always include titles as `<h4>` above the Recharts component

---

## IMPORTANT NOTES FOR CURSOR

1. All data comes from `mockData.js` — never hardcode values
2. All state changes (close observation, add new) should update local `useState` arrays
3. Role-based rendering: always check `ROLE_PERMISSIONS[currentUser.role].canCreate` etc before showing buttons
4. The Dynamic Form in NewActionModal is the #1 feature to demonstrate — make it visually impressive
5. The dashboard charts should be responsive (use `ResponsiveContainer` from recharts everywhere)
6. Keep the design professional — this is going to a refinery company, not a startup
