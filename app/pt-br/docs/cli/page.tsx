"use client";

import { useState } from "react";
import Link from "next/link";
import { RiArrowLeftLine, RiArrowRightSLine, RiCheckLine, RiFileCopyLine } from "@remixicon/react";

import { DocsLayout } from "@/components/application/docs/docs-layout";
import { LinkButton } from "@/components/base/buttons/link-button";
import { LocaleHtml } from "@/components/application/docs/locale-html";

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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-title-2-medium text-text-primary">{title}</h2>
      {children}
    </section>
  );
}

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="overflow-x-auto rounded-xl border border-border-button-default bg-background-secondary-default p-4 font-mono text-caption-1-medium leading-6 text-text-primary">
      {code}
    </pre>
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

function OptionTable({ rows }: { rows: [string, string][] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border-button-default">
      <table className="w-full border-collapse text-start">
        <thead>
          <tr className="border-b border-separator-border bg-background-secondary-default">
            <th className="px-4 py-2.5 text-start text-caption-1-semibold text-text-secondary">Opção</th>
            <th className="px-4 py-2.5 text-start text-caption-1-semibold text-text-secondary">Descrição</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([option, description]) => (
            <tr key={option} className="border-b border-separator-border last:border-b-0">
              <td className="px-4 py-2.5 font-mono text-caption-1-medium text-text-primary">{option}</td>
              <td className="px-4 py-2.5 text-body-regular text-text-secondary">{description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const INIT_OPTIONS: [string, string][] = [
  ["-y, --yes", "Skip confirmation prompts"],
  ["-o, --overwrite", "Overwrite existing files"],
  ["-d, --dir <dir>", "Target directory (defaults to the project source root)"],
  ["--pro", "Also install dependencies used by BoardUI Pro components"],
  ["--postcss", "Set up @tailwindcss/postcss even when Tailwind already compiles another way"],
];

const ADD_OPTIONS: [string, string][] = [
  ["-a, --all", "Add every component in the registry"],
  ["-p, --path <path>", "Custom directory to write files into"],
  ["-d, --dir <dir>", "Target directory (defaults to the project source root)"],
  ["-o, --overwrite", "Overwrite existing files"],
  ["-y, --yes", "Skip prompts — keep existing files, install dependencies"],
];

const SKILL_OPTIONS: [string, string][] = [
  ["-g, --global", "Install to ~/.claude/skills/boardui instead of the project"],
  ["-c, --client <client>", "Install to ~/.agents/skills/boardui (codex, gemini)"],
  ["-p, --path <dir>", "Custom directory to install the skill into"],
  ["-f, --force", "Overwrite an existing install (how you update)"],
];

/** CLI docs page, mirroring boardui.com/docs/cli. */
export default function CliPage() {
  return (
    <LocaleHtml locale="pt-br">
      <DocsLayout variant="docs" locale="pt-br" title="CLI">
        <div className="flex flex-col gap-8 pb-8">
          <div className="flex flex-col gap-3">
            <p className="text-body-regular text-text-secondary">
              A <code className="font-mono text-caption-1-medium text-text-primary">boardui</code> O CLI copia
              os arquivos de origem de componentes diretamente para o seu projeto — nenhum pacote em tempo de
              execução, o código é seu. Ele resolve as dependências internas de cada componente (utils,
              ícones, outros componentes) transitivamente e instala quaisquer pacotes npm em falta com o seu
              gerenciador de pacotes.
            </p>
            <Command cmd="npx boardui@latest add button select date-picker" />
          </div>

          <Section title="init">
            <p className="text-body-regular text-text-secondary">
              Configura o BoardUI em um projeto Next.js existente: instala as dependências de tempo de execução (
              <code className="font-mono text-caption-1-medium text-text-primary">react-aria-components</code>,{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">tailwind-merge</code>,{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">@remixicon/react</code>,
              Tailwind v4), escreve <code className="font-mono text-caption-1-medium text-text-primary">styles/theme.css</code>,{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">styles/typography.css</code>,{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">styles/globals.css</code>, e{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">utils/cx.ts</code>, e depois
              mostra as linhas a adicionar ao layout raiz: a importação da folha de estilos e a fonte Inter.
            </p>
            <p className="text-body-regular text-text-secondary">
              Quando o projeto já compila o Tailwind v4, como o create-next-app 16.4 e versões posteriores
              fazem com{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">@tailwindcss/turbopack</code>,
              o init não mexe no PostCSS. Caso contrário, ele instala{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">@tailwindcss/postcss</code> e
              mostra a linha do{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">postcss.config.mjs</code>.
              Passe <code className="font-mono text-caption-1-medium text-text-primary">--postcss</code> para
              configurar o PostCSS de qualquer forma.
            </p>
            <Command cmd="npx boardui@latest init" />
            <OptionTable rows={INIT_OPTIONS} />
          </Section>

          <Section title="adicionar">
            <p className="text-body-regular text-text-secondary">
              Adiciona um ou mais componentes. Por padrão, os arquivos mantêm a mesma estrutura que este site (
              <code className="font-mono text-caption-1-medium text-text-primary">components/base/…</code>,{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">components/application/…</code>
              ), as importações utilizam{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">@/</code> alias, e os
              arquivos existentes são ignorados a menos que você passe{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">--overwrite</code>. Execute-o
              sem argumentos para um selecionador interativo.
            </p>
            <Command cmd="npx boardui@latest add            # interactive picker" />
            <Command cmd="npx boardui@latest add table pagination" />
            <Command cmd="npx boardui@latest add --all" />
            <OptionTable rows={ADD_OPTIONS} />
          </Section>

          <Section title="CI, scripts e agentes de codificação">
            <p className="text-body-regular text-text-secondary">
              <code className="font-mono text-caption-1-medium text-text-primary">init</code> e{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">add</code> perguntam antes
              de instalar pacotes ou mexer em arquivos que já existem. Sem um terminal para responder, como em
              CI, em um script ou em um agente de codificação, eles param com código de saída 1 em vez de
              adivinhar. Passe{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">--yes</code> para aceitar os
              padrões: instalar as dependências e manter os arquivos existentes. Adicione{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">--overwrite</code> para
              substituir os arquivos existentes e informe os nomes dos componentes ou passe{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">--all</code> em vez de usar o
              seletor.
            </p>
            <Command cmd="npx boardui@latest init --yes" />
            <Command cmd="npx boardui@latest add button select --yes" />
          </Section>

          <Section title="Caminhos personalizados e monorrepos">
            <p className="text-body-regular text-text-secondary">
              Adicionar um opcional{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">boardui.json</code> ao lado do
              pacote de destino{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">package.json</code> para
              configurar onde os arquivos vão e quais os nomes falsos que eles usam. Ambos{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">init</code> e{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">adicionar</code> lê- lo,
              incluindo para componentes Pro. Sem ele, a raiz existente e{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">src/</code> layouts
              comportam-se como antes.
            </p>
            <p className="text-body-regular text-text-secondary">
              Configurar par{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">paths</code> e{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">aliases</code> entradas para
              componentes, utils, hooks, estilos ou lib. Execute o CLI dentro do pacote de destino para que as
              dependências do npm também instalem lá. Os mapeamentos configurados não podem ser combinados com{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">--path</code> ou{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">--dir</code>; essas bandeiras
              permanecem disponíveis para projetos não configurados. A alteração da configuração não migra
              arquivos instalados anteriormente.
            </p>
            <div>
              <LinkButton href="/installation" trailingIcon={RiArrowRightSLine}>
                Configure um pacote de UI compartilhado e aplicativos de consumo
              </LinkButton>
            </div>
          </Section>

          <Section title="lista">
            <p className="text-body-regular text-text-secondary">
              Imprime todos os componentes disponíveis agrupados por tipo — componentes de base, blocos de
              aplicativo e fundações.
            </p>
            <Command cmd="npx boardui@latest list" />
          </Section>

          <Section title="habilidade">
            <p className="text-body-regular text-text-secondary">
              Instala o Skill do BoardUI para agentes (<code className="font-mono text-caption-1-medium text-text-primary">SKILL.md</code>{" "}
              mais catálogo, temas e referências de padrões) assim AI assistentes como Claude Code e Codex
              carregar BoardUI saber cada sessão.{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">.claude/skills/boardui</code>;
              re-run com <code className="font-mono text-caption-1-medium text-text-primary">--force</code> Para
              atualizar.
            </p>
            <Command cmd="npx boardui@latest skill" />
            <OptionTable rows={SKILL_OPTIONS} />
            <div>
              <LinkButton href="/skill" trailingIcon={RiArrowRightSLine}>
                Skill do BoardUI para agentes
              </LinkButton>
            </div>
          </Section>

          <Section title="Atualizando componentes">
            <p className="text-body-regular text-text-secondary">
              Componentes instalados são cópias — suas para editar, nunca tocadas silenciosamente. Para retirar
              a versão mais recente de um componente do registro, execute novamente{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">adicionar</code> com{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">--overwrite</code>.
            </p>
            <Command cmd="npx boardui@latest add button --overwrite" />
          </Section>

          <Section title="Telemetria anônima">
            <p className="text-body-regular text-text-secondary">
              Após um sucesso{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">init</code>, o CLI envia um
              evento anônimo contendo sua versão, seu gerenciador de pacotes, e se{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">--pro</code> foi usado.
              Depois de um sucesso{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">adicionar</code>, envia os
              nomes dos componentes que solicitou explicitamente, mas não as suas dependências automaticamente
              resolvidas.{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">habilidade</code> instalar,
              envia onde a habilidade foi colocada (projeto, diretório global, ou agentes), nunca o caminho em
              si. Um ID aleatório no diretório de configuração do usuário do seu sistema operacional nos
              permite distinguir execuções repetidas. BoardUI não envia caminhos de projeto, código fonte,
              nomes de dependência, endereços de e-mail, outros argumentos de comando, ou telemetria para{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">lista</code>.
            </p>
            <p className="text-body-regular text-text-secondary">
              Desativar a telemetria através da configuração{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">BOARDUI_TELEMETRY_DISABLED=1</code>{" "}
              ou <code className="font-mono text-caption-1-medium text-text-primary">DO_NOT_TRACK=1</code>.
            </p>
            <p className="text-body-regular text-text-secondary">
              Os eventos são retidos como contadores de vida e baldes diários anônimos usados para relatórios
              diários, semanais e mensais de tendência.
            </p>
          </Section>

          <Section title="compatibilidade shadcn">
            <p className="text-body-regular text-text-secondary">
              O registro usa o esquema de itens shadcn, então cada componente também instala com o shadcn CLI
              se você preferir:
            </p>
            <CodeBlock code="npx shadcn@latest add https://www.boardui.com/r/button.json" />
          </Section>

          <Link
            href="/docs/introduction"
            className="inline-flex items-center gap-1.5 text-body-medium text-text-secondary transition-colors hover:text-text-primary"
          >
            <RiArrowLeftLine className="size-4" aria-hidden />
            Voltar à introdução
          </Link>
        </div>
      </DocsLayout>
    </LocaleHtml>
  );
}
