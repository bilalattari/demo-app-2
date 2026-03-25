# ADMIN PANEL — COMPLETE BUILD SPEC
## HSEQ Portal Demo | 12Monday Technologies
## Add this to your existing frontend/src/ structure

---

## NEW FILES TO CREATE

```
frontend/src/
├── context/
│   └── AdminContext.jsx          ← Manages all admin state (forms, categories, users, log)
├── components/
│   └── admin/
│       ├── AdminPage.jsx          ← Tabbed admin shell (replaces old stub)
│       ├── tabs/
│       │   ├── FormBuilderTab.jsx     ← Edit dynamic form fields per activity type
│       │   ├── CategoriesTab.jsx      ← Manage observation categories
│       │   ├── LocationsTab.jsx       ← Manage locations + departments
│       │   ├── RemindersTab.jsx       ← Reminder templates + timing config
│       │   ├── ObservationsAdminTab.jsx ← View / edit / delete all observations
│       │   ├── ActionsAdminTab.jsx    ← View / edit / delete all action items
│       │   ├── UsersTab.jsx           ← User management (roles, depts)
│       │   └── AuditLogTab.jsx        ← Immutable audit trail
│       └── shared/
│           ├── FieldEditorRow.jsx     ← Single draggable field row in FormBuilder
│           └── AdminStatBar.jsx       ← Small stat summary bar at top of admin
```

---

## 1. AdminContext.jsx

Wrap the whole app in this context (add to App.jsx providers).
It holds the mutable admin-managed data in `useState` so changes persist during the demo session.

