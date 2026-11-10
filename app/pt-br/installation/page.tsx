"use client";

import { useState } from "react";
import Link from "next/link";
import { RiArrowLeftLine, RiArrowRightSLine, RiCheckLine, RiFileCopyLine } from "@remixicon/react";

import { DocsLayout } from "@/components/application/docs/docs-layout";
import { LinkButton } from "@/components/base/buttons/link-button";
import { LocaleHtml } from "@/components/application/docs/locale-html";
import { VITE_CONFIG_CODE, VITE_TSCONFIG_CODE, VITE_MAIN_CODE, RR_TSCONFIG_CODE, RR_ROOT_CODE, ASTRO_TSCONFIG_CODE, ASTRO_LAYOUT_CODE, ASTRO_USAGE_CODE, LAYOUT_CODE, BOARDUI_JSON_CODE, CONSUMING_GLOBALS_CODE, ADD_COMPONENT_CODE, DARK_LAYOUT_CODE, ACCENT_CODE, THEME_CSS, TYPOGRAPHY_CSS, GLOBALS_CSS, CX_TS } from "@/app/installation/page";
import { cx } from "@/utils/cx";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        const done = () => {
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1500);
        };
        if (navigator.clipboard?.writeText) {
          navigator.clipboard.writeText(text).then(done).catch(done);
        } else {
          done();
        }
      }}
      className="inline-flex shrink-0 items-center gap-1 rounded-full border border-border-button-default bg-background-primary-default px-2.5 py-1 text-caption-1-semibold text-text-secondary transition-colors hover:text-text-primary"
    >
      {copied ? <RiCheckLine className="size-3.5" aria-hidden /> : <RiFileCopyLine className="size-3.5" aria-hidden />}
      {copied ? "Copiado" : "Copiar"}
    </button>
  );
}

function Section({ title, children, id }: { title: string; children: React.ReactNode; id?: string }) {
  return (
    <section id={id} className="flex flex-col gap-3">
      <h2 className="text-title-2-medium text-text-primary">{title}</h2>
      {children}
    </section>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-caption-1-semibold text-text-secondary">
        {n} — {title}
      </p>
      {children}
    </div>
  );
}

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="overflow-x-auto rounded-xl border border-border-button-default bg-background-secondary-default p-4 font-mono text-caption-1-medium leading-6 text-text-primary">
      {code}
    </pre>
  );
}

function FileBlock({ file, code }: { file: string; code: string }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-caption-1-medium text-text-secondary">{file}</p>
        <CopyButton text={code} />
      </div>
      <CodeBlock code={code} />
    </div>
  );
}

function Command({ cmd }: { cmd: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-border-button-default bg-background-secondary-default px-4 py-3">
      <code className="font-mono text-caption-1-medium text-text-primary">{cmd}</code>
      <CopyButton text={cmd} />
    </div>
  );
}


function PkgCommand({ npm, pnpm, yarn }: { npm: string; pnpm: string; yarn: string }) {
  const [pm, setPm] = useState<"npm" | "pnpm" | "yarn">("npm");
  const cmd = pm === "npm" ? npm : pm === "pnpm" ? pnpm : yarn;
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        {(["npm", "pnpm", "yarn"] as const).map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => setPm(name)}
            className={cx(
              "rounded-full border px-3 py-1 text-caption-1-semibold transition-colors",
              pm === name
                ? "border-border-button-default bg-background-tertiary-default text-text-primary"
                : "border-border-button-default bg-background-primary-default text-text-secondary hover:text-text-primary",
            )}
          >
            {name}
          </button>
        ))}
      </div>
      <Command cmd={cmd} />
    </div>
  );
}

