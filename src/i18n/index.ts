/**
 * Demo-app i18n module.
 *
 * Merges demo-specific messages with the lib's generic messages.
 *
 * Usage in components (reactive):
 * ```svelte
 * <script>
 *   import { t } from '../i18n';
 *   import { localeStore } from '@edujed/jedsvelted-ui/i18n';
 * </script>
 * <h1>{t('welcome', $localeStore)}</h1>
 * <button>{t('save', $localeStore)}</button>
 * ```
 *
 * The `$localeStore` in the template is reactive — when the locale changes,
 * the component re-renders and `t()` is called again with the new locale.
 */

import { get } from "svelte/store";
import {
  localeStore,
  t as libT,
  type Locale,
} from "@edujed/jedsvelted-ui/i18n";
import en from "./locales/en";
import ptBR from "./locales/pt-BR";

/** Message keys specific to this demo app. */
export type DemoMessageKey = keyof typeof en;

/** Shape every demo locale must satisfy. */
export type DemoMessages = Record<DemoMessageKey, string>;

const DEMO_LOCALES: Record<Locale, DemoMessages> = { en, "pt-BR": ptBR };

/**
 * Translates a message key for the given locale.
 * Checks demo-specific messages first, then falls back to the lib's messages.
 * Supports `{placeholder}` substitution.
 *
 * @param key - Message key (demo-specific or lib generic)
 * @param params - Optional placeholder values
 * @param locale - Optional locale (defaults to current localeStore value)
 */
export function t(
  key: DemoMessageKey | Parameters<typeof libT>[0],
  params?: Record<string, string | number>,
  locale?: Locale,
): string {
  const currentLocale = locale ?? get(localeStore);
  const demoTemplate = (DEMO_LOCALES[currentLocale] as Record<string, string>)[
    key as string
  ];

  if (demoTemplate !== undefined) {
    if (!params) return demoTemplate;
    return demoTemplate.replace(/\{(\w+)\}/g, (match, name: string) =>
      name in params ? String(params[name]) : match,
    );
  }

  // Fall through to the lib's generic messages
  return libT(key as Parameters<typeof libT>[0], params);
}
