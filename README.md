# The Raja Cycle Stores App

This is the official mobile application for The Raja Cycle Stores, built with React Native for a seamless experience on both iOS and Android devices.

## Tech Stack

*   **React Native**: For building native apps with React.
*   **React Navigation**: For routing and navigation.
*   **Tailwind CSS (NativeWind)**: For a utility-first styling workflow.

## Getting Started

Follow these instructions to get the project up and running on your local machine.

### 1. Install Dependencies

Make sure you have Node.js and Yarn/npm installed. Then, install the project dependencies:

```sh
npm install
# or
yarn
```

### 2. iOS Setup

For iOS, you'll need to install the CocoaPods dependencies from the `ios` directory:

```sh
cd ios && pod install && cd ..
```

### 3. Run the Application

With the setup complete, you can now run the app. Make sure you have a simulator/emulator running or a device connected.

First, start the Metro bundler:
```sh
npm start
# or
yarn start
```

Then, in a separate terminal, run the build command for your desired platform:

**Android**
```sh
npm run android
# or
yarn android
```

**iOS**
```sh
npm run ios
# or
yarn run ios
```

The app should now be running on your device/emulator. Any changes you make to the code will be reflected in real-time.
