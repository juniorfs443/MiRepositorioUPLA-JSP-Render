<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">

    <meta name="viewport"
          content="width=device-width, initial-scale=1.0">

    <meta name="description"
          content="Repositorio Académico de Ingeniería de Sistemas y Computación - Universidad Peruana Los Andes">

    <title>
        Repositorio Académico | UPLA
    </title>

    <!-- =====================================================
         FUENTE INTER
         ===================================================== -->

    <link rel="preconnect"
          href="https://fonts.googleapis.com">

    <link rel="preconnect"
          href="https://fonts.gstatic.com"
          crossorigin>

    <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
        rel="stylesheet">


    <!-- =====================================================
         FONT AWESOME
         ===================================================== -->

    <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">


    <!-- =====================================================
         CSS PRINCIPAL
         ===================================================== -->

    <link
        rel="stylesheet"
        href="${pageContext.request.contextPath}/css/styles.css?v=20260922">

</head>


<body>


<!-- =========================================================
     SIDEBAR
     ========================================================= -->

<aside
    class="sidebar"
    id="sidebar">


    <!-- LOGO / MARCA -->

    <div class="sidebar-brand">

     <a
    href="#inicio"
    class="brand-logo"
    aria-label="Inicio">

    <img
        src="${pageContext.request.contextPath}/img/logo-upla.png"
        alt="Logo UPLA">

</a>


        <div class="brand-text">

            <strong>
                UPLA
            </strong>

            <small>
                REPOSITORIO ACADÉMICO
            </small>

        </div>

    </div>



    <!-- =====================================================
         NAVEGACIÓN
         ===================================================== -->

    <div class="sidebar-section">

        <span class="sidebar-title">
            PRINCIPAL
        </span>


        <nav
            class="sidebar-nav"
            id="mainNav">


            <a
                href="#inicio"
                class="nav-item active"
                data-route="inicio">

                <i class="fa-solid fa-house"></i>

                <span>
                    Inicio
                </span>

            </a>


            <a
                href="#semanas"
                class="nav-item"
                data-route="semanas">

                <i class="fa-solid fa-calendar-days"></i>

                <span>
                    Semanas
                </span>

            </a>


            <a
                href="#actividades"
                class="nav-item"
                data-route="actividades">

                <i class="fa-solid fa-list-check"></i>

                <span>
                    Actividades
                </span>

            </a>


            <a
                href="#archivos"
                class="nav-item"
                data-route="archivos">

                <i class="fa-solid fa-folder-open"></i>

                <span>
                    Archivos
                </span>

            </a>


            <a
                href="#perfil"
                class="nav-item"
                data-route="perfil">

                <i class="fa-solid fa-user-graduate"></i>

                <span>
                    Perfil
                </span>

            </a>

        </nav>

    </div>



    <!-- =====================================================
         ADMINISTRACIÓN
         ===================================================== -->

    <div class="sidebar-section admin-link hidden">

        <span class="sidebar-title">
            ADMINISTRACIÓN
        </span>


        <div class="sidebar-nav">

            <a
                href="#administrar"
                class="nav-item admin-link hidden"
                data-route="administrar">

                <i class="fa-solid fa-sliders"></i>

                <span>
                    Administrar
                </span>

            </a>

        </div>

    </div>



    <!-- =====================================================
         INFORMACIÓN DEL SISTEMA
         ===================================================== -->

    <div class="sidebar-info">

        <div class="sidebar-info-icon">

            <i class="fa-solid fa-graduation-cap"></i>

        </div>


        <strong>
            INGENIERÍA DE SISTEMAS
        </strong>


        <p>
            Repositorio académico para organizar
            trabajos, prácticas, actividades y
            evidencias del ciclo académico.
        </p>

    </div>



    <!-- =====================================================
         USUARIO
         ===================================================== -->

    <div class="sidebar-user">


        <div
            class="user-avatar"
            id="sidebarInitials">

            U

        </div>


        <div class="user-data">

            <strong
                id="sidebarUserName">

                Invitado

            </strong>


            <small>

                <span class="status-dot"></span>

                <span id="sidebarStatus">
                    Visitante
                </span>

            </small>

        </div>


        <button
            id="logoutTopBtn"
            class="logout-icon hidden"
            type="button"
            title="Cerrar sesión">

            <i class="fa-solid fa-right-from-bracket"></i>

        </button>

    </div>


