"use client";

import { RiArrowRightSLine } from "@remixicon/react";

import { DocsLayout } from "@/components/application/docs/docs-layout";
import { LocaleHtml } from "@/components/application/docs/locale-html";
import { CodeTabs, PkgCommand } from "@/components/application/docs/code-tabs";
import { PrevNext } from "@/components/application/docs/prev-next";
import { LinkButton } from "@/components/base/buttons/link-button";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
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

/** Agent Skills page, mirroring boardui.com/skill. */
export default function SkillPage() {
  return (
    <LocaleHtml locale="pt-br">
      <DocsLayout variant="library" hidePrevNext title="Skills para agentes" locale="pt-br">
        <div className="flex flex-col gap-8 pb-8">
          <div className="flex flex-col gap-3">
            <p className="text-body-regular text-text-secondary">
              Um comando dá ao seu assistente de IA conhecimento completo do BoardUI: componentes, templates, regras de design, temas, padrões e animações. Claude Code, Codex e outros agentes com suporte a skills carregam tudo automaticamente e usam os componentes reais do BoardUI.
            </p>
            <p className="text-body-regular text-text-secondary">
              As habilidades seguem o aberto <code className="font-mono text-caption-1-medium text-text-primary">SKILL.md</code>{" "}
              : arquivos Markdown que seu agente descobre automaticamente, sem servidor. O conteúdo atualizado é obtido de boardui.com em cada instalação.
            </p>
          </div>

          <Section title="Instalar">
            <p className="text-body-regular text-text-secondary">
              Um comando, execute a partir do root do seu projeto. Escolha a página para onde ele deve viver: o padrão escreve para <code className="font-mono text-caption-1-medium text-text-primary">.claude/skills/boardui</code>{" "}
              no projeto, então a habilidade monta o seu repo e os agentes de toda a sua equipe pegá-lo. Global e o diretório de agentes cobrem instalações em todo o usuário e clientes como Codex ou Gemini.
            </p>
            <CodeTabs
              tabs={[
                { value: "Project (default)", code: "npx boardui@latest skill" },
                { value: "Global", code: "npx boardui@latest skill --global" },
                { value: "Codex & Gemini", code: "npx boardui@latest skill --client codex" },
                { value: "Custom path", code: "npx boardui@latest skill --path .agents/skills/boardui" },
              ]}
            />
            <p className="text-body-regular text-text-secondary">
              Já conectado ao servidor BoardUI MCP? Basta pedir ao seu agente para executar{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">install_skill</code>, nenhum terminal necessário.
            </p>
          </Section>

          <Section title="O que inclui">
            <p className="text-body-regular text-text-secondary">
              Um esguio <code className="font-mono text-caption-1-medium text-text-primary">SKILL.md</code> o agente sempre carrega, além de arquivos de referência que lê sob demanda (divulgação progressiva, de acordo com o padrão de habilidades):
            </p>
            <SubSection title="SKILL.md">
              <p className="text-body-regular text-text-secondary">
                The core file your agent always loads: the build workflow (detect setup, discover, install, compose, verify), a digest of the design rules, guidance on choosing the right component for the job, known gotchas, and how Pro licensing works.
              </p>
            </SubSection>
            <SubSection title="references/components.md">
              <p className="text-body-regular text-text-secondary">
                The full catalog, generated from the live registry: every component and template with description, install command, and a usage example.
              </p>
            </SubSection>
            <SubSection title="references/theming.md">
              <p className="text-body-regular text-text-secondary">
                Token architecture, the semantic color families, the composite type scale, dark mode mechanics, and how to rebrand the accent ramp.
              </p>
            </SubSection>
            <SubSection title="references/patterns.md">
              <p className="text-body-regular text-text-secondary">
                Page anatomy recipes: dashboard, table page, auth, AI chat, and settings, each as an annotated skeleton with real imports.
              </p>
            </SubSection>
            <SubSection title="references/motion.md">
              <p className="text-body-regular text-text-secondary">
                The hand-tuned micro-animation language: the duration scale, signature easings, the blur-in entrance, press feedback, springs.
              </p>
            </SubSection>
          </Section>

          <Section title="Onde instalar em cada cliente">
            <p className="text-body-regular text-text-secondary">
              Claude Code descobre habilidades no projeto <code className="font-mono text-caption-1-medium text-text-primary">.claude/skills/</code> (a instalação por omissão) e em{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">~/.claude/skills/</code> (
              <code className="font-mono text-caption-1-medium text-text-primary">--global</code>). Codex, Gemini CLI, e outros clientes que compartilham a convenção agentes ler{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">~/.agents/skills/</code> (
              <code className="font-mono text-caption-1-medium text-text-primary">--client codex</code> Qualquer outra coisa.
              <code className="font-mono text-caption-1-medium text-text-primary">--path</code>{" "}
              coloca a pasta onde quer que seu cliente olhe. Habilidades carregar quando uma sessão começa, então reinicie seu agente ou abra uma nova conversa após a instalação.
            </p>
          </Section>

          <Section title="Atualização">
            <p className="text-body-regular text-text-secondary">
              A habilidade carrega um selo de versão em sua matéria frontal, e o registro o reconstrói em cada implantação: novos componentes aparecem no catálogo automaticamente.{" "}
              <code className="font-mono text-caption-1-medium text-text-primary">--force</code> para atualizar no local; o comando imprime as versões instaladas e obtidas para que você possa ver o que mudou.
            </p>
            <PkgCommand
              npm="npx boardui@latest skill --force"
              pnpm="pnpm dlx boardui@latest skill --force"
              yarn="yarn dlx boardui@latest skill --force"
            />
          </Section>

          <Section title="Skill e MCP">
            <p className="text-body-regular text-text-secondary">
              Eles complementam uns aos outros. A habilidade é o conhecimento que o agente sempre tem: o catálogo, as regras, os padrões, carregou cada sessão com configuração zero. Servidor MCP fornece ferramentas: código completo dos componentes sob demanda, instalação sem terminal, configuração de projetos e ativação da licença Pro no chat. Instale os dois: a skill ajuda o agente a planejar com componentes reais, e MCP permite executar.
            </p>
            <div>
              <LinkButton href="/mcp" trailingIcon={RiArrowRightSLine}>
                Servidor MCP
              </LinkButton>
            </div>
          </Section>

          <Section title="BoardUI Pro">
            <p className="text-body-regular text-text-secondary">
              O catálogo da habilidade cobre componentes e modelos Pro também, marcado PRO, com exemplos de uso público, mas nunca fonte. Com uma licença Pro ativada uma vez (
              <code className="font-mono text-caption-1-medium text-text-primary">npx boardui@latest login &lt;key&gt;</code>
              , chave em seu recibo Lemon Squeezy), seu agente instala itens Pro exatamente como os grátis. Sem um, ele sabe o que existe e aponta para preços em vez de adivinhar um sósia.
            </p>
            <div>
              <LinkButton href="/pricing" trailingIcon={RiArrowRightSLine}>
                preços
              </LinkButton>
            </div>
          </Section>

          <PrevNext
            locale="pt-br"
            prev={{ href: "/mcp", label: "Servidor MCP", sub: "Agentes instalam para você" }}
            next={{ href: "/rtl", label: "Suporte a RTL" }}
          />
        </div>
      </DocsLayout>
    </LocaleHtml>
  );
}
