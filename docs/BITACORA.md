# BitÃ¡cora SanApp

## 2026-10-28 â€” Preparar versiÃ³n iOS 1.0.2
- Guardada en git la versiÃ³n de Play 1.0.2 (versionCode 32), que solo estaba local.
- Capacitor 1.4 â†’ 7 (core, cli, ios) y plugins nuevos: app, camera, device, preferences (antes storage), push-notifications. Se quitÃ³ @capacitor-community/fcm.
- Proyecto iOS generado desde cero (no existÃ­a en el repo): versiÃ³n 1.0.2, Ã­cono desde `resources/icon.png`, permisos de cÃ¡mara/fotos, esquema `sanapp://`.
- `codemagic.yaml` para compilar, firmar y subir a TestFlight desde Windows.
- Pendiente: Apple ID de la app en `codemagic.yaml`, API key de App Store Connect en Codemagic, probar en TestFlight.
- Push en iOS no funciona (no hay APNs configurado y el backend espera tokens FCM).
- 2026-10-26: el mapa fallaba por facturaciÃ³n de Google Cloud desactivada en `san-app-497901`; se reactivÃ³.

## 2026-10-29 — iOS 2.0.1 enviada a revisión de Apple
- App en App Store Connect: id 1518314483, bundle `io.san.appios` (no `io.san.app`). Ya había 2.0 publicada.
- Firma en Codemagic: certificado «SanApp dist» y perfil «SanApp AppStore» (Settings → Code signing identities). Llave API «SanApp ASC».
- Número de build = fecha/hora Bogotá (`yyMMddHHmm`); la consulta a ASC devolvía uno repetido.
- Compilación 2610290039 enviada a revisión el 29 oct 2026, 0:54.
- Pendiente: datos de prueba de TestFlight (correo de comentarios y contacto) para que el paso «App Store distribution» no falle; unir la rama `ios-appstore` a `main` cuando Apple apruebe.
