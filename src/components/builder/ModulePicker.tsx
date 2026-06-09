"use client";

import { moduleRegistry } from "@/components/home/sectionRegistry";
import type { HomeSectionType } from "@/types/pageBuilder";
import { useHomepageBuilder } from "./HomepageBuilderProvider";

export function ModulePicker({ insertIndex, onClose }: { insertIndex: number; onClose: () => void }) {
  const builder = useHomepageBuilder();
  const entries = Object.entries(moduleRegistry) as [HomeSectionType, (typeof moduleRegistry)[HomeSectionType]][];

  return (
    <div className="builder-modal-backdrop">
      <div className="builder-modal builder-module-picker">
        <div className="builder-modal-title">
          <div>
            <p>插入位置 #{insertIndex}</p>
            <h2>选择模块类型</h2>
          </div>
          <button type="button" onClick={onClose}>关闭</button>
        </div>
        <div className="builder-module-grid">
          {entries.map(([type, item]) => (
            <button
              key={type}
              type="button"
              onClick={() => {
                builder.addSection(type);
              }}
            >
              {item.label}
              <span>{type}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
