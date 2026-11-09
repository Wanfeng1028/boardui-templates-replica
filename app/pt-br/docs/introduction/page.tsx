"use client";

import Link from "next/link";
import { RiArrowLeftLine, RiArrowRightSLine } from "@remixicon/react";
import { DocsLayout } from "@/components/application/docs/docs-layout";
import { LocaleHtml } from "@/components/application/docs/locale-html";
import { LinkButton } from "@/components/base/buttons/link-button";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function IntroductionPage() {
  return (
    <LocaleHtml locale="pt-br">
      <DocsLayout
        variant="docs"
        locale="pt-br"
        eyebrow="Docs · Comece"
        title="Introdução"
      >
        <div className="space-y-8">
          <Section title="O que é o BoardUI?">
            <p>
              BoardUI é uma coleção open-source de componentes React construído
              com Tailwind CSS e projetado em Figma. Componentes são traduzidos
              diretamente de um arquivo mestre Figma através do servidor Figma
              MCP, então o design e o código permanecem em lockstep.
            </p>
            <p>Pular a fase de design. Basta copiar, colar e construir.</p>
          </Section>

          <Section title="Tecnologias">
            <ul className="list-disc space-y-2 pl-6">
              <li>React 19</li>
              <li>Next.js 16 (App Router) — para o site de vitrine</li>
              <li>
                Tailwind CSS v4 (CSS- first config via{" "}
                <code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-sm dark:bg-gray-800">
                  @theme
                </code>
                )
              </li>
              <li>TypeScript</li>
              <li>
                React componentes Aria — primitivos de acessibilidade,
                adicionados por componente conforme necessário
              </li>
            </ul>
          </Section>

          <Section title="Livre vs. Pro">
            <ul className="list-disc space-y-2 pl-6">
              <li>
                <strong>Grátis</strong> — componentes básicos (Button, Input,
                Checkbox, Distintivo, Avatar, etc.). Licença permissiva. Código
                aberto.
              </li>
              <li>
                <strong>Pro</strong> — blocos compostos, modelos de páginas,
                padrões complexos (quadros de dados, menus de comandos,
                gráficos, painéis).
              </li>
            </ul>
          </Section>

          <Section title="Fonte, não dependência">
            <p>
              O BoardUI não é uma biblioteca em tempo de execução. Quando você
              adiciona um componente, sua fonte é copiada para o seu projeto —
              sem instalação do npm, sem bloqueio do fornecedor. Você possui o
              código; modifique-o do jeito que quiser.
            </p>
          </Section>

          <Section title="Como o BoardUI se compara">
            <p>
              Criamos o mesmo diálogo de configurações com o BoardUI e outras
              nove bibliotecas, do shadcn/ui ao PrimeReact, e testamos cada
              uma.
            </p>
            <p>
              Leia nossa{" "}
              <Link
                href="/blog/comparing-react-design-systems"
                className="font-medium text-blue-600 underline underline-offset-4 hover:text-blue-500 dark:text-blue-500"
              >
                comparação dos 10 melhores sistemas de design para React
              </Link>{" "}
              (em inglês).
            </p>
          </Section>

          <Section title="Próximas etapas">
            <p>
              Vá para o{" "}
              <Link
                href="/installation"
                className="font-medium text-blue-600 underline underline-offset-4 hover:text-blue-500 dark:text-blue-500"
              >
                guia de instalação
              </Link>{" "}
              para configurar um projeto, ou navegar no{" "}
              <Link
                href="/components"
                className="font-medium text-blue-600 underline underline-offset-4 hover:text-blue-500 dark:text-blue-500"
              >
                galeria de componentes
              </Link>
              .
            </p>
            <div className="flex flex-wrap gap-3">
              <LinkButton href="/installation">guia de instalação</LinkButton>
              <LinkButton href="/components">galeria de componentes</LinkButton>
            </div>
          </Section>

          <Link
            href="/components"
            className="inline-flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
          >
            <RiArrowLeftLine className="size-4" aria-hidden="true" />
            Voltar para todos os componentes
          </Link>
        </div>
      </DocsLayout>
    </LocaleHtml>
  );
}
