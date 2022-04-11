import React from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';

import COLORS from '../../../constants/colors';

const styles = StyleSheet.create({
  shape: {
    zIndex: -1,
    position: 'absolute',
    top: Dimensions.get('window').height * -0.70,
    left: 0,
  },
  medium: {
    top: Dimensions.get('window').height * -0.6,
  },
  large: {
    top: Dimensions.get('window').height * -0.4,
  },
});

const Wave = ({ medium, large }) => (
  <Svg
    width={Dimensions.get('window').width}
    height={Dimensions.get('window').height}
    viewBox="0 0 375 892"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={[styles.shape, medium && styles.medium, large && styles.large]}
    preserveAspectRatio="none"
  >
    <Path
      // eslint-disable-next-line max-len
      d="M66 879C27.5513 875.728 0 866.5 0 866.5V0H375V880.5C375 880.5 356 889.5 323.138 891.482C290.277 893.464 269.5 888.5 245 878C220.5 867.5 209.958 858.181 178.5 856C147.042 853.819 104.449 882.272 66 879Z"
      fill="url(#paint0_linear_2822_9225)"
    />
    <Defs>
      <LinearGradient
        id="paint0_linear_2822_9225"
        x1={187}
        y1={446}
        x2={187.5}
        y2={913.226}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor={COLORS.PRIMARY_DARK} />
        <Stop offset={1} stopColor={COLORS.PRIMARY_DARK} />
      </LinearGradient>
    </Defs>
  </Svg>
);

export default Wave;
