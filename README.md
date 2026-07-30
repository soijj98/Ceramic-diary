# Keramiikkapäiväkirja

Prosessipäiväkirja keramiikkatöille: lisää kappaleita, kirjaa vaihe
vaiheelta mitä teit (muotoilu, kuivatus, poltot, lasitus/enkoopointi),
liitä kuvia joka vaiheeseen, ja seuraa uunilämpötiloja, painoa ja
käytettyjä lasitteita.

Tämä on pohja jatkokehitykseen — perustoiminnot on rakennettu, mutta
paljon on vielä avointa (ks. "Seuraavaksi" alla).

## Ominaisuudet nyt

- Kappaleiden listaus ja luonti (nimi, savityyppi, alkupaino)
- Kappaleen aikajana, joka näyttää kaikki vaiheet kronologisesti
- "Lisää vaihe" -lomake, jossa näkyvät kentät vaihtuvat vaihetyypin
  mukaan (uunilämpötila ja polttopohjelma poltoille, lasitteen nimi
  ja levitystapa lasitukselle/enkoopoinnille, paino muotoilulle ja
  kuivatukselle)
- Kuvien lisäys Supabase Storageen jokaiseen vaiheeseen

## Käyttöönotto

1. **Asenna riippuvuudet**

   ```bash
   npm install
   ```

2. **Luo Supabase-projekti** osoitteessa [supabase.com](https://supabase.com)
   (ilmainen taso riittää tähän hyvin).

3. **Aja tietokantaskeema**

   Avaa Supabasen SQL-editori ja aja `supabase/schema.sql`. Se luo
   taulut (`pieces`, `steps`, `step_photos`) ja `ceramics-diary`
   -storage-bucketin kuville.

4. **Ympäristömuuttujat**

   ```bash
   cp .env.example .env
   ```

   Täytä `.env`-tiedostoon Supabase-projektisi URL ja anon-avain
   (löytyvät Supabasen dashboardista: Project Settings → API).

5. **Käynnistä sovellus**

   ```bash
   npx expo start
   ```

   Skannaa QR-koodi Expo Go -sovelluksella puhelimessa, tai paina `i`
   / `a` avataksesi iOS-simulaattorin / Android-emulaattorin.

## Projektirakenne

```
app/                     Expo Router -näytöt (tiedostopohjainen reititys)
  index.tsx               Kappalelista
  piece/new.tsx           Uuden kappaleen lomake
  piece/[id]/index.tsx    Kappaleen aikajana
  piece/[id]/add-step.tsx Vaiheen lisäyslomake + kuvat
src/
  components/             PieceCard, StepCard, StepTypeBadge
  constants/theme.ts      Värit, välit, vaihetyyppien tunnusvärit
  lib/
    supabase.ts           Supabase-clientin alustus
    data.ts                Kaikki tietokantakutsut yhdessä paikassa
  types/index.ts          Piece/Step/StepPhoto-tyypit ja vaihetyypit
supabase/schema.sql       Tietokantaskeema + storage-bucket + policyt
```

## Seuraavaksi (ideoita jatkoon)

- Kirjautuminen (Supabase Auth), jotta jokainen käyttäjä näkee vain
  omat kappaleensa — nyt kaikki data on julkisesti luettavissa/
  kirjoitettavissa RLS-policyjen kautta, mikä sopii yhden käyttäjän
  portfoliodemoon muttei tuotantoon
- Kappaleen muokkaus ja poisto
- Vaiheiden muokkaus/poisto ja kuvien poisto
- Tagit/kategoriat kappaleille (esim. "koru", "astia", "kokeilu")
- [[glaze-app]]-projektin lasitereseptien linkitys suoraan
  lasitusvaiheeseen, jos resepti on jo tallennettu sinne
- Painon/kutistuman kehityksen visualisointi kaaviona ajan yli
- Offline-tuki (esim. paikallinen välimuisti ennen synkronointia)
