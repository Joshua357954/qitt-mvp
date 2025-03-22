"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function Dropdown({
  label,
  dropdownItems,
  onChange,
  value,
  placeholder,
}) {
  return (
    <div className="w-full">
      <label className="block text-sm text-gray-700 font-bold">{label}</label>
      <Select onValueChange={onChange} defaultValue={value}>
        <SelectTrigger>
          <SelectValue placeholder={`${label}`} />
        </SelectTrigger>
        <SelectContent>
          {dropdownItems.map((item, index) => (
            <SelectItem key={index} value={item}>
              {item}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