const FRAMEWORKS = ["Next.js", "Vite", "React Router", "Astro"] as const;
const FRAMEWORK_LABELS: Record<(typeof FRAMEWORKS)[number], string> = { "Next.js": "Next.js", Vite: "Vite", "React Router": "React o Roteador", Astro: "Astro" };
export default function InstallationPage() {
  const [framework, setFramework] = useState<(typeof FRAMEWORKS)[number]>("Next.js");
  return (
    <LocaleHtml locale="pt-br">
      <DocsLayout variant="library" title="Instalação" locale="pt-br">
      <div className="flex flex-col gap-8 pb-8">
        <div className="flex flex-col gap-3">
          <p className="text-body-regular text-text-secondary">
            BoardUI funciona em qualquer projeto React 19 + Tailwind CSS v4. Escolha seu framework abaixo
            para seguir o passo a passo ou copie os arquivos de base com as instruções de instalação manual.
          </p>
          <p className="text-body-regular text-text-secondary">
            Você pode conectar o servidor MCP do BoardUI e deixar seu agente fazer toda a instalação.
          </p>
          <div>
            <LinkButton href="/mcp" trailingIcon={RiArrowRightSLine}>
              Iniciar com MCP
            </LinkButton>
          </div>
        </div>

        <Section title="Início rápido">
          <p className="text-body-regular text-text-secondary">
            Usando um pacote de UI compartilhado ou aliases de importação personalizados? Siga a configuração
            de monorepo e alias antes da primeira instalação. A configuração padrão abaixo não precisa de
            arquivo de configuração.
          </p>
          <p className="text-body-regular text-text-secondary">
            Em qualquer projeto React + Tailwind v4,{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">init</code> instala os
            pacotes necessários, escreve o tema, tipografia e estilos globais mais o{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">cx</code> utilitário, e
            mostra as linhas que faltam adicionar ao layout raiz:
          </p>
          <Command cmd="npx boardui@latest init" />
          <p className="text-body-regular text-text-secondary">
            Depois, adicione qualquer componente. As dependências internas e os pacotes npm são resolvidos
            automaticamente:
          </p>
          <Command cmd="npx boardui@latest add button select date-picker" />
          <p className="text-body-regular text-text-secondary">
            Vai rodar o CLI em CI, em um script ou em um agente de codificação? Adicione{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">--yes</code> aos dois
            comandos. Sem um terminal para responder aos prompts, o CLI para com código de saída 1 em vez de
            adivinhar, e{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">--yes</code> responde com os
            padrões: instalar as dependências e manter os arquivos que já existem.
          </p>
        </Section>

        <Section title="Guias por framework">
          <p className="text-body-regular text-text-secondary">
            Configuração completa a partir de uma pasta vazia. Cada framework só muda a integração do
            Tailwind, do{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">@/</code> alias de
            importação e da folha de estilos global.
          </p>
          <div className="flex flex-wrap gap-2">
            {FRAMEWORKS.map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => setFramework(name)}
                className={cx(
                  "rounded-full border px-3.5 py-1.5 text-caption-1-semibold transition-colors",
                  framework === name
                    ? "border-border-button-default bg-background-tertiary-default text-text-primary"
                    : "border-border-button-default bg-background-primary-default text-text-secondary hover:text-text-primary",
                )}
              >
                {FRAMEWORK_LABELS[name]}
              </button>
            ))}
          </div>
          {framework === "Next.js" ? (
            <div className="flex flex-col gap-4">
              <Step n={1} title="Crie um projeto (pule se já tiver um).">
                <p className="text-body-regular text-text-secondary">
                  O create-next-app defaults — TypeScript, Tailwind CSS e o{" "}
                  <code className="font-mono text-caption-1-medium text-text-primary">@/*</code> alias —
                  igualar a configuração padrão do BoardUI.
                </p>
                <Command cmd="npx create-next-app@latest my-app" />
                <p className="text-body-2-regular text-text-tertiary">
                  # TypeScript: Yes · Tailwind CSS: Yes · import alias: @/* (the defaults)
                </p>
              </Step>
              <Step n={2} title="Execute init na raiz do projeto.">
                <p className="text-body-regular text-text-secondary">
                  Instala <code className="font-mono text-caption-1-medium text-text-primary">react-aria-components</code>,{" "}
                  <code className="font-mono text-caption-1-medium text-text-primary">tailwind-merge</code>, e{" "}
                  <code className="font-mono text-caption-1-medium text-text-primary">@remixicon/react</code>,
                  e escreve styles/ e utils/.
                </p>
                <Command cmd="npx boardui@latest init" />
              </Step>
              <Step n={3} title="Importe a folha de estilos e carregue a Inter no layout raiz.">
                <p className="text-body-regular text-text-secondary">
                  O tema do BoardUI lê a fonte de{" "}
                  <code className="font-mono text-caption-1-medium text-text-primary">--font-inter</code>,
                  então carregue a Inter com{" "}
                  <code className="font-mono text-caption-1-medium text-text-primary">next/font</code> no
                  lugar das fontes Geist do create-next-app e coloque a variável dela em{" "}
                  <code className="font-mono text-caption-1-medium text-text-primary">&lt;html&gt;</code>.
                  Sem isso, o texto volta para a fonte do sistema.
                </p>
                <CodeBlock code={LAYOUT_CODE} />
              </Step>
              <Step n={4} title="Adicione componentes.">
                <Command cmd="npx boardui@latest add button" />
              </Step>
            </div>
          ) : framework === "Vite" ? (
            <div className="flex flex-col gap-4">
              <Step n={1} title="Crie um projeto (pule se já tiver um).">
                <Command cmd="npm create vite@latest my-app -- --template react-ts" />
              </Step>
              <Step n={2} title="Instale Tailwind CSS v4 e registre o plugin do Vite.">
                <p className="text-body-regular text-text-secondary">
                  O plugin cuida da folha de estilos e dos tokens{" "}
                  <code className="font-mono text-caption-1-medium text-text-primary">@theme</code> para
                  você:
                </p>
                <Command cmd="npm install tailwindcss @tailwindcss/vite" />
                <FileBlock file="vite.config.ts" code={VITE_CONFIG_CODE} />
              </Step>
              <Step n={3} title="Adicione o alias de importação @/* ao tsconfig.json.">
                <FileBlock file="tsconfig.json" code={VITE_TSCONFIG_CODE} />
              </Step>
              <Step n={4} title="Execute init.">
                <p className="text-body-regular text-text-secondary">
                  Ele vai pedir algumas escolhas: um estilo padrão, uma cor base e se deve instalar
                  as regras de design. Em caso de dúvida, aceite os padrões — você pode alterá-los depois em{" "}
                  <code className="font-mono text-caption-1-medium text-text-primary">boardui.json</code>.
                </p>
                <PkgCommand
                  npm="npx boardui@latest init"
                  pnpm="pnpm dlx boardui@latest init"
                  yarn="yarn dlx boardui@latest init"
                />
              </Step>
              <Step n={5} title="Importe a folha de estilos no ponto de entrada do seu app.">
                <p className="text-body-regular text-text-secondary">
                  A etapa init criou{" "}
                  <code className="font-mono text-caption-1-medium text-text-primary">src/styles/globals.css</code>{" "}
                  para você:
                </p>
                <FileBlock file="main.tsx" code={VITE_MAIN_CODE} />
              </Step>
              <Step n={6} title="Adicione componentes.">
                <p className="text-body-regular text-text-secondary">Por exemplo, o Button:</p>
                <PkgCommand
                  npm="npx boardui@latest add button"
                  pnpm="pnpm dlx boardui@latest add button"
                  yarn="yarn dlx boardui@latest add button"
                />
              </Step>
            </div>
          ) : framework === "React Router" ? (
            <div className="flex flex-col gap-4">
              <Step n={1} title="Crie um projeto (pule se já tiver um).">
                <p className="text-body-regular text-text-secondary">
                  React Router v7 é o sucessor do Remix — estes passos aplicam-se a ambos.
                </p>
                <Command cmd="npx create-react-router@latest my-app" />
                <p className="text-body-2-regular text-text-tertiary">
                  # o template padrão já vem com o Tailwind CSS v4 configurado
                </p>
              </Step>
              <Step n={2} title="Adicione o alias de importação @/*.">
                <p className="text-body-regular text-text-secondary">
                  O template já usa{" "}
                  <code className="font-mono text-caption-1-medium text-text-primary">vite-tsconfig-paths</code>
                  , então basta uma entrada no tsconfig:
                </p>
                <FileBlock file="tsconfig.json" code={RR_TSCONFIG_CODE} />
              </Step>
              <Step n={3} title="Execute init apontando para a pasta do aplicativo.">
                <PkgCommand
                  npm="npx boardui@latest init --dir app"
                  pnpm="pnpm dlx boardui@latest init --dir app"
                  yarn="yarn dlx boardui@latest init --dir app"
                />
              </Step>
              <Step n={4} title="Importe a folha de estilos na rota raiz.">
                <FileBlock file="app/root.tsx" code={RR_ROOT_CODE} />
              </Step>
              <Step n={5} title="Adicione componentes apontando para a pasta do aplicativo.">
                <PkgCommand
                  npm="npx boardui@latest add button --dir app"
                  pnpm="pnpm dlx boardui@latest add button --dir app"
                  yarn="yarn dlx boardui@latest add button --dir app"
                />
              </Step>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <Step n={1} title="Crie um projeto e adicione as integrações de React e Tailwind.">
                <Command cmd="npm create astro@latest my-app" />
                <Command cmd="npx astro add react tailwind" />
                <p className="text-body-2-regular text-text-tertiary">
                  # instala a integração React e o plugin Vite do Tailwind CSS v4
                </p>
              </Step>
              <Step n={2} title="Adicione o alias de importação @/*.">
                <FileBlock file="tsconfig.json" code={ASTRO_TSCONFIG_CODE} />
              </Step>
              <Step n={3} title="Execute init na raiz do projeto.">
                <p className="text-body-regular text-text-secondary">
                  Os estilos e utilitários são gravados em{" "}
                  <code className="font-mono text-caption-1-medium text-text-primary">src/</code> automaticamente.
                </p>
                <PkgCommand
                  npm="npx boardui@latest init"
                  pnpm="pnpm dlx boardui@latest init"
                  yarn="yarn dlx boardui@latest init"
                />
              </Step>
              <Step n={4} title="Importe a folha de estilos no layout base.">
                <FileBlock file="src/layouts/Layout.astro" code={ASTRO_LAYOUT_CODE} />
              </Step>
              <Step n={5} title="Adicione componentes e hidrate-os em arquivos .astro.">
                <p className="text-body-regular text-text-secondary">
                  Componentes interativos precisam de uma diretiva{" "}
                  <code className="font-mono text-caption-1-medium text-text-primary">client:*</code> para
                  hidratar na página:
                </p>
                <PkgCommand
                  npm="npx boardui@latest add button"
                  pnpm="pnpm dlx boardui@latest add button"
                  yarn="yarn dlx boardui@latest add button"
                />
                <FileBlock file="src/pages/index.astro" code={ASTRO_USAGE_CODE} />
              </Step>
            </div>
          )}
          <p className="text-body-regular text-text-secondary">
            Usando outra coisa? Qualquer framework que execute React 19 com o Tailwind CSS v4 funciona — configure o{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">@/*</code> alias, execute{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">npx boardui init</code> e
            importe a folha de estilo. Ou pule o CLI inteiramente com os passos manuais abaixo.
          </p>

        </Section>
        <Section title="Monorepos e aliases personalizados" id="monorepos">
          <p className="text-body-regular text-text-secondary">
            Instale componentes em um pacote de UI compartilhado entre aplicativos ou adapte às pastas e aos aliases
            do seu projeto. Adicione o arquivo opcional{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">boardui.json</code> ao lado do pacote de destino{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">package.json</code>. Sem ela, a raiz habitual ou{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">src/</code>{" "}
            disposição e <code className="font-mono text-caption-1-medium text-text-primary">@/</code> As importações
            continuam as mesmas.
          </p>
          <Step n={1} title="Configure o pacote de destino.">
            <p className="text-body-regular text-text-secondary">
              Para um pacote chamado{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">@workspace/ui</code> em{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">packages/ui</code>, crie
              esta configuração e misture as exportações em seu manifesto de pacote. Adapte extensões de arquivo à fonte ou
              saída de compilação do seu pacote.
            </p>
            <CodeBlock code={BOARDUI_JSON_CODE} />
            <p className="text-body-regular text-text-secondary">
              Os caminhos são relativos ao pacote e precisam ficar dentro dele. Defina um caminho e um alias para
              cada grupo alterado; os demais mantêm os padrões. Aliases são prefixos de importação sem curingas
              e precisam ser resolvidos pelas exportações do pacote ou pelas configurações de TypeScript e do bundler.
            </p>
          </Step>
          <Step n={2} title="Execute BoardUI a partir do pacote compartilhado.">
            <Command cmd="cd packages/ui" />
            <Command cmd="npx boardui@latest init" />
            <Command cmd="npx boardui@latest add button" />
            <p className="text-body-regular text-text-secondary">
              Os componentes e suas dependências npm são instalados neste pacote. Por exemplo, uma importação de{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">@/utils/cx</code> torna- se{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">@workspace/ui/utils/cx</code>
              . Componentes gratuitos e Pro usam a mesma configuração. No MCP, passe o caminho absoluto
              deste pacote como <code className="font-mono text-caption-1-medium text-text-primary">projectDir</code>.
            </p>
          </Step>
          <Step n={3} title="Conecte cada aplicativo que usa o pacote.">
            <p className="text-body-regular text-text-secondary">
              Adicione o pacote de UI como dependência do workspace de cada aplicativo e confira se o bundler compila
              TypeScript e TSX. Importe a folha de estilos BoardUI e inclua o código compartilhado
              na detecção de fontes do Tailwind:
            </p>
            <CodeBlock code={CONSUMING_GLOBALS_CODE} />
            <p className="text-body-regular text-text-secondary">
              Importar esta folha de estilo do aplicativo da sua disposição do root ou ponto de entrada.{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">@source</code> caminho relativo
              à localização da folha de estilo. As importações de componentes poderão então usar{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">@workspace/ui/components/base/buttons/button</code>
              .
            </p>
          </Step>
          <p className="text-body-regular text-text-secondary">
            Configure os caminhos antes da instalação. Alterar a configuração não move arquivos existentes nem atualiza as
            importações do aplicativo. Use a configuração em vez de combiná-la com{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">--path</code> ou{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">--dir</code>. Templates de página completa
            ficam no aplicativo que usa o pacote: suas rotas e arquivos públicos não são divididos entre
            pacotes do workspace. Ao copiar manualmente, ajuste as importações originais.
          </p>
        </Section>
        <Section title="Instalação manual">
          <p className="text-body-regular text-text-secondary">
            Prefere configurar manualmente? Prepare um projeto com Tailwind CSS v4 e siga estas etapas.
          </p>
          <Step n={1} title="Instale os pacotes necessários">
            <Command cmd="npm install react-aria-components tailwind-merge @remixicon/react" />
          </Step>
          <Step n={2} title="Criar styles/theme.css com as fichas de design.">
            <FileBlock file="styles/theme.css" code={THEME_CSS} />
          </Step>
          <Step n={3} title="Criar styles/typography.css com a escala de tipo.">
            <FileBlock file="styles/typography.css" code={TYPOGRAPHY_CSS} />
          </Step>
          <Step n={4} title="Criar styles/globals.css como seu ponto de entrada Tailwind.">
            <FileBlock file="styles/globals.css" code={GLOBALS_CSS} />
          </Step>
          <Step n={5} title="Adicionar o utils/cx.ts utilitário de fusão de classe.">
            <FileBlock file="utils/cx.ts" code={CX_TS} />
          </Step>
          <Step n={6} title="Importe a folha de estilos e carregue a Inter no layout raiz.">
            <CodeBlock code={LAYOUT_CODE} />
          </Step>
        </Section>
        <Section title="Adicione um componente">
          <p className="text-body-regular text-text-secondary">
            Componentes em que vivem{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">components/base/…</code> e
            importação através da <code className="font-mono text-caption-1-medium text-text-primary">@/</code>{" "}
            alias. Copie o código da página de um componente ou use a CLI. Depois, importe:
          </p>
          <CodeBlock code={ADD_COMPONENT_CODE} />
          <p className="text-body-regular text-text-secondary">
            Navegar por tudo com{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">npx boardui list</code>, ou
            copiar comandos de instalação por componente a partir das páginas de componentes individuais.
          </p>
        </Section>

        <Section title="BoardUI Pro">
          <p className="text-body-regular text-text-secondary">
            Após ativar sua licença, os componentes e templates Pro são instalados pela mesma CLI, sem extrair
            arquivos zip nem copiar e colar. Sua chave de licença está no recibo do Lemon Squeezy (e em{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">My Orders</code> em Lemon
            Squeezy). Uma compra desbloqueia tudo, com atualizações incluídas.
          </p>
          <p className="text-body-regular text-text-secondary">
            Ative a licença uma vez na sua máquina:
          </p>
          <Command cmd="npx boardui@latest login YOUR_LICENSE_KEY" />
          <p className="text-body-regular text-text-secondary">
            Depois disso, os componentes Pro funcionam como os gratuitos. A CLI instala o código-fonte e todos
            os componentes gratuitos dos quais ele depende:
          </p>
          <Command cmd="npx boardui@latest add agent-progress" />
          <p className="text-body-regular text-text-secondary">
            Os templates são instalados da mesma forma. Um comando adiciona a página completa, seus componentes
            e suas imagens ao projeto (
            <code className="font-mono text-caption-1-medium text-text-primary">template-home-dashboard</code>,{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">template-medical-profile</code>,{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">template-ai-chat</code>,{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">template-ai-image-generation</code>,{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">template-ai-profile</code>):
          </p>
          <Command cmd="npx boardui@latest add template-ai-chat" />
          <p className="text-body-regular text-text-secondary">
            Para atualizar um componente já instalado, execute o mesmo comando novamente com{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">--overwrite</code>. Cada
            componente Pro é marcado com um{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">PRO</code> emblema na{" "}
            <Link href="/components" className="text-accent-600 underline">
              página de componentes
            </Link>
            .
          </p>
          <p className="text-body-regular text-text-secondary">
            Cada máquina em que você faz login usa um dos assentos da sua licença: um no 1 ano de atualizações e
            no Acesso vitalício, cinco no Ilimitado para startups. Licenças compradas pelo Lemon Squeezy mantêm
            o limite com que foram vendidas.{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">npx boardui logout</code>{" "}
            libera o assento da máquina atual; em CI, skip{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">login</code> e definir o{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">BOARDUI_LICENSE_KEY</code>{" "}
            como variável de ambiente. Os templates também estão disponíveis para download como projetos
            completos no seu pedido do Lemon Squeezy. Perdeu sua chave? Escreva para hi@boardui.com.
          </p>
        </Section>
        <Section title="Modo escuro">
          <p className="text-body-regular text-text-secondary">
            O modo escuro é ativado manualmente por uma classe. O padrão é o modo claro, e BoardUI salva sua escolha em{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">boardui:theme</code> e não usa a preferência do sistema operacional. Leia o tema salvo antes da hidratação para evitar um flash do modo claro nas próximas visitas.
          </p>
          <CodeBlock code={DARK_LAYOUT_CODE} />
          <p className="text-body-regular text-text-secondary">
            Adicione o controle reutilizável, em seguida, coloque{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">&lt;ThemeToggle /&gt;</code>{" "}
            na barra lateral ou nas configurações. Ele mantém os seletores visíveis sincronizados e salva a escolha automaticamente.
          </p>
          <Command cmd="npx boardui@latest add theme-toggle" />
          <p className="text-body-regular text-text-secondary">
            Componentes usam somente utilitários semânticos. Personalize os valores de luz em{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">:root</code> e valores escuros dentro{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">.dark</code> dentro{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">styles/theme.css</code>; evitar o nível de componentes{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">dark:</code> substitui e cores estruturais brutas. Veja o mapeamento completo no{" "}
            <Link href="/components/color" className="text-accent-600 underline">
              Página de cor
            </Link>
            .
          </p>
        </Section>

        <Section title="Cor de destaque">
          <p className="text-body-regular text-text-secondary">
            A cor do CTA é uma decisão temática, não são 50 as edições de componentes. Cada superfície interativa - gradientes de botões primários, botões fantasma e link, caixas de seleção, rádios, switches, controles deslizantes, abas, o item da barra lateral selecionado, anéis de foco - lê de um{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">--color-accent-50…950</code>{" "}
            rampa de entrada <code className="font-mono text-caption-1-medium text-text-primary">styles/theme.css</code>,
            que é o padrão para azul. Sobreponha essas onze variáveis após a importação do tema e todo o sistema re- tints no modo claro e escuro; gráficos e cores de status mantêm suas próprias tonalidades.
          </p>
          <p className="text-caption-1-semibold text-text-secondary">
            estilos/globals.css (ou qualquer folha de estilo importada)
          </p>
          <CodeBlock code={ACCENT_CODE} />
          <p className="text-body-regular text-text-secondary">
            Você não precisa escrever este bloco à mão. Abra qualquer página de componente, clique no botão de paleta no canto inferior direito e experimente matizes ao vivo, ou escolha uma cor totalmente personalizada. Ela fica exatamente em accent-500, onde o gradiente dos botões primários começa, e o BoardUI constrói os outros dez tons em volta dela. Quando estiver do seu agrado,{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">Copy theme CSS</code> Exporta exactamente esta sobreposição.{" "}
            <Link href="/components/color" className="text-accent-600 underline">
              Página de cor
            </Link>{" "}
            tem os mesmos controles em linha.
          </p>
        </Section>

        <Section title="Tecnologias">
          <p className="text-body-regular text-text-secondary">
            Os componentes BoardUI usam React 19, TypeScript 5, Tailwind CSS v4 e React Aria para acessibilidade. O código é seu, sem pacote de runtime e sem depender de outros mantenedores. Os cards de gráficos também usam Recharts, e a tabela de dados usa TanStack Table. A CLI instala essas dependências automaticamente quando necessário.
          </p>
        </Section>

        <Link
          href="/components"
          className="inline-flex items-center gap-1.5 text-body-medium text-text-secondary transition-colors hover:text-text-primary"
        >
          <RiArrowLeftLine className="size-4" aria-hidden />
          Voltar para todos os componentes
        </Link>
      </div>
    </DocsLayout>
    </LocaleHtml>
  );
}

// 模型翻译：Add the @/* import alias to tsconfig.json.
// 模型翻译：Run init.
// 模型翻译：Import the stylesheet in your app entry.
// 模型翻译：Add the @/* import alias.（2 处）
// 模型翻译：The plugin handles the stylesheet and the @theme tokens for you:
// 模型翻译：It will prompt you for a few choices: a default style, a base color, and whether to install the design rules. When in doubt, accept the defaults — you can change them later in boardui.json.
// 模型翻译：The init step created src/styles/globals.css for you:
// 模型翻译：For example, the Button:
// 模型翻译：# the default template ships with Tailwind CSS v4 already wired up
// 模型翻译：The template already uses vite-tsconfig-paths, so a tsconfig entry is all you need:
