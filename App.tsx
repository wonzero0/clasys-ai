import { Feather } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { StatusBar } from 'expo-status-bar'
import { useEffect, useRef, useState } from 'react'
import {
  Animated,
  GestureResponderEvent,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'

type ScreenType = 'login' | 'main'
type TabType = 'home' | 'wardrobe' | 'fitlab' | 'social' | 'settings'
type ViewMode = 'wardrobe' | 'basket'
type WardrobeFilter = 'all' | 'top' | 'bottom' | 'outer' | 'shoes'
type SocialMode = 'all' | 'friends'

interface SelectedClothes {
  top?: string
  bottom?: string
  outer?: string
}

interface HomeScreenProps {
  selectedClothes: SelectedClothes
  showToast: (message: string) => void
}

interface WardrobeScreenProps {
  onSelectClothes: (clothes: Partial<SelectedClothes>) => void
  showToast: (message: string) => void
}

interface WardrobeItem {
  id: string
  name: string
  category: '상의' | '하의' | '아우터' | '신발'
  type: 'top' | 'bottom' | 'outer'
  material: string
  lastWorn: string
  utilization: string
  esgAlert?: boolean
  thumb: string
}

const COLORS = {
  navy: '#003D7A',
  navyDark: '#002B57',
  text: '#111827',
  muted: '#6B7280',
  line: '#E5E7EB',
  bg: '#F8FAFC',
  white: '#FFFFFF',
  skin: '#D7B79A',
  soft: '#F3F6FA',
  tint: '#EAF2FF',
  iconMuted: '#B8B8B8',
  toast: '#111827',
  success: '#0F766E',
  warning: '#F59E0B',
  cardBorder: '#DCE4EE',
} as const

const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
} as const

const RADIUS = {
  sm: 10,
  md: 14,
  lg: 18,
  xl: 22,
  pill: 999,
  frame: 34,
  avatar: 56,
} as const

const NAV_ITEMS: Array<{
  icon: keyof typeof Feather.glyphMap
  tab: TabType
}> = [
  { icon: 'briefcase', tab: 'fitlab' },
  { icon: 'calendar', tab: 'wardrobe' },
  { icon: 'home', tab: 'home' },
  { icon: 'heart', tab: 'social' },
  { icon: 'user', tab: 'settings' },
]

const HOME_SEGMENTS: Array<{ label: string; value: ViewMode }> = [
  { label: '옷장', value: 'wardrobe' },
  { label: '찜', value: 'basket' },
]

const HOME_ITEMS = [
  { id: 'home-1', label: '네이비 셔츠', code: 'TOP', meta: '드레스 셔츠' },
  { id: 'home-2', label: '청바지 1', code: 'BOT', meta: '데님 팬츠' },
  { id: 'home-3', label: '청바지 2', code: 'BOT', meta: '와이드 데님' },
  { id: 'home-4', label: '레더 자켓', code: 'OUT', meta: '아우터 레이어' },
  { id: 'home-5', label: '니트', code: 'TOP', meta: '소프트 니트' },
]

const WARDROBE_FILTERS: Array<{ label: string; value: WardrobeFilter }> = [
  { label: '전체', value: 'all' },
  { label: '상의', value: 'top' },
  { label: '하의', value: 'bottom' },
  { label: '아우터', value: 'outer' },
  { label: '신발', value: 'shoes' },
]

const WARDROBE_ITEMS: WardrobeItem[] = [
  {
    id: 'top-1',
    name: '네이비 셔츠',
    category: '상의',
    type: 'top',
    material: '옥스포드 코튼',
    lastWorn: '2026.04.20',
    utilization: '활용도 높음',
    thumb: 'TOP',
  },
  {
    id: 'top-2',
    name: '화이트 티셔츠',
    category: '상의',
    type: 'top',
    material: '면 100%',
    lastWorn: '2026.03.28',
    utilization: '활용도 높음',
    thumb: 'TOP',
  },
  {
    id: 'bottom-1',
    name: '블랙 데님',
    category: '하의',
    type: 'bottom',
    material: '데님',
    lastWorn: '2026.04.03',
    utilization: '활용도 보통',
    thumb: 'BOT',
  },
  {
    id: 'outer-1',
    name: '라이트 자켓',
    category: '아우터',
    type: 'outer',
    material: '폴리 혼방',
    lastWorn: '2026.01.18',
    utilization: '활용도 낮음',
    esgAlert: true,
    thumb: 'OUT',
  },
  {
    id: 'shoes-1',
    name: '화이트 스니커즈',
    category: '신발',
    type: 'outer',
    material: '합성가죽',
    lastWorn: '2025.12.14',
    utilization: '활용도 낮음',
    esgAlert: true,
    thumb: 'SHO',
  },
]

const FITLAB_FEEDBACK = [
  '너무 큰 오버핏 상의는 비율을 흐릴 수 있어요.',
  '밝은 상의에는 톤 다운된 하의를 매치해보세요.',
  '아우터는 어깨선이 자연스러운 디자인이 좋아요.',
]

const SOCIAL_POSTS = [
  { id: 'post-1', title: '네이비 셋업', saves: '142', tagA: '출근룩', tagB: '미니멀' },
  { id: 'post-2', title: '데일리 스트릿', saves: '98', tagA: '여유핏', tagB: '톤온톤' },
  { id: 'post-3', title: '무채색 레이어드', saves: '76', tagA: '레이어드', tagB: '무드' },
  { id: 'post-4', title: '주말 캐주얼', saves: '64', tagA: '주말룩', tagB: '편안함' },
]

