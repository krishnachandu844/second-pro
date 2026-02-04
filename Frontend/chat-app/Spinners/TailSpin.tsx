import { TailSpin } from "react-loader-spinner";

export default function Loader() {
  return (
    <TailSpin
      visible={true}
      height='50'
      width='50'
      color='#FFFFFF'
      ariaLabel='tail-spin-loading'
      radius='1'
      wrapperStyle={{}}
      wrapperClass=''
    />
  );
}
