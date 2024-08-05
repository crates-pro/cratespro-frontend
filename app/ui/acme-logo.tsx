import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRust } from '@fortawesome/free-brands-svg-icons';
import { lusitana } from '@/app/ui/fonts';

export default function AcmeLogo() {
  return (
    <div
      className={`${lusitana.className} flex flex-row items-center leading-none text-white`}
    >
      <FontAwesomeIcon icon={faRust} className="h-12 w-12 mr-2" />
      <p className="text-[22px]">Crates Pro</p>
    </div>
  );
}
