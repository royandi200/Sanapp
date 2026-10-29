# Bitácora SanApp

## 2026-10-28 — Preparar versión iOS 1.0.2
- Guardada en git la versión de Play 1.0.2 (versionCode 32), que solo estaba local.
- Capacitor 1.4 → 7 (core, cli, ios) y plugins nuevos: app, camera, device, preferences (antes storage), push-notifications. Se quitó @capacitor-community/fcm.
- Proyecto iOS generado desde cero (no existía en el repo): versión 1.0.2, ícono desde `resources/icon.png`, permisos de cámara/fotos, esquema `sanapp://`.
- `codemagic.yaml` para compilar, firmar y subir a TestFlight desde Windows.
- Pendiente: Apple ID de la app en `codemagic.yaml`, API key de App Store Connect en Codemagic, probar en TestFlight.
- Push en iOS no funciona (no hay APNs configurado y el backend espera tokens FCM).
- 2026-10-26: el mapa fallaba por facturación de Google Cloud desactivada en `san-app-497901`; se reactivó.
