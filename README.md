# 🏛️ Guía Definitiva de Creta

Una guía de viaje interactiva de una sola página (HTML/CSS/JS puro, sin frameworks) para la isla de Creta, Grecia — escrita en español.

**[Ver la guía en vivo](#)** ← una vez publiques con GitHub Pages (instrucciones abajo), el enlace será `https://TU-USUARIO.github.io/NOMBRE-DEL-REPO/`

## Qué incluye

- Playas curadas con filtros por región y tipo, con mapas de Google Maps integrados
- **Condiciones del mar en directo** (oleaje, temperatura, viento) para 5 puntos de la costa, vía Open-Meteo — sin API key
- **Fauna y vida marina**: cabra kri-kri, foca monje, tortuga boba, delfines, aves rapaces y más
- **En barco**: dónde alquilar y qué destinos solo se ven (o se ven mejor) desde el agua — Balos, Dia, Chrissi, Spinalonga, Gavdos…
- Guía gastronómica: platos tradicionales (tarjetas volteables, marcables como probados) + restaurantes reales en Chania, Rétino y Heraclión
- Senderismo, running y deportes, con tablas de distancia/desnivel/dificultad
- Vida nocturna por zona, cultura e historia ampliada (línea de tiempo minoica → árabe → veneciana → otomana → moderna)
- Rincones ocultos con tarjetas volteables marcables como visitados
- **Seguimiento personal**: marca platos/rincones como probados o visitados, puntúa 1–5 estrellas y añade una reseña corta — guardado en tu navegador (cajón "Mi diario de Creta")
- Patrimonio UNESCO actualizado (incluye la inscripción de julio de 2025 de los centros palaciales minoicos)
- Guía de fotografía (incluida la normativa de drones)
- Guía práctica, compras, clima interactivo por mes y calculadora de presupuesto
- Griego de supervivencia con pronunciación por voz del navegador (Web Speech API)
- Itinerarios de 3/5/7/10 días
- Modo claro/oscuro, búsqueda global, favoritos, y diseño responsive completo

## Sobre el seguimiento personal (probado/visitado + valoraciones)

Se guarda con `localStorage` **y**, si activas Supabase (ver abajo), también en la nube — sincronizado entre tus dispositivos y visible para quien tenga tu enlace de perfil.

## Activar cuentas, sincronización y compartir con amigos (Supabase)

1. Crea un proyecto gratis en [supabase.com](https://supabase.com).
2. En **SQL Editor → New query**, pega el contenido de `schema.sql` (incluido en este repo) y ejecútalo. Esto crea las tablas `profiles` y `reviews` con las políticas de seguridad (RLS) correctas: cada usuario solo puede editar sus propios datos, pero todos son visibles públicamente para que tus amigos puedan verlos.
3. **Importante — edita la plantilla de email:** ve a **Authentication → Email Templates → Magic Link** y añade `{{ .Token }}` en algún punto del cuerpo del correo (por ejemplo: `Tu código de acceso es: {{ .Token }}`). Por defecto, Supabase solo pone un botón de enlace en ese email — sin este cambio, el código de 6 dígitos que la app pide nunca aparecerá en el correo.
4. En **Settings → API**, copia el **Project URL** y la clave **anon/public**.
5. Abre `index.html`, busca estas dos líneas cerca de "SUPABASE" y sustitúyelas:
   ```js
   const SUPABASE_URL = "TU_SUPABASE_URL";
   const SUPABASE_ANON_KEY = "TU_SUPABASE_ANON_KEY";
   ```
6. Sube el archivo actualizado a GitHub. Listo — el botón de favoritos ahora mostrará un inicio de sesión por email (enlace mágico, sin contraseña), y una vez dentro podrás elegir un nombre de usuario, ver tu enlace para compartir (`?perfil=tu-usuario`) y buscar el diario de un amigo por su nombre de usuario en la pestaña "Amigos".

**Cómo funciona el compartir:** perfiles públicos por nombre de usuario (para poder encontrar a alguien y enviarle una solicitud), pero las reseñas ya no son visibles para cualquiera — hace falta una amistad aceptada por las dos partes. Busca el nombre de usuario de tu amigo/a en la pestaña "Amigos", pulsa "Enviar solicitud"; cuando lo acepte, verás su diario ahí mismo. Compartir tu enlace (`?perfil=tu-usuario`) le lleva directo a la pantalla de solicitud si aún no sois amigos.

**Por qué un código de 6 dígitos y no un enlace mágico:** si añades la web a la pantalla de inicio del iPhone ("Añadir a pantalla de inicio"), iOS trata ese icono como una app aislada, con su propio almacenamiento — completamente separado de Safari. Un enlace de email siempre se abre en Safari, nunca dentro del icono de la pantalla de inicio, así que la sesión que se crea al tocar el enlace queda "atrapada" en Safari y el icono de tu pantalla de inicio nunca se entera. Por eso la app pide un código de 6 dígitos en vez de un enlace: lo escribes directamente donde lo pediste, sin salir nunca de la app, y funciona igual en Safari normal, en el icono de pantalla de inicio o en cualquier otro navegador.


## Cómo verla

**Opción 1 — Abrir directamente:** descarga `index.html` y ábrelo en cualquier navegador. Todo funciona offline excepto los mapas de Google embebidos (necesitan internet).

**Opción 2 — GitHub Pages (recomendado para compartir el enlace):**

```bash
git remote add origin https://github.com/TU-USUARIO/NOMBRE-DEL-REPO.git
git push -u origin main
```

Luego en GitHub: **Settings → Pages → Source → Deploy from branch → main → / (root)**. En un par de minutos tu guía estará en `https://TU-USUARIO.github.io/NOMBRE-DEL-REPO/`.

## Estructura

```
.
├── index.html   ← la guía completa (HTML + CSS + JS embebidos, un solo archivo)
├── README.md
└── LICENSE
```

Todo el contenido (CSS, JavaScript, HTML) vive en un único archivo a propósito, tal y como se pidió originalmente — sin build step, sin dependencias que instalar. Las únicas llamadas externas en tiempo de ejecución son: Google Fonts, Font Awesome (CDN), y los `<iframe>` de Google Maps.

## Fuentes y método

El contenido se redactó de forma original a partir de una investigación cruzada entre Visit Greece, Explore Crete, Wikivoyage, UNESCO, la Autoridad de Aviación Civil Helénica, foros de Reddit y TripAdvisor, reseñas agregadas de Google Places, y guías locales especializadas — nunca copiado de una sola fuente. La bibliografía completa está en el pie de página de la propia guía.

**⚠️ Antes de viajar:** horarios, precios y accesos cambian con frecuencia (la Garganta de Samaria, por ejemplo, ha tenido cierres imprevistos en 2026). Verifica siempre la información crítica en la fuente oficial antes de tu viaje.

## Personalizar

- Las fotos son gradientes + iconos a propósito (evita imágenes rotas o con derechos de autor). Para poner fotos reales, sustituye el `background:` de `.dc-photo` / `.hero` por tus propias imágenes.
- Todos los datos (playas, restaurantes, rutas, frases…) están en el objeto `CRETE_DATA` al principio del `<script>` — añadir o editar una entrada no requiere tocar el HTML ni el CSS.

---

*Construido con investigación asistida por IA (Claude, Anthropic) sobre fuentes públicas verificadas. Proyecto personal sin fines comerciales.*
