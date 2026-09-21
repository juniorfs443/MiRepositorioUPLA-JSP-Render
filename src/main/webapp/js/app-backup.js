
const cfg = window.APP_CONFIG || {};
const configured =
  cfg.SUPABASE_URL &&
  cfg.SUPABASE_ANON_KEY &&
  !cfg.SUPABASE_URL.includes("PEGA_AQUI") &&
  !cfg.SUPABASE_ANON_KEY.includes("PEGA_AQUI");

const sb = configured ? window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY) : null;

const app = document.getElementById("app");
const nav = document.getElementById("mainNav");
const menuToggle = document.getElementById("menuToggle");
const authModal = document.getElementById("authModal");
const loginTopBtn = document.getElementById("loginTopBtn");
const logoutTopBtn = document.getElementById("logoutTopBtn");
const userState = document.getElementById("userState");
const closeAuth = document.getElementById("closeAuth");
const loginForm = document.getElementById("loginForm");
const authMessage = document.getElementById("authMessage");

let session = null;
let profile = null;

const weeks = Array.from({length:16},(_,i)=>({
  id:i+1,
  title:`Semana ${String(i+1).padStart(2,"0")}`,
  description:`Material académico, actividades y archivos correspondientes a la semana ${i+1}.`
}));

const activities = [
  {title:"Presentación del repositorio",week:1,type:"Trabajo",status:"done"},
  {title:"Organización de materiales",week:2,type:"Actividad",status:"done"},
  {title:"Desarrollo de contenido semanal",week:3,type:"Práctica",status:"done"},
  {title:"Actualización del portafolio",week:4,type:"Trabajo",status:"pending"}
];

menuToggle.addEventListener("click",()=>nav.classList.toggle("open"));
loginTopBtn.addEventListener("click",()=>authModal.classList.add("open"));
closeAuth.addEventListener("click",()=>authModal.classList.remove("open"));
authModal.addEventListener("click",e=>{if(e.target===authModal) authModal.classList.remove("open")});
logoutTopBtn.addEventListener("click",logout);
window.addEventListener("hashchange",render);
window.addEventListener("DOMContentLoaded",init);

loginForm.addEventListener("submit",async e=>{
  e.preventDefault();
  if(!sb){
    authMessage.textContent="Primero configura Supabase en js/config.js.";
    return;
  }
  authMessage.textContent="Ingresando...";
  const email=document.getElementById("loginEmail").value.trim();
  const password=document.getElementById("loginPassword").value;
  const {error}=await sb.auth.signInWithPassword({email,password});
  if(error){authMessage.textContent=error.message;return}
  authMessage.textContent="";
  authModal.classList.remove("open");
});

async function init(){
  if(sb){
    const {data}=await sb.auth.getSession();
    session=data.session;
    if(session) await loadProfile();
    sb.auth.onAuthStateChange(async(_event,newSession)=>{
      session=newSession;
      profile=null;
      if(session) await loadProfile();
      updateAuthUI();
      render();
    });
  }
  updateAuthUI();
  render();
}

function updateAuthUI(){
  const logged=!!session;
  loginTopBtn.classList.toggle("hidden",logged);
  logoutTopBtn.classList.toggle("hidden",!logged);
  document.querySelectorAll(".admin-link").forEach(el=>el.classList.toggle("hidden",!logged));
  userState.textContent=logged ? (profile?.full_name || session.user.email) : "Invitado";
}

async function logout(){
  if(sb) await sb.auth.signOut();
  location.hash="#inicio";
}

async function loadProfile(){
  if(!sb || !session) return;
  const {data}=await sb.from("profiles").select("*").eq("id",session.user.id).maybeSingle();
  profile=data || null;
}

function setActive(route){
  document.querySelectorAll("[data-route]").forEach(a=>a.classList.toggle("active",a.dataset.route===route));
  nav.classList.remove("open");
}

