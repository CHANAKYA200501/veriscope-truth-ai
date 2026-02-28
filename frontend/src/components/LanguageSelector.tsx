import { Language, LANGUAGES } from "@/lib/i18n";
import { Globe } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LanguageSelectorProps {
  language: Language;
  onChange: (lang: Language) => void;
}

const LanguageSelector = ({ language, onChange }: LanguageSelectorProps) => {
  return (
    <div className="flex items-center gap-2">
      <Globe className="w-4 h-4 text-primary" />
      <Select value={language} onValueChange={(val) => onChange(val as Language)}>
        <SelectTrigger className="w-[180px] h-9 bg-secondary/50 border-border font-mono text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-background border-border max-h-[300px]">
          {LANGUAGES.map((lang) => (
            <SelectItem key={lang.code} value={lang.code} className="font-mono text-xs">
              {lang.native} ({lang.label})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default LanguageSelector;
