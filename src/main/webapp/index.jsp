<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Sistema de Repositorio Académico UPLA">
  <title>Repositorio Académico | UPLA</title>

  <!-- FontAwesome para iconos de dashboard -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <!-- Fuente Inter para acabado profesional -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">

  <link rel="stylesheet" href="<%= request.getContextPath() %>/css/styles.css">
</head>
<body>

  <div class="app-layout">

    <!-- SIDEBAR NAVEGACIÓN -->
    <aside class="sidebar" id="sidebar">
      <div class="sidebar-header">
        <a class="brand" href="#inicio" data-route="inicio">
          <div class="brand-mark">U</div>
          <div class="brand-info">
            <strong>UPLA</strong>
            <span>Repositorio Académico</span>
          </div>
        </a>
        <button class="menu-toggle" id="menuToggle"><i class="fa-solid fa-bars"></i></button>
      </div>

      <div class="sidebar-user-card">
        <div class="user-avatar">
          <i class="fa-solid fa-user-graduate"></i>
        </div>
        <div class="user-info">
          <span class="user-name" id="userState">Invitado</span>
          <span class="user-role">Ing. de Sistemas</span>
        </div>
      </div>

      <nav class="sidebar-nav main-nav" id="mainNav">
        <div class="menu-label">PRINCIPAL</div>
        <a href="#inicio" data-route="inicio" class="nav-link active">
          <i class="fa-solid fa-chart-pie"></i>
          <span>Inicio</span>
        </a>
        <a href="#semanas" data-route="semanas" class="nav-link">
          <i class="fa-solid fa-calendar-week"></i>
          <span>Semanas</span>
        </a>
        <a href="#actividades" data-route="actividades" class="nav-link">
          <i class="fa-solid fa-list-check"></i>
          <span>Actividades</span>
        </a>
        <a href="#perfil" data-route="perfil" class="nav-link">
          <i class="fa-solid fa-address-card"></i>
          <span>Perfil</span>
        </a>

        <div class="menu-label admin-link hidden">ADMINISTRACIÓN</div>
        <a href="#administrar" data-route="administrar" class="nav-link admin-link hidden">
          <i class="fa-solid fa-sliders"></i>
          <span>Administrar</span>
        </a>
      </nav>

      <div class="sidebar-footer">
        <button id="loginTopBtn" class="top-btn btn-auth">
          <i class="fa-solid fa-right-to-bracket"></i> <span>Iniciar sesión</span>
        </button>
        <button id="logoutTopBtn" class="top-btn btn-auth hidden">
          <i class="fa-solid fa-right-from-bracket"></i> <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>

    <!-- ÁREA PRINCIPAL -->
    <div class="main-wrapper">

      <!-- TOPBAR SUPERIOR -->
      <header class="topbar">
        <div class="topbar-left">
          <button class="mobile-toggle" id="btnToggleMobile">
            <i class="fa-solid fa-bars"></i>
          </button>
          <div class="topbar-title">
            <h2>Sistema de Gestión Académica</h2>
            <p>Universidad Peruana Los Andes — Facultad de Ingeniería</p>
          </div>
        </div>
        <div class="topbar-right">
          <div class="status-badge online">
            <span class="dot"></span>
            <span>Tomcat & Supabase Activo</span>
          </div>
        </div>
      </header>

      <!-- CONTENEDOR DINÁMICO SPA (DONDE JS RENDERIZA TODO) -->
      <main id="app" class="content-body"></main>

      <footer class="site-footer">
        <div>
          <strong>Mi Repositorio Académico UPLA</strong>
          <span>Ingeniería de Sistemas y Computación</span>
        </div>
        <p>Aplicación JSP publicada con Tomcat y Supabase.</p>
      </footer>

    </div>
  </div>

  <!-- MODAL DE AUTENTICACIÓN (MANTIENE TUS IDS ORIGINALES) -->
  <div id="authModal" class="modal">
    <div class="modal-card">
      <div class="modal-head">
        <div>
          <span class="eyebrow"><i class="fa-solid fa-shield-halved"></i> Acceso Institucional</span>
          <h2>Iniciar sesión</h2>
        </div>
        <button id="closeAuth" class="close-btn">&times;</button>
      </div>

      <form id="loginForm" class="form-stack">
        <div class="form-group">
          <label for="loginEmail">Correo Electrónico</label>
          <input id="loginEmail" type="email" required placeholder="correo@ejemplo.com" class="form-control">
        </div>

        <div class="form-group">
          <label for="loginPassword">Contraseña</label>
          <input id="loginPassword" type="password" required placeholder="Tu contraseña" class="form-control">
        </div>

        <button class="btn primary btn-block" type="submit">
          <i class="fa-solid fa-key"></i> Ingresar al Sistema
        </button>
      </form>

      <p id="authMessage" class="form-message"></p>
    </div>
  </div>

  <!-- LIBRERÍAS Y SCRIPTS ORIGINALES -->
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
  <script src="<%= request.getContextPath() %>/js/config.js"></script>
  <script src="<%= request.getContextPath() %>/js/app.js"></script>

</body>
</html>