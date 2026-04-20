import React from "react";
import DocCard from "@theme/DocCard";

type ToolCardItem = {
  label: string;
  href: string;
  description: string;
};

type ToolCardGridProps = {
  items: ToolCardItem[];
  colClassName?: string;
};

export default function ToolCardGrid({
  items,
  colClassName = "col--3",
}: ToolCardGridProps) {
  return (
    <div className="row">
      {items.map((item) => (
        <div
          key={item.href}
          className={`col ${colClassName} margin-bottom--lg`}
        >
          <DocCard
            item={{
              type: "link",
              label: item.label,
              href: item.href,
              description: item.description,
            }}
          />
        </div>
      ))}
    </div>
  );
}
