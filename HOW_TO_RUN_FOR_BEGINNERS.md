--

## 🛠️ Step 1: Install the Required Software
First, your computer needs to understand the code.

1. **Install Node.js (The Engine):**
   - Go to 👉 https://nodejs.org/
   - Click the green button that says **"LTS"** (Recommended for Most Users) to download it.
   - Open the downloaded file and click "Next" until it is installed. (Leave all checkboxes as default).

2. **Install MongoDB (The Database):**
   - Go to 👉 https://www.mongodb.com/try/download/community
   - Click the green **"Download"** button.
   - Open the downloaded file and click "Next" until it finishes. Make sure **"Install MongoDB Compass"** is checked!

3. **Get your Phone Ready:**
   - Open the **App Store** (iPhone) or **Google Play Store** (Android) on your phone.
   - Search for **"Expo Go"** and install it.

---

## 🌐 Step 2: Tell the App Where Your Computer Is
Your phone needs to know how to secretly talk to your computer over your home Wi-Fi. We have to give it your computer's IP address!

1. **Find your computer's IP Address:**
   - Click the Windows Start Menu, type `cmd`, and press Enter.
   - A black box will open. Type `ipconfig` and press Enter.
   - Look for the line that says **"IPv4 Address"**. It will look something like `192.168.1.something` or `10.something`. Write that number down!

2. **Put it in the code:**
   - Open the folder named `mobile` -> `src` -> `utils`.
   - Right-click the file named `constants.ts` and open it with Notepad (or any code editor).
   - Find the line near the very top that says `export const API_URL = 'http://10.134.241.76:3001';`
   - **CHANGE** that number to the IPv4 address you just found! It should look exactly like: `export const API_URL = 'http://YOUR_NEW_IP_NUMBER:3001';`
   - Save the file and close it.

---

## 🖥️ Step 3: Start the Backend (The Brain)
Now we will turn on the server that powers the indoor map!

1. Open the main project folder.
2. Double-click to open the `backend` folder.
3. Click on the address bar at the top of the folder window (where it says `C:\Users\...`), delete everything, type `cmd`, and press Enter. A black box will open.
(or just open backend folder in integrated terminal)
4. In the black box, type exactly this and press Enter:
   `npm install`
   *(Wait a minute for it to finish downloading everything)*
5. Next, type this and press Enter to fill the database with the map data:
   `node src/data/seedData.js`
6. Finally, turn the server on by typing:
   `node server.js`
   *(You should see a message saying "MongoDB connected". Leave this black box open! Don't close it!)*

---

## 📱 Step 4: Start the Mobile App (The Screen)
Almost done! Let's get the app onto your phone.

1. Go back to the main project folder.
2. Double-click to open the `mobile` folder.
3. Click the address bar at the top, type `cmd`, and press Enter to open another black box.
(or just open mobile folder in integrated terminal)
4. Type exactly this and press Enter:
   `npm install`
   *(Wait a few minutes for it to download the app files)*
5. Once it finishes, type this and press Enter:
   `npx expo start --clear`
6. A giant **QR Code** will magically appear in the black box! 

**Final Step:**
Open the  **Expo Go** app on Android and scan that QR code! The Indoor Navigation app will load directly onto your phone screen! 🎉


