# Lähetejako v1.88

**Tekijä:** Teemu H. Fingerroos

Selainpohjainen työkalu, jolla jaat Pamark-tyyliset lähetteet (PDF) kuljettajien kesken.

## Versio 1.88

- Karttakorjaus on käytettävissä suurennuslasista avautuvassa esikatselussa PDF-listassa, ajojärjestyksessä, lastauksessa ja kuljetuksessa. Osoitteen voi korjata tekstinä tai valita tarkan purkupaikan kartan keskellä olevalla nuppineulalla.
- Työ-PDF muodostetaan ja sitä päivitetään työn aikana vain laitteen pysyvässä tallennuksessa. Driveen ei enää tallenneta automaattisesti keikalta toiselle siirryttäessä.
- Kuljettajan vaihevalitsimen vieressä on **Tallenna Driveen**. Se varmistaa tarvittaessa Drive-yhteyden tai paikallisen Rahtikirjat-kansion oikeuden, tallentaa PDF:n valittuun päiväkansioon ja synkronoi yhteisen `AppInfo/asiakkaat.json`-tiedoston molempiin suuntiin.
- Viimeisen kuorman viimeisessä kuljetuksessa **Päivän päätös** päivittää ensin paikallisen PDF:n, vie sen Drive-kohteeseen ja synkronoi asiakasrekisterin. Jos Drive-vienti epäonnistuu, paikallinen tiedosto ja jonossa olevat asiakastietomuutokset säilyvät.
- Kohteen Info-, osoite- ja karttakorjaukset päivittyvät heti laitteen paikalliseen `asiakkaat.json`-välimuistiin myös ilman Drive-yhteyttä. Käyttöliittymä näyttää erikseen odottavien muutosten määrän sekä onnistuneen synkronoinnin.
- Vaihevalitsimen kanssa päällekkäiset **PDF-listaan**- ja **Reittiin**-painikkeet sekä näkyvä **Kuljettajan merkintä PDF:ään** -kenttä on poistettu.
- Versio 1.88 on tehty suoraan version 1.86 pohjalta. Hylätyn version 1.87 muutoksia ei ole mukana.

## Versio 1.86

- Auto voi saada automaattisesti vain sellaisen alueen keikkoja, joka on valittu sille pää- tai tasausalueeksi. Pakotus voi ohittaa aluerajan, autokielto ei koskaan.
- SLT:n paikkamäärää täydennetään erillisessä jälkitasauksessa kohti muiden ENR/LLT/JTS/MTY-autojen keskiarvoa +4…+8, kapasiteettia ja valittuja alueita rikkomatta.
- Jaon yhteenveto näyttää SLT-tavoitteen tilan, hylkäyssyiden määrät ja keikkakohtaisen jakodiagnostiikan.
- Valinnainen paikallinen oppiminen muistaa toistuvat käsin tehdyt autosiirrot. Opitut ehdotukset voi tarkistaa, poistaa tai muuttaa pysyväksi autopakotukseksi.
- Kuljettajan vaihevalitsimella voi siirtyä PDF-listan, reittioptimoinnin, lastauksen ja kuorman jakamisen välillä turvallisin esitarkistuksin.
- Paikallisen Drive-kansion asetuksissa on Palauta kansioyhteys -toiminto, joka vahvistaa luvan tai avaa kansiovalitsimen uudelleen ja yrittää odottavat tallennukset.

## Versio 1.85

- Kuljettaja voi valita tallennustavaksi Google Drive for desktopin synkronoiman paikallisen `Rahtikirjat`-kansion. Selain pyytää kansion kerran ja säilyttää kansiokahvan IndexedDB:ssä.
- PDF tallennetaan valitun ajopäivän mukaiseen polkuun `VVVV/Kuukausi/PPKKVVVV/tiedosto.pdf`. Sama tiedosto päivitetään päälle ilman `(1)`-kopioita.
- Paikallinen kansiotila käyttää yhteistä `AppInfo/asiakkaat.json`-tiedostoa. Ennen muutosta tiedosto luetaan uudelleen, muutokset yhdistetään ja edellisestä versiosta säilytetään kiinteä `asiakkaat.varmuuskopio.json`.
- Epäonnistunut PDF- tai AppInfo-kirjoitus säilyy laitteen IndexedDB-/sovellusvälimuistissa ja voidaan yrittää uudelleen.
- Google Drive API -tila ja vain laitteen tallennus säilyvät vaihtoehtoina. Gmail-haku käyttää edelleen Gmail API:a tallennustavasta riippumatta.
- Paikallinen kansiotila toimii Chromium-pohjaisissa työpöytäselaimissa, joissa `showDirectoryPicker` on käytettävissä. Puhelimella käytetään tavallisesti Drive API:a tai latausta.

## Versio 1.84

- Korjattu kuljettajan reittioptimoinnin varsinainen `null.address`-virhe yhteisestä osoitekorjaushausta. Kun osoitteelle ei ollut paikallista eikä Drive-korjausta, molemmat hakutulokset olivat `null` ja virheellinen `null === null` -vertailu avasi silti Drive-korjauksen käsittelyhaaran.
- Drive-korjauksen käsittely käynnistyy nyt vain, kun yhteinen korjaus todella löytyi. Tavallinen uusi osoite jatkaa normaalisti geokoodaukseen ja reittioptimointiin.
- Regressiotesti ajaa reittioptimoinnin oikean `resolvedAddressCorrection`-funktion kautta ilman tallennettua korjausta. Testi olisi kaatunut aikaisemmalla koodilla täsmälleen virheeseen `Cannot read properties of null (reading 'address')`.

## Versio 1.83

- Kuljettajan reittioptimoinnin PDF-poimintatulos normalisoidaan ennen osoite-, asiakas- tai tavaratietojen lukemista. Tyhjä poimintatulos ei enää aiheuta `Cannot read properties of null (reading 'address')` -virhettä.
- Puutteellinen tai rikkoutunut PDF säilyy ratkaisemattomana keikkana. Muut kelvolliset keikat optimoidaan normaalisti, ja puuttuva keikka voidaan raahata mihin tahansa kohtaan ajojärjestystä.
- Karttapiste hyväksytään reititykseen vain, kun molemmat koordinaatit ovat numeroita ja sijaitsevat Suomen alueella. Virheellinen piste siirtyy ratkaisemattomiin pysäyttämättä muuta optimointia.
- Lähtö- ja loppupiste tarkistetaan ennen tieverkkolaskentaa. Tyhjä loppuosoite käyttää edelleen lähtöpistettä.
- Osoitevarianttien käsittely ohittaa vioittuneen `null`-osoite-ehdokkaan, ja optimoinnin tekninen virheloki sisältää vain ongelmavaiheen sekä keikan perustiedot – ei PDF:n koko sisältöä.
- “Optimoi loput” normalisoi jäljellä olevat pysähdykset, säilyttää käsin valitun alkuosan ja siirtää virheelliset karttapisteet ratkaisemattomiin.

## Versio 1.82

- Ajojärjestelijän automaattinen keikkajako vastaa nyt vain kysymykseen **mille autolle toimitus kuuluu**. Se ei rakenna käyntijärjestystä, hae tieverkkoetäisyyksiä eikä käytä kilometrejä tai ajoaikaa jakopäätökseen. Kuljettajan erillinen reittioptimointi säilyy ennallaan.
- Lähtökuorman kapasiteetti on ehdoton automaattijaon raja. Aikaisempi kaksinkertaisen kapasiteetin salliva jako poistettiin; purettavia lavoja ei lasketa lähtöhetken vapaaksi tilaksi.
- SLT priorisoi pienet Helsingin keskustan ja lähialueiden ravintola- ja myöhäiset toimitukset. Sen dynaaminen tavoite on muiden nimettyjen autojen (ENR, LLT, JTS ja MTY) keskiarvo +4…+8 paikkaa, jos sopivia keikkoja ja kapasiteettia on.
- ENR painottuu Espooseen, LLT Itä-Helsinki–Mäntsälä-suuntaan, JTS Vantaa–Kerava–Järvenpää–Tuusula-alueelle ja MTY suuriin Helsingin toimituksiin. SLT:n ja MTY:n tarkoituksellinen Helsingin päällekkäisyys sallitaan.
- Jälkitasapainotus siirtää vain kokonaisia fyysisiä osoitteita, parantaa todellista työmäärää ja pitää alueen vastaanottavan auton yhteydessä. Käyttäjän lukituksia, autopakotuksia ja autokieltoja noudatetaan.
- Työmäärässä huomioidaan paikkamäärän lisäksi paino, tilavuus, lavat, rullakot, kollit ja purettaviksi soveltuvat lavat. Toimitusaika vaikuttaa vain, jos PDF:stä löytyy yksiselitteinen toimitusaikarivi.
- Autokorttien yläpuolella näkyy SLT:n paikkamäärä, muiden keskiarvo ja ero tavoitteeseen. Avattavassa yhteenvedossa näkyvät ensimmäinen ja tasattu paikkamäärä, paino, tilavuus, lavapaikat, purettavat lavat ja kapasiteetin käyttö.

## Versio 1.81