function page(title,subtitle,content){
  return `<section class="page-banner"><div class="wrap"><span class="eyebrow">Repositorio UPLA</span><h1>${title}</h1><p>${subtitle}</p></div></section>
  <section class="section"><div class="wrap">${content}</div></section>`;
}

function render(){
  const raw=location.hash.replace("#","")||"inicio";
  const [route,param]=raw.split("/");
  setActive(route==="semana"?"semanas":route);
  if(route==="inicio") return renderHome();
  if(route==="semanas") return renderWeeks();
  if(route==="semana") return renderWeek(Number(param)||1);
  if(route==="actividades") return renderActivities();
  if(route==="perfil") return renderProfile();
  if(route==="administrar") return renderAdmin();
  renderHome();
}

function renderHome(){
  app.innerHTML=`<section class="hero"><div class="wrap hero__inner">
    <div><span class="eyebrow">Ingeniería de Sistemas y Computación</span><h1>Mi Repositorio Académico</h1>
    <p>Espacio personal para organizar y presentar trabajos, actividades, materiales y avances académicos durante las 16 semanas del ciclo.</p>
    <div class="hero__actions"><a class="btn primary" href="#semanas">Explorar semanas</a><a class="btn secondary" href="#actividades">Ver actividades</a></div></div>
    <aside class="hero-card"><small>Periodo académico</small><strong>16 semanas organizadas</strong><p>Acceso rápido a materiales, archivos y actividades desde una sola página.</p>
    <div class="hero-card__stats"><div><b>16</b><span>Semanas</span></div><div><b>${activities.length}</b><span>Actividades</span></div></div></aside>
    </div></section>
    <section class="section"><div class="wrap"><div class="section-head"><div><span class="eyebrow">Accesos principales</span><h2>Todo el ciclo en un solo lugar</h2></div></div>
    <div class="quick-grid">
      <a class="quick-card" href="#semanas"><strong>Semanas académicas</strong><p>Consulta el contenido de la semana 1 a la semana 16.</p><span class="link-arrow">Ver semanas</span></a>
      <a class="quick-card" href="#actividades"><strong>Actividades</strong><p>Revisa trabajos, prácticas y entregas del repositorio.</p><span class="link-arrow">Ver actividades</span></a>
      <a class="quick-card" href="#perfil"><strong>Perfil académico</strong><p>Información del estudiante y datos generales.</p><span class="link-arrow">Ver perfil</span></a>
    </div></div></section>`;
}

async function renderWeeks(){
  app.innerHTML=page("Semanas","Contenido organizado por semana.",`<div class="week-grid">${weeks.map(w=>`
    <article class="week-card"><div class="week-number">${w.id}</div><h3>${w.title}</h3><p>${w.description}</p><div class="week-meta">Archivos disponibles desde Supabase</div>
    <div class="week-actions"><a class="small-btn primary" href="#semana/${w.id}">Entrar</a></div></article>`).join("")}</div>`);
}

async function renderWeek(id){
  const week=weeks.find(w=>w.id===id)||weeks[0];
  app.innerHTML=page(week.title,`Materiales de la semana ${week.id}.`,`<div class="panel"><div class="section-head"><div><span class="eyebrow">Archivos</span><h2>Material disponible</h2></div></div><div id="weekFiles">Cargando archivos...</div></div>`);
  const box=document.getElementById("weekFiles");
  if(!sb){box.innerHTML='<div class="activity-row"><div><strong>Supabase aún no está configurado</strong><span>Agrega tus claves en js/config.js.</span></div></div>';return}
  const {data,error}=await sb.from("repository_files").select("*").eq("week",week.id).order("created_at",{ascending:false});
  if(error){box.innerHTML=`<div class="activity-row"><div><strong>Error</strong><span>${error.message}</span></div></div>`;return}
  if(!data?.length){box.innerHTML='<div class="activity-row"><div><strong>Sin archivos todavía</strong><span>Inicia sesión y súbelos desde Administrar.</span></div></div>';return}
  box.innerHTML=`<div class="file-list">${data.map(f=>`<div class="file-row"><div><strong>${escapeHtml(f.file_name)}</strong><span>${escapeHtml(f.description||"Archivo académico")}</span></div><a class="small-btn primary" href="${f.public_url}" target="_blank">Abrir</a></div>`).join("")}</div>`;
}

