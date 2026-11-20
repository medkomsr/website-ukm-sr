"use client";

import { useId } from "react";
import { Select } from "radix-ui";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import s from "./filter-select.module.scss";

export default function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  const id = useId();
  return (
    <div className={s.field}>
      <label htmlFor={id}>{label}</label>
      <Select.Root value={value} onValueChange={onChange}>
        <Select.Trigger id={id} className={s.trigger} aria-label={label}>
          <Select.Value />
          <Select.Icon>
            <ChevronDown size={15} />
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content className={s.menu} position="popper" sideOffset={8} collisionPadding={16}>
            <Select.ScrollUpButton className={s.scroll}>
              <ChevronUp size={16} />
            </Select.ScrollUpButton>
            <Select.Viewport className={s.options}>
              {options.map((option) => (
                <Select.Item key={option.value} value={option.value} className={s.option}>
                  <Select.ItemText>{option.label}</Select.ItemText>
                  <Select.ItemIndicator>
                    <Check size={15} />
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.Viewport>
            <Select.ScrollDownButton className={s.scroll}>
              <ChevronDown size={16} />
            </Select.ScrollDownButton>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  );
}
