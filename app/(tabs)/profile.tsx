import { useCallback, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View, TouchableOpacity, StatusBar } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { colors, radius, spacing } from "@/constants/theme";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons'; 
import { supabase } from "@/lib/supabase";
import { Background } from "expo-router/build/react-navigation";


// siirrä tää missä on navigaatio määritelty
type RootStackParamList = { 
  "Profile": undefined;

};

const COLORS = {
  primary: '#F5F0E6', // Vaalea tausta
  accent: '#8B5E3C', // Ruskea/puun väri
  text: '#333333',
  textSecondary: '#666666',
  white: '#FFFFFF',
  statsBg: '#FAF8F5',
  border: '#E0E0E0',
};

// const MOCK_DATA = {
//   name: 'Maya Ossi',
//   handle: 'Earthwork Studio • Portland, OR',
//   bio: 'Wheel thrower and glaze nerd. Obsessed with reduction firing and the chaos of ash glazes.',
//   sessions: 3,
//   glazeLogs: 1,
//   topMood: 'Growing',
//   notes: [
//     { category: 'Wheel', value: 1 , max: 1 },
//     { category: 'HandBuilding', value: 1 , max: 1 },
//     { category: 'Glaze', value: 1, max: 1 }
//   ],
//   headerImage: 'https://images.unsplash.com/photo-1565195660138-e1c432f76f28?q=80&w=800',
//   avatarImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200',
//   gallery: [
//     'https://images.unsplash.com/photo-1611280104291-38c5e034697a?q=80&w=300',
//     'https://images.unsplash.com/photo-1578749556568-bc5c40e18084?q=80&w=300',
//     'https://images.unsplash.com/photo-1594368918772-0a61da77e07c?q=80&w=300',
//     'https://images.unsplash.com/photo-1612193114931-75332b4a606a?q=80&w=300',
//     'https://images.unsplash.com/photo-1534518634116-4d87951176a4?q=80&w=300',
//     'https://images.unsplash.com/photo-1577153923763-2b042e6fc1ea?q=80&w=300',
//   ],
//   email: 'maya@claystudio.co',
//   memberSince: 2023,
// }



const HeaderSection = ({ imageUrl, avatarUrl }: any) => (
  <View style={styles.headerContainer}>
    <Image source={{ uri: imageUrl }} style={styles.headerImage} resizeMode="cover" />
    <Image source={{ uri: avatarUrl }} style={styles.avatar} />
  </View>
);