- Osoitehaku käy nyt läpi yhtenäisen ketjun PDF-poiminnasta pysyviin paikallis- ja Drive-korjauksiin, osoitevariantteihin, palvelukohtaiseen ehdokaspisteytykseen ja karttapisteeseen.
- Vanhat ja vaihtoehtoiset kadunnimet käsitellään rajatulla aliasrakenteella. Käyttäjän tallentama korjaus on aina sisäänrakennettua aliasvaihtoehtoa tärkeämpi; esimerkiksi `Länsituulentie 7, 02100 Espoo` voidaan hakea nykyisellä nimellä `Länsituuli 7`.
- Maanmittauslaitoksen geokoodaus (kun avain on asetettu), Photon ja Nominatim kokeillaan jokaiselle sallitulle osoitevariantille. Yhden palvelun “ei löydy” ei enää lopeta hakua.
- Ehdokkaalta tarkistetaan Suomi, katu tai hyväksytty alias, talonumero, postinumero ja paikkakunta. Väärässä kaupungissa oleva samanniminen katu hylätään myös silloin, kun muu hakutieto näyttää lupaavalta.
- Geokoodausvälimuistin versio nostettiin. Epäonnistunut haku on vain lyhytkestoinen muistimerkintä, ja osoitteen muokkaus, pysyvä korjaus, Drive-korjaus tai nuppineulalla tallennettu purkupaikka poistaa sen välittömästi.
- Pysyvien asiakkaiden `asiakkaat.json`-tietueisiin kertyy laajennettava `addressAliases`-luettelo alkuperäisistä ja korjatuista osoitteista. Tarkka tallennettu koordinaatti ohittaa aina uuden geokoodauksen.
- Löytymätön keikka säilyy ajojärjestyksessä raahattavana. Sen `🛠️ Haku`-painikkeesta voi avata teknisen osoitelokin ilman, että loki näkyy normaalissa kuljettajanäkymässä.

## Versio 1.80

- **Aloita alusta** tyhjentää vain nykyisen ajon PDF:t, reitin, kuittaukset, ajokohtaisen tiedoston ja päiväkansiotilan. Google OAuth -token, Drive-yhteys ja Rahtikirjat-juurikansion tunniste säilyvät.
- Uuden ajon ensimmäinen Drive-tallennus tarkistaa Rahtikirjat-juurikansion ja hakee tai luo uudelleen polun `VVVV/Kuukausi/PPKKVVVV` ennen PDF:n tallentamista.
- Päiväkansion ajokohtainen välimuisti nollataan jokaisella resetoinnilla, joten uusi työ ei ole riippuvainen edellisen työn kansiotunnisteesta.
- Paikallisen tallennuksen onnistuminen ei enää peitä Drive-virhettä. Käyttäjälle näytetään ilmoitus “Tallennettu paikallisesti, mutta Google Drive -tallennus epäonnistui”, ja Drive-tallennuksen voi yrittää uudelleen menettämättä paikallista tiedostoa.
- Resetoinnin jälkeinen Drive-tallennus on testattu usealla peräkkäisellä uudella ajolla saman ohjelmaistunnon aikana.

## Versio 1.79

- Kaikki pysyvät asiakas-, osoite- ja purkupaikkatiedot tallennetaan yhteen yhteiseen tiedostoon `Rahtikirjat/AppInfo/asiakkaat.json`. Uusia asiakaskohtaisia tai lähetekohtaisia JSON-tiedostoja ei enää luoda.
- Asiakas tai toimituspaikka tunnistetaan asiakasnumeron, yrityksen, PDF:stä luetun alkuperäisen katuosoitteen, postinumeron ja paikkakunnan avulla. PDF:n tiedostonimeä ei käytetä tunnisteena.
- Korjattu osoite sekä kartalta valittu tarkka leveys- ja pituusaste otetaan automaattisesti käyttöön saman kohteen myöhemmissä lähetteissä ennen geokoodausta.
- Yhteinen asiakasrekisteri ladataan paikalliseen välimuistiin Drive-yhdistämisen yhteydessä. Verkkokatkon aikana tehdyt muutokset jäävät pysyvään paikalliseen jonoon ja synkronoidaan myöhemmin.
- Ennen jokaista verkkotallennusta luetaan tuore Drive-versio, paikallinen muutos yhdistetään siihen ja sama tiedosto päivitetään. Version ja mahdollisen ETag-tunnisteen muutoksesta seuraa uusi luku- ja yhdistämisyritys.
- Vanhanmalliset AppInfo-osoitekorjaukset ja kohdetietolisäykset yhdistetään ensimmäisellä onnistuneella käyttökerralla `asiakkaat.json`-tiedostoon. Vanhoja tiedostoja ei poisteta.
- Navigaattorivalinta, käyttöliittymäasetukset, viimeksi käytetty auto ja muut henkilökohtaiset asetukset säilyvät vain laitteen selaimessa.

## Versio 1.78

- Paino ja tilavuus luetaan ensisijaisesti PDF:n omilta `Paino:`- ja `Tilavuus:`-riveiltä suomalaiset desimaalipilkut sekä välilyönnilliset tuhaterottimet huomioiden.
- Vaarallisten aineiden taulukon `Paino Kg`-sarake ei enää voi sekoittua koko keikan painoon.
- Kuljettajan valmiin ajojärjestyksen tuonti ja reittioptimointi säilyttävät nyt sekä painon että tilavuuden keikalla.
- Samaan keikkaan yhdistettyjen lähetteiden tiedostokohtaiset painot ja tilavuudet säilyvät ja keikan yhteissummat lasketaan oikein. Tämä korjaa myös lavojen purettavuusehdotuksen lähtötiedot.
- Lastausnäkymä näyttää löydetyn kokonaispainon ja -tilavuuden tavaramäärän yhteydessä.
- Vanha keskeneräinen kuljettajan työtila täydentää puuttuvat paino- ja tilavuustiedot automaattisesti alkuperäisistä lähetteistä päivityksen käynnistyessä.

## Versio 1.77

- Kuljettaja valitsee keikkojen ajopäivän kalenterista. Valittu päivä määrää Drive-polun `Rahtikirjat/VVVV/Kuukausi/PPKKVVVV/`, vaikka reitti valmisteltaisiin jo edellisenä päivänä.
- Ajopäivä tallentuu keskeneräiseen työtilaan ja lukitaan ensimmäisen PDF-tallennuksen yhteydessä, jotta saman työn myöhemmät merkinnät eivät siirry vahingossa toiseen päiväkansioon.
- Google Drive -yhdistäminen käyttää ensin tällä laitteella muistettua juurikansiota. Uudella laitteella ohjelma etsii automaattisesti käyttäjälle näkyvän ja muokattavan täsmälleen `Rahtikirjat`-nimisen kansion.
- Jos sopivaa kansiota ei löydy tai samannimisiä kansioita löytyy useita, ohjelma pyytää valitsemaan oikean kansion käsin. Käsivalinta säilyy varatoimintona.

## Versio 1.76

- Ajojärjestelijän Gmail-haku löytää PDF-liitteiden lisäksi ZIP-liitteet, kuten `fwdfinge13_8.zip` ja `fwdInsifinge13_8.zip`.
- Haku tarkistaa kaikki valitun päivän liiteviestit MIME-tyypin perusteella, joten ZIP voidaan tunnistaa myös silloin, kun sähköpostiohjelma ei näytä tiedostopäätettä.
- Gmail-hakutulos näyttää erikseen PDF- ja ZIP-liitteiden määrät sekä tiedostotyypin jokaisella rivillä.
- Kuljettajan Gmail-haku kertoo, että ajojärjestelijän `lahetejako_VVVV-KK-PP.zip` sisältää autokohtaiset ZIP-paketit.
- Kuljettaja voi tuoda joko oman auton ZIPin tai koko ajojärjestelijän pää-ZIPin. Useita autoja sisältävästä paketista ohjelma pyytää valitsemaan oman auton ja purkaa sen PDF:t automaattisesti.

## Versio 1.75

- Osoitehaun tulos hyväksytään vain, kun postinumero tai paikkakunta vahvistaa oikean sijainnin. Samannimistä katua väärästä kaupungista ei enää hyväksytä varatuloksena.
- Geokoodauksen välimuistiversio uusittiin, joten aikaisemmat väärät automaattiset karttaosumat eivät jää käyttöön päivityksen jälkeen.
- Käsin korjatut osoitteet ja nuppineulalla valitut purkupaikkojen koordinaatit tallennetaan paikallisen muistin lisäksi yhteiseen `Rahtikirjat/AppInfo`-kansioon.
- Muut samaa Rahtikirjat-juurikansiota käyttävät saavat uusimman yhteisen korjauksen automaattisesti PDF:n osoitteen perusteella.
- Ilman aktiivista Drive-yhteyttä tehty korjaus säilyy laitteella ja siirretään AppInfoon seuraavan Drive-yhdistämisen yhteydessä.

## Versio 1.74

