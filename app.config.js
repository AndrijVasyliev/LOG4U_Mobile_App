export default ({ config }) => ({
  ...config,
  // icon: 'https://github.com/expo/expo/blob/master/templates/expo-template-blank/assets/icon.png?raw=true',
  splash: {
    image: './assets/images/log4u_background.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  updates: {
    url: 'https://u.expo.dev/7dfcea6b-847d-401a-b6a2-350c0afa3f1c',
  },
});
