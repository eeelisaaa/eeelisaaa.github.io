ico() { # ico NAME COLOR [SIZE]
  local s="${3:-18}" p=""
  case "$1" in
    li) p='<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle>';;
    gh) p='<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.9a3.4 3.4 0 0 0-.9-2.6c3.1-.4 6.4-1.6 6.4-7A5.4 5.4 0 0 0 20 4.8 5 5 0 0 0 19.9 1s-1.2-.4-3.9 1.5a13.4 13.4 0 0 0-7 0C6.3.6 5.1 1 5.1 1A5 5 0 0 0 5 4.8a5.4 5.4 0 0 0-1.5 3.8c0 5.4 3.3 6.6 6.4 7a3.4 3.4 0 0 0-.9 2.6V23"></path>';;
    mail) p='<rect x="3" y="5" width="18" height="14" rx="2"></rect><path d="m3 7 9 6 9-6"></path>';;
    moon) p='<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"></path>';;
    sun) p='<circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"></path>';;
    arrow) p='<path d="M5 12h14"></path><path d="m13 6 6 6-6 6"></path>';;
    ne) p='<path d="M7 17 17 7"></path><path d="M8 7h9v9"></path>';;
    dl) p='<path d="M12 3v12"></path><path d="m7 10 5 5 5-5"></path><path d="M4 20h16"></path>';;
  esac
  echo "<svg width=\"$s\" height=\"$s\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"$2\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\">$p</svg>"
}
ico2() { # extra icons: ico2 NAME COLOR [SIZE]
  local s="${3:-18}" p=""
  case "$1" in
    ig) p='<rect x="3" y="3" width="18" height="18" rx="5"></rect><circle cx="12" cy="12" r="4"></circle><circle cx="17.2" cy="6.8" r="0.8"></circle>';;
    fb) p='<path d="M13 22v-8h3l1-4h-4V7.5A1.5 1.5 0 0 1 14.5 6H17V2h-3a5 5 0 0 0-5 5v3H6v4h3v8z"></path>';;
    globe) p='<circle cx="12" cy="12" r="9"></circle><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"></path>';;
    menu) p='<path d="M4 7h16M4 12h16M4 17h16"></path>';;
    left) p='<path d="M19 12H5"></path><path d="m11 18-6-6 6-6"></path>';;
    pin) p='<path d="M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z"></path><circle cx="12" cy="10" r="2.5"></circle>';;
    up) p='<path d="M12 19V5"></path><path d="m6 11 6-6 6 6"></path>';;
  esac
  echo "<svg width=\"$s\" height=\"$s\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"$2\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\">$p</svg>"
}
