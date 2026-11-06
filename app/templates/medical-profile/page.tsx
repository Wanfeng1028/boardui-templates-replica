"use client";

import { RiAddFill, RiAsterisk, RiMoonClearFill, RiRunLine } from "@remixicon/react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

import { TemplateShell } from "@/components/application/template-shell/template-shell";
import { ImportantAlertsCard } from "@/components/application/medical/important-alerts-card";
import { PatientInfoCard } from "@/components/application/medical/patient-info-card";
import { WeekRangePill } from "@/components/application/medical/week-range-pill";
import { Button } from "@/components/base/buttons/button";

/**
 * Medical Profile template replica.
 * Official: boardui.com/templates/medical-profile — patient info, important
 * alerts, steps (31,600 · 29 Jun - 5 Jul), sleep score (Excellent 98 · 7h 50m).
 * Built only from free BoardUI components + mock data. Not the official Pro source.
 */

const STEPS = [
  { day: "Mon", steps: 4200 },
  { day: "Tue", steps: 5100 },
  { day: "Wed", steps: 3800 },
  { day: "Thu", steps: 5400 },
  { day: "Fri", steps: 4600 },
  { day: "Sat", steps: 3900 },
  { day: "Sun", steps: 4600 },
];

export default function MedicalProfileTemplatePage() {
  return (
    <TemplateShell
      title="Medical Report"
      heading="Medical Profile"
      icon={RiAsterisk}
      selected="medical"
      actions={
        <Button variant="primary" size="medium" leadingIcon={RiAddFill}>
          File a report
        </Button>
      }
    >
      <div className="flex w-full flex-col gap-4 xl:flex-row">
        <PatientInfoCard />
        <ImportantAlertsCard />
      </div>

      <div className="flex w-full flex-col gap-4 xl:flex-row">
        <section className="flex min-w-0 flex-1 flex-col gap-3 rounded-2xl bg-background-secondary-default p-4">
          <div className="flex w-full items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <RiRunLine className="size-5 text-foreground-icon-primary" aria-hidden />
              <p className="text-body-medium text-text-secondary">Steps</p>
            </div>
            <WeekRangePill label="29 Jun - 5 Jul" />
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-display-4-medium text-text-primary tabular-nums">31,600</p>
            <span className="text-body-2-medium text-text-tertiary">total steps</span>
          </div>
          <div className="h-[180px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={STEPS} margin={{ top: 4, right: 4, bottom: 0, left: 0 }} barCategoryGap="30%">
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tick={{ fontSize: 12, fill: "var(--color-text-tertiary)" }}
                />
                <YAxis
                  width={36}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12, fill: "var(--color-text-tertiary)" }}
                />
                <Bar dataKey="steps" fill="var(--color-chart-2-active)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="flex min-w-0 flex-1 flex-col gap-3 rounded-2xl bg-background-secondary-default p-4">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-2">
              <RiMoonClearFill className="size-5 text-foreground-icon-primary" aria-hidden />
              <p className="text-body-medium text-text-secondary">Sleep score</p>
            </div>
            <span className="rounded-full bg-status-lime-background px-2.5 py-1 text-body-2-medium text-status-lime-text">
              Excellent
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-display-4-medium text-text-primary tabular-nums">98</p>
            <span className="text-body-2-medium text-text-tertiary">/ 100</span>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex w-full items-center justify-between rounded-xl bg-background-inner-default px-3 py-2.5">
              <p className="text-body-2-regular text-text-secondary">Duration</p>
              <p className="text-body-medium text-text-primary tabular-nums">7h 50m</p>
            </div>
            <div className="flex w-full items-center justify-between rounded-xl bg-background-inner-default px-3 py-2.5">
              <p className="text-body-2-regular text-text-secondary">Deep sleep</p>
              <p className="text-body-medium text-text-primary tabular-nums">1h 42m</p>
            </div>
            <div className="flex w-full items-center justify-between rounded-xl bg-background-inner-default px-3 py-2.5">
              <p className="text-body-2-regular text-text-secondary">REM</p>
              <p className="text-body-medium text-text-primary tabular-nums">1h 18m</p>
            </div>
            <div className="flex w-full items-center justify-between rounded-xl bg-background-inner-default px-3 py-2.5">
              <p className="text-body-2-regular text-text-secondary">Resting heart rate</p>
              <p className="text-body-medium text-text-primary tabular-nums">49 bpm</p>
            </div>
          </div>
        </section>
      </div>
    </TemplateShell>
  );
}