```jsx
import React, { createContext, useContext, useState } from 'react';
import {
  DYNAMIC_FORM_FIELDS,
  OBSERVATION_CATEGORIES,
  LOCATIONS,
  DEPARTMENTS,
  MOCK_USERS,
  MOCK_OBSERVATIONS,
  MOCK_ACTION_ITEMS
} from '../data/mockData';

const AdminContext = createContext(null);

// Seed audit log entries
const INITIAL_AUDIT_LOG = [
  { id: 1, timestamp: '2025-05-28 09:14:32', user: 'Ahmed Kamal', role: 'super_admin', action: 'USER_ROLE_UPDATED', target: 'Sana Mirza', detail: 'Role changed: employee → hseq_officer' },
  { id: 2, timestamp: '2025-05-27 14:22:10', user: 'Ahmed Kamal', role: 'super_admin', action: 'FORM_FIELD_ADDED', target: 'Inspection', detail: 'Added field: "Third Party Inspector Present" (radio)' },
  { id: 3, timestamp: '2025-05-26 11:05:44', user: 'Ahmed Kamal', role: 'super_admin', action: 'CATEGORY_ADDED', target: 'Observation Categories', detail: 'Added category: "Radiation Safety"' },
  { id: 4, timestamp: '2025-05-25 16:33:21', user: 'Ahmed Kamal', role: 'super_admin', action: 'LOCATION_DELETED', target: 'Locations', detail: 'Removed location: "Old Pump House (Decommissioned)"' },
  { id: 5, timestamp: '2025-05-24 08:50:09', user: 'Ahmed Kamal', role: 'super_admin', action: 'REMINDER_CONFIG_UPDATED', target: 'Reminder Settings', detail: 'First reminder changed: 7 days → 5 days before due date' },
  { id: 6, timestamp: '2025-05-23 10:12:55', user: 'Ahmed Kamal', role: 'super_admin', action: 'OBSERVATION_DELETED', target: 'OBS-2025-004', detail: 'Deleted: Duplicate entry removed' },
  { id: 7, timestamp: '2025-05-22 15:40:18', user: 'Ahmed Kamal', role: 'super_admin', action: 'USER_CREATED', target: 'focal.elec@prl.com.pk', detail: 'New user created: Kamran Ali (focal_person, Electrical)' },
  { id: 8, timestamp: '2025-05-21 09:28:37', user: 'Ahmed Kamal', role: 'super_admin', action: 'FORM_FIELD_REORDERED', target: 'Mock Drill', detail: 'Field "Response Time" moved from position 4 → 3' },
];

// Reminder config seed data
const INITIAL_REMINDER_CONFIG = {
  firstReminder: 5,        // days before due
  secondReminder: 2,       // days before due
  overdueReminder: 1,      // days interval after overdue
  emailSubjectTemplate: 'Action Required: {itemId} — {title} due on {dueDate}',
  emailBodyTemplate: 'Dear {assigneeName},\n\nThis is a reminder that the following HSEQ item assigned to you is due on {dueDate}:\n\nItem: {itemId} — {title}\nCategory: {category}\nPriority: {priority}\n\nPlease log in to the HSEQ Portal to update the status.\n\nRegards,\nHSEQ Department\nPakistan Refinery Limited',
  smsEnabled: false,
  smsTemplate: 'PRL HSEQ: {itemId} due {dueDate}. Login to portal.',
};

export function AdminProvider({ children }) {
  // Mutable copies of all data
  const [formFields, setFormFields]         = useState({ ...DYNAMIC_FORM_FIELDS });
  const [categories, setCategories]         = useState([...OBSERVATION_CATEGORIES]);
  const [locations, setLocations]           = useState([...LOCATIONS]);
  const [departments, setDepartments]       = useState([...DEPARTMENTS]);
  const [users, setUsers]                   = useState([...MOCK_USERS]);
  const [observations, setObservations]     = useState([...MOCK_OBSERVATIONS]);
  const [actionItems, setActionItems]       = useState([...MOCK_ACTION_ITEMS]);
  const [auditLog, setAuditLog]             = useState(INITIAL_AUDIT_LOG);
  const [reminderConfig, setReminderConfig] = useState(INITIAL_REMINDER_CONFIG);

  // Push to audit log
  const logAction = (user, action, target, detail) => {
    const entry = {
      id: Date.now(),
      timestamp: new Date().toLocaleString('en-PK', { hour12: false }).replace(',', ''),
      user: user?.name || 'System',
      role: user?.role || 'system',
      action,
      target,
      detail,
    };
    setAuditLog(prev => [entry, ...prev]);
  };

  // ── FORM FIELDS ──────────────────────────────────────────
  const addFormField = (activityType, field, currentUser) => {
    setFormFields(prev => ({
      ...prev,
      [activityType]: [...(prev[activityType] || []), field]
    }));
    logAction(currentUser, 'FORM_FIELD_ADDED', activityType, `Added field: "${field.label}" (${field.type})`);
  };

  const updateFormField = (activityType, fieldIndex, updatedField, currentUser) => {
    setFormFields(prev => {
      const updated = [...prev[activityType]];
      updated[fieldIndex] = updatedField;
      return { ...prev, [activityType]: updated };
    });
    logAction(currentUser, 'FORM_FIELD_UPDATED', activityType, `Updated field at position ${fieldIndex + 1}: "${updatedField.label}"`);
  };

  const deleteFormField = (activityType, fieldIndex, currentUser) => {
    const fieldLabel = formFields[activityType][fieldIndex]?.label;
    setFormFields(prev => {
      const updated = prev[activityType].filter((_, i) => i !== fieldIndex);
      return { ...prev, [activityType]: updated };
    });
    logAction(currentUser, 'FORM_FIELD_DELETED', activityType, `Deleted field: "${fieldLabel}"`);
  };

  const reorderFormFields = (activityType, newFields, currentUser) => {
    setFormFields(prev => ({ ...prev, [activityType]: newFields }));
    logAction(currentUser, 'FORM_FIELD_REORDERED', activityType, `Fields reordered (${newFields.length} fields)`);
  };

  // ── CATEGORIES ────────────────────────────────────────────
  const addCategory = (cat, currentUser) => {
    setCategories(prev => [...prev, cat]);
    logAction(currentUser, 'CATEGORY_ADDED', 'Observation Categories', `Added: "${cat}"`);
  };
  const updateCategory = (oldCat, newCat, currentUser) => {
    setCategories(prev => prev.map(c => c === oldCat ? newCat : c));
    logAction(currentUser, 'CATEGORY_UPDATED', 'Observation Categories', `Renamed: "${oldCat}" → "${newCat}"`);
  };
  const deleteCategory = (cat, currentUser) => {
    setCategories(prev => prev.filter(c => c !== cat));
    logAction(currentUser, 'CATEGORY_DELETED', 'Observation Categories', `Deleted: "${cat}"`);
  };

  // ── LOCATIONS ─────────────────────────────────────────────
  const addLocation = (loc, currentUser) => {
    setLocations(prev => [...prev, loc]);
    logAction(currentUser, 'LOCATION_ADDED', 'Locations', `Added: "${loc}"`);
  };
  const updateLocation = (old, updated, currentUser) => {
    setLocations(prev => prev.map(l => l === old ? updated : l));
    logAction(currentUser, 'LOCATION_UPDATED', 'Locations', `Renamed: "${old}" → "${updated}"`);
  };
  const deleteLocation = (loc, currentUser) => {
    setLocations(prev => prev.filter(l => l !== loc));
    logAction(currentUser, 'LOCATION_DELETED', 'Locations', `Removed: "${loc}"`);
  };

  // ── DEPARTMENTS ───────────────────────────────────────────
  const addDepartment = (dept, currentUser) => {
    setDepartments(prev => [...prev, dept]);
    logAction(currentUser, 'DEPT_ADDED', 'Departments', `Added: "${dept}"`);
  };
  const deleteDepartment = (dept, currentUser) => {
    setDepartments(prev => prev.filter(d => d !== dept));
    logAction(currentUser, 'DEPT_DELETED', 'Departments', `Removed: "${dept}"`);
  };

  // ── USERS ─────────────────────────────────────────────────
  const addUser = (user, currentUser) => {
    const newUser = { ...user, id: Date.now(), avatar: user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) };
    setUsers(prev => [...prev, newUser]);
    logAction(currentUser, 'USER_CREATED', user.email, `New user: ${user.name} (${user.role}, ${user.department})`);
  };
  const updateUserRole = (userId, newRole, currentUser) => {
    const target = users.find(u => u.id === userId);
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    logAction(currentUser, 'USER_ROLE_UPDATED', target?.name, `Role: ${target?.role} → ${newRole}`);
  };
  const deleteUser = (userId, currentUser) => {
    const target = users.find(u => u.id === userId);
    setUsers(prev => prev.filter(u => u.id !== userId));
    logAction(currentUser, 'USER_DELETED', target?.name, `User removed: ${target?.email}`);
  };

  // ── OBSERVATIONS (admin) ──────────────────────────────────
  const updateObservation = (id, updates, currentUser) => {
    setObservations(prev => prev.map(o => o.id === id ? { ...o, ...updates } : o));
    logAction(currentUser, 'OBSERVATION_UPDATED', id, `Fields updated: ${Object.keys(updates).join(', ')}`);
  };
  const deleteObservation = (id, currentUser) => {
    setObservations(prev => prev.filter(o => o.id !== id));
    logAction(currentUser, 'OBSERVATION_DELETED', id, `Observation permanently deleted`);
  };

  // ── ACTION ITEMS (admin) ──────────────────────────────────
  const updateActionItem = (id, updates, currentUser) => {
    setActionItems(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
    logAction(currentUser, 'ACTION_UPDATED', id, `Fields updated: ${Object.keys(updates).join(', ')}`);
  };
  const deleteActionItem = (id, currentUser) => {
    setActionItems(prev => prev.filter(a => a.id !== id));
    logAction(currentUser, 'ACTION_DELETED', id, `Action item permanently deleted`);
  };

  // ── REMINDERS ─────────────────────────────────────────────
  const updateReminderConfig = (updates, currentUser) => {
    setReminderConfig(prev => ({ ...prev, ...updates }));
    logAction(currentUser, 'REMINDER_CONFIG_UPDATED', 'Reminder Settings', `Updated: ${Object.keys(updates).join(', ')}`);
  };

  return (
    <AdminContext.Provider value={{
      // Data
      formFields, categories, locations, departments, users,
      observations, actionItems, auditLog, reminderConfig,
      // Form field actions
      addFormField, updateFormField, deleteFormField, reorderFormFields,
      // Category actions
      addCategory, updateCategory, deleteCategory,
      // Location actions
      addLocation, updateLocation, deleteLocation,
      // Dept actions
      addDepartment, deleteDepartment,
      // User actions
      addUser, updateUserRole, deleteUser,
      // Observation admin
      updateObservation, deleteObservation,
      // Action item admin
      updateActionItem, deleteActionItem,
      // Reminder
      updateReminderConfig,
      // Direct setters for portal pages (so they share the same data)
      setObservations, setActionItems,
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => useContext(AdminContext);
```

