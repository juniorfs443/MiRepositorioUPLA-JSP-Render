# Mi Repositorio Académico UPLA — JSP + Supabase + Render

Esta versión cumple con el requisito de **no usar archivos `.html`**. La vista principal es `index.jsp`.

## Qué incluye

- JSP + Tomcat.
- Diseño tipo intranet UPLA.
- 16 semanas.
- Inicio de sesión con Supabase.
- Edición de nombre, carrera, descripción y foto.
- Subida y eliminación de archivos por semana.
- Visualización pública de materiales.
- Dockerfile listo para un hosting compatible con contenedores como Render.

## 1. Configurar Supabase

1. Crea un proyecto en Supabase.
2. En **SQL Editor**, ejecuta `supabase-setup.sql`.
3. En **Authentication > Users**, crea tu usuario para iniciar sesión.
4. Copia el **Project URL** y la **anon/public key**.
5. Abre `src/main/webapp/js/config.js` y reemplaza los valores de ejemplo.

Usa solamente la clave `anon/public`. **Nunca subas la `service_role` key a GitHub.**

## 2. Ejecutar localmente con Tomcat

Desde la carpeta del proyecto:

```powershell
mvn clean package
```

Se crea:

```text
target/MiRepositorioUPLA.war
```

Puedes copiar ese WAR a la carpeta `webapps` de Tomcat. Si lo renombras a `ROOT.war`, se abrirá directamente en `http://localhost:8080/`.

## 3. Subir a GitHub

Sube la carpeta completa del proyecto. `target/` y los `.war` ya están excluidos mediante `.gitignore`.

## 4. Publicar con Render

1. En Render crea un **Web Service**.
2. Conecta tu repositorio de GitHub.
3. Elige despliegue mediante **Docker**.
4. Render usará el `Dockerfile` incluido.
5. Al terminar, recibirás una URL pública.

El Dockerfile copia el WAR como `ROOT.war`, así que la aplicación abre en la raíz del dominio y no muestra `/MiRepositorioUPLA` en la URL.

## Estructura

```text
MiRepositorioUPLA-JSP-Render/
├── pom.xml
├── Dockerfile
├── render.yaml
├── supabase-setup.sql
├── README.md
└── src/main/webapp/
    ├── index.jsp
    ├── css/styles.css
    ├── js/app.js
    ├── js/config.js
    └── WEB-INF/web.xml
```

No contiene ningún archivo `.html`.
