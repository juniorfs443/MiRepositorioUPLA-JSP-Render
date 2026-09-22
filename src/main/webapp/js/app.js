/* =========================================================
   UPLA - REPOSITORIO ACADÉMICO
   Dashboard profesional
   JSP + Tomcat + Supabase
   ========================================================= */


/* =========================================================
   1. CONFIGURACIÓN SUPABASE
   ========================================================= */

const cfg = window.APP_CONFIG || {};

const configured =
    cfg.SUPABASE_URL &&
    cfg.SUPABASE_ANON_KEY &&
    !cfg.SUPABASE_URL.includes("PEGA_AQUI") &&
    !cfg.SUPABASE_ANON_KEY.includes("PEGA_AQUI");

const sb = configured
    ? window.supabase.createClient(
        cfg.SUPABASE_URL,
        cfg.SUPABASE_ANON_KEY
    )
    : null;


/* =========================================================
   2. ELEMENTOS PRINCIPALES
   ========================================================= */

const app = document.getElementById("app");

const sidebar = document.getElementById("sidebar");

const nav = document.getElementById("mainNav");

const menuToggle = document.getElementById("menuToggle");

const authModal = document.getElementById("authModal");

const loginTopBtn = document.getElementById("loginTopBtn");

const logoutTopBtn = document.getElementById("logoutTopBtn");

const userState = document.getElementById("userState");

const closeAuth = document.getElementById("closeAuth");

const loginForm = document.getElementById("loginForm");

const authMessage = document.getElementById("authMessage");

const sidebarUserName =
    document.getElementById("sidebarUserName");

const sidebarInitials =
    document.getElementById("sidebarInitials");

const topInitials =
    document.getElementById("topInitials");

const sidebarStatus =
    document.getElementById("sidebarStatus");


/* =========================================================
   3. ESTADO GLOBAL
   ========================================================= */

let session = null;

let profile = null;

let totalFiles = 0;

let repositoryFiles = [];


/* =========================================================
   4. SEMANAS
   ========================================================= */

const weeks = Array.from(
    { length: 16 },
    (_, index) => {

        const number = index + 1;

        return {

            id: number,

            title:
                `Semana ${String(number).padStart(2, "0")}`,

            description:
                `Material académico, trabajos y evidencias correspondientes a la semana ${number}.`

        };

    }
);


/* =========================================================
   5. ACTIVIDADES
   ========================================================= */

const activities = [

    {
        title: "Presentación del repositorio",
        week: 1,
        type: "Trabajo",
        status: "done"
    },

    {
        title: "Organización de materiales",
        week: 2,
        type: "Actividad",
        status: "done"
    },

    {
        title: "Desarrollo de contenido semanal",
        week: 3,
        type: "Práctica",
        status: "done"
    },

    {
        title: "Actualización del portafolio",
        week: 4,
        type: "Trabajo",
        status: "pending"
    }

];


/* =========================================================
   6. EVENTOS GENERALES
   ========================================================= */

if (menuToggle) {

    menuToggle.addEventListener(
        "click",
        () => {

            sidebar?.classList.toggle("open");

        }
    );

}


if (loginTopBtn) {

    loginTopBtn.addEventListener(
        "click",
        () => {

            authModal?.classList.add("open");

        }
    );

}


if (closeAuth) {

    closeAuth.addEventListener(
        "click",
        () => {

            authModal?.classList.remove("open");

        }
    );

}


if (authModal) {

    authModal.addEventListener(
        "click",
        event => {

            if (event.target === authModal) {

                authModal.classList.remove("open");

            }

        }
    );

}


if (logoutTopBtn) {

    logoutTopBtn.addEventListener(
        "click",
        logout
    );

}


window.addEventListener(
    "hashchange",
    render
);


window.addEventListener(
    "DOMContentLoaded",
    init
);


/* =========================================================
   7. LOGIN
   ========================================================= */

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            if (!sb) {

                authMessage.textContent =
                    "Supabase no está configurado correctamente.";

                return;

            }


            authMessage.textContent =
                "Verificando credenciales...";


            const email =
                document
                    .getElementById("loginEmail")
                    .value
                    .trim();


            const password =
                document
                    .getElementById("loginPassword")
                    .value;


            const { error } =
                await sb.auth.signInWithPassword({

                    email,
                    password

                });


            if (error) {

                authMessage.textContent =
                    "No se pudo iniciar sesión: " +
                    error.message;

                return;

            }


            authMessage.textContent = "";

            authModal.classList.remove("open");

        }
    );

}


/* =========================================================
   8. INICIALIZACIÓN
   ========================================================= */

async function init() {

    if (sb) {

        try {

            const { data } =
                await sb.auth.getSession();


            session = data.session;


            if (session) {

                await loadProfile();

            }


            await loadRepositoryData();


            sb.auth.onAuthStateChange(
                async (_event, newSession) => {

                    session = newSession;

                    profile = null;


                    if (session) {

                        await loadProfile();

                    }


                    await loadRepositoryData();

                    updateAuthUI();

                    render();

                }
            );

        }
        catch (error) {

            console.error(
                "Error iniciando Supabase:",
                error
            );

        }

    }


    updateAuthUI();

    render();

}