- Mukana ovat julkiset `privacy.html`-tietosuojaseloste ja `terms.html`-käyttöehdot Google OAuthin sovelluslinkkejä varten.
- Käyttäjä valitsee Google Drivestä Rahtikirjat-juurikansion. PDF tallennetaan automaattisesti polkuun `VVVV/Kuukausi/PPKKVVVV/tiedosto.pdf`.
- Jokaisella kuljettajan keikalla on Kohteen info -painike. Yhteyshenkilöt, puhelinnumerot, ovikoodit, kulkuohjeet ja muut lisätiedot tallennetaan juurikansion `AppInfo`-alikansioon.
- Gmailista voi hakea valitun päivän vastaanotetut PDF-liitteet sekä ajojärjestelijän että kuljettajan näkymään. Lähetetyt viestit jätetään pois ja käyttäjä valitsee tuotavat liitteet.
- Gmail käyttää vain `gmail.readonly`-lukuoikeutta. Käsin tehtävä PDF- ja ZIP-tuonti toimii edelleen ennallaan.

## Versio 1.73

- Kuljettaja kirjoittaa yhdistetyn PDF-tiedoston nimen itse ennen tallennusta tai valmiin ajojärjestyksen lataamista.
- Sama itse valittu nimi käytetään laitteen tallennuksessa ja Google Drivessa. Puuttuva `.pdf`-pääte lisätään automaattisesti.
- Tiedostonimi säilyy keskeneräisen työtilan mukana, mutta **Aloita alusta** tyhjentää sen seuraavaa ajoa varten.
- Jos tiedostonimeä muutetaan kesken työn, seuraava tallennus luo tai valitsee uuden nimisen tiedoston eikä kirjoita vanhan nimisen tiedoston päälle.

## Versio 1.72

- Korjattu paikallisen IndexedDB-tallennuksen virhe “The database connection is closing”.
- Ohjelma tunnistaa sulkeutuvan tai vanhentuneen tietokantayhteyden, avaa uuden yhteyden ja yrittää tallennusta automaattisesti uudelleen.
- Korjaus kattaa kuljettajan työtilan, muokatut PDF:t ja niiden sisäiset varmuuskopiot.
- Paikallinen tallennus varmistetaan edelleen ennen Google Drive -päivitystä.

## Versio 1.71

- Kuljettajan asetuksiin on lisätty Google Drive -yhteys, Google-tilin yhdistäminen ja Drive-kansion valinta.
- Kansio voidaan valita Omasta Drivesta tai jaetusta Drivesta Google Pickerillä.
- Yhdistetty päivän PDF luodaan valittuun kansioon. Kuittaukset, varaumat ja lastausmerkinnät päivittävät samaa Drive-tiedostoa tiedostotunnuksen perusteella.
- Paikallinen pysyvä tallennus tehdään ennen Drive-siirtoa, joten verkkovirhe ei poista tehtyjä merkintöjä.
- Yhteys käyttää rajattua `drive.file`-oikeutta. Google-kirjautumisavainta ei tallenneta pysyvästi, joten vanhentunut istunto yhdistetään asetuksista uudelleen.

### Google Drive -käyttöönotto

1. Luo tai valitse projekti Google Cloud Consolessa.
2. Ota käyttöön Google Drive API, Google Picker API ja Gmail API.
3. Luo Web application -tyyppinen OAuth 2.0 -asiakastunnus ja lisää GitHub Pages -osoitteen alkuosa sallittuihin JavaScript-origineihin.
4. Luo Google Pickerille API-avain.
5. Lisää OAuth-suostumusnäyttöön oikeudet `https://www.googleapis.com/auth/drive` ja `https://www.googleapis.com/auth/gmail.readonly`. Testaustilassa lisää käyttäjät testikäyttäjiksi. Drive-lupa laajenee versiosta 1.73: yhteinen AppInfo ja aiemmin luodut alikansiot tarvitsevat näkyvyyden muidenkin käyttäjien tiedostoihin. Googlen lupa kattaa koko Driven, sovelluksen toiminnot on rajattu valittuun juurikansioon.
6. Syötä asiakastunnus ja API-avain Kuljettajan asetuksiin ja paina **Yhdistä Google Drive**. Ohjelma etsii täsmälleen **Rahtikirjat**-nimisen muokattavan kansion automaattisesti. Valitse kansio käsin vain, jos sitä ei löydy tai samannimisiä kansioita on useita.
7. OAuthin kotisivuksi voi antaa GitHub Pages -osoitteen. Tietosuojaseloste löytyy osoitteesta `privacy.html` ja käyttöehdot osoitteesta `terms.html`.

### v1.88 käyttöön vaiheittain

1. Pura ZIP ja lataa lahete-jako-app-kansion sisältö GitHub-repositorion juureen. Erillisiä v1.73–v1.75-päivityksiä ei tarvita. Poista GitHubissa oleva vanha irrallinen PDF erikseen, jos et halua sitä julkiseksi; päivityspaketti ei poista repositorion muita tiedostoja.
2. Tarkista, että sovelluksessa näkyy v1.88. OAuth-sivut toimivat julkaisemisen jälkeen osoitteissa `https://temppa82.github.io/Keikkajako/privacy.html` ja `https://temppa82.github.io/Keikkajako/terms.html`. Lue tekstit ja varmista ylläpitäjän tiedot ennen niiden käyttöä.
3. Ota samassa Google Cloud -projektissa käyttöön Gmail API, Google Drive API ja Google Picker API. Käytä samaa OAuth-asiakastunnusta kaikilla kuljettajilla. JavaScript-origin on `https://temppa82.github.io` ilman polkua. Rajaa Pickerin API-avain sivustolle `https://temppa82.github.io/*` ja Google Picker API:lle.
4. Drive- ja Gmail-luvat kuuluvat Googlen restricted scope -luokkaan. Julkinen käyttö voi vaatia Googlen OAuth-tarkistuksen. Testaustilassa käytä lisättyjä testikäyttäjiä; pelkkä HTML-sivujen julkaisu ei takaa Googlen hyväksyntää.
5. Yhdistä Drive uudelleen asetuksista ja hyväksy lupa. Ohjelma löytää yhden muokattavan Rahtikirjat-kansion automaattisesti. Jos samannimisiä kansioita on useita, valitse oikea käsin. Jokainen käyttäjä tarvitsee kansion kirjoitusoikeuden. Ohjelma ei muuta kansion jakamisasetuksia.
6. Valitse ajopäivä ja anna PDF:lle nimi. Esimerkiksi 6.9. valmisteltavat 7.9. keikat tallentuvat polkuun `Rahtikirjat/2026/Syyskuu/07092026/tiedosto.pdf`. Työn aikana PDF päivittyy vain laitteen pysyvään tallennukseen. Vie se valittuun Drive-kohteeseen painamalla **Tallenna Driveen** tai viimeisen keikan jälkeen **Päivän päätös**. Aloita alusta aloittaa uuden työn.
7. Kohteen Info löytyy PDF-listasta, reittilistasta, lastauksesta ja kuljetuksesta. Kohdetiedot ja osoitekorjaukset yhdistetään asiakasnumeron, vastaanottajan ja alkuperäisen toimitusosoitteen avulla yhteen `Rahtikirjat/AppInfo/asiakkaat.json`-tiedostoon. Sovellus lukee tuoreen version ennen muutosta ja yrittää uudelleen, jos toinen käyttäjä ehti päivittää tiedostoa. Vanhanmalliset erilliset JSON-tiedostot jäävät Driveen varmuuskopioiksi migraation jälkeen.
8. Hae Gmailista valitsee viestien vastaanottopäivän (ei lähetteen toimituspäivää). Rastita halutut PDF-liitteet ja paina Tuo valitut. Lähetetyt viestit ohitetaan. Sähköposteja ei muuteta eikä poisteta. Gmail-kirjautuminen tehdään erikseen; tili voi olla eri kuin Drive-tili.

Google-tilien välisiä oikeuksia ja julkaistua OAuth-kirjautumista on testattava omilla tileillä käyttöönotossa. Paketissa ei ole asiakkaiden PDF:iä, palveluavaimia eikä ovikoodeja.

## Versio 1.70

- Purkurajat täyttävät EUR- ja Teho-lavakeikat korostetaan violetilla jo kuljettajan ajojärjestyslistassa. Yhteenvedossa näkyy purkukelpoisten keikkojen määrä.
- SLT-584 saa automaattijaossa etusijan Helsingin keskustan ja lähialueiden ravintolakeikkoihin.
- SLT-584:n kapasiteettiasetuksessa on erillinen pysyvä “Keikka enintään” -raja yksittäisen keikan tilavuudelle.
- Automaattijako ei tarjoa SLT:lle tilavuusrajan ylittävää keikkaa. Ajojärjestelijän käsin tekemä siirto ja pysyvä autopakotus voivat edelleen ohittaa automaattirajan.

## Versio 1.69

- Tavaraa sisältävät seurantanumerot ovat lastaus- ja kuljetusvaiheessa yhtä suuria ja näkyviä.
- Lastausvaiheen EUR-, Teho-, rullakko- ja kollimäärät vastaavat kooltaan kuljetusvaiheen tavaramääriä.
- Seurantanumerot, joiden tavaramäärä on nolla, näytetään molemmissa vaiheissa pieninä ja tiiviinä.

## Versio 1.68

