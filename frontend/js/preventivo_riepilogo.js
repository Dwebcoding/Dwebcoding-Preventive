// Script per mostrare il riepilogo del preventivo sulla seconda pagina
window.onload = function() {
    const dati = JSON.parse(localStorage.getItem('riepilogoPreventivo'));
    if (!dati) {
        document.getElementById('riepilogo').innerHTML = '<p>Nessun dato disponibile.</p>';
        return;
    }
    let html = '';
        // Mostra tecnologie/dipendenze selezionate
        const sezioniMostrate = new Set();
        if (dati.tecnologie) {
            html += '<fieldset><legend>Tecnologie e dipendenze selezionate</legend>';
            html += `<p><strong>Frontend:</strong> ${dati.tecnologie.frontend.length ? dati.tecnologie.frontend.join(', ') : 'Nessuna'}</p>`;
            html += `<p><strong>Backend:</strong> ${dati.tecnologie.backend.length ? dati.tecnologie.backend.join(', ') : 'Nessuna'}</p>`;
            html += '</fieldset>';
        }
        // Segna privacy e termini come già mostrati se sono presenti
        if (typeof dati.privacy !== 'undefined') sezioniMostrate.add('privacy');
        if (typeof dati.termini !== 'undefined') sezioniMostrate.add('termini');
    // Rimuovo voci duplicate e mostro solo se ci sono servizi
    if (dati.servizi && dati.servizi.length > 0) {
        // Raggruppa per sezione e prepara prezzi
        const sezioni = {
            'Pagine': [],
            'Funzionalità': [],
            'Integrazioni': [],
            'Design': [],
            'Accessibilità': [],
            'SEO/Marketing': [],
            'Assistenza': [],
            'Pagine extra': [],
            'Lingue': []
        };
        // Mappa prezzi per sezione (modificabile in futuro)
        const prezziSezione = {
            'Pagine': 100,
            'Pagine extra': 50,
            'Funzionalità': 150,
            'Integrazioni': 150,
            'Design': 100,
            'Accessibilità': 50,
            'SEO/Marketing': 100,
            'Assistenza': 50,
            'Lingue': 50
        };
        // Array per righe tabella: {sezione, voce, prezzo}
        const righe = [];
        // Array per dettagli senza prezzo
        const dettagli = [];
        dati.servizi.forEach(s => {
            let sezione = '';
            let voce = '';
            let isDettaglio = false;
            if (s.servizio.startsWith('Pagina extra:')) { sezione = 'Pagine extra'; voce = s.servizio.replace('Pagina extra: ', ''); }
            else if (s.servizio.startsWith('Pagina:')) { sezione = 'Pagine'; voce = s.servizio.replace('Pagina: ', ''); }
            else if (s.servizio.startsWith('Funzionalità:')) { sezione = 'Funzionalità'; voce = s.servizio.replace('Funzionalità: ', ''); }
            else if (s.servizio.startsWith('Integrazione:')) { sezione = 'Integrazioni'; voce = s.servizio.replace('Integrazione: ', ''); }
            else if (s.servizio.startsWith('Design:')) { sezione = 'Design'; voce = s.servizio.replace('Design: ', ''); }
            else if (s.servizio.startsWith('Accessibilità:')) { sezione = 'Accessibilità'; voce = s.servizio.replace('Accessibilità: ', ''); }
            else if (s.servizio.startsWith('SEO/Marketing:')) { sezione = 'SEO/Marketing'; voce = s.servizio.replace('SEO/Marketing: ', ''); }
            else if (s.servizio.startsWith('Assistenza:')) { sezione = 'Assistenza'; voce = s.servizio.replace('Assistenza: ', ''); }
            else if (s.servizio.startsWith('Lingua:')) { sezione = 'Lingue'; voce = s.servizio.replace('Lingua: ', ''); }
            else if (s.servizio.startsWith('Target:')) { isDettaglio = true; dettagli.push({ sezione: 'Target', voce: s.servizio.replace('Target: ', '') }); }
            else if (s.servizio.startsWith('Modalità preventivo:')) { isDettaglio = true; dettagli.push({ sezione: 'Modalità preventivo', voce: s.servizio.replace('Modalità preventivo: ', '') }); }
            else if (s.servizio.startsWith('Tempistiche:')) { isDettaglio = true; dettagli.push({ sezione: 'Tempistiche', voce: s.servizio.replace('Tempistiche: ', '') }); }
            else if (s.servizio.startsWith('Budget:')) { isDettaglio = true; dettagli.push({ sezione: 'Budget', voce: s.servizio.replace('Budget: ', '') }); }
            if (sezione) {
                righe.push({ sezione, voce, prezzo: prezziSezione[sezione] || 50 });
            }
        });
        // Raggruppa le voci per sezione per mostrare una sola card per sezione
        serviziHtml = '<div class="dettaglio-servizi-section">';
        serviziHtml += '<h3 style="margin-bottom:12px;">Servizi e costi</h3>';
        serviziHtml += '<div class="dettaglio-servizi-cards">';
        let prezzoFinale = 0;
        // Raggruppamento per sezione
        const gruppi = {};
        righe.forEach(r => {
            if (!gruppi[r.sezione]) gruppi[r.sezione] = { voci: [], prezzo: 0 };
            gruppi[r.sezione].voci.push(r.voce);
            gruppi[r.sezione].prezzo += r.prezzo;
        });
        // SVG minimal per i titoli delle card (icone nere)
        const iconeSezione = {
            'Pagine': '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#111" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="3"/><path d="M7 4v16"/></svg>',
            'Funzionalità': '<img src="../assets/images/logo/settings.svg" alt="Funzionalità" style="width:28px;height:28px;vertical-align:middle;filter:invert(0);">',
            'Integrazioni': '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#111" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="12" r="3"/><circle cx="16" cy="12" r="3"/><path d="M13 12h-2"/></svg>',
            'Design': '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#111" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="4"/><path d="M4 9h16"/></svg>',
            'Accessibilità': '<img src="../assets/images/logo/key.svg" alt="Accessibilità" style="width:28px;height:28px;vertical-align:middle;filter:invert(0);">',
            'SEO/Marketing': '<img src="../assets/images/logo/growth-chart-invest.svg" alt="SEO/Marketing" style="width:28px;height:28px;vertical-align:middle;filter:invert(0);">',
            'Assistenza': '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#111" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v.01"/><path d="M12 8v4"/></svg>',
            'Pagine extra': '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#111" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="3"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>',
            'Lingue': '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#111" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 0 20"/><path d="M12 2a15.3 15.3 0 0 0 0 20"/></svg>'
        };
        // Mapping SVG minimal per voci note (puoi ampliare)
        const iconeVoci = {
                        // Sottovoci dettagliate
                        'giovani': { svg: '<svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="#111" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="10" cy="7" r="3.2"/><path d="M3 18c0-3.2 3.2-5.5 7-5.5s7 2.3 7 5.5"/></svg>', testo: 'giovani' },
                        'digitale': { svg: '<svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="#111" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="14" height="10" rx="2"/><rect x="7" y="9" width="6" height="2" rx="1"/></svg>', testo: 'digitale' },
                        'urgente': { svg: '<svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="#111" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="10" cy="10" r="8"/><path d="M10 5v5l3 3"/></svg>', testo: 'urgente' },
                        'adulti': { svg: '<svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="#111" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="10" cy="7" r="3.2"/><path d="M2 18c0-4 4-7 8-7s8 3 8 7"/></svg>', testo: 'adulti' },
                        'aziende': { svg: '<svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="#111" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7" width="14" height="8" rx="2"/><path d="M7 7V5a3 3 0 0 1 6 0v2"/></svg>', testo: 'aziende' },
                        'standard': { svg: '<svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="#111" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="12" height="12" rx="3"/></svg>', testo: 'standard' },
                        'base': { svg: '<svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="#111" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="5" width="10" height="10" rx="2"/></svg>', testo: 'base' },
                        'avanzato': { svg: '<svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="#111" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><polygon points="10,3 17,17 3,17"/></svg>', testo: 'avanzato' },
                        'premium': { svg: '<svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="#111" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="10" cy="10" r="8"/><path d="M10 6v4l3 2"/></svg>', testo: 'premium' },
                        'rapido': { svg: '<svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="#111" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M2 10h16M10 2l4 8-4 8"/></svg>', testo: 'rapido' },
                        'mensile': { svg: '<svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="#111" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="14" height="10" rx="2"/><path d="M7 9h6M7 13h6"/></svg>', testo: 'mensile' },
                        'annuale': { svg: '<svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="#111" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="10" cy="10" r="8"/><path d="M10 2v16"/></svg>', testo: 'annuale' },
            // Pagine
            'Home': { svg: '<svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="#111" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9.5L10 4l7 5.5"/><path d="M4 10v6a1 1 0 0 0 1 1h2.5a1 1 0 0 0 1-1v-2.5a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1V17a1 1 0 0 0 1 1H15a1 1 0 0 0 1-1v-6"/></svg>', testo: 'Home' },
            'Chi siamo': { svg: '<svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="#111" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="10" cy="7" r="4"/><path d="M2 18c0-3.5 3.5-6 8-6s8 2.5 8 6"/></svg>', testo: 'Chi siamo' },
            'Contatti': { svg: '<svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="#111" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="16" height="10" rx="2"/><path d="M2 5l8 7 8-7"/></svg>', testo: 'Contatti' },
            'Servizi': { svg: '<svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="#111" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="10" cy="10" r="8"/><path d="M10 6v4l2 2"/></svg>', testo: 'Servizi' },
            'Blog': { svg: '<svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="#111" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="14" height="12" rx="2"/><path d="M7 8h6M7 12h4"/></svg>', testo: 'Blog' },
            'Portfolio': { svg: '<svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="#111" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="16" height="9" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v2"/></svg>', testo: 'Portfolio' },
            'FAQ': { svg: '<svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="#111" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="10" cy="10" r="8"/><path d="M10 14h.01M10 10a2 2 0 1 1 2-2"/></svg>', testo: 'FAQ' },
            'Shop': { svg: '<svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="#111" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="17" r="1"/><circle cx="15" cy="17" r="1"/><path d="M5 6h14l-1.5 7h-11z"/></svg>', testo: 'Shop' },
            // Lingue
            'Italiano': { svg: '<svg width="18" height="18" viewBox="0 0 20 20" fill="none"><rect x="2" y="4" width="16" height="12" rx="2" fill="#fff"/><rect x="2" y="4" width="5.33" height="12" fill="#111"/></svg>', testo: 'Italiano' },
            'Inglese': { svg: '<svg width="18" height="18" viewBox="0 0 20 20" fill="none"><rect x="2" y="4" width="16" height="12" rx="2" fill="#fff"/><path d="M2 4l16 12M18 4L2 16" stroke="#111" stroke-width="2"/></svg>', testo: 'Inglese' },
            'Francese': { svg: '<svg width="18" height="18" viewBox="0 0 20 20" fill="none"><rect x="2" y="4" width="16" height="12" rx="2" fill="#fff"/><rect x="2" y="4" width="5.33" height="12" fill="#111"/><rect x="12.66" y="4" width="5.33" height="12" fill="#111"/></svg>', testo: 'Francese' },
            'Spagnolo': { svg: '<svg width="18" height="18" viewBox="0 0 20 20" fill="none"><rect x="2" y="4" width="16" height="12" rx="2" fill="#fff"/><rect x="2" y="4" width="16" height="3" fill="#111"/><rect x="2" y="13" width="16" height="3" fill="#111"/></svg>', testo: 'Spagnolo' },
            // Funzionalità
            'Newsletter': { svg: '<svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="#111" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="16" height="10" rx="2"/><path d="M2 5l8 7 8-7"/></svg>', testo: 'Newsletter' },
            'Login': { svg: '<svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="#111" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="10" cy="10" r="8"/><path d="M13 10l-3-3m0 0l3-3m-3 3h8"/></svg>', testo: 'Login' },
            'Registrazione': { svg: '<svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="#111" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="10" cy="7" r="4"/><path d="M2 18c0-3.5 3.5-6 8-6s8 2.5 8 6"/><path d="M10 11v4m2-2h-4"/></svg>', testo: 'Registrazione' },
            'Ricerca': { svg: '<svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="#111" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="9" r="6"/><path d="M15 15l-3-3"/></svg>', testo: 'Ricerca' },
            // ...aggiungi altre voci se vuoi
        };
        if (Object.keys(gruppi).length > 0) {
            Object.entries(gruppi).forEach(([sezione, info]) => {
                prezzoFinale += info.prezzo;
                const icona = iconeSezione[sezione] || '<svg width="28" height="28"><circle cx="14" cy="14" r="10" stroke="#19c37d" stroke-width="2.2" fill="none"/></svg>';
                // Riga icone SVG+testo minimal per ogni voce
                let vociIcons = '';
                info.voci.forEach(v => {
                    let clean = v.trim();
                    let ic = iconeVoci[clean] ? iconeVoci[clean].svg : '<svg width="16" height="16" viewBox="0 0 16 16"><circle cx="8" cy="8" r="3" stroke="#111" stroke-width="1.5" fill="none"/></svg>';
                    let tx = iconeVoci[clean] ? iconeVoci[clean].testo : clean;
                    vociIcons += `<span class="voce-icon-minimal">${ic}<span class="voce-testo-minimal">${tx}</span></span>`;
                });
                serviziHtml += `
                <div class="dettaglio-servizi-card">
                    <span class="card-icon">${icona}</span>
                    <span class="card-title">${sezione}</span>
                    <div class="voci-icons-row-minimal">${vociIcons}</div>
                    <span class="card-desc">${info.voci.length} ${sezione.toLowerCase()}</span>
                    <span class="card-price">${info.prezzo} €</span>
                </div>`;
            });
        } else {
            serviziHtml += '<div style="color:#888;">Nessun servizio selezionato.</div>';
        }
        serviziHtml += '</div>';
        serviziHtml += `<div style=\"text-align:right;margin-top:8px;font-size:1.13em;\"><strong>Prezzo finale: ${prezzoFinale} €</strong></div>`;
            // CSS per mostrare dettagli su hover (inserire in CSS):
            // .card-desc-list { position: relative; cursor: pointer; }
            // .card-details { display: none; position: absolute; left: 0; top: 120%; background: #181c1f; color: #fff; border-radius: 8px; box-shadow: 0 2px 12px #111a; padding: 10px 18px; min-width: 180px; z-index: 10; font-size: 0.98em; }
            // .card-hover-group:hover .card-details, .card-hover-group:focus .card-details { display: block; }
        // Dettaglio servizi come cards grafiche
        serviziHtml += '<div class="dettaglio-servizi-section">';
        serviziHtml += '<h3 style="margin-bottom:12px;">Dettaglio servizi</h3>';
        serviziHtml += '<div class="dettaglio-servizi-cards">';
        if (dettagli.length > 0) {
            dettagli.forEach(d => {
                // Icone SVG minimal locali per dettagli
                let icona = '<svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="#19c37d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="16" height="16" rx="4"/></svg>';
                if (d.sezione === 'Target') icona = '<img src="../assets/images/logo/target.svg" alt="Target" style="width:18px;height:18px;vertical-align:middle;">';
                else if (d.sezione === 'Modalità preventivo') icona = '<img src="../assets/images/logo/laptop.svg" alt="Modalità preventivo" style="width:18px;height:18px;vertical-align:middle;">';
                else if (d.sezione === 'Tempistiche') icona = '<img src="../assets/images/logo/timer.svg" alt="Tempistiche" style="width:18px;height:18px;vertical-align:middle;">';
                else if (d.sezione === 'Budget') icona = '<img src="../assets/images/logo/euro.svg" alt="Budget" style="width:18px;height:18px;vertical-align:middle;">';
                serviziHtml += `<div class="dettaglio-servizi-card">
                    <span class="card-icon">${icona}</span>
                    <span class="card-title">${d.sezione}</span>
                    <span class="card-desc">${d.voce}</span>
                </div>`;
            });
        } else {
            serviziHtml += '<div style="color:#888;">Nessun dettaglio selezionato.</div>';
        }
        serviziHtml += '</div></div>';

        // Dati aziendali e info legali
        serviziHtml += '<div style="margin-top:24px;padding:16px;border:1px solid #eee;background:#fafafa;border-radius:6px;color:#111;">';
        serviziHtml += '<div style="font-weight:600;font-size:16px;margin-bottom:6px;">Dati aziendali:</div>';
        serviziHtml += '<div style="margin-bottom:2px;">Dwebcoding S.r.l.</div>';
        serviziHtml += '<div style="margin-bottom:2px;">Via Esempio 123, 00100 Roma</div>';
        serviziHtml += '<div style="margin-bottom:8px;">P.IVA: IT12345678901 &nbsp; | &nbsp; C.F.: 12345678901</div>';
        serviziHtml += '<div style="margin-bottom:2px;">Data preventivo: 11/02/2026</div>';
        serviziHtml += '<div style="margin-bottom:2px;">Validità: 30 giorni dalla data di emissione</div>';
        serviziHtml += '<div style="margin-bottom:2px;">Condizioni di pagamento: Bonifico bancario 50% anticipo, 50% saldo a consegna</div>';
        serviziHtml += '<div style="margin-bottom:2px;">Note IVA: IVA esclusa, verrà applicata secondo normativa vigente</div>';
        serviziHtml += '<div style="margin-bottom:2px;">Responsabile: Mario Rossi</div>';
        serviziHtml += '</div>';
        document.getElementById('riepilogo-servizi').innerHTML = serviziHtml;
    } else {
        document.getElementById('riepilogo-servizi').innerHTML = '<em>Nessuna opzione selezionata.</em>';
    }

    // Mostra ogni sezione una sola volta
    if (dati.pagamento && dati.pagamento.length > 0 && !sezioniMostrate.has('pagamento')) {
        html += '<fieldset><legend>Condizioni di pagamento</legend>';
        html += '<ul style="margin:0;padding-left:18px;">';
        dati.pagamento.forEach(p => { if(p && p !== 'null') html += `<li>${p}</li>`; });
        html += '</ul>';
        html += '</fieldset>';
        sezioniMostrate.add('pagamento');
    }

    if (dati.validita_preventivo && dati.validita_preventivo !== 'null' && !sezioniMostrate.has('validita')) {
        html += '<fieldset><legend>Validità del preventivo</legend>';
        html += `<p>Il preventivo è valido fino al: <strong>${dati.validita_preventivo}</strong></p>`;
        html += '</fieldset>';
        sezioniMostrate.add('validita');
    }

    // Privacy e termini non devono essere generati sotto a totale preventivo se già mostrati

    if (dati.firma_cliente && dati.firma_cliente !== 'null' && !sezioniMostrate.has('firma')) {
        html += '<fieldset><legend>Firma del cliente</legend>';
        html += `<p>Firma digitale (scrivi il tuo nome e cognome):<br><strong>${dati.firma_cliente}</strong></p>`;
        html += '</fieldset>';
        sezioniMostrate.add('firma');
    }
    document.getElementById('riepilogo').innerHTML = html;

    // Logica accettazione preventivo
    document.getElementById('accetta-preventivo-btn').onclick = async function() {
        // Recupera dati riepilogo e dati form
        const datiRiepilogo = JSON.parse(localStorage.getItem('riepilogoPreventivo')) || {};
        const form = document.querySelector('form');
        const formData = new FormData(form);
        // Costruisci oggetto dati da inviare
        const dati = {
            ...datiRiepilogo,
            pagamento: formData.getAll('pagamento'),
            pagamento_altro: formData.get('pagamento_altro'),
            validita_preventivo: formData.get('validita_preventivo'),
            privacy: formData.get('privacy'),
            termini: formData.get('termini'),
            firma_cliente: formData.get('firma_cliente')
        };
        // Validazione minima
        if (!dati.privacy || !dati.termini || !dati.firma_cliente) {
            document.getElementById('risultato').innerHTML = '<span style="color:red">Devi accettare privacy, termini e firmare.</span>';
            return;
        }
        document.getElementById('risultato').innerHTML = 'Invio in corso...';
        try {
            const res = await fetch('https://dwebcoding-preventive.vercel.app/api/accetta-preventivo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dati)
            });
            const json = await res.json();
            if (json.success) {
                document.getElementById('risultato').innerHTML = '<span style="color:green;font-weight:600;">Preventivo inviato con successo! Riceverai una mail di conferma a breve.</span>';
                document.getElementById('accetta-preventivo-btn').disabled = true;
            } else {
                document.getElementById('risultato').innerHTML = '<span style="color:red">'+json.message+'</span>';
            }
        } catch (e) {
            document.getElementById('risultato').innerHTML = '<span style="color:red">Errore di rete: '+e+'</span>';
        }
    };
};
