import { useState } from "react";

interface CharacterProps {
  equipped: {
    top: string;
    bottom: string;
    accessory: string;
    aura: string;
    theme: string;
  };
  rotationIndex: number; // 0 = Front, 1 = Right, 2 = Back, 3 = Left
  level?: number;
}

export function CharacterSvg({ equipped, rotationIndex, level = 1 }: CharacterProps) {
  // Always front view as requested: "remove the option for backside. keep front view only."
  const getFaceTransform = () => "translate(0, 0)";
  const getBodyTransform = () => "scale(1, 1)";
  const getSvgStyleTransform = () => "perspective(400px) rotateY(0deg)";

  // Dynamic colors based on level tier (Starter -> Upgraded -> Master)
  const getSkinColor = () => {
    if (level === 1) return "#A5A3B8"; // Starter: Soft Galactic Silver Gray
    if (level < 5) return "#B2A2F8"; // Upgraded: Ethereal Twilight Violet
    return "#FFE8A3"; // Master: Radiant Solar Gold Sovereign
  };

  const getHandColor = () => getSkinColor();

  return (
    <div className="relative w-[210px] h-[210px] mx-auto flex items-center justify-center select-none overflow-visible">
      {/* Dynamic Keyframe Animations */}
      <style>{`
        @keyframes char-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-7px); }
        }
        @keyframes aura-pulse {
          0%, 100% { opacity: 0.45; transform: scale(1.0); }
          50% { opacity: 0.8; transform: scale(1.08); }
        }
        @keyframes star-orbit {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-char-float {
          animation: char-float 3.5s infinite ease-in-out;
        }
        .animate-aura-pulse {
          animation: aura-pulse 4s infinite ease-in-out;
          transform-origin: 100px 105px;
        }
        .animate-star-orbit {
          animation: star-orbit 14s infinite linear;
          transform-origin: 100px 105px;
        }
      `}</style>

      {/* Main Pure SVG Canvas */}
      <svg
        id="celestial-character"
        width="190"
        height="190"
        viewBox="0 0 200 210"
        className="overflow-visible transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
        style={{ transform: getSvgStyleTransform() }}
      >
        <defs>
          {/* Radial Aura gradients matching each element theme */}
          <radialGradient id="aura-lavender" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#D47EFF" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#0E0E1A" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="aura-ocean" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#6DACFF" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#0E0E1A" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="aura-forest" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#7FFFC4" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#0E0E1A" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="aura-sakura" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFB6C1" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#0E0E1A" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="aura-celestial" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#8974F2" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#D47EFF" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#0E0E1A" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="aura-solar" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFD166" stopOpacity="0.8" />
            <stop offset="40%" stopColor="#FF6B8A" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#0E0E1A" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* 1. LAYER: BACKDROP AURA GLOW (id="char-aura") */}
        <g id="char-aura" className="animate-aura-pulse">
          {equipped.aura === "lavender" && (
            <circle cx="100" cy="105" r="75" fill="url(#aura-lavender)" />
          )}
          {equipped.aura === "ocean-aura" && (
            <circle cx="100" cy="105" r="75" fill="url(#aura-ocean)" />
          )}
          {equipped.aura === "forest-aura" && (
            <circle cx="100" cy="105" r="75" fill="url(#aura-forest)" />
          )}
          {equipped.aura === "sakura-aura" && (
            <circle cx="100" cy="105" r="75" fill="url(#aura-sakura)" />
          )}
          {equipped.aura === "celestial-aura" && (
            <circle cx="100" cy="105" r="78" fill="url(#aura-celestial)" />
          )}
          {equipped.aura === "solar-aura" && (
            <circle cx="100" cy="105" r="78" fill="url(#aura-solar)" />
          )}
        </g>

        {/* Orbiting celestial stars (Only rendered if Celestial or Solar aura is equipped) */}
        {(equipped.aura === "celestial-aura" || equipped.aura === "solar-aura") && (
          <g className="animate-star-orbit">
            {/* Small gold sparkle stars orbiting around character body */}
            <polygon points="100,22 103,16 106,22 103,28" fill="#FFD166" opacity="0.9" />
            <polygon points="168,105 171,99 174,105 171,111" fill="#FFD166" opacity="0.8" />
            <polygon points="32,105 35,99 38,105 35,111" fill="#FFF" opacity="0.9" />
            <polygon points="100,188 103,182 106,188 103,194" fill="#FFF" opacity="0.75" />
            <circle cx="50" cy="50" r="1.5" fill="#FFF" opacity="0.8" />
            <circle cx="150" cy="160" r="2" fill="#D47EFF" opacity="0.9" />
          </g>
        )}

        {/* 2. LAYER: WINGS (Drawn on accessory layer but physically behind character) */}
        {equipped.accessory === "astral-wings" && (
          <g className="animate-char-float" opacity="0.85">
            {/* Left wing */}
            <path 
              d="M 68 115 C 32 90 22 55 12 70 C 2 85 24 122 68 123 Z" 
              fill="rgba(137, 116, 242, 0.6)" 
              stroke="#FFF" 
              strokeWidth="1.5" 
            />
            {/* Right wing */}
            <path 
              d="M 132 115 C 168 90 178 55 188 70 C 198 85 176 122 132 123 Z" 
              fill="rgba(137, 116, 242, 0.6)" 
              stroke="#FFF" 
              strokeWidth="1.5" 
            />
          </g>
        )}

        {/* 3. FLOATING COMPONENT WRAPPER (Body elements move together) */}
        <g className="animate-char-float">
          
          {/* A. STUBBY LEGS AND FEET (id="char-legs") */}
          <g id="char-legs" style={{ transform: getBodyTransform() }}>
            {/* Left Stance leg */}
            <rect x="74" y="146" width="16" height="28" rx="8" fill={getSkinColor()} />
            {/* Right Stance leg */}
            <rect x="110" y="146" width="16" height="28" rx="8" fill={getSkinColor()} />
            {/* Feet shoes details */}
            <ellipse cx="82" cy="173" rx="10" ry="5" fill="#808092" />
            <ellipse cx="118" cy="173" rx="10" ry="5" fill="#808092" />
          </g>

          {/* B. SWAPPABLE BOTTOMS COVERS (id="char-shorts") - Layered over top of legs */}
          <g id="char-shorts" style={{ transform: getBodyTransform() }}>
            {equipped.bottom === "default-shorts" && (
              <path d="M 70 132 H 130 V 149 H 105 V 141 H 95 V 149 H 70 Z" fill="#5A5A6A" />
            )}
            
            {equipped.bottom === "midnight-pants" && (
              <g>
                <rect x="73" y="132" width="22" height="34" rx="4" fill="#141430" />
                <rect x="105" y="132" width="22" height="34" rx="4" fill="#141430" />
                {/* Midnight dark belt cuff line */}
                <rect x="71" y="132" width="58" height="4" fill="#1B1C35" />
              </g>
            )}

            {equipped.bottom === "lavender-skirt" && (
              <path 
                d="M 71 132 L 56 156 Q 100 162 144 156 L 129 132 Z" 
                fill="#C49BFF" 
                stroke="#B2A4FF" 
                strokeWidth="1" 
              />
            )}

            {equipped.bottom === "star-leggings" && (
              <g>
                <rect x="74" y="132" width="20" height="36" rx="4" fill="#231F33" />
                <rect x="106" y="132" width="20" height="36" rx="4" fill="#231F33" />
                {/* Embedded golden stars on tights */}
                <polygon points="80,144 82,141 84,144 82,147" fill="#FFD166" />
                <polygon points="120,152 122,149 124,152 122,155" fill="#FFD166" />
                <polygon points="112,138 113.5,136 115,138 113.5,140" fill="#FFF" />
              </g>
            )}

            {equipped.bottom === "floral-skirt" && (
              <g>
                <path d="M 71 132 Q 100 130 129 132 L 133 154 Q 100 159 67 154 Z" fill="#FF8D9E" />
                {/* Floral stamp rings */}
                <circle cx="84" cy="142" r="3" fill="#FFF" opacity="0.9" />
                <circle cx="84" cy="142" r="1" fill="#FFD166" />
                <circle cx="116" cy="144" r="3" fill="#FFF" opacity="0.9" />
                <circle cx="116" cy="144" r="1" fill="#FFD166" />
                <circle cx="100" cy="148" r="3" fill="#FFF" opacity="0.9" />
                <circle cx="100" cy="148" r="1" fill="#FFD166" />
              </g>
            )}

            {equipped.bottom === "solar-joggers" && (
              <g>
                <rect x="73" y="132" width="22" height="33" rx="4" fill="#E26D5C" />
                <rect x="105" y="132" width="22" height="33" rx="4" fill="#E26D5C" />
                {/* Sport Jogger yellow accents stripes */}
                <rect x="73" y="132" width="4" height="33" fill="#FFD166" />
                <rect x="123" y="132" width="4" height="33" fill="#FFD166" />
              </g>
            )}
          </g>

          {/* C. CORE CHUBBY GREY BODY/TORSO (id="char-body") */}
          <g id="char-body" style={{ transform: getBodyTransform() }}>
            <ellipse cx="100" cy="115" rx="36" ry="31" fill={getSkinColor()} />
            {/* Skin-colored connected upper arms to link shoulders to hand wrists under sleeves */}
            <line x1="72" y1="104" x2="48" y2="118" stroke={getSkinColor()} strokeWidth="14" strokeLinecap="round" />
            <line x1="128" y1="104" x2="152" y2="118" stroke={getSkinColor()} strokeWidth="14" strokeLinecap="round" />
          </g>

          {/* D. SWAPPABLE SHIRT COVERS (id="char-shirt") */}
          <g id="char-shirt" style={{ transform: getBodyTransform() }}>
            {equipped.top === "default-tee" && (
              <g>
                {/* Short Sleeves aligned to arm segment 72,104 to 48,118 */}
                <line x1="72" y1="104" x2="58" y2="112" stroke="#F0F0F5" strokeWidth="18" strokeLinecap="round" />
                <line x1="128" y1="104" x2="142" y2="112" stroke="#F0F0F5" strokeWidth="18" strokeLinecap="round" />
                {/* Tee Body */}
                <rect x="68" y="100" width="64" height="36" rx="8" fill="#F0F0F5" />
                {/* Collar Cut exposing neck skin */}
                <path d="M 86 100 Q 100 114 114 100 Z" fill={getSkinColor()} />
              </g>
            )}

            {equipped.top === "midnight-hoodie" && (
              <g>
                {/* Midnight Thick Full Sleeves overlaying arms */}
                <line x1="72" y1="104" x2="52" y2="116" stroke="#1C1C35" strokeWidth="19" strokeLinecap="round" />
                <line x1="128" y1="104" x2="148" y2="116" stroke="#1C1C35" strokeWidth="19" strokeLinecap="round" />
                {/* Hoodie Main Torso */}
                <rect x="66" y="98" width="68" height="39" rx="10" fill="#1C1C35" />
                {/* Front Hood Collar pouch loops */}
                <ellipse cx="100" cy="98" rx="20" ry="6" fill="#111124" />
                {/* Swelling back cowl shape */}
                <path d="M 76 88 Q 100 80 124 88 Q 100 95 76 88" fill="#1C1C35" />
              </g>
            )}

            {equipped.top === "lavender-crop" && (
              <g>
                {/* Thin Lavender Crop Sleeves */}
                <line x1="72" y1="104" x2="60" y2="110" stroke="#B2A4FF" strokeWidth="16" strokeLinecap="round" />
                <line x1="128" y1="104" x2="140" y2="110" stroke="#B2A4FF" strokeWidth="16" strokeLinecap="round" />
                {/* Lavender Crop Body block */}
                <rect x="68" y="100" width="64" height="22" rx="6" fill="#B2A4FF" />
                {/* Rounded neck cut */}
                <path d="M 88 100 Q 100 110 112 100 Z" fill={getSkinColor()} />
              </g>
            )}

            {equipped.top === "celestial-jacket" && (
              <g>
                {/* Deep Purple Star Sleeves with golden bands */}
                <line x1="72" y1="104" x2="55" y2="114" stroke="#4D3C9D" strokeWidth="18" strokeLinecap="round" />
                <line x1="128" y1="104" x2="145" y2="114" stroke="#4D3C9D" strokeWidth="18" strokeLinecap="round" />
                
                {/* Perfect inline gold cuffs segment */}
                <line x1="55" y1="114" x2="51" y2="116" stroke="#FFD166" strokeWidth="18" strokeLinecap="round" />
                <line x1="145" y1="114" x2="149" y2="116" stroke="#FFD166" strokeWidth="18" strokeLinecap="round" />

                {/* Double Breast Coat base */}
                <rect x="66" y="98" width="68" height="38" rx="8" fill="#4D3C9D" />
                {/* Gold lapel ornaments and undershirt triangle overlap */}
                <polygon points="100,98 84,98 100,122" fill="#FFFFFF" />
                <polygon points="100,98 116,98 100,122" fill="#FFFFFF" />
                <path d="M 85 98 L 96 114 L 91 98 Z" fill="#FFD166" />
                <path d="M 115 98 L 104 114 L 109 98 Z" fill="#FFD166" />
                {/* Sparkling gold buttons dots */}
                <circle cx="76" cy="106" r="2.5" fill="#FFD166" />
                <circle cx="124" cy="106" r="2.5" fill="#FFD166" />
              </g>
            )}

            {equipped.top === "sakura-kimono" && (
              <g>
                {/* Pink flowing Japanese wrapper lapels covering arms elegantly */}
                <line x1="72" y1="104" x2="52" y2="116" stroke="#FFB6C1" strokeWidth="18" strokeLinecap="round" />
                <line x1="128" y1="104" x2="148" y2="116" stroke="#FFB6C1" strokeWidth="18" strokeLinecap="round" />
                <path d="M 46 102 Q 58 98 70 102 L 64 128 L 42 120 Z" fill="#FFB6C1" />
                <path d="M 154 102 Q 142 98 130 102 L 136 128 L 158 120 Z" fill="#FFB6C1" />
                {/* Main wrap fold */}
                <path d="M 68 98 Q 100 95 132 98 L 129 135 L 71 135 Z" fill="#FFB6C1" />
                {/* Splendid Obi waistband */}
                <rect x="70" y="118" width="60" height="13" fill="#FF6B8A" />
                {/* Inside chest white fold */}
                <polygon points="100,98 83,98 100,118" fill="#FFF5F7" />
                <polygon points="100,98 117,98 100,118" fill="#FFE5EC" />
                <circle cx="100" cy="124" r="3" fill="#FFD166" />
              </g>
            )}

            {equipped.top === "solar-hoodie" && (
              <g>
                {/* Bright Orange full hoodie */}
                <line x1="72" y1="104" x2="52" y2="116" stroke="#FF6B4A" strokeWidth="19" strokeLinecap="round" />
                <line x1="128" y1="104" x2="148" y2="116" stroke="#FF6B4A" strokeWidth="19" strokeLinecap="round" />
                <rect x="66" y="98" width="68" height="39" rx="10" fill="#FF6B4A" />
                {/* Fiery yellow cords with points */}
                <line x1="94" y1="106" x2="94" y2="119" stroke="#FFD166" strokeWidth="2" strokeLinecap="round" />
                <line x1="106" y1="106" x2="106" y2="119" stroke="#FFD166" strokeWidth="2" strokeLinecap="round" />
                <circle cx="94" cy="120" r="2.5" fill="#FFD166" />
                <circle cx="106" cy="120" r="2.5" fill="#FFD166" />
                {/* Sun burst circle emblem */}
                <circle cx="100" cy="115" r="5" fill="#FFD166" />
                <circle cx="100" cy="115" r="3" fill="#FF6B4A" />
              </g>
            )}
          </g>

          {/* E. ROUNDED ARMS AT SIDES (id="char-arms") */}
          <g id="char-arms" style={{ transform: getBodyTransform() }}>
            {/* Left Hand exiting from sleeve */}
            <rect x="42" y="112" width="12" height="22" rx="6" fill={getSkinColor()} transform="rotate(22, 48, 112)" />
            {/* Right Hand exiting from sleeve */}
            <rect x="146" y="112" width="12" height="22" rx="6" fill={getSkinColor()} transform="rotate(-22, 152, 112)" />
          </g>

          {/* F. CHARACTER HEAD & FACE (id="char-head") */}
          <g id="char-head">
            {/* Round neck connector to keep body beautifully connected */}
            <rect x="94" y="88" width="12" height="18" rx="5" fill={getSkinColor()} />
            
            {/* Round head */}
            <circle cx="100" cy="74" r="27.5" fill={getSkinColor()} />

            {/* Dynamic level marking ornaments (Dynamic Asset Progression) */}
            {level >= 2 && level < 5 && (
              <path d="M 100 53 L 103 57 L 100 61 L 97 57 Z" fill="#D47EFF" className="animate-pulse" />
            )}
            {level >= 5 && (
              <g>
                <path d="M 86 48 Q 78 30 72 35 T 88 47 Z" fill="#FFD166" />
                <path d="M 114 48 Q 122 30 128 35 T 112 47 Z" fill="#FFD166" />
                <circle cx="72" cy="35" r="2.5" fill="#FFF" className="animate-ping" style={{ transformOrigin: "72px 35px" }} />
                <circle cx="128" cy="35" r="2.5" fill="#FFF" className="animate-ping" style={{ transformOrigin: "128px 35px" }} />
                <circle cx="100" cy="54" r="3.5" fill="#FF6B8A" className="animate-pulse" />
              </g>
            )}

            {/* FACE DETAILS (Always visible now as we kept front view only) */}
            <g style={{ transform: getFaceTransform(), transition: "transform 0.4s ease-out" }}>
              {/* Tiny black eyes */}
              <circle cx="89" cy="74" r="2.5" fill="#1C1C35" />
              <circle cx="111" cy="74" r="2.5" fill="#1C1C35" />
              
              {/* Cute smile */}
              <path 
                d="M 96 82 Q 100 86.5 104 82" 
                stroke="#1C1C35" 
                strokeWidth="2.5" 
                fill="none" 
                strokeLinecap="round" 
              />
              
              {/* Chubby rosy cheeks */}
              <circle cx="83" cy="78" r="3.5" fill="#FF8D9E" opacity="0.65" />
              <circle cx="117" cy="78" r="3.5" fill="#FF8D9E" opacity="0.65" />
            </g>
          </g>

          {/* G. SWAPPABLE ACCESSORIES ABOVE HEAD (id="char-accessory") */}
          <g id="char-accessory">
            {equipped.accessory === "star-halo" && (
              <g>
                <ellipse cx="100" cy="38" rx="25" ry="6.5" fill="none" stroke="#FFD166" strokeWidth="3" opacity="0.9" />
                {/* Starlets on halo */}
                <polygon points="76,38 78,35 80,38 78,41" fill="#FFFFFF" />
                <polygon points="124,38 126,35 128,38 126,41" fill="#FFFFFF" />
                <polygon points="100,31 101.5,29.5 103,31 101.5,32.5" fill="#FFD166" />
              </g>
            )}

            {equipped.accessory === "moon-crown" && (
              <g>
                {/* Moon arc peaks */}
                <path d="M 85 46 Q 100 37 115 46 L 111 49 Q 100 41 89 49 Z" fill="#D2E8FF" />
                {/* Centered moon emblem */}
                <path d="M 100 42 A 5.5 5.5 0 1 0 100 31 A 4.5 4.5 0 1 1 100 42" fill="#FFD166" />
              </g>
            )}

            {equipped.accessory === "cosmic-bow" && (
              <g>
                {/* Cute massive cosmic hair bow */}
                <path d="M 84 45 Q 100 50 116 45 L 112 55 Q 100 52 88 55 Z" fill="#D47EFF" />
                <circle cx="92" cy="48" r="7" fill="#D47EFF" />
                <circle cx="108" cy="48" r="7" fill="#D47EFF" />
                <circle cx="100" cy="50" r="4.5" fill="#FFFFFF" />
              </g>
            )}

            {equipped.accessory === "crystal-crown" && (
              <g>
                {/* Swelling ice / star peaks */}
                <polygon points="78,47 84,28 92,42 100,22 108,42 116,28 122,47" fill="#6DACFF" opacity="0.9" stroke="#E2F0FF" strokeWidth="1" />
                {/* Sparkling dots on peaks */}
                <circle cx="100" cy="22" r="2.5" fill="#FFFFFF" />
                <circle cx="84" cy="28" r="1.5" fill="#FFFFFF" />
                <circle cx="116" cy="28" r="1.5" fill="#FFFFFF" />
              </g>
            )}

            {equipped.accessory === "mystic-shield" && (
              <g>
                {/* Shield at side or as backward warding shield */}
                <path d="M 68 110 C 68 135 100 150 100 150 C 100 150 132 135 132 110 L 132 90 L 100 95 L 68 90 Z" fill="#6DACFF" stroke="#FFF" strokeWidth="2" opacity="0.85" />
                <path d="M 80 110 C 80 128 100 140 100 140 C 100 140 120 128 120 110 L 120 98 L 100 102 L 80 98 Z" fill="#4B3C9D" opacity="0.8" />
                <polygon points="100,105 104,115 115,115 106,121 109,132 100,126 91,132 94,121 85,115 96,115" fill="#FFD166" />
              </g>
            )}

            {equipped.accessory === "focus-elixir" && (
              <g>
                <rect x="94" y="24" width="12" height="15" rx="3" fill="#BF9BFF" stroke="#FFF" strokeWidth="1.5" />
                <rect x="91" y="21" width="18" height="3" rx="1" fill="#FFF" />
                <path d="M 94 32 Q 100 38 106 32" stroke="#FFF" strokeWidth="1.5" fill="none" />
                <circle cx="100" cy="29" r="2.5" fill="#FFF" className="animate-pulse" />
              </g>
            )}

            {equipped.accessory === "homework-scroll" && (
              <g>
                <rect x="80" y="24" width="40" height="12" rx="4" fill="#FFEAB3" stroke="#9C5030" strokeWidth="1.5" />
                <circle cx="80" cy="30" r="3.5" fill="#E26D5C" />
                <circle cx="120" cy="30" r="3.5" fill="#E26D5C" />
                <line x1="88" y1="30" x2="112" y2="30" stroke="#9C5030" strokeWidth="1.5" strokeDasharray="2,2" />
              </g>
            )}

            {equipped.accessory === "real-life-break" && (
              <g>
                <rect x="84" y="25" width="32" height="14" rx="2" fill="#FF8D9E" stroke="#FFF" strokeWidth="1.5" />
                <line x1="93" y1="25" x2="93" y2="39" stroke="#FFF" strokeWidth="1.5" strokeDasharray="2,2" />
                <circle cx="106" cy="32" r="2" fill="#FFF" />
              </g>
            )}
          </g>

        </g>
      </svg>
    </div>
  );
}

