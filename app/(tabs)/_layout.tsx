import { Tabs } from 'expo-router';
import { Utensils, MessageSquare, Bookmark, Bell, User } from 'lucide-react-native';

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarStyle: {
                    backgroundColor: '#FFFFFF',
                    borderTopWidth: 1,
                    borderTopColor: '#F0F0F0',
                    height: 85,
                    paddingBottom: 25,
                    paddingTop: 10,
                },
                tabBarActiveTintColor: '#FF583D',
                tabBarInactiveTintColor: '#A0A0A0',
                headerShown: false,
                tabBarShowLabel: true,
                tabBarLabelStyle: {
                    fontWeight: 'bold',
                    fontSize: 11,
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Swipe',
                    tabBarIcon: ({ color }) => (
                        <Utensils size={24} color={color} strokeWidth={2.5} />
                    ),
                }}
            />
            <Tabs.Screen
                name="matches"
                options={{
                    title: 'Matches',
                    tabBarIcon: ({ color }) => (
                        <MessageSquare size={24} color={color} strokeWidth={2.5} />
                    ),
                }}
            />
            {/* These are placeholders to match the design assets */}
            <Tabs.Screen
                name="saved"
                options={{
                    title: 'Saved',
                    href: null, // Don't show in navigation yet
                    tabBarIcon: ({ color }) => (
                        <Bookmark size={24} color={color} strokeWidth={2.5} />
                    ),
                }}
            />
            <Tabs.Screen
                name="activity"
                options={{
                    title: 'Activity',
                    href: null, // Don't show in navigation yet
                    tabBarIcon: ({ color }) => (
                        <Bell size={24} color={color} strokeWidth={2.5} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color }) => (
                        <User size={24} color={color} strokeWidth={2.5} />
                    ),
                }}
            />
        </Tabs>
    );
}
