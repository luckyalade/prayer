# Firebase Setup Instructions

This document provides step-by-step instructions for setting up Firebase Firestore for your prayer application.

## Prerequisites

- A Google account
- Access to the [Firebase Console](https://console.firebase.google.com/)

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **Add project** or **Create a project**
3. Enter a project name (e.g., "Prayer App")
4. (Optional) Enable Google Analytics if desired
5. Click **Create project**

## Step 2: Enable Firestore Database

1. In your Firebase project, navigate to **Build** → **Firestore Database** in the left sidebar
2. Click **Create database**
3. Choose **Start in production mode** (you can adjust security rules later)
4. Select a Firestore location (choose one closest to your users)
5. Click **Enable**

## Step 3: Register Your Web App

1. In the Firebase Console, click the **Web icon** (`</>`) to add a web app
2. Register your app with a nickname (e.g., "Prayer Web App")
3. (Optional) Check "Also set up Firebase Hosting" if you plan to host on Firebase
4. Click **Register app**

## Step 4: Get Your Firebase Configuration

After registering your app, you'll see your Firebase configuration object. It looks like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456",
};
```

**Important:** Copy these values - you'll need them in the next step!

## Step 5: Create Environment Variables File

1. In your project root directory (`c:\Users\lucky\Desktop\projects\prayer`), create a file named `.env.local`
2. Add your Firebase configuration values to this file:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
```

3. Replace each value with your actual Firebase configuration values from Step 4
4. Save the file

**Important Security Note:** The `.env.local` file is already in your `.gitignore`, so it won't be committed to Git. Never commit your Firebase credentials to a public repository!

## Step 6: Restart Your Development Server

After creating the `.env.local` file, you need to restart your Next.js development server for the environment variables to take effect:

1. Stop the current dev server (Ctrl+C in the terminal)
2. Run: `npm run dev`
3. Your app should now connect to Firebase Firestore!

## Step 7: Configure Firestore Security Rules (Optional)

To secure your Firestore database, you should configure security rules:

1. Go to **Firestore Database** → **Rules** in the Firebase Console
2. Replace the default rules with the following:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow anyone to create a prayer document
    match /prayers/{prayerId} {
      allow create: if request.auth == null &&
                       request.resource.data.code.size() == 10;

      // Allow anyone to read a prayer (access control is handled in the app)
      allow read: if request.auth == null;

      // Prevent updates and deletes
      allow update, delete: if false;
    }
  }
}
```

3. Click **Publish**

These rules:

- Allow anyone to create a prayer document (no authentication required)
- Allow anyone to read prayers (the app handles the access date restriction)
- Prevent updates and deletes to ensure prayers can't be modified

## Verification

To verify your setup is working:

1. Open your app in the browser
2. Click "Enter" and submit a test prayer
3. Copy the 10-digit code
4. Go to Firebase Console → Firestore Database
5. You should see a new document in the `prayers` collection with your prayer data

## Troubleshooting

### Error: "Firebase config not found"

- Make sure you created the `.env.local` file in the project root
- Verify all environment variables start with `NEXT_PUBLIC_`
- Restart your dev server after creating/modifying `.env.local`

### Error: "Missing or insufficient permissions"

- Check your Firestore security rules
- Make sure you enabled Firestore in the Firebase Console

### Prayer not saving

- Check the browser console for errors
- Verify your internet connection
- Check Firebase Console → Firestore Database to see if data is being written

## Next Steps

- Consider adding Firebase Analytics to track usage
- Set up Firebase Hosting for easy deployment
- Add more security rules as needed
- Consider adding authentication for admin features
