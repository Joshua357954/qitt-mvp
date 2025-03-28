export default function manifest() {
  return {
    name: "Qitt - Smart Learning",
    short_name: "Qitt",
    description:
      "Qitt helps students access academic resources, career opportunities, and financial aid.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#007bff",
    icons: [
      {
        src: "/icons/qitt-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/qitt-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