/* =========================================================
   9. DATOS DEL REPOSITORIO
   ========================================================= */

async function loadRepositoryData() {

    totalFiles = 0;

    repositoryFiles = [];


    if (!sb) {

        return;

    }


    try {

        const { data, error } =
            await sb
                .from("repository_files")
                .select("*")
                .order(
                    "created_at",
                    { ascending: false }
                );


        if (error) {

            console.error(
                "Error cargando archivos:",
                error
            );

            return;

        }


        repositoryFiles =
            data || [];


        totalFiles =
            repositoryFiles.length;

    }
    catch (error) {

        console.error(
            "Error consultando repositorio:",
            error
        );

    }

}


/* =========================================================
   10. PERFIL
   ========================================================= */

async function loadProfile() {

    if (!sb || !session) {

        return;

    }


    const { data, error } =
        await sb
            .from("profiles")
            .select("*")
            .eq(
                "id",
                session.user.id
            )
            .maybeSingle();


    if (error) {

        console.error(
            "Error cargando perfil:",
            error
        );

        profile = null;

        return;

    }


    profile =
        data || null;

}


/* =========================================================
   11. INTERFAZ DE AUTENTICACIÓN
   ========================================================= */

function updateAuthUI() {

    const logged =
        Boolean(session);


    loginTopBtn?.classList.toggle(
        "hidden",
        logged
    );


    logoutTopBtn?.classList.toggle(
        "hidden",
        !logged
    );


    document
        .querySelectorAll(".admin-link")
        .forEach(element => {

            element.classList.toggle(
                "hidden",
                !logged
            );

        });


    const name =
        profile?.full_name ||
        session?.user?.email ||
        "Invitado";


    if (userState) {

        userState.textContent =
            name;

    }


    if (sidebarUserName) {

        sidebarUserName.textContent =
            name;

    }


    if (sidebarStatus) {

        sidebarStatus.textContent =
            logged
                ? "En línea"
                : "Visitante";

    }


    const initials =
        getInitials(name);


    if (sidebarInitials) {

        sidebarInitials.textContent =
            initials;

    }


    if (topInitials) {

        topInitials.textContent =
            initials;

    }

}


/* =========================================================
   12. CERRAR SESIÓN
   ========================================================= */

async function logout() {

    if (sb) {

        await sb.auth.signOut();

    }


    session = null;

    profile = null;


    updateAuthUI();


    location.hash =
        "#inicio";

}


/* =========================================================
   13. NAVEGACIÓN
   ========================================================= */

function setActive(route) {

    document
        .querySelectorAll("[data-route]")
        .forEach(link => {

            link.classList.toggle(
                "active",
                link.dataset.route === route
            );

        });


    sidebar?.classList.remove("open");

}


/* =========================================================
   14. ROUTER
   ========================================================= */

function render() {

    const raw =
        location.hash
            .replace("#", "") ||
        "inicio";


    const [route, parameter] =
        raw.split("/");


    const activeRoute =
        route === "semana"
            ? "semanas"
            : route;


    setActive(activeRoute);


    switch (route) {

        case "inicio":

            renderHome();

            break;


        case "semanas":

            renderWeeks();

            break;


        case "semana":

            renderWeek(
                Number(parameter) || 1
            );

            break;


        case "actividades":

            renderActivities();

            break;


        case "archivos":

            renderFiles();

            break;


        case "perfil":

            renderProfile();

            break;


        case "administrar":

            renderAdmin();

            break;


        default:

            renderHome();

    }

}


/* =========================================================
   15. DASHBOARD
   ========================================================= */

