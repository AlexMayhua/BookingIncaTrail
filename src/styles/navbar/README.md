# Navbar Styles

## Archivo Único Consolidado

```
src/styles/navbar/
└── navbar.css (77KB, 3,347 líneas)
```

**Incluye:**
- Estilos base del navbar
- Sistema completo de mega menú editorial
- Media queries responsive

## Importado en

```css
/* globals.css */
@import url("./navbar/navbar.css");
```

## Estilos Aplicados del Mega Menú

✅ Grid: 380px (servicios) | 280px (descripción) | flexible (imagen)
✅ Servicios usan todo el ancho disponible (380px)
✅ Descripción con padding-left: 63px
✅ Nombres completos sin truncado
✅ Estados hover y active con feedback visual completo
