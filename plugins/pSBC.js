/* eslint-disable */
import Vue from "vue"
/*

Usages:
// Setup:

let color1 = "rgb(20,60,200)";
let color2 = "rgba(20,60,200,0.67423)";
let color3 = "#67DAF0";
let color4 = "#5567DAF0";
let color5 = "#F3A";
let color6 = "#F3A9";
let color7 = "rgb(200,60,20)";
let color8 = "rgba(200,60,20,0.98631)";

// Tests:

// Shade (Lighten or Darken)
pSBC ( 0.42, color1 ); // rgb(20,60,200) + [42% Lighter] => rgb(166,171,225)
pSBC ( -0.4, color5 ); // #F3A + [40% Darker] => #c62884
pSBC ( 0.42, color8 ); // rgba(200,60,20,0.98631) + [42% Lighter] => rgba(225,171,166,0.98631)

// Shade with Conversion (use "c" as your "to" color)
pSBC ( 0.42, color2, "c" ); // rgba(20,60,200,0.67423) + [42% Lighter] + [Convert] => #a6abe1ac

// RGB2Hex & Hex2RGB Conversion Only (set percentage to zero)
pSBC ( 0, color6, "c" ); // #F3A9 + [Convert] => rgba(255,51,170,0.6)

// Blending
pSBC ( -0.5, color2, color8 ); // rgba(20,60,200,0.67423) + rgba(200,60,20,0.98631) + [50% Blend] => rgba(142,60,142,0.83)
pSBC ( 0.7, color2, color7 ); // rgba(20,60,200,0.67423) + rgb(200,60,20) + [70% Blend] => rgba(168,60,111,0.67423)
pSBC ( 0.25, color3, color7 ); // #67DAF0 + rgb(200,60,20) + [25% Blend] => rgb(134,191,208)
pSBC ( 0.75, color7, color3 ); // rgb(200,60,20) + #67DAF0 + [75% Blend] => #86bfd0

// Shade (Lighten or Darken)
pSBC ( 0.42, color1, false, true ); // rgb(20,60,200) + [42% Lighter] => rgb(119,142,223)
pSBC ( -0.4, color5, false, true ); // #F3A + [40% Darker] => #991f66
pSBC ( 0.42, color8, false, true ); // rgba(200,60,20,0.98631) + [42% Lighter] => rgba(223,142,119,0.98631)

// Shade with Conversion (use "c" as your "to" color)
pSBC ( 0.42, color2, "c", true ); // rgba(20,60,200,0.67423) + [42% Lighter] + [Convert] => #778edfac

// RGB2Hex & Hex2RGB Conversion Only (set percentage to zero)
pSBC ( 0, color6, "c", true ); // #F3A9 + [Convert] => rgba(255,51,170,0.6)

// Blending
pSBC ( -0.5, color2, color8, true ); // rgba(20,60,200,0.67423) + rgba(200,60,20,0.98631) + [50% Blend] => rgba(110,60,110,0.83)
pSBC ( 0.7, color2, color7, true ); // rgba(20,60,200,0.67423) + rgb(200,60,20) + [70% Blend] => rgba(146,60,74,0.67423)
pSBC ( 0.25, color3, color7, true ); // #67DAF0 + rgb(200,60,20) + [25% Blend] => rgb(127,179,185)
pSBC ( 0.75, color7, color3, true ); // rgb(200,60,20) + #67DAF0 + [75% Blend] => #7fb3b9

// Error Checking
pSBC ( 0.42, "#FFBAA" ); // #FFBAA + [42% Lighter] => null  (Invalid Input Color)
pSBC ( 42, color1, color5 ); // rgb(20,60,200) + #F3A + [4200% Blend] => null  (Invalid Percentage Range)
pSBC ( 0.42, {} ); // [object Object] + [42% Lighter] => null  (Strings Only for Color)
pSBC ( "42", color1 ); // rgb(20,60,200) + ["42"] => null  (Numbers Only for Percentage)
pSBC ( 0.42, "salt" ); // salt + [42% Lighter] => null  (A Little Salt is No Good...)

// Error Check Fails (Some Errors are not Caught)
pSBC ( 0.42, "#salt" ); // #salt + [42% Lighter] => #a5a5a500  (...and a Pound of Salt is Jibberish)

// Ripping
pSBCr ( color4 ); // #5567DAF0 + [Rip] => [object Object] => {'r':85,'g':103,'b':218,'a':0.941}
Return:
A color. It will be derived from the input color(s). And shaded or blended or converted accordingly. Or null if invalid parameters are used.

Params:
pSBC(p,c0,c1,l)

p = < Percentage Float > * REQUIRED

Used, as a percentage, with typical range of -1.0 to 1.0. Out of range parameter will cause a return of null.
When shading, the range is -1.0 to 1.0. But when blending, it is 0.0 to 1.0. And if you want to use the converter only, then use a p value of 0 or 0.0.
When shading, Positive numbers will shade to white (lighten the color). Negative colors will shade to black (darken the color).
When shading, using exactly -1.0 or 1.0 will always shade to pure black or pure white, regardless of the from color.
When blending two colors, a negative p value will get converted to a positive one (absolute value).
When blending two colors, a p (percentage) value of 0.5 will be a perfect 50/50 blend of the two colors. Higher p values will produce a color closer to the to color, and p values less than 0.5 will produce a color more similar to the from color.
Using exactly 0.0 (or 0) will not shade/blend at all, the from color will be returned. Use this to disable the shade/blend and to use the Hex2RGB and RGB2Hex conversion only option.
Using 0 for p (percentage) and 'c' for the to color will enable the standard conversion only option, like a shim. However, you can also use a real color as the to color and with a p of 0, it will return the from color in whatever color format the to color is using, be it Hex or RGB. I call this a blind shim. Because you can still standardize the environment, but without knowing which color formats it uses. In fact, this whole function lets you manipulate colors without you knowing its color format.
c0 = < "from" Color String > * REQUIRED

Accepts color strings in the form of RGB colors with or without the alpha channel (the RGB color format). For example: rgb(23,4,55) or rgba(23,4,55,0.52).
Accepts color strings in the form of Hex colors with or without the alpha channel (the Hex color format). And it can also accept the short 3 or 4 digit notation. For example: #FF33DD or #FF33DDCC or #F3D or #F3DC.
Auto-detects Hex or RGB.
c1 = < "to" Color String > Optional

Accepts color strings in the form of RGB colors with or without the alpha channel (the RGB color format). For example: rgb(23,4,55) or rgba(23,4,55,0.52).
Accepts color strings in the form of Hex colors with or without the alpha channel (the hex color format). And it can also accept the short 3 or 4 digit notation. For example: #FF33DD or #FF33DDCC or #F3D or #F3DC.
Auto-detects Hex or RGB.
To enable the conversion only feature: Pass the single character 'c' as the to color, and pass 0 as the p (percentage). The auto-detect of the from color will know which direction to convert. Using 'c' is required because...
Omitting the to color (or using a falsy) will enable the shader-only mode.
Using a to color will enable the blender.
Using a to color of white or black is the same as using the shader.
Conversion between Hex2RGB and RGB2Hex is implicit. Therefore, if your color formats are different between your from color and your to color, the returned color will have a color format equal to the to color. If the to color is the single character 'c', then the returned color will be derived from only the from color and with its color format converted to the other. If there is no to argument at all (omitted), or if passed a falsy, it will not convert anything and will only attempt to shade.
Using the single character 'c' as your to color with a non-zero p (percentage) will allow you to convert and shade.
l = < UseLinear Boolean > Optional

Defaults to false. And will use Log Blending.
Pass in true to use Linear Blending.


*/