function renderActivities(){
  app.innerHTML=page("Actividades","Trabajos y actividades registradas.",`<div class="activity-list">${activities.map(a=>`<article class="activity-row"><div><strong>${a.title}</strong><span>Semana ${a.week} · ${a.type}</span></div><span class="badge ${a.status}">${a.status==="done"?"Completado":"Pendiente"}</span></article>`).join("")}</div>`);
}

function profilePicture(){
  if(profile?.avatar_url) return `<img class="profile-avatar" src="${profile.avatar_url}" alt="Foto de perfil">`;
  const initials=(profile?.full_name||"AL").split(" ").slice(0,2).map(x=>x[0]||"").join("").toUpperCase();
  return `<div class="profile-avatar fallback">${initials}</div>`;
}

function renderProfile(){
  const name=profile?.full_name || "Antony Daniel Leiva Cárdenas";
  app.innerHTML=page("Perfil","Información académica del repositorio.",`<div class="profile-card">${profilePicture()}<div><span class="eyebrow">Estudiante</span><h2>${escapeHtml(name)}</h2><p>${escapeHtml(profile?.bio || "Repositorio académico personal para organizar evidencias, trabajos y materiales del ciclo.")}</p><div class="info-grid"><div><span>Universidad</span><strong>Universidad Peruana Los Andes</strong></div><div><span>Carrera</span><strong>${escapeHtml(profile?.career || "Ingeniería de Sistemas y Computación")}</strong></div><div><span>Contenido</span><strong>16 semanas</strong></div><div><span>Acceso</span><strong>${session?"Sesión iniciada":"Público"}</strong></div></div></div></div>`);
}

function renderAdmin(){
  if(!session){
    app.innerHTML=page("Administrar","Necesitas iniciar sesión.",`<div class="panel"><p>Inicia sesión para editar tu perfil y subir archivos.</p><button class="btn primary" onclick="document.getElementById('authModal').classList.add('open')">Iniciar sesión</button></div>`);
    return;
  }
  app.innerHTML=page("Administrar","Edita tu perfil y sube archivos desde la misma página.",`
    <div class="admin-grid">
      <section class="panel">
        <span class="eyebrow">Perfil</span><h2>Editar información</h2>
        <form id="profileForm" class="form-stack">
          <label>Nombre completo<input id="fullName" value="${attr(profile?.full_name||"")}"></label>
          <label>Carrera<input id="career" value="${attr(profile?.career||"Ingeniería de Sistemas y Computación")}"></label>
          <label>Descripción<textarea id="bio" rows="4">${escapeHtml(profile?.bio||"")}</textarea></label>
          <label>Foto de perfil<input id="avatarFile" type="file" accept="image/*"></label>
          <button class="btn primary" type="submit">Guardar cambios</button>
          <p id="profileMsg" class="form-message"></p>
        </form>
      </section>

      <section class="panel">
        <span class="eyebrow">Archivos</span><h2>Subir material</h2>
        <form id="uploadForm" class="form-stack">
          <label>Semana<select id="weekSelect">${weeks.map(w=>`<option value="${w.id}">${w.title}</option>`).join("")}</select></label>
          <label>Descripción<input id="fileDescription" placeholder="Ej. Práctica de redes"></label>
          <label>Archivo<input id="repoFile" type="file" required></label>
          <button class="btn primary" type="submit">Subir archivo</button>
          <p id="uploadMsg" class="form-message"></p>
        </form>
      </section>
    </div>
    <section class="panel" style="margin-top:16px"><div class="section-head"><div><span class="eyebrow">Gestión</span><h2>Mis archivos</h2></div></div><div id="adminFiles">Cargando...</div></section>
  `);

  document.getElementById("profileForm").addEventListener("submit",saveProfile);
  document.getElementById("uploadForm").addEventListener("submit",uploadFile);
  loadAdminFiles();
}

