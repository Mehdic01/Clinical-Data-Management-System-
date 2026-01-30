import type { ReactNode } from "react";

type PageContainerProps = {
  children: ReactNode;
  title?: string;
  description?: string;
  actions?: ReactNode;
};

export function PageContainer({
  children,
  title,
  description,
  actions,
}: PageContainerProps) {
  return (
    <div>
      {(title || actions) && (
        <div className="mb-6 flex items-center justify-between">
          <div>
            {title && <h1 className="text-2xl font-semibold">{title}</h1>}
            {description && (
              <p className="mt-1 text-sm text-zinc-500">{description}</p>
            )}
          </div>
          {actions && <div className="flex gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </div>
  );
}
