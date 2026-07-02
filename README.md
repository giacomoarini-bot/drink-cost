# Drink Cost Dashboard

App single-file per il calcolo del food cost dei cocktail, con sync cloud real-time tra tutti i dispositivi (Supabase). React via CDN, nessun build step.

## File da caricare su GitHub
- index.html — l'app completa
- manifest.json — config PWA
- icon-192.png, icon-512.png, apple-touch-icon.png, favicon.png — icone

## Come funziona il sync
- I dati (ingredienti + cocktail) vivono in una tabella Supabase (drink_cost_state) nel cloud.
- Ogni modifica viene salvata nel cloud (debounce ~0.6s) e propagata in tempo reale agli altri dispositivi via Supabase Realtime.
- localStorage resta come cache locale: apertura istantanea e funzionamento anche offline (al ritorno online risincronizza).
- In alto a destra il badge mostra lo stato: Sincronizzato (verde) / Sync… (giallo) / Offline (rosso).

Apri l'app su iPhone e su PC: modifichi su uno, compare sull'altro.

## Deploy su GitHub Pages (da iPad)
1. GitHub -> New repository -> nome es. drink-cost -> Create
2. Add file -> Upload files -> carica tutti i file elencati sopra -> Commit
3. Settings -> Pages -> Branch main / (root) -> Save
4. Dopo ~1 min: https://<tuo-username>.github.io/drink-cost/
5. Su iPhone/iPad: apri in Safari -> Condividi -> Aggiungi a Home

## Backend Supabase (gia' configurato)
- Progetto: drink-cost-dashboard (regione EU Francoforte)
- URL: https://euqojcxczzfupokoryqy.supabase.co
- Tabella drink_cost_state (id, data jsonb, client_id, updated_at), RLS + Realtime attivi
- La chiave nel file e' la publishable key (pensata per stare nel client). Le policy RLS limitano l'accesso alla sola riga del tuo workspace (ws_...).

### Nota sicurezza (onesta)
Non c'e' login: chiunque avesse URL + publishable key + workspace-id (tutti nell'index.html) potrebbe leggere/scrivere quella singola riga. Per un tool personale di food cost e' rischio basso. Per blindarlo servirebbe autenticazione (Supabase Auth o passphrase). Dimmelo e lo aggiungo.

## Reset dati
La funzione resetAll e' gia' nel codice. Posso agganciarla a un pulsante in UI.

## Formula
costo = (volume_cl / 100) x costo_al_litro — con costo/litro = prezzo_bottiglia / (formato_ml / 1000).