**IMPORTANT:** In App.jsx, wrap everything:
```jsx
<AdminProvider>
  <AuthProvider>
    <RouterProvider ... />
  </AuthProvider>
</AdminProvider>
```

Also update ObservationsPage.jsx and ActionsPage.jsx to read from `useAdmin()` instead of directly from mockData, so admin edits/deletions are immediately reflected in the portal views.

---

## 2. AdminPage.jsx — Tabbed Shell

```jsx
import { Tabs, Alert, Typography } from 'antd';
import {
  ToolOutlined, TagsOutlined, EnvironmentOutlined, BellOutlined,
  EyeOutlined, ThunderboltOutlined, TeamOutlined, AuditOutlined
} from '@ant-design/icons';

// Guard: only super_admin can access
// If another role visits /admin → redirect to /dashboard + message.warning

// AdminStatBar at top: show quick stats
// - Total Users: {users.length}
// - Activity Types with Custom Forms: 8
// - Total Observations: {observations.length}
// - Total Action Items: {actionItems.length}
// - Audit Log Entries: {auditLog.length}

const tabItems = [
  { key: 'forms',        label: '🔧 Form Builder',       children: <FormBuilderTab /> },
  { key: 'categories',   label: '🏷 Categories',          children: <CategoriesTab /> },
  { key: 'locations',    label: '📍 Locations & Depts',   children: <LocationsTab /> },
  { key: 'reminders',    label: '🔔 Reminders',           children: <RemindersTab /> },
  { key: 'observations', label: '👁 Observations',        children: <ObservationsAdminTab /> },
  { key: 'actions',      label: '⚡ Action Items',        children: <ActionsAdminTab /> },
  { key: 'users',        label: '👥 Users',               children: <UsersTab /> },
  { key: 'auditlog',     label: '📋 Audit Log',           children: <AuditLogTab /> },
];

// Tab bar style: brand blue active tab, sticky tabs
```

