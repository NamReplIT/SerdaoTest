```markdown
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

```

This version organizes the information into distinct sections and ensures each step is clear and concise. Let me know if any further adjustments are needed!

<!-- # Introduction

We're thrilled to have you at this stage of our selection process! This test is designed to assess your skills and approach to problem-solving in a practical scenario. Please carefully follow the instructions below and ensure you read through the entire document. Good luck!

# Set up the Project

A significant challenge when working with React Native is setting up a complete environment before being able to run the project. We have intentionally omitted these instructions to assess your ability to independently set up said environment.

# Test

You will be working on an application that facilitates transactions to beneficiaries. To successfully complete the test, you will need to implement the following features:
 - Introduce a new page to create a beneficiary, including fields for their first name, last name, and IBAN. Additionally, incorporate an IBAN validator to ensure the IBAN's validity.
 - Enable the selection of a beneficiary from a list when making a transaction.
 - Preserve the state of the application so that upon reopening, the list of beneficiaries, transaction history, and balance are retained.

Note: you have free rein in how you want to implement this test, give it you best shot!

# Result

Please create a new Git repository to store both the test first version and your modifications. Document all the commands needed to install and launch this project, excluding the installation of any external SDKs/platforms, our focus will remain strictly on this project.

We hope that you will enjoy taking this test, best of luck! -->