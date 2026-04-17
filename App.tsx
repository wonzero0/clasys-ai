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
} from 'react-native'

type TabType = 'home' | 'wardrobe' | 'ai' | 'community' | 'settings'

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
      case 'ai':
        return <AIRecommendScreen />
      case 'community':
        return <CommunityScreen />
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
                  icon="🏠"
                  label="홈"
                  isActive={activeTab === 'home'}
                  onPress={() => setActiveTab('home')}
                />
                <TabButton
                  icon="🧥"
                  label="옷장"
                  isActive={activeTab === 'wardrobe'}
                  onPress={() => setActiveTab('wardrobe')}
                />
                <TabButton
                  icon="✨"
                  label="AI 추천"
                  isActive={activeTab === 'ai'}
                  onPress={() => setActiveTab('ai')}
                />
                <TabButton
                  icon="💬"
                  label="커뮤니티"
                  isActive={activeTab === 'community'}
                  onPress={() => setActiveTab('community')}
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
    maxWidth: 360,
    height: 640,
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
    marginBottom: 20,
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
    color: '#1E3A8A',
  },
  navLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
  navLabelInactive: {
    color: '#1E3A8A',
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
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  greetingText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E3A8A',
  },
  weatherText: {
    fontSize: 16,
    color: '#1E3A8A',
    fontWeight: '600',
  },
  fittingRoomContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  avatarBox: {
    width: '100%',
    height: '100%',
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#1E3A8A',
    borderRadius: 12,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  clothesDisplay: {
    alignItems: 'center',
    gap: 10,
  },
  clothesLabel: {
    fontSize: 11,
    color: '#1E3A8A',
    fontWeight: '600',
  },
  clothesName: {
    fontSize: 13,
    color: '#1E3A8A',
    fontWeight: '700',
  },
  noClothesMessage: {
    fontSize: 14,
    color: '#1E3A8A',
    fontWeight: '600',
    textAlign: 'center',
  },
  ootdCard: {
    backgroundColor: 'rgba(30, 58, 138, 0.08)',
    borderWidth: 1,
    borderColor: '#1E3A8A',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 6,
    marginTop: 6,
  },
  ootdLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1E3A8A',
  },
  ootdItemRow: {
    flexDirection: 'row',
    gap: 6,
  },
  ootdDummy: {
    flex: 1,
    height: 50,
    backgroundColor: '#e8ecf6',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d8e0ec',
  },
})

// Home Screen
interface HomeScreenProps {
  selectedClothes: SelectedClothes
}

function HomeScreen({ selectedClothes }: HomeScreenProps) {
  const hasClothes =
    selectedClothes.top || selectedClothes.bottom || selectedClothes.outer

  return (
    <View style={homeStyles.homeScreen}>
      {/* 상단 헤더 */}
      <View style={homeStyles.headerRow}>
        <Text style={homeStyles.greetingText}>user님 환영합니다.</Text>
        <Text style={homeStyles.weatherText}>☀️ 22°C</Text>
      </View>

      {/* 중앙 아바타 영역 - 화면의 80% */}
      <View style={homeStyles.fittingRoomContainer}>
        <View style={homeStyles.avatarBox}>
          {hasClothes ? (
            <View style={homeStyles.clothesDisplay}>
              {selectedClothes.outer && (
                <View>
                  <Text style={homeStyles.clothesLabel}>아우터</Text>
                  <Text style={homeStyles.clothesName}>{selectedClothes.outer}</Text>
                </View>
              )}
              {selectedClothes.top && (
                <View>
                  <Text style={homeStyles.clothesLabel}>상의</Text>
                  <Text style={homeStyles.clothesName}>{selectedClothes.top}</Text>
                </View>
              )}
              {selectedClothes.bottom && (
                <View>
                  <Text style={homeStyles.clothesLabel}>하의</Text>
                  <Text style={homeStyles.clothesName}>{selectedClothes.bottom}</Text>
                </View>
              )}
            </View>
          ) : (
            <Text style={homeStyles.noClothesMessage}>
              옷장에서 옷을 골라주세요
            </Text>
          )}
        </View>
      </View>

      {/* 하단 저장된 코디 세트 */}
      <View style={homeStyles.ootdCard}>
        <Text style={homeStyles.ootdLabel}>저장된 코디 세트</Text>
        <View style={homeStyles.ootdItemRow}>
          <Pressable style={homeStyles.ootdDummy}>
            <Text style={{ color: '#1E3A8A', fontWeight: '700', fontSize: 12 }}>
              [1]
            </Text>
          </Pressable>
          <Pressable style={homeStyles.ootdDummy}>
            <Text style={{ color: '#1E3A8A', fontWeight: '700', fontSize: 12 }}>
              [2]
            </Text>
          </Pressable>
          <Pressable style={homeStyles.ootdDummy}>
            <Text style={{ color: '#1E3A8A', fontWeight: '700', fontSize: 12 }}>
              [3]
            </Text>
          </Pressable>
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

// AI Recommend Screen
function AIRecommendScreen() {
  return (
    <View style={styles.screenContainer}>
      <Text style={styles.screenTitle}>AI 추천 화면입니다</Text>
    </View>
  )
}

// Community Screen
function CommunityScreen() {
  return (
    <View style={styles.screenContainer}>
      <Text style={styles.screenTitle}>커뮤니티 화면입니다</Text>
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


