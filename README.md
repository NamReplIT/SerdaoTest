# Project Setup Guide

## Introduction
This guide will walk you through setting up the project and installing necessary dependencies.

---

## Step 1: Project Setup

1. **Remove `package-lock.json`**  
   Delete the existing `package-lock.json` file from the root of your project.

2. **Install Base Dependencies**  
   Run the following command to install base project dependencies:
   ```bash
   npm install
   ```

3. **Update TypeScript Configuration**  
   Modify `tsconfig.json` as needed to ensure proper TypeScript support.

---

## Step 2: Directory Resolver Setup

1. **Install Babel Plugin Module Resolver**  
   This plugin helps resolve directories easily.
   ```bash
   npm install --save-dev babel-plugin-module-resolver
   ```

---

## Step 3: React Navigation Setup

1. **Install React Navigation**  
   React Navigation is used to manage navigation between screens.
   ```bash
   npm install @react-navigation/native
   ```

2. **Install Additional Navigation Dependencies**  
   Install necessary libraries for screen management and safe area handling.
   ```bash
   npm install react-native-screens react-native-safe-area-context
   npm install @react-navigation/bottom-tabs
   ```

3. **Update Native Configuration**  
   Modify the native code to work with React Navigation. Add the following code to `MainActivity.kt`:
   ```kotlin
   class MainActivity: ReactActivity() {
     override fun onCreate(savedInstanceState: Bundle?) {
       super.onCreate(null)
     }
   }
   ```
   File path: `android/app/src/main/java/com/serdaotest/MainActivity.kt`

---

## Step 4: Redux Setup

1. **Install Redux and Redux Persist**  
   These packages are required to manage global state and persist it across sessions.
   ```bash
   npm install react-redux @reduxjs/toolkit redux-persist @react-native-async-storage/async-storage
   ```

---

## Step 5: Validation Setup

1. **Install Yup**  
   Yup is used for form validation.
   ```bash
   npm install yup
   ```

---

## Step 6: Clean Gradle Cache (Optional)

1. **Clear Gradle Cache**  
   To avoid potential issues with cached builds, clear the Gradle cache.
   ```bash
   cd android && ./gradlew clean
   ```

---

## Conclusion
Follow these steps to successfully set up the project with all the required dependencies and configurations.