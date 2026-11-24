# vendor/ — librerías locales de MiNutriApp

Copias exactas de las librerías que usa la app, para que funcione 100 % sin internet
(se guardan en caché con `sw.js`). No editar a mano.

| Archivo | Paquete | Versión | Licencia |
|---|---|---|---|
| `react.production.min.js` | react (UMD) | 18.3.1 | MIT |
| `react-dom.production.min.js` | react-dom (UMD) | 18.3.1 | MIT |
| `babel.min.js` | @babel/standalone | 7.24.7 | MIT |
| `lucide.min.js` | lucide (UMD) | 0.263.0 | ISC |
| `tailwind.min.css` | tailwindcss (CSS compilado desde `index.html`) | 3.4.16 | MIT |

`tailwind.min.css` contiene solo las clases que usa `index.html`. Si agregas clases nuevas,
recompílalo (ver `GAP.md`).