// 60px MINI TORSO+HEAD AVATAR FOR REWARD CARDS PREVIEWS
export function MiniCharacterPreview({ itemId, type, equipped, level = 1 }: { itemId: string; type: string; equipped: any; level?: number }) {
  // Compute preview outfit based on this specific card item combined with overall outfit
  const previewEquipped = {
    top: type === "top" ? itemId : equipped.top,
    bottom: type === "bottom" ? itemId : equipped.bottom,
    accessory: type === "accessory" ? itemId : equipped.accessory,
    aura: type === "aura" ? itemId : "lavender", // keep soft backdrop
    theme: equipped.theme
  };

  const getSkinColor = () => {
    if (level === 1) return "#A5A3B8";
    if (level < 5) return "#B2A2F8";
    return "#FFE8A3";
  };

  return (
    <div className="w-[66px] h-[66px] rounded-2xl bg-[#0E0E1A]/80 border border-white/5 overflow-hidden flex items-center justify-center relative shadow-inner group-hover:scale-[1.06] transition-transform">
      <svg
        width="68"
        height="68"
        viewBox="65 30 70 70" /* Crop centered precisely on head & torso chest */
        className="overflow-visible"
      >
        <defs>
          <radialGradient id="mini-la" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#D47EFF" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#0E0E1A" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Small background circle aura inside preview card */}
        <circle cx="100" cy="65" r="30" fill="url(#mini-la)" />

        {/* Tiny float animation built-in */}
        <g>
          {/* Default leg peaks */}
          <rect x="80" y="102" width="10" height="15" rx="4" fill={getSkinColor()} />
          <rect x="110" y="102" width="10" height="15" rx="4" fill={getSkinColor()} />

          {/* Preview Swappable Shorts */}
          {previewEquipped.bottom === "default-shorts" && (
            <path d="M 75 92 H 125 V 104 H 105 V 98 H 95 V 104 H 75 Z" fill="#5A5A6A" />
          )}
          {previewEquipped.bottom === "midnight-pants" && (
            <g>
              <rect x="76" y="92" width="18" height="20" rx="3" fill="#141430" />
              <rect x="106" y="92" width="18" height="20" rx="3" fill="#141430" />
            </g>
          )}
          {previewEquipped.bottom === "lavender-skirt" && (
            <path d="M 76 92 L 67 110 Q 100 114 133 110 L 124 92 Z" fill="#C49BFF" />
          )}
          {previewEquipped.bottom === "star-leggings" && (
            <g>
              <rect x="78" y="92" width="16" height="21" rx="2" fill="#231F33" />
              <rect x="106" y="92" width="16" height="21" rx="2" fill="#231F33" />
            </g>
          )}
          {previewEquipped.bottom === "floral-skirt" && (
            <path d="M 76 92 L 67 110 L 133 110 L 124 92 Z" fill="#FF8D9E" />
          )}
          {previewEquipped.bottom === "solar-joggers" && (
            <g>
              <rect x="77" y="92" width="17" height="20" rx="3" fill="#E26D5C" />
              <rect x="106" y="92" width="17" height="20" rx="3" fill="#E26D5C" />
            </g>
          )}

          {/* Round torso */}
          <ellipse cx="100" cy="80" rx="25" ry="22" fill={getSkinColor()} />

          {/* Skin-colored connected arms for small preview */}
          <line x1="80" y1="72" x2="64" y2="82" stroke={getSkinColor()} strokeWidth="9" strokeLinecap="round" />
          <line x1="120" y1="72" x2="136" y2="82" stroke={getSkinColor()} strokeWidth="9" strokeLinecap="round" />

          {/* Torso Top Outfit */}
          {previewEquipped.top === "default-tee" && (
            <g>
              {/* Short Sleeves aligned to mini arm segment 80,72 to 64,82 */}
              <line x1="80" y1="72" x2="68" y2="78" stroke="#F0F0F5" strokeWidth="11" strokeLinecap="round" />
              <line x1="120" y1="72" x2="132" y2="78" stroke="#F0F0F5" strokeWidth="11" strokeLinecap="round" />
              <rect x="78" y="70" width="44" height="25" rx="5" fill="#F0F0F5" />
              <path d="M 90 70 Q 100 78 110 70 Z" fill={getSkinColor()} />
            </g>
          )}
          {previewEquipped.top === "midnight-hoodie" && (
            <g>
              {/* Thick full sleeves overlaying mini arms */}
              <line x1="80" y1="72" x2="66" y2="81" stroke="#1C1C35" strokeWidth="12" strokeLinecap="round" />
              <line x1="120" y1="72" x2="134" y2="81" stroke="#1C1C35" strokeWidth="12" strokeLinecap="round" />
              <rect x="76" y="69" width="48" height="27" rx="7" fill="#1C1C35" />
              <ellipse cx="100" cy="69" rx="14" ry="4" fill="#111124" />
            </g>
          )}
          {previewEquipped.top === "lavender-crop" && (
            <g>
              {/* Lavender Crop Sleeves */}
              <line x1="80" y1="72" x2="70" y2="78" stroke="#B2A4FF" strokeWidth="10" strokeLinecap="round" />
              <line x1="120" y1="72" x2="130" y2="78" stroke="#B2A4FF" strokeWidth="10" strokeLinecap="round" />
              <rect x="78" y="70" width="44" height="15" rx="4" fill="#B2A4FF" />
              <path d="M 91 70 Q 100 76 109 70 Z" fill={getSkinColor()} />
            </g>
          )}
          {previewEquipped.top === "celestial-jacket" && (
            <g>
              {/* Deep Purple mini jacket sleeves overlay */}
              <line x1="80" y1="72" x2="66" y2="81" stroke="#4D3C9D" strokeWidth="11" strokeLinecap="round" />
              <line x1="120" y1="72" x2="134" y2="81" stroke="#4D3C9D" strokeWidth="11" strokeLinecap="round" />
              <rect x="76" y="69" width="48" height="26" rx="6" fill="#4D3C9D" />
              <polygon points="100,69 88,69 100,86" fill="#FFF" />
              <polygon points="100,69 112,69 100,86" fill="#FFF" />
            </g>
          )}
          {previewEquipped.top === "sakura-kimono" && (
            <g>
              {/* Flowing mini kimono arms */}
              <line x1="80" y1="72" x2="66" y2="81" stroke="#FFB6C1" strokeWidth="11" strokeLinecap="round" />
              <line x1="120" y1="72" x2="134" y2="81" stroke="#FFB6C1" strokeWidth="11" strokeLinecap="round" />
              <path d="M 78 70 Q 100 68 122 70 L 120 95 L 80 95 Z" fill="#FFB6C1" />
              <rect x="79" y="84" width="42" height="9" fill="#FF6B8A" />
            </g>
          )}
          {previewEquipped.top === "solar-hoodie" && (
            <g>
              {/* Bright orange mini hoodie sleeves */}
              <line x1="80" y1="72" x2="66" y2="81" stroke="#FF6B4A" strokeWidth="12" strokeLinecap="round" />
              <line x1="120" y1="72" x2="134" y2="81" stroke="#FF6B4A" strokeWidth="12" strokeLinecap="round" />
              <rect x="76" y="69" width="48" height="27" rx="7" fill="#FF6B4A" />
              <circle cx="100" cy="80" r="3.5" fill="#FFD166" />
            </g>
          )}

          {/* Hands */}
          <rect x="60" y="79" width="8" height="14" rx="4" fill={getSkinColor()} transform="rotate(20, 64, 79)" />
          <rect x="132" y="79" width="8" height="14" rx="4" fill={getSkinColor()} transform="rotate(-20, 136, 79)" />

          {/* Round neck connector */}
          <rect x="96.5" y="61" width="7" height="12" rx="2" fill={getSkinColor()} />

          {/* Round head */}
          <circle cx="100" cy="51" r="19" fill={getSkinColor()} />

          {/* Face */}
          <circle cx="93" cy="51" r="1.8" fill="#1C1C35" />
          <circle cx="107" cy="51" r="1.8" fill="#1C1C35" />
          <path d="M 97 56 Q 100 59 103 56" stroke="#1C1C35" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          <circle cx="89.5" cy="53" r="2.2" fill="#FF8D9E" opacity="0.65" />
          <circle cx="110.5" cy="53" r="2.2" fill="#FF8D9E" opacity="0.65" />

          {/* Accessory */}
          {previewEquipped.accessory === "star-halo" && (
            <ellipse cx="100" cy="27" rx="17" ry="4.5" fill="none" stroke="#FFD166" strokeWidth="2.2" opacity="0.9" />
          )}
          {previewEquipped.accessory === "moon-crown" && (
            <path d="M 89 31 Q 100 25 111 31" stroke="#D2E8FF" strokeWidth="2" fill="none" />
          )}
          {previewEquipped.accessory === "cosmic-bow" && (
            <circle cx="100" cy="33" r="5.5" fill="#D47EFF" />
          )}
          {previewEquipped.accessory === "crystal-crown" && (
            <polygon points="86,32 91,18 96,28 100,14 104,28 109,18 114,32" fill="#6DACFF" stroke="#FFF" strokeWidth="0.8" />
          )}
          {previewEquipped.accessory === "mystic-shield" && (
            <path d="M 82 85 C 82 100 100 110 100 110 Q 118 100 118 85 L 118 73 Q 100 76 82 73 Z" fill="#6DACFF" stroke="#FFF" strokeWidth="1" opacity="0.9" />
          )}
          {previewEquipped.accessory === "focus-elixir" && (
            <g>
              <rect x="96" y="20" width="8" height="10" rx="1.5" fill="#BF9BFF" stroke="#FFF" strokeWidth="0.8" />
              <rect x="94" y="18" width="12" height="2" rx="0.5" fill="#FFF" />
            </g>
          )}
          {previewEquipped.accessory === "homework-scroll" && (
            <rect x="86" y="20" width="28" height="8" rx="2" fill="#FFEAB3" stroke="#9C5030" strokeWidth="0.8" />
          )}
          {previewEquipped.accessory === "real-life-break" && (
            <rect x="88" y="20" width="24" height="9" rx="1" fill="#FF8D9E" stroke="#FFF" strokeWidth="0.8" />
          )}
        </g>
      </svg>
    </div>
  );
}
