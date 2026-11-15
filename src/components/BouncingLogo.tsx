import React, { useEffect, useRef } from 'react';
import { Animated, Easing, ImageSourcePropType, StyleSheet, View } from 'react-native';

type Props = { source: ImageSourcePropType; size?: number };

export default function BouncingLogo({ source, size = 120 }: Props) {
  const y = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(y, { toValue: -28, duration: 520, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(y, { toValue: 0, duration: 520, easing: Easing.in(Easing.quad), useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [y]);

  const shadowScale = y.interpolate({ inputRange: [-28, 0], outputRange: [0.6, 1] });
  const shadowOpacity = y.interpolate({ inputRange: [-28, 0], outputRange: [0.12, 0.3] });

  return (
    <View style={styles.wrap}>
      <Animated.Image
        source={source}
        style={{ width: size, height: size, transform: [{ translateY: y }] }}
        resizeMode="contain"
      />
      <Animated.View
        style={[styles.shadow, { opacity: shadowOpacity, transform: [{ scaleX: shadowScale }] }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center', paddingTop: 40 },
  shadow: { width: 70, height: 10, borderRadius: 35, backgroundColor: '#9ca3af', marginTop: 12 },
});