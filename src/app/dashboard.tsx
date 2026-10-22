import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function DashboardScreen() {
    const router = useRouter();
    const [hasRecords, setHasRecords] = useState<boolean>(true);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
              
                <View style={styles.headerRow}>
                    <View>
                        <Text style={styles.dashboardTitle}>Dashboard</Text>
                        <Text style={styles.greetingText}>Good morning</Text>
                        <Text style={styles.userNameText}>Amina!</Text>
                    </View>
                    <TouchableOpacity onPress={() => setHasRecords(!hasRecords)}>
                        <Image
                            source={{ uri: '#' }} 
                            style={styles.avatar}
                        />
                    </TouchableOpacity>
                </View>

                {!hasRecords ? (
                    <View style={styles.newUserSection}>
                        <View style={styles.illustrationBox}>
                            <Image
                                source={{ uri: '#' }}
                                style={styles.illustration}
                                resizeMode="contain"
                            />
                        </View>

                        <Text style={styles.welcomeHeading}>
                            Let’s start tracking{'\n'}your business
                        </Text>
                        <Text style={styles.welcomeSubtext}>
                            Turn your everyday transactions into structured records. Just speak, we'll handle the rest.
                        </Text>

                        {/* Empty Summary Cards */}
                        <View style={styles.gridRow}>
                            <View style={[styles.card, { borderTopColor: '#0b4f8c' }]}>
                                <View style={styles.cardHeader}>
                                    <View style={[styles.cardIconBox, { backgroundColor: '#e0f2fe' }]}>
                                        <Ionicons name="bar-chart-outline" size={16} color="#0b4f8c" />
                                    </View>
                                    <Text style={styles.cardLabel}>Sales</Text>
                                </View>
                                <Text style={styles.cardValue}>₦0</Text>
                                <Text style={styles.cardChangeZero}>0</Text>
                            </View>

                            <View style={[styles.card, { borderTopColor: '#ef4444' }]}>
                                <View style={styles.cardHeader}>
                                    <View style={[styles.cardIconBox, { backgroundColor: '#fee2e2' }]}>
                                        <Ionicons name="bag-handle-outline" size={16} color="#ef4444" />
                                    </View>
                                    <Text style={styles.cardLabel}>Purchases</Text>
                                </View>
                                <Text style={styles.cardValue}>₦0</Text>
                                <Text style={styles.cardChangeZeroRed}>0</Text>
                            </View>
                        </View>

                        <View style={styles.gridRow}>
                            <View style={[styles.card, { borderTopColor: '#f59e0b' }]}>
                                <View style={styles.cardHeader}>
                                    <View style={[styles.cardIconBox, { backgroundColor: '#fef3c7' }]}>
                                        <Ionicons name="wallet-outline" size={16} color="#f59e0b" />
                                    </View>
                                    <Text style={styles.cardLabel}>Expenses</Text>
                                </View>
                                <Text style={styles.cardValue}>₦0</Text>
                                <Text style={styles.cardChangeZeroOrange}>0</Text>
                            </View>

                            <View style={[styles.card, { borderTopColor: '#10b981' }]}>
                                <View style={styles.cardHeader}>
                                    <View style={[styles.cardIconBox, { backgroundColor: '#d1fae5' }]}>
                                        <Ionicons name="trending-up-outline" size={16} color="#10b981" />
                                    </View>
                                    <Text style={styles.cardLabel}>Est. gross profit</Text>
                                </View>
                                <Text style={styles.cardValue}>₦0</Text>
                                <Text style={styles.cardChangeZeroGreen}>0</Text>
                            </View>
                        </View>

                        <TouchableOpacity
                            style={styles.recordButton}
                            onPress={() => router.push('/record-transaction')}
                        >
                            <Text style={styles.recordButtonText}>Record a Transaction</Text>
                        </TouchableOpacity>

                        <Text style={styles.emptyStateNotice}>
                            Your confirmed records will appear here.
                        </Text>
                    </View>
                ) : (
                    <View style={styles.existingUserSection}>
                        <View style={styles.gridRow}>
                            <View style={[styles.card, { borderTopColor: '#0b4f8c' }]}>
                                <View style={styles.cardHeader}>
                                    <View style={[styles.cardIconBox, { backgroundColor: '#e0f2fe' }]}>
                                        <Ionicons name="bar-chart-outline" size={16} color="#0b4f8c" />
                                    </View>
                                    <Text style={styles.cardLabel}>Total Sales</Text>
                                </View>
                                <Text style={styles.cardValue}>₦450, 000</Text>
                                <Text style={styles.cardChangePositive}>+12.4% in 7 Days</Text>
                            </View>

                            <View style={[styles.card, { borderTopColor: '#ef4444' }]}>
                                <View style={styles.cardHeader}>
                                    <View style={[styles.cardIconBox, { backgroundColor: '#fee2e2' }]}>
                                        <Ionicons name="bag-handle-outline" size={16} color="#ef4444" />
                                    </View>
                                    <Text style={styles.cardLabel}>Purchases</Text>
                                </View>
                                <Text style={styles.cardValue}>₦210, 000</Text>
                                <Text style={styles.cardChangeNegative}>-1.5% in 7 Days</Text>
                            </View>
                        </View>

                        <View style={styles.gridRow}>
                            <View style={[styles.card, { borderTopColor: '#f59e0b' }]}>
                                <View style={styles.cardHeader}>
                                    <View style={[styles.cardIconBox, { backgroundColor: '#fef3c7' }]}>
                                        <Ionicons name="wallet-outline" size={16} color="#f59e0b" />
                                    </View>
                                    <Text style={styles.cardLabel}>Expenses</Text>
                                </View>
                                <Text style={styles.cardValue}>₦38, 000</Text>
                                <Text style={styles.cardChangeOrange}>+2.4% in 7 Days</Text>
                            </View>

                            <View style={[styles.card, { borderTopColor: '#10b981' }]}>
                                <View style={styles.cardHeader}>
                                    <View style={[styles.cardIconBox, { backgroundColor: '#d1fae5' }]}>
                                        <Ionicons name="trending-up-outline" size={16} color="#10b981" />
                                    </View>
                                    <Text style={styles.cardLabel}>Est. gross profit</Text>
                                </View>
                                <Text style={styles.cardValue}>₦240, 000</Text>
                                <Text style={styles.cardChangePositive}>+5.9% in 7 Days</Text>
                            </View>
                        </View>

                        <View style={styles.gridRow}>
                            <View style={[styles.card, { borderTopColor: '#06b6d4' }]}>
                                <View style={styles.cardHeader}>
                                    <View style={[styles.cardIconBox, { backgroundColor: '#cffafe' }]}>
                                        <Ionicons name="time-outline" size={16} color="#06b6d4" />
                                    </View>
                                    <Text style={styles.cardLabel}>Receivables</Text>
                                </View>
                                <Text style={styles.cardValue}>₦45, 000</Text>
                                <Text style={styles.cardChangeOrange}>+2.4% in 7 Days</Text>
                            </View>

                            <View style={[styles.card, { borderTopColor: '#4f46e5' }]}>
                                <View style={styles.cardHeader}>
                                    <View style={[styles.cardIconBox, { backgroundColor: '#e0e7ff' }]}>
                                        <Ionicons name="bus-outline" size={16} color="#4f46e5" />
                                    </View>
                                    <Text style={styles.cardLabel}>Payables</Text>
                                </View>
                                <Text style={styles.cardValue}>₦70, 000</Text>
                                <Text style={styles.cardChangePositive}>+5.9% in 7 Days</Text>
                            </View>
                        </View>

                        {/* Trends Section */}
                        <View style={styles.trendsHeader}>
                            <Text style={styles.trendsTitle}>Business Trends</Text>
                            <Text style={styles.trendsDate}>Apr - Jul 2026</Text>
                        </View>
                        <Text style={styles.trendsSubtitle}>Sales and Expenses</Text>

                        <View style={styles.chartsRow}>
                            <View style={styles.chartCard}>
                                <View style={styles.chartTitleRow}>
                                    <View style={[styles.legendDot, { backgroundColor: '#10b981' }]} />
                                    <Text style={styles.chartTitleText}>Sales trend</Text>
                                </View>
                                <Image
                                    source={{ uri: '#' }}
                                    style={styles.chartPlaceholder}
                                    resizeMode="contain"
                                />
                            </View>

                            <View style={styles.chartCard}>
                                <View style={styles.chartTitleRow}>
                                    <View style={[styles.legendDot, { backgroundColor: '#f59e0b' }]} />
                                    <Text style={styles.chartTitleText}>Expense trend</Text>
                                </View>
                                <Image
                                    source={{ uri: '#' }}
                                    style={styles.chartPlaceholder}
                                    resizeMode="contain"
                                />
                            </View>
                        </View>

                        <TouchableOpacity
                            style={styles.recordButton}
                            onPress={() => router.push('/record-transaction')}
                        >
                            <Text style={styles.recordButtonText}>Record a Transaction</Text>
                        </TouchableOpacity>

                        <View style={styles.insightBox}>
                            <Ionicons name="bulb-outline" size={20} color="#0d9488" />
                            <Text style={styles.insightText}>
                                Your sales are up 12% compared with last month
                            </Text>
                        </View>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fa' },
    scrollContainer: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    dashboardTitle: { fontSize: 18, fontWeight: '700', color: '#0b4f8c', marginBottom: 4 },
    greetingText: { fontSize: 13, color: '#6b7280' },
    userNameText: { fontSize: 22, fontWeight: '800', color: '#0b4f8c' },
    avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#e2e8f0' },
    newUserSection: { alignItems: 'center' },
    illustrationBox: { width: '100%', height: 180, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
    illustration: { width: '100%', height: '100%' },
    welcomeHeading: { fontSize: 24, fontWeight: '800', color: '#0b4f8c', textAlign: 'center', marginBottom: 8 },
    welcomeSubtext: { fontSize: 13, color: '#4b5563', textAlign: 'center', lineHeight: 18, paddingHorizontal: 16, marginBottom: 24 },
    existingUserSection: {},
    gridRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, marginBottom: 12 },
    card: { flex: 1, backgroundColor: '#ffffff', borderRadius: 14, padding: 12, borderWidth: 1, borderColor: '#f1f5f9', borderTopWidth: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 },
    cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
    cardIconBox: { width: 28, height: 28, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginRight: 8 },
    cardLabel: { fontSize: 11, fontWeight: '600', color: '#6b7280' },
    cardValue: { fontSize: 17, fontWeight: '800', color: '#1f2937', marginBottom: 4 },
    cardChangePositive: { fontSize: 10, fontWeight: '700', color: '#10b981' },
    cardChangeNegative: { fontSize: 10, fontWeight: '700', color: '#ef4444' },
    cardChangeOrange: { fontSize: 10, fontWeight: '700', color: '#f59e0b' },
    cardChangeZero: { fontSize: 10, fontWeight: '700', color: '#0b4f8c' },
    cardChangeZeroRed: { fontSize: 10, fontWeight: '700', color: '#ef4444' },
    cardChangeZeroOrange: { fontSize: 10, fontWeight: '700', color: '#f59e0b' },
    cardChangeZeroGreen: { fontSize: 10, fontWeight: '700', color: '#10b981' },
    trendsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 },
    trendsTitle: { fontSize: 16, fontWeight: '800', color: '#0b4f8c' },
    trendsDate: { fontSize: 12, color: '#9ca3af' },
    trendsSubtitle: { fontSize: 12, color: '#6b7280', marginBottom: 12 },
    chartsRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
    chartCard: { flex: 1, backgroundColor: '#ffffff', borderRadius: 14, padding: 12, borderWidth: 1, borderColor: '#f1f5f9', height: 160 },
    chartTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
    legendDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
    chartTitleText: { fontSize: 12, fontWeight: '700', color: '#1f2937' },
    chartPlaceholder: { width: '100%', height: 110 },
    recordButton: { backgroundColor: '#0b4f8c', height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginVertical: 14, shadowColor: '#0b4f8c', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 6, elevation: 3 },
    recordButtonText: { color: '#ffffff', fontSize: 15, fontWeight: '700' },
    emptyStateNotice: { fontSize: 12, color: '#6b7280', textAlign: 'center', marginTop: 8 },
    insightBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ccfbf1', borderRadius: 12, padding: 14, gap: 10 },
    insightText: { flex: 1, fontSize: 13, fontWeight: '600', color: '#0f766e' },
});