async function saveProfile(e){
  e.preventDefault();
  const msg=document.getElementById("profileMsg");
  msg.textContent="Guardando...";
  let avatarUrl=profile?.avatar_url || null;
  const avatar=document.getElementById("avatarFile").files[0];

  if(avatar){
    const ext=avatar.name.split(".").pop();
    const path=`${session.user.id}/avatar.${ext}`;
    const {error:upErr}=await sb.storage.from("avatars").upload(path,avatar,{upsert:true});
    if(upErr){msg.textContent=upErr.message;return}
    const {data:urlData}=sb.storage.from("avatars").getPublicUrl(path);
    avatarUrl=urlData.publicUrl + `?v=${Date.now()}`;
  }

  const payload={
    id:session.user.id,
    full_name:document.getElementById("fullName").value.trim(),
    career:document.getElementById("career").value.trim(),
    bio:document.getElementById("bio").value.trim(),
    avatar_url:avatarUrl,
    updated_at:new Date().toISOString()
  };
  const {error}=await sb.from("profiles").upsert(payload);
  if(error){msg.textContent=error.message;return}
  await loadProfile(); updateAuthUI(); msg.textContent="Cambios guardados.";
}

async function uploadFile(e){
  e.preventDefault();
  const msg=document.getElementById("uploadMsg");
  const file=document.getElementById("repoFile").files[0];
  if(!file)return;
  msg.textContent="Subiendo...";
  const week=Number(document.getElementById("weekSelect").value);
  const safeName=file.name.replace(/[^a-zA-Z0-9._-]/g,"_");
  const path=`${session.user.id}/semana-${week}/${Date.now()}-${safeName}`;
  const {error:upErr}=await sb.storage.from("repository-files").upload(path,file);
  if(upErr){msg.textContent=upErr.message;return}
  const {data:urlData}=sb.storage.from("repository-files").getPublicUrl(path);
  const {error:dbErr}=await sb.from("repository_files").insert({
    user_id:session.user.id,
    week,
    file_name:file.name,
    description:document.getElementById("fileDescription").value.trim(),
    storage_path:path,
    public_url:urlData.publicUrl
  });
  if(dbErr){msg.textContent=dbErr.message;return}
  msg.textContent="Archivo subido correctamente.";
  e.target.reset(); loadAdminFiles();
}

async function loadAdminFiles(){
  const box=document.getElementById("adminFiles");
  if(!box)return;
  const {data,error}=await sb.from("repository_files").select("*").eq("user_id",session.user.id).order("created_at",{ascending:false});
  if(error){box.textContent=error.message;return}
  if(!data?.length){box.innerHTML='<div class="activity-row"><div><strong>No hay archivos</strong><span>Sube tu primer material.</span></div></div>';return}
  box.innerHTML=`<div class="file-list">${data.map(f=>`<div class="file-row"><div><strong>${escapeHtml(f.file_name)}</strong><span>Semana ${f.week} · ${escapeHtml(f.description||"Sin descripción")}</span></div><div class="week-actions"><a class="small-btn" href="${f.public_url}" target="_blank">Abrir</a><button class="small-btn" onclick="deleteFile('${f.id}','${jsstr(f.storage_path)}')">Eliminar</button></div></div>`).join("")}</div>`;
}

async function deleteFile(id,path){
  if(!confirm("¿Eliminar este archivo?")) return;
  await sb.storage.from("repository-files").remove([path]);
  const {error}=await sb.from("repository_files").delete().eq("id",id);
  if(error) alert(error.message);
  loadAdminFiles();
}

function escapeHtml(v=""){return String(v).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function attr(v=""){return escapeHtml(v)}
function jsstr(v=""){return String(v).replace(/\\/g,"\\\\").replace(/'/g,"\\'")}