// From https://github.com/PimpTrizkit/PJs/wiki/12.-Shade,-Blend-and-Convert-a-Web-Color-(pSBC.js)#stackoverflow-archive-begin



const pSBC = (p, c0, c1, l) => {
  let r, g, b, P, f, t, h, i = parseInt, m = Math.round, a = typeof (c1) == "string";
  if (typeof (p) != "number" || p < -1 || p > 1 || typeof (c0) != "string" || (c0[0] != 'r' && c0[0] != '#') || (c1 && !a)) return null;
  if (!this.pSBCr) this.pSBCr = (d) => {
    let n = d.length, x = {};
    if (n > 9) {
      [r, g, b, a] = d = d.split(","), n = d.length;
      if (n < 3 || n > 4) return null;
      x.r = i(r[3] == "a" ? r.slice(5) : r.slice(4)), x.g = i(g), x.b = i(b), x.a = a ? parseFloat(a) : -1
    } else {
      if (n == 8 || n == 6 || n < 4) return null;
      if (n < 6) d = "#" + d[1] + d[1] + d[2] + d[2] + d[3] + d[3] + (n > 4 ? d[4] + d[4] : "");
      d = i(d.slice(1), 16);
      if (n == 9 || n == 5) x.r = d >> 24 & 255, x.g = d >> 16 & 255, x.b = d >> 8 & 255, x.a = m((d & 255) / 0.255) / 1000;
      else x.r = d >> 16, x.g = d >> 8 & 255, x.b = d & 255, x.a = -1
    } return x
  };
  h = c0.length > 9, h = a ? c1.length > 9 ? true : c1 == "c" ? !h : false : h, f = pSBCr(c0), P = p < 0, t = c1 && c1 != "c" ? pSBCr(c1) : P ? { r: 0, g: 0, b: 0, a: -1 } : { r: 255, g: 255, b: 255, a: -1 }, p = P ? p * -1 : p, P = 1 - p;
  if (!f || !t) return null;
  if (l) r = m(P * f.r + p * t.r), g = m(P * f.g + p * t.g), b = m(P * f.b + p * t.b);
  else r = m((P * f.r ** 2 + p * t.r ** 2) ** 0.5), g = m((P * f.g ** 2 + p * t.g ** 2) ** 0.5), b = m((P * f.b ** 2 + p * t.b ** 2) ** 0.5);
  a = f.a, t = t.a, f = a >= 0 || t >= 0, a = f ? a < 0 ? t : t < 0 ? a : a * P + t * p : 0;
  if (h) return "rgb" + (f ? "a(" : "(") + r + "," + g + "," + b + (f ? "," + m(a * 1000) / 1000 : "") + ")";
  else return "#" + (4294967296 + r * 16777216 + g * 65536 + b * 256 + (f ? m(a * 255) : 0)).toString(16).slice(1, f ? undefined : -2)
}

Vue.prototype.$pSBC = pSBC

export default pSBC