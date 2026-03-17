"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import type { SiteConfig } from "@/db/schema/presence/site-config";
import { zodResolver } from "@hookform/resolvers/zod";
import { RotateCcw, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { CONFIG_DEFAULTS, resolveConfig } from "../defaults";
import { useUpdateConfig, useUploadConfigImage } from "../hooks";
import { updateConfigSchema, type UpdateConfigType } from "../validations";

interface ConfigFormProps {
  config: SiteConfig | null;
}

export function ConfigForm({ config }: ConfigFormProps) {
  const resolved = resolveConfig(config);
  const { mutate: save, isPending: isSaving } = useUpdateConfig();
  const { mutate: uploadBg, isPending: isUploadingBg } = useUploadConfigImage();
  const { mutate: uploadLoading, isPending: isUploadingLoading } = useUploadConfigImage();

  const bgInputRef = useRef<HTMLInputElement>(null);
  const loadingInputRef = useRef<HTMLInputElement>(null);
  const [localColor, setLocalColor] = useState(resolved.backgroundColorHex ?? "#7DB61C");

  const form = useForm<UpdateConfigType>({
    resolver: zodResolver(updateConfigSchema),
    defaultValues: {
      welcomeTitle: resolved.welcomeTitle,
      welcomeSubtitle: resolved.welcomeSubtitle,
      confirmButtonLabel: resolved.confirmButtonLabel,
      successTitle: resolved.successTitle,
      duplicateTitle: resolved.duplicateTitle,
      notFoundTitle: resolved.notFoundTitle,
      notFoundMessage: resolved.notFoundMessage,
      autoResetSeconds: resolved.autoResetSeconds,
    },
  });

  useEffect(() => {
    const r = resolveConfig(config);
    form.reset({
      welcomeTitle: r.welcomeTitle,
      welcomeSubtitle: r.welcomeSubtitle,
      confirmButtonLabel: r.confirmButtonLabel,
      successTitle: r.successTitle,
      duplicateTitle: r.duplicateTitle,
      notFoundTitle: r.notFoundTitle,
      notFoundMessage: r.notFoundMessage,
      autoResetSeconds: r.autoResetSeconds,
    });
    setLocalColor(r.backgroundColorHex ?? "#7DB61C");
  }, [config, form]);

  function onSubmit(data: UpdateConfigType) {
    save(data);
  }

  function handleImageUpload(
    field: "background" | "loading",
    e: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = e.target.files?.[0];
    if (!file) return;
    const mutate = field === "background" ? uploadBg : uploadLoading;
    mutate({ field, file });
    e.target.value = "";
  }

  function handleResetImage(field: "background" | "loading") {
    const key =
      field === "background" ? "backgroundImageUrl" : "loadingImageUrl";
    save({ [key]: null });
  }

  const bgSrc = resolved.backgroundImageUrl;
  const bgColor = resolved.backgroundColorHex;
  const hasCustomImage = config?.backgroundImageUrl != null;
  const loadingSrc = resolved.loadingImageUrl;

  return (
    <div className="space-y-8">
      {/* Textos */}
      <div className="space-y-1">
        <h2 className="text-base font-semibold">Textos da tela de check-in</h2>
        <p className="text-sm text-muted-foreground">
          Deixe em branco para usar o texto padrão do sistema.
        </p>
      </div>

      <form
        id="form-config"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Controller
            name="welcomeTitle"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor="welcomeTitle">Título de boas-vindas</FieldLabel>
                <Input
                  id="welcomeTitle"
                  placeholder={CONFIG_DEFAULTS.welcomeTitle}
                  {...field}
                />
                {fieldState.error && (
                  <FieldError>{fieldState.error.message}</FieldError>
                )}
              </Field>
            )}
          />

          <Controller
            name="welcomeSubtitle"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor="welcomeSubtitle">Subtítulo de boas-vindas</FieldLabel>
                <Input
                  id="welcomeSubtitle"
                  placeholder={CONFIG_DEFAULTS.welcomeSubtitle}
                  {...field}
                />
                {fieldState.error && (
                  <FieldError>{fieldState.error.message}</FieldError>
                )}
              </Field>
            )}
          />

          <Controller
            name="confirmButtonLabel"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor="confirmButtonLabel">Botão de confirmar</FieldLabel>
                <Input
                  id="confirmButtonLabel"
                  placeholder={CONFIG_DEFAULTS.confirmButtonLabel}
                  {...field}
                />
                {fieldState.error && (
                  <FieldError>{fieldState.error.message}</FieldError>
                )}
              </Field>
            )}
          />

          <Controller
            name="successTitle"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor="successTitle">Mensagem de sucesso</FieldLabel>
                <Input
                  id="successTitle"
                  placeholder={CONFIG_DEFAULTS.successTitle}
                  {...field}
                />
                {fieldState.error && (
                  <FieldError>{fieldState.error.message}</FieldError>
                )}
              </Field>
            )}
          />

          <Controller
            name="duplicateTitle"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor="duplicateTitle">Mensagem de duplicata</FieldLabel>
                <Input
                  id="duplicateTitle"
                  placeholder={CONFIG_DEFAULTS.duplicateTitle}
                  {...field}
                />
                {fieldState.error && (
                  <FieldError>{fieldState.error.message}</FieldError>
                )}
              </Field>
            )}
          />

          <Controller
            name="notFoundTitle"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor="notFoundTitle">Título — CPF não encontrado</FieldLabel>
                <Input
                  id="notFoundTitle"
                  placeholder={CONFIG_DEFAULTS.notFoundTitle}
                  {...field}
                />
                {fieldState.error && (
                  <FieldError>{fieldState.error.message}</FieldError>
                )}
              </Field>
            )}
          />

          <Controller
            name="autoResetSeconds"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor="autoResetSeconds">
                  Segundos para reiniciar (3–60)
                </FieldLabel>
                <Input
                  id="autoResetSeconds"
                  type="number"
                  min={3}
                  max={60}
                  placeholder={String(CONFIG_DEFAULTS.autoResetSeconds)}
                  {...field}
                />
                {fieldState.error && (
                  <FieldError>{fieldState.error.message}</FieldError>
                )}
              </Field>
            )}
          />
        </div>

        <Controller
          name="notFoundMessage"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor="notFoundMessage">
                Descrição — CPF não encontrado
              </FieldLabel>
              <Textarea
                id="notFoundMessage"
                placeholder={CONFIG_DEFAULTS.notFoundMessage}
                rows={2}
                {...field}
              />
              {fieldState.error && (
                <FieldError>{fieldState.error.message}</FieldError>
              )}
            </Field>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit" disabled={isSaving}>
            {isSaving ? <Spinner /> : "Salvar configurações"}
          </Button>
        </div>
      </form>

      <Separator />

      {/* Imagens e cores */}
      <div className="space-y-1">
        <h2 className="text-base font-semibold">Fundo e imagens</h2>
        <p className="text-sm text-muted-foreground">
          A imagem tem prioridade sobre a cor. JPEG, PNG, WebP ou GIF. Máximo 5 MB.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Background */}
        <div className="space-y-3">
          <p className="text-sm font-medium">Fundo do totem</p>

          {/* Preview */}
          <div
            className="border rounded-xl overflow-hidden aspect-[9/16] w-full max-w-[180px]"
            style={{ backgroundColor: hasCustomImage ? undefined : localColor }}
          >
            {hasCustomImage && (
              <img
                src={bgSrc}
                alt="Fundo atual"
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* Imagem */}
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Imagem</p>
            <div className="flex flex-wrap gap-2">
              <input
                ref={bgInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageUpload("background", e)}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isUploadingBg}
                onClick={() => bgInputRef.current?.click()}
              >
                {isUploadingBg ? <Spinner /> : <Upload className="h-4 w-4" />}
                {hasCustomImage ? "Trocar imagem" : "Enviar imagem"}
              </Button>
              {hasCustomImage && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={isUploadingBg}
                  onClick={() => handleResetImage("background")}
                >
                  <RotateCcw className="h-4 w-4" />
                  Remover imagem
                </Button>
              )}
            </div>
          </div>

          {/* Cor sólida */}
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
              Cor sólida{" "}
              {hasCustomImage && (
                <span className="normal-case">(sobreposta pela imagem)</span>
              )}
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              <input
                type="color"
                value={localColor}
                className="h-9 w-14 cursor-pointer rounded border p-0.5"
                onChange={(e) => setLocalColor(e.target.value)}
              />
              <span className="text-sm text-muted-foreground font-mono w-20">
                {localColor}
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isSaving}
                onClick={() => save({ backgroundColorHex: localColor })}
              >
                {isSaving ? <Spinner /> : "Aplicar cor"}
              </Button>
              {bgColor && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => save({ backgroundColorHex: null })}
                >
                  <RotateCcw className="h-4 w-4" />
                  Remover
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Loading */}
        <div className="space-y-3">
          <p className="text-sm font-medium">Imagem de loading</p>
          <div className="border rounded-xl overflow-hidden aspect-square w-full max-w-[180px] bg-muted flex items-center justify-center">
            <img
              src={loadingSrc}
              alt="Loading atual"
              className="w-24 h-24 object-contain"
            />
          </div>
          <div className="flex gap-2">
            <input
              ref={loadingInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImageUpload("loading", e)}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isUploadingLoading}
              onClick={() => loadingInputRef.current?.click()}
            >
              {isUploadingLoading ? <Spinner /> : <Upload className="h-4 w-4" />}
              {config?.loadingImageUrl ? "Trocar imagem" : "Enviar imagem"}
            </Button>
            {config?.loadingImageUrl && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={isUploadingLoading}
                onClick={() => handleResetImage("loading")}
              >
                <RotateCcw className="h-4 w-4" />
                Usar padrão
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
