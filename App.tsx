import { StatusBar } from 'expo-status-bar'
import { LinearGradient } from 'expo-linear-gradient'
import { useEffect, useRef, useState } from 'react'
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
        return <HomeScreen />
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
      default:
        return <HomeScreen />
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
              <View style={styles.mainContentWrapper}>{renderMainContent()}</View>

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
    paddingBottom: 6,
  },
  screenShell: {
    flex: 1,
    gap: 14,
  },
  screenTopHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 2,
  },
  screenHeaderCopy: {
    gap: 4,
    flex: 1,
  },
  screenEyebrow: {
    color: '#5f6f91',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  screenHeaderTitle: {
    color: '#1E3A8A',
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.4,
  },
  screenHeaderSubtitle: {
    color: '#51617e',
    fontSize: 13,
    lineHeight: 18,
  },
  screenSection: {
    gap: 10,
  },
  sectionLabel: {
    color: '#1E3A8A',
    fontSize: 13,
    fontWeight: '700',
  },
  sectionSubLabel: {
    color: '#6b778d',
    fontSize: 11,
    lineHeight: 16,
  },
  infoCard: {
    borderRadius: 22,
    backgroundColor: '#ffffff',
    padding: 16,
    borderWidth: 1,
    borderColor: '#e6ebf5',
    gap: 12,
  },
  infoCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoCardTitle: {
    color: '#0f223f',
    fontSize: 16,
    fontWeight: '700',
  },
  infoCardMeta: {
    color: '#6b778d',
    fontSize: 11,
    fontWeight: '600',
  },
  metricRow: {
    flexDirection: 'row',
    gap: 10,
  },
  metricCard: {
    flex: 1,
    borderRadius: 18,
    backgroundColor: '#f6f8ff',
    padding: 14,
    gap: 6,
  },
  metricLabel: {
    color: '#6b778d',
    fontSize: 11,
    fontWeight: '700',
  },
  metricValue: {
    color: '#1E3A8A',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  metricDesc: {
    color: '#51617e',
    fontSize: 11,
    lineHeight: 16,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statusBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#f4f7ff',
  },
  statusBadgeText: {
    color: '#1E3A8A',
    fontSize: 11,
    fontWeight: '700',
  },
  reportGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  reportCard: {
    width: '48%',
    borderRadius: 18,
    backgroundColor: '#ffffff',
    padding: 14,
    borderWidth: 1,
    borderColor: '#e6ebf5',
    gap: 6,
  },
  reportValue: {
    color: '#1E3A8A',
    fontSize: 22,
    fontWeight: '700',
  },
  reportLabel: {
    color: '#0f223f',
    fontSize: 13,
    fontWeight: '700',
  },
  reportText: {
    color: '#6b778d',
    fontSize: 11,
    lineHeight: 16,
  },
  feedbackList: {
    gap: 10,
  },
  feedbackItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingVertical: 2,
  },
  feedbackDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#1E3A8A',
    marginTop: 5,
  },
  feedbackTextWrap: {
    flex: 1,
    gap: 2,
  },
  feedbackTitle: {
    color: '#0f223f',
    fontSize: 13,
    fontWeight: '700',
  },
  feedbackText: {
    color: '#6b778d',
    fontSize: 12,
    lineHeight: 17,
  },
  progressBox: {
    borderRadius: 22,
    backgroundColor: '#1E3A8A',
    padding: 16,
    gap: 10,
  },
  progressBoxTitle: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  progressBar: {
    height: 10,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.18)',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    width: '72%',
    borderRadius: 999,
    backgroundColor: '#ffffff',
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  progressMeta: {
    color: '#dbe6ff',
    fontSize: 11,
  },
  profileBlock: {
    borderRadius: 24,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e6ebf5',
    padding: 16,
    gap: 12,
  },
  profileTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  profileAvatarLarge: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: '#1E3A8A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileAvatarText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
  },
  profileName: {
    color: '#0f223f',
    fontSize: 17,
    fontWeight: '700',
  },
  profileMeta: {
    color: '#6b778d',
    fontSize: 12,
    marginTop: 2,
  },
  actionButtonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  actionCardButton: {
    flex: 1,
    minHeight: 46,
    borderRadius: 16,
    backgroundColor: '#f4f7ff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  actionCardButtonText: {
    color: '#1E3A8A',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
  securityCard: {
    borderRadius: 22,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e6ebf5',
    padding: 16,
    gap: 10,
  },
  securityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#edf1f7',
  },
  securityRowLast: {
    borderBottomWidth: 0,
    paddingBottom: 0,
  },
  securityLabel: {
    color: '#0f223f',
    fontSize: 13,
    fontWeight: '700',
  },
  securityValue: {
    color: '#6b778d',
    fontSize: 12,
    fontWeight: '600',
  },
  settingsCardHint: {
    color: '#6b778d',
    fontSize: 12,
    lineHeight: 17,
  },
  screenContent: {
    flex: 1,
    overflow: 'hidden',
  },
  mainContentWrapper: {
    flex: 1,
    overflow: 'hidden',
  },
  wardrobeHeader: {
    gap: 10,
    marginBottom: 12,
    paddingTop: 4,
  },
  wardrobeHeaderTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  wardrobeHeaderActionRow: {
    alignSelf: 'flex-start',
  },
  uploadButton: {
    minWidth: 104,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1E3A8A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingHorizontal: 12,
  },
  uploadButtonIcon: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 16,
  },
  uploadButtonText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  filterTab: {
    paddingHorizontal: 14,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f4f7ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterTabActive: {
    backgroundColor: '#1E3A8A',
  },
  filterTabText: {
    color: '#5f6f91',
    fontSize: 12,
    fontWeight: '700',
  },
  filterTabTextActive: {
    color: '#ffffff',
  },
  wardrobeScroll: {
    flex: 1,
  },
  wardrobeContent: {
    gap: 12,
    paddingBottom: 100,
  },
  wardrobeCard: {
    borderRadius: 22,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e8edf7',
    padding: 14,
    gap: 12,
  },
  wardrobeCardTop: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  wardrobeThumb: {
    width: 72,
    height: 72,
    borderRadius: 18,
    backgroundColor: '#f4f7ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wardrobeThumbIcon: {
    fontSize: 30,
  },
  wardrobeCardInfo: {
    flex: 1,
    gap: 4,
  },
  wardrobeCardTitleRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
  },
  wardrobeCardTitle: {
    color: '#0f223f',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  wardrobeCardCategory: {
    color: '#1E3A8A',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 1,
  },
  wardrobeCardMeta: {
    color: '#64748b',
    fontSize: 12,
    lineHeight: 17,
  },
  esgBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#eefbf1',
  },
  esgBadgeText: {
    color: '#1a7f37',
    fontSize: 11,
    fontWeight: '700',
  },
  wardrobeStatsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  wardrobeStatPill: {
    flex: 1,
    borderRadius: 16,
    backgroundColor: '#f8faff',
    paddingVertical: 10,
    paddingHorizontal: 12,
    gap: 4,
  },
  wardrobeStatLabel: {
    color: '#7b8799',
    fontSize: 11,
    fontWeight: '700',
  },
  wardrobeStatValue: {
    color: '#0f223f',
    fontSize: 13,
    fontWeight: '700',
  },
  wardrobeCardActions: {
    alignItems: 'flex-end',
  },
  previewButton: {
    minWidth: 92,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#1E3A8A',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  previewButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  uploadToast: {
    position: 'absolute',
    left: 18,
    right: 18,
    bottom: 88,
    alignItems: 'center',
    zIndex: 60,
  },
  uploadToastCard: {
    backgroundColor: '#1E3A8A',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  uploadToastText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
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

const homeStyles = StyleSheet.create({
  homeScreen: {
    flex: 1,
    backgroundColor: '#fbfbfd',
    position: 'relative',
  },
  homeTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  homeUserSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  homeUserIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#eef4ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeUserIconText: {
    fontSize: 16,
  },
  homeGreetingText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E3A8A',
  },
  homeWeatherBox: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#f6f7fb',
  },
  homeWeatherText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E3A8A',
  },
  homeBody: {
    flex: 1,
    position: 'relative',
    paddingTop: 2,
  },
  homeActionDock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  homeFabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  homeFabCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#1E3A8A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeFabCircleSecondary: {
    backgroundColor: '#f4f7ff',
  },
  homeFabIcon: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  homeFabIconSecondary: {
    color: '#1E3A8A',
  },
  homeFabText: {
    color: '#1E3A8A',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
  homeChatPopup: {
    position: 'absolute',
    left: 78,
    top: 42,
    width: 220,
    borderRadius: 18,
    backgroundColor: '#ffffff',
    padding: 12,
    borderWidth: 1,
    borderColor: '#eef2fb',
    zIndex: 40,
  },
  homeChatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  homeChatHeaderTitle: {
    color: '#1E3A8A',
    fontSize: 13,
    fontWeight: '700',
  },
  homeChatClose: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f4f7ff',
  },
  homeChatCloseText: {
    color: '#1E3A8A',
    fontSize: 12,
    fontWeight: '700',
  },
  homeChatBubble: {
    alignSelf: 'flex-start',
    maxWidth: '92%',
    backgroundColor: '#f4f7ff',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 8,
  },
  homeChatBubbleAlt: {
    alignSelf: 'flex-end',
    backgroundColor: '#1E3A8A',
  },
  homeChatBubbleText: {
    color: '#1E3A8A',
    fontSize: 12,
    lineHeight: 16,
  },
  homeChatBubbleTextAlt: {
    color: '#ffffff',
  },
  homeChatQuickRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  homeChatQuick: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#f4f7ff',
  },
  homeChatQuickText: {
    fontSize: 11,
    color: '#1E3A8A',
    fontWeight: '600',
  },
  homeStage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 0,
    paddingBottom: 10,
  },
  homeAvatarWrap: {
    width: '100%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 0,
  },
  homeAvatarStage: {
    width: '100%',
    maxWidth: 300,
    aspectRatio: 0.88,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderRadius: 32,
    backgroundColor: '#fbfbfd',
  },
  homeAvatarGlow: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: '#eef3ff',
    opacity: 0.9,
  },
  homeMirrorFrame: {
    position: 'absolute',
    top: 22,
    bottom: 18,
    left: '50%',
    width: 2,
    backgroundColor: '#edf1fb',
  },
  homeMirrorSheen: {
    position: 'absolute',
    top: 18,
    left: 0,
    right: 0,
    height: 92,
    opacity: 0.9,
  },
  homeAvatarFigure: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    transform: [{ translateY: 6 }],
  },
  homeAvatarHead: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: '#d8b79d',
  },
  homeAvatarBody: {
    width: 176,
    height: 228,
    borderRadius: 48,
    backgroundColor: '#e0e6f9',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 16,
  },
  homeAvatarNeck: {
    width: 26,
    height: 18,
    borderRadius: 10,
    backgroundColor: '#d8b79d',
    marginTop: -6,
    zIndex: 2,
  },
  homeAvatarTop: {
    width: '100%',
    height: 78,
    borderTopLeftRadius: 48,
    borderTopRightRadius: 48,
    backgroundColor: '#1E3A8A',
  },
  homeAvatarBottom: {
    width: '100%',
    flex: 1,
    borderBottomLeftRadius: 44,
    borderBottomRightRadius: 44,
    backgroundColor: '#ffffff',
    marginTop: 2,
  },
  homeAvatarShape: {
    width: 138,
    height: 22,
    borderRadius: 999,
    backgroundColor: '#cbd6f8',
    marginTop: 12,
  },
  homeAvatarHint: {
    marginTop: 12,
    color: '#5E6C85',
    fontSize: 11,
    textAlign: 'center',
  },
  homeBottomPanel: {
    paddingTop: 4,
    paddingBottom: 16,
    gap: 14,
  },
  homeActionRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  homePillButton: {
    minWidth: 110,
    height: 44,
    borderRadius: 22,
    paddingHorizontal: 14,
    backgroundColor: '#f6f7fb',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  homePillButtonPrimary: {
    backgroundColor: '#1E3A8A',
  },
  homePillIcon: {
    fontSize: 15,
  },
  homePillIconPrimary: {
    color: '#ffffff',
  },
  homePillLabel: {
    color: '#1E3A8A',
    fontSize: 13,
    fontWeight: '700',
  },
  homePillLabelPrimary: {
    color: '#ffffff',
  },
  homePocketBar: {
    width: '100%',
    paddingTop: 2,
  },
  homePocketLabel: {
    color: '#1E3A8A',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 10,
  },
  homePocketScroll: {
    paddingRight: 20,
    gap: 12,
  },
  homePocketItem: {
    alignItems: 'center',
    width: 64,
  },
  homePocketCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#f6f7fb',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  homePocketIcon: {
    fontSize: 24,
  },
  homePocketName: {
    color: '#334155',
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 13,
  },
  homePocketEmpty: {
    color: '#94A3B8',
    fontSize: 12,
    lineHeight: 18,
    paddingTop: 4,
  },
  homeToast: {
    position: 'absolute',
    left: 24,
    right: 24,
    bottom: 94,
    alignItems: 'center',
    zIndex: 50,
  },
  homeToastCard: {
    backgroundColor: '#1E3A8A',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  homeToastText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
})

