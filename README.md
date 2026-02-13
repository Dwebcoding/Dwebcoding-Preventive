# Dwebcoding-Preventive[webapp]

## Descrizione
Webapp per la gestione di preventivi, con frontend statico e backend Python (Flask).

## Struttura del progetto

- `backend/` - Backend Python (Flask)
  - `app.py` - Entry point dell'applicazione
  - `pdf_utils.py` - Utility per la gestione dei PDF
  - `static/` - File statici serviti dal backend
- `frontend/` - Frontend statico
  - `assets/` - Risorse (immagini, SVG)
  - `css/` - Fogli di stile
  - `html/` - File HTML
  - `js/` - Script JavaScript

## Come iniziare

1. Clona il repository:
   ```sh
   git clone <repo-url>
   ```
2. Installa le dipendenze backend:
   ```sh
   cd backend
   pip install -r requirements.txt
   ```
3. Avvia il backend:
   ```sh
   python app.py
   ```
4. Apri i file HTML in `frontend/html/` per visualizzare il frontend.

## Contribuire

1. Fai un fork del progetto
2. Crea un branch per la tua feature (`git checkout -b feature/NomeFeature`)
3. Fai commit e push delle modifiche
4. Apri una pull request

## Licenza
[MIT](LICENSE)
