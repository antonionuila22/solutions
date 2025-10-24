# 📋 Configuración de Netlify Forms - Guía Completa

Esta guía te ayudará a configurar el nuevo formulario de contacto que funciona con **Netlify Forms** en lugar de Resend.

## ✨ Características del Nuevo Formulario

### ✅ Ventajas sobre el Formulario Anterior

1. **Sin dependencia de servicios externos** - No necesita Resend API
2. **Gratis hasta 100 submissions/mes** - Planes gratuitos de Netlify
3. **Más seguro** - Netlify maneja la seguridad automáticamente
4. **Anti-spam integrado** - Honeypot + verificación de Netlify
5. **Notificaciones por email** - Configurables desde el dashboard
6. **Exportación de datos** - Descarga submissions en CSV/JSON
7. **Campo de Industria** - Nuevo selector con 10+ industrias
8. **Validación mejorada** - Validación client-side y server-side
9. **Mejor UX** - Contador de caracteres, estados de validación visual
10. **Opcional Turso DB** - Guarda también en tu propia base de datos

---

## 🚀 Pasos de Configuración

### 1. Archivos Creados

Los siguientes archivos han sido creados en tu proyecto:

```
📁 Proyecto
├── 📄 src/pages/contact-netlify.astro       # Nuevo formulario
├── 📄 netlify/functions/contact-submission.ts # Función opcional para Turso DB
├── 📄 netlify.toml                           # Configuración de Netlify
└── 📄 NETLIFY_FORMS_SETUP.md                 # Esta guía
```

---

### 2. Configuración en Netlify Dashboard

#### A) Deploy tu sitio
```bash
# Hacer commit de los cambios
git add .
git commit -m "Add Netlify Forms with industry field"
git push

# Netlify detectará automáticamente el formulario durante el build
```

#### B) Habilitar Netlify Forms

1. Ve a tu sitio en **Netlify Dashboard**
2. Ve a **Site Settings** > **Forms**
3. Verifica que "Form detection" esté habilitado ✅
4. Después del build, deberías ver el formulario `contact-netlify` listado

#### C) Configurar Notificaciones por Email (OPCIONAL)

Para recibir un email cada vez que alguien envíe el formulario:

1. Ve a **Site Settings** > **Forms** > **Form notifications**
2. Click en **"Add notification"**
3. Selecciona **"Email notification"**
4. Ingresa el email donde quieres recibir notificaciones
5. Selecciona el formulario: `contact-netlify`
6. Guarda

📧 Ahora recibirás un email cada vez que alguien envíe el formulario.

---

### 3. Configurar Variables de Entorno (Para Turso DB - OPCIONAL)

Si quieres **también** guardar los datos en Turso DB:

1. Ve a **Site Settings** > **Environment variables**
2. Agrega las siguientes variables:
   ```
   TURSO_DATABASE_URL=libsql://tu-base-de-datos.turso.io
   TURSO_AUTH_TOKEN=tu-token-secreto
   ```

---

### 4. Configurar Webhook para Turso DB (OPCIONAL)

Para que los datos se guarden automáticamente en Turso DB:

1. Ve a **Site Settings** > **Forms** > **Form notifications**
2. Click en **"Add notification"**
3. Selecciona **"Outgoing webhook"**
4. Ingresa la URL: `https://tu-sitio.netlify.app/.netlify/functions/contact-submission`
5. Selecciona el formulario: `contact-netlify`
6. Event to listen for: **"Form submission"**
7. Guarda

---

## 🔒 Medidas de Seguridad Implementadas

### 1. **Honeypot Anti-Spam**
```html
<!-- Campo oculto que los bots llenan automáticamente -->
<input name="bot-field" style="display:none" />
```
- ✅ Los bots lo llenan automáticamente
- ✅ Netlify rechaza submissions que tengan este campo lleno

### 2. **Validación Client-Side**
```javascript
// Validación de email con regex
pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"

// Longitud mínima/máxima
minlength="2" maxlength="100"

// Verificación de servicios seleccionados
At least 1 service must be selected
```

### 3. **Validación Server-Side**
```typescript
// En la función de Netlify
- Sanitización de HTML para prevenir XSS
- Validación de formato de email
- Verificación de campos requeridos
- Detección de duplicados (mismo email en 1 hora)
```

### 4. **Rate Limiting**
```typescript
// Netlify Forms incluye rate limiting automático:
- Máximo 100 submissions/mes (plan gratuito)
- Protección contra spam automático
- Bloqueo de IPs sospechosas
```

### 5. **Headers de Seguridad**
```toml
# En netlify.toml
X-Frame-Options = "DENY"
X-XSS-Protection = "1; mode=block"
X-Content-Type-Options = "nosniff"
```

---

## 📊 Ver Submissions Recibidas

### En Netlify Dashboard:

1. Ve a tu sitio en Netlify
2. Click en **"Forms"** en el menú lateral
3. Verás todas las submissions con:
   - Fecha y hora
   - Email del remitente
   - Todos los campos del formulario
   - IP address (para detectar spam)

### Exportar Datos:

1. Click en **"Export"** en la página de Forms
2. Selecciona formato: CSV o JSON
3. Descarga el archivo

---

## 🎨 Campos del Formulario

