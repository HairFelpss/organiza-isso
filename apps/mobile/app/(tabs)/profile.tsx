import { Colors } from '@/constants/Colors';
import { useTheme } from '@/contexts/theme-context';
import { useRouter } from 'expo-router';
import { Bell, Building, ChevronRight, CreditCard, CircleHelp as HelpCircle, LogOut, Moon, Settings, Shield, Smartphone, Sun, User, UserCog } from 'lucide-react-native';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

export default function ProfileScreen() {
  const { theme, setTheme, actualTheme } = useTheme();
  const colors = Colors[actualTheme];
  const router = useRouter();

  const handleLogout = () => {
    router.replace('/(auth)/login');
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun size={20} color={colors.primary} />;
      case 'dark':
        return <Moon size={20} color={colors.primary} />;
      default:
        return <Smartphone size={20} color={colors.primary} />;
    }
  };

  const getThemeText = () => {
    switch (theme) {
      case 'light':
        return 'Tema claro';
      case 'dark':
        return 'Tema escuro';
      default:
        return 'Tema do sistema';
    }
  };

  const handleThemeChange = () => {
    switch (theme) {
      case 'light':
        setTheme('dark');
        break;
      case 'dark':
        setTheme('system');
        break;
      default:
        setTheme('light');
        break;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Perfil</Text>
      </View>
      
      <ScrollView style={styles.content}>
        <Animated.View
          entering={FadeIn.duration(600)}
          style={[styles.profileCard, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          <View style={[styles.avatarPlaceholder, { backgroundColor: colors.primary }]}>
            <Text style={[styles.avatarText, { color: colors.buttonText }]}>JS</Text>
          </View>
          
          <View style={styles.profileInfo}>
            <Text style={[styles.userName, { color: colors.text }]}>João Silva</Text>
            <Text style={[styles.userEmail, { color: colors.textSecondary }]}>joao.silva@email.com</Text>
          </View>
          
          <TouchableOpacity 
            style={[styles.editButton, { borderColor: colors.border }]}
          >
            <Text style={[styles.editButtonText, { color: colors.primary }]}>Editar</Text>
          </TouchableOpacity>
        </Animated.View>
        
        <View style={styles.sectionsContainer}>
          <Animated.View
            entering={FadeIn.duration(500).delay(100)}
            style={styles.section}
          >
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Conta</Text>
            
            <View style={[styles.sectionContent, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <ProfileMenuItem 
                icon={<User size={20} color={colors.primary} />}
                title="Detalhes pessoais"
                colors={colors}
              />
              
              <ProfileMenuItem 
                icon={<CreditCard size={20} color={colors.primary} />}
                title="Pagamentos"
                colors={colors}
              />
              
              <ProfileMenuItem 
                icon={<Bell size={20} color={colors.primary} />}
                title="Notificações"
                colors={colors}
              />
              
              <ProfileMenuItem 
                icon={<Shield size={20} color={colors.primary} />}
                title="Privacidade e segurança"
                colors={colors}
                noBorder
              />
            </View>
          </Animated.View>
          
          <Animated.View
            entering={FadeIn.duration(500).delay(200)}
            style={styles.section}
          >
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Profissional</Text>
            
            <View style={[styles.sectionContent, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <ProfileMenuItem 
                icon={<UserCog size={20} color={colors.primary} />}
                title="Perfil profissional"
                colors={colors}
              />
              
              <ProfileMenuItem 
                icon={<Building size={20} color={colors.primary} />}
                title="Minha empresa"
                colors={colors}
                noBorder
              />
            </View>
          </Animated.View>
          
          <Animated.View
            entering={FadeIn.duration(500).delay(300)}
            style={styles.section}
          >
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Outras opções</Text>
            
            <View style={[styles.sectionContent, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <TouchableOpacity
                style={[
                  styles.menuItem,
                  { borderBottomWidth: 1, borderBottomColor: colors.border }
                ]}
                onPress={handleThemeChange}
              >
                <View style={styles.menuItemLeft}>
                  {getThemeIcon()}
                  <Text style={[styles.menuItemTitle, { color: colors.text }]}>
                    {getThemeText()}
                  </Text>
                </View>
                <ChevronRight size={20} color={colors.textTertiary} />
              </TouchableOpacity>

              <ProfileMenuItem 
                icon={<HelpCircle size={20} color={colors.primary} />}
                title="Ajuda e suporte"
                colors={colors}
              />
              
              <ProfileMenuItem 
                icon={<Settings size={20} color={colors.primary} />}
                title="Configurações"
                colors={colors}
                noBorder
              />
            </View>
          </Animated.View>
          
          <Animated.View
            entering={FadeIn.duration(500).delay(400)}
          >
            <TouchableOpacity 
              style={[styles.logoutButton, { backgroundColor: colors.backgroundTertiary }]}
              onPress={handleLogout}
            >
              <LogOut size={20} color={colors.error} />
              <Text style={[styles.logoutText, { color: colors.error }]}>Sair</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
        
        <View style={styles.versionContainer}>
          <Text style={[styles.versionText, { color: colors.textTertiary }]}>
            Versão 1.0.0
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

interface ProfileMenuItemProps {
  icon: React.ReactNode;
  title: string;
  colors: any;
  noBorder?: boolean;
}

const ProfileMenuItem = ({ icon, title, colors, noBorder = false }: ProfileMenuItemProps) => {
  return (
    <TouchableOpacity 
      style={[
        styles.menuItem, 
        !noBorder && { borderBottomWidth: 1, borderBottomColor: colors.border }
      ]}
    >
      <View style={styles.menuItemLeft}>
        {icon}
        <Text style={[styles.menuItemTitle, { color: colors.text }]}>{title}</Text>
      </View>
      <ChevronRight size={20} color={colors.textTertiary} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  content: {
    flex: 1,
    paddingTop: 8,
  },
  profileCard: {
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '600',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
  },
  editButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  sectionsContainer: {
    marginTop: 24,
    paddingHorizontal: 16,
    gap: 24,
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 4,
  },
  sectionContent: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuItemTitle: {
    fontSize: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 16,
    marginTop: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '500',
  },
  versionContainer: {
    marginTop: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  versionText: {
    fontSize: 14,
  },
});