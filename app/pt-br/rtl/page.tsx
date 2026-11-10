"use client";

import { RiArrowRightSLine } from "@remixicon/react";

import { DocsLayout } from "@/components/application/docs/docs-layout";
import { PkgCommand } from "@/components/application/docs/code-tabs";
import { PrevNext } from "@/components/application/docs/prev-next";
import { LinkButton } from "@/components/base/buttons/link-button";
import { LocaleHtml } from "@/components/application/docs/locale-html";
import { RtlComponentDemo, RtlProviderDemo, RtlTemplateDemo } from "../../rtl/rtl-demos";

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="flex scroll-mt-14 flex-col gap-3">
      <h2 className="text-title-2-medium text-text-primary">{title}</h2>
      {children}
    </section>
  );
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-title-3-semibold text-text-primary">{title}</h3>
      {children}
    </div>
  );
}

function CodeBlock({ code }: { code: string }) {
  return (
    <pre dir="ltr" className="overflow-x-auto rounded-xl border border-border-button-default bg-background-secondary-default p-4 font-mono text-caption-1-medium leading-6 text-text-primary">
      {code}
    </pre>
  );
}

const LAYOUT_CODE = `import { DirectionProvider } from "@/components/foundations/direction/direction";
import "@/styles/globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <DirectionProvider locale="ar">{children}</DirectionProvider>
      </body>
    </html>
  );
}`;

const MIXED_CODE = `// Works in Next.js, Vite, React Router, and other React apps.
<DirectionProvider locale="he">
  <AccountSettings />
</DirectionProvider>

// Providers can be nested for a region in another language.
<DirectionProvider locale="ar">
  <Dashboard />
  <DirectionProvider locale="en-US">
    <EnglishSupportPanel />
  </DirectionProvider>
</DirectionProvider>`;

const DIRECTION_SOURCE = `// components/foundations/direction/direction.tsx
"use client";

import type { HTMLAttributes, ReactNode } from "react";
import { I18nProvider, useLocale } from "react-aria-components";
import { cx } from "@/utils/cx";

export type Direction = "ltr" | "rtl";

export interface DirectionProviderProps extends Omit<HTMLAttributes<HTMLDivElement>, "dir" | "lang" | "children"> {
  /** BCP 47 language tag. Arabic and Hebrew resolve to RTL; Chinese to LTR. */
  locale: string;
  children: ReactNode;
}

/** Keeps CSS direction, React Aria keyboard behavior and portalled menus in sync.
 * Use at the app root, or nest providers for regions in another language.
 * The default display: contents boundary preserves the surrounding layout.
 */
export function DirectionProvider({ locale, ...props }: DirectionProviderProps) {
  return (
    <I18nProvider locale={locale}>
      <DirectionBoundary {...props} />
    </I18nProvider>
  );
}

function DirectionBoundary({ children, className, ...props }: Omit<DirectionProviderProps, "locale">) {
  const { locale, direction } = useLocale();
  return <div {...props} lang={locale} dir={direction} className={cx("contents", className)}>{children}</div>;
}

/** Also works inside a React Aria I18nProvider. */
export function useDirection(): Direction {
  return useLocale().direction;
}`;

const MIXED_CONTENT_CODE = `<Input label="البريد الإلكتروني" type="email" /> // value defaults to LTR
<Input label="الاسم" inputDir="auto" />

<p>تم إرسال رسالة إلى <bdi>sara@example.com</bdi></p>
<pre dir="ltr"><code>npm run build</code></pre>`;

const PORTAL_CODE = `import { createPortal } from "react-dom";
import { useDirection } from "@/components/foundations/direction/direction";

function CustomOverlay() {
  const direction = useDirection();
  return createPortal(<div dir={direction}>…</div>, document.body);
}`;