function HomeScreen() {
  const [avatarFaceIndex, setAvatarFaceIndex] = useState(0)
  const [viewMode, setViewMode] = useState<'wardrobe' | 'basket'>('wardrobe')
  const [chatOpen, setChatOpen] = useState(false)
  const [saveToastVisible, setSaveToastVisible] = useState(false)
  const startX = useRef<number | null>(null)
  const saveToastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (saveToastTimer.current) {
        clearTimeout(saveToastTimer.current)
      }
    }
  }, [])

  const faceLabels = ['앞모습', '옆모습', '뒷모습']
  const itemPicker = [
    { label: '네이비 셔츠', icon: '👔' },
    { label: '청바지', icon: '👖' },
    { label: '자켓', icon: '🧥' },
    { label: '스니커즈', icon: '👟' },
    { label: '가방', icon: '👜' },
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

  const handleSaveOutfit = () => {
    // 실제 저장 API는 아직 연결하지 않고, 저장 완료 느낌만 보여주는 목업 처리입니다.
    setSaveToastVisible(true)

    if (saveToastTimer.current) {
      clearTimeout(saveToastTimer.current)
    }

    saveToastTimer.current = setTimeout(() => {
      setSaveToastVisible(false)
    }, 1800)
  }

  return (
    <View style={homeStyles.homeScreen}>
      <View style={homeStyles.homeTopRow}>
        <View style={homeStyles.homeUserSection}>
          <View style={homeStyles.homeUserIconWrap}>
            <Text style={homeStyles.homeUserIconText}>👤</Text>
          </View>
          <Text style={homeStyles.homeGreetingText}>user</Text>
        </View>

        <View style={homeStyles.homeWeatherBox}>
          <Text style={homeStyles.homeWeatherText}>☀️ 22°C</Text>
        </View>
      </View>

      <View style={homeStyles.homeBody}>
        {chatOpen ? (
          <View style={homeStyles.homeChatPopup}>
            <View style={homeStyles.homeChatHeader}>
              <Text style={homeStyles.homeChatHeaderTitle}>AI 추천</Text>
              <Pressable style={homeStyles.homeChatClose} onPress={() => setChatOpen(false)}>
                <Text style={homeStyles.homeChatCloseText}>×</Text>
              </Pressable>
            </View>

            <View style={homeStyles.homeChatBubble}>
              <Text style={homeStyles.homeChatBubbleText}>
                오늘은 네이비 셔츠와 밝은 하의 조합이 안정적이에요.
              </Text>
            </View>
            <View style={[homeStyles.homeChatBubble, homeStyles.homeChatBubbleAlt]}>
              <Text style={[homeStyles.homeChatBubbleText, homeStyles.homeChatBubbleTextAlt]}>
                지금 코디를 저장하면 코디북에서 바로 확인할 수 있어요.
              </Text>
            </View>

            <View style={homeStyles.homeChatQuickRow}>
              <Pressable style={homeStyles.homeChatQuick}>
                <Text style={homeStyles.homeChatQuickText}>출근룩</Text>
              </Pressable>
              <Pressable style={homeStyles.homeChatQuick}>
                <Text style={homeStyles.homeChatQuickText}>데이트룩</Text>
              </Pressable>
              <Pressable style={homeStyles.homeChatQuick}>
                <Text style={homeStyles.homeChatQuickText}>캐주얼</Text>
              </Pressable>
            </View>
          </View>
        ) : null}

        <View style={homeStyles.homeActionDock}>
          <View style={homeStyles.homeFabButton}>
            <Pressable style={homeStyles.homeFabCircle} onPress={() => setChatOpen((prev) => !prev)}>
              <Text style={homeStyles.homeFabIcon}>✦</Text>
            </Pressable>
            <Text style={homeStyles.homeFabText}>AI 추천</Text>
          </View>

          <View style={homeStyles.homeFabButton}>
            <Pressable
              style={[homeStyles.homeFabCircle, homeStyles.homeFabCircleSecondary]}
              onPress={() => setViewMode('wardrobe')}
            >
              <Text style={[homeStyles.homeFabIcon, homeStyles.homeFabIconSecondary]}>💾</Text>
            </Pressable>
            <Text style={homeStyles.homeFabText}>코디북</Text>
          </View>
        </View>

        <View style={homeStyles.homeStage}>
          <View style={homeStyles.homeAvatarWrap}>
            <View
              style={homeStyles.homeAvatarStage}
              onStartShouldSetResponder={() => true}
              onResponderGrant={handleResponderGrant}
              onResponderRelease={handleResponderRelease}
            >
              <View style={homeStyles.homeAvatarGlow} />
              <LinearGradient
                colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0)']}
                start={{ x: 0.1, y: 0 }}
                end={{ x: 0.9, y: 1 }}
                style={homeStyles.homeMirrorSheen}
              />
              <View style={homeStyles.homeMirrorFrame} />
              <View style={homeStyles.homeAvatarFigure}>
                <View style={homeStyles.homeAvatarHead} />
                <View style={homeStyles.homeAvatarNeck} />
                <View style={homeStyles.homeAvatarBody}>
                  <View style={homeStyles.homeAvatarTop} />
                  <View style={homeStyles.homeAvatarBottom} />
                  <View style={homeStyles.homeAvatarShape} />
                </View>
              </View>
            </View>
            <Text style={homeStyles.homeAvatarHint}>
              {faceLabels[avatarFaceIndex]} · 좌우 드래그로 아바타 각도를 바꿀 수 있어요
            </Text>
          </View>
        </View>

        <View style={homeStyles.homeBottomPanel}>
          <View style={homeStyles.homeActionRow}>
            <Pressable
              style={[homeStyles.homePillButton, viewMode === 'wardrobe' && homeStyles.homePillButtonPrimary]}
              onPress={() => setViewMode('wardrobe')}
            >
              <Text
                style={[
                  homeStyles.homePillIcon,
                  viewMode === 'wardrobe' && homeStyles.homePillIconPrimary,
                ]}
              >
                🧥
              </Text>
              <Text
                style={[
                  homeStyles.homePillLabel,
                  viewMode === 'wardrobe' && homeStyles.homePillLabelPrimary,
                ]}
              >
                옷장
              </Text>
            </Pressable>

            <Pressable
              style={[homeStyles.homePillButton, viewMode === 'basket' && homeStyles.homePillButtonPrimary]}
              onPress={() => setViewMode('basket')}
            >
              <Text
                style={[
                  homeStyles.homePillIcon,
                  viewMode === 'basket' && homeStyles.homePillIconPrimary,
                ]}
              >
                ♡
              </Text>
              <Text
                style={[
                  homeStyles.homePillLabel,
                  viewMode === 'basket' && homeStyles.homePillLabelPrimary,
                ]}
              >
                찜
              </Text>
            </Pressable>
          </View>

          <View style={homeStyles.homePocketBar}>
            <Text style={homeStyles.homePocketLabel}>
              {viewMode === 'wardrobe' ? '아이템 선택 바' : '찜한 코디 바'}
            </Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={homeStyles.homePocketScroll}>
              {itemPicker.map((item) => (
                <Pressable key={item.label} style={homeStyles.homePocketItem}>
                  <View style={homeStyles.homePocketCircle}>
                    <Text style={homeStyles.homePocketIcon}>{item.icon}</Text>
                  </View>
                  <Text style={homeStyles.homePocketName}>{item.label}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
      </View>

      {saveToastVisible ? (
        <View style={homeStyles.homeToast}>
          <View style={homeStyles.homeToastCard}>
            <Text style={homeStyles.homeToastText}>코디가 저장되었어요</Text>
          </View>
        </View>
      ) : null}
    </View>
  )
}

interface WardrobeScreenProps {
  onSelectClothes: (clothes: Partial<SelectedClothes>) => void
}

type WardrobeFilter = 'all' | 'top' | 'bottom' | 'outer' | 'shoes'

interface WardrobeItem {
  id: string
  name: string
  category: '상의' | '하의' | '아우터' | '신발'
  type: 'top' | 'bottom' | 'outer'
  material: string
  lastWorn: string
  cpw: string
  utilization: string
  esgAlert?: boolean
  icon: string
}

function WardrobeScreen({ onSelectClothes }: WardrobeScreenProps) {
  const [activeFilter, setActiveFilter] = useState<WardrobeFilter>('all')
  const [uploadToastVisible, setUploadToastVisible] = useState(false)
  const uploadToastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (uploadToastTimer.current) {
        clearTimeout(uploadToastTimer.current)
      }
    }
  }, [])

  const clothingItems: WardrobeItem[] = [
    {
      id: 'top-1',
      name: '네이비 셔츠',
      category: '상의',
      type: 'top',
      material: '옥스포드 코튼',
      lastWorn: '2026.04.20',
      cpw: '₩4,200',
      utilization: '활용도 높음',
      icon: '👔',
    },
    {
      id: 'top-2',
      name: '화이트 티셔츠',
      category: '상의',
      type: 'top',
      material: '면 100%',
      lastWorn: '2026.03.28',
      cpw: '₩1,600',
      utilization: '활용도 높음',
      icon: '👕',
    },
    {
      id: 'bottom-1',
      name: '블랙 데님',
      category: '하의',
      type: 'bottom',
      material: '데님',
      lastWorn: '2026.04.03',
      cpw: '₩3,800',
      utilization: '활용도 보통',
      icon: '👖',
    },
    {
      id: 'outer-1',
      name: '라이트 자켓',
      category: '아우터',
      type: 'outer',
      material: '폴리 혼방',
      lastWorn: '2026.01.18',
      cpw: '₩9,200',
      utilization: '활용도 낮음',
      esgAlert: true,
      icon: '🧥',
    },
    {
      id: 'shoes-1',
      name: '화이트 스니커즈',
      category: '신발',
      type: 'outer',
      material: '합성가죽',
      lastWorn: '2025.12.14',
      cpw: '₩5,100',
      utilization: '활용도 낮음',
      esgAlert: true,
      icon: '👟',
    },
  ]

  const filterTabs: Array<{ label: string; value: WardrobeFilter }> = [
    { label: '전체', value: 'all' },
    { label: '상의', value: 'top' },
    { label: '하의', value: 'bottom' },
    { label: '아우터', value: 'outer' },
    { label: '신발', value: 'shoes' },
  ]

  const visibleItems = clothingItems.filter((item) => {
    if (activeFilter === 'all') {
      return true
    }
    if (activeFilter === 'shoes') {
      return item.category === '신발'
    }
    return item.type === activeFilter
  })

  const handleSelectClothing = (item: WardrobeItem) => {
    const clothesData: Partial<SelectedClothes> = {}
    clothesData[item.type] = item.name
    onSelectClothes(clothesData)
  }

  const handleUploadMock = () => {
    // 실제 업로드는 연결하지 않고, 업로드 완료 느낌만 보여주는 목업입니다.
    setUploadToastVisible(true)

    if (uploadToastTimer.current) {
      clearTimeout(uploadToastTimer.current)
    }

    uploadToastTimer.current = setTimeout(() => {
      setUploadToastVisible(false)
    }, 1800)
  }

    return (
      <View style={styles.screenContent}>
        <View style={styles.wardrobeHeader}>
          <View style={styles.wardrobeHeaderTop}>
            <View>
              <Text style={styles.mainTitle}>user의 옷장</Text>
              <Text style={styles.mainSubtitle}>카테고리, 소재, 활용도까지 한눈에 확인하세요</Text>
            </View>
          </View>

          <View style={styles.wardrobeHeaderActionRow}>
            <Pressable style={styles.uploadButton} onPress={handleUploadMock}>
              <Text style={styles.uploadButtonIcon}>＋</Text>
              <Text style={styles.uploadButtonText}>옷 사진 추가</Text>
            </Pressable>
          </View>

          <View style={styles.filterRow}>
          {filterTabs.map((tab) => {
            const isActive = activeFilter === tab.value
            return (
              <Pressable
                key={tab.value}
                style={[styles.filterTab, isActive && styles.filterTabActive]}
                onPress={() => setActiveFilter(tab.value)}
              >
                <Text style={[styles.filterTabText, isActive && styles.filterTabTextActive]}>
                  {tab.label}
                </Text>
              </Pressable>
            )
          })}
        </View>
      </View>

      <ScrollView
        style={styles.wardrobeScroll}
        contentContainerStyle={styles.wardrobeContent}
        showsVerticalScrollIndicator={false}
      >
        {visibleItems.map((item) => (
          <View key={item.id} style={styles.wardrobeCard}>
            <View style={styles.wardrobeCardTop}>
              <View style={styles.wardrobeThumb}>
                <Text style={styles.wardrobeThumbIcon}>{item.icon}</Text>
              </View>

              <View style={styles.wardrobeCardInfo}>
                <View style={styles.wardrobeCardTitleRow}>
                  <Text style={styles.wardrobeCardTitle}>{item.name}</Text>
                  {item.esgAlert ? (
                    <View style={styles.esgBadge}>
                      <Text style={styles.esgBadgeText}>오랫동안 안 입었어요</Text>
                    </View>
                  ) : null}
                </View>
                <Text style={styles.wardrobeCardCategory}>{item.category}</Text>
                <Text style={styles.wardrobeCardMeta}>소재 · {item.material}</Text>
                <Text style={styles.wardrobeCardMeta}>마지막 착용일 · {item.lastWorn}</Text>
              </View>
            </View>

            <View style={styles.wardrobeStatsRow}>
              <View style={styles.wardrobeStatPill}>
                <Text style={styles.wardrobeStatLabel}>CPW</Text>
                <Text style={styles.wardrobeStatValue}>{item.cpw}</Text>
              </View>
              <View style={styles.wardrobeStatPill}>
                <Text style={styles.wardrobeStatLabel}>활용도</Text>
                <Text style={styles.wardrobeStatValue}>{item.utilization}</Text>
              </View>
            </View>

            <View style={styles.wardrobeCardActions}>
              <Pressable style={styles.previewButton} onPress={() => handleSelectClothing(item)}>
                <Text style={styles.previewButtonText}>입어보기</Text>
              </Pressable>
            </View>
          </View>
        ))}
      </ScrollView>

      {uploadToastVisible ? (
        <View style={styles.uploadToast}>
          <View style={styles.uploadToastCard}>
            <Text style={styles.uploadToastText}>업로드 UI가 추가되었어요. 실제 파일 업로드는 아직 연결하지 않았습니다.</Text>
          </View>
        </View>
      ) : null}
    </View>
  )
}

