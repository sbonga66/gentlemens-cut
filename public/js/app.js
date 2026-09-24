const App = (() => {
  const services = {
    "Signature Cut": { price: 280, duration: 45 },
    "Skin Fade": { price: 320, duration: 60 },
    "Beard Sculpt": { price: 220, duration: 30 },
    "Cut + Beard": { price: 420, duration: 75 },
    "The Executive": { price: 520, duration: 90 },
    "Kids Cut": { price: 180, duration: 30 }
  };

  const $ = (selector, root=document) => root.querySelector(selector);
  const $$ = (selector, root=document) => [...root.querySelectorAll(selector)];

  function initNav(){
    const btn = $(".menu-btn");
    const links = $(".nav-links");
    if(!btn || !links) return;
    btn.addEventListener("click", () => links.classList.toggle("open"));
    $$(".nav-links a").forEach(a => a.addEventListener("click", () => links.classList.remove("open")));
  }

  function initModal(){
    const modal = $("#offerModal");
    if(!modal) return;
    const close = () => { modal.classList.remove("show"); document.body.classList.remove("modal-open"); };
    $("#modalClose")?.addEventListener("click", close);
    modal.addEventListener("click", e => { if(e.target === modal) close(); });
    $("#claimOffer")?.addEventListener("click", () => { close(); window.location.href="booking.html?offer=welcome"; });
    if(!sessionStorage.getItem("gents_offer_seen")){
      setTimeout(() => { modal.classList.add("show"); document.body.classList.add("modal-open"); sessionStorage.setItem("gents_offer_seen","1"); }, 1800);
    }
  }

  function setMinDate(){
    const date = $("#date");
    if(date){
      const now = new Date();
      const local = new Date(now.getTime() - now.getTimezoneOffset()*60000).toISOString().split("T")[0];
      date.min = local;
      if(!date.value) date.value = local;
    }
  }

  function initBooking(){
    const form = $("#bookingForm");
    if(!form) return;

    const serviceSelect = $("#service");
    const dateInput = $("#date");
    const timeSelect = $("#time");
    const barberSelect = $("#barber");
    const summary = $("#bookingSummary");
    const alert = $("#bookingAlert");
    const confirmation = $("#confirmation");
    const params = new URLSearchParams(location.search);

    if(params.get("offer")==="welcome"){
      const note = $("#notes");
      if(note) note.value = "Welcome offer — first visit.";
      const offerMsg = $("#offerNote");
      if(offerMsg) offerMsg.textContent = "Welcome offer applied. Your first visit includes a complimentary hot towel.";
    }

    function showAlert(message, type){
      alert.textContent = message;
      alert.className = `alert show ${type}`;
    }

    function updateSummary(){
      const service = serviceSelect?.value;
      const barber = barberSelect?.value;
      const date = dateInput?.value;
      const time = timeSelect?.value;
      if($("#sumService")) $("#sumService").textContent = service || "—";
      if($("#sumBarber")) $("#sumBarber").textContent = barber || "—";
      if($("#sumDate")) $("#sumDate").textContent = date ? formatDate(date) : "—";
      if($("#sumTime")) $("#sumTime").textContent = time || "—";
      if($("#sumPrice")) $("#sumPrice").textContent = service && services[service] ? `R${services[service].price}` : "—";
    }

    function populateTimes(){
      const current = timeSelect.value;
      timeSelect.innerHTML = '<option value="">Select a time</option>';
      for(let hour=9; hour<=17; hour++){
        for(const minute of [0,30]){
          if(hour===17 && minute>0) continue;
          const value = `${String(hour).padStart(2,"0")}:${String(minute).padStart(2,"0")}`;
          const option = document.createElement("option");
          option.value=value; option.textContent=value;
          if(value===current) option.selected=true;
          timeSelect.appendChild(option);
        }
      }
      updateSummary();
    }

    function formatDate(value){
      return new Intl.DateTimeFormat("en-ZA",{day:"numeric",month:"long",year:"numeric"}).format(new Date(`${value}T12:00:00`));
    }

    function calendarPayload(){
      const service = serviceSelect.value;
      const barber = barberSelect.value;
      const date = dateInput.value;
      const time = timeSelect.value;
      const duration = services[service]?.duration || 60;
      const [h,m] = time.split(":").map(Number);
      const start = new Date(`${date}T${time}:00`);
      const end = new Date(start.getTime()+duration*60000);
      const name = $("#name").value.trim();
      const phone = $("#phone").value.trim();
      const email = $("#email").value.trim();
      const notes = $("#notes").value.trim();
      const title = `The Gentlemen's Cut — ${service}`;
      const details = `Appointment for ${name}. Barber: ${barber}. ${notes ? `Notes: ${notes}` : ""} Contact: ${phone} | ${email}`;
      return {service,barber,date,time,duration,start,end,title,details};
    }

    function googleCalendarUrl(){
      const p = calendarPayload();
      const fmt = d => {
        const pad=n=>String(n).padStart(2,"0");
        return `${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
      };
      const params = new URLSearchParams({
        action:"TEMPLATE",
        text:p.title,
        dates:`${fmt(p.start)}/${fmt(p.end)}`,
        details:p.details,
        location:"The Gentlemen's Cut, 47 Mallinson Road, Sydenham, Durban, South Africa",
        ctz:"Africa/Johannesburg"
      });
      return `https://calendar.google.com/calendar/render?${params.toString()}`;
    }

    function downloadICS(){
      const p = calendarPayload();
      const pad=n=>String(n).padStart(2,"0");
      const localFmt = d => `${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
      const escapeICS = s => String(s).replace(/\\/g,"\\\\").replace(/\n/g,"\\n").replace(/,/g,"\\,").replace(/;/g,"\\;");
      const uid = `${Date.now()}@gentlemenscut.co.za`;
      const ics = [
        "BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//The Gentlemen's Cut//Booking//EN",
        "CALSCALE:GREGORIAN","METHOD:PUBLISH","BEGIN:VEVENT",
        `UID:${uid}`,
        `DTSTAMP:${localFmt(new Date())}`,
        `DTSTART;TZID=Africa/Johannesburg:${localFmt(p.start)}`,
        `DTEND;TZID=Africa/Johannesburg:${localFmt(p.end)}`,
        `SUMMARY:${escapeICS(p.title)}`,
        `DESCRIPTION:${escapeICS(p.details)}`,
        "LOCATION:The Gentlemen's Cut, 47 Mallinson Road, Sydenham, Durban, South Africa",
        "END:VEVENT","END:VCALENDAR"
      ].join("\r\n");
      const blob = new Blob([ics],{type:"text/calendar;charset=utf-8"});
      const url = URL.createObjectURL(blob);
      const a=document.createElement("a"); a.href=url; a.download="gentlemens-cut-appointment.ics"; a.click();
      setTimeout(()=>URL.revokeObjectURL(url),1000);
    }

    serviceSelect?.addEventListener("change", updateSummary);
    barberSelect?.addEventListener("change", updateSummary);
    dateInput?.addEventListener("change", updateSummary);
    timeSelect?.addEventListener("change", updateSummary);
    $("#googleCalendar")?.addEventListener("click",()=>window.open(googleCalendarUrl(),"_blank","noopener"));
    $("#appleCalendar")?.addEventListener("click",downloadICS);

    form.addEventListener("submit", async e => {
      e.preventDefault();
      alert.className="alert";
      confirmation.classList.remove("show");

      const payload = Object.fromEntries(new FormData(form).entries());
      try{
        const response = await fetch("/api/bookings",{
          method:"POST",
          headers:{"Content-Type":"application/json"},
          body:JSON.stringify(payload)
        });
        const data = await response.json();
        if(!response.ok) throw new Error(data.message || "Booking failed.");
        showAlert(data.message,"success");
        confirmation.classList.add("show");
        $("#confirmationText").textContent = `${payload.service} with ${payload.barber} on ${formatDate(payload.date)} at ${payload.time}.`;
        form.scrollIntoView({behavior:"smooth",block:"start"});
      }catch(err){
        showAlert(err.message,"error");
      }
    });

    setMinDate();
    populateTimes();
    updateSummary();
  }

  function initContactForm(){
    const form=$("#contactForm");
    if(!form) return;
    form.addEventListener("submit",e=>{
      e.preventDefault();
      const toast=$("#contactToast");
      toast.textContent="Thanks — your message has been received. We'll get back to you shortly.";
      toast.classList.add("show");
      form.reset();
      setTimeout(()=>toast.classList.remove("show"),4500);
    });
  }

  document.addEventListener("DOMContentLoaded",()=>{
    initNav();
    initModal();
    initBooking();
    initContactForm();
  });

  return {};
})();