---

## 3. FormBuilderTab.jsx — THE STAR ADMIN FEATURE

This is what will impress the evaluation committee the most.

**Layout:**
- Left panel (30% width): List of 8 activity types as clickable cards
  - Each card shows: Activity Type name + field count badge
  - Selected card highlighted in brand blue
- Right panel (70% width): Field editor for the selected activity type

**Right panel — field list:**

Each field shown as a card row with:
- Drag handle icon (☰) on left — for reordering (use array index swap buttons ↑↓ if drag-and-drop is complex)
- Field Label (bold)
- Field Type badge (colored tag: textarea=blue, select=green, date=orange, radio=purple, text=gray)
- Required indicator: red asterisk if required
- Conditional badge: shows "Conditional on: [field]" if it has a condition
- Action buttons: ✏️ Edit | 🗑 Delete

**"Add New Field" button** at bottom of field list → opens AddFieldModal

**AddFieldModal / EditFieldModal:**

```jsx
// Form fields in the modal:
// 1. Field Label (required, text input)
// 2. Field Key (auto-generated from label, snake_case, shown as read-only hint)
// 3. Field Type (Select):
//    - Text Input
//    - Textarea (multiline)
//    - Dropdown (Select)
//    - Radio Group
//    - Date Picker
//    - User Select
// 4. Required? (Switch toggle)
// 5. [If type = select or radio]: Options (dynamic list — add/remove options)
//    - Show a list of text inputs, each with a ✕ delete button
//    - "+ Add Option" button to add more
// 6. Conditional Display (Switch toggle)
//    [If enabled]:
//    - "Show this field only when:" 
//    - Field: Select from existing fields in this form
//    - Value equals: text input

// On Save: call addFormField or updateFormField from AdminContext
// Show message.success('Field saved. Form updated.')
```

**Live Preview panel** (optional but impressive):
Show a simplified preview of what the form looks like with all current fields rendered as disabled Ant Design form items. Updates instantly as fields are added/removed/reordered.

---

## 4. CategoriesTab.jsx

**Layout:** Two-column
- Left (50%): Observation Categories list
- Right (50%): Action Activity Types list (read-only — these are fixed system types, but show them for reference)

**Observation Categories panel:**
- Title + "+ Add Category" button
- List of categories as Ant Design Tags with ✏️ rename and 🗑 delete buttons
- Clicking ✏️ rename → inline edit (Input that replaces the tag text)
- Clicking 🗑 → Ant Design Popconfirm: "Delete this category? Existing observations using it will retain the old value." → on confirm, call deleteCategory

**Add Category:**
- Small inline form: text input + "Add" button
- Validates: not empty, not duplicate
- On add: show tag appear with a slide-in animation

**Action Activity Types panel (right):**
- Show all 8 types as gray read-only tags
- Small info alert: "Activity types are system-defined and cannot be modified. Contact 12Monday Technologies to add new types."

---

## 5. LocationsTab.jsx

**Layout:** Two cards side by side

**Locations card (left):**
- Title "Facility Locations" + total count badge
- Search input to filter the list
- Scrollable list (max height 400px) — each item is a row:
  - Location name
  - ✏️ Edit button → Popover with input to rename
  - 🗑 Delete button → Popconfirm before delete
