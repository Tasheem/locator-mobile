# Getting Started
- Install node and npm if you do not have it on your system already.
  - You can check by running these commands in a zsh or bash shell:
```bash 
node --version
```
```bash 
npm --version
```

- You also need to have android emulator setup through Android studio and/or iOS simulator setup through Xcode.
- Clone this repo onto your local machine.

# Running The Project
- Go to the root directory of the project and run:
```bash
npm start
```
- This will run the mobile app connected to the lokator server hosted in the Cloud.
- If you want to run the app connected to the localhost backend, boot the app like this:
```bash
npm run start:development
```

- The expo cli will come and prompt you with options to run the app on Android emulator, iOS Simulator, and more.
- You can enter the keys "a" or "i" to allow expo to open up your Android emulator or iOS Simulator.

# In The App
- The login screen will be presented to you.
  - Login if you already have an account.
  - Click the register button at the bottom to create an account.
    - Fill out all the fields on the register screen. At the time, there are only form validation checks on the password confirmation field and whether or not you've entered in meal preferences.
- After logged in, you can create a room and add friends to it.
  - Other users of the app can be searched in the participants screen, so you can add people to your room there.

# Recommendation Screen
- This shows all the food options in your area and ranks them based on the percentage of people in your room who's meal preferences are satisfied by the given food options.
  - The list only contains venues that are open at the time, based on their opening/closing hours.