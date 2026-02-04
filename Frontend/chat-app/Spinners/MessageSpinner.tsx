import { Comment } from "react-loader-spinner";

export default function MessageSpinner() {
  return (
    <Comment
      visible={true}
      height='180'
      width='180'
      ariaLabel='comment-loading'
      wrapperStyle={{}}
      wrapperClass='comment-wrapper'
      color='#fff'
      backgroundColor='#F4442E'
    />
  );
}