function FitLabScreen() {
  return (
    <View style={styles.screenContainer}>
      <View style={styles.screenShell}>
        <View style={styles.screenTopHeader}>
          <View style={styles.screenHeaderCopy}>
            <Text style={styles.screenEyebrow}>FIT LAB</Text>
            <Text style={styles.screenHeaderTitle}>분석 리포트</Text>
            <Text style={styles.screenHeaderSubtitle}>
              체형과 퍼스널 컬러를 바탕으로 코디 실패를 줄이고, 스타일 방향을 잡아주는 리포트예요.
            </Text>
          </View>
          <View style={styles.profileIcon}>
            <Text style={styles.profileIconText}>R</Text>
          </View>
        </View>

        <View style={styles.metricRow}>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>체형 분석</Text>
            <Text style={styles.metricValue}>A-line</Text>
            <Text style={styles.metricDesc}>상체를 자연스럽게 살리고 하체 비율을 길어 보이게 하는 실루엣이 좋아요.</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>퍼스널 컬러</Text>
            <Text style={styles.metricValue}>Cool Summer</Text>
            <Text style={styles.metricDesc}>차분한 네이비, 블루그레이, 선명한 화이트 계열과 잘 어울려요.</Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoCardHeader}>
            <Text style={styles.infoCardTitle}>코디 실패 방지 피드백</Text>
            <Text style={styles.infoCardMeta}>이번 주 기준</Text>
          </View>
          <View style={styles.feedbackList}>
            <View style={styles.feedbackItem}>
              <View style={styles.feedbackDot} />
              <View style={styles.feedbackTextWrap}>
                <Text style={styles.feedbackTitle}>어깨선이 과하게 부각되지 않도록</Text>
                <Text style={styles.feedbackText}>
                  딱 붙는 자켓보다 살짝 여유 있는 실루엣이 전체 비율을 더 안정적으로 보여줘요.
                </Text>
              </View>
            </View>
            <View style={styles.feedbackItem}>
              <View style={styles.feedbackDot} />
              <View style={styles.feedbackTextWrap}>
                <Text style={styles.feedbackTitle}>하의 컬러는 톤을 맞춰주세요</Text>
                <Text style={styles.feedbackText}>
                  너무 강한 대비보다 중간 명도의 데님이나 슬랙스가 컬러 조합을 부드럽게 만들어줘요.
                </Text>
              </View>
            </View>
            <View style={styles.feedbackItem}>
              <View style={styles.feedbackDot} />
              <View style={styles.feedbackTextWrap}>
                <Text style={styles.feedbackTitle}>액세서리는 최소한으로</Text>
                <Text style={styles.feedbackText}>
                  퍼스널 컬러가 선명하게 보이도록 상의와 얼굴 주변은 간결하게 정리하는 편이 좋아요.
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.progressBox}>
          <Text style={styles.progressBoxTitle}>스타일 성장 리포트</Text>
          <View style={styles.progressBar}>
            <View style={styles.progressBarFill} />
          </View>
          <View style={styles.progressRow}>
            <Text style={styles.progressText}>이번 달 코디 완성도</Text>
            <Text style={styles.progressMeta}>72% · 지난달 대비 +8%</Text>
          </View>
        </View>
      </View>
    </View>
  )
}