/** RTL Support page, mirroring boardui.com/rtl. */
export default function RtlPage() {
  return (
    <LocaleHtml locale="pt-br">
      <DocsLayout variant="library" hidePrevNext locale="pt-br" title="Suporte a RTL">
        <div className="flex flex-col gap-8 pb-8">
          <div className="flex flex-col gap-3">
            <p className="text-body-regular text-text-secondary">
              BoardUI tem suporte completo a RTL para árabe, hebraico e outros idiomas escritos da direita para
              a esquerda, nos componentes gratuitos, blocos Pro e templates.
            </p>
          </div>

          <Section id="examples" title="Exemplos de componentes">
            <p className="text-body-regular text-text-secondary">
              Troque o idioma e teste os controles. Layout, alinhamento do texto, espaçamentos, setas de
              navegação, comportamento dos controles deslizantes e posição das sobreposições seguem a direção
              escolhida. Os exemplos incluem um card de gráfico Pro.
            </p>
            <RtlComponentDemo />
          </Section>

          <Section id="templates" title="Exemplos de templates">
            <p className="text-body-regular text-text-secondary">
              Explore os templates reais com conteúdo de exemplo em árabe, hebraico e inglês. Troque o idioma
              para ver os textos, o layout e as interações juntos.
            </p>
            <RtlTemplateDemo />
          </Section>

          <Section id="direction-provider" title="Provider de direção">
            <p className="text-body-regular text-text-secondary">
              Uma localidade explícita mantém a direção CSS, a navegação por teclado, os calendários e os menus
              em portais sincronizados. Use providers aninhados em regiões com vários idiomas. O wrapper padrão
              de conteúdo preserva seu layout.
            </p>
            <RtlProviderDemo />
          </Section>

          <Section id="setup" title="Configurar RTL">
            <p className="text-body-regular text-text-secondary">
              Instalar o <code className="font-mono text-caption-1-medium text-text-primary">DirectionProvider</code>,
              depois defina o idioma e a direção do aplicativo. Não é necessário usar uma flag RTL na CLI nem
              uma versão diferente do componente.
            </p>
            <PkgCommand
              npm="npx boardui@latest add direction"
              pnpm="pnpm dlx boardui@latest add direction"
              yarn="yarn dlx boardui@latest add direction"
            />
            <p className="text-caption-1-semibold text-text-secondary">app/layout.tsx</p>
            <CodeBlock code={LAYOUT_CODE} />
            <p className="text-body-regular text-text-secondary">
              <code className="font-mono text-caption-1-medium text-text-primary">locale=&quot;ar&quot;</code>{" "}
              resolve para RTL. Use <code className="font-mono text-caption-1-medium text-text-primary">he</code>{" "}
              para o hebraico, <code className="font-mono text-caption-1-medium text-text-primary">en-US</code>{" "}
              para o inglês, ou{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">zh-CN</code> para chinês, que
              permanece LTR.{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">dir</code> sozinho só atualiza
              o CSS. O provider também configura a navegação por teclado, os calendários e os menus em portais
              do React Aria.
            </p>
            <SubSection title="Regiões com vários idiomas">
              <CodeBlock code={MIXED_CODE} />
            </SubSection>
            <p className="text-body-regular text-text-secondary">
              Para instalar manualmente, conclua a BoardUI setup , instale{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">react-aria-components</code> e
              copie o código do provider abaixo.
            </p>
            <div>
              <LinkButton href="/installation" trailingIcon={RiArrowRightSLine}>
                Configuração do BoardUI
              </LinkButton>
            </div>
            <p className="text-caption-1-semibold text-text-secondary">
              components/foundations/direction/direction.tsx
            </p>
            <CodeBlock code={DIRECTION_SOURCE} />
          </Section>

          <Section id="existing-projects" title="Projetos existentes">
            <p className="text-body-regular text-text-secondary">
              BoardUI instala código-fonte no seu projeto. Adicione o provider e atualize os componentes
              instalados antes do suporte a RTL. Faça backup das suas personalizações antes de usar{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">--overwrite</code>, ou mescle
              o código-fonte atual nos arquivos que você editou. Atualize o template e as dependências
              compartilhadas, como botões, estilos de menu, ícones e CSS global.
            </p>
            <PkgCommand
              npm="npx boardui@latest add button select tabs --overwrite"
              pnpm="pnpm dlx boardui@latest add button select tabs --overwrite"
              yarn="yarn dlx boardui@latest add button select tabs --overwrite"
            />
            <p className="text-body-regular text-text-secondary">
              Componentes e templates Pro usam o mesmo provider e os mesmos estilos lógicos. Instale as
              atualizações pela CLI com sua licença ou baixe o pacote de código atualizado. O aplicativo pode
              mudar de localidade durante a execução sem reinstalar componentes.
            </p>
          </Section>

          <Section id="directional-styles" title="Estilos direcionais">
            <p className="text-body-regular text-text-secondary">
              Utilização <code className="font-mono text-caption-1-medium text-text-primary">ps / pe</code>,{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">ms / me</code>,{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">start / end</code>, e{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">text-start / text-end</code>{" "}
              em layouts personalizados. Flex e grade siga automaticamente a direção da região.{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">rtl:rotate-180</code>; ícones
              passados para botões BoardUI são espelhados quando eles são setas de navegação.
            </p>
            <p className="text-body-regular text-text-secondary">
              Mantenha endereços de e-mail, URLs, dígitos OTP e código-fonte na ordem LTR natural. Use{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">inputDir</code> controlar o
              valor de um campo independentemente do seu rótulo, e{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">bdi</code> para isolar textos
              mistos. Os eixos e dados dos gráficos mantêm a ordem das coordenadas; o layout dos cards e os
              controles seguem RTL.
            </p>
            <SubSection title="Conteúdo misto">
              <CodeBlock code={MIXED_CONTENT_CODE} />
            </SubSection>
            <p className="text-body-regular text-text-secondary">
              As sobreposições BoardUI preservam a localidade. Ao criar um portal personalizado, passe a direção
              ao elemento raiz para que ele seja renderizado corretamente fora da região DOM original.
            </p>
            <SubSection title="Portais personalizados">
              <CodeBlock code={PORTAL_CODE} />
            </SubSection>
            <p className="text-body-regular text-text-secondary">
              Pilha de notificação padrão{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">bottom-end</code>. Utilização{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">top-start</code>,{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">top-end</code>, ou{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">bottom-start</code> para
              cantos lógicos. Explícito{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">esquerda</code> e{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">direita</code> As posições
              mantêm o seu significado físico.
            </p>
          </Section>

          <Section id="localization" title="Localização e fontes">
            <p className="text-body-regular text-text-secondary">
              O suporte a RTL cuida do layout e das interações. Os exemplos acima incluem traduções de
              demonstração em árabe e hebraico. Rótulos, nomes acessíveis, moedas e mensagens do aplicativo são
              responsabilidade da sua camada de tradução. React Aria fornece textos de interação localizados;
              use <code className="font-mono text-caption-1-medium text-text-primary">Intl.NumberFormat</code> e{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">Intl.DateTimeFormat</code>{" "}
              para os dados de aplicativo.
            </p>
            <p className="text-body-regular text-text-secondary">
              Escolha uma fonte que inclua os caracteres do idioma, como Noto Sans Arabic ou Noto Sans Hebrew.
              Carregue-a com as ferramentas do seu framework e adicione à configuração de{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">--font-sans</code>. O texto em
              árabe precisa de letras conectadas e uma altura de linha confortável; evite espaçamento extra
              entre letras. Chinês usa a mesma base de localidade com layout LTR.
            </p>
            <p className="text-body-regular text-text-secondary">
              A abordagem segue o princípio do estilo lógico utilizado por shadcn/ui e utilizações React o
              fornecedor local da Aria para os primitivos de interação existentes da BoardUI.
            </p>
          </Section>

          <PrevNext
            locale="pt-br"
            prev={{ href: "/skill", label: "Skills para agentes", sub: "Conhecimento para o seu agente", enLabel: "Agent Skills" }}
            next={{ href: "/components/color", label: "Cores", sub: "Tokens de cores semânticas", enLabel: "Color" }}
          />
        </div>
      </DocsLayout>
    </LocaleHtml>
  );
}
