"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { saveCategory, deleteCategory } from "./actions";
import { Button } from "@/components/ui/button";
import { InlineDelete } from "@/components/ui/inline-delete";
import { Select } from "@/components/ui/select";
import { CATEGORY_ICON_NAMES, CategoryIcon } from "@/components/category-icon";
import type { Category, TransactionType } from "@/lib/types";

type FormValues = {
  name: string;
  type: TransactionType;
  icon: string;
};

const labelCls = "mb-1 block text-[13px] text-text-muted";
const inputCls =
  "w-full rounded-[var(--radius-sm)] border-[length:var(--border-w)] border-border bg-surface px-4 py-3 text-base outline-none focus:border-primary";

export function CategoryForm({
  category,
  onDone,
}: {
  category?: Category;
  onDone: () => void;
}) {
  const [serverError, setServerError] = useState("");

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      name: category?.name ?? "",
      type: category?.type ?? "expense",
      icon: category?.icon ?? "tag",
    },
  });

  const iconOptions = ["tag", ...CATEGORY_ICON_NAMES].map((n) => ({
    value: n,
    label: n,
  }));

  async function onSubmit(values: FormValues) {
    setServerError("");
    const res = await saveCategory({
      id: category?.id,
      name: values.name,
      type: values.type,
      icon: values.icon === "tag" ? null : values.icon,
    });
    if (res.error) {
      setServerError(res.error);
    } else {
      toast.success(category ? "Kategori diperbarui" : "Kategori ditambahkan");
      onDone();
    }
  }

  async function onDelete() {
    if (!category) return;
    setServerError("");
    const res = await deleteCategory(category.id);
    if (res.error) {
      setServerError(res.error);
    } else {
      toast.success("Kategori dihapus");
      onDone();
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className={labelCls}>Nama</label>
        <input
          autoFocus
          placeholder="mis. Kopi"
          className={inputCls}
          {...register("name", { required: "Nama kategori wajib diisi." })}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-danger">{errors.name.message}</p>
        )}
      </div>

      <Controller
        control={control}
        name="type"
        render={({ field }) => (
          <div className="grid grid-cols-2 gap-2">
            {(["expense", "income"] as const).map((t) => (
              <button
                type="button"
                key={t}
                onClick={() => field.onChange(t)}
                className={`rounded-[var(--radius-sm)] border-[length:var(--border-w)] border-border py-3 text-center text-[15px] font-medium ${
                  field.value === t ? "bg-primary text-primary-fg" : "bg-surface"
                }`}
              >
                {t === "expense" ? "Pengeluaran" : "Pemasukan"}
              </button>
            ))}
          </div>
        )}
      />

      <div>
        <label className={labelCls}>Ikon</label>
        <div className="flex items-center gap-3">
          <Controller
            control={control}
            name="icon"
            render={({ field }) => (
              <>
                <span className="flex size-11 shrink-0 items-center justify-center rounded-[var(--radius-sm)] border-[length:var(--border-w)] border-border bg-surface">
                  <CategoryIcon name={field.value === "tag" ? null : field.value} />
                </span>
                <div className="flex-1">
                  <Select
                    ariaLabel="Ikon"
                    value={field.value}
                    onValueChange={field.onChange}
                    options={iconOptions}
                  />
                </div>
              </>
            )}
          />
        </div>
      </div>

      {serverError && <p className="text-sm text-danger">{serverError}</p>}

      <div className="space-y-2">
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Menyimpan…" : "Simpan"}
        </Button>
        {category && (
          <InlineDelete
            onConfirm={onDelete}
            label="Hapus kategori"
          />
        )}
      </div>
    </form>
  );
}
