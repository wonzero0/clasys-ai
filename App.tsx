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

export default function App() {
  const [screen, setScreen] = useState<'login' | 'main'>('login')
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
                    colors={['#0f2a5f', '#8b75ff']}
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
              <View style={styles.mainHeader}>
                <View>
                  <Text style={styles.mainTitle}>user의 옷장</Text>
                  <Text style={styles.mainSubtitle}>오늘의 코디를 선택해보세요</Text>
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
                {[
                  '검정 셔츠',
                  '청바지',
                  '화이트 셔츠',
                  '네이비 자켓',
                  '그레이 슬랙스',
                  '스니커즈',
                ].map((item) => (
                  <View key={item} style={styles.gridItem}>
                    <View style={styles.dummyImage} />
                    <Text style={styles.itemLabel}>{item}</Text>
                  </View>
                ))}
              </ScrollView>

              <View style={styles.bottomNav}>
                <Pressable style={styles.navItem}>
                  <Text style={[styles.navIcon, styles.navIconInactive]}>⌂</Text>
                  <Text style={[styles.navLabel, styles.navLabelInactive]}>홈</Text>
                </Pressable>
                <Pressable style={styles.navItem}>
                  <Text style={[styles.navIcon, styles.navIconInactive]}>🧍</Text>
                  <Text style={[styles.navLabel, styles.navLabelInactive]}>옷 입히기</Text>
                </Pressable>
                <Pressable style={styles.navItem}>
                  <Text style={[styles.navIcon, styles.navIconActive]}>🗄</Text>
                  <Text style={[styles.navLabel, styles.navLabelActive]}>옷장</Text>
                </Pressable>
                <Pressable style={styles.navItem}>
                  <Text style={[styles.navIcon, styles.navIconInactive]}>✦</Text>
                  <Text style={[styles.navLabel, styles.navLabelInactive]}>AI 추천</Text>
                </Pressable>
                <Pressable style={styles.navItem}>
                  <Text style={[styles.navIcon, styles.navIconInactive]}>⚖</Text>
                  <Text style={[styles.navLabel, styles.navLabelInactive]}>체형 수정</Text>
                </Pressable>
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
    minHeight: 640,
    backgroundColor: '#ffffff',
    borderRadius: 30,
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 24,
    borderWidth: 1,
    borderColor: '#dbe3f0',
    shadowColor: '#1e2a44',
    shadowOpacity: 0.14,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 12 },
    elevation: 10,
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
    backgroundColor: '#8b75ff',
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
    color: '#0f2a5f',
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    color: '#0f2a5f',
    letterSpacing: -0.6,
  },
  subtitle: {
    color: '#6f7d96',
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
    color: '#5b6f93',
    fontSize: 13,
    fontWeight: '600',
  },
  signUpLinkText: {
    color: '#8B75FF',
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
    color: '#7e8ba5',
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
    color: '#0f2a5f',
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: -0.4,
  },
  mainSubtitle: {
    color: '#6f7d96',
    marginTop: 4,
    fontSize: 13,
  },
  profileIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#A062FF',
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
  },
  gridContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 16,
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
  bottomNav: {
    marginTop: 8,
    paddingTop: 10,
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
    color: '#A062FF',
  },
  navIconInactive: {
    color: '#94a3b8',
  },
  navLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
  navLabelInactive: {
    color: '#94a3b8',
  },
  navLabelActive: {
    color: '#A062FF',
  },
})
