# BitÃ¡cora SanApp

## 2026-10-28 â€” Preparar versiÃ³n iOS 1.0.2
- Guardada en git la versiÃ³n de Play 1.0.2 (versionCode 32), que solo estaba local.
- Capacitor 1.4 â†’ 7 (core, cli, ios) y plugins nuevos: app, camera, device, preferences (antes storage), push-notifications. Se quitÃ³ @capacitor-community/fcm.
- Proyecto iOS generado desde cero (no existÃ­a en el repo): versiÃ³n 1.0.2, Ã­cono desde `resources/icon.png`, permisos de cÃ¡mara/fotos, esquema `sanapp://`.
- `codemagic.yaml` para compilar, firmar y subir a TestFlight desde Windows.
- Pendiente: Apple ID de la app en `codemagic.yaml`, API key de App Store Connect en Codemagic, probar en TestFlight.
- Push en iOS no funciona (no hay APNs configurado y el backend espera tokens FCM).
- 2026-10-26: el mapa fallaba por facturaciÃ³n de Google Cloud desactivada en `san-app-497901`; se reactivÃ³.
