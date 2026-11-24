# Ecosistema Aplicaciones GAP · Reglas de MiNutriApp

Reglas que comparten las apps publicadas en `https://ferreconstrucontador.github.io/`.
Todas viven en el mismo dominio (mismo *origen* del navegador), por eso cada app debe
aislar sus datos y sus cachés con prefijos propios.

## 1. Alojamiento y aislamiento
- PWA 100 % autónoma en **https://ferreconstrucontador.github.io/mi-nutri-app/**.
- Funciona sin internet: todas sus librerías están en `vendor/` (sin CDN).
- No comparte bases de datos con otras apps del dominio ni lee sus claves.

## 2. Prefijos únicos
| Recurso | Prefijo / nombre | Ejemplos |
|---|---|---|
| Cachés del Service Worker | `minutri-` | `minutri-v1.2.0` |
| Alcance del Service Worker | `scope: "./"` (solo `/mi-nutri-app/`) | — |
| `localStorage` | `minutriapp_*` | `minutriapp_v1`, `minutriapp_theme`, `minutriapp_activeTab` |
| `IndexedDB` | `minutriapp-db` | almacén `snapshots` (Copias internas, últimos 7 días) |

El Service Worker **solo borra cachés que empiezan con `minutri-`**; nunca toca las de otras apps.

## 3. Versionado único
- Formato `vX.Y.Z` (actual **v1.2.0**), definido en **un solo lugar**: `version.js`.
- `index.html` lo muestra al pie de **Perfil**; `sw.js` lo usa para su caché (`minutri-v1.2.0`).
- Cuando hay versión nueva aparece el aviso discreto **"Hay una versión nueva · Actualizar"**;
  la app se recarga **solo cuando el usuario lo toca**.

## 4. Diálogos propios (`mostrarDialogo`)
- Prohibido `alert()` / `confirm()` / `prompt()` del navegador.
- Encabezado limpio **MiNutriApp** (sin la URL del dominio).
- En acciones peligrosas el botón **Cancelar** va resaltado y recibe el foco.
- El mensaje dice **qué** se borra o reemplaza (fecha, nombre, cantidad).
- **Atrás**, `Esc` o tocar fuera = Cancelar.

## 5. Respaldo portátil
- Exportación/importación `.json`: `minutriapp-respaldo-YYYY-MM-DD.json`
  (menú Compartir del teléfono → Google Drive; si no se puede, se descarga).
- Aviso en la pantalla principal cada 24 h **si hubo actividad** desde el último respaldo.
- Copias internas (últimos 7 días) — *Doble Bóveda* — en `IndexedDB`.
- Botón **"🛡️ Proteger mis datos en este dispositivo"** (`navigator.storage.persist()`),
  con estado *Protegido* / *Estándar*.

---

## Estructura de archivos
```
index.html          App completa (React + JSX compilado en el navegador)
version.js          Versión única
sw.js               Service Worker (caché offline y actualizaciones)
manifest.json       Manifiesto PWA
icons/              Íconos PNG (any + maskable) y apple-touch-icon
vendor/             Librerías locales (ver vendor/README.md)
tools/              Configuración para recompilar vendor/tailwind.min.css
GAP.md              Este documento
```

## Publicar una versión nueva
1. Haz los cambios en `index.html`.
2. Si agregaste clases de Tailwind nuevas, recompila el CSS:
   ```
   npx tailwindcss@3.4.16 -c tools/tailwind.config.js -i tools/tailwind.input.css -o vendor/tailwind.min.css --minify
   ```
3. Si agregaste archivos que deban funcionar sin internet, inclúyelos en `ASSETS` de `sw.js`.
4. Sube el número en `version.js` (p. ej. `1.2.0` → `1.2.1`).
5. Publica en la rama `main`. Los usuarios verán "Hay una versión nueva · Actualizar".

## Lista de verificación
- [ ] La app abre en modo avión después de la primera visita.
- [ ] Al pie de Perfil aparece la versión correcta.
- [ ] No aparece ningún diálogo con "ferreconstrucontador.github.io dice".
- [ ] Atrás cierra ventanas/diálogos antes de cambiar de pestaña o salir.
- [ ] Los datos (`minutriapp_*`, `minutriapp-db`) siguen intactos tras actualizar.
