import { ThemeConfig } from '@/UI';

const theme: ThemeConfig = {
  token: {
    colorPrimary: '#00904a',
    fontSize: 14,
    borderRadius: 4,
    colorBorder: '#E8E8E8',
    controlHeight: 36,
    controlHeightXS: 28,
    controlHeightLG: 40,
    controlHeightSM: 32,
  },
  components: {
    Button: {
      colorText: '#00904a',
      colorBorder: '#00904a',
    },
    Modal: {
      paddingContentHorizontalLG: 0,
      paddingMD: 0,
      colorTextHeading: '#fff',
    },
  },
};

export default theme;