function renderHome() {

    const completedActivities =
        activities.filter(
            activity =>
                activity.status === "done"
        ).length;


    const progress =
        Math.round(
            (
                completedActivities /
                activities.length
            ) * 100
        );


    const displayName =
        profile?.full_name
            ? profile.full_name.split(" ")[0]
            : "";


    app.innerHTML = `

        <section class="dashboard">

            <!-- HERO -->

            <div class="dashboard-hero">

                <div class="hero-content">

                    <div class="hero-kicker">

                        <i class="fa-solid fa-graduation-cap"></i>

                        INGENIERÍA DE SISTEMAS Y COMPUTACIÓN

                    </div>


                    <h1>

                        ${
                            displayName
                                ? `Bienvenido, ${escapeHtml(displayName)}`
                                : "Mi Repositorio Académico"
                        }

                    </h1>


                    <p>

                        Sistema académico para organizar,
                        administrar y presentar trabajos,
                        actividades, documentos y evidencias
                        correspondientes a las 16 semanas
                        del ciclo académico.

                    </p>


                    <div class="hero-actions">

                        <a
                            href="#semanas"
                            class="btn primary">

                            <i class="fa-solid fa-calendar-days"></i>

                            Explorar semanas

                        </a>


                        <a
                            href="#archivos"
                            class="btn secondary">

                            <i class="fa-solid fa-folder-open"></i>

                            Ver archivos

                        </a>

                    </div>

                </div>


                <div class="hero-progress">

                    <span class="progress-label">

                        PROGRESO ACADÉMICO

                    </span>


                    <div class="progress-value">

                        ${progress}%

                    </div>


                    <div class="progress-text">

                        ${completedActivities}
                        de
                        ${activities.length}
                        actividades completadas

                    </div>


                    <div class="progress-track">

                        <div
                            class="progress-bar"
                            style="width:${progress}%">

                        </div>

                    </div>

                </div>

            </div>


            <!-- INDICADORES -->

            <div class="stats-grid">

                ${statCard(
                    "fa-calendar-days",
                    "stat-blue",
                    "Semanas académicas",
                    "16",
                    "Semanas del ciclo"
                )}


                ${statCard(
                    "fa-folder-open",
                    "stat-green",
                    "Archivos",
                    totalFiles,
                    "Documentos almacenados"
                )}


                ${statCard(
                    "fa-list-check",
                    "stat-orange",
                    "Actividades",
                    activities.length,
                    `${completedActivities} completadas`
                )}


                ${statCard(
                    "fa-chart-line",
                    "stat-purple",
                    "Avance",
                    `${progress}%`,
                    "Progreso académico"
                )}

            </div>


            <!-- PANEL CENTRAL -->

            <div class="dashboard-grid">

                <!-- SEMANAS -->

                <section class="panel">

                    <div class="panel-header">

                        <div class="panel-title">

                            <i class="fa-solid fa-calendar-days"></i>

                            <h2>
                                Semanas del ciclo
                            </h2>

                        </div>


                        <a
                            href="#semanas"
                            class="panel-link">

                            Ver todas →

                        </a>

                    </div>


                    <div class="weeks-dashboard">

                        ${weeks
                            .slice(0, 8)
                            .map(week => {

                                const count =
                                    getFilesByWeek(
                                        week.id
                                    ).length;


                                return `

                                    <a
                                        href="#semana/${week.id}"
                                        class="mini-week">

                                        <div class="mini-week-head">

                                            <strong>
                                                ${week.title}
                                            </strong>


                                            <span class="week-status">

                                                ${
                                                    count > 0
                                                        ? `<i class="fa-solid fa-circle-check"></i>`
                                                        : `<i class="fa-regular fa-circle"></i>`
                                                }

                                            </span>

                                        </div>


                                        <small>

                                            ${count}
                                            ${
                                                count === 1
                                                    ? "archivo"
                                                    : "archivos"
                                            }

                                        </small>


                                        <div class="mini-progress">

                                            <span
                                                style="width:${
                                                    count > 0
                                                        ? "100"
                                                        : "10"
                                                }%">

                                            </span>

                                        </div>

                                    </a>

                                `;

                            })
                            .join("")}

                    </div>

                </section>


                <!-- ACTIVIDAD RECIENTE -->

                <section class="panel">

                    <div class="panel-header">

                        <div class="panel-title">

                            <i class="fa-solid fa-wave-square"></i>

                            <h2>
                                Actividad reciente
                            </h2>

                        </div>


                        <a
                            href="#actividades"
                            class="panel-link">

                            Ver todas →

                        </a>

                    </div>


                    <div class="activity-list">

                        ${activities
                            .map(
                                activity =>
                                    activityTemplate(
                                        activity
                                    )
                            )
                            .join("")}

                    </div>

                </section>

            </div>


            <!-- ACCESOS RÁPIDOS -->

            <div class="quick-grid">

                <a
                    href="#semanas"
                    class="quick-card">

                    <i class="fa-solid fa-calendar-days"></i>

                    <strong>
                        Semanas académicas
                    </strong>

                    <p>
                        Consulta el contenido organizado
                        desde la semana 01 hasta la semana 16.
                    </p>

                </a>


                <a
                    href="#archivos"
                    class="quick-card">

                    <i class="fa-solid fa-folder-open"></i>

                    <strong>
                        Repositorio de archivos
                    </strong>

                    <p>
                        Accede a documentos, prácticas,
                        trabajos e informes almacenados.
                    </p>

                </a>


                <a
                    href="#perfil"
                    class="quick-card">

                    <i class="fa-solid fa-user-graduate"></i>

                    <strong>
                        Perfil académico
                    </strong>

                    <p>
                        Consulta los datos académicos
                        asociados al repositorio.
                    </p>

                </a>

            </div>


            <!-- ÚLTIMOS ARCHIVOS -->

            <section
                class="panel"
                style="margin-top:18px">

                <div class="panel-header">

                    <div class="panel-title">

                        <i class="fa-solid fa-clock-rotate-left"></i>

                        <h2>
                            Archivos recientes
                        </h2>

                    </div>


                    <a
                        href="#archivos"
                        class="panel-link">

                        Ver repositorio →

                    </a>

                </div>


                ${recentFilesTemplate()}

            </section>

        </section>

    `;

}