const StatBox = ({ number, label, icon }: any) => (
  <View style={styles.statBox}>
    {icon ? icon : <Text style={styles.statNumber}>{number}</Text>}
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const NoteCategory = ({ category, value, max }: any) => (
  <View style={styles.noteRow}>
    <Text style={styles.noteCategory}>{category}</Text>
    <View style={styles.progressBarBackground}>
      <View style={[styles.progressBarFill, { width: `${(value / max) * 100}%` }]} />
    </View>
  </View>
)

export default function ProfileScreen() {
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [userData, setUserData] = useState({
    name: "Nimetön keraamikko",
    handle: "Aseta nimimerkki",
    bio: "Kerro itsestäsi jotain...",
    sessions: 0,
    glazeLogs: 0,
    topMood: "-",
    notes: [
      { category: "Wheel", value: 0, max: 1 },
      { category: "HandBuilding", value: 0, max: 1 },
      { category: "Glaze", value: 0, max: 1 }
    ],
    headerImage: "https://images.unsplash.com/photo-1565195660138-e1c432f76f28?q=80&w=800", // Oletuskuva
    avatarImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200", // Oletuskuva
    gallery: [] as string[],
    memberSince: new Date().getFullYear(), 
  });
  
  useFocusEffect(
    useCallback(() => {
      checkUserAndLoadData();
    }, [])
  );

  async function checkUserAndLoadData() {
    setLoading(true);
    
    // 1. Tarkistetaan onko käyttäjä kirjautunut
    const { data: { session } } = await supabase.auth.getSession();
    setSession(session);

    if (session?.user) {
      // 2. Haetaan liittymisvuosi Supabasen tiedoista
      const joinYear = new Date(session.user.created_at).getFullYear();

      // 3. TÄSSÄ HAETAAN OIKEAT TIEDOT TIETOKANNASTA (ESIMERKKI)
      // Voit myöhemmin korvata nämä oikeilla tietokantakutsuilla (esim. getSessions())
      // const userSessions = await getMySessions();
      // const userProfile = await getMyProfile();
      
      setUserData((prev) => ({
        ...prev,
        memberSince: joinYear,
        // Kun tietokantakutsut ovat valmiit, aseta oikeat arvot tähän:
        // name: userProfile.name || prev.name,
        // bio: userProfile.bio || prev.bio,
        // sessionsCount: userSessions.length,
        // gallery: userSessions.map(s => s.photoUri).filter(Boolean),
      }));
    }
    
    setLoading(false);
  }

  const HeaderSection = ({ imageUrl, avatarUrl }: any) => (
  <View style={styles.headerContainer}>
    <Image source={{ uri: imageUrl }} style={styles.headerImage} resizeMode="cover" />
    <Image source={{ uri: avatarUrl }} style={styles.avatar} />
  </View>
);

const StatBox = ({ number, label, icon }: any) => (
  <View style={styles.statBox}>
    {icon ? icon : <Text style={styles.statNumber}>{number}</Text>}
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const NoteCategory = ({ category, value, max }: any) => (
  <View style={styles.noteRow}>
    <Text style={styles.noteCategory}>{category}</Text>
    <View style={styles.progressBarBackground}>
      <View style={[styles.progressBarFill, { width: `${(value / max) * 100}%` }]} />
    </View>
  </View>
)

  async function checkUser() {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    setLoading(false);
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text style={{color: COLORS.textSecondary}}>Ladataan...</Text>
      </View>
    )
  }


 if (!session || !session.user) {
   return (
    <SafeAreaView style={styles.centerContainer}>
       <View style={styles.loggedOutCard}>
        <Text style={styles.loggedOutEmoji}>🏺</Text>
         <Text style={styles.loggedOutTitle}>Tervetuloa keramiikkapäiväkirjaan</Text>
        <Text style={styles.loggedOutText}>
           Sovellus toimii tällä hetkellä paikallisesti laitteellasi. Voit halutessasi kirjautua sisään tallentaaksesi tiedot pilveen ja synkronoidaksesi ne laitteiden välillä.
         </Text>

        <TouchableOpacity style={styles.primaryButton}
           onPress={() => router.push('/login')}
        >
           <Text style={styles.primaryButtonText}>Kirjaudu sisään</Text>
         </TouchableOpacity>

         <TouchableOpacity style={styles.secondaryButton}
           onPress={() => router.push('/signup')}
         >

           <Text style={styles.secondaryButtonText}>Luo uusi tunnus </Text>
        </TouchableOpacity>
       </View>
     </SafeAreaView>
  );
 }


  return (


    <View style={{ flex: 1, backgroundColor: colors.background }}>
       <StatusBar barStyle="light-content"/>

        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <HeaderSection
            //navigation={navigation}
            imageUrl={userData.headerImage}
            avatarUrl={userData.avatarImage}
          />

        <View style={styles.bioSection}>
          <Text style={styles.name}>{userData.bio}</Text>
          <Text style={styles.handle}>{userData.handle}</Text>
          <Text style={styles.bio}>{userData.bio}</Text>
        </View>


        <View style={styles.statsContainer}>
          <StatBox number={userData.sessions} label="Sessionit" />
          <StatBox number={userData.glazeLogs} label="Glaze logs" />
          
          <StatBox
            label="Top mood"
            icon={<Ionicons name="leaf" size={24} color="green" />}
          />
          <Text style={styles.moodText}>{userData.topMood}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notes by category</Text>
          {userData.notes.map((note, index) => (
            <NoteCategory key={index} {...note} />
          ))}
        </View>
          
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gallery</Text>
          {userData.gallery.length > 0 ? (
            <View style={styles.galleryGrid}>
              {userData.gallery.map((uri, index) => (
                <Image key={index} source={{ uri }} style={styles.galleryImage} />
            ))}
          </View>
        ) : (
          <Text style={{ color: COLORS.textSecondary, fontStyle: 'italic' }}>
            Ei vielä kuvia galleriassa.
          </Text>
        )}
      </View>
      
      <View style={styles.footerCard}>
        <View style={styles.footerRow}>
          <Text style={styles.footerLabel}>Email:</Text>
          <Text style={styles.footerValue}>{session?.user?.email}</Text>
        </View>
        
        <View style={styles.footerDivider} />
        <View style={styles.footerRow}>
          <Text style={styles.footerLabel}>Member since:</Text>
          <Text style={styles.footerValue}>{userData.memberSince}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.signOutButton} onPress={() => console.log('Sign out')}>
        <Text style={styles.signOutButtonText}>Sign Out</Text>
      </TouchableOpacity>

      <View style={{ height: 30 }}/>

    </ScrollView>
  </View>



    // <ScrollView 
    //   style={styles.container} 
    //   contentContainerStyle={{ alignItems: 'center' }}
    // >
    
    //   <View style={styles.headerSection}>
    //     <Image 
    //       source={{ uri: 'https://via.placeholder.com/120' }}
    //       style={styles.headerImage}
    //     />

    //   </View>


    //   <View style={styles.profileContainer}>
    //     <View style={styles.avatar}>
    //       <Image
    //         source={{ uri: 'https://via.placeholder.com/120' }}
    //         style={ styles.profileImage }
    //       />
    //       <Text style={styles.avatarText}>🏺</Text>
    //     </View>

    //     {/* Korvaa nämä myöhemmin oikealla käyttäjätiedolla, kun lisäät
    //         kirjautumisen (Supabase Auth). Nyt tämä on paikkamerkki. */}
    //     <Text style={styles.profileName}>Sinun nimesi</Text>
    //     <Text style={styles.subtitle}>Keramiikan harrastaja</Text>

    //     <View style={styles.statsRow}>
    //       <View style={styles.statBox}>
    //         <Text style={styles.statNumber}>
    //           {pieceCount ?? "–"}
    //         </Text>
    //         <Text style={styles.statLabel}>Kappaletta</Text>
    //       </View>
    //     </View>
    //   </View>
    // </ScrollView>
  

);
}

