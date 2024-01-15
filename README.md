<h1 align="center">
  <br>
  <img
    src="https://github.com/skyportal/skyportal-mobile/raw/main/assets/images/icon.png"
    alt="SkyPortal Logo"
    width="100px"
  />
  <br>
  SkyPortal Mobile
  <br>
</h1>

<h2 align="center">
An Astronomical Data Platform
</h2>

<p>
  <span style="font-size: 180%;">
  Please see the <a href="https://skyportal.io">project homepage</a> for more information about the web application.
  </span>
</p>

## Installation & Usage

SkyPortal Mobile relies on <a href="https://docs.expo.dev/">Expo</a> for building the mobile app. Installation and local development is relatively easy:

```
npm install
npx expo start
```

If you want to check a build in production-like settings, you should use:

```
npx expo start --no-dev --minify
```

## Debugging package issues

Expo runs into package versioning issues sometimes. The easiest way to fix this is to run:

```
npx expo install --fix
```

and then commit the resulting package.json file.

## Production builds

SkyPortal Mobile relies on <a href="https://docs.expo.dev/build/introduction/">EAS Build</a> for production builds.

```
eas build
```
