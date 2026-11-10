"use client";

import { useState } from "react";
import { RiArrowRightSLine, RiCheckLine, RiFileCopyLine } from "@remixicon/react";

import { DocsLayout } from "@/components/application/docs/docs-layout";
import { PkgCommand } from "@/components/application/docs/code-tabs";
import { PrevNext } from "@/components/application/docs/prev-next";
import { LinkButton } from "@/components/base/buttons/link-button";
import { ButtonLink } from "@/components/base/buttons/button";
import { LocaleHtml } from "@/components/application/docs/locale-html";
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
  const [copied, setCopied] = useState(false);
  const copy = () => {
    const done = () => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    };
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(cmd).then(done).catch(done);
    } else {
      done();
    }
  };
  return (
    <div className="flex flex-col gap-2">
      <div className="flex w-full flex-col gap-0 rounded-2xl bg-background-secondary-default p-1">
        <div className="flex items-center justify-between">
          <span className="rounded-md px-2.5 py-1 text-body-medium text-text-primary">terminal</span>
          <div className="pe-1">
            <button
              type="button"
              aria-label="Copy"
              onClick={copy}
              className="flex size-7 cursor-pointer items-center justify-center rounded-2lg transition-colors outline-none hover:bg-background-primary-hover focus-visible:ring-2 focus-visible:ring-border-focus-ring"
            >
              <span className="relative inline-flex size-5 shrink-0 items-center justify-center">
                {copied ? (
                  <RiCheckLine className="size-5 text-foreground-icon-secondary" aria-hidden />
                ) : (
                  <RiFileCopyLine className="size-5 text-foreground-icon-secondary" aria-hidden />
                )}
              </span>
            </button>
          </div>
        </div>
        <div className="p-1">
          <div className="overflow-auto rounded-xl bg-docs-code-background px-5 py-3 shadow-[0px_2px_0px_0px_rgba(0,0,0,0.03),0px_1px_2px_0px_rgba(0,0,0,0.05),0px_6px_10px_0px_rgba(0,0,0,0.02)]">
            <code className="block font-mono text-[14px] leading-5 whitespace-pre text-text-secondary">{cmd}</code>
          </div>
        </div>
      </div>
      <div>
        <button
          type="button"
          onClick={copy}
          className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-full border border-border-button-default bg-background-primary-default px-3.5 py-1.5 text-body-medium text-text-primary transition-colors outline-none hover:bg-background-primary-hover focus-visible:ring-2 focus-visible:ring-border-focus-ring"
        >
          {copied ? <RiCheckLine className="size-4" aria-hidden /> : <RiFileCopyLine className="size-4" aria-hidden />}
          {copied ? "Copiado" : "Copiar o comando"}
        </button>
      </div>
    </div>
  );
}
const TOOLS: [string, string][] = [
  ["get_started", "Overview of BoardUI, the typical flow, RTL setup, and the Pro licensing rules."],
  ["list_components", "Every installable item with exact names, free and Pro, grouped by type."],
  ["get_component", "Description, dependencies, usage example, and full source for one item."],
  ["get_usage_examples", "Working code snippets from the item's docs page, Pro items included."],
  ["install_components", "Writes component source into the project and installs missing npm deps."],
  ["init_boardui", "One-time setup: Tailwind v4, runtime deps, theme and global styles, utils."],
  ["install_rules", "Writes the always-on design rules into AGENTS.md and .cursor/rules/."],
  ["get_skill", "Explains the agent skill: live SKILL.md, bundled files, install options per client."],
  ["install_skill", "Installs the BoardUI agent skill (catalog, theming, patterns) into .claude/skills/."],
  ["get_theme", "The theme tokens, type scale, global stylesheet, and RTL setup guidance."],
  ["activate_license", "Activates a BoardUI Pro license key on the machine and stores it."],
  ["license_status", "Whether a Pro license is active, with the key shown masked."],
  ["deactivate_license", "Releases the machine's Pro seat and removes the stored key."],
];

const EXAMPLE_PROMPTS = [
  "“ Configure BoardUI neste projeto e adicione os componentes button, select e date-picker. ”",
  "“ Comprei o BoardUI Pro. Minha chave de licença é XXXX. Ative e instale o template de chat com IA. ”",
  "“ Crie uma página de login com o card de autenticação e os botões sociais do BoardUI. ”",
  "“ Ative RTL para árabe e hebraico neste projeto BoardUI, incluindo blocos e templates Pro. ”",
  "“ Quais props o botão BoardUI aceita? Mostre as variantes com ícones. ”",
  "“ Adicione a tabela de dados BoardUI e conecte ao endpoint /api/orders. ”",
  "“ Mostre os tokens de tema BoardUI e adapte o botão primário à minha marca. ”",
  "“ Crie um dashboard de receita com cards de indicadores BoardUI, um gráfico de área e uma lista de barras. ”",
];

