(function () {
  "use strict";

  var LARP_UI_TAG = "v13.0.0";
  var ANIME_GIRL_URL = "https://pngimg.com/uploads/anime_girl/anime_girl_PNG2.png";

  var React = vendetta.metro.common.React;
  var RN = vendetta.metro.common.ReactNative;
  var View = RN.View;
  var Text = RN.Text;
  var TextInput = RN.TextInput;
  var ScrollView = RN.ScrollView;
  var Image = RN.Image;
  var Pressable = RN.Pressable || RN.TouchableOpacity;

  var findByStoreName = vendetta.metro.findByStoreName;
  var findByName = vendetta.metro.findByName;
  var findByProps = vendetta.metro.findByProps;
  var after = vendetta.patcher.after;
  var showToast = vendetta.ui.toasts.showToast;
  var getAssetIDByName = vendetta.ui.assets.getAssetIDByName;

  var storage = vendetta.plugin.storage;
  if (storage.matchUsername == null) storage.matchUsername = "";
  if (storage.replaceUsername == null) storage.replaceUsername = "";
  if (storage.spoofAccountDateIso == null) storage.spoofAccountDateIso = "";
  if (typeof storage.badges !== "object" || storage.badges === null) storage.badges = {};
  if (typeof storage.hideNative !== "object" || storage.hideNative === null) storage.hideNative = {};
  if (storage.hideNative.quest == null) storage.hideNative.quest = false;
  if (storage.hideNative.orb == null) storage.hideNative.orb = false;
  if (storage.hideNative.nitro == null) storage.hideNative.nitro = false;
  if (storage.hideNative.boost == null) storage.hideNative.boost = false;
  if (storage.hideNative.orbBalance == null) storage.hideNative.orbBalance = false;
  if (storage.hideNative.legacyUsername == null) storage.hideNative.legacyUsername = false;
  if (storage.hideNative.levelLeaf == null) storage.hideNative.levelLeaf = false;
  if (storage.hideNative.idSubstrings == null) storage.hideNative.idSubstrings = "";
  if (!Array.isArray(storage.otherProfiles)) storage.otherProfiles = [];
  if (!Array.isArray(storage.fakeConnections)) storage.fakeConnections = [];

  // ── Theme ────────────────────────────────────────────────────────────────
  var K = {
    bg:       "#0d0014",
    card:     "#1a0030",
    card2:    "#22003d",
    inset:    "#110022",
    line:     "#7c3aed",
    lineSoft: "#3b0764",
    muted:    "#c4b5fd",
    text:     "#f5e6ff",
    accent:   "#e879f9",
    accent2:  "#a855f7",
    pink:     "#f472b6",
    blue:     "#38bdf8",
    danger:   "#fb7185",
    green:    "#86efac",
    gold:     "#fbbf24",
    white:    "#ffffff"
  };

  var CDN = "https://cdn.discordapp.com/badge-icons";
  var BADGES = [
    { id: "staff",                   label: "Discord Staff",         url: CDN + "/5e74e9b61934fc1f67c65515d1f7e60d.png",  asset: "StaffBadge",                     emoji: "🛡️" },
    { id: "partner",                 label: "Discord Partner",       url: CDN + "/3f9748e53446a137a052f3454e2de41e.png",  asset: "DiscordPartnerBadge",             emoji: "🤝" },
    { id: "moderator",               label: "Certified Mod",         url: CDN + "/fee1624003e2fee35cb398e125dc479b.png",  asset: "DiscordCertifiedModeratorBadge",  emoji: "🔨" },
    { id: "hypesquad_events",        label: "HypeSquad Events",      url: CDN + "/bf01d1073931f921909045f3a39fd264.png",  asset: "HypeSquadEventsBadge",            emoji: "🎪" },
    { id: "hypesquad_bravery",       label: "HypeSquad Bravery",     url: CDN + "/8a88d63823d8a71cd5e390baa45efa02.png",  asset: "HypeSquadBraveryBadge",           emoji: "🟣" },
    { id: "hypesquad_brilliance",    label: "HypeSquad Brilliance",  url: CDN + "/011940fd013da3f7fb926e4a1cd2e618.png",  asset: "HypeSquadBrillianceBadge",        emoji: "🔴" },
    { id: "hypesquad_balance",       label: "HypeSquad Balance",     url: CDN + "/3aa41de486fa12454c3761e8e223442e.png",  asset: "HypeSquadBalanceBadge",           emoji: "🟡" },
    { id: "bug_hunter_1",            label: "Bug Hunter Lv1",        url: CDN + "/2717692c7dca7289b35297368a940dd0.png",  asset: "BugHunterLevel1Badge",            emoji: "🐛" },
    { id: "bug_hunter_2",            label: "Bug Hunter Lv2",        url: CDN + "/848f79194d4be5ff5f81505cbd0ce1e6.png",  asset: "BugHunterLevel2Badge",            emoji: "🐞" },
    { id: "active_developer",        label: "Active Developer",      url: CDN + "/6bdc42827a38498929a4920da12695d9.png",  asset: "ActiveDeveloperBadge",            emoji: "👨‍💻" },
    { id: "verified_developer",      label: "Verified Bot Dev",      url: CDN + "/6df5892e0f35b051f8b61eace34f4967.png",  asset: "VerifiedDeveloperBadge",          emoji: "✅" },
    { id: "early_supporter",         label: "Early Supporter",       url: CDN + "/7060786766c9c840eb3019e725d2b358.png",  asset: "EarlySupporterBadge",             emoji: "💜" },
    { id: "premium",                 label: "Discord Nitro",         url: CDN + "/2ba85e8026a8614b640c2837bcdfe21b.png",  assetCandidates: ["NitroSubscriberBadge","NitroSubscriber","PremiumSubscriberBadge"], emoji: "💎" },
    { id: "premium_tenure_3_month",  label: "Nitro 3mo",             url: CDN + "/6de6d34650760ba5551a79732e98ed60.png",  assetCandidates: ["NitroBronzeBadge","NitroBronze"],     emoji: "🥉" },
    { id: "premium_tenure_6_month",  label: "Nitro 6mo",             url: CDN + "/6de6d34650760ba5551a79732e98ed60.png",  assetCandidates: ["NitroSilverBadge","NitroSilver"],     emoji: "🥈" },
    { id: "premium_tenure_12_month", label: "Nitro 12mo",            url: CDN + "/d92998916f4ce6f74de7da0a37b8d740.png",  assetCandidates: ["NitroGoldBadge","NitroGold"],         emoji: "🥇" },
    { id: "premium_tenure_24_month", label: "Nitro 24mo",            url: CDN + "/9d4f73ca6df09bc63a39ea84d5fd0ff5.png",  assetCandidates: ["NitroPlatinumBadge","NitroPlatinum"], emoji: "💠" },
    { id: "premium_tenure_emerald",  label: "Nitro Emerald",         url: CDN + "/11e2d339068b55d3a506cff34d3780f3.png",  assetCandidates: ["NitroEmeraldBadge","NitroEmerald"],   emoji: "💚" },
    { id: "premium_tenure_ruby",     label: "Nitro Ruby",            url: CDN + "/cd5e2cfd9d7f27a8cdcd3e8a8d5dc9f4.png",  assetCandidates: ["NitroRubyBadge","NitroRuby"],         emoji: "❤️" },
    { id: "premium_tenure_opal",     label: "Nitro Opal",            url: CDN + "/5b154df19c53dce2af92c9b61e6be5e2.png",  assetCandidates: ["NitroOpalBadge","NitroOpal"],         emoji: "🌈" },
    { id: "guild_boost_12",          label: "Server Boost 12mo",     url: CDN + "/991c9f39ee33d7537d9f408c3e53141e.png",  assetCandidates: ["GuildBoosterLevel6Badge"],            emoji: "🚀" },
    { id: "guild_boost_24",          label: "Server Boost 24mo",     url: CDN + "/ec92202290b48d0879b7413d2dde3bab.png",  assetCandidates: ["GuildBoosterLevel9Badge"],            emoji: "🌟" },
    { id: "legacy_username",         label: "Legacy Username",       url: CDN + "/6de6d34650760ba5551a79732e98ed60.png",  asset: "LegacyUsernameBadge",             emoji: "🏷️" }
  ];

  var CONNECTION_TYPES = [
    { id: "steam",       label: "Steam",       emoji: "🎮", color: "#66c0f4" },
    { id: "twitch",      label: "Twitch",      emoji: "🟣", color: "#9146ff" },
    { id: "youtube",     label: "YouTube",     emoji: "▶️",  color: "#ff0000" },
    { id: "twitter",     label: "Twitter/X",   emoji: "🐦", color: "#1d9bf0" },
    { id: "spotify",     label: "Spotify",     emoji: "🎵", color: "#1db954" },
    { id: "github",      label: "GitHub",      emoji: "🐙", color: "#e6edf3" },
    { id: "reddit",      label: "Reddit",      emoji: "🤖", color: "#ff4500" },
    { id: "xbox",        label: "Xbox",        emoji: "🎯", color: "#107c10" },
    { id: "playstation", label: "PlayStation", emoji: "🕹️", color: "#003791" },
    { id: "tiktok",      label: "TikTok",      emoji: "🎶", color: "#fe2c55" },
    { id: "instagram",   label: "Instagram",   emoji: "📸", color: "#e1306c" },
    { id: "crunchyroll", label: "Crunchyroll", emoji: "🍥", color: "#f47521" }
  ];

  var NITRO_ORDER = ["premium_tenure_opal","premium_tenure_ruby","premium_tenure_emerald","premium_tenure_24_month","premium_tenure_12_month","premium_tenure_6_month","premium_tenure_3_month","premium"];
  var BOOST_ORDER = ["guild_boost_24","guild_boost_12"];
  var NITRO_SET = {};
  var BOOST_SET = {};
  for (var _i = 0; _i < NITRO_ORDER.length; _i++) NITRO_SET[NITRO_ORDER[_i]] = true;
  for (var _j = 0; _j < BOOST_ORDER.length; _j++) BOOST_SET[BOOST_ORDER[_j]] = true;

  var LARP_BADGE_META = {};
  for (var _b = 0; _b < BADGES.length; _b++) {
    LARP_BADGE_META["larp-" + BADGES[_b].id] = { uri: BADGES[_b].url, label: BADGES[_b].label };
  }

  function collectAssetNames(b) {
    var out = [];
    if (b.assetCandidates) for (var i = 0; i < b.assetCandidates.length; i++) out.push(b.assetCandidates[i]);
    if (b.asset) out.push(b.asset);
    return out;
  }
  function firstResolvedAsset(names) {
    if (!names || !names.length) return null;
    for (var i = 0; i < names.length; i++) {
      try { var id = getAssetIDByName(names[i]); var n = typeof id === "number" ? id : parseInt(id, 10); if (!isNaN(n)) return n; } catch (_) {}
    }
    return null;
  }
  function makeBadgePayload(b) {
    var idOut = "larp-" + b.id;
    if (NITRO_SET[b.id] || BOOST_SET[b.id]) return { id: idOut, description: b.label, icon: " " };
    var assetNum = firstResolvedAsset(collectAssetNames(b));
    if (assetNum != null) return { id: idOut, icon: assetNum, source: assetNum, description: b.label };
    return { id: idOut, description: b.label, icon: " " };
  }
  function getBadgesMap() { return storage.badges && typeof storage.badges === "object" ? storage.badges : {}; }
  function hasAnyBadge(bm) { for (var k in bm) { if (bm[k]) return true; } return false; }
  function getEnabledNitro() { var bm = getBadgesMap(); for (var i = 0; i < NITRO_ORDER.length; i++) if (bm[NITRO_ORDER[i]]) return NITRO_ORDER[i]; return null; }
  function getEnabledBoost() { var bm = getBadgesMap(); for (var i = 0; i < BOOST_ORDER.length; i++) if (bm[BOOST_ORDER[i]]) return BOOST_ORDER[i]; return null; }
  function isBoostBadge(b) { if (!b) return false; var id = String(b.id || "").toLowerCase(); var desc = String(b.description || "").toLowerCase(); return id.indexOf("guild_booster") !== -1 || id.indexOf("premium_guild") !== -1 || desc.indexOf("server boost") !== -1; }
  function isNitroBadge(b) { if (!b || String(b.id || "").indexOf("larp-") === 0 || isBoostBadge(b)) return false; var id = String(b.id || "").toLowerCase(); return id.indexOf("premium_tenure") !== -1 || id.indexOf("nitro") !== -1 || id.indexOf("premium") !== -1; }
  function shouldHide(b) {
    if (!b || String(b.id || "").indexOf("larp-") === 0) return false;
    var h = storage.hideNative || {};
    var id = String(b.id || "").toLowerCase();
    if (h.quest && id.indexOf("quest") !== -1) return true;
    if (h.nitro && isNitroBadge(b)) return true;
    if (h.boost && isBoostBadge(b)) return true;
    if (h.legacyUsername && id.indexOf("legacy_username") !== -1) return true;
    var raw = String(h.idSubstrings || "").trim().toLowerCase();
    if (raw) { var parts = raw.split(/[\s,;]+/); for (var p = 0; p < parts.length; p++) { if (parts[p] && id.indexOf(parts[p]) !== -1) return true; } }
    return false;
  }

  function normName(s) { if (!s) return ""; var t = s.trim(); if (t[0] === "@") t = t.slice(1); return t.toLowerCase(); }
  function parseMs(s) { if (!s) return null; var d = Date.parse(s.trim()); return isNaN(d) ? null : d; }
  function getSpoofReplace(user) {
    if (!user) return null;
    var pun = normName(user.username || "");
    if (!pun) return null;
    if (normName(storage.matchUsername) === pun && (storage.replaceUsername || "").trim()) return storage.replaceUsername.trim();
    var others = storage.otherProfiles || [];
    for (var i = 0; i < others.length; i++) { var op = others[i] || {}; if (normName(op.matchUsername || "") === pun && (op.replaceUsername || "").trim()) return op.replaceUsername.trim(); }
    return null;
  }

  var wrapCache = new WeakMap();
  function buildProxy(user) {
    if (wrapCache.has(user)) return wrapCache.get(user);
    var proxy = new Proxy(user, {
      get: function (t, p, recv) {
        var ms = parseMs(storage.spoofAccountDateIso);
        var cur = UserStoreRef && UserStoreRef.getCurrentUser && UserStoreRef.getCurrentUser();
        if (ms && cur && t.id && String(t.id) === String(cur.id)) {
          if (p === "createdTimestamp" || p === "createdAtTimestamp") return ms;
          if (p === "createdAt" || p === "created_at") return new Date(ms);
        }
        var rep = getSpoofReplace(t);
        if (rep && p === "username") return rep;
        return Reflect.get(t, p, recv);
      },
      getOwnPropertyDescriptor: function (t, p) {
        var rep = getSpoofReplace(t);
        if (rep && p === "username") return { configurable: true, enumerable: true, value: rep };
        return Reflect.getOwnPropertyDescriptor(t, p);
      },
      ownKeys: function (t) { return Reflect.ownKeys(t); }
    });
    wrapCache.set(user, proxy);
    return proxy;
  }
  function wrap(user) {
    if (!user) return user;
    var rep = getSpoofReplace(user);
    var ms = parseMs(storage.spoofAccountDateIso);
    var cur = UserStoreRef && UserStoreRef.getCurrentUser && UserStoreRef.getCurrentUser();
    if (!rep && !(ms && cur && user.id && String(user.id) === String(cur.id))) return user;
    return buildProxy(user);
  }

  var unpatches = [];
  var UserStoreRef = null;
  var __inside = false;
  var __userCache = new Map();

  function cachedGetUser(uid) {
    if (!uid || !UserStoreRef) return null;
    var k = String(uid);
    if (__userCache.has(k)) return __userCache.get(k);
    try { var u = UserStoreRef.getUser(k); if (u) { __userCache.set(k, u); return u; } } catch (_) {}
    return null;
  }

  function larpUnpatchAll() {
    for (var i = 0; i < unpatches.length; i++) { try { unpatches[i](); } catch (_) {} }
    unpatches = [];
    __userCache.clear();
    wrapCache = new WeakMap();
  }

  function patchUsername() {
    try {
      var US = findByStoreName("UserStore");
      UserStoreRef = US || null;
      if (!US) return;
      unpatches.push(after("getCurrentUser", US, function (_a, ret) { if (__inside) return ret; __inside = true; try { return wrap(ret); } finally { __inside = false; } }));
      unpatches.push(after("getUser", US, function (_a, ret) { if (__inside) return ret; __inside = true; try { return wrap(ret); } finally { __inside = false; } }));
    } catch (e) { console.error("[Larp] patchUsername", e); }
  }

  function patchBadges() {
    try {
      var mod = findByName("useBadges", false);
      if (!mod) return;
      var key = typeof mod.default === "function" ? "default" : typeof mod.useBadges === "function" ? "useBadges" : null;
      if (!key) return;
      unpatches.push(after(key, mod, function (args, ret) {
        if (!ret || !Array.isArray(ret)) return ret;
        var bm = getBadgesMap();
        if (!hasAnyBadge(bm)) return ret.filter(function (x) { return !shouldHide(x); });
        var base = ret.filter(function (x) { return !x || !String(x.id || "").startsWith("larp-"); });
        var np = getEnabledNitro(); var bp = getEnabledBoost();
        if (np) base = base.filter(function (x) { return !isNitroBadge(x); });
        if (bp) base = base.filter(function (x) { return !isBoostBadge(x); });
        base = base.filter(function (x) { return !shouldHide(x); });
        var adds = [];
        for (var i = 0; i < BADGES.length; i++) {
          var b = BADGES[i];
          if (!bm[b.id]) continue;
          if (NITRO_SET[b.id] && b.id !== np) continue;
          if (BOOST_SET[b.id] && b.id !== bp) continue;
          adds.push(makeBadgePayload(b));
        }
        return adds.concat(base);
      }));
    } catch (e) { console.error("[Larp] patchBadges", e); }
  }

  function patchBadgeIcons() {
    try {
      var jsx = findByProps("jsx", "jsxs");
      if (!jsx) return;
      function onJsx(args, ret) {
        if (!ret || !ret.props) return ret;
        var T = args[0];
        if (typeof T !== "function") return ret;
        var n = T.displayName || T.name || "";
        if (n !== "ProfileBadge" && n !== "RenderedBadge") return ret;
        var id = ret.props.id;
        if (typeof id !== "string") return ret;
        var meta = LARP_BADGE_META[id];
        if (!meta) return ret;
        ret.props.source = { uri: meta.uri };
        if (!ret.props.description) ret.props.description = meta.label;
        return ret;
      }
      unpatches.push(after("jsx", jsx, onJsx));
      unpatches.push(after("jsxs", jsx, onJsx));
    } catch (e) { console.error("[Larp] patchBadgeIcons", e); }
  }

  function patchConnections() {
    try {
      var storeNames = ["UserProfileStore", "UserProfileStoreV2", "ConnectedAccountsStore"];
      var methods = ["getConnectedAccounts", "getUserProfile", "getProfile"];
      for (var si = 0; si < storeNames.length; si++) {
        (function (sn) {
          try {
            var S = findByStoreName(sn);
            if (!S) return;
            for (var mi = 0; mi < methods.length; mi++) {
              (function (mn) {
                if (typeof S[mn] !== "function") return;
                unpatches.push(after(mn, S, function (args, ret) {
                  var fc = storage.fakeConnections;
                  if (!Array.isArray(fc) || !fc.length) return ret;
                  var fakes = fc.map(function (c) {
                    return { type: c.type || "steam", id: c.username || "user", name: c.username || "user", verified: true, visibility: 1, friend_sync: false, show_activity: true, two_way_link: false, metadata_visibility: 1, integrations: [] };
                  });
                  if (mn === "getConnectedAccounts") return fakes.concat(Array.isArray(ret) ? ret : []);
                  if (ret && typeof ret === "object") {
                    var existing = Array.isArray(ret.connectedAccounts) ? ret.connectedAccounts : [];
                    return Object.assign({}, ret, { connectedAccounts: fakes.concat(existing) });
                  }
                  return ret;
                }));
              })(methods[mi]);
            }
          } catch (_) {}
        })(storeNames[si]);
      }
    } catch (e) { console.error("[Larp] patchConnections", e); }
  }

  // ── UI Components ────────────────────────────────────────────────────────
  function Settings() {
    var forceState = React.useState(0);
    var force = forceState[1];
    var tabState = React.useState("badges");
    var tab = tabState[0]; var setTab = tabState[1];

    function refresh() {
      __userCache.clear();
      force(function (n) { return n + 1; });
      try { var us = findByStoreName("UserStore"); if (us && us.emitChange) us.emitChange(); } catch (_) {}
    }

    // Reusable components
    function GlowCard(props) {
      return React.createElement(View, {
        style: {
          backgroundColor: K.card, borderRadius: 20,
          borderWidth: 1, borderColor: K.line,
          marginBottom: 14, overflow: "hidden",
          shadowColor: K.accent, shadowOpacity: 0.4, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }
        }
      }, props.children);
    }

    function SectionHeader(props) {
      return React.createElement(View, {
        style: {
          flexDirection: "row", alignItems: "center",
          paddingHorizontal: 16, paddingTop: 14, paddingBottom: 8,
          borderBottomWidth: 1, borderBottomColor: K.lineSoft
        }
      },
        props.icon ? React.createElement(Text, { style: { fontSize: 16, marginRight: 8 } }, props.icon) : null,
        React.createElement(Text, { style: { color: K.accent, fontSize: 12, fontWeight: "800", letterSpacing: 1.5, textTransform: "uppercase", flex: 1 } }, props.title),
        props.count != null && props.count > 0 ? React.createElement(View, {
          style: { backgroundColor: K.accent, borderRadius: 99, paddingHorizontal: 8, paddingVertical: 2 }
        }, React.createElement(Text, { style: { color: K.white, fontSize: 11, fontWeight: "800" } }, String(props.count))) : null
      );
    }

    function Field(props) {
      return React.createElement(View, {
        style: { paddingHorizontal: 16, paddingVertical: 10, borderTopWidth: props.first ? 0 : 1, borderTopColor: K.lineSoft }
      },
        React.createElement(Text, { style: { color: K.muted, fontSize: 11, fontWeight: "700", letterSpacing: 0.5, marginBottom: 6, textTransform: "uppercase" } }, props.label),
        React.createElement(TextInput, {
          style: {
            backgroundColor: K.inset, color: K.text, borderRadius: 12,
            borderWidth: 1, borderColor: K.line,
            paddingHorizontal: 14, paddingVertical: 10, fontSize: 14
          },
          placeholder: props.placeholder || props.label,
          placeholderTextColor: "#581c87",
          value: props.value || "",
          autoCorrect: false, autoCapitalize: "none",
          onChangeText: props.onChange
        })
      );
    }

    function PillToggle(props) {
      var on = !!props.value;
      return React.createElement(Pressable, {
        onPress: props.onPress,
        style: {
          flexDirection: "row", alignItems: "center",
          paddingHorizontal: 16, paddingVertical: 12,
          borderTopWidth: props.first ? 0 : 1, borderTopColor: K.lineSoft,
          backgroundColor: on ? "#2d0050" : "transparent"
        }
      },
        React.createElement(View, {
          style: {
            width: 44, height: 24, borderRadius: 12,
            backgroundColor: on ? K.accent : K.inset,
            borderWidth: 1, borderColor: on ? K.accent : K.line,
            justifyContent: "center", paddingHorizontal: 2,
            alignItems: on ? "flex-end" : "flex-start",
            marginRight: 12
          }
        }, React.createElement(View, { style: { width: 18, height: 18, borderRadius: 9, backgroundColor: on ? K.white : K.muted } })),
        React.createElement(Text, { style: { color: on ? K.text : K.muted, fontSize: 14, flex: 1 } }, props.label),
        on ? React.createElement(Text, { style: { color: K.accent, fontSize: 11, fontWeight: "700" } }, "ON") : null
      );
    }

    // Tab bar
    var TABS = [
      { id: "badges",      label: "Badges",      icon: "✨" },
      { id: "identity",    label: "Identity",    icon: "🌸" },
      { id: "connections", label: "Links",        icon: "🔗" },
      { id: "hide",        label: "Hide",         icon: "🙈" }
    ];
    var tabBar = React.createElement(ScrollView, {
      horizontal: true, showsHorizontalScrollIndicator: false,
      contentContainerStyle: { paddingHorizontal: 16, paddingVertical: 6 }
    }, TABS.map(function (t) {
      var active = tab === t.id;
      return React.createElement(Pressable, {
        key: t.id, onPress: function () { setTab(t.id); },
        style: {
          flexDirection: "row", alignItems: "center",
          paddingHorizontal: 16, paddingVertical: 9, borderRadius: 99, marginRight: 8,
          backgroundColor: active ? K.accent : K.card,
          borderWidth: 1.5, borderColor: active ? K.pink : K.line
        }
      },
        React.createElement(Text, { style: { fontSize: 14, marginRight: 5 } }, t.icon),
        React.createElement(Text, { style: { color: active ? K.white : K.muted, fontWeight: active ? "800" : "400", fontSize: 13 } }, t.label)
      );
    }));

    // ── BADGES TAB ──────────────────────────────────────────────────────────
    var bm = getBadgesMap();
    var activeBadgeCount = Object.keys(bm).filter(function (k) { return bm[k]; }).length;
    var badgesTab = React.createElement(GlowCard, null,
      React.createElement(SectionHeader, { icon: "✨", title: "Fake Badges", count: activeBadgeCount }),
      BADGES.map(function (b, i) {
        var on = !!bm[b.id];
        return React.createElement(Pressable, {
          key: b.id,
          onPress: function () {
            if (NITRO_SET[b.id] && !on) { for (var k in NITRO_SET) storage.badges[k] = false; }
            if (BOOST_SET[b.id] && !on) { for (var k in BOOST_SET) storage.badges[k] = false; }
            storage.badges[b.id] = !on;
            refresh();
          },
          style: {
            flexDirection: "row", alignItems: "center",
            paddingHorizontal: 16, paddingVertical: 11,
            borderTopWidth: i === 0 ? 0 : 1, borderTopColor: K.lineSoft,
            backgroundColor: on ? "#2d0050" : "transparent"
          }
        },
          React.createElement(Text, { style: { fontSize: 18, width: 30 } }, b.emoji || "🏅"),
          React.createElement(Text, { style: { color: on ? K.text : K.muted, fontSize: 14, flex: 1, marginLeft: 4 } }, b.label),
          React.createElement(View, {
            style: {
              width: 24, height: 24, borderRadius: 12,
              backgroundColor: on ? K.accent : K.inset,
              borderWidth: 1, borderColor: on ? K.accent : K.line,
              alignItems: "center", justifyContent: "center"
            }
          }, on ? React.createElement(Text, { style: { color: K.white, fontSize: 13, fontWeight: "800" } }, "✓") : null)
        );
      })
    );

    // ── IDENTITY TAB ────────────────────────────────────────────────────────
    var identityTab = React.createElement(View, null,
      React.createElement(GlowCard, null,
        React.createElement(SectionHeader, { icon: "🌸", title: "Username Spoof" }),
        Field({ label: "Match username", placeholder: "your_current_username", value: storage.matchUsername, first: true, onChange: function (v) { storage.matchUsername = v; refresh(); } }),
        Field({ label: "Display as", placeholder: "fake_username", value: storage.replaceUsername, onChange: function (v) { storage.replaceUsername = v; refresh(); } })
      ),
      React.createElement(GlowCard, null,
        React.createElement(SectionHeader, { icon: "📅", title: "Account Age Spoof" }),
        Field({ label: "Created at date", placeholder: "2015-05-13  or  13/05/2015", value: storage.spoofAccountDateIso, first: true, onChange: function (v) { storage.spoofAccountDateIso = v; refresh(); } })
      ),
      React.createElement(GlowCard, null,
        React.createElement(SectionHeader, { icon: "👥", title: "Other Accounts", count: (storage.otherProfiles || []).length }),
        (storage.otherProfiles || []).map(function (op, oi) {
          if (!op || typeof op !== "object") return null;
          if (typeof op.badges !== "object") op.badges = {};
          return React.createElement(View, { key: "op" + oi, style: { borderTopWidth: oi > 0 ? 1 : 0, borderTopColor: K.lineSoft } },
            React.createElement(View, { style: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingTop: 12, paddingBottom: 2 } },
              React.createElement(Text, { style: { color: K.pink, fontWeight: "800", fontSize: 13, flex: 1 } }, "Account " + (oi + 1)),
              React.createElement(Pressable, { onPress: function () { storage.otherProfiles.splice(oi, 1); refresh(); }, style: { padding: 4 } },
                React.createElement(Text, { style: { color: K.danger, fontSize: 13 } }, "✕ Remove"))
            ),
            Field({ label: "User ID (optional)", value: op.userId || "", first: true, onChange: function (v) { op.userId = v; refresh(); } }),
            Field({ label: "Match username", value: op.matchUsername || "", onChange: function (v) { op.matchUsername = v; refresh(); } }),
            Field({ label: "Replace as", value: op.replaceUsername || "", onChange: function (v) { op.replaceUsername = v; refresh(); } })
          );
        }),
        React.createElement(Pressable, {
          onPress: function () { storage.otherProfiles.push({ userId: "", matchUsername: "", replaceUsername: "", badges: {} }); refresh(); },
          style: { paddingVertical: 14, alignItems: "center", borderTopWidth: (storage.otherProfiles || []).length ? 1 : 0, borderTopColor: K.lineSoft }
        }, React.createElement(Text, { style: { color: K.blue, fontWeight: "700", fontSize: 14 } }, "+ Add Account"))
      )
    );

    // ── CONNECTIONS TAB ─────────────────────────────────────────────────────
    var conns = storage.fakeConnections || [];
    var connectionsTab = React.createElement(View, null,
      React.createElement(GlowCard, null,
        React.createElement(SectionHeader, { icon: "🔗", title: "Fake Connections", count: conns.length }),
        conns.length === 0 ? React.createElement(View, { style: { padding: 24, alignItems: "center" } },
          React.createElement(Text, { style: { fontSize: 36, marginBottom: 8 } }, "🔗"),
          React.createElement(Text, { style: { color: K.muted, fontSize: 14, textAlign: "center" } }, "No connections yet\nTap + Add below")
        ) : null,
        conns.map(function (c, ci) {
          var ct = CONNECTION_TYPES.find(function (x) { return x.id === c.type; }) || CONNECTION_TYPES[0];
          return React.createElement(View, { key: "c" + ci, style: { borderTopWidth: ci === 0 ? 0 : 1, borderTopColor: K.lineSoft } },
            React.createElement(View, { style: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingTop: 12, paddingBottom: 6 } },
              React.createElement(View, {
                style: { width: 36, height: 36, borderRadius: 18, backgroundColor: K.inset, borderWidth: 1, borderColor: K.line, alignItems: "center", justifyContent: "center", marginRight: 10 }
              }, React.createElement(Text, { style: { fontSize: 18 } }, ct.emoji)),
              React.createElement(Text, { style: { color: K.pink, fontWeight: "800", fontSize: 14, flex: 1 } }, ct.label),
              React.createElement(Pressable, { onPress: function () { conns.splice(ci, 1); refresh(); }, style: { padding: 6 } },
                React.createElement(Text, { style: { color: K.danger, fontSize: 13, fontWeight: "700" } }, "✕"))
            ),
            React.createElement(ScrollView, {
              horizontal: true, showsHorizontalScrollIndicator: false,
              contentContainerStyle: { paddingHorizontal: 16, paddingBottom: 8 }
            }, CONNECTION_TYPES.map(function (ct2) {
              var sel = c.type === ct2.id;
              return React.createElement(Pressable, {
                key: ct2.id, onPress: function () { c.type = ct2.id; refresh(); },
                style: {
                  flexDirection: "row", alignItems: "center",
                  paddingHorizontal: 12, paddingVertical: 7, borderRadius: 99, marginRight: 7,
                  backgroundColor: sel ? K.accent : K.inset,
                  borderWidth: 1, borderColor: sel ? K.accent : K.line
                }
              },
                React.createElement(Text, { style: { fontSize: 13, marginRight: 4 } }, ct2.emoji),
                React.createElement(Text, { style: { color: sel ? K.white : K.muted, fontSize: 12, fontWeight: sel ? "700" : "400" } }, ct2.label)
              );
            })),
            React.createElement(View, { style: { paddingHorizontal: 16, paddingBottom: 12 } },
              React.createElement(Text, { style: { color: K.muted, fontSize: 11, fontWeight: "700", letterSpacing: 0.5, marginBottom: 6, textTransform: "uppercase" } }, "Username / Handle"),
              React.createElement(TextInput, {
                style: { backgroundColor: K.inset, color: K.text, borderRadius: 12, borderWidth: 1, borderColor: K.line, paddingHorizontal: 14, paddingVertical: 10, fontSize: 14 },
                placeholder: "your_handle",
                placeholderTextColor: "#581c87",
                value: c.username || "",
                autoCorrect: false, autoCapitalize: "none",
                onChangeText: function (v) { c.username = v; refresh(); }
              })
            )
          );
        }),
        React.createElement(Pressable, {
          onPress: function () { storage.fakeConnections.push({ type: "steam", username: "" }); refresh(); },
          style: { paddingVertical: 14, alignItems: "center", borderTopWidth: conns.length ? 1 : 0, borderTopColor: K.lineSoft }
        }, React.createElement(Text, { style: { color: K.blue, fontWeight: "700", fontSize: 14 } }, "+ Add Connection"))
      )
    );

    // ── HIDE TAB ────────────────────────────────────────────────────────────
    var hideTab = React.createElement(View, null,
      React.createElement(GlowCard, null,
        React.createElement(SectionHeader, { icon: "🙈", title: "Hide Native Badges" }),
        PillToggle({ label: "Hide Quest badge",            value: storage.hideNative.quest,         first: true, onPress: function () { storage.hideNative.quest = !storage.hideNative.quest; refresh(); } }),
        PillToggle({ label: "Hide Orb badge",              value: storage.hideNative.orb,           onPress: function () { storage.hideNative.orb = !storage.hideNative.orb; refresh(); } }),
        PillToggle({ label: "Hide Nitro / tenure badges",  value: storage.hideNative.nitro,         onPress: function () { storage.hideNative.nitro = !storage.hideNative.nitro; refresh(); } }),
        PillToggle({ label: "Hide Server Boost badge",     value: storage.hideNative.boost,         onPress: function () { storage.hideNative.boost = !storage.hideNative.boost; refresh(); } }),
        PillToggle({ label: "Hide Orb balance row",        value: storage.hideNative.orbBalance,    onPress: function () { storage.hideNative.orbBalance = !storage.hideNative.orbBalance; refresh(); } }),
        PillToggle({ label: "Hide Level leaf badge",       value: storage.hideNative.levelLeaf,     onPress: function () { storage.hideNative.levelLeaf = !storage.hideNative.levelLeaf; refresh(); } }),
        PillToggle({ label: "Hide Legacy username badge",  value: storage.hideNative.legacyUsername, onPress: function () { storage.hideNative.legacyUsername = !storage.hideNative.legacyUsername; refresh(); } })
      ),
      React.createElement(GlowCard, null,
        React.createElement(SectionHeader, { icon: "🔎", title: "Hide by ID substring" }),
        Field({ label: "Badge ID fragments", placeholder: "space or comma separated", value: storage.hideNative.idSubstrings, first: true, onChange: function (v) { storage.hideNative.idSubstrings = v; refresh(); } })
      ),
      React.createElement(Pressable, {
        onPress: function () { storage.badges = {}; refresh(); try { showToast("Cleared all badges ✨", getAssetIDByName("trash")); } catch (_) {} },
        style: { paddingVertical: 14, alignItems: "center", backgroundColor: "#2d0014", borderRadius: 16, borderWidth: 1.5, borderColor: K.danger, marginBottom: 8 }
      }, React.createElement(Text, { style: { color: K.danger, fontWeight: "800", fontSize: 14 } }, "🗑️  Clear All Fake Badges"))
    );

    // ── Main Render ─────────────────────────────────────────────────────────
    return React.createElement(ScrollView, {
      style: { flex: 1, backgroundColor: K.bg },
      contentContainerStyle: { paddingBottom: 100 }
    },

      // ── Anime Girl Banner ──────────────────────────────────────────────────
      React.createElement(View, {
        style: {
          backgroundColor: K.card2,
          borderBottomWidth: 2,
          borderBottomColor: K.line,
          marginBottom: 16,
          paddingBottom: 20,
          alignItems: "center",
          overflow: "hidden"
        }
      },
        // Decorative top bar
        React.createElement(View, {
          style: { height: 4, width: "100%", backgroundColor: K.accent, marginBottom: 0 }
        }),
        // Anime girl image - full width banner style
        React.createElement(Image, {
          source: { uri: ANIME_GIRL_URL },
          style: { width: 160, height: 160, marginTop: 20, marginBottom: 6 },
          resizeMode: "contain"
        }),
        // Plugin name with glow styling
        React.createElement(Text, {
          style: { color: K.accent, fontSize: 28, fontWeight: "900", letterSpacing: 2, textShadowColor: K.accent, textShadowRadius: 12 }
        }, "✨ LARP ✨"),
        React.createElement(Text, {
          style: { color: K.muted, fontSize: 12, marginTop: 2, letterSpacing: 1 }
        }, "client-side only  •  " + LARP_UI_TAG),
        // Stats row
        React.createElement(View, {
          style: { flexDirection: "row", marginTop: 14, gap: 10 }
        },
          [
            { label: "Badges", value: activeBadgeCount, color: K.accent },
            { label: "Connections", value: conns.length, color: K.blue },
            { label: "Accounts", value: (storage.otherProfiles || []).length, color: K.pink }
          ].map(function (stat) {
            return React.createElement(View, {
              key: stat.label,
              style: {
                backgroundColor: K.inset, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 8,
                borderWidth: 1, borderColor: stat.color, alignItems: "center", minWidth: 80, marginHorizontal: 4
              }
            },
              React.createElement(Text, { style: { color: stat.color, fontSize: 22, fontWeight: "900" } }, String(stat.value)),
              React.createElement(Text, { style: { color: K.muted, fontSize: 11, fontWeight: "600" } }, stat.label)
            );
          })
        ),
        // Decorative flowers
        React.createElement(Text, {
          style: { fontSize: 20, marginTop: 12, letterSpacing: 6 }
        }, "🌸 💜 🌸 💜 🌸")
      ),

      // Tab bar
      tabBar,

      // Tab content
      React.createElement(View, { style: { paddingHorizontal: 14, marginTop: 8 } },
        tab === "badges"      ? badgesTab      : null,
        tab === "identity"    ? identityTab    : null,
        tab === "connections" ? connectionsTab : null,
        tab === "hide"        ? hideTab        : null
      )
    );
  }

  // ── Plugin entry ─────────────────────────────────────────────────────────
  return {
    onLoad: function () {
      larpUnpatchAll();
      try { patchUsername(); }     catch (_) {}
      try { patchBadges(); }       catch (_) {}
      try { patchBadgeIcons(); }   catch (_) {}
      try { patchConnections(); }  catch (_) {}
      try { showToast("Larp " + LARP_UI_TAG + " ✨", getAssetIDByName("Check")); } catch (_) {}
    },
    onUnload: larpUnpatchAll,
    settings: Settings
  };
})();
