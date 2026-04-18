import { StatusBar } from 'expo-status-bar'
import { LinearGradient } from 'expo-linear-gradient'
import { useRef, useState } from 'react'
import {
  Animated,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
} from 'react-native'

type TabType = 'home' | 'wardrobe' | 'fitlab' | 'social' | 'settings'

interface SelectedClothes {
  top?: string
  bottom?: string
  outer?: string
}

export default function App() {
  const [screen, setScreen] = useState<'login' | 'main'>('login')
  const [activeTab, setActiveTab] = useState<TabType>('home')
  const [selectedClothes, setSelectedClothes] = useState<SelectedClothes>({})
  const fadeAnim = useRef(new Animated.Value(1)).current

  const handleLogin = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 220,
      useNativeDriver: true,
    }).start(() => {
      setScreen('main')
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 260,
        useNativeDriver: true,
      }).start()
    })
  }

  const renderMainContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen selectedClothes={selectedClothes} />
      case 'wardrobe':
        return (
          <WardrobeScreen
            onSelectClothes={(clothes) => {
              setSelectedClothes((prev) => ({ ...prev, ...clothes }))
              setActiveTab('home')
            }}
          />
        )
      case 'fitlab':
        return <FitLabScreen />
      case 'social':
        return <SocialScreen />
      case 'settings':
        return <SettingsScreen />
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <View style={styles.page}>
        <Animated.View style={[styles.phoneFrame, { opacity: fadeAnim }]}>
          {screen === 'login' ? (
            <>
              <View style={styles.logoRow}>
                <View style={styles.logoIcon}>
                  <View style={styles.logoDot} />
                </View>
                <Text style={styles.logoText}>Personal Codi</Text>
              </View>

              <View style={styles.header}>
                <Text style={styles.title}>로그인</Text>
                <Text style={styles.subtitle}>신뢰감 있는 스타일 추천을 시작해보세요</Text>
              </View>

              <View style={styles.form}>
                <TextInput
                  placeholder="이메일"
                  placeholderTextColor="#8b97ab"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={styles.input}
                />
                <TextInput
                  placeholder="비밀번호"
                  placeholderTextColor="#8b97ab"
                  secureTextEntry
                  style={styles.input}
                />
              </View>

              <View style={styles.linkRow}>
                <Pressable>
                  <Text style={styles.linkText}>비밀번호 찾기</Text>
                </Pressable>
                <Pressable>
                  <Text style={[styles.linkText, styles.signUpLinkText]}>회원가입</Text>
                </Pressable>
              </View>

              <View style={styles.bottomAction}>
                <Pressable style={styles.primaryButton} onPress={handleLogin}>
                  <LinearGradient
                    colors={['#1E3A8A', '#1E3A8A']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.primaryButtonGradient}
                  >
                    <Text style={styles.primaryButtonText}>로그인</Text>
                  </LinearGradient>
                </Pressable>

                <View style={styles.socialSection}>
                  <View style={styles.dividerWrap}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>또는 간편 로그인</Text>
                    <View style={styles.dividerLine} />
                  </View>

                  <View style={styles.socialButtons}>
                    <Pressable style={[styles.socialButton, styles.naverButton]}>
                      <Text style={styles.naverButtonText}>네이버로 계속하기</Text>
                    </Pressable>
                    <Pressable style={[styles.socialButton, styles.kakaoButton]}>
                      <Text style={styles.kakaoButtonText}>카카오톡으로 계속하기</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            </>
          ) : (
            <>
              <View style={styles.mainContentWrapper}>
                {renderMainContent()}
              </View>

              <View style={styles.bottomNav}>
                <TabButton
                  icon="📊"
                  label="핏 랩"
                  isActive={activeTab === 'fitlab'}
                  onPress={() => setActiveTab('fitlab')}
                />
                <TabButton
                  icon="🧥"
                  label="옷장"
                  isActive={activeTab === 'wardrobe'}
                  onPress={() => setActiveTab('wardrobe')}
                />
                <TabButton
                  icon="🏠"
                  label="홈"
                  isActive={activeTab === 'home'}
                  onPress={() => setActiveTab('home')}
                />
                <TabButton
                  icon="👥"
                  label="소셜"
                  isActive={activeTab === 'social'}
                  onPress={() => setActiveTab('social')}
                />
                <TabButton
                  icon="⚙️"
                  label="설정"
                  isActive={activeTab === 'settings'}
                  onPress={() => setActiveTab('settings')}
                />
              </View>
            </>
          )}
        </Animated.View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f3f5fb',
  },
  page: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f3f5fb',
  },
  phoneFrame: {
    width: '100%',
    maxWidth: 390,
    height: 790,
    backgroundColor: '#ffffff',
    borderRadius: 30,
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 0,
    borderWidth: 1,
    borderColor: '#dbe3f0',
    shadowColor: '#1e2a44',
    shadowOpacity: 0.14,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 12 },
    elevation: 10,
    overflow: 'hidden',
    flexDirection: 'column',
  },
  header: {
    gap: 7,
    marginTop: 18,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#1E3A8A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ffffff',
  },
  logoText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E3A8A',
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    color: '#1E3A8A',
    letterSpacing: -0.6,
  },
  subtitle: {
    color: '#1E3A8A',
    fontSize: 14,
    marginBottom: 6,
  },
  form: {
    marginTop: 20,
    gap: 12,
  },
  input: {
    height: 54,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d8e0ec',
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#0f223f',
  },
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingHorizontal: 2,
  },
  linkText: {
    color: '#1E3A8A',
    fontSize: 13,
    fontWeight: '600',
  },
  signUpLinkText: {
    color: '#1E3A8A',
  },
  bottomAction: {
    marginTop: 'auto',
    paddingTop: 12,
    marginBottom: 60,
    gap: 14,
  },
  primaryButton: {
    height: 56,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#0f2a5f',
    shadowOpacity: 0.28,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  primaryButtonGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
  },
  socialSection: {
    gap: 10,
  },
  dividerWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#d8e0ec',
  },
  dividerText: {
    color: '#1E3A8A',
    fontSize: 12,
    fontWeight: '600',
  },
  socialButtons: {
    gap: 10,
  },
  socialButton: {
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  naverButton: {
    backgroundColor: '#03c75a',
  },
  naverButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  kakaoButton: {
    backgroundColor: '#fee500',
  },
  kakaoButtonText: {
    color: '#1f1f1f',
    fontSize: 14,
    fontWeight: '700',
  },
  mainHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  mainTitle: {
    color: '#1E3A8A',
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: -0.4,
  },
  mainSubtitle: {
    color: '#1E3A8A',
    marginTop: 4,
    fontSize: 13,
  },
  profileIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#1E3A8A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileIconText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
  },
  gridWrap: {
    flex: 1,
    overflow: 'hidden',
  },
  gridContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 90,
    gap: 12,
  },
  gridItem: {
    width: '48%',
    gap: 8,
  },
  dummyImage: {
    height: 110,
    borderRadius: 14,
    backgroundColor: '#cfd6e2',
    borderWidth: 1,
    borderColor: '#bfc9d8',
  },
  itemLabel: {
    color: '#334155',
    fontSize: 13,
    fontWeight: '600',
  },
  tryButton: {
    backgroundColor: '#1E3A8A',
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  tryButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  screenContent: {
    flex: 1,
    overflow: 'hidden',
  },
  mainContentWrapper: {
    flex: 1,
    overflow: 'hidden',
  },
  screenTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E3A8A',
  },
  bottomNav: {
    paddingTop: 10,
    paddingHorizontal: 24,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: '#d8e0ec',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  navIcon: {
    fontSize: 15,
  },
  navIconActive: {
    color: '#1E3A8A',
  },
  navIconInactive: {
    color: '#CCCCCC',
  },
  navLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
  navLabelInactive: {
    color: '#CCCCCC',
  },
  navLabelActive: {
    color: '#1E3A8A',
  },
})