- "+ Add Location" inline form at bottom: input + "Add" button

**Departments card (right):**
- Same structure as locations
- Title "Departments"
- Same CRUD operations

**Both cards:** show a small info alert at top: "Changes here are reflected immediately in all observation and action item forms."

---

## 6. RemindersTab.jsx

**Layout:** Single column, sections

**Section 1 — Timing Configuration**
Title: "Reminder Schedule"
Show as a visual timeline/stepper:

```
[Assignment] ──── [First Reminder: 5 days before] ──── [Second Reminder: 2 days before] ──── [DUE DATE] ──── [Overdue: every 1 day]
```

Below the visual, editable number inputs:
- "Send first reminder": [NumberInput] days before due date
- "Send second reminder": [NumberInput] days before due date
- "Send overdue reminder every": [NumberInput] days

"Save Timing" button → calls updateReminderConfig, shows message.success

**Section 2 — Email Template**
Title: "Email Notification Template"
Info box: "Available variables: {itemId} {title} {assigneeName} {dueDate} {category} {priority}"

- Subject line (Input, pre-filled with template)
- Body (TextArea, rows=8, pre-filled with template)
- "Save Email Template" button

**Section 3 — SMS (Optional)**
Title: "SMS Notifications"
- Enable SMS toggle (Switch) — currently OFF
- When OFF: grayed out, shows "SMS notifications are currently disabled"
- SMS Template (Input, pre-filled)
- "Save SMS Settings" button

---

## 7. ObservationsAdminTab.jsx

**This is a full-power admin view of ALL observations.**

**Top bar:**
- Title "All Observations" + total count badge
- Search input (searches across ID, description, location)
- Filter row: Status, Category, Department, Priority, Date Range picker
- "Export to Excel" button (exports filtered list)

**Table columns:**
- ID (blue monospace)
- Date
- Location
- Department
- Category (tag)
- Status (colored tag)
- Priority (colored tag)
- Assigned To
- Due Date (red if overdue)
- Created By
- Actions: **Edit** button + **Delete** button (with Popconfirm)

**Edit button** → opens EditObservationModal:
- Full form pre-filled with existing data
- Admin can edit ANY field (status, assignee, due date, description, corrective action, category, location, department, priority)
- Save → calls updateObservation

**Delete button** → Popconfirm: "This will permanently delete OBS-XXXX and cannot be undone. Type the observation ID to confirm."
- Requires user to type the ID as confirmation (prevents accidental deletes)
- On confirm → calls deleteObservation

**Bulk actions:**
- Checkboxes on rows
- "Bulk Update Status" button → dropdown to change status of all selected
- "Bulk Reassign" button → select new assignee for all selected

---

## 8. ActionsAdminTab.jsx

Same structure as ObservationsAdminTab but for action items.

**Extra column:** Activity Type (colored tag)

**Edit fields specific to action items:**
- Activity Type (dropdown)
- Title
- Status
- Priority  
- Assigned To
- Due Date
- All activity-specific text fields (correctiveAction, finding, rootCause, etc.) as textareas

---

## 9. UsersTab.jsx

**Top bar:**
- Title "User Management" + count badge
- "+ Add User" button → opens AddUserModal
- Search input

**Table columns:**
- Avatar (colored circle with initials)
- Name
- Email
- Role (colored editable tag — click to open role dropdown inline)
- Department
- Phone
- Status (Active / Inactive toggle switch)
- Actions: **Edit** | **Delete**

**Role color mapping:**
```
super_admin  → red tag   "Super Admin"
hseq_officer → blue tag  "HSEQ Officer"
focal_person → orange tag "Focal Person"
employee     → gray tag   "Employee"
```

**AddUserModal / EditUserModal:**
```
- Full Name (required)
- Email (required, validated format)
- Password (required for new user, optional for edit — shows "Leave blank to keep current")
- Role (Select — all 4 roles)
- Department (Select from departments list)
- Phone (optional)
```

**Delete user:** Popconfirm "Are you sure? This user will lose all access." Cannot delete self (disable delete button for currentUser.id).

---

## 10. AuditLogTab.jsx

**This shows the complete immutable audit trail.**

**Top bar:**
- Title "Audit Log" + total count badge
- Filter: Action Type dropdown, Date range, User filter
- "Export Audit Log" button (exports to Excel with all columns)

**Table columns:**
- Timestamp (monospace, sorted newest first)
- User (name + small role badge)
- Action (colored tag — see action color map below)
- Target (bold — the ID/name of what was affected)
- Detail (full description, truncated with expand)

