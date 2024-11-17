import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRust } from '@fortawesome/free-brands-svg-icons';
import { lusitana } from '@/app/ui/fonts';

export default function AcmeLogo() {
  return (

    <div
      className={`${lusitana.className} flex flex-row items-center leading-none text-white`}
    // style={{
    //   backgroundImage: 'url(/School-flag.jpg)', // 替换为您的图片路径
    //   //backgroundSize: 'cover', // 背景图片覆盖整个容器
    //   backgroundPosition: 'center', // 背景图片居中对齐
    //   backgroundSize: '100% 100%',
    //   backgroundRepeat: 'no-repeat',
    // }}
    >
      {/* <div
        className="absolute top-0 left-0 w-full h-full bg-cover bg-center "
        style={{
          backgroundImage: 'url(/School-flag.jpg)', // 替换为您的实际图片名
        }}
      /> */}
      <FontAwesomeIcon icon={faRust} className="h-12 w-12 mr-2" />
      <p className="text-[22px]">Crates Pro</p>


    </div>
  );
}