</aside>



<!-- =========================================================
     CONTENIDO PRINCIPAL
     ========================================================= -->

<div class="main-wrapper">


    <!-- =====================================================
         TOPBAR
         ===================================================== -->

    <header class="topbar">


        <div class="topbar-left">


            <button
                class="menu-toggle"
                id="menuToggle"
                type="button"
                aria-label="Abrir menú">

                <i class="fa-solid fa-bars"></i>

            </button>


            <div>

                <span class="topbar-label">
                    UNIVERSIDAD PERUANA LOS ANDES
                </span>


                <strong>
                    Sistema de Gestión Académica
                </strong>

            </div>

        </div>



        <div class="topbar-right">


            <!-- ESTADO -->

            <div class="connection-status">

                <span class="online-dot"></span>

                <span>
                    Tomcat + Supabase
                </span>

            </div>



            <!-- USUARIO TOPBAR -->

            <div class="top-user">


                <div
                    class="top-avatar"
                    id="topInitials">

                    U

                </div>


                <div>

                    <strong
                        id="userState">

                        Invitado

                    </strong>

                    <small>
                        Ingeniería de Sistemas
                    </small>

                </div>

            </div>



            <!-- LOGIN -->

            <button
                id="loginTopBtn"
                class="login-button"
                type="button">

                <i class="fa-solid fa-right-to-bracket"></i>

                <span>
                    Iniciar sesión
                </span>

            </button>


        </div>

    </header>



    <!-- =====================================================
         CONTENIDO DINÁMICO
         app.js renderiza aquí
         ===================================================== -->

    <main id="app"></main>



    <!-- =====================================================
         FOOTER
         ===================================================== -->

    <footer class="site-footer">


        <div>

            <strong>
                Mi Repositorio Académico UPLA
            </strong>

            <span>
                Ingeniería de Sistemas y Computación
            </span>

        </div>


        <p>
            JSP · Apache Tomcat · Supabase
        </p>


    </footer>


</div>



<!-- =========================================================
     MODAL LOGIN
     ========================================================= -->

<div
    id="authModal"
    class="modal">


    <div class="modal-card">


        <div class="modal-head">


            <div>

                <span class="eyebrow">

                    <i class="fa-solid fa-shield-halved"></i>

                    ACCESO AL SISTEMA

                </span>


                <h2>
                    Iniciar sesión
                </h2>


                <p>
                    Ingresa tus credenciales para administrar
                    el repositorio académico.
                </p>

            </div>



            <button
                id="closeAuth"
                class="close-btn"
                type="button"
                aria-label="Cerrar">

                <i class="fa-solid fa-xmark"></i>

            </button>


        </div>



        <form
            id="loginForm"
            class="form-stack">


            <!-- EMAIL -->

            <label>

                Correo electrónico


                <div class="input-wrapper">

                    <i class="fa-solid fa-envelope"></i>

                    <input
                        id="loginEmail"
                        type="email"
                        placeholder="correo@ejemplo.com"
                        autocomplete="email"
                        required>

                </div>

            </label>



            <!-- PASSWORD -->

            <label>

                Contraseña


                <div class="input-wrapper">

                    <i class="fa-solid fa-lock"></i>

                    <input
                        id="loginPassword"
                        type="password"
                        placeholder="Ingresa tu contraseña"
                        autocomplete="current-password"
                        required>

                </div>

            </label>



            <!-- BOTÓN -->

            <button
                class="btn primary full-width"
                type="submit">

                <i class="fa-solid fa-right-to-bracket"></i>

                Ingresar al sistema

            </button>



            <p
                id="authMessage"
                class="form-message">
            </p>


        </form>


    </div>

</div>



<!-- =========================================================
     JAVASCRIPT
     ========================================================= -->


<!-- SUPABASE -->

<script
    src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2">
</script>


<!-- CONFIGURACIÓN SUPABASE -->

<script
    src="${pageContext.request.contextPath}/js/config.js?v=20260922">
</script>


<!-- APLICACIÓN -->

<script
    src="${pageContext.request.contextPath}/js/app.js?v=20260922">
</script>


</body>

</html>