- Kuljetusvaiheen tavaraa sisältävät seurantanumerot näkyvät jälleen suurina ja selvästi erottuvina.
- Violetti seurantanumeropainike ilmaisee lastausvaiheessa, että lava täyttää asetetut purkurajat. Suositus toimii myös silloin, kun PDF:stä löytyy vain toinen tarvittavista mittaustiedoista.
- Kuljetusvaihe ei näytä purkusuosituksia. Siellä ilmoitetaan ainoastaan toteutunut purku ja siitä syntynyt kollimäärä.

## Versio 1.67

- Kuljetuksen kuittaukseen tallennetaan päivämäärän lisäksi kuittaushetken kellonaika minuutin tarkkuudella.
- Päivämäärä ja kellonaika näkyvät kuljetusnäkymän kuittaustilassa ja kirjoitetaan vastaanottajan kuittauksen mukana PDF-lähetteeseen.

## Versio 1.66

- Lastausvaiheessa näkyy aina kaksi rinnakkaista ruutua: seurantanumerot vasemmalla ja alkuperäiset tavaramäärät oikealla.
- Purettavaksi ehdotettu EUR- tai Teho-lava näkyy violetilla seurantanumeropainikkeella. Painikkeesta kirjataan, että lava on purettu, sekä purkamisesta syntynyt kollimäärä.
- Kuljetusvaiheessa puretun lähetteen EUR- ja Teho-lavat korvataan tavaramääräruudussa kirjatulla kollimäärällä. Rullakot säilyvät muuttumattomina.
- EUR-kokoisille lavoille (EUR, KEUR ja LAVA) sekä Teho-kokoisille lavoille (TEHO ja KTEHO) on kuljettajan asetuksissa omat paino- ja tilavuusrajat.
- Rullakoita ei ehdoteta purettaviksi eikä poisteta kuljetusvaiheen tavaramääristä.

## Versio 1.65

- Purettavien lavojen valinta on lastausvaiheessa, ei kuljetusvaiheessa.
- Sekä EUR- että Teho-lavat voidaan merkitä purettaviksi ja puretut määrät tallennetaan erikseen.
- Rullakoita ei merkitä purettaviksi eikä lasketa purkusuositukseen.
- Kuljettajan asetuksissa voi määrittää purkusuosituksen enimmäispainon ja enimmäistilavuuden lavapaikkaa kohden.
- Ohjelma merkitsee rajat alittavat lavat automaattisesti purettaviksi. Tyhjäksi jätettyä rajaa ei käytetä vertailussa.

## Versio 1.64

- SLT-584:n kapasiteetti lasketaan lähetteiden Tilavuus-arvojen summana kuutiometreissä (m³).
- SLT-584:n kuutiometrikapasiteettia voi muuttaa Ajojärjestelijän auton asetuksista; muiden autojen kapasiteetti säilyy lavapaikkoina.
- SLT:n tilavuus näkyy autokortissa, karttavalinnan yhteenvedossa ja autokohtaisessa yhteenvetotiedostossa.
- Jos SLT:lle jaetulta lähetteeltä puuttuu tilavuustieto, autokortti näyttää siitä varoituksen.

## Versio 1.63

- Kuljettajan PDF-tallennukset käsitellään järjestyksessä jonossa, joten kuittaus ja heti perään tehtävä varauma eivät voi kirjoittaa toistensa päälle.
- Epäonnistunutta PDF- tai työtilatallennusta yritetään automaattisesti uudelleen. Virhetilanteessa näkyy Yritä uudelleen -painike.
- Kuittauksen ja varauman teksti tallennetaan pysyvään työtilaan ennen PDF:n muodostamista.
- Jokaisesta onnistuneesta PDF-muutoksesta säilytetään enintään viisi sisäistä varmuuskopiota tiedostoa kohden. Puuttuva aktiivinen kopio voidaan palauttaa uusimmasta varmuuskopiosta.
- Lastausmerkintä tallennetaan automaattisesti kirjoittamisen jälkeen ilman sivunvaihdon odottamista.
- Toimitusosoitteen tarkistuksessa voi valita korjatun paikan kartasta. Nuppineula pysyy kartan keskellä ja karttaa liikutetaan sen alla. Koordinaatti tallennetaan pysyvästi ja sitä käytetään reitityksessä ilman uutta osoitehakua.
- Kuljetusnäkymässä tavaraa sisältävää seurantanumeroa voi painaa ja merkitä kuorman purettavaksi. Purettava seurantanumero näkyy violetilla ja sille voi kirjata puretun kolli- tai lavamäärän.
- Ajojärjestysvaiheen jokaisella keikalla on PDF-esikatselupainike.
- Ajojärjestelijän vienti muodostaa yhden pää-ZIPin, jonka sisällä on jokaiselle autolle oma ZIP. Auton ZIP sisältää yksittäiset alkuperäiset PDF-lähetteet ja yhteenvedon.

## Versio 1.62

- Grafiitinharmaata käyttöliittymää vaalennettiin kauttaaltaan.
- Kortit, kentät ja reunat erottuvat nyt selvemmin taustasta säilyttäen rauhallisen harmaan ilmeen.
- Myös erilliset karttaikkunat käyttävät samaa vaaleampaa väripalettia.

## Versio 1.61

- Käyttöliittymässä on uusi hillitty grafiitinharmaa värimaailma.
- Kortit, taustat, syöttökentät ja reunat käyttävät eri harmaan sävyjä.
- Tärkeissä toimintopainikkeissa säilyy maltillinen teräksensininen korostus käytettävyyden vuoksi.

## Versio 1.60

- Kuljettajanäkymän jokaisessa työvaiheessa on Aloita alusta -painike.
- Painike palauttaa kuljettajan työn lähtötilaan ja poistaa ohjelmasta ladatut PDF:t, reitin sekä lastaus- ja kuljetustilan.
- Tyhjennys pyytää varmistuksen. Kuljettajan asetukset ja pysyvät osoitekorjaukset säilyvät.

## Versio 1.59

- Kuljettajan työvaiheet on erotettu neljäksi omaksi ruudukseen: PDF-tiedostojen syöttö ja tarkastus, ajojärjestys, lastaus sekä kuljetus.
- Tarkista toimitusosoite -esikatselu näyttää yhden PDF-sivun kerrallaan. Sivujen välillä liikutaan omilla Edellinen sivu- ja Seuraava sivu -painikkeilla.
- Lastaus- ja kuljetusvaiheet täyttävät näytön ilman koko sivun pystysuuntaista vieritystä.
- Lastaus- ja kuljetusvaiheen Edellinen- ja Seuraava-painikkeet pysyvät samalla paikalla keikkaa vaihdettaessa.
- Lastaus-, kuljetus- ja reittivaiheista voi palata PDF-listaan ja jatkaa sen jälkeen kesken jääneeseen vaiheeseen.

## Versio 1.58

- Korjattu tyylisääntö, joka esti tavaramäärien suuren tekstikoon. Tavaramäärät vastaavat nyt suuren seurantanumeron kokoa.

## Versio 1.57

- Kuljetusnäkymän tavaramäärät näytetään yhtä suurella ja näkyvällä tekstillä kuin tärkeät seurantanumerot.

## Versio 1.56

- Kuljetusnäkymän seurantanumerot näytetään vain kerran yhdessä ruudussa.
- Tavaraa sisältävien lähetteiden seurantanumerot ovat suuria ja näkyviä; nollamääräiset seurantanumerot näkyvät pienempinä.
- EUR-, Teho-, Rullakko- ja kollimäärät ovat yhdessä viereisessä ruudussa ja vain nollaa suuremmat määrät näytetään.
- Aiempi päällekkäinen seurantanumerokohtainen erittely poistettiin.

## Versio 1.55

- Käsin korjatut osoitteet ja postinumerot jäävät laitteen muistiin ja niitä käytetään automaattisesti tulevissa lähetteissä.
- Soittopainikkeet käyttävät puhelimen oletussoittosovellusta.
- Automaattinen yhdistäminen vaatii saman toimitusosoitteen lisäksi saman yrityksen tai vastaanottajan.
- `RUL` käsitellään ja näytetään erillisenä Rullakko-tavaralajina, ei Teho-lavana.
- Yhdistetyn pysähdyksen tavaramäärät näytetään seurantanumeroittain EUR-, Teho-, Rullakko- tai kollimäärineen.
- Kuljetusnäkymän toimintopainikkeet ja seurantanumero on suurennettu puhelinkäyttöä varten.
- Kuljettajan PDF-esikatselu avautuu koko näytölle ja näyttää kaikki PDF-sivut vieritettävänä.
- Osoitehaku kokeilee tarvittaessa oikeaa katuosoitetta ja kaupunkia ilman virheellistä postinumeroa.
- Kuljettajan asetuksissa on valinta navigointikohteen lähettämiseksi toiselle laitteelle jakovalikon kautta.

## Versio 1.54