/* =========================================================
   16. TARJETA ESTADÍSTICA
   ========================================================= */

function statCard(
    icon,
    color,
    title,
    value,
    description
) {

    return `

        <div class="stat-card">

            <div class="stat-icon ${color}">

                <i class="fa-solid ${icon}"></i>

            </div>


            <div class="stat-info">

                <span>
                    ${title}
                </span>

                <strong>
                    ${value}
                </strong>

                <small>
                    ${description}
                </small>

            </div>

        </div>

    `;

}


/* =========================================================
   17. ACTIVIDAD TEMPLATE
   ========================================================= */

function activityTemplate(activity) {

    let icon =
        "fa-file-lines";


    if (activity.type === "Actividad") {

        icon =
            "fa-folder";

    }


    if (activity.type === "Práctica") {

        icon =
            "fa-code";

    }


    return `

        <div class="activity-row">

            <div class="activity-icon">

                <i class="fa-solid ${icon}"></i>

            </div>


            <div class="activity-data">

                <strong>

                    ${escapeHtml(
                        activity.title
                    )}

                </strong>


                <span>

                    Semana ${activity.week}
                    ·
                    ${escapeHtml(
                        activity.type
                    )}

                </span>

            </div>


            <span
                class="badge ${activity.status}">

                ${
                    activity.status === "done"
                        ? "Completado"
                        : "Pendiente"
                }

            </span>

        </div>

    `;

}


/* =========================================================
   18. ARCHIVOS RECIENTES
   ========================================================= */

function recentFilesTemplate() {

    if (!repositoryFiles.length) {

        return emptyState(

            "fa-folder-open",

            "Todavía no hay archivos",

            "Los archivos que subas aparecerán en esta sección."

        );

    }


    const files =
        repositoryFiles.slice(0, 4);


    return `

        <div class="file-list">

            ${files
                .map(
                    file =>
                        fileTemplate(file)
                )
                .join("")}

        </div>

    `;

}


/* =========================================================
   19. WRAPPER DE PÁGINAS
   ========================================================= */

function page(
    title,
    subtitle,
    content
) {

    return `

        <section class="page">

            <div class="page-heading">

                <span>
                    REPOSITORIO ACADÉMICO UPLA
                </span>

                <h1>
                    ${title}
                </h1>

                <p>
                    ${subtitle}
                </p>

            </div>


            ${content}

        </section>

    `;

}


/* =========================================================
   20. SEMANAS
   ========================================================= */

function renderWeeks() {

    app.innerHTML =
        page(

            "Semanas académicas",

            "Contenido organizado durante las 16 semanas del ciclo académico.",

            `

                <div class="week-grid">

                    ${weeks
                        .map(week => {

                            const files =
                                getFilesByWeek(
                                    week.id
                                );


                            return `

                                <article class="week-card">

                                    <div class="week-number">

                                        ${String(
                                            week.id
                                        ).padStart(
                                            2,
                                            "0"
                                        )}

                                    </div>


                                    <h3>
                                        ${week.title}
                                    </h3>


                                    <p>
                                        ${week.description}
                                    </p>


                                    <div class="week-meta">

                                        <i class="fa-solid fa-folder-open"></i>

                                        ${files.length}
                                        ${
                                            files.length === 1
                                                ? "archivo disponible"
                                                : "archivos disponibles"
                                        }

                                    </div>


                                    <a
                                        class="small-btn"
                                        href="#semana/${week.id}">

                                        <i class="fa-solid fa-arrow-right"></i>

                                        Ver semana

                                    </a>

                                </article>

                            `;

                        })
                        .join("")}

                </div>

            `

        );

}


/* =========================================================
   21. DETALLE DE SEMANA
   ========================================================= */

async function renderWeek(id) {

    const week =
        weeks.find(
            item =>
                item.id === id
        ) ||
        weeks[0];


    app.innerHTML =
        page(

            week.title,

            `Materiales y evidencias académicas correspondientes a la semana ${week.id}.`,

            `

                <section class="panel">

                    <div class="panel-header">

                        <div class="panel-title">

                            <i class="fa-solid fa-folder-open"></i>

                            <h2>
                                Material disponible
                            </h2>

                        </div>


                        <a
                            href="#semanas"
                            class="panel-link">

                            ← Volver a semanas

                        </a>

                    </div>


                    <div id="weekFiles">

                        Cargando archivos...

                    </div>

                </section>

            `

        );


    const box =
        document.getElementById(
            "weekFiles"
        );


    if (!sb) {

        box.innerHTML =
            emptyState(

                "fa-database",

                "Supabase no está configurado",

                "Verifica la configuración del archivo js/config.js."

            );

        return;

    }


    const { data, error } =
        await sb
            .from("repository_files")
            .select("*")
            .eq(
                "week",
                week.id
            )
            .order(
                "created_at",
                { ascending: false }
            );


    if (error) {

        box.innerHTML =
            errorState(
                error.message
            );

        return;

    }


    if (!data?.length) {

        box.innerHTML =
            emptyState(

                "fa-folder-open",

                "Semana sin archivos",

                "Todavía no se han registrado materiales para esta semana."

            );

        return;

    }


    box.innerHTML = `

        <div class="file-list">

            ${data
                .map(
                    file =>
                        fileTemplate(file)
                )
                .join("")}

        </div>

    `;

}


