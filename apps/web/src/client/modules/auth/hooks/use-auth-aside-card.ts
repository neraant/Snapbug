import { useEffect, useState } from "react";

import { texts } from "@/client/modules/auth/consts/texts.const";

type AuthAsideCard = (typeof texts.auth.aside.cards)[number];

function pickRandomCard(current?: AuthAsideCard): AuthAsideCard {
  const cards = texts.auth.aside.cards;
  let next = cards[Math.floor(Math.random() * cards.length)]!;

  while (next === current) {
    next = cards[Math.floor(Math.random() * cards.length)]!;
  }

  return next;
}

const CARD_ROTATION_INTERVAL_MS = 5000;

export function useAuthAsideCard(): AuthAsideCard {
  const [card, setCard] = useState<AuthAsideCard>(() => pickRandomCard());

  useEffect(() => {
    const id = window.setInterval(() => {
      setCard((current) => pickRandomCard(current));
    }, CARD_ROTATION_INTERVAL_MS);

    return () => {
      window.clearInterval(id);
    };
  }, []);

  return card;
}