- EUR-lavoiksi lasketaan tuoterivit, joiden Tuotenro on `EUR`, `KEUR` tai `LAVA`.
- Teho-lavoiksi lasketaan tuoterivit, joiden Tuotenro on `TEHO`, `KTEHO` tai `RUL`.
- Lava- ja kollimäärä luetaan aina kyseisen tuoterivin `Toimitettu`-sarakkeesta eli rivin viimeisestä numerosta ennen yksikköä.
- Jos keikalla on EUR- tai Teho-lavoja, kollimäärää ei näytetä eikä lasketa lisäksi.
- Jos lavoja ei ole, kollimäärä luetaan Tuotenro=`KOL`-rivin `Toimitettu`-sarakkeesta. Vanhojen lähetteiden `Kolleja`-yhteenvetokenttä toimii vain varatietona, jos KOL-rivi puuttuu.
- Kuljetusnäkymä näyttää lavakeikalla vain EUR- ja Teho-lavamäärät; lavattomalla keikalla näytetään kollimäärä.
- Kuljettajan tiedostotuonnissa, lastausvaiheessa ja kuljetusvaiheessa näkyy PDF:n tallennuskohde tai tieto sovelluksen sisäisestä pysyvästä tallennuksesta.
- Selain näyttää turvallisuussyistä valitun tiedoston nimen ja tallennustavan, mutta ei paljasta kansion koko polkua.

## Versio 1.53

- Lastausvaiheen merkintä kirjoitetaan automaattisesti PDF:ään, kun kuljettaja siirtyy edelliseen tai seuraavaan keikkaan.
- Kuljettajan aktiivinen työtila, PDF:t, ajojärjestys, lastauskohta, kuljetuskohta, merkinnät, kuittaukset ja varaumat tallennetaan selaimen pysyvään laitetallennukseen ja palautetaan ohjelman uudelleenavauksessa.
- Ohjelma ylläpitää yhtä ajantasaista yhdistettyä PDF-versiota eikä käynnistä uutta selaimen latausta jokaisesta automaattitallennuksesta.
- Tiedoston suoraa tallennusta tukevissa selaimissa käyttäjä valitsee kohdetiedoston kerran, minkä jälkeen sama PDF päivitetään tiedoston päälle ilman `(1)`-kopioita.
- Kuljettajan näkymässä on uusi `Lataa valmis ajojärjestys` -painike. Valmiiksi järjestetyt PDF:t tai yhden yhdistetyn PDF:n sivut avataan suoraan lastaus- ja kuljetusvaiheeseen ilman optimointia.
- Valmiin ajojärjestyksen lisälastaukset muodostetaan kuljettajan asetuksiin tallennetun lavakapasiteetin perusteella.

## Versio 1.52

- Jokaisella `Poimitut lähetteet` -taulukon keikalla on autopakotuksen vieressä `Estä auto` -painike.
- Sama autokieltopainike on kaikissa 🔍-esikatseluissa yhdessä pysyvän autopakotuksen kanssa.
- Yhdeltä toimituspaikalta voi estää yhden tai useita autoja esimerkiksi matalan tunnelin, sillan tai ahtaan pihan vuoksi.
- Autokiellot tallentuvat osoite- ja postinumerokohtaisesti tälle laitteelle ja tulevat automaattisesti voimaan myös seuraavien päivien keikoissa.
- Jos estettävä auto oli samalla osoitteen pakotettu tai nykyinen auto, ristiriitainen pakotus poistetaan ja jo jaettu keikka palautetaan jakamattomaksi.
- Taulukossa näkyvät sekä estettyjen autojen määrä että rekisterinumerot.

## Versio 1.51

- Sama pysyvä autopakotusvalikko on käytettävissä sekä `Poimitut lähetteet` -taulukon jokaisella rivillä että jokaisessa 🔍-esikatselussa.
- Taulukosta ja esikatselusta tehty autovalinta tallentuu heti selaimeen toimitusosoitteen ja postinumeron perusteella.
- Myöhempänä päivänä ladattu saman osoitteen lähete saa automaattisesti aiemmin valitun auton.
- Valinta säilyy, kunnes käyttäjä valitsee toisen auton tai palauttaa asetukseksi `Automaattinen – ei pysyvää pakotusta`.
- Pysyvä pakotus on ehdoton: keikkaa ei tarjota muille autoille normaalissa jaossa tai jälkitasapainotuksessa.
- Jos osoitetta ei ole tunnistettu riittävästi pysyvää tallennusta varten, esikatselu pyytää korjaamaan osoitteen ja postinumeron.

## Versio 1.50

- `Poimitut lähetteet` -taulukon jokaisella keikalla on nyt oma autovalikko Auto-sarakkeessa.
- Auton valitseminen lukitsee koko fyysisen osoitteen kyseiselle autolle ja pakottaa valinnan seuraavassa `Jaa keikat autoille` -ajossa.
- Jos jako on jo tehty, valinta siirtää keikan valitulle autolle heti.
- `Automaattinen` poistaa pakotetun autovalinnan ja palauttaa keikan normaalin alue- ja tasauslogiikan piiriin seuraavassa jaossa.
- Samassa fyysisessä osoitteessa olevat PDF:t pidetään edelleen yhdessä.
- Esikatselussa asetettu autokohtainen kielto estää kielletyn auton valitsemisen myös taulukosta.

## Versio 1.49

- Ajojärjestelijän aluejako on tarkennettu 69 pieneksi lähialueeksi Helsingin, Espoon, Kauniaisten, Vantaan, Keravan, Järvenpään, Tuusulan ja Mäntsälän alueilla.
- Kaikki 204 vuoden 2026 postinumeroa kuuluvat täsmälleen yhteen lähialueeseen ilman puuttuvia tai päällekkäisiä postinumeroita.
- Pääalueet ja tasausalueet voidaan nyt kohdentaa esimerkiksi erikseen keskustan kaupunginosiin, Haagaan, Pitäjänmäkeen, Viikkiin, Puistolaan, Hakkilaan, Koivukylään, Martinlaaksoon, Matinkylään, Kilon suuntaan ja Espoon keskukseen.
- Alueluettelon uusi hakukenttä suodattaa valintoja alueen nimellä tai postinumerolla.
- Jokaisella lähialueella on oma valintapisteensä aluekartalla; nimi ja postinumerot näkyvät viemällä osoitin pisteen päälle.
- Vanhat laajemmat aluevalinnat siirretään kerran automaattisesti niitä vastaaviin uusiin lähialueisiin ja tallennetaan heti selaimeen.

## Versio 1.48

- Helsingin yhdistelmäalueet `Töölö/Pasila` ja `Kallio/Sörnäinen` on jaettu erillisiksi Pasila-, Töölö-, Arabia-, Sörnäinen- ja Kallio-valinnoiksi.
- Jokaisella uudella alueella näkyvät omat postinumerot ja sillä on oma valinta sekä pääalueeksi että tasausalueeksi.
- Aluekartalla jokaisella uudella alueella on oma valintapisteensä.
- Aiemmin tallennetut yhdistelmäaluevalinnat siirretään automaattisesti vastaaviin uusiin alueisiin, jotta nykyisten autojen asetukset eivät häviä päivityksessä.

## Versio 1.47

- Ajojärjestelijän ajoneuvokohtaisessa alueluettelossa näkyvät nyt jokaisen alueen tarkat postinumerot suoraan alueen nimen alla.
- Näytettävät postinumerot muodostetaan samasta vuoden 2026 täsmätaulukosta, jota automaattijako käyttää, joten luettelo ja jakologiikka eivät voi erkaantua toisistaan.
- Alueelle, jolla ei ole täsmätaulukossa omaa postinumeroa, näytetään tästä selkeä ilmoitus.

## Versio 1.46

- Ajojärjestelijän tiedostotuonti hyväksyy nyt PDF-tiedostojen lisäksi ZIP-paketit ja purkaa niistä kaikki PDF-lähetteet automaattisesti.
- ZIP-paketin eri kansioissa olevat samannimiset PDF:t nimetään tuonnissa yksilöllisesti, jotta yksikään lähete ei korvaa toista.
- Ajojärjestelijän 🔍-esikatseluun lisättiin keikkakohtainen oletusauto ja useita autokohtaisia kieltoja.
- Autokohtaiset säännöt koskevat koko fyysistä osoitetta ja tallentuvat selaimeen, joten sama osoite saa säännöt myös myöhemmin tuoduissa lähetteissä.
- Automaattijako kokeilee oletusautoa ensin eikä tarjoa keikkaa kielletyille autoille. Jälkitasapainotus ei siirrä oletusautolle asetettua keikkaa pois.
- Kiellettyyn autoon siirtäminen estetään myös käsinsiirrossa ja ajojärjestelijän karttavalinnassa.

## Versio 1.45

- Ajojärjestelijän aluejako käyttää nyt Tilastokeskuksen vuoden 2026 postinumero–kunta-avaimen 204 täsmällistä postinumeroa suurten numerovälien sijasta.
- Korjattu useita väärään ajosuuntaan menneitä alueita: muun muassa Itä- ja Keski-Pasila, Kulosaari, Kruunuvuorenranta, Mellunmäki, Koivukylä, Hakkila, Ylästö, Pähkinärinne, Petikko, Tuupakka sekä Viherlaakso–Jupperi.
- Lisätty aiemmin puuttuneet Tuusulan ja Mäntsälän reuna-alueiden postinumerot, kuten Kellokoski, Jokela, Nuppulinna, Ohkola, Sälinkää ja Hautjärvi.
- Tuntematonta tai virheellistä postinumeroa ei enää päätellä väljällä numerovälillä väärään alueeseen, vaan se merkitään muuksi alueeksi.