// Tab Button Component
interface TabButtonProps {
  icon: string
  label: string
  isActive: boolean
  onPress: () => void
}

function TabButton({ icon, label, isActive, onPress }: TabButtonProps) {
  return (
    <Pressable style={styles.navItem} onPress={onPress}>
      <Text style={[styles.navIcon, isActive ? styles.navIconActive : styles.navIconInactive]}>
        {icon}
      </Text>
      <Text style={[styles.navLabel, isActive ? styles.navLabelActive : styles.navLabelInactive]}>
        {label}
      </Text>
    </Pressable>
  )
}

// Home Screen Styles
const homeStyles = StyleSheet.create({
  homeScreen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    position: 'relative',
  },
  scrollView: {
    flex: 1,
    display: 'none',
  },
  scrollContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 0,
    paddingBottom: 0,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  statusBarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    display: 'none',
  },
  statusTime: {
    color: '#1E3A8A',
    fontWeight: '700',
    fontSize: 12,
  },
  statusIcons: {
    color: '#1E3A8A',
    fontSize: 12,
  },
  topHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 85,
    marginBottom: 0,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  userIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E7FDF4',
    borderWidth: 1.5,
    borderColor: '#1E3A8A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userIconText: {
    fontSize: 16,
  },
  greetingText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E3A8A',
  },
  weatherBox: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: '#F8FAFF',
    borderWidth: 1,
    borderColor: '#E5E9F2',
  },
  weatherText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E3A8A',
  },
  floatingButtonsContainer: {
    position: 'absolute',
    left: 20,
    top: 110,
    zIndex: 10,
  },
  floatingButtonItem: {
    alignItems: 'center',
    marginBottom: 12,
  },
  floatingButtonCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#1E3A8A',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1E3A8A',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  floatingButtonIcon: {
    fontSize: 14,
  },
  floatingButtonLabel: {
    marginTop: 3,
    fontSize: 9,
    fontWeight: '700',
    color: '#1E3A8A',
  },
  fittingRoomContainer: {
    flex: 7,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
    marginBottom: 0,
    marginTop: 0,
  },
  avatarCard: {
    width: '100%',
    maxWidth: 300,
    height: '100%',
    borderRadius: 36,
    backgroundColor: '#F8FAFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1E3A8A',
    shadowOpacity: 0.08,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
    padding: 12,
  },
  avatarStage: {
    width: '100%',
    flex: 1,
    borderRadius: 28,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  avatarBody: {
    width: '65%',
    aspectRatio: 0.58,
    backgroundColor: '#E6D1B7',
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 18,
    shadowColor: '#1E3A8A',
    shadowOpacity: 0.05,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 12 },
    elevation: 6,
    display: 'none',
  },
  avatarHead: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#D6BFA5',
    marginBottom: 12,
    display: 'none',
  },
  avatarShoulders: {
    width: '100%',
    height: 32,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: '#D1B497',
    marginBottom: 10,
    display: 'none',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
    resizeMode: 'cover',
  },
  avatarHintText: {
    marginTop: 8,
    fontSize: 10,
    color: '#5E6C85',
  },
  actionRow: {
    flex: 0.9,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 36,
    marginBottom: 0,
    paddingVertical: 0,
  },
  actionButton: {
    flex: 1,
    height: 40,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
    backgroundColor: '#ffffff',
  },
  wardrobeButton: {
    borderColor: '#1E3A8A',
  },
  favoriteButton: {
    borderColor: '#CBD5E1',
  },
  actionButtonIcon: {
    fontSize: 16,
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E3A8A',
  },
  wardrobeText: {
    color: '#1E3A8A',
  },
  favoriteText: {
    color: '#6B7280',
  },
  categorySection: {
    flex: 1.9,
    marginBottom: 0,
    marginTop: 0,
    paddingBottom: 4,
  },
  categoryScroll: {
    paddingBottom: 0,
    paddingLeft: 6,
  },
  categoryCard: {
    width: 70,
    alignItems: 'center',
    marginRight: 10,
  },
  categoryCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F8FAFF',
    borderWidth: 1,
    borderColor: '#E5E9F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  categoryIcon: {
    fontSize: 24,
  },
  categoryLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#1E3A8A',
    textAlign: 'center',
    lineHeight: 13,
  },
})

