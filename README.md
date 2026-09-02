# Boda Marcel & Inés — Invitación digital

Invitación web para la boda de Marcel e Inés.

- **Fecha**: viernes 27 de noviembre de 2026
- **Acto civil**: 5:00 PM · **Cena**: 7:00 PM
- **Lugar**: Vino Mundo, Ciudad Colón (botones de Waze y Google Maps)
- **Aporte**: ₡40.000 por persona, en dos tractos (15 set reserva el cupo, 15 oct pago total)
- **Save the Date**: `savethedate.mp4` (720×1280, 9.3 MB, comprimido del original de 86 MB) es el
  video hero de la invitación; se encoge cinematográficamente con el scroll (sticky + scale)
- **RSVP**: cierra el 15 de septiembre de 2026 — se guarda en Supabase (`boda_marcel_ines_rsvps`)
- **Panel de novios**: `panel-login.html` (ver credenciales en `RSVP_SETUP.md`)

## Pendientes

- [x] `cancion.mp3` ya es City of Stars (La La Land).
- [x] `venue-civil.jpg` y `venue-cena.jpg` ya son fotos reales de Vino Mundo (640px, tamaño de render).
- [x] `novios-6.jpg` (hero) ya tiene una foto real de prueba de los novios, con filtro cálido vía CSS.
- [ ] Reemplazar las fotos placeholder `novios-1.jpg` … `novios-5.jpg` y `novios-7.jpg` por fotos reales
      (mismos nombres de archivo; verticales 3:4, la 7 cuadrada). Confirmar si la foto del hero es la final.
- [ ] Regenerar `og-image.jpg` con foto real (1200×630) para la vista previa de WhatsApp.
- [ ] Confirmar que el aporte de ₡40.000 también se paga al SINPE de Marcel (6072-0983); hoy la
      invitación lo asume así.
- [ ] Actualizar las URLs canónicas/OG en `index.html` e `invitation.html` cuando exista el dominio
      final del deploy.

## Desarrollo local

Servir la carpeta como sitio estático, por ejemplo:

```
npx serve . -l 4173
```
