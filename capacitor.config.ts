import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.cd09a1602fc9490c8ab7328b1b166e53',
  appName: 'swift-tow-fleet',
  webDir: 'dist',
  server: {
    url: 'https://cd09a160-2fc9-490c-8ab7-328b1b166e53.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
  },
};

export default config;