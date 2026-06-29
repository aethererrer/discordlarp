(function () {
  "use strict";

  var LARP_UI_TAG = "vboss";

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

  // ── Anime girl theme colors ──────────────────────────────────────────────
  var K = {
    bg:       "#1a0a2e",
    card:     "#2d1052",
    inset:    "#1e0a3a",
    line:     "#6b21a8",
    muted:    "#d8b4fe",
    text:     "#fce7ff",
    accent:   "#f472b6",
    accent2:  "#a855f7",
    danger:   "#fb7185",
    link:     "#38bdf8",
    green:    "#86efac",
    gold:     "#fbbf24",
    header:   "#f9a8d4"
  };

  var ANIME_GIRL_URI = "https://i.imgur.com/4M34hi2.png";

  var CDN = "https://cdn.discordapp.com/badge-icons";
  var ICON_EMERALD = "11e2d339068b55d3a506cff34d3780f3";
  var ICON_RUBY = "cd5e2cfd9d7f27a8cdcd3e8a8d5dc9f4";
  var ICON_OPAL = "5b154df19c53dce2af92c9b61e6be5e2";

  var BADGES = [
    { id: "staff",                   label: "Discord Staff",            asset: "StaffBadge",                       url: CDN + "/5e74e9b61934fc1f67c65515d1f7e60d.png" },
    { id: "partner",                 label: "Discord Partner",          asset: "DiscordPartnerBadge",              url: CDN + "/3f9748e53446a137a052f3454e2de41e.png" },
    { id: "moderator",               label: "Certified Moderator",      asset: "DiscordCertifiedModeratorBadge",   url: CDN + "/fee1624003e2fee35cb398e125dc479b.png" },
    { id: "hypesquad_events",        label: "HypeSquad Events",         asset: "HypeSquadEventsBadge",             url: CDN + "/bf01d1073931f921909045f3a39fd264.png" },
    { id: "hypesquad_bravery",       label: "HypeSquad Bravery",        asset: "HypeSquadBraveryBadge",            url: CDN + "/8a88d63823d8a71cd5e390baa45efa02.png" },
    { id: "hypesquad_brilliance",    label: "HypeSquad Brilliance",     asset: "HypeSquadBrillianceBadge",         url: CDN + "/011940fd013da3f7fb926e4a1cd2e618.png" },
    { id: "hypesquad_balance",       label: "HypeSquad Balance",        asset: "HypeSquadBalanceBadge",            url: CDN + "/3aa41de486fa12454c3761e8e223442e.png" },
    { id: "bug_hunter_1",            label: "Bug Hunter Level 1",       asset: "BugHunterLevel1Badge",             url: CDN + "/2717692c7dca7289b35297368a940dd0.png" },
    { id: "bug_hunter_2",            label: "Bug Hunter Level 2",       asset: "BugHunterLevel2Badge",             url: CDN + "/848f79194d4be5ff5f81505cbd0ce1e6.png" },
    { id: "active_developer",        label: "Active Developer",         asset: "ActiveDeveloperBadge",             url: CDN + "/6bdc42827a38498929a4920da12695d9.png" },
    { id: "verified_developer",      label: "Early Verified Bot Dev",   asset: "VerifiedDeveloperBadge",           url: CDN + "/6df5892e0f35b051f8b61eace34f4967.png" },
    { id: "early_supporter",         label: "Early Supporter",          asset: "EarlySupporterBadge",              url: CDN + "/7060786766c9c840eb3019e725d2b358.png" },
    { id: "premium",                 label: "Discord Nitro",            assetCandidates: ["NitroSubscriberBadge","NitroSubscriber","PremiumSubscriberBadge","SubscriberBadge"], url: CDN + "/2ba85e8026a8614b640c2837bcdfe21b.png" },
    { id: "premium_tenure_3_month",  label: "Nitro ~3mo",               assetCandidates: ["NitroBronzeBadge","NitroBronze"], url: CDN + "/6de6d34650760ba5551a79732e98ed60.png" },
    { id: "premium_tenure_6_month",  label: "Nitro ~6mo",               assetCandidates: ["NitroSilverBadge","NitroSilver"], url: CDN + "/6de6d34650760ba5551a79732e98ed60.png" },
    { id: "premium_tenure_12_month", label: "Nitro ~12mo",              assetCandidates: ["NitroGoldBadge","NitroGold"],   url: CDN + "/d92998916f4ce6f74de7da0a37b8d740.png" },
    { id: "premium_tenure_24_month", label: "Nitro ~24mo",              assetCandidates: ["NitroPlatinumBadge","NitroPlatinum"], url: CDN + "/9d4f73ca6df09bc63a39ea84d5fd0ff5.png" },
    { id: "premium_tenure_emerald",  label: "Nitro Emerald",            assetCandidates: ["NitroEmeraldBadge","NitroEmerald"], url: CDN + "/" + ICON_EMERALD + ".png" },
    { id: "premium_tenure_ruby",     label: "Nitro Ruby",               assetCandidates: ["NitroRubyBadge","NitroRuby"],   url: CDN + "/" + ICON_RUBY + ".png" },
    { id: "premium_tenure_opal",     label: "Nitro Opal",               assetCandidates: ["NitroOpalBadge","NitroOpal"],   url: CDN + "/" + ICON_OPAL + ".png" },
    { id: "guild_boost_12",          label: "Server Boost ~12mo",       assetCandidates: ["GuildBoosterLevel6Badge","GuildBoosterBadgeTier6"], url: CDN + "/991c9f39ee33d7537d9f408c3e53141e.png" },
    { id: "guild_boost_24",          label: "Server Boost ~24mo",       assetCandidates: ["GuildBoosterLevel9Badge","GuildBoosterBadgeTier9"], url: CDN + "/ec92202290b48d0879b7413d2dde3bab.png" },
    { id: "bot_commands",            label: "Supports Commands",        asset: "BotCommandsBadge",                 url: CDN + "/6f9e37f9029ff57aef81db857890005e.png" },
    { id: "legacy_username",         label: "Legacy Username",          asset: "LegacyUsernameBadge",              url: CDN + "/6de6d34650760ba5551a79732e98ed60.png" }
  ];

  // ── Fake connections config ───────────────────────────────────────────────
  var CONNECTION_TYPES = [
    { id: "steam",    label: "Steam",    emoji: "🎮", color: "#1b2838" },
    { id: "twitch",   label: "Twitch",   emoji: "🟣", color: "#9146ff" },
    { id: "youtube",  label: "YouTube",  emoji: "▶️",  color: "#ff0000" },
    { id: "twitter",  label: "Twitter",  emoji: "🐦", color: "#1da1f2" },
    { id: "spotify",  label: "Spotify",  emoji: "🎵", color: "#1db954" },
    { id: "github",   label: "GitHub",   emoji: "🐙", color: "#ffffff" },
    { id: "reddit",   label: "Reddit",   emoji: "🤖", color: "#ff4500" },
    { id: "xbox",     label: "Xbox",     emoji: "🎯", color: "#107c10" },
    { id: "playstation", label: "PlayStation", emoji: "🎮", color: "#003791" },
    { id: "tiktok",   label: "TikTok",   emoji: "🎶", color: "#fe2c55" }
  ];

  var NITRO_LARP_ORDER = ["premium_tenure_opal","premium_tenure_ruby","premium_tenure_emerald","premium_tenure_24_month","premium_tenure_12_month","premium_tenure_6_month","premium_tenure_3_month","premium"];
  var NITRO_LARP_SET = {};
  for (var _ni = 0; _ni < NITRO_LARP_ORDER.length; _ni++) NITRO_LARP_SET[NITRO_LARP_ORDER[_ni]] = true;
  var BOOST_LARP_ORDER = ["guild_boost_24","guild_boost_12"];
  var BOOST_LARP_SET = {};
  for (var _bi0 = 0; _bi0 < BOOST_LARP_ORDER.length; _bi0++) BOOST_LARP_SET[BOOST_LARP_ORDER[_bi0]] = true;

  var LARP_BADGE_META = {};
  for (var _bi = 0; _bi < BADGES.length; _bi++) {
    var _bb = BADGES[_bi];
    LARP_BADGE_META["larp-" + _bb.id] = { uri: _bb.url, label: _bb.label };
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
      try {
        var id = getAssetIDByName(names[i]);
        var n = typeof id === "number" ? id : typeof id === "string" ? parseInt(id, 10) : NaN;
        if (!isNaN(n) && isFinite(n)) return n;
      } catch (_e) {}
    }
    return null;
  }

  function makeBadgePayload(b) {
    var idOut = "larp-" + b.id;
    if (NITRO_LARP_SET[b.id] || BOOST_LARP_SET[b.id]) return { id: idOut, description: b.label, icon: " " };
    var assetNum = firstResolvedAsset(collectAssetNames(b));
    if (assetNum != null) return { id: idOut, icon: assetNum, source: assetNum, description: b.label };
    return { id: idOut, description: b.label, icon: " " };
  }

  function getBadgesMap() { return storage.badges && typeof storage.badges === "object" ? storage.badges : {}; }
  function hasAnyBadgesInMap(bm) { if (!bm) return false; for (var k in bm) { if (bm[k]) return true; } return false; }
  function getEnabledNitroLarpId() { var bm = getBadgesMap(); for (var i = 0; i < NITRO_LARP_ORDER.length; i++) { if (bm[NITRO_LARP_ORDER[i]]) return NITRO_LARP_ORDER[i]; } return null; }
  function getEnabledBoostLarpId() { var bm = getBadgesMap(); for (var i = 0; i < BOOST_LARP_ORDER.length; i++) { if (bm[BOOST_LARP_ORDER[i]]) return BOOST_LARP_ORDER[i]; } return null; }

  function isGuildBoostBadge(b) {
    if (!b) return false;
    var id = String(b.id || "").toLowerCase();
    var desc = String(b.description || "").toLowerCase();
    return id.indexOf("guild_booster") !== -1 || id.indexOf("premium_guild") !== -1 || desc.indexOf("server boost") !== -1;
  }

  function isNativeNitroLike(b) {
    if (!b || String(b.id || "").indexOf("larp-") === 0 || isGuildBoostBadge(b)) return false;
    var id = String(b.id || "").toLowerCase();
    var desc = String(b.description || "").toLowerCase();
    return id.indexOf("premium_tenure") !== -1 || id.indexOf("nitro") !== -1 || id.indexOf("premium") !== -1 || desc.indexOf("discord nitro") !== -1;
  }

  function shouldHideNativeBadge(b) {
    if (!b || String(b.id || "").indexOf("larp-") === 0) return false;
    var h = storage.hideNative || {};
    var id = String(b.id || "").toLowerCase();
    if (h.quest && id.indexOf("quest") !== -1) return true;
    if (h.nitro && isNativeNitroLike(b)) return true;
    if (h.boost && isGuildBoostBadge(b)) return true;
    if (h.legacyUsername && id.indexOf("legacy_username") !== -1) return true;
    return false;
  }

  var unpatches = [];
  var UserStoreRef = null;
  var __larpInside = false;
  var __larpGetUserCache = new Map();

  function cachedGetUser(uid) {
    if (uid == null || !UserStoreRef) return null;
    var k = String(uid);
    if (__larpGetUserCache.has(k)) return __larpGetUserCache.get(k);
    try { var u = UserStoreRef.getUser(k); if (u) { __larpGetUserCache.set(k, u); return u; } } catch (_e) {}
    return null;
  }

  function normName(s) { if (!s) return ""; var t = s.trim(); if (t.charAt(0) === "@") t = t.slice(1); return t.toLowerCase(); }

  function parseAccountDateIsoMs(s) {
    if (!s) return null;
    var t = s.trim();
    if (!t) return null;
    var d = Date.parse(t);
    if (!isNaN(d)) return d;
    return null;
  }

  function getUsernameSpoofReplace(user) {
    if (!user) return null;
    var pun = normName(user.username || "");
    if (!pun) return null;
    if (normName(storage.matchUsername || "") === pun && (storage.replaceUsername || "").trim()) return (storage.replaceUsername || "").trim();
    var others = storage.otherProfiles || [];
    for (var i = 0; i < others.length; i++) {
      var op = others[i] || {};
      if (normName(op.matchUsername || "") === pun && (op.replaceUsername || "").trim()) return (op.replaceUsername || "").trim();
    }
    return null;
  }

  var wrapProxyByUser = new WeakMap();

  function buildUserProxy(user) {
    var prev = wrapProxyByUser.get(user);
    if (prev) return prev;
    var proxy = new Proxy(user, {
      get: function (t, p, recv) {
        var spoofMs = parseAccountDateIsoMs(storage.spoofAccountDateIso);
        var cur = UserStoreRef && UserStoreRef.getCurrentUser && UserStoreRef.getCurrentUser();
        if (spoofMs != null && cur && t.id != null && String(t.id) === String(cur.id)) {
          if (p === "createdTimestamp" || p === "createdAtTimestamp") return spoofMs;
          if (p === "createdAt" || p === "created_at") return new Date(spoofMs);
        }
        var replace = getUsernameSpoofReplace(t);
        if (!replace) return Reflect.get(t, p, recv);
        if (p === "username") return replace;
        return Reflect.get(t, p, recv);
      },
      getOwnPropertyDescriptor: function (t, p) {
        var replace = getUsernameSpoofReplace(t);
        if (replace && p === "username") return { configurable: true, enumerable: true, value: replace };
        return Reflect.getOwnPropertyDescriptor(t, p);
      },
      ownKeys: function (t) { return Reflect.ownKeys(t); }
    });
    wrapProxyByUser.set(user, proxy);
    return proxy;
  }

  function wrap(user) {
    if (!user) return user;
    var replace = getUsernameSpoofReplace(user);
    var spoofMs = parseAccountDateIsoMs(storage.spoofAccountDateIso);
    var cur = UserStoreRef && UserStoreRef.getCurrentUser && UserStoreRef.getCurrentUser();
    var isCurrentUser = cur && user.id != null && String(user.id) === String(cur.id);
    if (!replace && !(spoofMs != null && isCurrentUser)) return user;
    return buildUserProxy(user);
  }

  function larpUnpatchAll() {
    for (var i = 0; i < unpatches.length; i++) { try { unpatches[i](); } catch (_e) {} }
    unpatches = [];
    __larpGetUserCache.clear();
    wrapProxyByUser = new WeakMap();
  }

  function patchUsername() {
    try {
      var UserStore = findByStoreName("UserStore");
      UserStoreRef = UserStore || null;
      if (!UserStore) return;
      unpatches.push(after("getCurrentUser", UserStore, function (_a, ret) {
        if (__larpInside) return ret;
        __larpInside = true;
        try { return wrap(ret); } finally { __larpInside = false; }
      }));
      unpatches.push(after("getUser", UserStore, function (_a, ret) {
        if (__larpInside) return ret;
        __larpInside = true;
        try { return wrap(ret); } finally { __larpInside = false; }
      }));
    } catch (e) { console.error("[Larp] patchUsername failed", e); }
  }

  function patchBadges() {
    try {
      var mod = findByName("useBadges", false);
      if (!mod) return;
      var hookKey = typeof mod.default === "function" ? "default" : typeof mod.useBadges === "function" ? "useBadges" : null;
      if (!hookKey) return;
      unpatches.push(after(hookKey, mod, function (args, ret) {
        if (!ret || !Array.isArray(ret)) return ret;
        var bm = getBadgesMap();
        if (!hasAnyBadgesInMap(bm)) {
          return ret.filter(function (x) { return !shouldHideNativeBadge(x); });
        }
        var base = ret.filter(function (x) { return !x || !String(x.id || "").startsWith("larp-"); });
        var nitroPick = getEnabledNitroLarpId();
        var boostPick = getEnabledBoostLarpId();
        if (nitroPick) base = base.filter(function (x) { return !isNativeNitroLike(x); });
        if (boostPick) base = base.filter(function (x) { return !isGuildBoostBadge(x); });
        base = base.filter(function (x) { return !shouldHideNativeBadge(x); });
        var additions = [];
        for (var i = 0; i < BADGES.length; i++) {
          var b = BADGES[i];
          if (!bm[b.id]) continue;
          if (NITRO_LARP_SET[b.id] && b.id !== nitroPick) continue;
          if (BOOST_LARP_SET[b.id] && b.id !== boostPick) continue;
          additions.push(makeBadgePayload(b));
        }
        return additions.concat(base);
      }));
    } catch (e) { console.error("[Larp] patchBadges failed", e); }
  }

  function patchBadgeIcons() {
    try {
      var jsxRuntime = findByProps("jsx", "jsxs");
      if (!jsxRuntime) return;
      function onJsx(args, ret) {
        if (!ret || !ret.props) return ret;
        var Type = args[0];
        if (typeof Type !== "function") return ret;
        var n = Type.displayName || Type.name || "";
        if (n !== "ProfileBadge" && n !== "RenderedBadge") return ret;
        var id = ret.props.id;
        if (typeof id !== "string") return ret;
        var meta = LARP_BADGE_META[id];
        if (!meta) return ret;
        ret.props.source = { uri: meta.uri };
        if (ret.props.description == null || ret.props.description === "") ret.props.description = meta.label;
        return ret;
      }
      unpatches.push(after("jsx", jsxRuntime, onJsx));
      unpatches.push(after("jsxs", jsxRuntime, onJsx));
    } catch (e) { console.error("[Larp] patchBadgeIcons failed", e); }
  }

  // ── Connections spoofing ─────────────────────────────────────────────────
  function patchConnections() {
    try {
      var stores = ["UserProfileStore", "UserProfileStoreV2", "ConnectedAccountsStore"];
      for (var si = 0; si < stores.length; si++) {
        (function(storeName) {
          try {
            var S = findByStoreName(storeName);
            if (!S) return;
            var methods = ["getConnectedAccounts", "getUserProfile", "getProfile"];
            for (var mi = 0; mi < methods.length; mi++) {
              (function(method) {
                if (typeof S[method] !== "function") return;
                unpatches.push(after(method, S, function (args, ret) {
                  var conns = storage.fakeConnections;
                  if (!Array.isArray(conns) || conns.length === 0) return ret;
                  var fakeAccounts = conns.map(function (c) {
                    return {
                      type: c.type || "steam",
                      id: c.username || "user",
                      name: c.username || "user",
                      verified: true,
                      visibility: 1,
                      friend_sync: false,
                      show_activity: true,
                      two_way_link: false,
                      metadata_visibility: 1,
                      integrations: []
                    };
                  });
                  if (method === "getConnectedAccounts") {
                    var existing = Array.isArray(ret) ? ret : [];
                    return fakeAccounts.concat(existing);
                  }
                  if (ret && typeof ret === "object") {
                    var existing2 = Array.isArray(ret.connectedAccounts) ? ret.connectedAccounts : [];
                    return Object.assign({}, ret, { connectedAccounts: fakeAccounts.concat(existing2) });
                  }
                  return ret;
                }));
              })(methods[mi]);
            }
          } catch (_e) {}
        })(stores[si]);
      }
    } catch (e) { console.error("[Larp] patchConnections failed", e); }
  }

  // ── Anime Girl Settings UI ───────────────────────────────────────────────
  function Settings() {
    var s = React.useState(0);
    var force = s[1];
    var activeTab = React.useState("badges");
    var tab = activeTab[0];
    var setTab = activeTab[1];

    function refresh() {
      __larpGetUserCache.clear();
      force(function (n) { return n + 1; });
      try {
        var us = findByStoreName("UserStore");
        if (us && typeof us.emitChange === "function") us.emitChange();
      } catch (_) {}
    }

    function Card(props) {
      return React.createElement(View, {
        style: {
          backgroundColor: K.card,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: K.line,
          marginBottom: 12,
          overflow: "hidden",
          shadowColor: K.accent,
          shadowOpacity: 0.3,
          shadowRadius: 8
        }
      }, props.children);
    }

    function SectionTitle(props) {
      return React.createElement(View, {
        style: { flexDirection: "row", alignItems: "center", paddingHorizontal: 14, paddingTop: 12, paddingBottom: 6 }
      },
        React.createElement(Text, { style: { color: K.accent, fontSize: 11, fontWeight: "700", letterSpacing: 1, textTransform: "uppercase" } }, props.title),
        props.badge ? React.createElement(View, {
          style: { backgroundColor: K.accent, borderRadius: 99, paddingHorizontal: 7, paddingVertical: 1, marginLeft: 8 }
        }, React.createElement(Text, { style: { color: "#fff", fontSize: 10, fontWeight: "800" } }, props.badge)) : null
      );
    }

    function InputRow(props) {
      return React.createElement(View, {
        style: { paddingHorizontal: 14, paddingVertical: 8, borderTopWidth: props.first ? 0 : 1, borderTopColor: K.line }
      },
        React.createElement(Text, { style: { color: K.muted, fontSize: 11, fontWeight: "600", marginBottom: 5 } }, props.label),
        React.createElement(TextInput, {
          style: {
            backgroundColor: K.inset,
            color: K.text,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: K.line,
            paddingHorizontal: 12,
            paddingVertical: 9,
            fontSize: 14
          },
          placeholder: props.placeholder || props.label,
          placeholderTextColor: "#7c3aed",
          value: props.value || "",
          autoCorrect: false,
          autoCapitalize: "none",
          onChangeText: props.onChange
        })
      );
    }

    function Toggle(props) {
      var on = props.value;
      return React.createElement(Pressable, {
        onPress: props.onPress,
        style: {
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 14,
          paddingVertical: 11,
          borderTopWidth: props.first ? 0 : 1,
          borderTopColor: K.line
        }
      },
        React.createElement(View, {
          style: {
            width: 38, height: 22, borderRadius: 11,
            backgroundColor: on ? K.accent : K.inset,
            borderWidth: 1, borderColor: on ? K.accent : K.line,
            justifyContent: "center", paddingHorizontal: 2,
            alignItems: on ? "flex-end" : "flex-start"
          }
        },
          React.createElement(View, { style: { width: 16, height: 16, borderRadius: 8, backgroundColor: on ? "#fff" : K.muted } })
        ),
        React.createElement(Text, { style: { color: K.text, fontSize: 14, marginLeft: 10, flex: 1 } }, props.label),
        on ? React.createElement(Text, { style: { color: K.accent, fontSize: 12 } }, "ON") : null
      );
    }

    // Tab bar
    var tabs = [
      { id: "badges",      label: "✨ Badges" },
      { id: "identity",    label: "🌸 Identity" },
      { id: "connections", label: "🔗 Connections" },
      { id: "hide",        label: "🙈 Hide" }
    ];

    var tabBar = React.createElement(ScrollView, {
      horizontal: true,
      showsHorizontalScrollIndicator: false,
      style: { marginBottom: 12 },
      contentContainerStyle: { paddingHorizontal: 16, paddingVertical: 4, gap: 8 }
    },
      tabs.map(function (t) {
        var active = tab === t.id;
        return React.createElement(Pressable, {
          key: t.id,
          onPress: function () { setTab(t.id); },
          style: {
            paddingHorizontal: 14,
            paddingVertical: 8,
            borderRadius: 99,
            backgroundColor: active ? K.accent : K.card,
            borderWidth: 1,
            borderColor: active ? K.accent : K.line,
            marginRight: 8
          }
        },
          React.createElement(Text, {
            style: { color: active ? "#fff" : K.muted, fontWeight: active ? "700" : "400", fontSize: 13 }
          }, t.label)
        );
      })
    );

    // ── BADGES TAB ──────────────────────────────────────────────────────────
    var badgesTab = React.createElement(View, null,
      React.createElement(Card, null,
        React.createElement(SectionTitle, { title: "Fake Badges", badge: Object.keys(getBadgesMap()).filter(function(k){return getBadgesMap()[k];}).length || null }),
        BADGES.map(function (b, i) {
          var on = !!storage.badges[b.id];
          return React.createElement(Pressable, {
            key: b.id,
            onPress: function () {
              if (NITRO_LARP_SET[b.id] && !on) {
                for (var k in NITRO_LARP_SET) storage.badges[k] = false;
              }
              if (BOOST_LARP_SET[b.id] && !on) {
                for (var k2 in BOOST_LARP_SET) storage.badges[k2] = false;
              }
              storage.badges[b.id] = !on;
              refresh();
            },
            style: {
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 14,
              paddingVertical: 10,
              borderTopWidth: i === 0 ? 0 : 1,
              borderTopColor: K.line,
              backgroundColor: on ? "#3b0764" : "transparent"
            }
          },
            React.createElement(View, {
              style: {
                width: 28, height: 28, borderRadius: 14,
                backgroundColor: on ? K.accent : K.inset,
                alignItems: "center", justifyContent: "center", marginRight: 10
              }
            },
              React.createElement(Text, { style: { fontSize: 14 } }, on ? "✓" : "")
            ),
            React.createElement(Text, { style: { color: on ? K.text : K.muted, fontSize: 14, flex: 1 } }, b.label),
            on ? React.createElement(Text, { style: { color: K.accent, fontSize: 11 } }, "active") : null
          );
        })
      )
    );

    // ── IDENTITY TAB ────────────────────────────────────────────────────────
    var identityTab = React.createElement(View, null,
      React.createElement(Card, null,
        React.createElement(SectionTitle, { title: "Username Spoof" }),
        InputRow({ label: "Match username (without @)", value: storage.matchUsername, first: true, onChange: function(v){ storage.matchUsername = v; refresh(); } }),
        InputRow({ label: "Display as @handle", value: storage.replaceUsername, onChange: function(v){ storage.replaceUsername = v; refresh(); } })
      ),
      React.createElement(Card, null,
        React.createElement(SectionTitle, { title: "Account Age" }),
        InputRow({ label: "Created at (YYYY-MM-DD)", placeholder: "e.g. 2015-05-13", value: storage.spoofAccountDateIso, first: true, onChange: function(v){ storage.spoofAccountDateIso = v; refresh(); } })
      ),
      React.createElement(Card, null,
        React.createElement(SectionTitle, { title: "Other Accounts" }),
        (storage.otherProfiles || []).map(function (op, oi) {
          if (!op || typeof op !== "object") return null;
          if (typeof op.badges !== "object" || op.badges === null) op.badges = {};
          return React.createElement(View, { key: "op-" + oi, style: { borderTopWidth: oi > 0 ? 1 : 0, borderTopColor: K.line } },
            React.createElement(Text, { style: { color: K.header, fontWeight: "700", fontSize: 13, paddingHorizontal: 14, paddingTop: 10 } }, "Account " + (oi + 1)),
            InputRow({ label: "User ID (optional)", value: op.userId || "", first: true, onChange: function(v){ op.userId = v; refresh(); } }),
            InputRow({ label: "Match username", value: op.matchUsername || "", onChange: function(v){ op.matchUsername = v; refresh(); } }),
            InputRow({ label: "Replace @handle", value: op.replaceUsername || "", onChange: function(v){ op.replaceUsername = v; refresh(); } }),
            React.createElement(Pressable, {
              onPress: function(){ storage.otherProfiles.splice(oi, 1); refresh(); },
              style: { paddingVertical: 10, alignItems: "center", borderTopWidth: 1, borderTopColor: K.line }
            }, React.createElement(Text, { style: { color: K.danger, fontWeight: "600", fontSize: 13 } }, "🗑️ Remove"))
          );
        }),
        React.createElement(Pressable, {
          onPress: function(){ storage.otherProfiles.push({ userId: "", matchUsername: "", replaceUsername: "", badges: {} }); refresh(); },
          style: { paddingVertical: 13, alignItems: "center", borderTopWidth: (storage.otherProfiles || []).length ? 1 : 0, borderTopColor: K.line }
        }, React.createElement(Text, { style: { color: K.link, fontWeight: "600", fontSize: 14 } }, "+ Add Account"))
      )
    );

    // ── CONNECTIONS TAB ─────────────────────────────────────────────────────
    var conns = storage.fakeConnections || [];
    var connectionsTab = React.createElement(View, null,
      React.createElement(Card, null,
        React.createElement(SectionTitle, { title: "Fake Connections", badge: conns.length || null }),
        conns.length === 0 ? React.createElement(Text, {
          style: { color: K.muted, fontSize: 13, padding: 14, textAlign: "center" }
        }, "No fake connections yet\nTap + to add one 🌸") : null,
        conns.map(function (c, ci) {
          var ct = CONNECTION_TYPES.find(function(x){ return x.id === c.type; }) || CONNECTION_TYPES[0];
          return React.createElement(View, {
            key: "conn-" + ci,
            style: { borderTopWidth: ci === 0 ? 0 : 1, borderTopColor: K.line }
          },
            React.createElement(View, {
              style: { flexDirection: "row", alignItems: "center", paddingHorizontal: 14, paddingTop: 10, paddingBottom: 4 }
            },
              React.createElement(Text, { style: { fontSize: 18, marginRight: 8 } }, ct.emoji),
              React.createElement(Text, { style: { color: K.header, fontWeight: "700", fontSize: 13, flex: 1 } }, ct.label + " Connection"),
              React.createElement(Pressable, {
                onPress: function(){ conns.splice(ci, 1); refresh(); },
                style: { padding: 6 }
              }, React.createElement(Text, { style: { color: K.danger, fontSize: 13 } }, "✕"))
            ),
            React.createElement(View, { style: { paddingHorizontal: 14, paddingBottom: 6 } },
              React.createElement(Text, { style: { color: K.muted, fontSize: 11, fontWeight: "600", marginBottom: 4 } }, "Platform"),
              React.createElement(ScrollView, {
                horizontal: true, showsHorizontalScrollIndicator: false,
                contentContainerStyle: { gap: 6, paddingBottom: 4 }
              },
                CONNECTION_TYPES.map(function (ct2) {
                  var sel = c.type === ct2.id;
                  return React.createElement(Pressable, {
                    key: ct2.id,
                    onPress: function(){ c.type = ct2.id; refresh(); },
                    style: {
                      paddingHorizontal: 12, paddingVertical: 6, borderRadius: 99, marginRight: 6,
                      backgroundColor: sel ? K.accent : K.inset,
                      borderWidth: 1, borderColor: sel ? K.accent : K.line
                    }
                  }, React.createElement(Text, { style: { color: sel ? "#fff" : K.muted, fontSize: 12 } }, ct2.emoji + " " + ct2.label));
                })
              ),
              React.createElement(Text, { style: { color: K.muted, fontSize: 11, fontWeight: "600", marginTop: 8, marginBottom: 4 } }, "Username / Handle"),
              React.createElement(TextInput, {
                style: {
                  backgroundColor: K.inset, color: K.text, borderRadius: 10,
                  borderWidth: 1, borderColor: K.line, paddingHorizontal: 12, paddingVertical: 8, fontSize: 14
                },
                placeholder: "your_username",
                placeholderTextColor: "#7c3aed",
                value: c.username || "",
                autoCorrect: false, autoCapitalize: "none",
                onChangeText: function(v){ c.username = v; refresh(); }
              })
            )
          );
        }),
        React.createElement(Pressable, {
          onPress: function(){ storage.fakeConnections.push({ type: "steam", username: "" }); refresh(); },
          style: {
            paddingVertical: 13, alignItems: "center",
            borderTopWidth: conns.length ? 1 : 0, borderTopColor: K.line
          }
        }, React.createElement(Text, { style: { color: K.link, fontWeight: "600", fontSize: 14 } }, "+ Add Connection"))
      )
    );

    // ── HIDE TAB ────────────────────────────────────────────────────────────
    var hideTab = React.createElement(View, null,
      React.createElement(Card, null,
        React.createElement(SectionTitle, { title: "Hide Native Badges" }),
        Toggle({ label: "Hide Quest badge",           value: !!storage.hideNative.quest,         first: true, onPress: function(){ storage.hideNative.quest = !storage.hideNative.quest; refresh(); } }),
        Toggle({ label: "Hide Orb badge",             value: !!storage.hideNative.orb,           onPress: function(){ storage.hideNative.orb = !storage.hideNative.orb; refresh(); } }),
        Toggle({ label: "Hide Nitro / tenure",        value: !!storage.hideNative.nitro,         onPress: function(){ storage.hideNative.nitro = !storage.hideNative.nitro; refresh(); } }),
        Toggle({ label: "Hide Server Boost",          value: !!storage.hideNative.boost,         onPress: function(){ storage.hideNative.boost = !storage.hideNative.boost; refresh(); } }),
        Toggle({ label: "Hide Orb balance row",       value: !!storage.hideNative.orbBalance,    onPress: function(){ storage.hideNative.orbBalance = !storage.hideNative.orbBalance; refresh(); } }),
        Toggle({ label: "Hide Level leaf",            value: !!storage.hideNative.levelLeaf,     onPress: function(){ storage.hideNative.levelLeaf = !storage.hideNative.levelLeaf; refresh(); } }),
        Toggle({ label: "Hide Legacy username badge", value: !!storage.hideNative.legacyUsername, onPress: function(){ storage.hideNative.legacyUsername = !storage.hideNative.legacyUsername; refresh(); } })
      ),
      React.createElement(Card, null,
        React.createElement(SectionTitle, { title: "Hide by Badge ID substring" }),
        InputRow({ label: "ID fragments (space/comma separated)", value: storage.hideNative.idSubstrings, first: true, onChange: function(v){ storage.hideNative.idSubstrings = v; refresh(); } })
      ),
      React.createElement(Pressable, {
        onPress: function(){ storage.badges = {}; refresh(); try { showToast("Cleared all badges ✨", getAssetIDByName("trash")); } catch(_){} },
        style: { paddingVertical: 13, alignItems: "center", backgroundColor: "#3b0764", borderRadius: 16, borderWidth: 1, borderColor: K.danger }
      }, React.createElement(Text, { style: { color: K.danger, fontWeight: "700", fontSize: 14 } }, "🗑️ Clear All Fake Badges"))
    );

    // ── Main render ─────────────────────────────────────────────────────────
    return React.createElement(ScrollView, {
      style: { flex: 1, backgroundColor: K.bg },
      contentContainerStyle: { paddingBottom: 80 }
    },
      // Anime girl header
      React.createElement(View, {
        style: {
          alignItems: "center",
          paddingVertical: 20,
          backgroundColor: K.card,
          borderBottomWidth: 1,
          borderBottomColor: K.line,
          marginBottom: 16
        }
      },
        React.createElement(Image, {
          source: { uri: ANIME_GIRL_URI },
          style: { width: 90, height: 90, borderRadius: 45, borderWidth: 3, borderColor: K.accent, marginBottom: 10 },
          resizeMode: "cover"
        }),
        React.createElement(Text, {
          style: { color: K.accent, fontSize: 22, fontWeight: "800", letterSpacing: 1 }
        }, "✨ Larp ✨"),
        React.createElement(Text, {
          style: { color: K.muted, fontSize: 12, marginTop: 2 }
        }, "client-side only  •  " + LARP_UI_TAG),
        React.createElement(View, {
          style: { flexDirection: "row", marginTop: 8, gap: 6 }
        },
          React.createElement(Text, { style: { fontSize: 16 } }, "🌸"),
          React.createElement(Text, { style: { fontSize: 16 } }, "💜"),
          React.createElement(Text, { style: { fontSize: 16 } }, "🌸")
        )
      ),

      // Tab bar
      React.createElement(View, { style: { paddingHorizontal: 0 } }, tabBar),

      // Tab content
      React.createElement(View, { style: { paddingHorizontal: 14 } },
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
      try { patchUsername(); }     catch (_e) {}
      try { patchBadges(); }       catch (_e) {}
      try { patchBadgeIcons(); }   catch (_e) {}
      try { patchConnections(); }  catch (_e) {}
      try { showToast("Larp " + LARP_UI_TAG + " loaded ✨", getAssetIDByName("Check")); } catch (_) {}
    },
    onUnload: function () {
      larpUnpatchAll();
    },
    settings: Settings
  };
})();
