"use client";

import { useLocale } from "next-intl";

import { Header } from "@/components";
import { useAuthStore } from "@/store";

type HeaderContainerProps = {
  onAddClick: () => void;
  onProfileClick: () => void;
};

export function HeaderContainer(props: HeaderContainerProps) {
  const locale = useLocale();
  const user = useAuthStore((state) => state.user);

  return (
    <Header
      onAddClick={props.onAddClick}
      onProfileClick={props.onProfileClick}
      userAvatar={user?.user_metadata?.avatar_url ?? null}
      userName={user?.user_metadata?.full_name ?? user?.email ?? null}
      locale={locale}
    />
  );
}