/* =========================================================
   22. ACTIVIDADES
   ========================================================= */

function renderActivities() {

    const completed =
        activities.filter(
            item =>
                item.status === "done"
        ).length;


    const pending =
        activities.length -
        completed;


    app.innerHTML =
        page(

            "Actividades académicas",

            "Seguimiento de trabajos, prácticas y actividades del ciclo.",

            `

                <div class="stats-grid"
                     style="margin-top:0;margin-bottom:18px">

                    ${statCard(
                        "fa-list-check",
                        "stat-blue",
                        "Total",
                        activities.length,
                        "Actividades registradas"
                    )}

                    ${statCard(
                        "fa-circle-check",
                        "stat-green",
                        "Completadas",
                        completed,
                        "Actividades finalizadas"
                    )}

                    ${statCard(
                        "fa-clock",
                        "stat-orange",
                        "Pendientes",
                        pending,
                        "Por completar"
                    )}

                    ${statCard(
                        "fa-chart-line",
                        "stat-purple",
                        "Progreso",
                        `${Math.round(
                            (
                                completed /
                                activities.length
                            ) * 100
                        )}%`,
                        "Avance registrado"
                    )}

                </div>


                <section class="panel">

                    <div class="panel-header">

                        <div class="panel-title">

                            <i class="fa-solid fa-list-check"></i>

                            <h2>
                                Registro de actividades
                            </h2>

                        </div>

                    </div>


                    <div class="activity-list">

                        ${activities
                            .map(
                                activity =>
                                    activityTemplate(
                                        activity
                                    )
                            )
                            .join("")}

                    </div>

                </section>

            `

        );

}


/* =========================================================
   23. TODOS LOS ARCHIVOS
   ========================================================= */

async function renderFiles() {

    app.innerHTML =
        page(

            "Repositorio de archivos",

            "Documentos, informes, prácticas y evidencias académicas almacenadas en Supabase.",

            `

                <section class="panel">

                    <div class="panel-header">

                        <div class="panel-title">

                            <i class="fa-solid fa-folder-tree"></i>

                            <h2>
                                Documentos almacenados
                            </h2>

                        </div>


                        <span class="panel-link">

                            ${totalFiles} archivos

                        </span>

                    </div>


                    <div id="allFiles">

                        Cargando repositorio...

                    </div>

                </section>

            `

        );


    const box =
        document.getElementById(
            "allFiles"
        );


    if (!sb) {

        box.innerHTML =
            emptyState(

                "fa-database",

                "Supabase no está configurado",

                "Configura correctamente las credenciales del proyecto."

            );

        return;

    }


    const { data, error } =
        await sb
            .from("repository_files")
            .select("*")
            .order(
                "created_at",
                { ascending: false }
            );


    if (error) {

        box.innerHTML =
            errorState(
                error.message
            );

        return;

    }


    repositoryFiles =
        data || [];


    totalFiles =
        repositoryFiles.length;


    if (!repositoryFiles.length) {

        box.innerHTML =
            emptyState(

                "fa-folder-open",

                "Repositorio vacío",

                "Todavía no se han subido documentos académicos."

            );

        return;

    }


    box.innerHTML = `

        <div class="file-list">

            ${repositoryFiles
                .map(
                    file =>
                        fileTemplate(file)
                )
                .join("")}

        </div>

    `;

}


/* =========================================================
   24. TEMPLATE ARCHIVO
   ========================================================= */

function fileTemplate(file) {

    return `

        <div class="file-row">

            <div>

                <strong>

                    <i class="fa-solid fa-file-lines"></i>

                    ${escapeHtml(
                        file.file_name
                    )}

                </strong>


                <span>

                    Semana ${file.week}
                    ·
                    ${escapeHtml(
                        file.description ||
                        "Archivo académico"
                    )}

                </span>

            </div>


            <a
                class="small-btn"
                href="${file.public_url}"
                target="_blank"
                rel="noopener noreferrer">

                <i class="fa-solid fa-arrow-up-right-from-square"></i>

                Abrir

            </a>

        </div>

    `;

}


/* =========================================================
   25. PERFIL
   ========================================================= */

function profilePicture() {

    if (profile?.avatar_url) {

        return `

            <img
                class="profile-avatar"
                src="${profile.avatar_url}"
                alt="Foto de perfil">

        `;

    }


    const initials =
        getInitials(
            profile?.full_name ||
            "FL"
        );


    return `

        <div class="profile-avatar fallback">

            ${initials}

        </div>

    `;

}


