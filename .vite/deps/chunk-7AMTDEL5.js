import {
  __commonJS
} from "./chunk-WNKWOKNR.js";

// browser-external:crypto
var require_crypto = __commonJS({
  "browser-external:crypto"(exports, module) {
    module.exports = Object.create(new Proxy({}, {
      get(_, key) {
        if (key !== "__esModule" && key !== "__proto__" && key !== "constructor" && key !== "splice") {
          console.warn(`Module "crypto" has been externalized for browser compatibility. Cannot access "crypto.${key}" in client code. See http://vitejs.dev/guide/troubleshooting.html#module-externalized-for-browser-compatibility for more details.`);
        }
      }
    }));
  }
});

export {
  require_crypto
};
//# sourceMappingURL=chunk-7AMTDEL5.js.map