const SOCIAL_FRIENDS = [
  { id: 'friend-1', name: '민준', style: '클린 캐주얼', message: '네이비 셔츠와 밝은 바지가 잘 어울려요.' },
  { id: 'friend-2', name: '서연', style: '모던 클래식', message: '아우터를 한 톤 어둡게 가면 더 정돈돼 보여요.' },
  { id: 'friend-3', name: '지우', style: '시티 스트릿', message: '신발을 화이트로 맞추면 전체가 가벼워져요.' },
]

const SETTINGS_GROUPS = [
  {
    title: '체형 / 컬러',
    rows: [
      { icon: 'sliders', label: '체형 데이터 수정', value: '수정' },
      { icon: 'droplet', label: '퍼스널 컬러 수정', value: '수정' },
    ],
  },
  {
    title: '개인정보 / 보안',
    rows: [
      { icon: 'shield', label: '개인정보 관리', value: '설정' },
      { icon: 'lock', label: '비밀번호 변경', value: '최근 변경 32일 전' },
    ],
  },
]

export default function App() {
  const [screen, setScreen] = useState<ScreenType>('login')
  const [activeTab, setActiveTab] = useState<TabType>('home')
  const [selectedClothes, setSelectedClothes] = useState<SelectedClothes>({})
  const [toastMessage, setToastMessage] = useState('')
  const fadeAnim = useRef(new Animated.Value(1)).current
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const showToast = (message: string) => {
    setToastMessage(message)
    if (toastTimer.current) {
      clearTimeout(toastTimer.current)
    }
    toastTimer.current = setTimeout(() => {
      setToastMessage('')
    }, 1700)
  }

  useEffect(() => {
    return () => {
      if (toastTimer.current) {
        clearTimeout(toastTimer.current)
      }
    }
  }, [])

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
        return <HomeScreen selectedClothes={selectedClothes} showToast={showToast} />
      case 'wardrobe':
        return (
          <WardrobeScreen
            showToast={showToast}
            onSelectClothes={(clothes) => {
              setSelectedClothes((prev) => ({ ...prev, ...clothes }))
              showToast('아바타에 적용했어요')
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
        return <HomeScreen selectedClothes={selectedClothes} showToast={showToast} />
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <View style={styles.page}>
        <Animated.View style={[styles.frame, { opacity: fadeAnim }]}>
          {screen === 'login' ? (
            <View style={styles.loginScreen}>
              <View style={styles.loginBackdrop} />

              <View style={styles.loginBrandRow}>
                <View style={styles.loginBrandMark}>
                  <View style={styles.loginBrandDot} />
                </View>
                <Text style={styles.loginBrandText}>Personal Codi</Text>
              </View>

              <View style={styles.loginHero}>
                <Text style={styles.loginTitle}>로그인</Text>
                <Text style={styles.loginSubtitle}>나에게 맞는 스타일을 시작해보세요</Text>
              </View>

              <View style={styles.loginCard}>
                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>이메일</Text>
                  <TextInput
                    placeholder="이메일"
                    placeholderTextColor={COLORS.iconMuted}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={styles.input}
                  />
                </View>
                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>비밀번호</Text>
                  <TextInput
                    placeholder="비밀번호"
                    placeholderTextColor={COLORS.iconMuted}
                    secureTextEntry
                    style={styles.input}
                  />
                </View>

                <View style={styles.loginLinkRow}>
                  <Pressable style={({ pressed }) => [styles.linkButton, pressed && styles.pressed]}>
                    <Text style={styles.linkText}>비밀번호 찾기</Text>
                  </Pressable>
                  <Pressable style={({ pressed }) => [styles.linkButton, pressed && styles.pressed]}>
                    <Text style={styles.linkText}>회원가입</Text>
                  </Pressable>
                </View>

                <Pressable
                  style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}
                  onPress={handleLogin}
                >
                  <LinearGradient colors={[COLORS.navy, COLORS.navyDark]} style={styles.primaryButtonGradient}>
                    <Text style={styles.primaryButtonText}>로그인</Text>
                  </LinearGradient>
                </Pressable>

                <View style={styles.loginDividerRow}>
                  <View style={styles.loginDividerLine} />
                  <Text style={styles.loginDividerText}>또는 간편 로그인</Text>
                  <View style={styles.loginDividerLine} />
                </View>

                <View style={styles.loginSocialStack}>
                  <Pressable style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}>
                    <Text style={styles.secondaryButtonText}>네이버로 계속하기</Text>
                  </Pressable>
                  <Pressable style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}>
                    <Text style={styles.secondaryButtonText}>카카오톡으로 계속하기</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.appScreen}>
              <View style={styles.mainContent}>{renderMainContent()}</View>

              <View style={styles.bottomNav}>
                {NAV_ITEMS.map((item) => {
                  const active = activeTab === item.tab
                  return (
                    <Pressable
                      key={item.tab}
                      style={({ pressed }) => [styles.navItem, pressed && styles.pressed]}
                      onPress={() => setActiveTab(item.tab)}
                    >
                      <Feather
                        name={item.icon}
                        size={24}
                        color={active ? COLORS.navy : COLORS.iconMuted}
                        strokeWidth={2}
                      />
                    </Pressable>
                  )
                })}
              </View>
            </View>
          )}

          {toastMessage ? (
            <View style={styles.toastWrap}>
              <View style={styles.toastCard}>
                <Text style={styles.toastText}>{toastMessage}</Text>
              </View>
            </View>
          ) : null}
        </Animated.View>
      </View>
    </SafeAreaView>
  )
}

