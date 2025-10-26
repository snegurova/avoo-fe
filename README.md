# AVOO Monorepo — Web (Next.js) + Mobile (Expo) + API (Nest.js)

Monorepo with **Next.js (web)** and **Expo/React Native (mobile)** powered by **Yarn 4 workspaces**. Run web & mobile side-by-side from the repo root.

---

## Requirements

- **Node.js** ≥ 18 (20 LTS recommended)
- **Yarn 4** (Berry)
- **Git**

**For Mobile:**

- **Xcode** (for iOS Simulator) — macOS
- **Android Studio + SDK** (for Android Emulator)
- **Java 17 (JDK)**

---

## Repository Structure

```
apps/
  web/      # Next.js 14
  mobile/   # Expo (React Native)
packages/
  ui/       # Shared UI package
```

---

## Install

```bash
# from repository root
yarn install
```

---

## Development

### Generate api types

```bash
yarn types
```

### Start both Web + Mobile (Expo Go, no key presses)

This runs Next.js and Expo and auto-opens Android & iOS if simulators/emulators are running.

```bash
yarn dev
# web:   http://localhost:3000
# metro: http://localhost:8081
```

### Start both in **Dev Client** mode

(Requires a one-time dev-client install — see “Dev Client (one-time)” below.)

```bash
yarn dev:client
```

### Start individually

```bash
# web only
yarn dev:web

# mobile only (Expo Go)
yarn dev:mobile

# (inside apps/mobile)
cd apps/mobile && yarn dev
```

---

## Dev Client (one-time per platform)

Dev Client is needed if you use native modules beyond Expo Go.

```bash
cd apps/mobile
# generate native projects if needed
npx expo prebuild

# install dev client on emulator/device
npx expo run:android
npx expo run:ios
```

Then use:

```bash
yarn dev:client   # or the root script 'yarn dev:client' to run web+mobile
```

---

## Android Setup

1. **Environment variables** (add to `~/.zshrc` and reload shell):

```bash
export ANDROID_HOME="$HOME/Library/Android/sdk"
export ANDROID_SDK_ROOT="$ANDROID_HOME"
export PATH="$PATH:$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator:$ANDROID_HOME/cmdline-tools/latest/bin"
```

2. **Java 17**:

```bash
brew install openjdk@17
echo 'export JAVA_HOME=$(/usr/libexec/java_home -v 17)' >> ~/.zshrc
source ~/.zshrc
java -version
```

3. **Install SDK packages** (Apple Silicon → `arm64-v8a`, Intel → `x86_64`):

```bash
yes | sdkmanager --licenses
sdkmanager --install "platform-tools" "emulator" "platforms;android-34"
sdkmanager --install "system-images;android-34;google_apis;arm64-v8a"
# or ...;x86_64 on Intel
```

4. **Create & run an emulator (AVD)**:

```bash
avdmanager create avd -n Pixel_7_API_34 \
  -k "system-images;android-34;google_apis;arm64-v8a" -d pixel_7

$ANDROID_HOME/emulator/emulator -list-avds
$ANDROID_HOME/emulator/emulator -avd Pixel_7_API_34 -no-snapshot &
adb devices
```

---

## iOS Setup (macOS)

1. Install **Xcode** from the App Store and open it once.
2. Set Xcode developer dir & accept license:

```bash
sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
sudo xcodebuild -license accept
```

3. Install iOS Simulator in **Xcode → Settings → Platforms**.
4. Open Simulator:

```bash
open -a Simulator
```

---

## Production build (Web)

```bash
yarn workspace web build
yarn workspace web start
```

---

## Common Issues & Fixes

- **Expo asks about ports / doesn’t auto-open platforms**
  - We fix the port (`8081`) and run non-interactive in scripts. Ensure no second Metro is running.

- **`No Android connected device found…`**
  - Start an AVD in Android Studio (**Device Manager**) or connect a real device with **USB debugging**:

    ```bash
    adb devices
    ```

- **`No development build (com.avoo.mobile)…`**
  - Install a dev client:

    ```bash
    cd apps/mobile
    npx expo run:android   # and/or npx expo run:ios
    ```

- **`ENOSPC: no space left on device`** (macOS temp full)
  - Temporary workaround:

    ```bash
    mkdir -p ~/tmp/yarn
    export TMPDIR=~/tmp/yarn
    ```

  - Free space: remove old simulators, AVD snapshots, caches:

    ```bash
    xcrun simctl delete unavailable
    rm -rf ~/.android/avd/*/snapshots
    brew cleanup -s
    yarn cache clean
    ```

- **Gradle: `path may not be null or empty string. path=''`**
  - Ensure `apps/mobile/android/local.properties` contains a valid SDK path:

    ```
    sdk.dir=/Users/<you>/Library/Android/sdk
    ```

  - Avoid empty `storeFile` in release signing config (debug signing is fine for dev).

- **Android resource error** (e.g. `splashscreen_background not found`)
  - Define the color in `res/values/colors.xml` or configure splash via `expo-splash-screen` plugin in `app.config.ts`.

---

## Tips

- Start from **repo root** for parallel dev (`yarn dev`, `yarn dev:client`).
- Start from **`apps/mobile`** when you need interactive Expo commands or one-off platform runs.
- Keep emulators open before running scripts that auto-open Android/iOS.
