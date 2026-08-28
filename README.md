# draosmusic.ro

Site de prezentare pentru **DRAOS** — DJ. O singură pagină, HTML + CSS pur, fără JavaScript, fără cookie-uri, fără servicii externe (fonturile și iconițele sunt self-hosted).

## Structură

| Fișier | Rol |
|---|---|
| `index.html` | Pagina principală (texte, linkuri, playere, contact) |
| `styles.css` | Tot designul |
| `fonts.css` + `fonts/` | Fonturi self-hosted (Righteous, Poppins — subseturi latin + latin-ext pentru diacritice) |
| `img/` | Poze, imagine Open Graph, thumbnail-uri playere, favicon-uri |
| `confidentialitate.html` | Politica de confidențialitate (fără cookie-uri; playere la click) |
| `404.html` | Pagină de eroare |
| `manifest.json` + `sitemap.xml` + `robots.txt` | PWA-lite + SEO |
| `CNAME` | Domeniul custom pentru GitHub Pages |

## Cum editezi

Textele (tagline, descrieri) se schimbă direct în `index.html`. Culorile sunt variabile CSS la începutul `styles.css` (`:root`).

## Publicare pe GitHub Pages

1. Creează un repository public (ex. `draosmusic`) și urcă aceste fișiere pe branch-ul `main`.
2. În repo: **Settings → Pages → Source: Deploy from a branch → `main` / `/ (root)` → Save**.
3. Fișierul `CNAME` setează automat domeniul custom `draosmusic.ro`.
4. După ce DNS-ul propagă, bifează **Enforce HTTPS** (poate dura până la 24 h până devine disponibil).
5. Recomandat: verifică domeniul în **Settings → Pages → Verified domains** (previne preluarea domeniului de alt cont).

## DNS la registrarul domeniului `.ro`

| Tip | Host | Valoare |
|---|---|---|
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| AAAA | `@` | `2606:50c0:8000::153` |
| AAAA | `@` | `2606:50c0:8001::153` |
| AAAA | `@` | `2606:50c0:8002::153` |
| AAAA | `@` | `2606:50c0:8003::153` |
| CNAME | `www` | `NUME-CONT.github.io` |

(Înlocuiește `NUME-CONT` cu username-ul contului GitHub pe care e repo-ul. Nu folosi wildcard `*` în DNS.)
