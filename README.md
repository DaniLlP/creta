# 🏛️ Guía Definitiva de Creta

Una guía de viaje interactiva de una sola página (HTML/CSS/JS puro, sin frameworks) para la isla de Creta, Grecia — escrita en español.

**[Ver la guía en vivo](#)** ← una vez publiques con GitHub Pages (instrucciones abajo), el enlace será `https://TU-USUARIO.github.io/NOMBRE-DEL-REPO/`

## Qué incluye

- Playas curadas con filtros por región y tipo, con mapas de Google Maps integrados
- Guía gastronómica: platos tradicionales + restaurantes reales en Chania, Rétino y Heraclión
- Senderismo, running y deportes, con tablas de distancia/desnivel/dificultad
- Vida nocturna por zona, cultura e historia (línea de tiempo minoica → veneciana → otomana → moderna)
- Patrimonio UNESCO actualizado (incluye la inscripción de julio de 2025 de los centros palaciales minoicos)
- Rincones ocultos, guía de fotografía (incluida la normativa de drones)
- Guía práctica, compras, clima interactivo por mes y calculadora de presupuesto
- Griego de supervivencia con pronunciación por voz del navegador (Web Speech API)
- Itinerarios de 3/5/7/10 días
- Modo claro/oscuro, búsqueda global, favoritos, y diseño responsive completo

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
