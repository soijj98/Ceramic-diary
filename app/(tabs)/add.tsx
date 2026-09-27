// Tämä näkymä ei koskaan oikeasti näy — (tabs)/_layout.tsx sieppaa
// painalluksen "add"-välilehteen ja ohjaa suoraan /piece/new-lomakkeeseen.
// Tiedosto on silti pakko olla olemassa, jotta Expo Router tunnistaa
// reitin nimeltä "add".
import { View } from "react-native";

export default function AddPlaceholder() {
  return <View />;
}
