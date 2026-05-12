# AgriSmart - Farm Management AI

Sistema di gestione agricola avanzata con monitoraggio sensori, diagnostica veicoli e raccomandazioni basate su AI.

## Tecnologie utilizzate
- **Backend**: FastAPI, SQLModel (SQLAlchemy), MySQL
- **Frontend**: Next.js 15+, Tailwind CSS, Lucide React

## Setup Database (XAMPP / HeidiSQL)
1. Crea un database chiamato `AgriSmart`.
2. Assicurati che la codifica sia `utf8mb4_general_ci`.
3. Crea un utente `AgriSmart` con password `tomaru` e dai tutti i privilegi sul database `AgriSmart`.
4. Esegui il contenuto del file `setup_db.sql` per creare le tabelle necessarie.

## Configurazione Ambiente
Crea un file `.env` nella root del progetto (o nella cartella `backend`) con:
```env
DB_HOST=localhost
DB_USER=AgriSmart
DB_PASS=tomaru
DB_NAME=AgriSmart
SECRET_KEY=supersecretkey
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

## Come Avviare il Progetto su Windows

### 1. Avviare il Backend
Apri un terminale (PowerShell o CMD) nella cartella `backend`:
```powershell
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### 2. Avviare il Frontend
Apri un nuovo terminale nella cartella `frontend`:
```bash
npm install
npm run dev
```

### Ordine di Avvio
1. Assicurati che MySQL (XAMPP) sia attivo.
2. Avvia il Backend.
3. Avvia il Frontend.
4. Apri il browser su `http://localhost:3000`.

## Soluzione al problema del blocco
La causa principale del blocco era un **loop infinito di reindirizzamento** nel componente `AuthContext.tsx`. Il codice cercava di reindirizzare continuamente l'utente tra la Dashboard e la pagina di Login perché non gestiva correttamente lo stato di caricamento iniziale del token dal `localStorage`. Questo causava un consumo enorme di CPU e memoria, bloccando il browser. Abbiamo inoltre ottimizzato `next.config.ts` per evitare blocchi dovuti a richieste cross-origin non autorizzate in fase di sviluppo.
