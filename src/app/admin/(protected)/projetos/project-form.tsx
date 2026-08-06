"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  AlertCircle,
  CalendarDays,
  ExternalLink,
  FileText,
  Languages,
  Settings2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import type {
  ProjectFormState,
  ProjectFormValues,
} from "@/lib/projects/project-form";
import { createProjectAction, updateProjectAction } from "./actions";
import { ProjectSubmitButton } from "./project-submit-button";

const initialState: ProjectFormState = {};

function FieldError({ errors }: { errors?: string[] }) {
  return errors?.[0] ? (
    <p className="text-xs text-red-400">{errors[0]}</p>
  ) : null;
}

function TextField({
  label,
  name,
  defaultValue,
  placeholder,
  errors,
}: {
  label: string;
  name: string;
  defaultValue: string;
  placeholder?: string;
  errors?: string[];
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        aria-invalid={Boolean(errors?.length)}
        className="border-white/10 bg-zinc-950/50 focus-visible:border-violet-500/60 focus-visible:ring-violet-500/20"
      />
      <FieldError errors={errors} />
    </div>
  );
}

function ContentFields({
  locale,
  values,
  errors,
}: {
  locale: "Pt" | "En";
  values: ProjectFormValues;
  errors?: Record<string, string[]>;
}) {
  const copy =
    locale === "Pt"
      ? {
          title: "Título",
          summary: "Resumo",
          problem: "Problema",
          solution: "Solução",
          responsibilities: "Responsabilidades",
          choices: "Decisões técnicas",
          results: "Resultados",
        }
      : {
          title: "Title",
          summary: "Summary",
          problem: "Problem",
          solution: "Solution",
          responsibilities: "Responsibilities",
          choices: "Technical decisions",
          results: "Results",
        };

  const textarea = (
    key:
      | "summary"
      | "problem"
      | "solution"
      | "responsibilities"
      | "technicalChoices"
      | "results",
    label: string,
    rows = 4,
  ) => {
    const name = `${key}${locale}` as keyof ProjectFormValues;
    return (
      <div className="space-y-2" key={name}>
        <Label htmlFor={name}>{label}</Label>
        <Textarea
          id={name}
          name={name}
          defaultValue={String(values[name])}
          rows={rows}
          aria-invalid={Boolean(errors?.[name]?.length)}
          className="min-h-28 resize-y border-white/10 bg-zinc-950/50 focus-visible:border-violet-500/60 focus-visible:ring-violet-500/20"
        />
        <FieldError errors={errors?.[name]} />
      </div>
    );
  };

  const titleName = `title${locale}` as keyof ProjectFormValues;

  return (
    <div className="grid gap-5 pt-4">
      <TextField
        label={copy.title}
        name={titleName}
        defaultValue={String(values[titleName])}
        errors={errors?.[titleName]}
      />
      {textarea("summary", copy.summary, 3)}
      <div className="grid gap-5 xl:grid-cols-2">
        {textarea("problem", copy.problem)}
        {textarea("solution", copy.solution)}
        {textarea("responsibilities", copy.responsibilities)}
        {textarea("technicalChoices", copy.choices)}
      </div>
      {textarea("results", copy.results)}
    </div>
  );
}