**Action color map:**
```
USER_*       → purple
FORM_*       → blue
CATEGORY_*   → cyan
LOCATION_*   → geekblue
DEPT_*       → gold
REMINDER_*   → orange
OBSERVATION_* → green
ACTION_*     → lime
```

**Important visual detail:** Show a small banner at top:
"🔒 This log is read-only and cannot be modified. All admin actions are recorded automatically."

**No delete or edit buttons anywhere in this tab.**

---

## HOW AdminContext CONNECTS TO PORTAL PAGES

Update these existing files to use AdminContext instead of raw mockData:

### ObservationsPage.jsx — update import:
```jsx
// BEFORE:
import { MOCK_OBSERVATIONS } from '../data/mockData';
const [observations, setObservations] = useState(MOCK_OBSERVATIONS);

// AFTER:
import { useAdmin } from '../context/AdminContext';
const { observations, setObservations, categories, locations, departments, users } = useAdmin();
// Remove the local useState for observations — it now comes from AdminContext
```

### ActionsPage.jsx — update import:
```jsx
// BEFORE:
import { MOCK_ACTION_ITEMS } from '../data/mockData';

// AFTER:
import { useAdmin } from '../context/AdminContext';
const { actionItems, setActionItems } = useAdmin();
```

### NewObsModal.jsx — update dropdowns:
```jsx
// Use categories, locations, departments from useAdmin() instead of mockData imports
// This means when admin adds a new category/location, it immediately appears in the form
const { categories, locations, departments, users } = useAdmin();
```

### NewActionModal.jsx — update dynamic form:
```jsx
// Use formFields from useAdmin() instead of DYNAMIC_FORM_FIELDS from mockData
// This means when admin edits a form field, it immediately updates in the portal
const { formFields } = useAdmin();
```

---

## DEMO SCRIPT ADDITIONS (for the admin features)

Add these talking points to your demo:

**1. Form Builder:**
"Let me show you something powerful — the admin can go into Form Builder, select 'Inspection', and add a new field right here: [click Add Field, fill in 'Third Party Inspector Present' as a radio yes/no field, click Save]. Now if I go to the Action Items portal and create a new Inspection — [navigate] — that new field appears immediately. No developer needed."

**2. Categories:**
"PRL's HSEQ team can add their own observation categories. Say they want 'Radiation Safety' — [click add, type it, save]. Done. It's instantly available in the Observation form. No IT ticket needed."

**3. Audit Log:**
"Everything the admin does is logged here — immutably. If someone adds a user, changes a role, edits a form — it's all captured with timestamp, who did it, and what changed. This is your compliance trail."

**4. Observations Admin:**
"If a record was entered with wrong data — the HSEQ admin can come here, edit it directly, and the change is logged. If it's a complete duplicate, delete with confirmation. No need to call the vendor."

**5. Reminder Config:**
"The admin can control exactly when reminders go out. Here's the timeline — [show the visual stepper]. Currently set to 5 days before, then 2 days before. They can adjust it to 7 and 3 days without any code change. The email template is also editable — they can put their own wording."

---

## COMPLETE FEATURE CHECKLIST

After building admin panel, your demo covers:

### Portal Features (from SOW)
- [x] Observation recording with date, location, dept, category, description, corrective action, evidence
- [x] "Assign To" field for responsible person
- [x] "CC" field for additional stakeholders  
- [x] Manual reminder feature for overdue/pending
- [x] Action items panel for 8 activity types
- [x] Dynamic form that adjusts by activity type
- [x] HSEQ Dashboard with KPI visualizations
- [x] Total observations by category + location
- [x] Open vs closed action items
- [x] Overdue tracking
- [x] Monthly/yearly trends
- [x] Department-wise performance
- [x] Charts and KPI indicators
- [x] Real-time sync (portal ↔ dashboard via shared AdminContext)
- [x] Time-period filters (month/quarter/year)
- [x] Excel export
- [x] Role-based access control (4 levels)
- [x] Super Admin can edit portal
- [x] Dashboard accessible to all employees

### Admin Features (beyond SOW — differentiator)
- [x] Visual Form Builder — add/edit/delete/reorder form fields per activity type
- [x] Category management
- [x] Location + department management
- [x] Reminder template + timing configuration
- [x] Admin view of all observations with edit/delete + bulk actions
- [x] Admin view of all action items with edit/delete
- [x] User management with role assignment
- [x] Immutable audit log with export
