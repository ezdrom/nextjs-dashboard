import { EyeIcon, CircleStackIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';

const sizeStyles = {
  default: {
    stackIcon: 'h-6 w-6',
    eyeIcon: 'h-5 w-5',
    text: 'text-[44px]',
  },
  hero: {
    stackIcon: 'h-10 w-10 md:h-10 md:w-10',
    eyeIcon: 'h-1 w-1 md:h-2 md:w-2',
    text: 'text-3xl md:text-5xl',
  },
} as const;

export default function AcmeLogo({
  className = '',
  size = 'default',
}: {
  className?: string;
  size?: 'default' | 'hero';
}) {
  const styles = sizeStyles[size];
  return (
    <div
      className={`${lusitana.className} flex flex-row items-center gap-1 leading-none text-white md:gap-2 ${className}`.trim()}
    >
      <CircleStackIcon className={`${styles.stackIcon} shrink-0 rotate-[15deg]`} />
      <p className={styles.text}>Debth</p>
      <EyeIcon className={`${styles.eyeIcon} -ml-1 shrink-0 rotate-[15deg] md:-ml-2`} />
    </div>
  );
}