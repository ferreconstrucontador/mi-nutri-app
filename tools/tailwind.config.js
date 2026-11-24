/* Recompila vendor/tailwind.min.css (ver GAP.md → "Publicar una versión nueva") */
module.exports = {
  darkMode: 'class',
  content: { relative: true, files: ['../index.html'] },
  theme: { extend: {} }
};
