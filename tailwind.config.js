//config for tailwind
module.exports = {
  //we tell tailwind what files to perform styling to
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  //if we have any themes like darkTheme, lightTheme etc we define them here
  theme: {
    extend: {},
  },
  //any plugins that we want to use with tailwind
  plugins: [require("tailwindcss-invalid-variant-plugin")],
};