function SocialScreen() {
  return (
    <View style={styles.screenContainer}>
      <View style={styles.screenShell}>
        <View style={styles.screenTopHeader}>
          <View style={styles.screenHeaderCopy}>
            <Text style={styles.screenEyebrow}>SOCIAL</Text>
            <Text style={styles.screenHeaderTitle}>코디 피드</Text>
            <Text style={styles.screenHeaderSubtitle}>
              전체 피드와 친구 피드를 오가며, 저장한 코디와 추천 스타일을 확인해보세요.
            </Text>
          </View>
          <View style={styles.profileIcon}>
            <Text style={styles.profileIconText}>S</Text>
          </View>
        </View>

        <View style={styles.filterRow}>
          <Pressable style={[styles.filterTab, styles.filterTabActive]}>
            <Text style={[styles.filterTabText, styles.filterTabTextActive]}>전체 피드</Text>
          </Pressable>
          <Pressable style={styles.filterTab}>
            <Text style={styles.filterTabText}>내 친구</Text>
          </Pressable>
        </View>

        <ScrollView style={styles.wardrobeScroll} contentContainerStyle={styles.wardrobeContent} showsVerticalScrollIndicator={false}>
          <View style={styles.infoCard}>
            <View style={styles.infoCardHeader}>
              <Text style={styles.infoCardTitle}>오늘의 코디 피드</Text>
              <Text style={styles.infoCardMeta}>Pinterest style</Text>
            </View>

            <View style={styles.reportGrid}>
              <View style={[styles.reportCard, { width: '48%' }]}>
                <View style={styles.profileAvatarLarge}>
                  <Text style={styles.profileAvatarText}>A</Text>
                </View>
                <Text style={styles.reportLabel}>네이비 셋업</Text>
                <Text style={styles.reportText}>미니멀한 셋업에 화이트 스니커즈를 더해 깔끔한 출근룩을 완성했어요.</Text>
              </View>
              <View style={[styles.reportCard, { width: '48%' }]}>
                <View style={[styles.profileAvatarLarge, { backgroundColor: '#334155' }]}>
                  <Text style={styles.profileAvatarText}>B</Text>
                </View>
                <Text style={styles.reportLabel}>데일리 스트릿</Text>
                <Text style={styles.reportText}>오버핏 아우터와 슬랙스를 조합해 편하면서도 단정한 느낌을 살렸어요.</Text>
              </View>
              <View style={[styles.reportCard, { width: '100%' }]}>
                <Text style={styles.reportLabel}>저장된 코디</Text>
                <Text style={styles.reportText}>
                  팔로우한 친구의 코디에서 색 조합과 아이템 밸런스를 한 번에 참고할 수 있어요.
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.infoCardHeader}>
              <Text style={styles.infoCardTitle}>친구 아바타에 코디 추천하기</Text>
              <Text style={styles.infoCardMeta}>추천 카드</Text>
            </View>
            <View style={styles.profileTopRow}>
              <View style={styles.profileAvatarLarge}>
                <Text style={styles.profileAvatarText}>J</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.profileName}>지민의 아바타</Text>
                <Text style={styles.profileMeta}>퍼스널 컬러: Warm Spring · 즐겨 입는 스타일: 캐주얼</Text>
              </View>
            </View>
            <View style={styles.actionButtonRow}>
              <Pressable style={styles.actionCardButton}>
                <Text style={styles.actionCardButtonText}>네이비 셔츠 추천</Text>
              </Pressable>
              <Pressable style={styles.actionCardButton}>
                <Text style={styles.actionCardButtonText}>자켓 조합 추천</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  )
}