const CLIENTS = ["Claude Code", "Cursor", "VS Code", "Codex", "Outros clientes"] as const;

const SHADCN_MCP_CODE = `{
  "registries": {
    "@boardui": "https://www.boardui.com/r/{name}.json"
  }
}`;


const MCP_STDIO_CODE = `{
  "mcpServers": {
    "boardui": {
      "command": "npx",
      "args": ["-y", "boardui@latest", "mcp"]
    }
  }
}`;

const VSCODE_MCP_CODE = `{
  "servers": {
    "boardui": {
      "command": "npx",
      "args": ["-y", "boardui@latest", "mcp"]
    }
  }
}`;

// One-click install deep links (standard Cursor / VS Code MCP install URL
// schemes; the configs above are the verbatim server configs).
const CURSOR_INSTALL_URL =
  "cursor://anysphere.cursor-deeplink/mcp/install?name=boardui&config=" +
  encodeURIComponent(
    JSON.stringify({ mcpServers: { boardui: { command: "npx", args: ["-y", "boardui@latest", "mcp"] } } }),
  );
const VSCODE_INSTALL_URL =
  "vscode:mcp/install?" +
  encodeURIComponent(
    JSON.stringify({ servers: { boardui: { command: "npx", args: ["-y", "boardui@latest", "mcp"] } } }),
  );
export default function McpPage() {
  const [client, setClient] = useState<(typeof CLIENTS)[number]>("Claude Code");
  return (
    <LocaleHtml locale="pt-br">
    <DocsLayout variant="library" hidePrevNext title="Servidor MCP" locale="pt-br">
      <div className="flex flex-col gap-8 pb-8">
        <div className="flex flex-col gap-3">
          <p className="text-body-regular text-text-secondary">
            BoardUI inclui um servidor MCP para que agentes de IA façam a instalação. Claude Code, Cursor, VS
            Code, Codex e qualquer cliente MCP podem explorar o registro, ler o código dos componentes e
            exemplos reais, configurar um projeto e instalar os arquivos nele. Basta descrever o que você quer
            criar.
          </p>
          <p className="text-body-regular text-text-secondary">
            O servidor roda localmente via stdio com{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">npx</code>, sem hospedagem
            externa. Os componentes gratuitos funcionam sem configuração. Ative o BoardUI Pro no mesmo chat com
            a sua chave de licença.
          </p>
          <p className="text-body-regular text-text-secondary">
            Uma regra para todos os clientes: as ferramentas MCP são carregadas no início da sessão. Se
            adicionar o servidor durante uma sessão, reinicie o cliente ou abra um novo chat para
            disponibilizar as ferramentas.
          </p>
        </div>

        <Section title="Configuração">
          <p className="text-body-regular text-text-secondary">
            Escolha seu cliente. Cursor e VS Code instalam com um clique; Claude Code e Codex usam um comando.
          </p>
          <div className="flex flex-wrap gap-2">
            {CLIENTS.map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => setClient(name)}
                className={cx(
                  "rounded-full border px-3.5 py-1.5 text-caption-1-semibold transition-colors",
                  client === name
                    ? "border-border-button-default bg-background-tertiary-default text-text-primary"
                    : "border-border-button-default bg-background-primary-default text-text-secondary hover:text-text-primary",
                )}
              >
                {name}
              </button>
            ))}
          </div>
          {client === "Claude Code" || client === "Codex" ? (
            <>
              <p className="text-body-regular text-text-secondary">
                Um comando no seu diretório do projeto. Adicionar{" "}
                <code className="font-mono text-caption-1-medium text-text-primary">--scope user</code> para
                habilitá-lo para cada projeto, e reiniciar o Claude Code (ou abrir uma nova sessão) depois para
                que as ferramentas se liguem.
              </p>
              <Command cmd="claude mcp add boardui -- npx -y boardui@latest mcp" />
            </>
          ) : client === "Cursor" ? (
            <>
              <p className="text-body-regular text-text-secondary">
                Instale com um clique, ou adicione o servidor ao{" "}
                <code className="font-mono text-caption-1-medium text-text-primary">.cursor/mcp.json</code>{" "}
                você mesmo e habilite em Configurações, Ferramentas &amp; MCP.
              </p>
              <div>
                <ButtonLink href={CURSOR_INSTALL_URL}>Adicionar ao Cursor</ButtonLink>
              </div>
              <FileBlock file=".cursor/mcp.json" code={MCP_STDIO_CODE} />
            </>
          ) : client === "VS Code" ? (
            <>
              <p className="text-body-regular text-text-secondary">
                Instale com um clique, ou adicione o servidor ao{" "}
                <code className="font-mono text-caption-1-medium text-text-primary">.vscode/mcp.json</code> e
                clique em Iniciar ao lado dele.
              </p>
              <div>
                <ButtonLink href={VSCODE_INSTALL_URL}>Adicionar ao VS Code</ButtonLink>
              </div>
              <FileBlock file=".vscode/mcp.json" code={VSCODE_MCP_CODE} />
            </>
          ) : (
            <>
              <p className="text-body-regular text-text-secondary">
                Windsurf, Zed, Cline e qualquer outro cliente MCP usam o mesmo servidor stdio. Aponte-os para
                esta configuração onde quer que eles guardem servidores MCP:
              </p>
              <FileBlock file="mcp.json" code={MCP_STDIO_CODE} />
            </>
          )}
        </Section>
