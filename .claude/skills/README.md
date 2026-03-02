# Claude Code Skills - BookingIncatrail

Este directorio contiene skills personalizados para Claude Code que te ayudan con tareas específicas del proyecto.

## 📋 Skills Disponibles

### 1. **seo-optimizer**
Especialista en SEO para la plataforma BookingIncatrail

**Cuándo usarlo:**
- Optimizar meta tags de páginas
- Analizar keywords para tours
- Mejorar schema markup
- SEO bilingüe (ES/EN)
- Optimización para motores de búsqueda en turismo

**Cómo invocarlo:**
```bash
# Opción 1: Comando directo
/seo-optimizer

# Opción 2: Mención en tu mensaje
"Analiza el SEO de esta página"
"Optimiza los meta tags según SEO"
"usa la skill seo-optimizer para revisar esto"
```

**Ejemplo:**
```
Usuario: Analiza el SEO de la página de Inca Trail
Claude: [Usa automáticamente el skill seo-optimizer]
```

---

### 2. **frontend-design**
Diseñador de interfaces frontend de alta calidad

**Cuándo usarlo:**
- Crear componentes web
- Diseñar páginas completas
- Mejorar estética de interfaces
- Evitar diseños genéricos
- Crear experiencias visuales memorables

**Cómo invocarlo:**
```bash
# Opción 1: Comando directo
/frontend-design

# Opción 2: Mención en tu mensaje
"Diseña un componente de hero section"
"Crea una página de contacto con diseño único"
"build a tour card component"
```

**Ejemplo:**
```
Usuario: Crea un componente de tarjeta de tour con diseño llamativo
Claude: [Usa automáticamente el skill frontend-design]
```

---

## 🚀 Cómo Funcionan los Skills

Los skills son **prompts especializados** que le dan a Claude contexto experto para tareas específicas.

**Invocación Automática:**
Claude detecta automáticamente cuándo usar un skill basándose en:
- Comandos slash (`/skill-name`)
- Palabras clave en tu mensaje
- Contexto de la conversación

**Ejemplo de flujo:**
```
1. Tú: "Necesito optimizar el SEO de la página de Machu Picchu"
2. Claude detecta: "SEO" → Activa skill seo-optimizer
3. Claude responde con análisis SEO experto
```

---

## 📝 Crear Nuevos Skills

Para agregar un nuevo skill:

1. Crea un archivo `.md` en este directorio
2. Agrega frontmatter YAML con:
   - `name`: nombre-del-skill (lowercase, con guiones)
   - `description`: descripción clara de qué hace
3. Escribe las instrucciones del skill

**Plantilla:**
```yaml
---
name: mi-skill
description: Breve descripción de qué hace este skill
---

# Mi Skill

Instrucciones detalladas para Claude...
```

---

## ✅ Verificar que un Skill Funciona

```bash
# Listar skills disponibles
ls -la .claude/skills/

# Ver contenido de un skill
cat .claude/skills/seo-optimizer.md

# Probar invocación
# En chat con Claude, escribe:
/seo-optimizer
```

---

## 🐛 Troubleshooting

**Problema:** El skill no se activa
- ✅ Verifica que el archivo tenga extensión `.md`
- ✅ Verifica que el frontmatter esté bien formado (con `---`)
- ✅ Verifica que `name:` use kebab-case (guiones, sin espacios)
- ✅ Reinicia la sesión de Claude Code

**Problema:** Error al invocar
- ✅ Usa el nombre exacto del skill: `/seo-optimizer` (no `/SEO-Optimizer`)
- ✅ Verifica que no haya typos en el nombre

---

## 📚 Recursos

- [Claude Code Documentation](https://docs.anthropic.com/claude/docs)
- [Skills Best Practices](https://docs.anthropic.com/claude/docs/skills)

---

**Última actualización:** 18 Enero 2026