// Home Screen
interface HomeScreenProps {
  selectedClothes: SelectedClothes
}

function HomeScreen({ selectedClothes }: HomeScreenProps) {
  const [avatarFaceIndex, setAvatarFaceIndex] = useState(0)
  const startX = useRef<number | null>(null)

  const faceLabels = ['앞모습', '옆모습', '뒷모습']
  const categories = [
    { label: '네이비 셔츠', icon: '👔' },
    { label: '청바지 1', icon: '👖' },
    { label: '청바지 2', icon: '👖' },
    { label: '레더 자켓', icon: '🧥' },
  ]

  const handleResponderGrant = (event: any) => {
    startX.current = event.nativeEvent.pageX
  }

  const handleResponderRelease = (event: any) => {
    if (startX.current === null) {
      return
    }
    const delta = event.nativeEvent.pageX - startX.current
    if (Math.abs(delta) > 24) {
      setAvatarFaceIndex((prev) => {
        if (delta > 0) {
          return prev === 0 ? 2 : prev - 1
        }
        return prev === 2 ? 0 : prev + 1
      })
    }
    startX.current = null
  }

  return (
    <View style={homeStyles.homeScreen}>
      <View style={homeStyles.scrollContent}>
        <View style={homeStyles.topHeaderRow}>
          <View style={homeStyles.userSection}>
            <View style={homeStyles.userIconWrap}>
              <Text style={homeStyles.userIconText}>👤</Text>
            </View>
            <Text style={homeStyles.greetingText}>user</Text>
          </View>

          <View style={homeStyles.weatherBox}>
            <Text style={homeStyles.weatherText}>☀️ 22°C</Text>
          </View>
        </View>

        <View style={homeStyles.fittingRoomContainer}>
          <View style={homeStyles.avatarCard}>
            <View
              style={homeStyles.avatarStage}
              onStartShouldSetResponder={() => true}
              onResponderGrant={handleResponderGrant}
              onResponderRelease={handleResponderRelease}
            >
              <Image
                style={homeStyles.avatarImage}
                source={{
                  uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/w8AAsMB7RWX0U0AAAAASUVORK5CYII=',
                }}
              />
            </View>
            <Text style={homeStyles.avatarHintText}>{faceLabels[avatarFaceIndex]} - 좌우 드래그</Text>
          </View>
        </View>

        <View style={homeStyles.actionRow}>
          <Pressable style={[homeStyles.actionButton, homeStyles.wardrobeButton]}>
            <Text style={[homeStyles.actionButtonIcon, homeStyles.wardrobeText]}>🗄️</Text>
            <Text style={[homeStyles.actionButtonText, homeStyles.wardrobeText]}>옷장</Text>
          </Pressable>
          <Pressable style={[homeStyles.actionButton, homeStyles.favoriteButton]}>
            <Text style={[homeStyles.actionButtonIcon, homeStyles.favoriteText]}>♡</Text>
            <Text style={[homeStyles.actionButtonText, homeStyles.favoriteText]}>찜</Text>
          </Pressable>
        </View>

        <View style={homeStyles.categorySection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={homeStyles.categoryScroll}
          >
            {categories.map((item) => (
              <View key={item.label} style={homeStyles.categoryCard}>
                <View style={homeStyles.categoryCircle}>
                  <Text style={homeStyles.categoryIcon}>{item.icon}</Text>
                </View>
                <Text style={homeStyles.categoryLabel}>{item.label}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>

      <View style={homeStyles.floatingButtonsContainer}>
        <View style={homeStyles.floatingButtonItem}>
          <Pressable style={homeStyles.floatingButtonCircle}>
            <Text style={homeStyles.floatingButtonIcon}>✨</Text>
          </Pressable>
          <Text style={homeStyles.floatingButtonLabel}>AI 추천</Text>
        </View>

        <View style={homeStyles.floatingButtonItem}>
          <Pressable style={homeStyles.floatingButtonCircle}>
            <Text style={homeStyles.floatingButtonIcon}>💾</Text>
          </Pressable>
          <Text style={homeStyles.floatingButtonLabel}>코디북</Text>
        </View>
      </View>
    </View>
  )
}

// Wardrobe Screen (기존 옷 리스트)
interface WardrobeScreenProps {
  onSelectClothes: (clothes: Partial<SelectedClothes>) => void
}

interface ClothingItem {
  name: string
  type: 'top' | 'bottom' | 'outer'
}

function WardrobeScreen({ onSelectClothes }: WardrobeScreenProps) {
  const clothingItems: ClothingItem[] = [
    { name: '검정 셔츠', type: 'top' },
    { name: '청바지', type: 'bottom' },
    { name: '화이트 셔츠', type: 'top' },
    { name: '네이비 자켓', type: 'outer' },
    { name: '그레이 슬랙스', type: 'bottom' },
    { name: '스니커즈', type: 'outer' },
  ]

  const handleSelectClothing = (item: ClothingItem) => {
    const clothesData: Partial<SelectedClothes> = {}
    clothesData[item.type] = item.name
    onSelectClothes(clothesData)
  }

  return (
    <View style={styles.screenContent}>
      <View style={styles.mainHeader}>
        <View>
          <Text style={styles.mainTitle}>user의 옷장</Text>
          <Text style={styles.mainSubtitle}>옷을 선택해 입어보세요</Text>
        </View>
        <View style={styles.profileIcon}>
          <Text style={styles.profileIconText}>U</Text>
        </View>
      </View>

      <ScrollView
        style={styles.gridWrap}
        contentContainerStyle={styles.gridContent}
        showsVerticalScrollIndicator={false}
      >
        {clothingItems.map((item) => (
          <View key={item.name} style={styles.gridItem}>
            <View style={styles.dummyImage} />
            <Text style={styles.itemLabel}>{item.name}</Text>
            <Pressable
              style={styles.tryButton}
              onPress={() => handleSelectClothing(item)}
            >
              <Text style={styles.tryButtonText}>입어보기</Text>
            </Pressable>
          </View>
        ))}
      </ScrollView>
    </View>
  )
}

// Fit Lab Screen
function FitLabScreen() {
  return (
    <View style={styles.screenContainer}>
      <Text style={styles.screenTitle}>핏 랩 화면입니다</Text>
    </View>
  )
}

// Social Screen
function SocialScreen() {
  return (
    <View style={styles.screenContainer}>
      <Text style={styles.screenTitle}>소셜 화면입니다</Text>
    </View>
  )
}

// Settings Screen
function SettingsScreen() {
  return (
    <View style={styles.screenContainer}>
      <Text style={styles.screenTitle}>설정 화면입니다</Text>
    </View>
  )
}


