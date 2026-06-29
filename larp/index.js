(function () {
  "use strict";

  var LARP_UI_TAG = "v14.0.0";
  // Free to use anime girl beach image (Pixabay license)
  var ANIME_GIRL_URL = "https://cdn.pixabay.com/photo/2022/04/06/10/03/anime-7114787_640.jpg";

  var React = vendetta.metro.common.React;
  var RN = vendetta.metro.common.ReactNative;
  var View = RN.View;
  var Text = RN.Text;
  var TextInput = RN.TextInput;
  var ScrollView = RN.ScrollView;
  var Image = RN.Image;
  var Pressable = RN.Pressable || RN.TouchableOpacity;
  var useState = React.useState;
  var useRef = React.useRef;
  var useCallback = React.useCallback;

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
    bg:       "#0a0015",
    card:     "#130025",
    card2:    "#1c003a",
    inset:    "#0d001e",
    line:     "#6d28d9",
    lineSoft: "#2e1065",
    muted:    "#a78bfa",
    text:     "#f3e8ff",
    accent:   "#d946ef",
    pink:     "#f472b6",
    blue:     "#38bdf8",
    danger:   "#f43f5e",
    green:    "#34d399",
    gold:     "#fbbf24",
    white:    "#ffffff",
    inputBg:  "#160030",
    inputBorder: "#7c3aed"
  };

  var CDN = "https://cdn.discordapp.com/badge-icons";
  var BADGES = [
    { id: "staff",                   label: "Discord Staff",        url: CDN+"/5e74e9b61934fc1f67c65515d1f7e60d.png", asset: "StaffBadge",                    emoji: "🛡️" },
    { id: "partner",                 label: "Discord Partner",      url: CDN+"/3f9748e53446a137a052f3454e2de41e.png", asset: "DiscordPartnerBadge",            emoji: "🤝" },
    { id: "moderator",               label: "Certified Mod",        url: CDN+"/fee1624003e2fee35cb398e125dc479b.png", asset: "DiscordCertifiedModeratorBadge", emoji: "🔨" },
    { id: "hypesquad_events",        label: "HypeSquad Events",     url: CDN+"/bf01d1073931f921909045f3a39fd264.png", asset: "HypeSquadEventsBadge",           emoji: "🎪" },
    { id: "hypesquad_bravery",       label: "HypeSquad Bravery",    url: CDN+"/8a88d63823d8a71cd5e390baa45efa02.png", asset: "HypeSquadBraveryBadge",          emoji: "🟣" },
    { id: "hypesquad_brilliance",    label: "HypeSquad Brilliance", url: CDN+"/011940fd013da3f7fb926e4a1cd2e618.png", asset: "HypeSquadBrillianceBadge",       emoji: "🔴" },
    { id: "hypesquad_balance",       label: "HypeSquad Balance",    url: CDN+"/3aa41de486fa12454c3761e8e223442e.png", asset: "HypeSquadBalanceBadge",          emoji: "🟡" },
    { id: "bug_hunter_1",            label: "Bug Hunter Lv1",       url: CDN+"/2717692c7dca7289b35297368a940dd0.png", asset: "BugHunterLevel1Badge",           emoji: "🐛" },
    { id: "bug_hunter_2",            label: "Bug Hunter Lv2",       url: CDN+"/848f79194d4be5ff5f81505cbd0ce1e6.png", asset: "BugHunterLevel2Badge",           emoji: "🐞" },
    { id: "active_developer",        label: "Active Developer",     url: CDN+"/6bdc42827a38498929a4920da12695d9.png", asset: "ActiveDeveloperBadge",           emoji: "💻" },
    { id: "verified_developer",      label: "Verified Bot Dev",     url: CDN+"/6df5892e0f35b051f8b61eace34f4967.png", asset: "VerifiedDeveloperBadge",         emoji: "✅" },
    { id: "early_supporter",         label: "Early Supporter",      url: CDN+"/7060786766c9c840eb3019e725d2b358.png", asset: "EarlySupporterBadge",            emoji: "💜" },
    { id: "premium",                 label: "Discord Nitro",        url: CDN+"/2ba85e8026a8614b640c2837bcdfe21b.png", assetCandidates: ["NitroSubscriberBadge","NitroSubscriber","PremiumSubscriberBadge"], emoji: "💎" },
    { id: "premium_tenure_3_month",  label: "Nitro 3mo",            url: CDN+"/6de6d34650760ba5551a79732e98ed60.png", assetCandidates: ["NitroBronzeBadge","NitroBronze"],     emoji: "🥉" },
    { id: "premium_tenure_6_month",  label: "Nitro 6mo",            url: CDN+"/6de6d34650760ba5551a79732e98ed60.png", assetCandidates: ["NitroSilverBadge","NitroSilver"],     emoji: "🥈" },
    { id: "premium_tenure_12_month", label: "Nitro 12mo",           url: CDN+"/d92998916f4ce6f74de7da0a37b8d740.png", assetCandidates: ["NitroGoldBadge","NitroGold"],         emoji: "🥇" },
    { id: "premium_tenure_24_month", label: "Nitro 24mo",           url: CDN+"/9d4f73ca6df09bc63a39ea84d5fd0ff5.png", assetCandidates: ["NitroPlatinumBadge","NitroPlatinum"], emoji: "💠" },
    { id: "premium_tenure_emerald",  label: "Nitro Emerald",        url: CDN+"/11e2d339068b55d3a506cff34d3780f3.png", assetCandidates: ["NitroEmeraldBadge","NitroEmerald"],   emoji: "💚" },
    { id: "premium_tenure_ruby",     label: "Nitro Ruby",           url: CDN+"/cd5e2cfd9d7f27a8cdcd3e8a8d5dc9f4.png", assetCandidates: ["NitroRubyBadge","NitroRuby"],         emoji: "❤️" },
    { id: "premium_tenure_opal",     label: "Nitro Opal",           url: CDN+"/5b154df19c53dce2af92c9b61e6be5e2.png", assetCandidates: ["NitroOpalBadge","NitroOpal"],         emoji: "🌈" },
    { id: "guild_boost_12",          label: "Server Boost 12mo",    url: CDN+"/991c9f39ee33d7537d9f408c3e53141e.png", assetCandidates: ["GuildBoosterLevel6Badge"],            emoji: "🚀" },
    { id: "guild_boost_24",          label: "Server Boost 24mo",    url: CDN+"/ec92202290b48d0879b7413d2dde3bab.png", assetCandidates: ["GuildBoosterLevel9Badge"],            emoji: "🌟" },
    { id: "legacy_username",         label: "Legacy Username",      url: CDN+"/6de6d34650760ba5551a79732e98ed60.png", asset: "LegacyUsernameBadge",            emoji: "🏷️" }
  ];

  var CONNECTION_TYPES = [
    { id: "steam",       label: "Steam",        emoji: "🎮" },
    { id: "twitch",      label: "Twitch",        emoji: "🟣" },
    { id: "youtube",     label: "YouTube",       emoji: "▶️"  },
    { id: "twitter",     label: "Twitter/X",     emoji: "🐦" },
    { id: "spotify",     label: "Spotify",       emoji: "🎵" },
    { id: "github",      label: "GitHub",        emoji: "🐙" },
    { id: "reddit",      label: "Reddit",        emoji: "🤖" },
    { id: "xbox",        label: "Xbox",          emoji: "🎯" },
    { id: "playstation", label: "PlayStation",   emoji: "🕹️" },
    { id: "tiktok",      label: "TikTok",        emoji: "🎶" },
    { id: "instagram",   label: "Instagram",     emoji: "📸" },
    { id: "crunchyroll", label: "Crunchyroll",   emoji: "🍥" }
  ];

  var NITRO_ORDER = ["premium_tenure_opal","premium_tenure_ruby","premium_tenure_emerald","premium_tenure_24_month","premium_tenure_12_month","premium_tenure_6_month","premium_tenure_3_month","premium"];
  var BOOST_ORDER = ["guild_boost_24","guild_boost_12"];
  var NITRO_SET = {}; var BOOST_SET = {};
  for (var _i=0;_i<NITRO_ORDER.length;_i++) NITRO_SET[NITRO_ORDER[_i]]=true;
  for (var _j=0;_j<BOOST_ORDER.length;_j++) BOOST_SET[BOOST_ORDER[_j]]=true;

  var LARP_BADGE_META = {};
  for (var _b=0;_b<BADGES.length;_b++) LARP_BADGE_META["larp-"+BADGES[_b].id]={uri:BADGES[_b].url,label:BADGES[_b].label};

  function collectAssets(b){var o=[];if(b.assetCandidates)for(var i=0;i<b.assetCandidates.length;i++)o.push(b.assetCandidates[i]);if(b.asset)o.push(b.asset);return o;}
  function firstAsset(names){if(!names||!names.length)return null;for(var i=0;i<names.length;i++){try{var id=getAssetIDByName(names[i]);var n=typeof id==="number"?id:parseInt(id,10);if(!isNaN(n))return n;}catch(_){}}return null;}
  function makeBadge(b){var id="larp-"+b.id;if(NITRO_SET[b.id]||BOOST_SET[b.id])return{id:id,description:b.label,icon:" "};var a=firstAsset(collectAssets(b));if(a!=null)return{id:id,icon:a,source:a,description:b.label};return{id:id,description:b.label,icon:" "};}
  function getBM(){return storage.badges&&typeof storage.badges==="object"?storage.badges:{};}
  function hasAny(bm){for(var k in bm){if(bm[k])return true;}return false;}
  function getNitro(){var bm=getBM();for(var i=0;i<NITRO_ORDER.length;i++)if(bm[NITRO_ORDER[i]])return NITRO_ORDER[i];return null;}
  function getBoost(){var bm=getBM();for(var i=0;i<BOOST_ORDER.length;i++)if(bm[BOOST_ORDER[i]])return BOOST_ORDER[i];return null;}
  function isBoost(b){if(!b)return false;var id=String(b.id||"").toLowerCase();return id.indexOf("guild_booster")!==-1||id.indexOf("premium_guild")!==-1||String(b.description||"").toLowerCase().indexOf("server boost")!==-1;}
  function isNitro(b){if(!b||String(b.id||"").indexOf("larp-")===0||isBoost(b))return false;var id=String(b.id||"").toLowerCase();return id.indexOf("premium_tenure")!==-1||id.indexOf("nitro")!==-1||id.indexOf("premium")!==-1;}
  function shouldHide(b){
    if(!b||String(b.id||"").indexOf("larp-")===0)return false;
    var h=storage.hideNative||{};var id=String(b.id||"").toLowerCase();
    if(h.quest&&id.indexOf("quest")!==-1)return true;
    if(h.nitro&&isNitro(b))return true;
    if(h.boost&&isBoost(b))return true;
    if(h.legacyUsername&&id.indexOf("legacy_username")!==-1)return true;
    var raw=String(h.idSubstrings||"").trim().toLowerCase();
    if(raw){var parts=raw.split(/[\s,;]+/);for(var p=0;p<parts.length;p++){if(parts[p]&&id.indexOf(parts[p])!==-1)return true;}}
    return false;
  }
  function normName(s){if(!s)return"";var t=s.trim();if(t[0]==="@")t=t.slice(1);return t.toLowerCase();}
  function parseMs(s){if(!s)return null;var d=Date.parse(s.trim());return isNaN(d)?null:d;}
  function getSpoofReplace(user){
    if(!user)return null;var pun=normName(user.username||"");if(!pun)return null;
    if(normName(storage.matchUsername)===pun&&(storage.replaceUsername||"").trim())return storage.replaceUsername.trim();
    var others=storage.otherProfiles||[];
    for(var i=0;i<others.length;i++){var op=others[i]||{};if(normName(op.matchUsername||"")===pun&&(op.replaceUsername||"").trim())return op.replaceUsername.trim();}
    return null;
  }
  var wrapCache=new WeakMap();
  function buildProxy(user){
    if(wrapCache.has(user))return wrapCache.get(user);
    var proxy=new Proxy(user,{
      get:function(t,p,recv){
        var ms=parseMs(storage.spoofAccountDateIso);var cur=UserStoreRef&&UserStoreRef.getCurrentUser&&UserStoreRef.getCurrentUser();
        if(ms&&cur&&t.id&&String(t.id)===String(cur.id)){if(p==="createdTimestamp"||p==="createdAtTimestamp")return ms;if(p==="createdAt"||p==="created_at")return new Date(ms);}
        var rep=getSpoofReplace(t);if(rep&&p==="username")return rep;
        return Reflect.get(t,p,recv);
      },
      getOwnPropertyDescriptor:function(t,p){var rep=getSpoofReplace(t);if(rep&&p==="username")return{configurable:true,enumerable:true,value:rep};return Reflect.getOwnPropertyDescriptor(t,p);},
      ownKeys:function(t){return Reflect.ownKeys(t);}
    });
    wrapCache.set(user,proxy);return proxy;
  }
  function wrap(user){
    if(!user)return user;
    var rep=getSpoofReplace(user);var ms=parseMs(storage.spoofAccountDateIso);
    var cur=UserStoreRef&&UserStoreRef.getCurrentUser&&UserStoreRef.getCurrentUser();
    if(!rep&&!(ms&&cur&&user.id&&String(user.id)===String(cur.id)))return user;
    return buildProxy(user);
  }
  var unpatches=[];var UserStoreRef=null;var __inside=false;
  function larpUnpatchAll(){for(var i=0;i<unpatches.length;i++){try{unpatches[i]();}catch(_){}}unpatches=[];wrapCache=new WeakMap();}
  function patchUsername(){
    try{var US=findByStoreName("UserStore");UserStoreRef=US||null;if(!US)return;
    unpatches.push(after("getCurrentUser",US,function(_a,ret){if(__inside)return ret;__inside=true;try{return wrap(ret);}finally{__inside=false;}}));
    unpatches.push(after("getUser",US,function(_a,ret){if(__inside)return ret;__inside=true;try{return wrap(ret);}finally{__inside=false;}}));}catch(e){}
  }
  function patchBadges(){
    try{var mod=findByName("useBadges",false);if(!mod)return;
    var key=typeof mod.default==="function"?"default":typeof mod.useBadges==="function"?"useBadges":null;if(!key)return;
    unpatches.push(after(key,mod,function(args,ret){
      if(!ret||!Array.isArray(ret))return ret;
      var bm=getBM();if(!hasAny(bm))return ret.filter(function(x){return!shouldHide(x);});
      var base=ret.filter(function(x){return!x||!String(x.id||"").startsWith("larp-");});
      var np=getNitro();var bp=getBoost();
      if(np)base=base.filter(function(x){return!isNitro(x);});
      if(bp)base=base.filter(function(x){return!isBoost(x);});
      base=base.filter(function(x){return!shouldHide(x);});
      var adds=[];for(var i=0;i<BADGES.length;i++){var b=BADGES[i];if(!bm[b.id])continue;if(NITRO_SET[b.id]&&b.id!==np)continue;if(BOOST_SET[b.id]&&b.id!==bp)continue;adds.push(makeBadge(b));}
      return adds.concat(base);
    }));}catch(e){}
  }
  function patchBadgeIcons(){
    try{var jsx=findByProps("jsx","jsxs");if(!jsx)return;
    function onJsx(args,ret){if(!ret||!ret.props)return ret;var T=args[0];if(typeof T!=="function")return ret;var n=T.displayName||T.name||"";if(n!=="ProfileBadge"&&n!=="RenderedBadge")return ret;var id=ret.props.id;if(typeof id!=="string")return ret;var meta=LARP_BADGE_META[id];if(!meta)return ret;ret.props.source={uri:meta.uri};if(!ret.props.description)ret.props.description=meta.label;return ret;}
    unpatches.push(after("jsx",jsx,onJsx));unpatches.push(after("jsxs",jsx,onJsx));}catch(e){}
  }
  function patchConnections(){
    try{var sns=["UserProfileStore","UserProfileStoreV2","ConnectedAccountsStore"];var mns=["getConnectedAccounts","getUserProfile","getProfile"];
    for(var si=0;si<sns.length;si++){(function(sn){try{var S=findByStoreName(sn);if(!S)return;for(var mi=0;mi<mns.length;mi++){(function(mn){if(typeof S[mn]!=="function")return;unpatches.push(after(mn,S,function(args,ret){var fc=storage.fakeConnections;if(!Array.isArray(fc)||!fc.length)return ret;var fakes=fc.map(function(c){return{type:c.type||"steam",id:c.username||"user",name:c.username||"user",verified:true,visibility:1,friend_sync:false,show_activity:true,two_way_link:false,metadata_visibility:1,integrations:[]};});if(mn==="getConnectedAccounts")return fakes.concat(Array.isArray(ret)?ret:[]);if(ret&&typeof ret==="object"){var ex=Array.isArray(ret.connectedAccounts)?ret.connectedAccounts:[];return Object.assign({},ret,{connectedAccounts:fakes.concat(ex)});}return ret;}));})(mns[mi]);}}catch(_){}})(sns[si]);}}catch(e){}
  }

  // ── FIXED INPUT: uses local state, saves to storage only on blur ─────────
  function StorageInput(props) {
    var localState = useState(props.value || "");
    var localVal = localState[0];
    var setLocalVal = localState[1];
    return React.createElement(TextInput, {
      style: props.style,
      placeholder: props.placeholder || "",
      placeholderTextColor: "#4c1d95",
      value: localVal,
      autoCorrect: false,
      autoCapitalize: "none",
      autoComplete: "off",
      spellCheck: false,
      onChangeText: function (v) { setLocalVal(v); },
      onBlur: function () {
        if (props.onSave) props.onSave(localVal);
      },
      onSubmitEditing: function () {
        if (props.onSave) props.onSave(localVal);
      }
    });
  }

  function Settings() {
    var forceState = useState(0);
    var force = forceState[1];
    var tabState = useState("badges");
    var tab = tabState[0];
    var setTab = tabState[1];

    function softRefresh() {
      force(function (n) { return n + 1; });
      try { var us = findByStoreName("UserStore"); if (us && us.emitChange) us.emitChange(); } catch (_) {}
    }

    // ── Shared UI components ───────────────────────────────────────────────
    function Card(props) {
      return React.createElement(View, {
        style: {
          backgroundColor: K.card, borderRadius: 18,
          borderWidth: 1.5, borderColor: K.line,
          marginBottom: 16, overflow: "hidden"
        }
      }, props.children);
    }

    function CardHeader(props) {
      return React.createElement(View, {
        style: {
          flexDirection: "row", alignItems: "center",
          paddingHorizontal: 16, paddingTop: 14, paddingBottom: 10,
          borderBottomWidth: 1, borderBottomColor: K.lineSoft,
          backgroundColor: K.card2
        }
      },
        React.createElement(Text, { style: { fontSize: 17, marginRight: 8 } }, props.icon),
        React.createElement(Text, { style: { color: K.accent, fontSize: 13, fontWeight: "800", letterSpacing: 1.2, textTransform: "uppercase", flex: 1 } }, props.title),
        props.count != null && props.count > 0
          ? React.createElement(View, { style: { backgroundColor: K.accent, borderRadius: 99, paddingHorizontal: 9, paddingVertical: 2 } },
              React.createElement(Text, { style: { color: K.white, fontSize: 11, fontWeight: "900" } }, String(props.count)))
          : null
      );
    }

    function FieldRow(props) {
      return React.createElement(View, {
        style: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 10, borderTopWidth: props.first ? 0 : 1, borderTopColor: K.lineSoft }
      },
        React.createElement(Text, { style: { color: K.muted, fontSize: 10, fontWeight: "800", letterSpacing: 1, marginBottom: 7, textTransform: "uppercase" } }, props.label),
        React.createElement(StorageInput, {
          style: {
            backgroundColor: K.inputBg, color: K.text, borderRadius: 12,
            borderWidth: 1.5, borderColor: K.inputBorder,
            paddingHorizontal: 14, paddingVertical: 11, fontSize: 15
          },
          placeholder: props.placeholder || props.label,
          value: props.value || "",
          onSave: props.onSave
        })
      );
    }

    function Toggle(props) {
      var on = !!props.value;
      return React.createElement(Pressable, {
        onPress: props.onPress,
        style: {
          flexDirection: "row", alignItems: "center",
          paddingHorizontal: 16, paddingVertical: 13,
          borderTopWidth: props.first ? 0 : 1, borderTopColor: K.lineSoft,
          backgroundColor: on ? "#1a003a" : "transparent"
        }
      },
        React.createElement(Text, { style: { fontSize: 16, marginRight: 12 } }, props.icon || "•"),
        React.createElement(Text, { style: { color: on ? K.text : K.muted, fontSize: 14, flex: 1 } }, props.label),
        React.createElement(View, {
          style: {
            width: 46, height: 26, borderRadius: 13,
            backgroundColor: on ? K.accent : K.lineSoft,
            borderWidth: 1, borderColor: on ? K.pink : K.line,
            justifyContent: "center", paddingHorizontal: 3,
            alignItems: on ? "flex-end" : "flex-start"
          }
        }, React.createElement(View, { style: { width: 20, height: 20, borderRadius: 10, backgroundColor: on ? K.white : K.muted } }))
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
      style: { marginBottom: 16 },
      contentContainerStyle: { paddingHorizontal: 16, paddingVertical: 4 }
    }, TABS.map(function (t) {
      var active = tab === t.id;
      return React.createElement(Pressable, {
        key: t.id, onPress: function () { setTab(t.id); },
        style: {
          flexDirection: "row", alignItems: "center",
          paddingHorizontal: 18, paddingVertical: 10,
          borderRadius: 99, marginRight: 10,
          backgroundColor: active ? K.accent : K.card2,
          borderWidth: 1.5, borderColor: active ? K.pink : K.line
        }
      },
        React.createElement(Text, { style: { fontSize: 15 } }, t.icon),
        React.createElement(Text, { style: { color: active ? K.white : K.muted, fontWeight: active ? "800" : "500", fontSize: 14, marginLeft: 6 } }, t.label)
      );
    }));

    // ── BADGES TAB ──────────────────────────────────────────────────────────
    var bm = getBM();
    var activeBadgeCount = BADGES.filter(function (b) { return bm[b.id]; }).length;
    var badgesTab = React.createElement(Card, null,
      React.createElement(CardHeader, { icon: "✨", title: "Fake Badges", count: activeBadgeCount }),
      BADGES.map(function (b, i) {
        var on = !!bm[b.id];
        return React.createElement(Pressable, {
          key: b.id,
          onPress: function () {
            if (NITRO_SET[b.id] && !on) { for (var k in NITRO_SET) storage.badges[k] = false; }
            if (BOOST_SET[b.id] && !on) { for (var k in BOOST_SET) storage.badges[k] = false; }
            storage.badges[b.id] = !on;
            softRefresh();
          },
          style: {
            flexDirection: "row", alignItems: "center",
            paddingHorizontal: 16, paddingVertical: 13,
            borderTopWidth: i === 0 ? 0 : 1, borderTopColor: K.lineSoft,
            backgroundColor: on ? "#200040" : "transparent"
          }
        },
          React.createElement(Text, { style: { fontSize: 20, width: 34 } }, b.emoji),
          React.createElement(Text, { style: { color: on ? K.text : K.muted, fontSize: 14, flex: 1 } }, b.label),
          React.createElement(View, {
            style: {
              width: 26, height: 26, borderRadius: 13,
              backgroundColor: on ? K.accent : K.lineSoft,
              borderWidth: 1, borderColor: on ? K.pink : K.line,
              alignItems: "center", justifyContent: "center"
            }
          }, on ? React.createElement(Text, { style: { color: K.white, fontSize: 14, fontWeight: "900" } }, "✓") : null)
        );
      })
    );

    // ── IDENTITY TAB ────────────────────────────────────────────────────────
    var identityTab = React.createElement(View, null,
      React.createElement(Card, null,
        React.createElement(CardHeader, { icon: "🌸", title: "Username Spoof" }),
        FieldRow({ label: "Match username", placeholder: "your_current_name", value: storage.matchUsername, first: true, onSave: function (v) { storage.matchUsername = v; softRefresh(); } }),
        FieldRow({ label: "Display as", placeholder: "fake_name", value: storage.replaceUsername, onSave: function (v) { storage.replaceUsername = v; softRefresh(); } })
      ),
      React.createElement(Card, null,
        React.createElement(CardHeader, { icon: "📅", title: "Account Age Spoof" }),
        FieldRow({ label: "Created at date", placeholder: "2015-05-13", value: storage.spoofAccountDateIso, first: true, onSave: function (v) { storage.spoofAccountDateIso = v; softRefresh(); } })
      ),
      React.createElement(Card, null,
        React.createElement(CardHeader, { icon: "👥", title: "Other Accounts", count: (storage.otherProfiles || []).length }),
        (storage.otherProfiles || []).length === 0
          ? React.createElement(Text, { style: { color: K.muted, fontSize: 13, padding: 16, textAlign: "center" } }, "No extra accounts\nTap + Add below")
          : null,
        (storage.otherProfiles || []).map(function (op, oi) {
          if (!op || typeof op !== "object") return null;
          if (typeof op.badges !== "object") op.badges = {};
          return React.createElement(View, { key: "op" + oi, style: { borderTopWidth: oi === 0 ? 0 : 1, borderTopColor: K.lineSoft } },
            React.createElement(View, { style: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingTop: 12, paddingBottom: 4 } },
              React.createElement(Text, { style: { color: K.pink, fontWeight: "800", fontSize: 14, flex: 1 } }, "Account " + (oi + 1)),
              React.createElement(Pressable, { onPress: function () { storage.otherProfiles.splice(oi, 1); softRefresh(); }, style: { paddingHorizontal: 10, paddingVertical: 4 } },
                React.createElement(Text, { style: { color: K.danger, fontWeight: "700", fontSize: 13 } }, "✕ Remove"))
            ),
            FieldRow({ label: "User ID (optional)", value: op.userId || "", first: true, onSave: function (v) { op.userId = v; } }),
            FieldRow({ label: "Match username", value: op.matchUsername || "", onSave: function (v) { op.matchUsername = v; } }),
            FieldRow({ label: "Replace as", value: op.replaceUsername || "", onSave: function (v) { op.replaceUsername = v; } })
          );
        }),
        React.createElement(Pressable, {
          onPress: function () { storage.otherProfiles.push({ userId: "", matchUsername: "", replaceUsername: "", badges: {} }); softRefresh(); },
          style: { paddingVertical: 14, alignItems: "center", borderTopWidth: (storage.otherProfiles || []).length ? 1 : 0, borderTopColor: K.lineSoft }
        }, React.createElement(Text, { style: { color: K.blue, fontWeight: "700", fontSize: 14 } }, "+ Add Account"))
      )
    );

    // ── CONNECTIONS TAB ─────────────────────────────────────────────────────
    var conns = storage.fakeConnections || [];
    var connectionsTab = React.createElement(Card, null,
      React.createElement(CardHeader, { icon: "🔗", title: "Fake Connections", count: conns.length }),
      conns.length === 0
        ? React.createElement(View, { style: { padding: 28, alignItems: "center" } },
            React.createElement(Text, { style: { fontSize: 40, marginBottom: 10 } }, "🔗"),
            React.createElement(Text, { style: { color: K.muted, fontSize: 14, textAlign: "center" } }, "No connections added yet\nTap + Add below"))
        : null,
      conns.map(function (c, ci) {
        var ct = CONNECTION_TYPES.find(function (x) { return x.id === c.type; }) || CONNECTION_TYPES[0];
        return React.createElement(View, { key: "c" + ci, style: { borderTopWidth: ci === 0 ? 0 : 1, borderTopColor: K.lineSoft } },
          React.createElement(View, { style: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingTop: 12, paddingBottom: 4 } },
            React.createElement(Text, { style: { fontSize: 22, marginRight: 10 } }, ct.emoji),
            React.createElement(Text, { style: { color: K.pink, fontWeight: "800", fontSize: 15, flex: 1 } }, ct.label),
            React.createElement(Pressable, { onPress: function () { conns.splice(ci, 1); softRefresh(); }, style: { paddingHorizontal: 10, paddingVertical: 4 } },
              React.createElement(Text, { style: { color: K.danger, fontWeight: "700", fontSize: 14 } }, "✕"))
          ),
          React.createElement(ScrollView, { horizontal: true, showsHorizontalScrollIndicator: false, contentContainerStyle: { paddingHorizontal: 16, paddingBottom: 10 } },
            CONNECTION_TYPES.map(function (ct2) {
              var sel = c.type === ct2.id;
              return React.createElement(Pressable, {
                key: ct2.id, onPress: function () { c.type = ct2.id; softRefresh(); },
                style: { flexDirection: "row", alignItems: "center", paddingHorizontal: 13, paddingVertical: 8, borderRadius: 99, marginRight: 8, backgroundColor: sel ? K.accent : K.card2, borderWidth: 1.5, borderColor: sel ? K.pink : K.line }
              },
                React.createElement(Text, { style: { fontSize: 14, marginRight: 4 } }, ct2.emoji),
                React.createElement(Text, { style: { color: sel ? K.white : K.muted, fontSize: 13, fontWeight: sel ? "800" : "400" } }, ct2.label)
              );
            })
          ),
          React.createElement(View, { style: { paddingHorizontal: 16, paddingBottom: 14 } },
            React.createElement(Text, { style: { color: K.muted, fontSize: 10, fontWeight: "800", letterSpacing: 1, marginBottom: 7, textTransform: "uppercase" } }, "Username / Handle"),
            React.createElement(StorageInput, {
              style: { backgroundColor: K.inputBg, color: K.text, borderRadius: 12, borderWidth: 1.5, borderColor: K.inputBorder, paddingHorizontal: 14, paddingVertical: 11, fontSize: 15 },
              placeholder: "your_handle",
              value: c.username || "",
              onSave: function (v) { c.username = v; }
            })
          )
        );
      }),
      React.createElement(Pressable, {
        onPress: function () { storage.fakeConnections.push({ type: "steam", username: "" }); softRefresh(); },
        style: { paddingVertical: 14, alignItems: "center", borderTopWidth: conns.length ? 1 : 0, borderTopColor: K.lineSoft }
      }, React.createElement(Text, { style: { color: K.blue, fontWeight: "700", fontSize: 14 } }, "+ Add Connection"))
    );

    // ── HIDE TAB ────────────────────────────────────────────────────────────
    var hideTab = React.createElement(View, null,
      React.createElement(Card, null,
        React.createElement(CardHeader, { icon: "🙈", title: "Hide Native Badges" }),
        Toggle({ first: true, icon: "🎯", label: "Hide Quest badge",           value: storage.hideNative.quest,          onPress: function () { storage.hideNative.quest = !storage.hideNative.quest; softRefresh(); } }),
        Toggle({ icon: "🔮", label: "Hide Orb badge",              value: storage.hideNative.orb,            onPress: function () { storage.hideNative.orb = !storage.hideNative.orb; softRefresh(); } }),
        Toggle({ icon: "💎", label: "Hide Nitro / tenure",         value: storage.hideNative.nitro,          onPress: function () { storage.hideNative.nitro = !storage.hideNative.nitro; softRefresh(); } }),
        Toggle({ icon: "🚀", label: "Hide Server Boost",           value: storage.hideNative.boost,          onPress: function () { storage.hideNative.boost = !storage.hideNative.boost; softRefresh(); } }),
        Toggle({ icon: "💰", label: "Hide Orb balance row",        value: storage.hideNative.orbBalance,     onPress: function () { storage.hideNative.orbBalance = !storage.hideNative.orbBalance; softRefresh(); } }),
        Toggle({ icon: "🍃", label: "Hide Level leaf",             value: storage.hideNative.levelLeaf,      onPress: function () { storage.hideNative.levelLeaf = !storage.hideNative.levelLeaf; softRefresh(); } }),
        Toggle({ icon: "🏷️", label: "Hide Legacy username badge",  value: storage.hideNative.legacyUsername, onPress: function () { storage.hideNative.legacyUsername = !storage.hideNative.legacyUsername; softRefresh(); } })
      ),
      React.createElement(Card, null,
        React.createElement(CardHeader, { icon: "🔍", title: "Hide by Badge ID" }),
        FieldRow({ label: "ID fragments (space or comma separated)", placeholder: "e.g. quest orb", value: storage.hideNative.idSubstrings, first: true, onSave: function (v) { storage.hideNative.idSubstrings = v; softRefresh(); } })
      ),
      React.createElement(Pressable, {
        onPress: function () { storage.badges = {}; softRefresh(); try { showToast("Cleared ✨", getAssetIDByName("trash")); } catch (_) {} },
        style: { paddingVertical: 15, alignItems: "center", backgroundColor: "#2d0014", borderRadius: 16, borderWidth: 1.5, borderColor: K.danger, marginBottom: 8 }
      }, React.createElement(Text, { style: { color: K.danger, fontWeight: "800", fontSize: 15 } }, "🗑️  Clear All Fake Badges"))
    );

    // ── MAIN RENDER ─────────────────────────────────────────────────────────
    return React.createElement(ScrollView, {
      style: { flex: 1, backgroundColor: K.bg },
      contentContainerStyle: { paddingBottom: 100 },
      keyboardShouldPersistTaps: "handled"
    },
      // Anime girl banner
      React.createElement(View, {
        style: { backgroundColor: K.card2, borderBottomWidth: 2, borderBottomColor: K.accent, marginBottom: 20, alignItems: "center", paddingBottom: 22 }
      },
        React.createElement(View, { style: { height: 3, width: "100%", backgroundColor: K.accent, marginBottom: 0 } }),
        React.createElement(Image, {
          source: { uri: ANIME_GIRL_URL },
          style: { width: "100%", height: 220, marginBottom: 0 },
          resizeMode: "cover"
        }),
        React.createElement(View, {
          style: { position: "absolute", bottom: 56, left: 0, right: 0, height: 60, backgroundColor: "transparent",
            shadowColor: K.bg, shadowOpacity: 1, shadowRadius: 20 }
        }),
        React.createElement(Text, { style: { color: K.accent, fontSize: 30, fontWeight: "900", letterSpacing: 3, marginTop: 14, textShadowColor: K.accent, textShadowRadius: 16 } }, "✨ LARP ✨"),
        React.createElement(Text, { style: { color: K.muted, fontSize: 11, letterSpacing: 1, marginTop: 3 } }, "client-side only  •  " + LARP_UI_TAG),
        React.createElement(View, { style: { flexDirection: "row", marginTop: 16 } },
          [
            { label: "Badges",      value: activeBadgeCount,                         color: K.accent },
            { label: "Connections", value: conns.length,                             color: K.blue   },
            { label: "Accounts",    value: (storage.otherProfiles || []).length,     color: K.pink   }
          ].map(function (s) {
            return React.createElement(View, {
              key: s.label,
              style: { backgroundColor: K.inset, borderRadius: 14, paddingHorizontal: 18, paddingVertical: 10, borderWidth: 1.5, borderColor: s.color, alignItems: "center", marginHorizontal: 5 }
            },
              React.createElement(Text, { style: { color: s.color, fontSize: 24, fontWeight: "900" } }, String(s.value)),
              React.createElement(Text, { style: { color: K.muted, fontSize: 11, fontWeight: "600", marginTop: 1 } }, s.label)
            );
          })
        ),
        React.createElement(Text, { style: { fontSize: 18, marginTop: 14, letterSpacing: 8 } }, "🌸💜🌸💜🌸")
      ),
      tabBar,
      React.createElement(View, { style: { paddingHorizontal: 14 } },
        tab === "badges"      ? badgesTab      : null,
        tab === "identity"    ? identityTab    : null,
        tab === "connections" ? connectionsTab : null,
        tab === "hide"        ? hideTab        : null
      )
    );
  }

  return {
    onLoad: function () {
      larpUnpatchAll();
      try { patchUsername(); }    catch (_) {}
      try { patchBadges(); }      catch (_) {}
      try { patchBadgeIcons(); }  catch (_) {}
      try { patchConnections(); } catch (_) {}
      try { showToast("Larp " + LARP_UI_TAG + " ✨", getAssetIDByName("Check")); } catch (_) {}
    },
    onUnload: larpUnpatchAll,
    settings: Settings
  };
})();