## Versio 1.44

- Kuittaus ja varauma kirjoitetaan PDF:ään heti, kun käyttäjä painaa `Tallenna PDF:ään`.
- Tallennusikkuna sulkeutuu vasta PDF:n onnistuneen kirjoituksen ja pysyvän laitetallennuksen jälkeen.
- Päivitetyt PDF-tiedostot sekä kuittaus- ja varaumatiedot varmistetaan selaimen IndexedDB-tallennukseen.
- Kun sama alkuperäinen lähete tuodaan myöhemmin uudelleen, ohjelma palauttaa sille tallennetun PDF-version ja merkinnät.
- Kuljetusrivillä näkyy onnistuneen tallennuksen kellonaika. Virhetilanteessa ikkuna jää auki ja tarjoaa uuden yrityksen.

## Versio 1.43

- Korjattu Kuittaus- ja Varaumat-painikkeet: tekstin syöttöikkuna avautuu jälleen normaalisti kuljetusnäkymässä.
- Kuittaus kirjoitetaan vastaanottajan kuittaus-, päivämäärä- ja nimenselvennysruutuun.
- Varaumat kirjoitetaan erilliseen `Varaumat`-ruutuun kuittauskentän alapuolelle.
- Molempien kenttien sijoittelu tarkistettiin renderöidystä testilähetteestä.

## Versio 1.42

- Myös viimeisen kuorman viimeisen lastattavan keikan jälkeen avautuu aina `Kuljetukseen`-ruutu.
- Viimeisen kuorman kuljetuksen päättäminen avaa selkeän `Kuljetukset valmiit` -näkymän.
- Kuljetusnäkymässä Navigointi-, Kuittaus-, Varaumat-, Esikatselu- ja soittopainikkeet ovat käytössä kuormakohtaisesti.
- Kiinteä PDF-esikatselu poistettiin kuljetusnäkymästä. Koko monisivuinen lähete avautuu erillisestä Esikatselu-painikkeesta.
- Kuljetusnäkymässä näkyvät suurina osoite, seurantanumero, EUR-lavat, Teho-lavat ja kollimäärä. Painikkeita ja tekstejä suurennettiin puhelinkäyttöä varten.

## Versio 1.41

- Kuormien välisen `Kuljetukseen`-ruudun uusi painike avaa juuri valmistuneen kuorman kuljetusnäkymän.
- Kuljetusnäkymässä näytetään vain kyseisen kuorman keikat oikeassa toimitusjärjestyksessä.
- Viimeisen keikan kohdalla `Kuorma toimitettu – seuraavaan lastaukseen` palauttaa seuraavan kuorman ensimmäiseen lastattavaan keikkaan.
- Kuljetusnäkymän navigointi, koko PDF:n esikatselu, kuittaus, varaumat ja soittopainikkeet ovat käytössä kuormakohtaisesti.

## Versio 1.40

- Seurantanumeron tunnistus säilyttää nyt myös arvon sisäiset välilyönnit, esimerkiksi `647 W1-2`.
- Jokaisen kuormarajan kohdalle lisätään lastausnäkymään erillinen `Kuljetukseen`-vaihe.
- Seuraavan kuorman lastauskohteet näytetään vasta, kun kuljettaja jatkaa Kuljetukseen-vaiheesta seuraavaan kuormaan.
- Kuormien sisäinen käänteinen lastausjärjestys ja koko PDF:n esikatselu säilyvät ennallaan.

## Versio 1.39

- Lastausjärjestys käännetään jokaisen kuorman sisällä: viimeinen toimitus lastataan ensin ja ensimmäinen toimitus viimeiseksi.
- Lisälastaukset käsitellään omina kuorminaan, joten yhden kuorman kääntäminen ei sekoita seuraavan kuorman järjestystä.
- Lastausnäkymässä näkyvät erikseen lastausjärjestys, kuorman numero ja varsinainen ajojärjestys.
- Nykyisen keikan `Esikatselu – koko PDF` näyttää lähetteen kaikki sivut. Jos samalla keikalla on useita PDF:iä, niitä voi selata erikseen.

## Versio 1.38

- **Lastausvaihe:** `Yhdistä ja lataa PDF:t` avaa puhelimelle optimoidun näkymän, jossa näytetään yksi keikka kerrallaan.
- Näkymässä näkyvät suurina toimitusosoite, seurantanumero sekä EUR-/Teho-lavat tai lavattomalla keikalla kollimäärä.
- Edellinen- ja Seuraava-painikkeilla voi seurata lastauksen etenemistä keikka kerrallaan. Kuorman numero huomioi kartalle lisätyt lastaukset.
- Kuljettajan merkintä tallentuu automaattisesti laitteelle. `Lataa päivitetty PDF` kirjoittaa kaikki tallennetut merkinnät lähetteisiin; tyhjäksi poistettu merkintä ei tule uuteen PDF:ään.

## Versio 1.37

- Lastausten määrällä ei ole enää kahden lastauksen rajoitusta.
- Kapasiteettilaskenta lisää automaattisesti lastaukset 2, 3, 4 ja niin edelleen niin monta kertaa kuin kuorma vaatii.
- **Lisää lastaus** lisää käsin uuden lastausrajan viimeksi valitun keikan jälkeen.
- **Poista lastaus** poistaa reitin viimeisimmän käsin lisätyn lastauksen. Kapasiteetin vaatimat lastaukset säilyvät.
- Kartan lastausmerkinnät näkyvät muodossa L2, L3, L4 ja niin edelleen.
- Jokaisen kuljettajan karttapallon tekstikuplassa näkyvät vastaanottajan ja osoitteen lisäksi EUR-lavat, Teho-lavat sekä lasketut lavapaikat.
- Reittiviiva, kilometrilaskenta ja kuormayhteenveto huomioivat kaikki lastauskerrat.
- ZIP-paketti ei sisällä PDF-esimerkkitiedostoa.

## Versio 1.36

- Kuljettajan reitille voidaan merkitä toinen lastaus pysähdysten väliin.
- Kartan **Merkitse 2. lastaus tähän** sijoittaa paluun lastausosoitteeseen viimeksi valitun pysähdyksen jälkeen.
- Toinen lastaus voidaan merkitä sekä erillisessä karttaikkunassa että pääsivun reittikortissa.
- Jos valittujen pysähdysten lavapaikat ylittävät auton kapasiteetin, ohjelma lisää toisen lastauksen automaattisesti ennen ylittävää keikkaa.
- Automaattisesti optimoitu reitti ja **Optimoi loput** lisäävät kapasiteetin vaatiman lastausrajan myös valmiiseen järjestykseen.
- Kartalla toinen lastaus näkyy violettina **2L**-merkintänä ja reittiviiva käy lastausosoitteessa ennen seuraavaa kuormaa.
- Kilometrilaskenta huomioi paluun lastaukseen. Yhteenvedossa näkyvät ensimmäisen ja toisen kuorman lavapaikat erikseen.
- PDF-tiedostot pysyvät keikkojen ajojärjestyksessä; lastausmerkintä ei lisää PDF-sivua.
- ZIP-paketti ei sisällä PDF-esimerkkitiedostoa.

## Versio 1.35

- Kuljettajan asetuksiin on lisätty kuljettajan nimi, auton rekisterinumero ja maksimi lavamäärä eli kapasiteetti.
- Asetukset muistetaan kyseisellä laitteella.
- **Yhdistä ja lataa PDF:t** nimeää tiedoston muodossa `KuljettajannimiPVKKVVVV.pdf`, esimerkiksi `Teemu01092026.pdf`.
- Reittiyhteenvedossa näytetään auton rekisterinumero sekä käytetyt ja käytettävissä olevat lavapaikat.
- Kapasiteetin ylitys näytetään varoituksena. EUR-lava käyttää yhden ja Teho-lava puoli lavapaikkaa.
- ZIP-paketti ei sisällä PDF-esimerkkitiedostoa.

## Versio 1.34

- Kuljettaja voi valita kartalta yhden tai useamman ensimmäisen pysähdyksen ja painaa **Optimoi loput**.
- Käsin valittu alku säilyy täsmälleen valitussa järjestyksessä.
- Jäljellä olevat pysähdykset optimoidaan viimeisen valitun pysähdyksen ja reitin loppuosoitteen väliin.
- Optimoi loput -painike on sekä erillisessä karttaikkunassa että pääsivun reittikortissa.
- Kuljetuksen aikaiset Navigointi-, Kuittaus-, Varauma- ja soittotoiminnot on poistettu toistaiseksi näkyvästä käytöstä.
- Osoitteiden esikatselu ja korjaus, reittisuunnittelu, käsin järjestäminen sekä PDF-yhdistäminen säilyvät käytössä.
- ZIP-paketti ei sisällä PDF-esimerkkitiedostoa.

## Versio 1.33

- Kartan rakennusnumerovälit hyväksytään oikein: esimerkiksi osoite 19 vastaa kartan rakennusta 15–19.
- Korjaus löytää muun muassa osoitteen Tarvonsalmenkatu 19, 02600 Espoo.
- Väärä talonumero hylätään edelleen, jos se ei kuulu kartan ilmoittamaan numeroväliin.
- Päivityksen ZIP-paketista on jätetty tarpeeton PDF-esimerkkitiedosto pois.

