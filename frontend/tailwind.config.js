/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}", "./public/index.html"],
  theme: {
    fontFamily: {
      main: ["Poppins", "sans-serif"],
    },
    listStyleType: {
      square: "square",
      roman: "upper-roman",
    },
    extend: {
      width: {
        main: "1220px",
      },
      maxWidth: {
        main: "1220px",
      },
      backgroundColor: {
        main: "#ee3131",
        subs: "#d4d8d9",
        overlay: "rgba(0,0,0,0.6)",
      },
      colors: {
        main: "#ee3131",
        subs: "#d4d8d9",
        modal: "rgba(0,0,0,0.3)",
      },
      flex: {
        2: "2 2 0%",
        3: "3 3 0%",
        4: "4 4 0%",
        5: "5 5 0%",
        6: "6 6 0%",
        7: "7 7 0%",
        8: "8 8 0%",
      },
      keyframes: {
        //https://animista.net/play/basic/slide
        "slide-top": {
          "0%": {
            "-webkit-transform": "translateY(40px);",
            transform: "translateY(40px);",
          },
          "100%": {
            "-webkit-transform": "translateY(-4px);",
            transform: "translateY(-4px);",
          },
        },
        "pulsate-fwd": {
          "0%": {
            "-webkit-transform": "scale(1);",
            transform: "scale(1);",
          },
          "50%": {
            "-webkit-transform": "scale(1.1);",
            transform: "scale(1.05);",
          },
          "100%": {
            "-webkit-transform": "scale(1);",
            transform: "scale(1);",
          },
        },
        "slide-left": {
          "0%": {
            "-webkit-transform": " translateX(0);",
            transform: " translateX(0);",
          },
          "100%": {
            "-webkit-transform": "translateX(-375px);",
            transform: "translateX(-375px);",
          },
        },
        "slide-right": {
          "0%": {
            "-webkit-transform": " translateX(0);",
            transform: " translateX(0);",
          },
          "100%": {
            "-webkit-transform": "translateX(375px);",
            transform: "translateX(375px);",
          },
        },
        "slide-in-fwd-center": {
          "0%": {
            "-webkit-transform": "translateZ(-1375px);",
            transform: "translateZ(-1375px);",
            opacity: 0,
          },
          "100%": {
            " -webkit-transform": "translateZ(0);",
            transform: "translateZ(0);",
            opacity: 1,
          },
        },
      },
      animation: {
        "slide-top":
          "slide-top 0.25s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;",
        "pulsate-fwd": "pulsate-fwd 0.9s ease-in-out infinite both;",
        "slide-left":
          "slide-left 0.4s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;",
        "slide-right":
          "slide-right 0.4s cubic-bezier(0.250, 0.460, 0.450, 0.940) forwards;",
        "slide-in-fwd-center":
          "slide-in-fwd-center 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) 0.2s both;",
      },
    },
  },
  plugins: ["@tailwindcss/line-clamp"],
};