| Campo | Tipo | Required | Validación |
|-------|------|----------|------------|
| **Name** | Text | ✅ | 2-100 caracteres |
| **Email** | Email | ✅ | Formato válido |
| **Phone** | Tel | ✅ | Números, +, -, (), espacios |
| **Industry** | Select | ✅ | Una de las 10+ opciones |
| **Subject** | Text | ✅ | 3-200 caracteres |
| **Message** | Textarea | ✅ | 10-2000 caracteres |
| **Services** | Checkbox | ✅ | Al menos 1 seleccionado |

### Industrias Disponibles:
- Automotive
- Construction
- Content Creators
- E-commerce
- Fitness
- Healthcare
- Law Firms
- Real Estate
- Restaurants
- Travel Agency
- Other

---

## 🧪 Testing

### Probar Localmente:

```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Ejecutar localmente con Netlify Dev
netlify dev

# El formulario estará disponible en:
http://localhost:8888/contact-netlify
```

### Probar en Producción:

1. Visita tu sitio: `https://tu-sitio.netlify.app/contact-netlify`
2. Llena el formulario con datos de prueba
3. Envía el formulario
4. Verifica en Netlify Dashboard > Forms que la submission aparezca
5. Si configuraste email, verifica tu inbox

---

## 🆚 Comparación: Formulario Anterior vs Nuevo

| Característica | Anterior (Resend) | Nuevo (Netlify Forms) |
|---------------|-------------------|----------------------|
| **Costo** | $20/mes después de 100 emails | Gratis hasta 100/mes |
| **Configuración** | Requiere API key | Automático |
| **Seguridad** | Manual | Automática + Manual |
| **Spam Protection** | Solo honeypot | Honeypot + Netlify filter |
| **Email Notifications** | Programático | Dashboard UI |
| **Data Export** | Manual desde DB | CSV/JSON desde dashboard |
| **Campo Industria** | ❌ | ✅ |
| **Validación Visual** | Básica | Avanzada |
| **Contador Caracteres** | ❌ | ✅ |

---

## 📝 Próximos Pasos Recomendados

### 1. **Personalizar Email de Notificación**
Por defecto, Netlify envía un email básico. Para personalizarlo:
- Considera usar un servicio como Zapier o Make.com
- Conecta Netlify Forms con estos servicios vía webhook
- Crea plantillas de email personalizadas

### 2. **Agregar Analytics**
```javascript
// Track form submissions
gtag('event', 'form_submission', {
  'form_name': 'contact-netlify',
  'industry': selectedIndustry
});
```

### 3. **Implementar reCAPTCHA (Opcional)**
Si recibes mucho spam:
```html
<div data-netlify-recaptcha="true"></div>
```

### 4. **Auto-respuesta al Usuario**
Configura un webhook que envíe un email de confirmación al usuario.

---

## 🐛 Troubleshooting

### ❌ El formulario no aparece en Netlify Dashboard

**Solución:**
1. Verifica que `data-netlify="true"` esté en el `<form>`
2. Haz rebuild del sitio
3. Verifica que el build haya sido exitoso
4. El formulario debe existir en el sitio publicado (no en draft)

### ❌ No recibo emails de notificación

**Solución:**
1. Verifica que configuraste el email en Form notifications
2. Revisa tu carpeta de SPAM
3. Verifica que el email esté verificado en Netlify

### ❌ La función de Turso DB no se ejecuta

**Solución:**
1. Verifica que las variables de entorno estén configuradas
2. Revisa los logs en Netlify Functions
3. Verifica que el webhook esté configurado correctamente

### ❌ Error: "Form not found"

**Solución:**
1. El atributo `name` del form debe coincidir con `form-name`
2. Debe ser exactamente: `contact-netlify`

---

## 📚 Recursos Adicionales

- [Netlify Forms Documentation](https://docs.netlify.com/forms/setup/)
- [Netlify Functions Documentation](https://docs.netlify.com/functions/overview/)
- [Spam Filtering](https://docs.netlify.com/forms/spam-filters/)
- [Form Notifications](https://docs.netlify.com/forms/notifications/)

---

## 🎉 Conclusión

Has configurado exitosamente un formulario moderno, seguro y sin dependencias externas usando Netlify Forms. El formulario incluye:

✅ Campo de industria personalizado
✅ Validación avanzada client-side y server-side
✅ Protección anti-spam
✅ Notificaciones por email
✅ Guardado opcional en Turso DB
✅ Exportación de datos fácil
✅ Sin costos adicionales (hasta 100 submissions/mes)

**¡Tu formulario está listo para recibir contactos! 🚀**

---

## 💡 Preguntas Frecuentes

**Q: ¿Puedo usar ambos formularios (el viejo y el nuevo)?**
A: Sí, puedes mantener ambos y elegir cuál usar en cada página.

**Q: ¿Qué pasa si supero 100 submissions/mes?**
A: Netlify ofrece planes pagos desde $19/mes con submissions ilimitadas.

**Q: ¿Los datos se guardan automáticamente?**
A: Sí, Netlify guarda todas las submissions en su dashboard. Opcionalmente puedes guardar en Turso DB también.

**Q: ¿Es seguro?**
A: Sí, Netlify Forms incluye protección anti-spam, rate limiting, y headers de seguridad.

**Q: ¿Puedo personalizar el email de notificación?**
A: Netlify envía un email básico. Para personalizar, usa un webhook + servicio de email externo.

---

**Creado con** ❤️ **por Codebrand**