const AVATAR_SIZE = 120;
const HEADER_HEIGHT = 200;

const styles = StyleSheet.create({

container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: COLORS.primary,
  },
  loggedOutCard: {
    backgroundColor: COLORS.white,
    padding: 24,
    borderRadius: 20,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  loggedOutEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  loggedOutTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  loggedOutText: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  primaryButton: {
    backgroundColor: COLORS.accent,
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: COLORS.statsBg,
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  secondaryButtonText: {
    color: COLORS.accent,
    fontSize: 16,
    fontWeight: '600',
  },

  scrollContent: {
    paddingBottom: 40,
  },
  // Header
  headerContainer: {
    height: HEADER_HEIGHT + AVATAR_SIZE / 2,
    marginBottom: AVATAR_SIZE / 2, // Tila avatarin limittymiselle
  },
  headerImage: {
    width: '100%',
    height: HEADER_HEIGHT,
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 10, // Androidille, SafeArea hoitaa iOS:n
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    color: COLORS.white,
    fontSize: 16,
    marginLeft: 4,
    fontWeight: '500',
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    borderWidth: 4,
    borderColor: COLORS.white,
    position: 'absolute',
    bottom: 0, // Limittyy headerin päälle
    left: 20,
  },
  // Bio Section
  bioSection: {
    paddingHorizontal: 20,
    marginTop: -10, // Hienosäätö avatarin alle
  },
  name: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  handle: {
    fontSize: 16,
    color: COLORS.accent,
    marginBottom: 12,
    fontWeight: '500',
  },
  bio: {
    fontSize: 16,
    color: COLORS.textSecondary,
    lineHeight: 22,
    marginBottom: 24,
  },
  // Stats
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  statBox: {
    flex: 1,
    backgroundColor: COLORS.statsBg,
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderRadius: 16,
    alignItems: 'center',
    marginHorizontal: 4, // Pieni väli laatikoiden välillä
    // Ohut border kuvan mukaisesti
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
    fontWeight: '500',
  },
  moodText: {
    position: 'absolute',
    // Asetettu manuaalisesti oikeaan kohtaan kolmannen laatikon sisälle
    bottom: 28, 
    alignSelf: 'center', 
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
    zIndex: 1,
  },
  // Sections (Notes & Gallery)
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 12,
    letterSpacing: 1,
    fontWeight: '600',
  },
  // Notes List
  noteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  noteCategory: {
    flex: 1, // Vie tilaa 
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '500',
  },
  progressBarBackground: {
    flex: 2, // Vie enemmän tilaa
    height: 6,
    backgroundColor: '#EAE0C8', // Vaaleampi versio palkista
    borderRadius: 3,
    marginHorizontal: 10,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.accent, // Ruskea palkki
    borderRadius: 3,
  },
  noteValue: {
    fontSize: 14,
    color: COLORS.textSecondary,
    width: 20, // Kiinteä leveys numerolle
    textAlign: 'right',
  },
  // Gallery
  galleryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4, // Kompensoi kuvien marginaalit
  },
  galleryImage: {
    width: '33.33%', // 3 per rivi
    height: 100,
    borderRadius: 12,
    marginBottom: 8,
    paddingHorizontal: 4, // Väli kuvien välillä
  },
  // Footer Card
  footerCard: {
    backgroundColor: COLORS.statsBg,
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  footerLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  footerValue: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '500',
  },
  footerDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 4,
  },
  // Sign Out Button
  signOutButton: {
    backgroundColor: COLORS.statsBg,
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  signOutButtonText: {
    fontSize: 16,
    color: COLORS.accent,
    fontWeight: '600',
  },
});