function renderProfile() {

    const name =
        profile?.full_name ||
        "Junior Rodolfo Flores Safora";


    const career =
        profile?.career ||
        "Ingeniería de Sistemas y Computación";


    const bio =
        profile?.bio ||
        "Repositorio académico personal para organizar evidencias, trabajos, prácticas y materiales desarrollados durante el ciclo académico.";


    app.innerHTML =
        page(

            "Perfil académico",

            "Información general asociada al estudiante y al repositorio.",

            `

                <div class="profile-card">

                    ${profilePicture()}


                    <div>

                        <span class="eyebrow">
                            ESTUDIANTE
                        </span>


                        <h2>
                            ${escapeHtml(name)}
                        </h2>


                        <p>
                            ${escapeHtml(bio)}
                        </p>


                        <div class="info-grid">

                            <div>

                                <span>
                                    Universidad
                                </span>

                                <strong>
                                    Universidad Peruana Los Andes
                                </strong>

                            </div>


                            <div>

                                <span>
                                    Carrera profesional
                                </span>

                                <strong>
                                    ${escapeHtml(career)}
                                </strong>

                            </div>


                            <div>

                                <span>
                                    Semanas académicas
                                </span>

                                <strong>
                                    16 semanas
                                </strong>

                            </div>


                            <div>

                                <span>
                                    Archivos almacenados
                                </span>

                                <strong>
                                    ${totalFiles} archivos
                                </strong>

                            </div>


                            <div>

                                <span>
                                    Estado
                                </span>

                                <strong>

                                    ${
                                        session
                                            ? "Sesión iniciada"
                                            : "Acceso público"
                                    }

                                </strong>

                            </div>


                            <div>

                                <span>
                                    Plataforma
                                </span>

                                <strong>
                                    JSP · Tomcat · Supabase
                                </strong>

                            </div>

                        </div>

                    </div>

                </div>

            `

        );

}


/* =========================================================
   26. ADMINISTRACIÓN
   ========================================================= */

function renderAdmin() {

    if (!session) {

        app.innerHTML =
            page(

                "Administración",

                "Área restringida del repositorio académico.",

                `

                    <section class="panel">

                        ${emptyState(

                            "fa-lock",

                            "Acceso restringido",

                            "Inicia sesión para administrar tu perfil y los documentos del repositorio."

                        )}


                        <div
                            style="
                                display:flex;
                                justify-content:center;
                                margin-top:18px;
                            ">

                            <button
                                class="btn primary"
                                onclick="
                                    document
                                        .getElementById('authModal')
                                        .classList.add('open')
                                ">

                                <i class="fa-solid fa-right-to-bracket"></i>

                                Iniciar sesión

                            </button>

                        </div>

                    </section>

                `

            );


        return;

    }


    app.innerHTML =
        page(

            "Gestión del repositorio",

            "Administra tu información académica y los documentos almacenados.",

            `

                <div class="admin-grid">

                    <!-- PERFIL -->

                    <section class="panel">

                        <div class="panel-header">

                            <div class="panel-title">

                                <i class="fa-solid fa-user-pen"></i>

                                <h2>
                                    Editar perfil
                                </h2>

                            </div>

                        </div>


                        <form
                            id="profileForm"
                            class="form-stack">


                            <label>

                                Nombre completo

                                <input
                                    id="fullName"
                                    type="text"
                                    required
                                    value="${attr(
                                        profile?.full_name ||
                                        ""
                                    )}">

                            </label>


                            <label>

                                Carrera profesional

                                <input
                                    id="career"
                                    type="text"
                                    required
                                    value="${attr(
                                        profile?.career ||
                                        "Ingeniería de Sistemas y Computación"
                                    )}">

                            </label>


                            <label>

                                Descripción académica

                                <textarea
                                    id="bio"
                                    rows="5"
                                    placeholder="Descripción del estudiante...">${escapeHtml(
                                        profile?.bio ||
                                        ""
                                    )}</textarea>

                            </label>


                            <label>

                                Foto de perfil

                                <input
                                    id="avatarFile"
                                    type="file"
                                    accept="image/*">

                            </label>


                            <button
                                class="btn primary"
                                type="submit">

                                <i class="fa-solid fa-floppy-disk"></i>

                                Guardar cambios

                            </button>


                            <p
                                id="profileMsg"
                                class="form-message">
                            </p>

                        </form>

                    </section>


                    <!-- ARCHIVOS -->

                    <section class="panel">

                        <div class="panel-header">

                            <div class="panel-title">

                                <i class="fa-solid fa-cloud-arrow-up"></i>

                                <h2>
                                    Subir material
                                </h2>

                            </div>

                        </div>


                        <form
                            id="uploadForm"
                            class="form-stack">


                            <label>

                                Semana académica

                                <select
                                    id="weekSelect"
                                    required>

                                    ${weeks
                                        .map(
                                            week => `

                                                <option
                                                    value="${week.id}">

                                                    ${week.title}

                                                </option>

                                            `
                                        )
                                        .join("")}

                                </select>

                            </label>


                            <label>

                                Descripción

                                <input
                                    id="fileDescription"
                                    type="text"
                                    placeholder="Ej. Informe de arquitectura de software">

                            </label>


                            <label>

                                Seleccionar archivo

                                <input
                                    id="repoFile"
                                    type="file"
                                    required>

                            </label>


                            <button
                                class="btn primary"
                                type="submit">

                                <i class="fa-solid fa-cloud-arrow-up"></i>

                                Subir archivo

                            </button>


                            <p
                                id="uploadMsg"
                                class="form-message">
                            </p>

                        </form>

                    </section>

                </div>


                <!-- GESTIÓN ARCHIVOS -->

                <section
                    class="panel"
                    style="margin-top:18px">


                    <div class="panel-header">

                        <div class="panel-title">

                            <i class="fa-solid fa-folder-open"></i>

                            <h2>
                                Gestión de archivos
                            </h2>

                        </div>


                        <span class="panel-link">

                            ${totalFiles} documentos

                        </span>

                    </div>


                    <div id="adminFiles">

                        Cargando archivos...

                    </div>

                </section>

            `

        );


    const profileForm =
        document.getElementById(
            "profileForm"
        );


    const uploadForm =
        document.getElementById(
            "uploadForm"
        );


    profileForm?.addEventListener(
        "submit",
        saveProfile
    );


    uploadForm?.addEventListener(
        "submit",
        uploadFile
    );


    loadAdminFiles();

}


/* =========================================================
   27. GUARDAR PERFIL
   ========================================================= */

async function saveProfile(event) {

    event.preventDefault();


    if (!sb || !session) {

        return;

    }


    const message =
        document.getElementById(
            "profileMsg"
        );


    message.textContent =
        "Guardando información...";


    let avatarUrl =
        profile?.avatar_url ||
        null;


    const avatar =
        document
            .getElementById(
                "avatarFile"
            )
            .files[0];


    if (avatar) {

        const extension =
            avatar.name
                .split(".")
                .pop();


        const path =
            `${session.user.id}/avatar.${extension}`;


        const { error: uploadError } =
            await sb
                .storage
                .from("avatars")
                .upload(
                    path,
                    avatar,
                    {
                        upsert: true
                    }
                );


        if (uploadError) {

            message.textContent =
                uploadError.message;

            return;

        }


        const { data: urlData } =
            sb
                .storage
                .from("avatars")
                .getPublicUrl(path);


        avatarUrl =
            urlData.publicUrl +
            `?v=${Date.now()}`;

    }


    const payload = {

        id:
            session.user.id,

        full_name:
            document
                .getElementById(
                    "fullName"
                )
                .value
                .trim(),

        career:
            document
                .getElementById(
                    "career"
                )
                .value
                .trim(),

        bio:
            document
                .getElementById(
                    "bio"
                )
                .value
                .trim(),

        avatar_url:
            avatarUrl,

        updated_at:
            new Date().toISOString()

    };


    const { error } =
        await sb
            .from("profiles")
            .upsert(payload);


    if (error) {

        message.textContent =
            error.message;

        return;

    }


    await loadProfile();


    updateAuthUI();


    message.textContent =
        "Perfil actualizado correctamente.";

}


/* =========================================================
   28. SUBIR ARCHIVO
   ========================================================= */

async function uploadFile(event) {

    event.preventDefault();


    if (!sb || !session) {

        return;

    }


    const message =
        document.getElementById(
            "uploadMsg"
        );


    const file =
        document
            .getElementById(
                "repoFile"
            )
            .files[0];


    if (!file) {

        message.textContent =
            "Selecciona un archivo.";

        return;

    }


    message.textContent =
        "Subiendo archivo...";


    const week =
        Number(
            document
                .getElementById(
                    "weekSelect"
                )
                .value
        );


    const description =
        document
            .getElementById(
                "fileDescription"
            )
            .value
            .trim();


    const safeName =
        file.name.replace(
            /[^a-zA-Z0-9._-]/g,
            "_"
        );


    const storagePath =
        `${session.user.id}/semana-${week}/${Date.now()}-${safeName}`;


    const { error: uploadError } =
        await sb
            .storage
            .from("repository-files")
            .upload(
                storagePath,
                file
            );


    if (uploadError) {

        message.textContent =
            uploadError.message;

        return;

    }


    const { data: urlData } =
        sb
            .storage
            .from("repository-files")
            .getPublicUrl(
                storagePath
            );


    const { error: databaseError } =
        await sb
            .from("repository_files")
            .insert({

                user_id:
                    session.user.id,

                week:
                    week,

                file_name:
                    file.name,

                description:
                    description,

                storage_path:
                    storagePath,

                public_url:
                    urlData.publicUrl

            });


    if (databaseError) {

        message.textContent =
            databaseError.message;

        return;

    }


    message.textContent =
        "Archivo subido correctamente.";


    event.target.reset();


    await loadRepositoryData();


    await loadAdminFiles();

}


/* =========================================================
   29. ARCHIVOS DE ADMINISTRACIÓN
   ========================================================= */

async function loadAdminFiles() {

    const box =
        document.getElementById(
            "adminFiles"
        );


    if (!box || !sb || !session) {

        return;

    }


    const { data, error } =
        await sb
            .from("repository_files")
            .select("*")
            .eq(
                "user_id",
                session.user.id
            )
            .order(
                "created_at",
                { ascending: false }
            );


    if (error) {

        box.innerHTML =
            errorState(
                error.message
            );

        return;

    }


    if (!data?.length) {

        box.innerHTML =
            emptyState(

                "fa-folder-open",

                "No tienes archivos",

                "Sube tu primer documento utilizando el formulario superior."

            );

        return;

    }


    box.innerHTML = `

        <div class="file-list">

            ${data
                .map(
                    file => `

                        <div class="file-row">

                            <div>

                                <strong>

                                    <i class="fa-solid fa-file-lines"></i>

                                    ${escapeHtml(
                                        file.file_name
                                    )}

                                </strong>


                                <span>

                                    Semana ${file.week}

                                    ·

                                    ${escapeHtml(
                                        file.description ||
                                        "Sin descripción"
                                    )}

                                </span>

                            </div>


                            <div
                                style="
                                    display:flex;
                                    gap:7px;
                                    align-items:center;
                                ">


                                <a
                                    class="small-btn"
                                    href="${file.public_url}"
                                    target="_blank"
                                    rel="noopener noreferrer">

                                    <i class="fa-solid fa-eye"></i>

                                    Abrir

                                </a>


                                <button
                                    class="small-btn"
                                    type="button"
                                    onclick="deleteFile(
                                        '${file.id}',
                                        '${jsstr(
                                            file.storage_path
                                        )}'
                                    )">

                                    <i class="fa-solid fa-trash"></i>

                                    Eliminar

                                </button>

                            </div>

                        </div>

                    `
                )
                .join("")}

        </div>

    `;

}


/* =========================================================
   30. ELIMINAR ARCHIVO
   ========================================================= */

async function deleteFile(
    id,
    path
) {

    const confirmation =
        confirm(
            "¿Seguro que deseas eliminar este archivo?"
        );


    if (!confirmation) {

        return;

    }


    if (!sb || !session) {

        return;

    }


    const { error: storageError } =
        await sb
            .storage
            .from("repository-files")
            .remove([path]);


    if (storageError) {

        alert(
            "No se pudo eliminar el archivo: " +
            storageError.message
        );

        return;

    }


    const { error: databaseError } =
        await sb
            .from("repository_files")
            .delete()
            .eq(
                "id",
                id
            );


    if (databaseError) {

        alert(
            "No se pudo eliminar el registro: " +
            databaseError.message
        );

        return;

    }


    await loadRepositoryData();


    await loadAdminFiles();

}


/* =========================================================
   31. OBTENER ARCHIVOS POR SEMANA
   ========================================================= */

function getFilesByWeek(week) {

    return repositoryFiles.filter(
        file =>
            Number(file.week) ===
            Number(week)
    );

}


/* =========================================================
   32. ESTADO VACÍO
   ========================================================= */

function emptyState(
    icon,
    title,
    description
) {

    return `

        <div
            style="
                text-align:center;
                padding:35px 20px;
                color:#64748b;
            ">


            <div
                style="
                    width:55px;
                    height:55px;
                    margin:0 auto 13px;
                    border-radius:15px;
                    background:#eff6ff;
                    color:#2563eb;
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    font-size:20px;
                ">

                <i class="fa-solid ${icon}"></i>

            </div>


            <strong
                style="
                    display:block;
                    color:#172033;
                    font-size:13px;
                    margin-bottom:5px;
                ">

                ${title}

            </strong>


            <span
                style="
                    font-size:10px;
                    line-height:1.6;
                ">

                ${description}

            </span>

        </div>

    `;

}


/* =========================================================
   33. ESTADO ERROR
   ========================================================= */

function errorState(message) {

    return `

        <div
            style="
                padding:16px;
                border-radius:10px;
                background:#fef2f2;
                color:#b91c1c;
                font-size:11px;
            ">

            <i class="fa-solid fa-triangle-exclamation"></i>

            ${escapeHtml(message)}

        </div>

    `;

}


/* =========================================================
   34. UTILIDADES
   ========================================================= */

function getInitials(
    value = ""
) {

    const words =
        String(value)
            .trim()
            .split(/\s+/)
            .filter(Boolean);


    if (!words.length) {

        return "U";

    }


    return words
        .slice(0, 2)
        .map(
            word =>
                word.charAt(0)
        )
        .join("")
        .toUpperCase();

}


function escapeHtml(
    value = ""
) {

    return String(value).replace(
        /[&<>"']/g,
        character => ({

            "&": "&amp;",

            "<": "&lt;",

            ">": "&gt;",

            '"': "&quot;",

            "'": "&#039;"

        }[character])
    );

}


function attr(
    value = ""
) {

    return escapeHtml(value);

}


function jsstr(
    value = ""
) {

    return String(value)

        .replace(
            /\\/g,
            "\\\\"
        )

        .replace(
            /'/g,
            "\\'"
        );

}