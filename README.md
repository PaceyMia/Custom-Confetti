# Custom Confetti for Salesforce

A zero-dependency Lightning Web Component that fires a confetti animation on any Salesforce record page when a field reaches a specific value. Works on any object and any picklist or text field — Closed Won opportunities, resolved cases, approved records, whatever you want to celebrate.

Colours are fully configurable through Custom Metadata records in Setup. No code changes. No redeployment.

---

## What's included

| Component | Description |
|---|---|
| `customConfetti` LWC | The invisible canvas overlay that renders the animation |
| `ConfettiThemeController` | Apex class that reads colour themes from Custom Metadata |
| `ConfettiThemeControllerTest` | Apex test class — gives 100% coverage on `ConfettiThemeController` so the package can be deployed straight to a production org |
| `Confetti_Theme__mdt` | Custom Metadata Type for managing colour palettes |

**Starter themes included:**

| Developer Name | Colours |
|---|---|
| `Green_Yellow` | #005058 + #fff200 |
| `Navy_Gold` | #002B5C, #C9A96E, #F5F0EB |
| `Rainbow` | Red, Orange, Yellow, Green, Blue |
| `Classic` | Pink, Yellow, Green, Blue, Hot Pink |

---

## Prerequisites

Before you start, make sure you have:

- A Salesforce org (any edition that supports Lightning Experience)
- The **Salesforce CLI** (`sf`) installed — [download here](https://developer.salesforce.com/tools/salesforcecli)
- Your org authorised with the CLI (see Step 1 below)

---

## Installation — Step by Step

### Step 1 — Authorise your Salesforce org

Open a terminal and run:

```bash
sf org login web --alias MyOrg
```

A browser window will open. Log in to the Salesforce org where you want to install the component. Once logged in you can close the browser.

---

### Step 2 — Clone this repository

```bash
git clone https://github.com/PaceyMia/Custom-Confetti.git
cd Custom-Confetti
```

---

### Step 3 — Deploy to your org

```bash
sf project deploy start --target-org MyOrg --source-dir force-app
```

Wait for the confirmation message:

```
Status: Succeeded
```

That's it — the component, Apex class, Custom Metadata Type, and all starter themes are now in your org.

---

## Setup — Adding confetti to a record page

Once deployed, you add the component to any Lightning record page through **Lightning App Builder**. You do not need to touch any code.

### Step 1 — Open the record page in App Builder

1. Navigate to a record of the type you want to add confetti to (e.g. an Opportunity)
2. Click the **gear icon** (top right) → **Edit Page**
3. Lightning App Builder opens

### Step 2 — Add the component

1. In the left panel, search for **Custom Confetti**
2. Drag it anywhere onto the page layout — it is invisible on screen, so placement does not matter
3. The component properties panel will appear on the right

### Step 3 — Configure the properties

Fill in the three fields:

| Property | What to enter | Example |
|---|---|---|
| **Field API Path** | The object and field you want to watch | `Opportunity.StageName` |
| **Trigger Value** | The value that fires the confetti | `Closed Won` |
| **Confetti Theme** | Developer name of a theme record | `Green_Yellow` |

**Common examples:**

| Use case | Field API Path | Trigger Value |
|---|---|---|
| Opportunity won | `Opportunity.StageName` | `Closed Won` |
| Case resolved | `Case.Status` | `Resolved` |
| Custom approval | `My_Object__c.Status__c` | `Approved` |

> **Tip:** The Field API Path must include the object name. For custom objects and fields, include the `__c` suffix, e.g. `My_Object__c.My_Field__c`.

### Step 4 — Save and activate

1. Click **Save**
2. Click **Activate** if prompted
3. Open a record and change the watched field to the trigger value (e.g. move an Opportunity to **Closed Won**) and save — confetti fires the moment the value changes to match

---

## Managing colour themes

You can create, edit, or delete themes at any time without touching code or redeploying.

### Creating a new theme

1. In Salesforce, go to **Setup** (gear icon → Setup)
2. Search for **Custom Metadata Types** in the Quick Find box
3. Click **Custom Metadata Types** → find **Confetti Theme** → click **Manage Records**
4. Click **New**
5. Fill in:
   - **Label** — a display name, e.g. `My Brand`
   - **Name** — auto-fills as the Developer Name (e.g. `My_Brand`) — this is what you type into App Builder
   - **Colour 1** — hex code, e.g. `#FF0000` *(required)*
   - **Colour 2** — hex code *(required)*
   - **Colour 3, 4, 5** — hex codes *(optional — leave blank for a two-colour theme)*
6. Click **Save**

The new theme is immediately available. Go to App Builder, update the **Confetti Theme** property to your new Developer Name, save, and activate.

### Finding hex codes

Any colour picker or design tool will give you hex codes. A free web tool: [htmlcolorcodes.com/color-picker](https://htmlcolorcodes.com/color-picker)

---

## How it works

The component is invisible on screen — it renders as a transparent canvas that sits over the entire page.

1. It reads the **Field API Path** and **Trigger Value** from the App Builder config
2. It fetches the colour palette from the **Confetti Theme** Custom Metadata record
3. It watches the current record's field value and remembers what it last was
4. When that value **changes into** the Trigger Value, it fires a 4.8-second canvas animation with 220 confetti particles in the configured colours, then fades out

Confetti only fires on a genuine change into the trigger value — simply opening or refreshing a record that already matches won't set it off. Move the field away from the trigger value and back again (e.g. reopen a Closed Won deal, then re-close it) and it fires again every time.

---

## Troubleshooting

**Confetti does not appear**
- Remember it only fires on a *change into* the trigger value — opening or refreshing a record that already matches won't set it off. Change the field away and back (or to the trigger value on a fresh record) to see it fire
- Check the **Field API Path** is correct — it must include the object name, e.g. `Opportunity.StageName` not just `StageName`
- Check the **Trigger Value** matches exactly, including capitalisation — `Closed Won` not `closed won`
- Check the **Confetti Theme** developer name matches a `Confetti_Theme__mdt` record exactly

**"No such column" or deploy error**
- Make sure you are deploying to an org where the object and field in your Field API Path actually exist

**The component appears in App Builder but not on the page**
- Make sure you clicked **Activate** after saving — pages must be activated to take effect

---

## Adding more instances

You can add the component multiple times to the same page or to different pages. Each instance is independent and can watch a different field with a different theme.

---

## License

MIT — free to use, modify, and share.
