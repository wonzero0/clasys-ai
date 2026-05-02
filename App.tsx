import { StatusBar } from 'expo-status-bar'
import { LinearGradient } from 'expo-linear-gradient'
import { Feather } from '@expo/vector-icons'
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

type TabType = 'home' | 'wardrobe' | 'fitlab' | 'social' | 'settings'

interface SelectedClothes {
  top?: string
  bottom?: string
  outer?: string
}

interface HomeScreenProps {
  selectedClothes: SelectedClothes
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
            onSelectClothes={(clothes: Partial<SelectedClothes>) => {
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
      default:
        return <HomeScreen selectedClothes={selectedClothes} />
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <View style={styles.page}>
        <Animated.View style={[styles.phoneFrame, { opacity: fadeAnim }]}>
          {screen === 'login' ? (
            <View style={styles.loginScreen}>
              <View style={styles.logoRow}>
                <View style={styles.logoIcon}>
                  <View style={styles.logoDot} />
                </View>
                <Text style={styles.logoText}>Style Log</Text>
              </View>

              <View style={styles.header}>
                <Text style={styles.title}>로그인</Text>
                <Text style={styles.subtitle}>나에게 맞는 스타일을 시작해보세요</Text>
              </View>

              <View style={styles.form}>
                <TextInput
                  placeholder="이메일"
                  placeholderTextColor="#999"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={styles.input}
                />
                <TextInput
                  placeholder="비밀번호"
                  placeholderTextColor="#999"
                  secureTextEntry
                  style={styles.input}
                />
              </View>

              <View style={styles.linkRow}>
                <Pressable>
                  <Text style={styles.linkText}>비밀번호 찾기</Text>
                </Pressable>
                <Pressable>
                  <Text style={styles.linkText}>회원가입</Text>
                </Pressable>
              </View>

              <View style={styles.bottomAction}>
                <Pressable style={styles.primaryButton} onPress={handleLogin}>
                  <LinearGradient colors={['#003d7a', '#001a4d']} style={styles.primaryButtonGradient}>
                    <Text style={styles.primaryButtonText}>로그인</Text>
                  </LinearGradient>
                </Pressable>
              </View>
            </View>
          ) : (
            <View style={styles.appScreen}>
              <View style={styles.mainContentWrapper}>{renderMainContent()}</View>

              <View style={styles.bottomNav}>
                <TabButton
                  icon="briefcase"
                  isActive={activeTab === 'fitlab'}
                  onPress={() => setActiveTab('fitlab')}
                />
                <TabButton
                  icon="calendar"
                  isActive={activeTab === 'wardrobe'}
                  onPress={() => setActiveTab('wardrobe')}
                />
                <TabButton
                  icon="home"
                  isActive={activeTab === 'home'}
                  onPress={() => setActiveTab('home')}
                />
                <TabButton
                  icon="heart"
                  isActive={activeTab === 'social'}
                  onPress={() => setActiveTab('social')}
                />
                <TabButton
                  icon="user"
                  isActive={activeTab === 'settings'}
                  onPress={() => setActiveTab('settings')}
                />
              </View>
            </View>
          )}
        </Animated.View>
      </View>
    </SafeAreaView>
  )
}

function TabButton({
  icon,
  isActive,
  onPress,
}: {
  icon: keyof typeof Feather.glyphMap
  isActive: boolean
  onPress: () => void
}) {
  return (
    <Pressable style={styles.tabItem} onPress={onPress}>
      <Feather
        name={icon}
        size={25}
        color={isActive ? '#003d7a' : '#B8B8B8'}
        strokeWidth={2}
      />
    </Pressable>
  )
}

function getTopTone(name?: string) {
  if (!name) return '#D7C4AE'
  if (name.includes('네이비')) return '#1E3A8A'
  if (name.includes('화이트')) return '#F8FAFF'
  if (name.includes('검정')) return '#111827'
  return '#64748B'
}

function getBottomTone(name?: string) {
  if (!name) return '#D7C4AE'
  if (name.includes('청바지')) return '#3B82F6'
  if (name.includes('슬랙스')) return '#334155'
  if (name.includes('블랙')) return '#111827'
  return '#64748B'
}

function getOuterTone(name?: string) {
  if (!name) return '#D7C4AE'
  if (name.includes('레더')) return '#1F2937'
  if (name.includes('자켓')) return '#374151'
  if (name.includes('코트')) return '#4B5563'
  return '#4B5563'
}

function HomeScreen({ selectedClothes }: HomeScreenProps) {
  const [viewMode, setViewMode] = useState<'wardrobe' | 'basket'>('wardrobe')
  const [chatOpen, setChatOpen] = useState(false)
  const [saveToastVisible, setSaveToastVisible] = useState(false)
  const saveToastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const itemPicker = [
    { label: '네이비 셔츠', icon: '👔' },
    { label: '청바지 1', icon: '👖' },
    { label: '청바지 2', icon: '👖' },
    { label: '레더 자켓', icon: '🧥' },
    { label: '니트', icon: '🧶' },
  ]

  const selectedTags = Object.values(selectedClothes).filter(Boolean)

  const topTone = getTopTone(selectedClothes.top)
  const bottomTone = getBottomTone(selectedClothes.bottom)
  const outerTone = getOuterTone(selectedClothes.outer)

  const handleSaveOutfit = () => {
    setSaveToastVisible(true)
    if (saveToastTimer.current) clearTimeout(saveToastTimer.current)
    saveToastTimer.current = setTimeout(() => setSaveToastVisible(false), 1600)
  }

  return (
    <View style={homeStyles.homeScreen}>
      <View style={homeStyles.homeTopRow}>
        <View style={homeStyles.homeUserSection}>
          <Feather name="user" size={20} color="#333" />
          <Text style={homeStyles.homeGreetingText}>user</Text>
        </View>

        <View style={homeStyles.homeWeatherBox}>
          <Feather name="sun" size={18} color="#333" />
          <Text style={homeStyles.homeWeatherText}>22°C</Text>
        </View>
      </View>

      <View style={homeStyles.homeBody}>
        <View style={homeStyles.homeActionDock}>
          <View style={homeStyles.homeSideAction}>
            <Pressable style={homeStyles.homeFabCircle} onPress={() => setChatOpen(!chatOpen)}>
              <Feather name="star" size={24} color="#003d7a" />
            </Pressable>
            <Text style={homeStyles.homeSideLabel}>AI 추천</Text>
          </View>

          <View style={homeStyles.homeSideAction}>
            <Pressable style={homeStyles.homeFabCircle} onPress={handleSaveOutfit}>
              <Feather name="book-open" size={23} color="#003d7a" />
            </Pressable>
            <Text style={homeStyles.homeSideLabel}>코디북</Text>
          </View>
        </View>

        {chatOpen && (
          <View style={homeStyles.homeChatPopup}>
            <Text style={homeStyles.homeChatText}>오늘은 네이비 셔츠와 데님 조합이 좋아요.</Text>
            <Pressable onPress={() => setChatOpen(false)}>
              <Text style={homeStyles.homeChatClose}>닫기</Text>
            </Pressable>
          </View>
        )}

        <View style={homeStyles.avatarArea}>
          <View style={homeStyles.avatarFigure}>
            <View style={homeStyles.avatarHead} />
            <View style={homeStyles.avatarNeck} />
            <View
              style={[
                homeStyles.avatarOuterLayer,
                selectedClothes.outer ? homeStyles.avatarOuterLayerActive : homeStyles.avatarOuterLayerBase,
              ]}
            />
            <View
              style={[
                homeStyles.avatarTopLayer,
                selectedClothes.top ? { backgroundColor: topTone } : homeStyles.avatarTopLayerBase,
              ]}
            />
            <View
              style={[
                homeStyles.avatarBottomLayer,
                selectedClothes.bottom ? { backgroundColor: bottomTone } : homeStyles.avatarBottomLayerBase,
              ]}
            />
            <View style={homeStyles.avatarLegs}>
              <View style={[homeStyles.avatarLeg, selectedClothes.bottom && { backgroundColor: bottomTone }]} />
              <View style={[homeStyles.avatarLeg, selectedClothes.bottom && { backgroundColor: bottomTone }]} />
            </View>

            {selectedClothes.outer ? (
              <View style={[homeStyles.avatarOuterBadge, { backgroundColor: outerTone }]}>
                <Text style={homeStyles.avatarOuterBadgeText}>{selectedClothes.outer}</Text>
              </View>
            ) : null}
          </View>
        </View>

        {selectedTags.length > 0 && (
          <Text style={homeStyles.homeSelectionText}>{selectedTags.join(' / ')}</Text>
        )}

        <View style={homeStyles.homePillRow}>
          <Pressable
            style={[
              homeStyles.homePillButton,
              viewMode === 'wardrobe' && homeStyles.homePillButtonPrimary,
            ]}
            onPress={() => setViewMode('wardrobe')}
          >
            <Feather
              name="sidebar"
              size={20}
              color={viewMode === 'wardrobe' ? '#FFFFFF' : '#334155'}
            />
            <Text
              style={[
                homeStyles.homePillText,
                viewMode === 'wardrobe' && homeStyles.homePillTextActive,
              ]}
            >
              옷장
            </Text>
          </Pressable>

          <Pressable
            style={[
              homeStyles.homePillButton,
              viewMode === 'basket' && homeStyles.homePillButtonPrimary,
            ]}
            onPress={() => setViewMode('basket')}
          >
            <Feather
              name="heart"
              size={21}
              color={viewMode === 'basket' ? '#FFFFFF' : '#334155'}
            />
            <Text
              style={[
                homeStyles.homePillText,
                viewMode === 'basket' && homeStyles.homePillTextActive,
              ]}
            >
              찜
            </Text>
          </Pressable>
        </View>
      </View>

      <View style={homeStyles.homeBottomPanel}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {itemPicker.map((item) => (
            <View key={item.label} style={homeStyles.homePocketItem}>
              <View style={homeStyles.homePocketCircle}>
                <Text style={homeStyles.homePocketIcon}>{item.icon}</Text>
              </View>
              <Text style={homeStyles.homePocketName}>{item.label}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {saveToastVisible && (
        <View style={homeStyles.homeToast}>
          <Text style={homeStyles.homeToastText}>코디가 저장되었어요</Text>
        </View>
      )}
    </View>
  )
}

function WardrobeScreen({
  onSelectClothes,
}: {
  onSelectClothes: (clothes: Partial<SelectedClothes>) => void
}) {
  const items = [
    { name: '네이비 셔츠', type: 'top' as const, meta: '상의 · 옥스포드 코튼' },
    { name: '청바지 1', type: 'bottom' as const, meta: '하의 · 데님' },
    { name: '레더 자켓', type: 'outer' as const, meta: '아우터 · 합성가죽' },
  ]

  return (
    <View style={styles.screenPlaceholder}>
      <View style={styles.screenHeader}>
        <Text style={styles.screenTitle}>내 옷장</Text>
        <Pressable style={styles.minimalButton}>
          <Text style={styles.minimalButtonText}>+ 옷 사진 추가</Text>
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {items.map((item) => (
          <Pressable
            key={item.name}
            style={styles.wardrobeRow}
            onPress={() => onSelectClothes({ [item.type]: item.name })}
          >
            <View>
              <Text style={styles.wardrobeName}>{item.name}</Text>
              <Text style={styles.wardrobeMeta}>{item.meta}</Text>
            </View>
            <Text style={styles.wardrobeActionText}>입어보기</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  )
}

function FitLabScreen() {
  return (
    <View style={styles.screenPlaceholder}>
      <Text style={styles.screenTitle}>핏 랩</Text>
      <View style={styles.simpleCard}>
        <Text style={styles.cardTitle}>체형 분석</Text>
        <Text style={styles.cardText}>A-line · 어깨선이 자연스럽게 보이는 코디 추천</Text>
      </View>
      <View style={styles.simpleCard}>
        <Text style={styles.cardTitle}>퍼스널 컬러</Text>
        <Text style={styles.cardText}>Cool Summer · 네이비, 화이트 계열 추천</Text>
      </View>
    </View>
  )
}

function SocialScreen() {
  return (
    <View style={styles.screenPlaceholder}>
      <Text style={styles.screenTitle}>소셜</Text>
      <View style={styles.simpleCard}>
        <Text style={styles.cardTitle}>전체 피드</Text>
        <Text style={styles.cardText}>비슷한 체형의 코디를 참고해보세요.</Text>
      </View>
    </View>
  )
}

function SettingsScreen() {
  return (
    <View style={styles.screenPlaceholder}>
      <Text style={styles.screenTitle}>설정</Text>
      <View style={styles.simpleCard}>
        <Text style={styles.cardTitle}>프로필</Text>
        <Text style={styles.cardText}>체형 정보와 퍼스널 컬러를 관리합니다.</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F3F3F3',
  },
  page: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F3F3',
    padding: 20,
  },
  phoneFrame: {
    width: 390,
    height: 844,
    maxWidth: '100%',
    maxHeight: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 34,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 8,
  },
  appScreen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loginScreen: {
    flex: 1,
    padding: 30,
    justifyContent: 'center',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  logoIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  logoText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#111',
  },
  subtitle: {
    fontSize: 14,
    color: '#777',
    marginTop: 5,
  },
  form: {
    gap: 14,
  },
  input: {
    height: 54,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
  },
  linkText: {
    color: '#333',
    fontSize: 13,
    fontWeight: '600',
  },
  bottomAction: {
    marginTop: 38,
  },
  primaryButton: {
    height: 54,
    borderRadius: 12,
    overflow: 'hidden',
  },
  primaryButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  mainContentWrapper: {
    flex: 1,
  },
  bottomNav: {
    flexDirection: 'row',
    height: 78,
    borderTopWidth: 1,
    borderTopColor: '#EDEDED',
    backgroundColor: '#FFFFFF',
    paddingBottom: 18,
    paddingTop: 10,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  screenPlaceholder: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 62,
    backgroundColor: '#FFFFFF',
  },
  screenHeader: {
    gap: 14,
    marginBottom: 24,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111',
    marginBottom: 12,
  },
  minimalButton: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: '#FFFFFF',
  },
  minimalButtonText: {
    color: '#333',
    fontWeight: '600',
  },
  wardrobeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  wardrobeName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
  },
  wardrobeMeta: {
    marginTop: 5,
    color: '#777',
    fontSize: 12,
  },
  wardrobeActionText: {
    color: '#003d7a',
    fontWeight: '700',
  },
  simpleCard: {
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
    marginBottom: 8,
  },
  cardText: {
    color: '#777',
    lineHeight: 20,
  },
})

const homeStyles = StyleSheet.create({
  homeScreen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  homeTopRow: {
    height: 74,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  homeUserSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  homeGreetingText: {
    fontSize: 19,
    fontWeight: '700',
    color: '#111',
  },
  homeWeatherBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  homeWeatherText: {
    fontSize: 19,
    fontWeight: '700',
    color: '#111',
  },
  homeBody: {
    flex: 1,
    position: 'relative',
    alignItems: 'center',
  },
  homeActionDock: {
    position: 'absolute',
    left: 0,
    top: 28,
    zIndex: 10,
    gap: 18,
  },
  homeSideAction: {
    alignItems: 'center',
  },
  homeFabCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#003d7a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  homeSideLabel: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '700',
    color: '#111',
  },
  homeChatPopup: {
    position: 'absolute',
    left: 70,
    top: 38,
    width: 220,
    backgroundColor: '#111',
    padding: 14,
    borderRadius: 14,
    zIndex: 20,
  },
  homeChatText: {
    color: '#FFFFFF',
    fontSize: 13,
    lineHeight: 19,
  },
  homeChatClose: {
    color: '#FFFFFF',
    marginTop: 8,
    fontWeight: '700',
  },
  avatarArea: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
  },
  avatarFigure: {
    alignItems: 'center',
    transform: [{ scale: 1.05 }],
    position: 'relative',
  },
  avatarHead: {
    width: 62,
    height: 72,
    borderRadius: 32,
    backgroundColor: '#D7C4AE',
    zIndex: 4,
  },
  avatarNeck: {
    width: 24,
    height: 18,
    backgroundColor: '#D7C4AE',
    marginTop: -2,
    zIndex: 3,
  },
  avatarOuterLayer: {
    position: 'absolute',
    top: 70,
    left: '50%',
    marginLeft: -76,
    width: 152,
    height: 248,
    borderRadius: 54,
    zIndex: 1,
    opacity: 0.9,
  },
  avatarOuterLayerBase: {
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  avatarOuterLayerActive: {
    backgroundColor: '#2F3640',
  },
  avatarTopLayer: {
    position: 'absolute',
    top: 92,
    left: '50%',
    marginLeft: -60,
    width: 120,
    height: 176,
    borderRadius: 48,
    zIndex: 2,
    opacity: 0.95,
  },
  avatarTopLayerBase: {
    backgroundColor: '#D7C4AE',
  },
  avatarBottomLayer: {
    position: 'absolute',
    top: 250,
    left: '50%',
    marginLeft: -55,
    width: 110,
    height: 160,
    borderRadius: 26,
    zIndex: 2,
    opacity: 0.95,
  },
  avatarBottomLayerBase: {
    backgroundColor: '#D7C4AE',
  },
  avatarLegs: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 208,
    zIndex: 3,
  },
  avatarLeg: {
    width: 44,
    height: 170,
    borderRadius: 24,
    backgroundColor: '#D7C4AE',
  },
  avatarOuterBadge: {
    position: 'absolute',
    bottom: 8,
    alignSelf: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    zIndex: 5,
  },
  avatarOuterBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  homeSelectionText: {
    color: '#333',
    fontWeight: '600',
    fontSize: 12,
    marginBottom: 8,
  },
  homePillRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 20,
  },
  homePillButton: {
    minWidth: 108,
    height: 42,
    borderRadius: 21,
    paddingHorizontal: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D9DEE7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  homePillButtonPrimary: {
    backgroundColor: '#003d7a',
    borderColor: '#003d7a',
  },
  homePillText: {
    color: '#334155',
    fontSize: 13,
    fontWeight: '600',
  },
  homePillTextActive: {
    color: '#FFFFFF',
  },
  homeBottomPanel: {
    height: 132,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 0,
    paddingTop: 8,
  },
  homePocketItem: {
    width: 98,
    alignItems: 'center',
    marginRight: 16,
  },
  homePocketCircle: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: '#F6F6F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  homePocketIcon: {
    fontSize: 30,
  },
  homePocketName: {
    color: '#111',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  homeToast: {
    position: 'absolute',
    bottom: 142,
    alignSelf: 'center',
    backgroundColor: '#111',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
  },
  homeToastText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
})
