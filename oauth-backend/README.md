# Lähetejaon OAuth-palvelin

Tätä palvelinta tarvitaan vain, jos Google Drive -valtuutuksen halutaan säilyvän automaattisesti sovelluksen sulkemisen ja access tokenin vanhenemisen yli. GitHub Pages ei voi turvallisesti säilyttää refresh tokenia.

## Ympäristömuuttujat

- `APP_ORIGIN=https://temppa82.github.io` (popup-koodimallissa origin, ei sivun koko polku)
- `GOOGLE_CLIENT_ID=...apps.googleusercontent.com`
- `GOOGLE_CLIENT_SECRET=...` (vain palvelimella)
- `OAUTH_ENCRYPTION_KEY=` pitkä satunnainen salaisuus
- `OAUTH_STORE_FILE=/pysyva/data/oauth-sessions.json`
- `PORT=8787`

Palvelin pitää julkaista HTTPS-osoitteessa ja sille on annettava pysyvä levy `OAUTH_STORE_FILE`-tiedostolle. Syötä julkaistu palvelinosoite sovelluksen **OAuth-palvelimen osoite** -kenttään. Älä kopioi client secretiä tai salausta sovelluksen HTML-tiedostoon.

Google Cloud Consolessa käytetään samaa **Web application** -OAuth-clientia. Lisää sovelluksen origin Authorized JavaScript origins -kohtaan. Popup-code-flow käyttää redirect URI:na sivun originia; palvelin varmistaa sen täsmäävän `APP_ORIGIN`-arvoon.

## Google Cloud Console

1. Ota projektissa käyttöön Google Drive API. Ota lisäksi käyttöön Google Picker API ja Gmail API, jos käytät sovelluksen kansiovalitsinta ja Gmail-hakua.
2. Avaa **Google Auth Platform → Clients**. Käytä **Web application** -tyyppistä asiakasta. Jos nykyinen tunnus on Desktop- tai Android-tyyppiä, luo erillinen Web application -asiakas.
3. Lisää **Authorized JavaScript origins** -kohtaan sovelluksen origin. GitHub Pages -julkaisussa se on `https://temppa82.github.io` – ei `/Keikkajako`-polkua eikä loppukauttaviivaa.
4. Popup-koodimallissa sovellus käyttää `redirect_uri`-arvona samaa originia. Lisää se tarvittaessa myös **Authorized redirect URIs** -kohtaan täsmälleen muodossa `https://temppa82.github.io`.
5. Avaa **Data Access** ja lisää sovelluksen oikeasti pyytämät oikeudet: `https://www.googleapis.com/auth/drive` sekä Gmail-haussa `https://www.googleapis.com/auth/gmail.readonly`.
6. Lisää kotisivu, tietosuojaseloste ja käyttöehdot Brandingiin. Tämän projektin julkaistut osoitteet ovat `https://temppa82.github.io/Keikkajako/`, `https://temppa82.github.io/Keikkajako/privacy.html` ja `https://temppa82.github.io/Keikkajako/terms.html`.
7. Testauksen aikana lisää käyttäjät testikäyttäjiksi. Testaustilan valtuutukset vanhenevat Googlen käytännön mukaan seitsemässä päivässä. Jatkuvaa käyttöä varten siirrä sovellus tuotantotilaan ja suorita pyydetty tarkistus.

Nykyinen koko Driven `drive`-oikeus tarvitaan, koska ohjelma etsii käyttäjälle jaetun olemassa olevan Rahtikirjat-kansion sekä lukee ja päivittää siellä jo olevia tiedostoja ilman, että jokainen tiedosto valitaan erikseen Pickerillä. Se on rajoitettu oikeus. Julkinen tuotantosovellus tarvitsee OAuth-verifioinnin, ja Google voi vaatia lisäksi turvallisuusarvioinnin. Oikeutta voidaan myöhemmin kaventaa `drive.file`-tasolle vain muuttamalla samalla käyttötapaa niin, että kaikki käytettävät tiedostot ja kansiot valitaan tai luodaan sovelluksen kautta.

## Julkaisu ja eväste

Suositus on julkaista OAuth-palvelin sovelluksen kanssa samalle sivustolle, esimerkiksi `https://oauth.oma-domain.fi`, kun itse sovellus on `https://app.oma-domain.fi`. Tämä tekee pitkäkestoisen istuntoevästeen toiminnasta selaimissa luotettavampaa.

GitHub Pagesin ja eri sivustolla olevan OAuth-palvelimen välillä istunto käyttää suojattua `SameSite=None; Partitioned` -evästettä. Kaikki selaimet tai niiden tiukat yksityisyysasetukset eivät välttämättä säilytä sivustojen välistä evästettä. Tällöin sovellus ei voi palauttaa palvelinistuntoa automaattisesti, vaikka Googlen refresh token olisi palvelimella tallella. Tätä ei pidä kiertää tallentamalla refresh tokenia selaimeen.

Palvelinprosessin takana pitää olla HTTPS-käänteisvälityspalvelin. Säilytä `OAUTH_STORE_FILE` pysyvällä levyllä ja varmuuskopioi se yhdessä `OAUTH_ENCRYPTION_KEY`-avaimen kanssa. Jos salausavain katoaa, tallennettuja valtuutuksia ei voi enää avata.
