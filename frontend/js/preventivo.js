document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('preventivoForm');
    const risultato = document.getElementById('risultato');

    // Mappatura tipi sito -> tecnologie
    const tecnologiePerTipo = {
        vetrina: {
            frontend: ['HTML', 'CSS', 'JavaScript'],
            backend: []
        },
        ecommerce: {
            frontend: ['HTML', 'CSS', 'JavaScript', 'Bootstrap', 'React'],
            backend: ['PHP', 'Python', 'Node.js', 'MySQL', 'MongoDB']
        },
        blog: {
            frontend: ['HTML', 'CSS', 'JavaScript', 'Vue.js'],
            backend: ['PHP', 'Python', 'MySQL']
        },
        portfolio: {
            frontend: ['HTML', 'CSS', 'JavaScript'],
            backend: []
        },
        landing: {
            frontend: ['HTML', 'CSS', 'JavaScript'],
            backend: []
        },
        booking: {
            frontend: ['HTML', 'CSS', 'JavaScript', 'Bootstrap'],
            backend: ['PHP', 'Python', 'Node.js', 'MySQL']
        }
    };

    function getTecnologieSelezionate() {
        const obiettivo = form.querySelector('input[name="obiettivo"]:checked');
        let frontend = [];
        let backend = [];
        if (obiettivo) {
            const tipo = obiettivo.value;
            if (tecnologiePerTipo[tipo]) {
                frontend = tecnologiePerTipo[tipo].frontend;
                backend = tecnologiePerTipo[tipo].backend;
            }
        }
        return { frontend, backend };
    }

    function aggiornaListaTecnologieFinale() {
        const tecnologie = getTecnologieSelezionate();
        const lista = document.getElementById('lista_tecnologie_finale');
        lista.innerHTML = `<strong style="color:#111;">Tecnologie e dipendenze selezionate:</strong><ul style="margin:8px 0 0 0;padding-left:18px;color:#111;">
            <li><span style="color:#111;"><strong>Frontend:</strong> ${tecnologie.frontend.length ? tecnologie.frontend.join(', ') : 'Nessuna'}</span></li>
            <li><span style="color:#111;"><strong>Backend:</strong> ${tecnologie.backend.length ? tecnologie.backend.join(', ') : 'Nessuna'}</span></li>
        </ul>`;
    }

    form.querySelectorAll('input[name="obiettivo"]').forEach(radio => {
        radio.addEventListener('change', aggiornaListaTecnologieFinale);
    });
    aggiornaListaTecnologieFinale();

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        // Raccogli tutte le voci richieste
        const formData = new FormData(form);
        // Riepilogo di tutte le voci selezionate dal cliente
        const servizi = [];
        // Pagine principali
        formData.getAll('pagine_principali').forEach(val => {
            servizi.push({ servizio: `Pagina: ${val}`, quantita: 1, prezzo_unitario: '', totale: '' });
        });
        // Funzionalità extra
        formData.getAll('funzionalita').forEach(val => {
            servizi.push({ servizio: `Funzionalità: ${val}`, quantita: 1, prezzo_unitario: '', totale: '' });
        });
        // Integrazioni
        formData.getAll('integrazioni').forEach(val => {
            servizi.push({ servizio: `Integrazione: ${val}`, quantita: 1, prezzo_unitario: '', totale: '' });
        });
        // Design
        formData.getAll('design').forEach(val => {
            servizi.push({ servizio: `Design: ${val}`, quantita: 1, prezzo_unitario: '', totale: '' });
        });
        // Accessibilità
        formData.getAll('accessibilita').forEach(val => {
            servizi.push({ servizio: `Accessibilità: ${val}`, quantita: 1, prezzo_unitario: '', totale: '' });
        });
        // SEO
        formData.getAll('seo').forEach(val => {
            servizi.push({ servizio: `SEO/Marketing: ${val}`, quantita: 1, prezzo_unitario: '', totale: '' });
        });
        // Assistenza
        formData.getAll('assistenza').forEach(val => {
            servizi.push({ servizio: `Assistenza: ${val}`, quantita: 1, prezzo_unitario: '', totale: '' });
        });
        // Pagine extra
        formData.getAll('pagine_extra').forEach(val => {
            servizi.push({ servizio: `Pagina extra: ${val}`, quantita: 1, prezzo_unitario: '', totale: '' });
        });
        // Lingue
        formData.getAll('lingue').forEach(val => {
            servizi.push({ servizio: `Lingua: ${val}`, quantita: 1, prezzo_unitario: '', totale: '' });
        });
        // Target
        formData.getAll('target').forEach(val => {
            servizi.push({ servizio: `Target: ${val}`, quantita: 1, prezzo_unitario: '', totale: '' });
        });
        // Modalità preventivo
        if (formData.get('modalita')) {
            servizi.push({ servizio: `Modalità preventivo: ${formData.get('modalita')}`, quantita: 1, prezzo_unitario: '', totale: '' });
        }
        // Tempistiche
        if (formData.get('tempistiche')) {
            servizi.push({ servizio: `Tempistiche: ${formData.get('tempistiche')}`, quantita: 1, prezzo_unitario: '', totale: '' });
        }
        // Budget
        if (formData.get('budget')) {
            servizi.push({ servizio: `Budget: ${formData.get('budget')}`, quantita: 1, prezzo_unitario: '', totale: '' });
        }
        // Condizioni di pagamento
        const pagamento = formData.getAll('pagamento');
        // Validità preventivo
        const validita_preventivo = formData.get('validita_preventivo');
        // Privacy e GDPR
        const privacy = formData.get('privacy') ? true : false;
        // Termini e condizioni
        const termini = formData.get('termini') ? true : false;
        // Firma cliente
        const firma_cliente = formData.get('firma_cliente');
        // Totale preventivo: somma fittizia (150€ per voce)
        let totalePreventivo = servizi.length * 150;
        // Salva tutto in localStorage, aggiungendo tecnologie selezionate
        const tecnologie = getTecnologieSelezionate();
        localStorage.setItem('riepilogoPreventivo', JSON.stringify({
            servizi,
            pagamento,
            validita_preventivo,
            privacy,
            termini,
            firma_cliente,
            totalePreventivo,
            tecnologie
        }));
        // Vai alla pagina di riepilogo
        window.location.href = '/frontend/html/preventivo_riepilogo.html';
    });
});