## Versio 1.32

- Osoitehaku käyttää automaattisesti kahta avaimetonta hakupalvelua sekä haluttaessa Maanmittauslaitosta.
- Photon-varahaku löytää myös osoitteita, joita OpenStreetMapin Nominatim-haku ei tunne, kuten Isonniitynkuja 2, 02270 Espoo.
- Tuloksesta tarkistetaan katu, talonumero ja saatavilla oleva postinumero ennen kartalle hyväksymistä.
- Käsin vaihdetulle osoitteelle ei enää jää PDF:stä poimittua vanhaa postinumeroa.
- Myös lähtö- ja loppuosoitteet käyttävät samaa korjattua monivaiheista hakua.
- Vanhat mahdollisesti virheelliset osoitehakutulokset ohitetaan uusilla välimuistiavaimilla.

## Versio 1.31

- Myös ilman karttapistettä jääneet keikat ovat raahattavia.
- Ratkaisematon keikka voidaan pudottaa mihin tahansa optimoitujen keikkojen väliin.
- Käsin sijoitettu keikka säilyttää paikkansa kuljetusnäkymässä ja yhdistetyn PDF:n järjestyksessä.
- Karttapisteetön keikka ohitetaan vain reittiviivan ja kilometrilaskennan osalta.

## Versio 1.30

- Maanmittauslaitoksen valtakunnallinen geokoodaus voidaan ottaa ensisijaiseksi osoitehauksi API-avaimella.
- API-avain syötetään Kuljettajan asetuksiin ja tallennetaan vain käyttäjän omalle laitteelle.
- Maanmittauslaitoksen haku käyttää rakennusosoitteita ja laskennallisia tieosoitteita; OpenStreetMap jää varapalveluksi.

## Versio 1.29

- Osoitehaku kokeilee rakenteisen haun jälkeen enintään kymmenen vapaamuotoista hakutulosta.
- Hakutulos hyväksytään edelleen vain, jos sen postinumero vastaa lähetettä.
- Viimeisenä turvallisena hakuna voidaan käyttää vastaanottajan nimeä oikean postinumeroalueen sisältä.

## Versio 1.28

- Kaikki CARTO-karttatasot on vaihdettu avaimettomaan OpenStreetMap-karttaan.
- API KEY REQUIRED -vesileimat ovat poistuneet kuljettajan ja ajojärjestelijän kartoista.
- OpenStreetMapin tekijämerkintä näkyy jokaisessa kartassa käyttöehtojen mukaisesti.

## Versio 1.27

- Geokoodaus hyväksyy katuosoitteelle vain oikeaan postinumeroon kuuluvan tuloksen.
- Katuosoitetta ei enää korvata virheellisesti postinumeroalueen keskipisteellä.
- Geokoodausvälimuistin versio on vaihdettu, joten vanhat väärät karttaosumat eivät jää käyttöön.

## Versio 1.26

- Sovellus on asennettava PWA puhelimelle ja tietokoneelle.
- Mukana ovat sovelluskuvakkeet, asennuspainike ja paikallinen offline-sovellusrunko.
- Asennus vaatii HTTPS-osoitteen tai localhost-palvelimen; file://-osoitteesta PWA-asennus ei ole selaimissa sallittu.

## Versio 1.25

- Asiakas-soittopainikkeen teksti on nyt Soita.
- Kuljetusnäkymän esikatselu näyttää kokonaiset PDF-sivut täysleveinä.
- Esikatseluikkunan korkeus on noin puoli PDF-sivua ja sisältöä vieritetään pystysuunnassa.
- Monisivuisen PDF:n kaikki sivut voi selata samassa ikkunassa sivunumeroineen.

## Versio 1.24

- Kuljetusnäkymä näyttää vain yhden keikan kerrallaan.
- Nykyisen keikan PDF-esikatselu on jatkuvasti näkyvissä.
- Navigointi-, Kuittaus- ja Varaumat-palkki on suoraan esikatselun alapuolella.
- Vastaanottajan ja asiakkaan puhelinnumerot poimitaan PDF:stä suoriksi soittopainikkeiksi.
- Keikkojen välillä liikutaan Edellinen- ja Seuraava-painikkeilla.

## Versio 1.23

- Korjattu kuljettajan etunimikenttä oikeaan Kuljettajan asetukset -ikkunaan.
- Tallennettu etunimi näkyy Asetukset-painikkeessa, jotta asetuksen voi varmistaa yhdellä silmäyksellä.

## Versio 1.22

- Kuljettajan asetuksiin voi tallentaa etunimen.
- Kuitattujen lähetteiden tiedostonimi muodostetaan etunimestä ja päivämäärästä, esimerkiksi Teemu31082026.pdf.

## Versio 1.21

- Google Maps avataan puhelimessa sovelluslinkillä verkkoversion sijasta.
- Androidissa linkki kohdistetaan varsinaiseen Google Maps -pakettiin Maps Go -version sijasta.
- iPhonessa käytetään Google Mapsin omaa sovellusosoitetta.

## Versio 1.20

- Kuljettaja-näkymässä on Asetukset-valikko navigointisovelluksen valintaan.
- Vaihtoehdot ovat Google Maps, Waze ja Apple Maps; Google Maps on oletus.
- Navigointivalinta muistetaan samalla laitteella.

## Versio 1.19

- Kuljettaja voi tuoda PDF-lähetteet suoraan ZIP-paketista.
- Useita autokohtaisia kansioita sisältävästä ZIP:stä valitaan oma kansio ennen tuontia.
- ZIP puretaan paikallisesti selaimessa.

## Versio 1.18

- Korjattu vastaanottajan kuittauksen ja Varaumat-tekstin sijainti PDF-lähetteessä.
- Kentät tunnistetaan kokonaisista PDF-tekstiriveistä, vaikka otsikko koostuisi useasta tekstipalasta.
- Varasijainnit perustuvat sivun mittoihin eivätkä enää osu alatunnisteeseen.

## Versio 1.17

- Kartan kohdepallot näyttävät vastaanottajan ja osoitteen hiirellä osoitettaessa.
- Valmis reitti voidaan kuitata kuljetukseen ja avata keikkalistaksi ajojärjestyksessä.
- Jokaisella keikalla on navigointi-, kuittaus- ja Varaumat-painikkeet.
- Kuittaus päivämäärineen ja varaumat kirjoitetaan ladattavan PDF:n viimeisen sivun vastaaviin kenttiin.

## Versio 1.16

- Kuljettajan PDF-esikatselussa on muokattava toimitusosoiterivi.
- Käsin tallennettu osoite ohittaa PDF:stä tunnistetun osoitteen reitinoptimoinnissa.

## Versio 1.15

- Kuljettaja-näkymän jokaisella PDF-tiedostolla on osoitteentarkistuksen suurennuslasipainike.
- Esikatselu näyttää PDF:n koko leveyden lähetteen yläreunasta Toimitusohje-kentän alareunaan.
- Esikatselussa voi liikkua edelliseen ja seuraavaan lähetteeseen nuolipainikkeilla tai näppäimistön nuolilla.

## Versio 1.14

- Ajojärjestelijän keikkamäärä tarkoittaa nyt aina fyysisten toimitusosoitteiden määrää.
- PDF-tiedostojen määrää ei näytetä erillisenä keikkamääränä autokorteissa, kartan sivukortissa tai ZIP-yhteenvedossa.
- Suuren **Valitse kartasta** -ikkunan palluran vihjeteksti näyttää EUR-/Teho-lavojen lisäksi osoiteryhmän kokonaispainon.
- Tavallinen jaon kartta näyttää hiirellä osoitettaessa myös keikan painon.

## Versio 1.13

- Automaattijaon ensisijainen tasausmittari on nyt fyysisten pysähdysten määrä.
- Yhden pysähdyksen peruspaino kasvatettiin selvästi tavaramäärää suuremmaksi.
- EUR-/Teho-lavat ja paino vaikuttavat edelleen, mutta vain jaon hienosäätönä.
- Maantieteellinen läheisyys säilyy mukana, mutta se ei enää yhtä helposti ohita selvää eroa keikkamäärissä.
- Jaon jälkeinen automaattinen tasaus tekee tarvittaessa useampia siirtoja ja tavoittelee ensin tasaisia pysähdysmääriä.
- Autokorteissa näytetään erikseen keikkojen/PDF:ien ja fyysisten pysähdysten määrä.

## Versio 1.12

- Ajojärjestelijä jakaa keikat autoille, mutta ei enää muodosta tai optimoi ajojärjestystä.
- Ajojärjestelijän kartasta poistettiin reittinumerot, lähtö-/kotipisteet ja pysähdyksiä yhdistävät reittiviivat.
- Autokorteista poistettiin reittikilometrit, autokohtainen optimointipainike sekä pysähdysten ↑/↓-järjestely.
- **Jaa & optimoi reitit** korvattiin toiminnolla **Jaa keikat autoille**.
- ZIP-viennin yhdistetty tiedosto on nyt `AUTO_lahetteet.pdf`, eikä sen järjestystä esitetä ajojärjestyksenä.
- Kuljettajan oma reittioptimointi, karttavalinta ja käsijärjestys säilyvät ennallaan.

