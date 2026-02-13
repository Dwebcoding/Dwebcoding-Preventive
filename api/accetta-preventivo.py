import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import re
import json

def handler(request):
    if request.method == "OPTIONS":
        return ("", 200, {
            "Access-Control-Allow-Origin": request.headers.get("Origin", "*"),
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Credentials": "true"
        })

    dati = request.get_json()
    email_cliente = dati.get('email')
    nome_cliente = dati.get('nome')
    servizi = dati.get('servizi', [])
    altro = dati.get('altro_descrizione', '')
    tecnologie = dati.get('tecnologie', {})
    condizioni_pagamento = ', '.join(dati.get('pagamento', []))
    validita_preventivo = dati.get('validita_preventivo', '-')
    firma_cliente = dati.get('firma_cliente', '-')
    target = dati.get('target', '-')
    tempistiche = dati.get('tempistiche', '-')
    budget = dati.get('budget', '-')
    tecnologie_frontend = ', '.join(tecnologie.get('frontend', [])) if isinstance(tecnologie.get('frontend'), list) else '-'
    tecnologie_backend = ', '.join(tecnologie.get('backend', [])) if isinstance(tecnologie.get('backend'), list) else '-'

    prezzi_sezione = {
        'Pagine': 100,
        'Pagine extra': 50,
        'Funzionalità': 150,
        'Integrazioni': 150,
        'Design': 100,
        'Accessibilità': 50,
        'SEO/Marketing': 100,
        'Assistenza': 50,
        'Lingue': 50
    }
    righe = []
    prezzo_finale = 0
    for s in servizi:
        sezione = '-'
        voce = '-'
        if isinstance(s, dict):
            servizio = s.get('servizio', '')
            if servizio.startswith('Pagina extra:'):
                sezione = 'Pagine extra'
                voce = servizio.replace('Pagina extra: ', '')
            elif servizio.startswith('Pagina:'):
                sezione = 'Pagine'
                voce = servizio.replace('Pagina: ', '')
            elif servizio.startswith('Funzionalità:'):
                sezione = 'Funzionalità'
                voce = servizio.replace('Funzionalità: ', '')
            elif servizio.startswith('Integrazione:'):
                sezione = 'Integrazioni'
                voce = servizio.replace('Integrazione: ', '')
            elif servizio.startswith('Design:'):
                sezione = 'Design'
                voce = servizio.replace('Design: ', '')
            elif servizio.startswith('Accessibilità:'):
                sezione = 'Accessibilità'
                voce = servizio.replace('Accessibilità: ', '')
            elif servizio.startswith('SEO/Marketing:'):
                sezione = 'SEO/Marketing'
                voce = servizio.replace('SEO/Marketing: ', '')
            elif servizio.startswith('Assistenza:'):
                sezione = 'Assistenza'
                voce = servizio.replace('Assistenza: ', '')
            elif servizio.startswith('Lingua:'):
                sezione = 'Lingue'
                voce = servizio.replace('Lingua: ', '')
            else:
                voce = servizio
        else:
            voce = str(s)
        prezzo = prezzi_sezione.get(sezione, 50)
        prezzo_finale += prezzo
        righe.append(f'<tr><td style="border:1px solid #1bff6a33;padding:6px 4px;">{sezione}</td><td style="border:1px solid #1bff6a33;padding:6px 4px;">{voce}</td><td style="border:1px solid #1bff6a33;padding:6px 4px;">{prezzo} €</td></tr>')
    riepilogo_servizi = '\n'.join(righe) if righe else '<tr><td colspan="3" style="text-align:center;color:#888;">Nessun servizio selezionato</td></tr>'

    # Configurazione email (modifica con i tuoi dati SMTP)
    smtp_server = 'smtp.example.com'
    smtp_port = 587
    smtp_user = 'tuo@email.com'
    smtp_password = 'password'
    mittente = smtp_user
    destinatario = email_cliente
    subject = 'Conferma accettazione preventivo'

    # Percorsi relativi alla root del progetto Vercel
    template_path = os.path.join(os.path.dirname(__file__), '..', 'backend', 'html', 'email_template.html')
    css_path = os.path.join(os.path.dirname(__file__), '..', 'backend', 'css', 'email_template.css')
    with open(template_path, encoding='utf-8') as f:
        html_template = f.read()
    with open(css_path, encoding='utf-8') as f:
        css = f.read()

    html_body = html_template
    html_body = html_body.replace('{{nome}}', nome_cliente or '-')
    html_body = html_body.replace('{{riepilogo_servizi}}', riepilogo_servizi)
    html_body = html_body.replace('{{prezzo_finale}}', str(prezzo_finale))
    html_body = html_body.replace('{{tecnologie_frontend}}', tecnologie_frontend or '-')
    html_body = html_body.replace('{{tecnologie_backend}}', tecnologie_backend or '-')
    html_body = html_body.replace('{{target}}', target or '-')
    html_body = html_body.replace('{{tempistiche}}', tempistiche or '-')
    html_body = html_body.replace('{{budget}}', budget or '-')
    html_body = html_body.replace('{{condizioni_pagamento}}', condizioni_pagamento or '-')
    html_body = html_body.replace('{{validita_preventivo}}', validita_preventivo or '-')
    html_body = html_body.replace('{{firma_cliente}}', firma_cliente or '-')
    html_body = re.sub(r'<style>.*?</style>', f'<style>{css}</style>', html_body, flags=re.DOTALL)

    msg = MIMEMultipart('alternative')
    msg['From'] = mittente
    msg['To'] = destinatario
    msg['Subject'] = subject
    msg.attach(MIMEText(html_body, 'html'))

    try:
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls()
            server.login(smtp_user, smtp_password)
            server.sendmail(mittente, destinatario, msg.as_string())
        return (json.dumps({'success': True, 'message': 'Email inviata con successo.'}), 200, {
            "Access-Control-Allow-Origin": request.headers.get("Origin", "*"),
            "Access-Control-Allow-Credentials": "true",
            "Content-Type": "application/json"
        })
    except Exception as e:
        return (json.dumps({'success': False, 'message': f'Errore invio email: {str(e)}'}), 500, {
            "Access-Control-Allow-Origin": request.headers.get("Origin", "*"),
            "Access-Control-Allow-Credentials": "true",
            "Content-Type": "application/json"
        })