<Section title="Monorepos e aliases personalizados">
          <p className="text-body-regular text-text-secondary">
            O servidor MCP local lê o mesmo arquivo opcional{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">boardui.json</code> como o
            CLI. Coloque-o ao lado do pacote de destino{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">package.json</code> e passe
            o caminho absoluto desse pacote como{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">projectDir</code> para{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">init_boardui</code>,{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">install_components</code>, e{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">install_rules</code>. Os arquivos e as
            dependências npm são instalados nesse pacote com os aliases de importação configurados.
          </p>
          <p className="text-body-regular text-text-secondary">
            Passe o mesmo{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">projectDir</code> para{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">get_component</code> e{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">get_usage_examples</code> para
            a correspondência de fonte e exemplos. Sem ela, estas ferramentas de leitura retornam as importações de registro originais.
            As exportações de pacotes e os estilos de cada aplicativo ainda precisam ser configurados.
          </p>
          <div>
            <LinkButton href="/installation" trailingIcon={RiArrowRightSLine}>
              Configurar um pacote de UI compartilhado
            </LinkButton>
          </div>
        </Section>

        <Section title="Experimente pedir ao seu agente">
          <p className="text-body-regular text-text-secondary">
            Depois de conectar, converse normalmente com seu agente. Alguns exemplos:
          </p>
          <ul className="flex flex-col gap-1.5">
            {EXAMPLE_PROMPTS.map((prompt) => (
              <li key={prompt} className="flex items-start gap-2 text-body-regular text-text-secondary">
                <span aria-hidden className="mt-[9px] size-1.5 shrink-0 rounded-full bg-foreground-icon-tertiary" />
                {prompt}
              </li>
            ))}
          </ul>
        </Section>
<Section title="Ferramentas">
          <p className="text-body-regular text-text-secondary">O que o servidor disponibiliza ao seu agente:</p>
          <div className="overflow-x-auto rounded-xl border border-border-button-default">
            <table className="w-full border-collapse text-start">
              <thead>
                <tr className="border-b border-separator-border bg-background-secondary-default">
                  <th className="px-4 py-2.5 text-start text-caption-1-semibold text-text-secondary">Ferramenta</th>
                  <th className="px-4 py-2.5 text-start text-caption-1-semibold text-text-secondary">O que faz</th>
                </tr>
              </thead>
              <tbody>
                {TOOLS.map(([tool, description]) => (
                  <tr key={tool} className="border-b border-separator-border last:border-b-0">
                    <td className="px-4 py-2.5 font-mono text-caption-1-medium text-text-primary">{tool}</td>
                    <td className="px-4 py-2.5 text-body-regular text-text-secondary">{description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section title="Regras de design sempre ativas">
          <p className="text-body-regular text-text-secondary">
            As ferramentas MCP estão sob demanda: um agente só vê seu tema quando pensa em perguntar, e um
            modelo que nunca pede inventa seu próprio espaçamento, cores e tipo. Assim,{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">init_boardui</code> (e{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">npx boardui init</code>) também
            instala as fundações de design como arquivos de instrução sempre ativos que os agentes carregam a
            cada sessão: uma seção delimitada em{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">AGENTS.md</code> e uma regra do
            Cursor em{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">.cursor/rules/boardui.mdc</code>
            . Eles fixam os tokens de cor semântica, a escala de tipo composta, convenções de espaçamento e
            raio, modo escuro, e <code className="font-mono text-caption-1-medium text-text-primary">cx()</code>,
            e novas execuções atualizam a seção no lugar sem tocar no resto do seu arquivo.
          </p>
          <p className="text-body-regular text-text-secondary">
            Inicializou o seu projeto antes de isto existir? Peça ao seu agente para executar{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">install_rules</code>.
          </p>
          <p className="text-body-regular text-text-secondary">
            Quer um conhecimento sempre carregado mais profundo, com o catálogo completo, temas e padrões de
            página? Instale a skill do BoardUI para agentes junto com o MCP (
            <code className="font-mono text-caption-1-medium text-text-primary">install_skill</code>, ou{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">npx boardui skill</code>).
          </p>
          <div>
            <LinkButton href="/skill" trailingIcon={RiArrowRightSLine}>
              Skill do BoardUI para agentes
            </LinkButton>
          </div>
        </Section>

        <Section title="BoardUI Pro via MCP">
          <p className="text-body-regular text-text-secondary">
            Componentes e templates Pro aparecem em{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">list_components</code> para
            todos os usuários. Sem uma licença, seu agente recebe a descrição, um exemplo de uso público e
            instruções de compra em vez do código-fonte. Depois de comprar o Pro, cole a chave de licença do
            seu e-mail de compra no chat; o agente a ativa com{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">activate_license</code> (um
            assento, liberado a qualquer momento com{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">deactivate_license</code>),
            e a partir daí os itens Pro instalam exatamente como os gratuitos. A chave é validada no servidor
            em cada download Pro.
          </p>
          <p className="text-body-regular text-text-secondary">
            Já fez login com{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">boardui login</code>? O
            servidor MCP usa a mesma licença armazenada, nada a refazer.
          </p>
        </Section>

        <Section title="Telemetria anônima">
          <p className="text-body-regular text-text-secondary">
            Instalações bem-sucedidas reportam os mesmos eventos anônimos que a CLI (nomes dos componentes,
            gerenciador de pacotes, versão), marcados como orientados por MCP. Nenhum caminho de projeto,
            prompt ou código-fonte. Desative com{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">BOARDUI_TELEMETRY_DISABLED=1</code>{" "}
            ou <code className="font-mono text-caption-1-medium text-text-primary">DO_NOT_TRACK=1</code> no
            ambiente do servidor.
          </p>
        </Section>

        <Section title="Usando o MCP do shadcn">
          <p className="text-body-regular text-text-secondary">
            O registro do BoardUI fala o esquema do shadcn, então, se o seu agente já executa o servidor MCP
            do shadcn, você pode acessar o BoardUI por meio dele: adicione o namespace ao{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">components.json</code> e peça
            por <code className="font-mono text-caption-1-medium text-text-primary">@boardui/button</code>.
            O servidor BoardUI acima continua sendo o caminho mais completo, com exemplos de uso, configuração
            de projeto e licenciamento Pro.
          </p>
          <FileBlock file="components.json" code={SHADCN_MCP_CODE} />
        </Section>

        <Section title="Como funciona">
          <p className="text-body-regular text-text-secondary">
            <code className="font-mono text-caption-1-medium text-text-primary">npx boardui@latest mcp</code>{" "}
            inicia o mesmo motor que a CLI usa, falando MCP sobre stdio. Ele obtém o registro público de
            boardui.com, resolve dependências de componentes transitivamente, e escreve arquivos usando o
            layout padrão ou os mapeamentos do seu{" "}
            <code className="font-mono text-caption-1-medium text-text-primary">boardui.json</code>. Você
            também pode executá-lo manualmente para verificar a configuração:
          </p>
          <PkgCommand npm="npx boardui@latest mcp" pnpm="pnpm dlx boardui@latest mcp" yarn="yarn dlx boardui@latest mcp" />
        </Section>

        <PrevNext
          prev={{ href: "/installation", label: "Instalação", sub: "Guias de configuração de framework", enLabel: "Installation" }}
          next={{ href: "/skill", label: "Skills para agentes", sub: "Conhecimento para o seu agente", enLabel: "Agent Skills" }}
          locale="pt-br"
        />
      </div>
    </DocsLayout>
  </LocaleHtml>
  );
}