export function ProjectForm({ values }: { values: ProjectFormValues }) {
  const editing = Boolean(values.id);
  const action = values.id
    ? updateProjectAction.bind(null, values.id)
    : createProjectAction;
  const [state, formAction] = useActionState(action, initialState);

  return (
    <form action={formAction} className="space-y-6">
      {state.error ? (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          {state.error}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <Card className="border-violet-500/10 bg-zinc-900/70 shadow-lg shadow-black/10 ring-0">
          <CardHeader className="border-b border-white/5">
            <div className="flex items-center gap-2 text-violet-300">
              <Languages className="size-4" />
              <CardTitle>Conteúdo do projeto</CardTitle>
            </div>
            <CardDescription className="text-zinc-500">
              Mantenha as duas versões prontas antes da publicação.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="pt">
              <TabsList className="bg-zinc-950/70">
                <TabsTrigger
                  value="pt"
                  className="data-active:bg-violet-600 data-active:text-white"
                >
                  Português
                </TabsTrigger>
                <TabsTrigger
                  value="en"
                  className="data-active:bg-violet-600 data-active:text-white"
                >
                  English
                </TabsTrigger>
              </TabsList>
              <TabsContent value="pt">
                <ContentFields
                  locale="Pt"
                  values={values}
                  errors={state.fieldErrors}
                />
              </TabsContent>
              <TabsContent value="en">
                <ContentFields
                  locale="En"
                  values={values}
                  errors={state.fieldErrors}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-violet-500/10 bg-zinc-900/70 shadow-lg shadow-black/10 ring-0">
            <CardHeader className="border-b border-white/5">
              <div className="flex items-center gap-2 text-violet-300">
                <Settings2 className="size-4" />
                <CardTitle>Publicação</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <TextField
                label="Slug"
                name="slug"
                defaultValue={values.slug}
                placeholder="nome-do-projeto"
                errors={state.fieldErrors?.slug}
              />
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  name="status"
                  defaultValue={values.status}
                  className="h-9 w-full rounded-md border border-white/10 bg-zinc-950/50 px-2.5 text-sm outline-none focus:border-violet-500/60 focus:ring-3 focus:ring-violet-500/20"
                >
                  <option value="DRAFT">Rascunho</option>
                  <option value="PUBLISHED">Publicado</option>
                  <option value="ARCHIVED">Arquivado</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sortOrder">Ordem</Label>
                <Input
                  id="sortOrder"
                  name="sortOrder"
                  type="number"
                  min="0"
                  defaultValue={values.sortOrder}
                  aria-invalid={Boolean(state.fieldErrors?.sortOrder)}
                  className="border-white/10 bg-zinc-950/50 focus-visible:border-violet-500/60 focus-visible:ring-violet-500/20"
                />
                <FieldError errors={state.fieldErrors?.sortOrder} />
              </div>
              <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-white/5 bg-white/2.5 p-3">
                <input
                  name="featured"
                  type="checkbox"
                  defaultChecked={values.featured}
                  className="mt-0.5 size-4 accent-violet-600"
                />
                <span>
                  <span className="block text-sm font-medium text-zinc-200">
                    Projeto em destaque
                  </span>
                  <span className="mt-0.5 block text-xs leading-5 text-zinc-500">
                    Receberá maior evidência no portfólio.
                  </span>
                </span>
              </label>
            </CardContent>
          </Card>

          <Card className="border-violet-500/10 bg-zinc-900/70 shadow-lg shadow-black/10 ring-0">
            <CardHeader className="border-b border-white/5">
              <div className="flex items-center gap-2 text-violet-300">
                <ExternalLink className="size-4" />
                <CardTitle>Links</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <TextField
                label="Repositório"
                name="repositoryUrl"
                defaultValue={values.repositoryUrl}
                placeholder="https://github.com/..."
                errors={state.fieldErrors?.repositoryUrl}
              />
              <TextField
                label="Demonstração"
                name="demoUrl"
                defaultValue={values.demoUrl}
                placeholder="https://..."
                errors={state.fieldErrors?.demoUrl}
              />
            </CardContent>
          </Card>

          <Card className="border-violet-500/10 bg-zinc-900/70 shadow-lg shadow-black/10 ring-0">
            <CardHeader className="border-b border-white/5">
              <div className="flex items-center gap-2 text-violet-300">
                <CalendarDays className="size-4" />
                <CardTitle>Período</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="grid gap-5 sm:grid-cols-2 xl:grid-cols-1">
              <div className="space-y-2">
                <Label htmlFor="startedAt">Início</Label>
                <Input
                  id="startedAt"
                  name="startedAt"
                  type="date"
                  defaultValue={values.startedAt}
                  className="border-white/10 bg-zinc-950/50"
                />
                <FieldError errors={state.fieldErrors?.startedAt} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="finishedAt">Conclusão</Label>
                <Input
                  id="finishedAt"
                  name="finishedAt"
                  type="date"
                  defaultValue={values.finishedAt}
                  className="border-white/10 bg-zinc-950/50"
                />
                <FieldError errors={state.fieldErrors?.finishedAt} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="sticky bottom-4 flex flex-col-reverse gap-3 rounded-xl border border-white/10 bg-zinc-950/90 p-3 shadow-2xl shadow-black/30 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-end">
        <Button
          asChild
          type="button"
          variant="ghost"
          className="text-zinc-400 hover:bg-white/5 hover:text-white"
        >
          <Link href="/admin/projetos">Cancelar</Link>
        </Button>
        <ProjectSubmitButton editing={editing} />
      </div>
    </form>
  );
}

export function ProjectFormHeading({ editing }: { editing: boolean }) {
  return (
    <div className="mb-6 flex items-start gap-3">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-300 ring-1 ring-violet-500/20">
        <FileText className="size-5" />
      </span>
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-white">
          {editing ? "Editar projeto" : "Novo projeto"}
        </h2>
        <p className="mt-1 text-sm text-zinc-500">
          {editing
            ? "Atualize o conteúdo e as opções de publicação."
            : "Cadastre o conteúdo principal; imagens e stacks serão vinculadas depois."}
        </p>
      </div>
    </div>
  );
}
