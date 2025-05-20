import OneSignal from "react-onesignal";

const OneSignalService = {
  // Initialize OneSignal
  async init() {
    await OneSignal.init({
      appId: "df39a7e2-d8e8-4054-b353-feb386bebdfc",
      safari_web_id: "web.onesignal.auto.34cabfa2-ddd9-46d0-b8b2-6fad793020e0",
      notifyButton: {
        enable: true,
      },
    });

    console.log("OneSignal initialized");
  },

  // Request Notification Permission
  async requestPermission() {
    await OneSignal.showNativePrompt();
  },

  // Get the Player ID (OneSignal user ID)
  async getPlayerId() {
    const playerId = await OneSignal.getUserId();
    if (playerId) {
      console.log("Player ID found:", playerId);
    } else {
      console.log("No Player ID found. User may not have subscribed.");
    }
    return playerId;
  },
};

export default OneSignalService;
