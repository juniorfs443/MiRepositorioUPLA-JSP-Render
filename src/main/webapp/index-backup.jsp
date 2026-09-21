<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Repositorio académico UPLA">
  <title>Repositorio Académico | UPLA</title>
  <link rel="stylesheet" href="<%= request.getContextPath() %>/css/styles.css">
</head>
<body>
  <div class="top-strip">
    <div class="wrap top-strip__inner">
      <span>Repositorio Académico</span>
      <div class="top-actions">
        <span id="userState">Invitado</span>
        <button id="loginTopBtn" class="top-btn">Iniciar sesión</button>
        <button id="logoutTopBtn" class="top-btn hidden">Cerrar sesión</button>
      </div>
    </div>
  </div>

  <header class="site-header">
    <div class="wrap site-header__inner">
      <a class="brand" href="#inicio">
        <div class="brand-mark">U</div>
        <div>
          <strong>UPLA</strong>
          <span>Universidad Peruana Los Andes</span>
        </div>
      </a>

      <button class="menu-toggle" id="menuToggle">Menú</button>

      <nav class="main-nav" id="mainNav">
        <a href="#inicio" data-route="inicio">Inicio</a>
        <a href="#semanas" data-route="semanas">Semanas</a>
        <a href="#actividades" data-route="actividades">Actividades</a>
        <a href="#perfil" data-route="perfil">Perfil</a>
        <a href="#administrar" data-route="administrar" class="admin-link hidden">Administrar</a>
      </nav>
    </div>
  </header>

  <main id="app"></main>

  <footer class="site-footer wrap">
    <div>
      <strong>Mi Repositorio Académico</strong>
      <span>Ingeniería de Sistemas y Computación</span>
    </div>
    <p>Aplicación JSP publicada con Tomcat y Supabase.</p>
  </footer>

  <div id="authModal" class="modal">
    <div class="modal-card">
      <div class="modal-head">
        <div>
          <span class="eyebrow">Acceso</span>
          <h2>Iniciar sesión</h2>
        </div>
        <button id="closeAuth" class="close-btn">Cerrar</button>
      </div>

      <form id="loginForm" class="form-stack">
        <label>
          Correo
          <input id="loginEmail" type="email" required placeholder="correo@ejemplo.com">
        </label>
        <label>
          Contraseña
          <input id="loginPassword" type="password" required placeholder="Tu contraseña">
        </label>
        <button class="btn primary" type="submit">Ingresar</button>
      </form>

      <p id="authMessage" class="form-message"></p>
    </div>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
  <script src="<%= request.getContextPath() %>/js/config.js"></script>
  <script src="<%= request.getContextPath() %>/js/app.js"></script>
</body>
</html>
