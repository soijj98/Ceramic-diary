import { useCallback, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View, TouchableOpacity, StatusBar } from "react-native";
import { useFocusEffect } from "expo-router";
import { colors, radius, spacing } from "@/constants/theme";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons'; 

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

const MOCK_DATA = {
  name: 'Maya Ossi',
  handle: 'Earthwork Studio • Portland, OR',
  bio: 'Wheel thrower and glaze nerd. Obsessed with reduction firing and the chaos of ash glazes.',
  sessions: 3,
  glazeLogs: 1,
  topMood: 'Growing',
  notes: [
    { category: 'Wheel', value: 1 , max: 1 },
    { category: 'HandBuilding', value: 1 , max: 1 },
    { category: 'Glaze', value: 1, max: 1 }
  ],
  headerImage: 'https://images.unsplash.com/photo-1565195660138-e1c432f76f28?q=80&w=800',
  avatarImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200',
  gallery: [
    'https://images.unsplash.com/photo-1611280104291-38c5e034697a?q=80&w=300',
    'https://images.unsplash.com/photo-1578749556568-bc5c40e18084?q=80&w=300',
    'https://images.unsplash.com/photo-1594368918772-0a61da77e07c?q=80&w=300',
    'https://images.unsplash.com/photo-1612193114931-75332b4a606a?q=80&w=300',
    'https://images.unsplash.com/photo-1534518634116-4d87951176a4?q=80&w=300',
    'https://images.unsplash.com/photo-1577153923763-2b042e6fc1ea?q=80&w=300',
  ],
  email: 'maya@claystudio.co',
  memberSince: 2023,
}


const HeaderSection = ({ navigation, imageUrl, avatarUrl }: any) => (
  <View style={styles.headerContainer}>
    <Image source={{ uri: imageUrl }} style={styles.headerImage} resizeMode="cover" />
    <SafeAreaView style={styles.topBar}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="white" />
        <Text style={styles.backButtonText}>Takaisin</Text>
      </TouchableOpacity>
    </SafeAreaView>
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
  const [pieceCount, setPieceCount] = useState<number | null>(null);

  useFocusEffect(
    useCallback(() => {
      // data loading removed: listPieces not exported from '@/lib/data'
      setPieceCount(null);
    }, [])
  );

  return (


    <View style={{ flex: 1, backgroundColor: colors.background }}>
       <StatusBar barStyle="light-content"/>

        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <HeaderSection
            //navigation={navigation}
            imageUrl={MOCK_DATA.headerImage}
            avatarUrl={MOCK_DATA.avatarImage}
          />

        <View style={styles.bioSection}>
          <Text style={styles.name}>{MOCK_DATA.bio}</Text>
          <Text style={styles.handle}>{MOCK_DATA.handle}</Text>
          <Text style={styles.bio}>{MOCK_DATA.bio}</Text>
        </View>


        <View style={styles.statsContainer}>
          <StatBox number={MOCK_DATA.sessions} label="Sessionit" />
          <StatBox number={MOCK_DATA.glazeLogs} label="Glaze logs" />
          
          <StatBox
            label="Top mood"
            icon={<Ionicons name="leaf" size={24} color="green" />}
          />
          <Text style={styles.moodText}>{MOCK_DATA.topMood}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notes by category</Text>
          {MOCK_DATA.notes.map((note, index) => (
            <NoteCategory key={index} {...note} />
          ))}
        </View>
          
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gallery</Text>
          <View style={styles.galleryGrid}>
            {MOCK_DATA.gallery.map((uri, index) => (
              <Image key={index} source={{ uri }} style={styles.galleryImage} />
            ))}
          </View>
      </View>
      
      <View style={styles.footerCard}>
        <View style={styles.footerRow}>
          <Text style={styles.footerLabel}>Email:</Text>
          <Text style={styles.footerValue}>{MOCK_DATA.email}</Text>
        </View>
        
        <View style={styles.footerDivider} />
        <View style={styles.footerRow}>
          <Text style={styles.footerLabel}>Member since:</Text>
          <Text style={styles.footerValue}>{MOCK_DATA.memberSince}</Text>
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