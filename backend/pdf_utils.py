# Placeholder per la generazione PDF
# In futuro qui si potrà usare una libreria come reportlab o fpdf

def genera_pdf(dati):
    # Qui si dovrebbe generare il PDF vero e proprio
    # Per ora crea solo un file di testo come esempio
    with open('static/preventivo.pdf', 'wb') as f:
        f.write(b'Preventivo Web Dev\n')
        f.write(f"Cliente: {dati.get('nome')}\n".encode())
        f.write(f"Email: {dati.get('email')}\n".encode())
        f.write(f"Servizi: {', '.join(dati.get('servizi', []))}\n".encode())
        f.write(f"Altro: {dati.get('altro_descrizione', '')}\n".encode())
    return '/static/preventivo.pdf'