function HomeScreen({ selectedClothes, showToast }: HomeScreenProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('wardrobe')
  const [chatOpen, setChatOpen] = useState(false)
  const [avatarFaceIndex, setAvatarFaceIndex] = useState(0)
  const startX = useRef<number | null>(null)

  const faceLabels = ['앞모습', '옆모습', '뒷모습']
  const labelMap: Record<keyof SelectedClothes, string> = {
    top: '상의',
    bottom: '하의',
    outer: '아우터',
  }

  const selectedTags = Object.entries(selectedClothes)
    .filter((entry): entry is [keyof SelectedClothes, string] => Boolean(entry[1]))
    .map(([key, value]) => ({
      key,
      label: labelMap[key],
      value,
    }))

  const topTone = getTopTone(selectedClothes.top)
  const bottomTone = getBottomTone(selectedClothes.bottom)
  const outerTone = getOuterTone(selectedClothes.outer)

  const handleResponderGrant = (event: GestureResponderEvent) => {
    startX.current = event.nativeEvent.pageX
  }

  const handleResponderRelease = (event: GestureResponderEvent) => {
    if (startX.current === null) return

    const delta = event.nativeEvent.pageX - startX.current
    if (Math.abs(delta) > 24) {
      setAvatarFaceIndex((prev) => {
        if (delta > 0) return prev === 0 ? 2 : prev - 1
        return prev === 2 ? 0 : prev + 1
      })
    }

    startX.current = null
  }

  return (
    <View style={styles.homeScreen}>
      <View style={styles.homeHeader}>
        <View style={styles.userPill}>
          <View style={styles.userAvatar}>
            <Text style={styles.userAvatarText}>👤</Text>
          </View>
          <Text style={styles.userName}>user</Text>
        </View>
        <View style={styles.weatherPill}>
          <Text style={styles.weatherText}>☀️ 22°C</Text>
        </View>
      </View>

      <View style={styles.homeCanvas}>
        <View style={styles.homeSaveButtonWrap}>
          <Pressable
            style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
            onPress={() => showToast('코디북을 열었어요')}
          >
            <Feather name="bookmark" size={18} color={COLORS.navy} strokeWidth={2} />
          </Pressable>
        </View>

        {chatOpen ? (
          <View style={styles.aiPopup}>
            <View style={styles.aiPopupHeader}>
              <View>
                <Text style={styles.aiPopupTitle}>AI 추천</Text>
                <Text style={styles.aiPopupSubtitle}>현재 코디에 맞는 조합을 빠르게 제안해요</Text>
              </View>
              <Pressable
                style={({ pressed }) => [styles.aiCloseButton, pressed && styles.pressed]}
                onPress={() => setChatOpen(false)}
              >
                <Feather name="x" size={16} color={COLORS.navy} />
              </Pressable>
            </View>

            <View style={styles.aiBubblePrimary}>
              <Text style={styles.aiBubblePrimaryText}>네이비 셔츠와 밝은 하의 조합이 가장 안정적이에요.</Text>
            </View>
            <View style={styles.aiBubble}>
              <Text style={styles.aiBubbleText}>외투를 더해주면 실루엣이 또렷해집니다.</Text>
            </View>

            <View style={styles.quickChipRow}>
              {['출근룩', '데이트룩', '캐주얼'].map((label) => (
                <Pressable key={label} style={({ pressed }) => [styles.quickChip, pressed && styles.pressed]}>
                  <Text style={styles.quickChipText}>{label}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        ) : null}

        <View style={styles.aiFabWrap}>
          <Pressable
            style={({ pressed }) => [styles.aiFab, pressed && styles.pressed]}
            onPress={() => setChatOpen((prev) => !prev)}
          >
            <Feather name="message-circle" size={18} color={COLORS.white} />
            <Text style={styles.aiFabText}>AI 추천</Text>
          </Pressable>
        </View>

        <View style={styles.mirrorZone}>
          <View style={styles.mirrorHalo} />
          <View style={styles.mirrorRing} />

          <View
            style={styles.avatarStage}
            onStartShouldSetResponder={() => true}
            onResponderGrant={handleResponderGrant}
            onResponderRelease={handleResponderRelease}
          >
            <View style={styles.avatarHead} />
            <View style={styles.avatarNeck} />
            <View style={styles.avatarTorso}>
              <View style={[styles.avatarOuterLayer, selectedClothes.outer ? { backgroundColor: outerTone } : null]} />
              <View
                style={[
                  styles.avatarTopLayer,
                  { backgroundColor: selectedClothes.top ? topTone : COLORS.skin },
                ]}
              />
              <View
                style={[
                  styles.avatarBottomLayer,
                  { backgroundColor: selectedClothes.bottom ? bottomTone : COLORS.white },
                ]}
              />
              <View style={styles.avatarLegRow}>
                <View
                  style={[
                    styles.avatarLeg,
                    { backgroundColor: selectedClothes.bottom ? bottomTone : '#E5E7EB' },
                  ]}
                />
                <View
                  style={[
                    styles.avatarLeg,
                    { backgroundColor: selectedClothes.bottom ? bottomTone : '#E5E7EB' },
                  ]}
                />
              </View>
            </View>
            <View style={styles.avatarShadow} />
          </View>

          <Text style={styles.avatarHint}>
            {faceLabels[avatarFaceIndex]} · 좌우 드래그로 아바타 각도를 바꿀 수 있어요
          </Text>

          {selectedTags.length > 0 ? (
            <View style={styles.selectedChipRow}>
              {selectedTags.map((item) => (
                <View key={item.key} style={styles.selectedChip}>
                  <Text style={styles.selectedChipLabel}>{item.label}</Text>
                  <Text style={styles.selectedChipValue}>{item.value}</Text>
                </View>
              ))}
            </View>
          ) : null}
        </View>

        <View style={styles.segmentControl}>
          {HOME_SEGMENTS.map((segment) => {
            const active = viewMode === segment.value
            return (
              <Pressable
                key={segment.value}
                style={({ pressed }) => [
                  styles.segmentButton,
                  active && styles.segmentButtonActive,
                  pressed && styles.pressed,
                ]}
                onPress={() => setViewMode(segment.value)}
              >
                <Text style={[styles.segmentText, active && styles.segmentTextActive]}>{segment.label}</Text>
              </Pressable>
            )
          })}
        </View>

        <View style={styles.itemRail}>
          <View style={styles.itemRailHeader}>
            <Text style={styles.itemRailTitle}>{viewMode === 'wardrobe' ? '아이템 선택 바' : '찜한 코디 바'}</Text>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.itemRailScroll}>
            {HOME_ITEMS.map((item) => {
              const isSelected = Object.values(selectedClothes).some((value) => value === item.label)
              return (
                <Pressable
                  key={item.id}
                  style={({ pressed }) => [styles.itemCard, isSelected && styles.itemCardActive, pressed && styles.pressed]}
                >
                  <View style={styles.itemThumb}>
                    <Text style={styles.itemThumbCode}>{item.code}</Text>
                  </View>
                  <Text style={styles.itemName}>{item.label}</Text>
                  <Text style={styles.itemMeta}>{item.meta}</Text>
                  {isSelected ? (
                    <View style={styles.itemSelectedMark}>
                      <Feather name="check" size={12} color={COLORS.navy} />
                    </View>
                  ) : null}
                </Pressable>
              )
            })}
          </ScrollView>
        </View>
      </View>
    </View>
  )
}

function getTopTone(name?: string) {
  if (!name) return '#D7B79A'
  if (name.includes('네이비')) return COLORS.navy
  if (name.includes('화이트')) return '#F8FAFF'
  if (name.includes('검정')) return '#111827'
  return '#64748B'
}

function getBottomTone(name?: string) {
  if (!name) return '#D7B79A'
  if (name.includes('청바지')) return '#3B82F6'
  if (name.includes('슬랙스')) return '#334155'
  if (name.includes('블랙')) return '#111827'
  return '#64748B'
}

function getOuterTone(name?: string) {
  if (!name) return '#D7B79A'
  if (name.includes('레더')) return '#1F2937'
  if (name.includes('자켓')) return '#374151'
  if (name.includes('코트')) return '#4B5563'
  return '#4B5563'
}

function WardrobeScreen({ onSelectClothes, showToast }: WardrobeScreenProps) {
  const [activeFilter, setActiveFilter] = useState<WardrobeFilter>('all')

  const visibleItems = WARDROBE_ITEMS.filter((item) => {
    if (activeFilter === 'all') return true
    if (activeFilter === 'shoes') return item.category === '신발'
    return item.type === activeFilter
  })

  const handleSelectClothing = (item: WardrobeItem) => {
    const clothesData: Partial<SelectedClothes> = {}
    clothesData[item.type] = item.name
    onSelectClothes(clothesData)
  }

  return (
    <View style={styles.wardrobeScreen}>
      <ScrollView
        style={styles.wardrobeScroll}
        contentContainerStyle={styles.wardrobeContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
        alwaysBounceVertical={false}
        overScrollMode="never"
      >
        <View style={styles.wardrobeHeader}>
          <Text style={styles.screenTitle}>내 옷장</Text>
          <Text style={styles.screenSubtitle}>카테고리, 소재, 활용도까지 한눈에 확인하세요.</Text>

          <Pressable
            style={({ pressed }) => [styles.uploadButton, pressed && styles.pressed]}
            onPress={() => showToast('사진 업로드 기능은 준비 중입니다')}
          >
            <Feather name="upload-cloud" size={16} color={COLORS.navy} />
            <Text style={styles.uploadButtonText}>옷 사진 추가</Text>
          </Pressable>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterRow}
          >
            {WARDROBE_FILTERS.map((tab) => {
              const isActive = activeFilter === tab.value

              return (
                <Pressable
                  key={tab.value}
                  style={({ pressed }) => [
                    styles.filterChip,
                    isActive && styles.filterChipActive,
                    pressed && styles.pressed,
                  ]}
                  onPress={() => setActiveFilter(tab.value)}
                >
                  <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                    {tab.label}
                  </Text>
                </Pressable>
              )
            })}
          </ScrollView>
        </View>

        <View style={styles.wardrobeListBlock}>
          {visibleItems.map((item) => (
            <View key={item.id} style={styles.wardrobeRow}>
              <View style={styles.wardrobeThumb}>
                <Text style={styles.wardrobeThumbText}>{item.thumb}</Text>
              </View>

              <View style={styles.wardrobeInfo}>
                <View style={styles.wardrobeNameRow}>
                  <Text style={styles.wardrobeName}>{item.name}</Text>
                  {item.esgAlert ? (
                    <Text style={styles.wardrobeBadge}>오랫동안 안 입었어요</Text>
                  ) : null}
                </View>

                <Text style={styles.wardrobeMeta}>
                  {item.category} · {item.material}
                </Text>

                <View style={styles.wardrobeMiniRow}>
                  <Text style={styles.wardrobeMiniChip}>마지막 착용일 {item.lastWorn}</Text>
                  <Text style={styles.wardrobeMiniChip}>{item.utilization}</Text>
                </View>
              </View>

              <Pressable
                style={({ pressed }) => [styles.tryOnButton, pressed && styles.pressed]}
                onPress={() => handleSelectClothing(item)}
              >
                <Text style={styles.tryOnButtonText}>입어보기</Text>
              </Pressable>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  )
}

function FitLabScreen() {
  const growth = 68

  return (
    <View style={styles.reportScreen}>
      <View style={styles.screenHeader}>
        <Text style={styles.screenTitle}>핏 랩</Text>
        <Text style={styles.screenSubtitle}>체형과 퍼스널 컬러를 간결하게 정리한 리포트입니다</Text>
      </View>

      <View style={styles.reportCard}>
        <View style={styles.reportCardTop}>
          <View>
            <Text style={styles.reportLabel}>체형 분석</Text>
            <Text style={styles.reportTitle}>A-line</Text>
          </View>
          <View style={styles.reportIconPill}>
            <Feather name="sliders" size={16} color={COLORS.navy} />
          </View>
        </View>
        <Text style={styles.reportBody}>
          어깨선이 자연스럽게 보이는 실루엣이 잘 어울립니다. 과한 볼륨보다 안정적인 직선 라인이 좋습니다.
        </Text>
        <View style={styles.reportMetaRow}>
          <View style={styles.reportMetaChip}>
            <Text style={styles.reportMetaChipText}>상체 밸런스</Text>
          </View>
          <View style={styles.reportMetaChip}>
            <Text style={styles.reportMetaChipText}>부드러운 테일러링</Text>
          </View>
        </View>
      </View>

      <View style={styles.reportCard}>
        <View style={styles.reportCardTop}>
          <View>
            <Text style={styles.reportLabel}>퍼스널 컬러</Text>
            <Text style={styles.reportTitle}>Cool Summer</Text>
          </View>
          <View style={styles.reportIconPill}>
            <Feather name="droplet" size={16} color={COLORS.navy} />
          </View>
        </View>
        <Text style={styles.reportBody}>
          네이비, 화이트, 차분한 그레이 계열이 잘 맞습니다. 대비가 과한 색보다는 정돈된 톤이 어울립니다.
        </Text>
        <View style={styles.reportMetaRow}>
          <View style={styles.reportMetaChip}>
            <Text style={styles.reportMetaChipText}>네이비 추천</Text>
          </View>
          <View style={styles.reportMetaChip}>
            <Text style={styles.reportMetaChipText}>화이트 포인트</Text>
          </View>
        </View>
      </View>

      <View style={styles.reportCard}>
        <Text style={styles.reportSectionTitle}>코디 실패 방지 피드백</Text>
        <View style={styles.feedbackList}>
          {FITLAB_FEEDBACK.map((item) => (
            <View key={item} style={styles.feedbackItem}>
              <View style={styles.feedbackDot} />
              <Text style={styles.feedbackText}>{item}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.reportCard}>
        <View style={styles.progressHeader}>
          <View>
            <Text style={styles.reportSectionTitle}>스타일 성장률</Text>
            <Text style={styles.progressCaption}>지난달보다 더 안정적인 조합을 선택하고 있어요</Text>
          </View>
          <Text style={styles.progressValue}>{growth}%</Text>
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${growth}%` }]} />
        </View>
      </View>
    </View>
  )
}

function SocialScreen() {
  const [mode, setMode] = useState<SocialMode>('all')

  return (
    <View style={styles.socialScreen}>
      <View style={styles.screenHeader}>
        <Text style={styles.screenTitle}>소셜</Text>
        <Text style={styles.screenSubtitle}>전체 피드와 친구 피드를 한 번에 확인할 수 있어요</Text>
      </View>

      <View style={styles.socialToggleRow}>
        {[
          { label: '전체 피드', value: 'all' as const },
          { label: '내 친구', value: 'friends' as const },
        ].map((item) => {
          const active = mode === item.value
          return (
            <Pressable
              key={item.value}
              style={({ pressed }) => [styles.segmentButton, active && styles.segmentButtonActive, pressed && styles.pressed]}
              onPress={() => setMode(item.value)}
            >
              <Text style={[styles.segmentText, active && styles.segmentTextActive]}>{item.label}</Text>
            </Pressable>
          )
        })}
      </View>

      {mode === 'all' ? (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.socialContent}>
          <View style={styles.socialGrid}>
            {SOCIAL_POSTS.map((post) => (
              <View key={post.id} style={styles.socialCard}>
                <View style={styles.socialPreview}>
                  <View style={styles.socialPreviewTop} />
                  <View style={styles.socialPreviewBody}>
                    <View style={styles.socialPreviewCircle} />
                    <View style={styles.socialPreviewLine} />
                  </View>
                </View>

                <View style={styles.socialCardBody}>
                  <Text style={styles.socialCardTitle}>{post.title}</Text>
                  <Text style={styles.socialCardMeta}>저장 {post.saves}</Text>
                  <View style={styles.socialTagRow}>
                    <View style={styles.socialTag}>
                      <Text style={styles.socialTagText}>{post.tagA}</Text>
                    </View>
                    <View style={styles.socialTag}>
                      <Text style={styles.socialTagText}>{post.tagB}</Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.socialContent}>
          <View style={styles.friendList}>
            {SOCIAL_FRIENDS.map((friend) => (
              <View key={friend.id} style={styles.friendCard}>
                <View style={styles.friendAvatar}>
                  <Text style={styles.friendAvatarText}>{friend.name.slice(0, 1)}</Text>
                </View>

                <View style={styles.friendContent}>
                  <Text style={styles.friendName}>{friend.name}</Text>
                  <Text style={styles.friendStyle}>{friend.style}</Text>
                  <Text style={styles.friendMessage}>{friend.message}</Text>
                </View>

                <View style={styles.friendAction}>
                  <Feather name="send" size={16} color={COLORS.navy} />
                  <Text style={styles.friendActionText}>추천</Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  )
}

function SettingsScreen() {
  return (
    <View style={styles.settingsScreen}>
      <View style={styles.screenHeader}>
        <Text style={styles.screenTitle}>설정</Text>
        <Text style={styles.screenSubtitle}>프로필과 스타일 데이터를 조용하고 깔끔하게 관리합니다</Text>
      </View>

      <View style={styles.profileCard}>
        <View style={styles.profileAvatar}>
          <Text style={styles.profileAvatarText}>U</Text>
        </View>
        <View style={styles.profileContent}>
          <Text style={styles.profileName}>user</Text>
          <Text style={styles.profileMeta}>서울 · 남성 · 20대 후반</Text>
          <Text style={styles.profileMeta}>user@example.com</Text>
        </View>
      </View>

      <View style={styles.settingsGroup}>
        {SETTINGS_GROUPS.map((group) => (
          <View key={group.title} style={styles.settingsSection}>
            <Text style={styles.settingsSectionTitle}>{group.title}</Text>
            <View style={styles.settingsCard}>
              {group.rows.map((row, index) => (
                <Pressable
                  key={row.label}
                  style={({ pressed }) => [
                    styles.settingsRow,
                    index === group.rows.length - 1 && styles.settingsRowLast,
                    pressed && styles.pressed,
                  ]}
                >
                  <View style={styles.settingsRowLeft}>
                    <View style={styles.settingsRowIcon}>
                      <Feather name={row.icon as keyof typeof Feather.glyphMap} size={16} color={COLORS.navy} />
                    </View>
                    <Text style={styles.settingsRowText}>{row.label}</Text>
                  </View>
                  <View style={styles.settingsRowRight}>
                    <Text style={styles.settingsRowValue}>{row.value}</Text>
                    <Feather name="chevron-right" size={18} color={COLORS.iconMuted} />
                  </View>
                </Pressable>
              ))}
            </View>
          </View>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  page: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.bg,
    padding: 20,
  },
  frame: {
    width: 390,
    height: 844,
    maxWidth: '100%',
    maxHeight: '100%',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.frame,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.line,
    shadowColor: '#0F172A',
    shadowOpacity: 0.12,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 8,
  },
  pressed: {
    opacity: 0.6,
  },
  appScreen: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  mainContent: {
    flex: 1,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.line,
    backgroundColor: COLORS.white,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  toastWrap: {
    position: 'absolute',
    left: 18,
    right: 18,
    bottom: 90,
    alignItems: 'center',
  },
  toastCard: {
    backgroundColor: COLORS.toast,
    borderRadius: RADIUS.pill,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  toastText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '700',
  },

  loginScreen: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 28,
    justifyContent: 'center',
    backgroundColor: COLORS.bg,
  },
  loginBackdrop: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: '#EEF4FB',
    top: 40,
    right: -70,
    opacity: 0.9,
  },
  loginBrandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: 28,
  },
  loginBrandMark: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.navy,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginBrandDot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: COLORS.white,
  },
  loginBrandText: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  loginHero: {
    marginBottom: 18,
  },
  loginTitle: {
    color: COLORS.text,
    fontSize: 34,
    fontWeight: '700',
    letterSpacing: -1,
    marginBottom: 8,
  },
  loginSubtitle: {
    color: COLORS.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  loginCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.line,
    shadowColor: '#0F172A',
    shadowOpacity: 0.04,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  fieldGroup: {
    marginBottom: 12,
  },
  fieldLabel: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    height: 52,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.line,
    paddingHorizontal: 16,
    backgroundColor: COLORS.white,
    color: COLORS.text,
  },
  loginLinkRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
    marginBottom: 18,
  },
  linkButton: {
    paddingVertical: 4,
  },
  linkText: {
    color: COLORS.navy,
    fontSize: 13,
    fontWeight: '600',
  },
  primaryButton: {
    height: 52,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
  },
  primaryButtonGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '700',
  },
  loginDividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginVertical: 18,
  },
  loginDividerLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: COLORS.line,
  },
  loginDividerText: {
    color: COLORS.muted,
    fontSize: 12,
    fontWeight: '600',
  },
  loginSocialStack: {
    gap: 10,
  },
  secondaryButton: {
    height: 48,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.line,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '600',
  },

  screenHeader: {
    marginBottom: 14,
  },
  screenTitle: {
    color: COLORS.text,
    fontSize: 30,
    fontWeight: '700',
    letterSpacing: -0.9,
    marginBottom: 6,
  },
  screenSubtitle: {
    color: COLORS.muted,
    fontSize: 13,
    lineHeight: 19,
  },

  segmentButton: {
    minWidth: 92,
    height: 36,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: COLORS.line,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  segmentButtonActive: {
    backgroundColor: COLORS.navy,
    borderColor: COLORS.navy,
  },
  segmentText: {
    color: COLORS.muted,
    fontSize: 12,
    fontWeight: '600',
  },
  segmentTextActive: {
    color: COLORS.white,
  },

  homeScreen: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: 18,
    paddingTop: 16,
  },
  homeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  userPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.soft,
  },
  userAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userAvatarText: {
    fontSize: 13,
  },
  userName: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '600',
  },
  weatherPill: {
    height: 32,
    paddingHorizontal: 12,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.soft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weatherText: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '600',
  },
  homeCanvas: {
    flex: 1,
    position: 'relative',
  },
  homeSaveButtonWrap: {
    position: 'absolute',
    right: 8,
    top: 18,
    zIndex: 8,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: COLORS.line,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0F172A',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  aiPopup: {
    position: 'absolute',
    right: 14,
    top: 58,
    width: 252,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.line,
    padding: 14,
    zIndex: 12,
    shadowColor: '#0F172A',
    shadowOpacity: 0.09,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  aiPopupHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  aiPopupTitle: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  aiPopupSubtitle: {
    color: COLORS.muted,
    fontSize: 11,
    lineHeight: 15,
  },
  aiCloseButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.line,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
  },
  aiBubblePrimary: {
    backgroundColor: COLORS.navy,
    borderRadius: RADIUS.lg,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
  },
  aiBubblePrimaryText: {
    color: COLORS.white,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '500',
  },
  aiBubble: {
    backgroundColor: COLORS.soft,
    borderRadius: RADIUS.lg,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
  },
  aiBubbleText: {
    color: COLORS.text,
    fontSize: 12,
    lineHeight: 17,
  },
  quickChipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickChip: {
    height: 30,
    paddingHorizontal: 12,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: COLORS.line,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickChipText: {
    color: COLORS.text,
    fontSize: 11,
    fontWeight: '600',
  },
  aiFabWrap: {
    position: 'absolute',
    right: 4,
    bottom: 18,
    zIndex: 10,
  },
  aiFab: {
    minWidth: 108,
    height: 46,
    borderRadius: 23,
    paddingHorizontal: 14,
    backgroundColor: COLORS.navy,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    shadowColor: '#0F172A',
    shadowOpacity: 0.12,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  aiFabText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '700',
  },
  mirrorZone: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 26,
    paddingBottom: 24,
  },
  mirrorHalo: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: '#F3F6FA',
    top: '10%',
    opacity: 0.88,
  },
  mirrorRing: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    borderWidth: 1,
    borderColor: '#EEF2F6',
    top: '17%',
    opacity: 1,
  },
  avatarStage: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    marginTop: 18,
  },
  avatarHead: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: COLORS.skin,
    shadowColor: '#0F172A',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  avatarNeck: {
    width: 26,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.skin,
    marginTop: -4,
  },
  avatarTorso: {
    width: 198,
    height: 260,
    borderRadius: RADIUS.avatar,
    backgroundColor: '#E9EEF5',
    marginTop: 6,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'flex-start',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#E1E8F0',
  },
  avatarOuterLayer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    opacity: 0.94,
    zIndex: 1,
  },
  avatarTopLayer: {
    width: '100%',
    height: 94,
    borderTopLeftRadius: RADIUS.avatar,
    borderTopRightRadius: RADIUS.avatar,
    zIndex: 2,
  },
  avatarBottomLayer: {
    width: '100%',
    flex: 1,
    zIndex: 2,
  },
  avatarLegRow: {
    flexDirection: 'row',
    gap: 14,
    marginTop: -12,
    zIndex: 3,
  },
  avatarLeg: {
    width: 40,
    height: 86,
    borderRadius: 20,
  },
  avatarShadow: {
    width: 144,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#E6EBF2',
    marginTop: 12,
  },
  avatarHint: {
    marginTop: 14,
    color: COLORS.muted,
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
  },
  selectedChipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginTop: 12,
  },
  selectedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    height: 30,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.tint,
    borderWidth: 1,
    borderColor: '#D8E8FF',
  },
  selectedChipLabel: {
    color: COLORS.navy,
    fontSize: 11,
    fontWeight: '700',
  },
  selectedChipValue: {
    color: COLORS.text,
    fontSize: 11,
    fontWeight: '600',
  },
  segmentControl: {
    flexDirection: 'row',
    alignSelf: 'center',
    gap: 8,
    marginTop: 18,
    marginBottom: 16,
    padding: 4,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.soft,
    borderWidth: 1,
    borderColor: '#E6EDF5',
  },
  itemRail: {
    marginTop: 'auto',
  },
  itemRailHeader: {
    marginBottom: 10,
  },
  itemRailTitle: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '700',
  },
  itemRailScroll: {
    paddingRight: 14,
    gap: 12,
  },
  itemCard: {
    width: 112,
    padding: 10,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.line,
    backgroundColor: COLORS.white,
    shadowColor: '#0F172A',
    shadowOpacity: 0.03,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 1,
  },
  itemCardActive: {
    borderColor: COLORS.navy,
    backgroundColor: '#FBFDFF',
  },
  itemThumb: {
    height: 62,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.soft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  itemThumbCode: {
    color: COLORS.navy,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  itemName: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 4,
  },
  itemMeta: {
    color: COLORS.muted,
    fontSize: 11,
    lineHeight: 15,
  },
  itemSelectedMark: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.tint,
    alignItems: 'center',
    justifyContent: 'center',
  },

  wardrobeScreen: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  wardrobeScroll: {
    flex: 1,
  },
  wardrobeContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 112,
  },
  wardrobeHeader: {
    gap: 10,
    marginBottom: 18,
  },
  uploadButton: {
    alignSelf: 'flex-start',
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: COLORS.line,
    paddingHorizontal: 14,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  uploadButtonText: {
    color: COLORS.navy,
    fontSize: 12,
    fontWeight: '700',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 2,
    paddingRight: 20,
  },
  filterChip: {
    height: 34,
    borderRadius: 17,
    paddingHorizontal: 14,
    backgroundColor: COLORS.soft,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  filterChipActive: {
    backgroundColor: COLORS.navy,
    borderColor: COLORS.navy,
  },
  filterChipText: {
    color: COLORS.muted,
    fontSize: 12,
    fontWeight: '700',
  },
  filterChipTextActive: {
    color: COLORS.white,
  },
  wardrobeListBlock: {
    gap: 0,
  },
  wardrobeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.line,
  },
  wardrobeThumb: {
    width: 58,
    height: 58,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.soft,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5EDF5',
  },
  wardrobeThumbText: {
    color: COLORS.navy,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  wardrobeInfo: {
    flex: 1,
    gap: 4,
  },
  wardrobeNameRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 7,
  },
  wardrobeName: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '700',
  },
  wardrobeBadge: {
    color: COLORS.navy,
    fontSize: 10,
    fontWeight: '800',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.tint,
  },
  wardrobeMeta: {
    color: COLORS.muted,
    fontSize: 12,
    lineHeight: 16,
  },
  wardrobeMiniRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
    marginTop: 2,
  },
  wardrobeMiniChip: {
    color: COLORS.muted,
    fontSize: 10,
    fontWeight: '700',
    backgroundColor: COLORS.soft,
    borderRadius: RADIUS.pill,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  tryOnButton: {
    height: 34,
    minWidth: 70,
    borderRadius: 17,
    backgroundColor: COLORS.navy,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  tryOnButtonText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '800',
  },

  reportScreen: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 16,
    backgroundColor: COLORS.white,
  },
  reportCard: {
    padding: 16,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.line,
    backgroundColor: COLORS.white,
    marginBottom: 12,
  },
  reportCardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  reportLabel: {
    color: COLORS.muted,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
  },
  reportTitle: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.6,
  },
  reportIconPill: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: COLORS.line,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.soft,
  },
  reportBody: {
    color: COLORS.text,
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 12,
  },
  reportMetaRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  reportMetaChip: {
    paddingHorizontal: 10,
    height: 28,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.soft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reportMetaChipText: {
    color: COLORS.text,
    fontSize: 11,
    fontWeight: '600',
  },
  reportSectionTitle: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 12,
  },
  feedbackList: {
    gap: 12,
  },
  feedbackItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  feedbackDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: COLORS.navy,
    marginTop: 6,
  },
  feedbackText: {
    flex: 1,
    color: COLORS.text,
    fontSize: 13,
    lineHeight: 19,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  progressCaption: {
    color: COLORS.muted,
    fontSize: 12,
    lineHeight: 16,
    marginTop: 4,
  },
  progressValue: {
    color: COLORS.navy,
    fontSize: 22,
    fontWeight: '700',
  },
  progressTrack: {
    height: 10,
    borderRadius: RADIUS.pill,
    backgroundColor: '#EDF2F7',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.navy,
  },

  socialScreen: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 16,
    backgroundColor: COLORS.white,
  },
  socialToggleRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  socialContent: {
    paddingBottom: 92,
  },
  socialGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  socialCard: {
    width: '48%',
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.line,
    backgroundColor: COLORS.white,
    overflow: 'hidden',
  },
  socialPreview: {
    height: 136,
    backgroundColor: COLORS.soft,
    padding: 12,
    justifyContent: 'space-between',
  },
  socialPreviewTop: {
    height: 54,
    borderRadius: RADIUS.lg,
    backgroundColor: '#E9EEF6',
  },
  socialPreviewBody: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  socialPreviewCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  socialPreviewLine: {
    flex: 1,
    height: 34,
    marginLeft: 10,
    borderRadius: RADIUS.md,
    backgroundColor: '#E4EBF4',
  },
  socialCardBody: {
    padding: 12,
  },
  socialCardTitle: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  socialCardMeta: {
    color: COLORS.muted,
    fontSize: 11,
    marginBottom: 10,
  },
  socialTagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  socialTag: {
    paddingHorizontal: 8,
    height: 24,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.soft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialTagText: {
    color: COLORS.text,
    fontSize: 10,
    fontWeight: '600',
  },
  friendList: {
    gap: 12,
  },
  friendCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.line,
    backgroundColor: COLORS.white,
  },
  friendAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.soft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  friendAvatarText: {
    color: COLORS.navy,
    fontSize: 18,
    fontWeight: '700',
  },
  friendContent: {
    flex: 1,
  },
  friendName: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  friendStyle: {
    color: COLORS.navy,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  friendMessage: {
    color: COLORS.muted,
    fontSize: 12,
    lineHeight: 17,
  },
  friendAction: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    minWidth: 52,
  },
  friendActionText: {
    color: COLORS.navy,
    fontSize: 11,
    fontWeight: '700',
  },

  settingsScreen: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 16,
    backgroundColor: COLORS.white,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.line,
    backgroundColor: COLORS.white,
    marginBottom: 16,
  },
  profileAvatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: COLORS.navy,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileAvatarText: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: '700',
  },
  profileContent: {
    flex: 1,
  },
  profileName: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 4,
  },
  profileMeta: {
    color: COLORS.muted,
    fontSize: 12,
    lineHeight: 17,
  },
  settingsGroup: {
    gap: 18,
  },
  settingsSection: {
    gap: 10,
  },
  settingsSectionTitle: {
    color: COLORS.muted,
    fontSize: 12,
    fontWeight: '700',
    paddingHorizontal: 2,
  },
  settingsCard: {
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.line,
    backgroundColor: COLORS.white,
    overflow: 'hidden',
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.line,
  },
  settingsRowLast: {
    borderBottomWidth: 0,
  },
  settingsRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  settingsRowIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.soft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsRowText: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '600',
  },
  settingsRowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginLeft: 10,
  },
  settingsRowValue: {
    color: COLORS.muted,
    fontSize: 12,
    fontWeight: '600',
  },
})