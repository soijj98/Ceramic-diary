# Keramiikkapäiväkirja

Studio-sovellus keramiikkatöiden seurantaan: kirjaudu sisään, luo
töitä, lisää niihin vaiheita (muotoilu, kuivatus, poltot, lasitus)
kuvineen ja teknisine tietoineen, ja kerää erillisiä ideoita
myöhempää käyttöä varten.

## Ominaisuudet nyt

- **Kirjautuminen**: tervetulonäkymä + kirjautuminen/rekisteröityminen
  Supabase Authilla, istunto säilyy sovelluksen sulkemisen yli
- **Koti**: tervehdys, pikatoiminnot (Uusi työ, Ideat), viimeisimmät työt
- **Työt**: kaikkien töiden lista, suodatus tilan mukaan (Kaikki/
  Aktiiviset/Valmiit/Luonnokset)
- **Työn tarkastelu**: tila (luonnos → aktiivinen → valmis, vaihtuu
  painamalla), kuvaus, vaiheiden aikajana
- **Vaiheen lisäys**: kentät vaihtuvat vaihetyypin mukaan (uunilämpötila
  poltoille, lasite lasitukselle, paino muotoilulle/kuivatukselle),
  kuvien lisäys Supabase Storageen
- **Ideat**: yksinkertainen ideataulu (nimi, muistiinpano, linkki)
- **Profiili**: nimi, sähköposti, työmäärä-tilastot, uloskirjautuminen
- Kaikki data on käyttäjäkohtaista (Row Level Security)

## Käyttöönotto

1. **Asenna riippuvuudet**

   ```bash
   npm install
   ```

2. **Aja tietokantaskeema** Supabasen SQL-editorissa: `supabase/schema.sql`.
   Jos sinulla on aiempi versio skeemasta (esim. ilman `owner_id`-saraketta,
   tai `sessions`-taulut), pudota vanhat taulut ensin — ohje skeeman alussa
   kommenttina.

3. **Ota sähköpostivahvistus pois päältä testauksen ajaksi** (valinnainen
   mutta suositeltavaa): Supabase Dashboard → Authentication → Providers →
   Email → "Confirm email" pois päältä, niin pääset kirjautumaan heti
   rekisteröitymisen jälkeen ilman sähköpostin vahvistamista.

4. **Ympäristömuuttujat**

   ```bash
   cp .env.example .env
   ```

   Täytä Supabase-projektisi URL ja anon-avain (Project Settings → API).

5. **Käynnistä sovellus**

   ```bash
   npx expo start -c
   ```

## Projektirakenne

```
app/
  (auth)/
    login.tsx           Tervetulo + kirjautuminen
    signup.tsx           Rekisteröityminen
  (tabs)/
    _layout.tsx           Tab-navigaattori: Koti, Työt, +, Ideat, Profiili
    index.tsx              Koti-näkymä
    works.tsx               Työt-lista + suodatus
    ideas.tsx                Ideataulu
    profile.tsx               Profiili + uloskirjautuminen
    add.tsx                    Placeholder — "+"-välilehti ohjaa /piece/new:iin
  piece/
    new.tsx                Uuden työn lomake
    [id]/
      index.tsx             Työn tarkastelu + vaiheiden aikajana
      add-step.tsx            Vaiheen lisäys + kuvat
  _layout.tsx               Juuri: kirjautumistilan ohjaus (Stack)
src/
  components/                PieceCard, StepCard, StepTypeBadge, IdeaCard
  constants/theme.ts           Värit, välit
  context/AuthContext.tsx       Supabase-istunnon tila koko sovellukselle
  lib/
    supabase.ts                 Supabase-client + istunnon säilytys
    data.ts                      Kaikki tietokantakutsut
  types/index.ts                 Piece/Step/Idea-tyypit
supabase/schema.sql              Taulut + RLS-policyt + storage-bucket
```

## Seuraavaksi (ideoita jatkoon — ei vielä tässä versiossa)

- **Ryhmät/yhteisö**: jaetut työt, tiimit, seuraaminen — tietoisesti
  rajattu pois tästä vaiheesta
- Työn kansikuva ja kuvagalleria työn pääsivulla
- Materiaalit- ja hinnoittelunäkymä (kustannuslaskuri per työ)
- Ideataulun kuvatuki (nyt vain teksti + linkki)
- Pinterest-integraatio ideoiden tuontiin
- Profiilikuvan lataus
