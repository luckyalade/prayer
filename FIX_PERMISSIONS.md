# Fix Firestore Permissions Error

You're seeing this error because your Firestore security rules are blocking write access. Here's how to fix it:

## Quick Fix (5 minutes)

### Step 1: Open Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your prayer project
3. Click **Firestore Database** in the left sidebar
4. Click the **Rules** tab at the top

### Step 2: Update Security Rules

Replace your current rules with these:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /prayers/{prayerId} {
      // Allow anyone to create a new prayer
      allow create: if true;

      // Allow anyone to read any prayer
      allow read: if true;

      // Prevent updates and deletes
      allow update, delete: if false;
    }
  }
}
```

### Step 3: Publish Rules

1. Click the **Publish** button
2. Wait for the confirmation message "Rules published successfully"

### Step 4: Test Your App

1. Go back to your app
2. Try submitting a prayer again
3. It should work now! ✅

---

## What These Rules Do

- ✅ **`allow create: if true`** - Anyone can create a new prayer (no authentication needed)
- ✅ **`allow read: if true`** - Anyone can read prayers (your app handles the date restriction)
- ❌ **`allow update, delete: if false`** - No one can modify or delete prayers once created

---

## More Secure Rules (Optional)

If you want to add extra validation, you can use these instead:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /prayers/{prayerId} {
      // Allow create only if the document has the correct structure
      allow create: if request.resource.data.keys().hasAll(['code', 'encrypted', 'createdAt'])
                    && request.resource.data.code is string
                    && request.resource.data.code.size() == 10
                    && request.resource.data.encrypted is string;

      // Allow anyone to read
      allow read: if true;

      // Never allow updates or deletes
      allow update, delete: if false;
    }
  }
}
```

These rules validate that:

- The prayer document has all required fields
- The code is exactly 10 characters
- The encrypted field is a string

---

## Why This Happened

When you created your Firestore database, you likely chose **"Start in production mode"**, which blocks all reads and writes by default. This is secure but requires you to explicitly define what's allowed.

---

## Troubleshooting

### Still getting permission errors?

1. Make sure you clicked **Publish** after updating the rules
2. Wait 10-20 seconds for rules to propagate
3. Refresh your app and try again

### Want to test rules before publishing?

1. Use the **Rules Playground** tab in Firebase Console
2. Simulate a create operation to see if it passes

---

## After Fixing

Once you update the rules and publish them, your app should work perfectly! You'll be able to:

- ✅ Submit prayers and get access codes
- ✅ Store prayers in Firestore
- ✅ Retrieve prayers using access codes (after Jan 1, 2027)
