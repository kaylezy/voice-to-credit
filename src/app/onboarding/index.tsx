import React, { useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

type OnboardingItem = {
  id: number;
  title: string;
  description: string;
  image: any;
};

const onboardingData: OnboardingItem[] = [
  {
    id: 1,
    title: "Record with your \nvoice",
    description:
      "Just speak naturally. Our AI understands your \nbusiness transactions and turns them into \nyour business records",
    image: require("../../../assets/images/record-with-voice.png"),
  },
  {
    id: 2,
    title: "Track your \nbusiness records",
    description:
      "Keep a clear record of your sales, purchases, \nexpenses, receivables and payables – all in \none place.",
    image: require("../../../assets/images/track-your-business.png"),
  },
  {
    id: 3,
    title: "Never miss \na payment",
    description:
      "Get timely reminders and build a financial \nhistory that supports your business growth.",
    image: require("../../../assets/images/never-miss-payment.png"),
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();

  const flatListRef = useRef<FlatList<OnboardingItem>>(null);

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      router.replace("../auth/login");
    }
  };

  const handleSkip = () => {
    router.replace("../auth/login");
  };

  const renderItem = ({ item }: { item: OnboardingItem }) => (
    <View style={styles.page}>
      <View style={styles.imageContainer}>
        <Image
          source={item.image}
          style={styles.illustration}
          resizeMode="contain"
        />
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={onboardingData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
      />

      {/* Pagination Dots */}
      <View style={styles.pagination}>
        {onboardingData.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              currentIndex === index ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>

      {/* Action Buttons */}
      <TouchableOpacity style={styles.primaryButton} onPress={handleNext}>
        <Text style={styles.primaryButtonText}>
          {currentIndex === onboardingData.length - 1 ? "Get Started" : "Next"}
        </Text>
      </TouchableOpacity>

      {currentIndex < onboardingData.length - 1 && (
        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
          <Text style={styles.skipButtonText}>Skip</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  page: { width, paddingHorizontal: 24, paddingVertical: 40 },
  imageContainer: {
    flex: 0.5,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  illustration: { width: width * 0.85, height: 280 },
  contentContainer: { flex: 0.4, justifyContent: "flex-end" },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#0A4D8C",
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    fontWeight: "400",
    color: "#102A43",
    lineHeight: 22,
    marginBottom: 24,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  dot: { height: 8, borderRadius: 4, marginHorizontal: 4 },
  activeDot: { width: 24, backgroundColor: "#0b4f8c" },
  inactiveDot: { width: 8, backgroundColor: "#cbd5e1" },
  primaryButton: {
    backgroundColor: "#0A4D8C",
    height: 54,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 24,
  },
  primaryButtonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  skipButton: { alignItems: "center", marginTop: 14 },
  skipButtonText: { color: "#0b4f8c", fontSize: 15, fontWeight: "600" },
});
