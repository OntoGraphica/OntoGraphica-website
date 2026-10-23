import { BookOpenIcon } from "@phosphor-icons/react/dist/csr/BookOpen";
import { BrainIcon } from "@phosphor-icons/react/dist/csr/Brain";
import { BriefcaseIcon } from "@phosphor-icons/react/dist/csr/Briefcase";
import { BuildingsIcon } from "@phosphor-icons/react/dist/csr/Buildings";
import { ChartBarIcon } from "@phosphor-icons/react/dist/csr/ChartBar";
import { ChatCircleTextIcon } from "@phosphor-icons/react/dist/csr/ChatCircleText";
import { CheckCircleIcon } from "@phosphor-icons/react/dist/csr/CheckCircle";
import { CheckIcon } from "@phosphor-icons/react/dist/csr/Check";
import { ClockIcon } from "@phosphor-icons/react/dist/csr/Clock";
import { CodeIcon } from "@phosphor-icons/react/dist/csr/Code";
import { EyeIcon } from "@phosphor-icons/react/dist/csr/Eye";
import { GlobeHemisphereWestIcon } from "@phosphor-icons/react/dist/csr/GlobeHemisphereWest";
import { GraduationCapIcon } from "@phosphor-icons/react/dist/csr/GraduationCap";
import { InfoIcon } from "@phosphor-icons/react/dist/csr/Info";
import { LightbulbIcon } from "@phosphor-icons/react/dist/csr/Lightbulb";
import { LightningIcon } from "@phosphor-icons/react/dist/csr/Lightning";
import { ListIcon } from "@phosphor-icons/react/dist/csr/List";
import { LockSimpleIcon } from "@phosphor-icons/react/dist/csr/LockSimple";
import { PlayCircleIcon } from "@phosphor-icons/react/dist/csr/PlayCircle";
import { SealCheckIcon } from "@phosphor-icons/react/dist/csr/SealCheck";
import { StarIcon } from "@phosphor-icons/react/dist/csr/Star";
import { StudentIcon } from "@phosphor-icons/react/dist/csr/Student";
import { TargetIcon } from "@phosphor-icons/react/dist/csr/Target";
import { UsersThreeIcon } from "@phosphor-icons/react/dist/csr/UsersThree";
import { WarningCircleIcon } from "@phosphor-icons/react/dist/csr/WarningCircle";
import { XIcon } from "@phosphor-icons/react/dist/csr/X";
import type { Icon as PhosphorIcon } from "@phosphor-icons/react";

// One icon family (Phosphor), one weight, everywhere.
const icons = {
  ai: BrainIcon,
  badge: SealCheckIcon,
  bolt: LightningIcon,
  book: BookOpenIcon,
  briefcase: BriefcaseIcon,
  buildings: BuildingsIcon,
  cap: GraduationCapIcon,
  chart: ChartBarIcon,
  chat: ChatCircleTextIcon,
  check: CheckIcon,
  checkCircle: CheckCircleIcon,
  clock: ClockIcon,
  close: XIcon,
  code: CodeIcon,
  decision: LightbulbIcon,
  eye: EyeIcon,
  globe: GlobeHemisphereWestIcon,
  info: InfoIcon,
  lock: LockSimpleIcon,
  menu: ListIcon,
  play: PlayCircleIcon,
  star: StarIcon,
  student: StudentIcon,
  target: TargetIcon,
  team: UsersThreeIcon,
  warning: WarningCircleIcon,
} satisfies Record<string, PhosphorIcon>;

export type IconName = keyof typeof icons;

export function Icon({ name, size = 24, className = "" }: { name: IconName | string; size?: number; className?: string }) {
  const Glyph = icons[name as IconName] ?? InfoIcon;
  return <Glyph aria-hidden="true" size={size} weight="light" className={className} />;
}
