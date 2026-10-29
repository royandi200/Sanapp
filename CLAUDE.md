# SanApp

App Ionic React + Capacitor 7 (Android `io.san.app`, iOS `io.san.appios`). Web en `src/`, se compila a `build/`.

- Compilar web: `NODE_OPTIONS=--openssl-legacy-provider npx react-scripts build` (react-scripts 3 con Node 22).
- iOS se compila en Codemagic (`codemagic.yaml`), no hay Mac local.
- Android sigue en Capacitor 2.4.8: antes de otra versión en Play hay que migrar `android/` a Capacitor 7.
- Bitácora: `docs/BITACORA.md`.
