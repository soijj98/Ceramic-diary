# Projektin roadmap-pohja

Kopioi tämä jokaisen uuden projektin juureen `ROADMAP.md`-nimisenä ja
täytä väliotsikot projektin edetessä. Tarkoitus ei ole täyttää kaikkea
kerralla — päivitä sitä mukaa kun päätöksiä tulee.

---

## 1. Idea-backlog

Kaikki ideat yhteen paikkaan heti kun ne tulevat mieleen — ei vielä
priorisointia, vain talteenotto. Muuten hyvät ideat unohtuvat tai
alkavat ohjata kehitystä sattumanvaraisesti.

```

* jokaisella käyttäjällä oma profiili / tallennus pilveen.
* mahdollisuus jakaa myös muille ideat ns. pinterest tyylisesti (tai ig?)
      -ryhmät voisi toimia myös tässä 

* päiväkirjamaisuus ja kuvien tallennusmahis

* kuvien lataaminen, oman työn vaihe vaiheelta raportointi
      - jokaiselle työlle oma kohta
      - jokaiselle erivaiheelle voisi laittaa päivämäärät ja mahdollisesti kirjoittaa kuinka kauan mihinkin on mennyt aikaa. Sovellus voisi laskea ajan. 
            - myyntiin tekeville voisi laskea tunti hinnan omien tietojen mukaan
      
      - hinnat valmistuksen mukaan (merkataan esim. enkooppien / lasitteiden / tuntimaksujen / savien mukaan. Myös sähkö jos omistaa oman uunin. Eli kaikki mitä pitää ottaa hintoihin mukaan. alvit ymsyms)

      - eri vaiheet / muistiinpanot (projektin kuvailu) eri vaiheille. (esim. ei muista mitä päivi on opettanut)
            - dreijattu
            - muovattu
            - trimmed?
            - ennen raakapolttoa (täpät josta aukeaa valikot?)
                  - enkooppi
                  - mahdollinen lisäaine
                  - sellakka, vesilasi tms
            - raakapoltettu
                  - polttolämpötila
            - lasitettu
                  - täpät josta aukeaa uudet valitot (mitä laitettu, kuinka paljon yms. + lisää -painike tai jotain)
                        - alilasite
                        - lasite
                        - lasitteisiin voisi kirjata kuinka kauan dippasi
                        - enkoopit, alilasitteet huomioita. Kuinka paksukerros. Lopputulokseen olisi mahdollisuus kertoa miten tämä käyttäytyi. (esim. jos on käyttänyt enkooppia paksulti ja laittanut p30 lasitetta, minkälainen siitä tuli. tai jos on maalannut melko vetisesti enkoopin ja laittanut kimiä päälle, niin kuinka selkeä väri sillä tavalla on tullut. siveltimen vedot. lisähuomio tai advanced.)
                  - polttolämpötila
            - valmis

      - valmis / keskeneräinen täppä ja tulee konfetteja kun on valmis (Maria idea)
      - ideat kansio!
            - pinteres integraatio???
            - linkit ideoihin
            - omien ideoiden suunnittelu. Piirtäminen?

* ryhmät / työtilat
      - esim. jokaiselle yritykselle oma
            - päivi ja emmi voi päivittää omat tiedot ja taidot
      - voi tehdä omia ryhmiä, jakaa sinne töitä ja ohjeita

* käytetyt materiaalit

* jokaiselle työlle tiedot:
      - mikä savi
      - kuinka paljon savea on käytetty
      - mikä lasite
      - Mikä enkooppi


```

Kun backlog alkaa täyttyä, jaa ideat kolmeen koriin:

| Kori | Kysymys |
|---|---|
| **Must** | Ilman tätä sovellus ei toimi / ei ole käyttökelpoinen |

- tietokanta
- työn eri vaiheet


| **Should** | Tekee sovelluksesta paljon paremman, mutta ei pakollinen v1:ssä |


| **Could** | Kiva lisä joskus myöhemmin, ei kiireellinen |

## 2. MVP-määrittely — mikä on "tarpeeksi valmis" ensijulkaisuun

Kirjoita 3–6 lauseella: mitä käyttäjä pystyy tekemään sovelluksella
kun se on "valmis v1:ksi"? Tämä on tärkein kohta koko dokumentissa —
ammattilaiset epäonnistuvat useimmin juuri rajaamalla MVP:n liian
laajaksi.

```
MVP = käyttäjä pystyy: [ydinpolku 1], [ydinpolku 2], [ydinpolku 3]
Ei MVP:ssä: [tietoisesti rajatut ominaisuudet, esim. kirjautuminen,
             tagit, tilastot — nämä Should/Could-koriin]
```