function SettingsScreen() {
  return (
    <View style={styles.screenContainer}>
      <View style={styles.screenShell}>
        <View style={styles.screenTopHeader}>
          <View style={styles.screenHeaderCopy}>
            <Text style={styles.screenEyebrow}>SETTINGS</Text>
            <Text style={styles.screenHeaderTitle}>설정</Text>
            <Text style={styles.screenHeaderSubtitle}>
              프로필과 체형 정보를 관리하고, 개인정보와 보안 설정을 빠르게 확인할 수 있어요.
            </Text>
          </View>
          <View style={styles.profileIcon}>
            <Text style={styles.profileIconText}>U</Text>
          </View>
        </View>

        <ScrollView style={styles.wardrobeScroll} contentContainerStyle={styles.wardrobeContent} showsVerticalScrollIndicator={false}>
          <View style={styles.profileBlock}>
            <View style={styles.profileTopRow}>
              <View style={styles.profileAvatarLarge}>
                <Text style={styles.profileAvatarText}>U</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.profileName}>user</Text>
                <Text style={styles.profileMeta}>서울 · 남성 · 20대 후반</Text>
              </View>
            </View>
            <Text style={styles.settingsCardHint}>
              현재 저장된 체형과 퍼스널 컬러를 기반으로 홈과 옷장 추천이 연결되고 있어요.
            </Text>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.infoCardHeader}>
              <Text style={styles.infoCardTitle}>체형 데이터 수정</Text>
              <Text style={styles.infoCardMeta}>프로필 관리</Text>
            </View>
            <Text style={styles.settingsCardHint}>체형, 어깨선, 비율 정보를 업데이트하면 추천 정확도가 더 좋아집니다.</Text>
            <View style={styles.actionButtonRow}>
              <Pressable style={styles.actionCardButton}>
                <Text style={styles.actionCardButtonText}>체형 데이터 수정</Text>
              </Pressable>
              <Pressable style={styles.actionCardButton}>
                <Text style={styles.actionCardButtonText}>퍼스널 컬러 수정</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.securityCard}>
            <View style={styles.infoCardHeader}>
              <Text style={styles.infoCardTitle}>개인정보 / 보안</Text>
              <Text style={styles.infoCardMeta}>보호 설정</Text>
            </View>
            <View style={styles.securityRow}>
              <Text style={styles.securityLabel}>연결된 이메일</Text>
              <Text style={styles.securityValue}>user@example.com</Text>
            </View>
            <View style={styles.securityRow}>
              <Text style={styles.securityLabel}>알림 설정</Text>
              <Text style={styles.securityValue}>활성화</Text>
            </View>
            <View style={[styles.securityRow, styles.securityRowLast]}>
              <Text style={styles.securityLabel}>비밀번호</Text>
              <Text style={styles.securityValue}>최근 변경 32일 전</Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  )
}