## Versio 1.11

- Ajojärjestelijän tulosalueen alareunaan lisättiin toinen **Valitse kartasta** -painike automaattisen optimoinnin jälkeistä manuaalista hienosäätöä varten.

## Versio 1.10

- Ajojärjestelijä voi valita auton ja avata **Valitse kartasta** -toiminnon omaan suureen ikkunaan.
- Kaikki geokoodatut fyysiset pysähdykset näytetään karttapalluroina, ja koko saman osoitteen PDF-ryhmä valitaan yhdellä napsautuksella.
- Valinnat lukitaan valitulle autolle, joten automaattinen **Jaa & optimoi** säilyttää ne.
- Kartan sivukortti näyttää autokohtaisesti PDF-/keikkamäärän, pysähdykset, EUR- ja Teho-lavat, lavapaikat sekä kapasiteetin.
- Autoa voi vaihtaa myös karttaikkunan sivukortista; kartan zoomaus ja sijainti säilyvät valintojen aikana.
- **Valitse kartasta** -painike on myös Ajojärjestelijä-sivun alareunassa automaattisen optimoinnin vieressä, jotta keikkojen manuaalinen siirtely on helppo avata valmiin jaon jälkeen.

## Versio 1.9

- Kuljettajan karttavalinta avautuu omaan suureen selainikkunaan.
- Kartan keskipiste ja zoomaustaso säilyvät palluroita valittaessa ja valintoja peruttaessa.
- Jos selain estää popup-ikkunan, karttavalinta toimii sivunsisäisenä varavaihtoehtona samalla zoomin säilytyksellä.

## Versio 1.8

- Kuljettaja voi valita ajojärjestyksen itse napsauttamalla kartan pysähdyspalluroita.
- Karttavalinnassa viimeisen pisteen voi perua tai koko valinnan aloittaa alusta.
- Nykyisen reittijärjestyksen PDF:t voi yhdistää ja ladata yhtenä tiedostona.

## Versio 1.7

- Kuljettaja voi optimoida omista PDF-lähetteistään yhden päivän reitin.
- Lähtö- ja loppuosoite huomioidaan optimoinnissa; tyhjä loppuosoite tarkoittaa paluuta lähtöpaikkaan.
- Reitti käyttää tieverkkoetäisyyksiä, 2-optia ja siirtoparannusta.
- Saman fyysisen osoitteen PDF:t muodostavat yhden pysähdyksen.
- Tulos näytetään numeroituna pysähdyslistana, kilometrivarauksena ja kartalla.
- Kuljettaja voi muuttaa optimoitua pysähdysjärjestystä raahaamalla rivejä. Numerointi, kilometrimäärä ja kartta päivittyvät heti.
- Kuljettajan kartta hakee OSRM:ltä katuja ja teitä seuraavan reittiviivan. Katkottu suora viiva näytetään vain varatilana, jos tieverkkopalvelu ei vastaa.
- **Valitse ajojärjestys itse** tuo pysähdykset kartalle valittaviksi. Palluroita napsautetaan halutussa ajojärjestyksessä, ja viimeisen valinnan voi perua tai valinnan aloittaa alusta.
- **Yhdistä ja lataa PDF:t** tekee yhden PDF:n nykyisessä reittijärjestyksessä. Reitittämättömät PDF:t lisätään tiedoston loppuun.
- Karttavalinta avautuu omaan suurikokoiseen selainikkunaan. Kartan sijainti ja zoomaustaso säilyvät pistevalintojen, peruutusten ja uudelleenpiirtojen aikana.

## Versio 1.6

- Yläreunassa on selkeä **Ajojärjestelijä / Kuljettaja** -näkymänvalinta.
- Ajojärjestelijä on oletusnäkymä ja sisältää kaikki v1.5:n nykyiset toiminnot.
- Kuljettaja-näkymä on kevyt pohja, johon voidaan seuraavaksi lisätä kuljettajan omat keikat, reitti ja kartta.
- Kuljettaja-näkymässä voi valita tai raahata omat PDF-lähetteet erilliseen tiedostolistaan.
- Kuljettaja voi antaa lähtö- ja loppuosoitteen ja optimoida oman reittinsä tieverkkoetäisyyksillä, 2-optilla ja siirtoparannuksella.
- Optimoitu reitti näytetään numeroituna listana ja kartalla. Saman fyysisen osoitteen PDF:t yhdistetään yhdeksi pysähdykseksi.

## Käyttö

1. Avaa `index.html` selaimessa.
2. Raahaa PDF-lähetteet sovellukseen.
3. Valitse töissä olevat autot ja alueet.
4. Jaa & optimoi reitit.
5. Tarkista jaon kartta ja työmääräpisteet.
6. Lukitse tarvittaessa osoite nykyiselle autolle 🔒.
7. Muokkaa valmista reittijärjestystä ↑ / ↓ -painikkeilla tai optimoi yhden auton reitti uudelleen.
8. Lataa ZIP (kansiot per auto).

## Versio 1.5

### 2-opt + siirtoparannus

- Lähin-naapuri muodostaa vain ensimmäisen reittiehdotuksen.
- Sen jälkeen 2-opt poistaa reitistä turhia ristiinajoja ja paluita.
- Yhden pysähdyksen siirtoparannus täydentää 2-optia pitkissä koukuissa.
- Reitin **kotiosoite/loppupiste vaikuttaa optimointiin jo järjestystä muodostettaessa**.
- Kahdella lastauksella L1 optimoidaan muodossa `lastaus → L1 → lastaus` ja L2 muodossa `lastaus → L2 → koti`.

### Jaon jälkeinen kartta

- Jokaisella autolla on oma väri.
- Pysähdykset näkyvät kartalla reittinumeroilla.
- Kartta näyttää lastaus-/lähtöpisteen, kodin/reitin lopun ja kahden lastauksen paluun lastauspaikalle.
- Kartan viiva näyttää pysähdysjärjestyksen; kilometrilaskenta käyttää edelleen tieverkkoetäisyyksiä.

### Lukitut keikat

- 🔒 lukitsee koko fyysisen osoitteen nykyiselle autolle.
- Uusi `Jaa & optimoi` ei siirrä lukittua osoitetta toiselle autolle.
- Auton käsin vaihtaminen päivittää myös lukituksen uudelle autolle.
- Käsin siirrettäessä sama fyysinen osoite liikkuu kokonaisena.

### Työmääräpohjainen tasaus

Työmäärä ei perustu enää vain pysähdysten lukumäärään. Työmääräpisteissä huomioidaan:

- yksi fyysinen pysähdys
- EUR-lavat
- Teho-lavat
- kuorman paino (rajatulla vaikutuksella)
- aluekerroin (esim. Helsingin keskustan toimitus saa tavallista suuremman työpainon)

Autokorteissa näkyy auton työmääräpistemäärä ja kaikkien autojen keskiarvo.

### Reitin käsin muokkaus optimoinnin jälkeen

- Jokaisen pysähdyksen vieressä on ↑ / ↓.
- Nuolilla voi muuttaa optimoitua järjestystä käsin.
- Kilometrimäärä ja kartta päivittyvät heti ilman uutta automaattista optimointia.
- Kahdella lastauksella nuolilla järjestetään pysähdyksiä saman lastauksen sisällä.
- `Optimoi tämän auton reitti` palauttaa automaattisen 2-opt-optimoinnin.
- `Optimoi kaikki reitit uudelleen` optimoi koko valmiin jaon uudestaan muuttamatta autojakoa.

## Versio 1.4 – tieverkko ja osoitenormalisointi

- Keikkojen jakopäätökset ja reittijärjestys käyttävät oikeaa ajomatkaa tieverkkoa pitkin.
- Autokohtainen reittikilometrimäärä perustuu tieverkkoon.
- Tieverkkomatriisi lasketaan OSRM-reitityspalvelun avulla.
- Jos tieverkkopalvelu ei vastaa, puuttuvalle välille käytetään varalaskentaa.
- Reitityksessä `12 A` → `12` ja `11-13` → `11`.

## Aiemmat korjaukset

- Sama katuosoite pysyy samalla kuljettajalla myös automaattisessa tasauksessa.
- Manuaalinen siirto laskee reitit, reittinumerot ja lastausjaon uudelleen.
- Pelkkä postinumero ei yhdistä eri asiakkaita samaksi pysähdysryhmäksi.
- Käsin korjatut osoitteet normalisoidaan samalla osoiteparserilla kuin PDF-luku.
- ZIP-vienti säilyttää jakamattomat PDF:t `_EI_SIJOITETTU`-kansiossa ja tarkistaa PDF-määrän ennen vientiä.
- Vastaanottajan katuosoite etsitään ensisijaisesti Vastaanottaja-blokista.
- Moniosaiset kadunnimet kuten `Alvar Aallon katu`, `Hermannin puistotie` ja `Vanha Helsingintie` tunnistetaan.

## Tietoliikenne

PDF-tiedostoja ei lähetetä palvelimelle. Ohjelma käyttää verkkopalveluita osoitteiden geokoodaukseen, karttaruutuihin ja tieverkkoetäisyyksien laskentaan, joten reittijaon tekeminen vaatii internet-yhteyden.