## 3. Virstanpylväät (milestones)

Pilko MVP 3–5 konkreettiseen, testattavaan virstanpylvääseen. Jokaisen
pitäisi olla jotain, minkä voi näyttää toiselle ihmiselle ja sanoa
"tämä toimii nyt".

```
v0.1 – Perustoiminnot toimivat paikallisesti
v0.2 – Data pysyy tallessa (backend/tietokanta kytketty)
v0.3 – Käyttöliittymä siistitty, virhetilanteet käsitelty
v0.4 – Testattu oikeasti toisella laitteella/käyttäjällä
v1.0 – Julkaisuvalmis
```

## 4. Tekninen velka -lista

Aina kun teet tietoisen oikaisun ("tämä toimii nyt mutta ei skaalaa"
tai "kovakoodasin tämän"), kirjaa se ylös heti — älä luota muistiin.

```
- [ ] Esim: Storage-policyt ovat täysin avoimia, kiristä ennen julkaisua
- [ ] Esim: Ei validointia lomakkeen numerokentille
```

## 5. Testaus — minimitaso pienelle projektille

Ei tarvitse mennä täyteen testikattavuuteen soolo-/portfolioprojektissa,
mutta nämä kannattaa tehdä ennen v1.0:aa:

- [ ] Käy koko ydinpolku manuaalisesti läpi alusta loppuun kerran
- [ ] Testaa ainakin yksi virhetilanne per lomake (tyhjä kenttä, väärä
      tyyppi, verkkokatko)
- [ ] Jos aikaa riittää: muutama automaattitesti kriittisimmälle
      logiikalle (esim. laskukaavat, tietokantakutsut)

## 6. CI/CD — automaatio ennen julkaisua

Pienelle projektille riittää yksinkertainen versio:

- [ ] Koodi GitHubissa, `main`-branch suojattu (ei suoraan pushia)
- [ ] GitHub Actions -workflow, joka ajaa lintin/testit jokaisessa
      pull requestissa
- [ ] (Myöhemmin) automaattinen deploy kun `main` päivittyy

## 7. Dokumentaatio ja README — portfolion kannalta tärkein osa

Rekrytoija/rekrytoiva tiimi lukee READMEn ennen koodia. Sen pitää
kertoa nopeasti:

- [ ] Mitä sovellus tekee (1–2 lausetta) + kuvakaappaus/GIF
- [ ] Miksi teit sen (mikä ongelma, mikä kiinnosti teknisesti)
- [ ] Teknologiavalinnat ja miksi ne valittiin
- [ ] Miten ajaa projekti paikallisesti (setup-ohjeet)
- [ ] Mikä oli teknisesti haastavin osa ja miten ratkaisit sen —
      tämä on kohta, josta haastatteluissa kysytään

## 8. Julkaisu-checklist

- [ ] Ympäristömuuttujat/salaisuudet eivät ole koodissa tai Git-
      historiassa
- [ ] Tietokannan/oikeuksien policyt kiristetty (ei enää "kaikki saa
      kirjoittaa kaikkea")
- [ ] Virheviestit käyttäjäystävällisiä, ei raakoja stack tracereita
- [ ] Testattu vielä kerran täysin puhtaalta asennukselta (kloonaa
      repo tyhjään kansioon ja aja setup-ohjeet sanasta sanaan)
- [ ] Demo-video tai kuvakaappaukset READMEssä / portfoliosivulla

## 9. Julkaisun jälkeen

- [ ] Kysy palautetta 2–3 oikealta käyttäjältä (ei vain itseltä)
- [ ] Kirjaa saatu palaute takaisin idea-backlogiin (kohta 1)
- [ ] Päätä tietoisesti: jatketaanko tätä projektia vai siirrytäänkö
      seuraavaan — molemmat ovat ihan valideja päätöksiä

---

### Nopea sovellus keramiikkapäiväkirjaan juuri nyt

Sinulla on jo v0.1 (perustoiminnot paikallisesti/Supabasessa). Looginen
seuraava askel olisi täyttää kohdat 1–3 tälle projektille: kirjoita
backlogiin kaikki mitä mieleen tulee (tagit, muokkaus, kirjautuminen,
lasitereseptin linkitys), jaa ne Must/Should/Could-koreihin, ja
määrittele mikä on sinun MVP — todennäköisesti "kappaleen luonti +
vaiheen lisäys kuvineen toimii luotettavasti" riittää hyvin v1:ksi.
